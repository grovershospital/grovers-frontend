import { forwardRef } from "react";

type FormFieldProps = {
    label: string;
    id: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    autoComplete?: string;
    minLength?: number;
};

// Wrapped in forwardRef so the parent form can focus a specific field
const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    function FormField(
        {
            label,
            id,
            type = "text",
            value,
            onChange,
            placeholder,
            required,
            autoComplete,
            minLength,
        },
        ref,
    ) {
        return (
            <div>
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-brand-ink"
                >
                    {label}
                </label>
                <input
                    ref={ref}
                    id={id}
                    name={id}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    required={required}
                    autoComplete={autoComplete}
                    minLength={minLength}
                    className="mt-2 w-full rounded-lg border border-brand-ink/40 bg-transparent px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                />
            </div>
        );
    },
);

export default FormField;