import { useState } from "react";

export default function InputField({
                                       label,
                                       placeholder,
                                       name,
                                       value,
                                       onChange,
                                       rules = [],
                                       type = "text",
                                       required,
                                       min,
                                       max,
                                       minLength,
                                       maxLength,
                                       pattern,
                                       className = "",
                                       ...props
                                   }) {

    const [error, setError] = useState("");

    const validate = (input) => {

        const v = input.value;

        // validadores personalizados
        for (let rule of rules) {

            const err = rule(v);

            if (err) {
                input.setCustomValidity(err);
                setError(err);
                return;
            }
        }

        // limpiar error
        input.setCustomValidity("");
        setError("");
    };

    const handleChange = (e) => {

        validate(e.target);
        onChange(e);
    };

    const handleInvalid = (e) => {

        validate(e.target);
    };

    return (

        <div className="mb-3">

            {label && (
                <label className="block text-sm font-medium mb-1">
                    {label}
                </label>
            )}

            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                required={required}
                min={min}
                max={max}
                minLength={minLength}
                maxLength={maxLength}
                pattern={pattern}
                onChange={handleChange}
                onInvalid={handleInvalid}
                onBlur={(e) => validate(e.target)}
                className={`w-full border rounded px-3 py-2 
        ${error ? "border-red-500 focus:border-red-500" : "border-gray-300"}
        ${className}`}
                {...props}
            />

            {error && (
                <p className="text-red-500 text-sm mt-1">
                    {error}
                </p>
            )}

        </div>
    );
}