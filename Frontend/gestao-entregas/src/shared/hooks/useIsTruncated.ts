import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

export function useIsTruncated<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [isTruncated, setIsTruncated] = useState(false);
    const lastMeasurement = useRef<{
        clientWidth: number;
        scrollWidth: number;
    }>(null);

    const check = useCallback(() => {
        const el = ref.current;
        if (!el) return;

        const { scrollWidth, clientWidth } = el;

        if (
            lastMeasurement.current?.clientWidth === clientWidth &&
            lastMeasurement.current?.scrollWidth === scrollWidth
        ) {
            return;
        }

        lastMeasurement.current = { scrollWidth, clientWidth };

        setIsTruncated(scrollWidth > clientWidth);
    }, []);

    useLayoutEffect(() => {
        check();
    });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new ResizeObserver(check);
        observer.observe(el);
        return () => observer.disconnect();
    }, [check]);

    return { ref, isTruncated };
}
