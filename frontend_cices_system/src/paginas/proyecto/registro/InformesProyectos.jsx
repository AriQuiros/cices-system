import { useProyecto } from "../../../context/proyectoCtx/UseProyecto.jsx";
import { useTiposCatalogo } from "../../../hooks/useTiposCatalogo.js";
import { useContext, useEffect } from "react";
import { AppContext } from "../../../context/AppContext.jsx";
import { CodigoDTO } from "../../../modelos/CodigoDTO.jsx";
import { Plus, X} from "lucide-react";

function ProyectoInformes({ editable }) {
    const { proyecto, setByPath, addByPath, removeByPath } = useProyecto();
    const { token } = useContext(AppContext);
    const { tipos } = useTiposCatalogo(token, ["TIPO_INFORME"]);

    // Inicializar la lista de informes si está vacía
    useEffect(() => {
        if (!proyecto.presentacionesInformes || proyecto.presentacionesInformes.length === 0) {
            addByPath(["presentacionesInformes"], {
                descripcion: '',
                fechaPresentacion: '',
                tipoInforme: { ...CodigoDTO },
                estado: { ...CodigoDTO }
            });
        }
    }, [proyecto]);

    return (
        <fieldset className="input-group">
            <legend>Fechas de Informes</legend>

            {(proyecto.presentacionesInformes || []).map((informe, idx) => (
                <div key={idx} className="inline-group">
                    <div className={"row"}>
                        {/* TIPO */}
                        <select
                            className="input-field"
                            required={!!informe.fechaPresentacion}
                            value={informe.tipoInforme?.valor || ""}
                            onChange={(e) =>
                                setByPath(
                                    ["presentacionesInformes", idx, "tipoInforme"],
                                    (tipos["TIPO_INFORME"] || []).find(
                                        (t) => t.valor === e.target.value
                                    ) || { ...CodigoDTO }
                                )
                            }
                        >
                            <option value="">Tipo de informe</option>
                            {tipos["TIPO_INFORME"]?.map((opcion) => (
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
                            min={proyecto.fechaInicio ?? ''}
                            value={informe.fechaPresentacion ?? ''}
                            onChange={(e) =>
                                setByPath(
                                    ["presentacionesInformes", idx, "fechaPresentacion"],
                                    e.target.value
                                )
                            }
                        />

                        {/* BOTONES */}
                        <div className="icon-buttons">
                            <button className={"btn-add"}
                                    type="button"
                                    onClick={() =>
                                        addByPath(["presentacionesInformes"], {
                                            descripcion: '',
                                            fechaPresentacion: '',
                                            tipoInforme: { ...CodigoDTO },
                                            estado: { ...CodigoDTO }
                                        })
                                    }
                            >
                                <Plus/>
                            </button>

                            {proyecto.presentacionesInformes.length > 1 && (
                                <button hidden={editable && informe?.id}
                                        type="button" className={"btn-delete"}
                                        onClick={() =>
                                            removeByPath(["presentacionesInformes"], idx)
                                        }
                                >
                                    <X/>
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