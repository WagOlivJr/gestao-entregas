import test from 'node:test';
import assert from 'node:assert/strict';
import axios, { AxiosError } from 'axios';
import api, { transport, refreshSession } from '../src/services/api.ts';
import { HttpError } from '../src/services/HttpError.ts';
import { useAuthStore } from '../src/stores/authStore.ts';

const session = (token = 'old') => ({ access_token: token, user: { id: 1, username: 'user' }, expires_in: 300 });
const response = (config, data, status = 200) => ({ config, data, status, statusText: '', headers: {} });
const failure = (config, status, data = {}) => new AxiosError('HTTP failure', 'ERR_BAD_RESPONSE', config, null, response(config, data, status));
const reset = () => useAuthStore.getState().setSession(session());

test('HttpError distingue validação, negócio, rede e timeout', () => {
    const validation = new HttpError(['Nome obrigatório', 'Email inválido'], { status: 422 }, { fields: [] });
    assert.equal(validation.message, 'Nome obrigatório;\nEmail inválido.');
    assert.equal(validation.isValidationError, true);
    assert.equal(validation.isBusinessError, false);
    assert.equal(new HttpError('Falha', { status: 422 }).isBusinessError, true);
    assert.equal(new HttpError('Rede').isTimeout, false);
    assert.equal(new HttpError('Timeout', null, null, 'timeout').isTimeout, true);
});

test('401 concorrentes compartilham refresh e repetem com o token novo', async () => {
    reset();
    let refreshes = 0;
    transport.defaults.adapter = async (config) => {
        if (config.url === '/auth/refresh') {
            refreshes++;
            assert.equal(config.withCredentials, true);
            assert.equal(config.headers.has('Authorization'), false);
            await new Promise(resolve => setTimeout(resolve, 20));
            return response(config, session('new'));
        }
        if (config.headers.get('Authorization') === 'Bearer old') throw failure(config, 401);
        assert.equal(config.headers.get('Authorization'), 'Bearer new');
        return response(config, ['ok']);
    };
    assert.deepEqual(await Promise.all([api.get('/a'), api.get('/b')]), [['ok'], ['ok']]);
    assert.equal(refreshes, 1);
});

test('401 no refresh encerra sessão e preserva status do erro', async () => {
    reset();
    transport.defaults.adapter = async (config) => { throw failure(config, 401); };
    await assert.rejects(api.get('/private'), error => error instanceof HttpError && error.status === 401);
    assert.equal(useAuthStore.getState().isAuthenticated, false);
});

test('refresh tardio não restaura uma sessão encerrada', async () => {
    reset();
    let release;
    transport.defaults.adapter = config => new Promise(resolve => { release = () => resolve(response(config, session('new'))); });
    const pending = refreshSession();
    useAuthStore.getState().clearSession();
    release();
    await pending;
    assert.equal(useAuthStore.getState().token, '');
});

test('POST sem chave não repete; com chave repete preservando a chave', async () => {
    reset();
    let calls = 0;
    transport.defaults.adapter = async config => { calls++; throw failure(config, 503); };
    await assert.rejects(api.post('/orders', {}), HttpError);
    assert.equal(calls, 1);
    calls = 0;
    transport.defaults.adapter = async config => {
        calls++;
        assert.equal(config.headers.get('Idempotency-Key'), 'operation-1');
        if (calls === 1) throw failure(config, 503);
        return response(config, { id: 1 });
    };
    assert.deepEqual(await api.post('/orders', {}, { idempotencyKey: 'operation-1' }), { id: 1 });
    assert.equal(calls, 2);
});

test('cancelamento não é timeout e não dispara retry', async () => {
    reset();
    let calls = 0;
    transport.defaults.adapter = async () => { calls++; throw new axios.CanceledError(); };
    await assert.rejects(api.get('/users'), axios.isCancel);
    assert.equal(calls, 1);
});

test('falha transitória do refresh preserva sessão; segundo 401 não cria loop', async () => {
    reset();
    transport.defaults.adapter = async config => { throw failure(config, 503); };
    await assert.rejects(refreshSession(), HttpError);
    assert.equal(useAuthStore.getState().token, 'old');
    let calls = 0;
    transport.defaults.adapter = async config => {
        calls++;
        if (config.url === '/auth/refresh') return response(config, session('new'));
        throw failure(config, 401);
    };
    await assert.rejects(api.get('/private'), error => error.status === 401);
    assert.equal(calls, 3);
});
