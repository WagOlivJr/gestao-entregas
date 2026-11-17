import { useEffect, useRef } from "react";

export function useScrollIndicator<T extends HTMLElement>() {
    const ref = useRef<T | null>(null);
    const ticking = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const update = () => {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const percent =
                scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

            el.style.setProperty("--scroll-indicator-width", `${percent}%`);
            ticking.current = false;
        };

        const onScroll = () => {
            if (ticking.current) return;
            ticking.current = true;
            requestAnimationFrame(update);
        };

        update();

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return ref;
}
