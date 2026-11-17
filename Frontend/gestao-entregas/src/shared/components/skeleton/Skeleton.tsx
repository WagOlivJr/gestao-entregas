import "./Skeleton.css";

export type SkeletonElementConfig = {
    width?: string;
    height?: string;
};

export type SkeletonSectionConfig = {
    title?: boolean | SkeletonElementConfig;
    lines?: Array<string | SkeletonElementConfig>;
    className?: string;
};

export type SkeletonProps = {
    sections: SkeletonSectionConfig[];

    ariaLabel?: string;
    ariaBusy?: boolean;
    role?: string;

    containerClassName?: string;
    contentClassName?: string;
    sectionClassName?: string;
};

export function Skeleton({
    sections,
    ariaLabel = "Carregando",
    ariaBusy = true,
    role = "status",
    containerClassName = "modal__body modal__body--skeleton",
    contentClassName = "modal__main-content",
    sectionClassName = "modal__section",
}: SkeletonProps) {
    return (
        <div
            className={containerClassName}
            role={role}
            aria-busy={ariaBusy}
            aria-label={ariaLabel}
        >
            <div className={contentClassName}>
                {sections.map((section, sectionIndex) => (
                    <section
                        key={sectionIndex}
                        className={[sectionClassName, section.className]
                            .filter(Boolean)
                            .join(" ")}
                    >
                        {section.title && (
                            <SkeletonTitle
                                {...(typeof section.title === "object"
                                    ? section.title
                                    : {})}
                            />
                        )}

                        {section.lines?.map((line, lineIndex) => {
                            const config =
                                typeof line === "string"
                                    ? { width: line }
                                    : line;

                            return (
                                <SkeletonLine
                                    key={lineIndex}
                                    width={config.width}
                                    height={config.height}
                                />
                            );
                        })}
                    </section>
                ))}
            </div>
        </div>
    );
}

function SkeletonTitle({ width, height }: SkeletonElementConfig) {
    return (
        <div
            className="skeleton skeleton--title"
            style={{ width, height }}
            aria-hidden="true"
        />
    );
}

function SkeletonLine({ width, height }: SkeletonElementConfig) {
    return (
        <div
            className="skeleton skeleton--line"
            style={{ width, height }}
            aria-hidden="true"
        />
    );
}
