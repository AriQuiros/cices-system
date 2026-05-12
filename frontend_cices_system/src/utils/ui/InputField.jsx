import {useEffect, useRef, useState} from "react";
import "../../estilos/form.css"

export default function InputField({
                                       label, placeholder, name, value, onChange,
                                       rules = [], type = "text", required,
                                       min, max, step, minLength, maxLength, pattern,
                                       className = "", ...props
                                   }){

    const [error, setError] = useState("");
    const [touched, setTouched] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {

        if (inputRef.current && touched) {
            validate(inputRef.current);
        }

    }, [value, rules, touched]);

    const validate = (input, showError = true) => {

        const v = input.value;

        for (let rule of rules) {

            const err = rule(v);

            if (err) {

                input.setCustomValidity(err);

                if (showError) {
                    setError(err);
                }

                return err;
            }
        }

        input.setCustomValidity("");
        setError("");

        return "";
    };

    const handleChange = (e) => {

        if (touched) {
            validate(e.target);
        }

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
                ref={inputRef}
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                required={required}
                min={min}
                max={max}
                step={step}
                minLength={minLength}
                maxLength={maxLength}
                //pattern={pattern}
                onChange={handleChange}
                onInvalid={handleInvalid}
                onBlur={(e) => {
                    setTouched(true);
                    validate(e.target);
                }}
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