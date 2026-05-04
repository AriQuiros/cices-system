// src/components/EntidadSelect.jsx
import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { useEntidades } from "../../hooks/referenceDataHooks/useEntidades.js";
import { useDebounce } from "../../hooks/useDebounce.js";

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
    const textoBuscado = useDebounce(inputValue, 350);

    const { data: raw, isLoading } = useEntidades(textoBuscado, tipo);

    // El nuevo hook devuelve Page o lista directa — normalizamos
    const lista = raw?.data?.content ?? raw?.data ?? raw?.content ?? raw ?? [];

    const options = (Array.isArray(lista) ? lista : []).map(e => ({
        value: e.id,
        label: e.nombre,
        tipo:  e.tipo
    }));

    const selectedOption = options.find(opt => opt.value === value?.id)
        || (value?.nombre
            ? { value: value.id || value.nombre, label: value.nombre }
            : null);

    const manejarEntidad = (option) => {
        if (!option) return { nombre: "" };

        // Opción existente seleccionada de la lista
        if (option.tipo) {
            return {
                id:     option.value,
                nombre: option.label,
                tipo:   option.tipo
            };
        }

        // Opción nueva creada por el usuario (CreatableSelect)
        return {
            id:     null,
            nombre: option.label,
            tipo:   { valor: tipo }
        };
    };

    return (
        <CreatableSelect
            required={required}
            isDisabled={disabled}
            isLoading={isLoading}
            isClearable
            options={options}
            value={selectedOption}
            inputValue={inputValue}
            onInputChange={(val, { action }) => {
                if (action === "input-change" && val.length <= maxLength) {
                    setInputValue(val);
                }

                if (action === "menu-close") {
                    setInputValue("");
                }
            }}
            onChange={opt => {
                setInputValue("");
                onChange(manejarEntidad(opt));
            }}
            placeholder={placeholder}
            filterOption={() => true}  // el filtrado lo hace el backend
            noOptionsMessage={() =>
                textoBuscado.length === 0 ? "Buscar" : "Sin resultados"
            }
            loadingMessage={() => "Buscando..."}
            formatCreateLabel={val => `Usar "${val}"`}
        />
    );
}