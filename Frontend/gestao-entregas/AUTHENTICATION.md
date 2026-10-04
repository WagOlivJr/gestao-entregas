# Autenticação e chamadas HTTP

A separação da SPA vanilla continua válida: componentes/hooks cuidam da interface,
services descrevem operações do domínio e o cliente HTTP cuida do transporte.
Código sem JSX fica em `.ts`; componentes ficam em `.tsx`.

- `src/services/HttpError.ts`: erros HTTP, validação, negócio, rede e timeout.
- `src/services/api.ts`: Axios, Bearer atualizado por requisição, timeout, cancelamento,
  refresh compartilhado e no máximo uma repetição transitória.
- `src/services/authService.ts`: login, restauração e logout.
- `src/stores/authStore.ts`: estado reativo via Zustand, sem dependência dos services.
- `src/services/usersService.ts`: exemplo de service de domínio.
- `src/components/RequireAuth.tsx`: restauração da sessão e redirecionamento ao login.

O cliente retorna o corpo diretamente: `await api.get<User[]>("/users/admin")`.
Não use `.data` no resultado. Para criar outros services:

```ts
export const productsService = {
    list: (signal?: AbortSignal) => api.get<Product[]>("/products", { signal }),
    create: (product: NewProduct) => api.post<Product>("/products", product),
};
```

No React, assine apenas o estado necessário:

```tsx
const user = useAuthStore((state) => state.user);
```

Fora do React, use `useAuthStore.getState()`. O token fica somente em memória.
O refresh usa o cookie do backend com `withCredentials: true`; login e logout também.
O backend precisa permitir a origem do frontend com credenciais no CORS e configurar
o cookie para o ambiente usado. Não é necessário ler o cookie HttpOnly no JavaScript.

Copie `.env.example` para `.env.local` para alterar `VITE_API_BASE_URL`.
Os contratos assumidos são POST `/auth/login` com `{ username, password }`,
POST `/auth/refresh`, POST `/auth/logout` e GET `/users/admin`.
Login e refresh devem retornar `{ access_token, user, expires_in }`.
Ajuste `src/types/auth.ts` e `src/entities/User.ts` ao contrato real do backend.
Datas JSON são strings; converta com `new Date(...)` quando necessário.
`expiresIn` é armazenado como metadado; a renovação ocorre ao receber 401.

Login e Sobre são públicos. As outras rotas passam pelo `RequireAuth` em `App.tsx`.
O endereço de retorno fica no estado do React Router. A autorização por perfil
continua sendo responsabilidade do backend; o guard verifica apenas a sessão.

GET/HEAD/OPTIONS/PUT/DELETE podem repetir uma vez após 500+, 429, rede ou timeout.
POST/PATCH só repetem se `idempotencyKey` ou `Idempotency-Key` for informado e o
backend garantir deduplicação. A mesma chave é preservada na repetição.
Use `{ retry: false }` para desabilitar. Login, logout e refresh não repetem
automaticamente falhas transitórias. Após um refresh bem-sucedido, a requisição
original que recebeu 401 é refeita uma vez, independentemente desse retry.
Cancelamentos permanecem cancelamentos do Axios, sem refresh/retry.

`HttpError.fields` usa `unknown[]` até o formato dos erros de campo ser confirmado.
Os componentes podem distinguir `isValidationError`, `isBusinessError`, `isNotFound`,
`isTimeout` e `isRetryable`. Não exiba `detail` técnico indiscriminadamente.

Um 401 no refresh limpa a sessão; falhas de rede/servidor preservam o estado e
permitem nova tentativa. Logout entre abas não retransmite a mensagem recebida.
Respostas tardias de refresh não restauram uma sessão encerrada localmente.
O compartilhamento de refresh vale por aba, não entre abas; rotação de cookies
simultânea entre abas depende do comportamento do backend.
Se o logout remoto falhar, a interface avisa e permite tentar novamente, pois o
cookie pode continuar válido mesmo após a limpeza do estado local.

Execute `npm test`, `npm run build` e `npm run lint`.
Os testes usam um adapter Axios simulado, sem acessar ou alterar dados do servidor.
