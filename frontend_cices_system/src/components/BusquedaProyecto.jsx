import { useEffect, useState } from "react";
import Select from "react-select";
import { cargarProyectos } from "../services/ProyectoService.jsx";

const BuscadorProyecto = ({ token, onSelect }) => {

    const [proyectos, setProyectos] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        cargarProyectos(token, true).then(res => setProyectos(res || []));
    }, [token]);

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

        <div>
            <h3>Buscar proyecto</h3>
            <Select
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

                <div>
                    <p>
                        <b>Fecha Inicio:</b> {selected.value.fechaInicio} |  <b>Fecha finalización:</b> {selected.value.fechaFinalizacion}
                        <br/><br/>
                    </p>

                </div>

            )}

        </div>

    );
};


export default BuscadorProyecto;