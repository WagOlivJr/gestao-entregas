import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

const TRUNCATABLE_SELECTOR = ".truncatable-cell";

export function useIsTruncated<T extends HTMLElement>(contentDep?: unknown) {
    const ref = useRef<T>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    const check = useCallback(() => {
        const el = ref.current;
        if (!el) return;

        const measuredEl =
            el.querySelector<HTMLElement>(TRUNCATABLE_SELECTOR) ?? el;
        setIsTruncated(measuredEl.scrollWidth > el.clientWidth);
    }, []);

    useLayoutEffect(() => {
        check();
    }, [check, contentDep]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new ResizeObserver(check);
        observer.observe(el);
        return () => observer.disconnect();
    }, [check]);

    return { ref, isTruncated };
}
