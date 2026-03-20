import { useProyecto } from "../../../context/proyectoCtx/UseProyecto.jsx";
import EntidadSelect from "../../../components/EntidadSelect.jsx";

function ProyectoEntidades({editable}) {

    const { proyecto, setByPath, addByPath, removeByPath } = useProyecto();

    const config = [
        {
            key: "instituciones",
            label: "Instituciones Participantes",
            tipo: "INSTITUCION"
        },
        {
            key: "unidades",
            label: "Unidades participantes",
            tipo: "UNIDAD"
        },
        {
            key: "sitios",
            label: "Sitios de investigación",
            tipo: "SITIO"
        }
    ];

    return (
        <fieldset className="input-group">
            <legend>Entidades vinculadas</legend>

            {config.map(({ key, label, tipo }) => (
                <div key={key}>
                    <label>{label}</label>

                    {(proyecto.entidadesVinculadas[key] || []).map((item, idx) => (
                        <div key={idx} className="inline-group">

                            <EntidadSelect
                                tipo={tipo}
                                value={item}
                                onChange={(val) =>
                                    setByPath(
                                        ["entidadesVinculadas", key, idx],
                                        val
                                    )
                                }
                                placeholder={`${label} ${idx + 1}`}
                                disabled={editable && !!item?.nombre}
                            />

                                <div className="icon-buttons">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            addByPath(
                                                ["entidadesVinculadas", key],
                                                { nombre: "" }
                                            )
                                        }
                                    >
                                        +
                                    </button>

                                    {(proyecto.entidadesVinculadas[key] || []).length > 1 && (
                                        <button hidden={editable}
                                            type="button"
                                            onClick={() =>
                                                removeByPath(
                                                    ["entidadesVinculadas", key],
                                                    idx
                                                )
                                            }
                                        >
                                            -
                                        </button>
                                    )}
                                </div>

                        </div>
                    ))}
                </div>
            ))}
        </fieldset>
    );
}

export default ProyectoEntidades;