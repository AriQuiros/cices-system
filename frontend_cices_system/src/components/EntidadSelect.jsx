import CreatableSelect from "react-select/creatable";
import { useEntidades } from "../hooks/proyectos/useEntidades";
import {useState} from "react";

export default function EntidadSelect({
                                          tipo,
                                          value,
                                          onChange,
                                          placeholder,
                                          disabled,
                                          maxLength = 252,
                                            required
                                      }) {
    const [inputValue, setInputValue] = useState("");
    const { getOptionsByTipo } = useEntidades();

    const options = getOptionsByTipo(tipo);

    const manejarEntidad = (option) => {
        if (!option) return { nombre: "" };

        // Si option tiene tipo (seleccionada de la lista)
        if (option.tipo) {
            return {
                id: option.value,
                nombre: option.label,
                tipo: option.tipo
            };
        }

        const entidadBase = options[0]; // toma la primera entidad del mismo tipo
        return {
            id: null,
            nombre: option.label,
            tipo: entidadBase?.tipo || { valor: tipo } // si no hay, asigna tipo default
        };
    };

    return (
        <CreatableSelect
            required={required}
            options={options}
            value={
                value?.nombre
                    ? {
                        value: value.id || value.nombre,
                        label: value.nombre
                    }
                    : null
            }
            onChange={(option) => onChange(manejarEntidad(option))}
            placeholder={placeholder}
            inputValue={inputValue}
            onInputChange={(val) => {
                if (val.length <= maxLength) {
                    setInputValue(val);
                }
            }}
            isClearable
            isDisabled={disabled}
        />
    );
}