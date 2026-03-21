import { useEffect, useState } from "react";
import Select from "react-select";
import { cargarProyectos } from "../services/ProyectoService.jsx";
import "./BusquedaProyecto.css"

const BuscadorProyecto = ({ token, user, principal = false, onSelect }) => {

    const [proyectos, setProyectos] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        cargarProyectos(token, user, principal).then(res => setProyectos(res || []));
    }, [principal, token, user]);

    const options = proyectos.map(p => ({
        value: p,
        label: `${p.codigoProyecto} - ${p.nombreProyecto}`
    }));

    const handleChange = (option) => {

        setSelected(option);

        if (onSelect) {
            onSelect(option?.value || null);
        }
    };

    return (

        <div className="buscador-proyecto">
            <h3>Buscar proyecto</h3>

            <Select
                className="buscador-select"
                classNamePrefix="buscador"
                placeholder="Buscar proyecto..."
                value={selected}
                options={options}
                isSearchable
                isClearable
                noOptionsMessage={() => "No hay coincidencias"}
                onChange={handleChange}
                onInputChange={(inputValue, { action }) => {
                    if (action === "input-change") {
                        setSelected(null);

                        if (onSelect) {
                            onSelect(null);
                        }
                    }

                    return inputValue;
                }}
            />

            {selected && (
                <div className="buscador-info">
                    <p>
                        <b>Fecha Inicio:</b> {selected.value.fechaInicio} |{" "}
                        <b>Fecha finalización:</b> {selected.value.fechaFinalizacion}
                        <br />
                        <br />
                    </p>
                </div>
            )}
        </div>
    );
};


export default BuscadorProyecto;