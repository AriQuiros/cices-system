import { useProyecto } from "../../context/proyectoCtx/UseProyecto.jsx";
import { CodigoDTO } from "../../modelos/codigoDTO.jsx";
import { Plus, X} from "lucide-react";
import {InformeDTO} from "../../modelos/proyectoDTO.jsx";
import {useEffect} from "react";

function ProyectoInformes({ editable, tipoInforme }) {
    const { proyecto, setByPath, addByPath, removeByPath } = useProyecto();

    const informeVacio = () => ({ ...InformeDTO });

    useEffect(() => {

        if (!proyecto.presentacionesInformes?.length) {

            addByPath(
                ["presentacionesInformes"],
                informeVacio()
            );
        }

    }, [proyecto.presentacionesInformes]);
    return (
        <fieldset className="input-group">
            <legend>Fechas de Informes</legend>

            {(proyecto.presentacionesInformes || []).map((informe, idx) => (
                <div key={idx} className="inline-group">
                    <div className="row">
                        {/* TIPO */}
                        <select
                            className="input-field"
                            required={!!informe.fechaPresentacion}
                            value={informe.tipoInforme?.valor || ""}
                            onChange={(e) =>
                                setByPath(
                                    ["presentacionesInformes", idx, "tipoInforme"],
                                    tipoInforme.find(t => t.valor === e.target.value) || { ...CodigoDTO }
                                )
                            }
                        >
                            <option value="">Tipo de informe</option>
                            {tipoInforme.map(opcion => (
                                <option key={opcion.id} value={opcion.valor}>
                                    {opcion.despliegue}
                                </option>
                            ))}
                        </select>

                        {/* FECHA */}
                        <input
                            type="date"
                            className="input-field"
                            required={!!informe.tipoInforme?.valor}
                            min={proyecto.fechaInicio ?? ""}
                            value={informe.fechaPresentacion ?? ""}
                            onChange={(e) =>
                                setByPath(
                                    ["presentacionesInformes", idx, "fechaPresentacion"],
                                    e.target.value
                                )
                            }
                        />

                        {/* BOTONES */}
                        <div className="icon-buttons">
                            <button
                                type="button"
                                className="btn-add"
                                onClick={() => addByPath(["presentacionesInformes"], informeVacio())}
                            >
                                <Plus />
                            </button>

                            {proyecto.presentacionesInformes.length > 1 && (
                                <button
                                    hidden={editable && informe?.id}
                                    type="button"
                                    className="btn-delete"
                                    onClick={() => removeByPath(["presentacionesInformes"], idx)}
                                >
                                    <X />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </fieldset>
    );
}

export default ProyectoInformes;