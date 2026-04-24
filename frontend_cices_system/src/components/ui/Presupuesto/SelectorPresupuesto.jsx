import Select from "react-select";
import {useEffect, useState} from "react";
import {obtenerAnio} from "../../../utils/formatoFecha.js";

const SelectorPresupuesto = ({
                                 presupuestos,
                                 onSelect,
                                 loading,
                                 onBuscar
                             }) => {

    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            onBuscar(inputValue);
        }, 500);

        return () => clearTimeout(timeout);
    }, [inputValue]);

    const options = presupuestos.map(p => ({
        value: p.id,
        label: p.descripcion
            ? `${p.categoria} — ${obtenerAnio(p.fechaAsignacion)} — ${p.descripcion}`
            : `${p.categoria} — ${obtenerAnio(p.fechaAsignacion)}`
    }));

    return (
        <div className="gestion-gastos-select">
            <Select
                placeholder="Buscar presupuesto..."
                options={options}
                isSearchable
                isClearable
                isLoading={loading}
                inputValue={inputValue}
                noOptionsMessage={() => "No hay coincidencias"}

                onChange={(option) => {
                    onSelect(option?.value || null);
                }}

                onInputChange={(value, { action }) => {
                    if (action === "input-change") {
                        setInputValue(value); // SOLO esto
                    }
                }}
            />
        </div>
    );
};

export default SelectorPresupuesto;