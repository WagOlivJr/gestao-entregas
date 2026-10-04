import { readFile } from 'node:fs/promises';
import ts from 'typescript';

export async function resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('.') && context.parentURL && !/\.[a-z]+$/i.test(specifier)) {
        return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
    if (url.endsWith('.ts')) {
        const source = await readFile(new URL(url), 'utf8');
        return { format: 'module', shortCircuit: true, source: ts.transpileModule(source, {
            compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 },
        }).outputText };
    }
    return nextLoad(url, context);
}
