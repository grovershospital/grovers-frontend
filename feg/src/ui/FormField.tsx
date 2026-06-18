import {forwardRef, useState} from "react";
import {Eye, EyeOff} from "lucide-react";

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
        const isPassword = type === "password";
        const [revealed, setRevealed] = useState(false);

        // For password fields, swap the actual input type based on toggle state.
        // Non-password fields just use the type as-is.
        const inputType = isPassword ? (revealed ? "text" : "password") : type;

        return (
            <div>
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-brand-ink"
                >
                    {label}
                </label>
                <div className="relative mt-2">
                    <input
                        ref={ref}
                        id={id}
                        name={id}
                        type={inputType}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        required={required}
                        autoComplete={autoComplete}
                        minLength={minLength}
                        className={`w-full rounded-lg border border-brand-ink/40 bg-transparent py-3 pl-4 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue ${
                            isPassword ? "pr-12" : "pr-4"
                        }`}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            // onMouseDown preventDefault keeps focus on the input when the
                            // user taps the toggle — they can reveal/hide mid-typing without
                            // the input losing focus.
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setRevealed((r) => !r)}
                            aria-label={revealed ? "Hide password" : "Show password"}
                            aria-pressed={revealed}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-brand-ink/50 transition-colors hover:text-brand-ink focus:outline-none focus-visible:text-brand-blue"
                        >
                            {revealed ? (
                                <EyeOff className="h-5 w-5" aria-hidden="true"/>
                            ) : (
                                <Eye className="h-5 w-5" aria-hidden="true"/>
                            )}
                        </button>
                    )}
                </div>
            </div>
        );
    },
);

export default FormField;