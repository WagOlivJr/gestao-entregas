import { useEffect, useRef, useState, type SubmitEvent } from "react";
import "./Form.css";
import { FormButtons } from "./form-buttons/FormButtons";

export interface FormProps {
    title: string;
    fieldsConfig: InputFieldProps[];
    onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void> | void;
    onCancel: () => void;
    className?: string;
    submitting?: boolean;
    error?: string | null;
}

export function Form({
    title,
    fieldsConfig,
    submitting,
    onCancel,
    onSubmit,
    className,
    error,
}: FormProps) {
    const formContainerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [isReasonFieldVisible, setIsReasonFieldVisible] = useState(false);

    const onCancelRef = useRef(onCancel);
    onCancelRef.current = onCancel;

    const onStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        setIsReasonFieldVisible(newStatus === "inactive");
    };

    useEffect(() => {
        const handleEscapeKeydown = (event: KeyboardEvent) =>
            event.key === "Escape" && onCancel();

        const handleClickOutside = (event: MouseEvent) =>
            !formContainerRef.current?.contains(event.target as Node) &&
            onCancel();

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKeydown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKeydown);
        };
    }, []);

    return (
        <>
            <div className="form-overlay active"></div>
            <div
                ref={formContainerRef}
                className={`new-item-form ${className}`}
            >
                <h3 className="form-title">{title}</h3>
                <form ref={formRef} onSubmit={onSubmit} className={className}>
                    {fieldsConfig.map((field) => (
                        <InputField
                            key={field.id}
                            {...field}
                            formRef={formRef}
                            visible={isReasonFieldVisible}
                            onStatusChange={
                                field.name === "status"
                                    ? onStatusChange
                                    : undefined
                            }
                        />
                    ))}
                    {error && <div className="form-error">{error}</div>}
                    <FormButtons onCancel={onCancel} submitting={submitting} />
                </form>
            </div>
        </>
    );
}

interface OptionItem {
    value: string;
    label?: string;
}

export interface InputFieldProps {
    id?: string;
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    type: string;
    options?: OptionItem[];
    defaultValue?: string;
    disabled?: boolean;
    formRef?: React.RefObject<HTMLFormElement | null>;
    visible?: boolean;
    onStatusChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function InputField(props: InputFieldProps) {
    const { formRef, label, onStatusChange, visible, ...restProps } = props;

    if (props.type === "select") {
        return (
            <div className="form-field">
                <label
                    htmlFor={props.id}
                    className="form-field_label flex-label"
                >
                    {label}
                    <select onChange={onStatusChange} {...restProps}>
                        {props.options?.map((op) => (
                            <option key={op.value} value={op.value}>
                                {op.label ?? op.value}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        );
    }

    if (props.type === "textarea") {
        const handleKeyDown = (
            event: React.KeyboardEvent<HTMLTextAreaElement>,
        ) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                props.formRef?.current?.requestSubmit?.();
            }
        };

        if (props.name === "deactivationReason" && !visible) {
            return null;
        }

        return (
            <div className="form-field">
                <label htmlFor={props.id} className="form-field_label">
                    {label}
                    <textarea {...restProps} onKeyDown={handleKeyDown} />
                </label>
            </div>
        );
    }

    return (
        <div className="form-field">
            <label htmlFor={props.id} className="form-field_label">
                {label}
                <input {...restProps} />
            </label>
        </div>
    );
}
