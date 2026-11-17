import { useScrollIndicator } from "../../hooks/useScrollIndicator";
import "./ScrollIndicator.css";

export function ScrollIndicator() {
    const ref = useScrollIndicator<HTMLDivElement>();
    return (
        <div className="scroll-indicator-container">
            <div ref={ref} className="scroll-indicator"></div>
        </div>
    );
}
