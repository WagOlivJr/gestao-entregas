import {
    useEffect,
    useRef,
    type DependencyList,
    type EffectCallback,
} from "react";

export function useUpdateEffect(effect: EffectCallback, deps: DependencyList) {
    const previousDepsRef = useRef<DependencyList | null>(null);

    useEffect(() => {
        const previousDep = previousDepsRef.current;
        previousDepsRef.current = deps;

        if (previousDep === null) return;

        const hasChanged =
            deps.length !== previousDep?.length ||
            deps.some((dep, index) => !Object.is(dep, previousDep[index]));

        if (!hasChanged) return;

        return effect();
    }, deps);
}
