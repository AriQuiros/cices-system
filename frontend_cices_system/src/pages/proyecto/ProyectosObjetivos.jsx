import { useProyecto } from "../../context/proyectoCtx/UseProyecto.jsx";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { CodigoDTO } from "../../modelos/codigoDTO.jsx";
import {IndicadorDTO} from "../../modelos/proyectoDTO.jsx";
import {PlusSquare, Trash2, PlusCircle, MinusCircle, Plus, X} from "lucide-react";

function ProyectoObjetivos({editable, tipoMeta}) {
    const { proyecto, setByPath, addByPath, removeByPath } = useProyecto();

    return (
        <>
            <label>Objetivos Específicos</label>

            {proyecto.objetivosEspecificos.map((objetivo, idxObjetivo) => (
                <fieldset key={idxObjetivo} className="input-group objetivo-especifico-block">

                    <legend>
                        Objetivo Específico {idxObjetivo + 1}

                            <div className="icon-buttons">
                                <button className={"btn-add"}
                                    type="button"
                                    onClick={() =>
                                        addByPath(["objetivosEspecificos"], {
                                            categoria: '',
                                            descripcion: '',
                                            metas: [{
                                                tipo: { ...CodigoDTO },
                                                cantidad: 1,
                                                descripcion: '',
                                                indicadores: [{...IndicadorDTO}]
                                            }]
                                        })
                                    }
                                >
                                    <PlusSquare size={18} />
                                </button>

                                {proyecto.objetivosEspecificos.length > 1 && (
                                    <button hidden={editable && objetivo?.id}
                                        type="button" className={"btn-delete"}
                                        onClick={() =>
                                            removeByPath(["objetivosEspecificos"], idxObjetivo)
                                        }
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                    </legend>

                    {/* DESCRIPCIÓN OBJETIVO */}
                    <textarea
                        className="input-field"
                        placeholder={`Descripción objetivo ${idxObjetivo + 1}`}
                        rows="4"
                        required
                        value={objetivo.descripcion}
                        onChange={(e) =>
                            setByPath(
                                ["objetivosEspecificos", idxObjetivo, "descripcion"],
                                e.target.value
                            )
                        }
                    />

                    {/* METAS */}
                    <label>Metas</label>

                    {objetivo.metas.map((meta, idxMeta) => (
                        <fieldset key={idxMeta} className="input-group meta-objetivo-block">

                            <legend>
                                Meta {idxMeta + 1}

                                    <div className="icon-buttons">
                                        <button className={"btn-add"}
                                            type="button"
                                            onClick={() =>
                                                addByPath(
                                                    ["objetivosEspecificos", idxObjetivo, "metas"],
                                                    {
                                                        tipo: { ...CodigoDTO },
                                                        cantidad: 1,
                                                        descripcion: '',
                                                        indicadores: [{...IndicadorDTO}]
                                                    }
                                                )
                                            }
                                        >
                                            <PlusCircle size={18} />
                                        </button>

                                        {objetivo.metas.length > 1 && (
                                            <button hidden={editable && meta?.id}
                                                type="button" className={"btn-delete"}
                                                onClick={() =>
                                                    removeByPath(
                                                        ["objetivosEspecificos", idxObjetivo, "metas"],
                                                        idxMeta
                                                    )
                                                }
                                            >
                                                <MinusCircle size={18} />
                                            </button>
                                        )}
                                    </div>
                            </legend>

                            {/* TIPO META */}
                            <div className={"row"}>
                            <select
                                className="input-field"
                                required
                                value={meta.tipo?.valor || ""}
                                onChange={(e) => {
                                    const tipoObj = (tipoMeta || []).find(
                                        (t) => t.valor === e.target.value
                                    );

                                    setByPath(
                                        ["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "tipo"],
                                        tipoObj || { ...CodigoDTO }
                                    );
                                }}
                            >
                                <option value="">Tipo</option>
                                {tipoMeta?.map((opcion) => (
                                    <option key={opcion.id} value={opcion.valor}>
                                        {opcion.despliegue}
                                    </option>
                                ))}
                            </select>

                            {/* CANTIDAD */}
                            {meta.tipo?.valor?.toUpperCase() === "CUANTITATIVA" && (
                                <input
                                    type="number"
                                    className="input-field"
                                    min="1"
                                    required
                                    value={meta.cantidad}
                                    onChange={(e) =>
                                        setByPath(
                                            ["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "cantidad"],
                                            e.target.value
                                        )
                                    }
                                />
                            )}
                            </div>
                            {/* DESCRIPCIÓN META */}
                            <textarea
                                className="input-field"
                                placeholder={`Descripción meta ${idxMeta + 1} (Objetivo ${idxObjetivo + 1})`}
                                required
                                value={meta.descripcion}
                                onChange={(e) =>
                                    setByPath(
                                        ["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "descripcion"],
                                        e.target.value
                                    )
                                }
                            />

                            {/* INDICADORES */}
                            <label>Indicadores</label>

                            {meta.indicadores.map((indicador, idxIndicador) => (
                                <div key={idxIndicador} className="inline-group col3">
                                    <div className="indicador-row">
                                        <input
                                            type="text"
                                            placeholder={`Descripción indicador ${idxIndicador + 1}  (Meta ${idxMeta + 1} - Objetivo ${idxObjetivo + 1})`}
                                            maxLength={252}
                                            className="input-field indicador-input"
                                            required
                                            value={indicador.descripcion}
                                            onChange={(e) =>
                                                setByPath(
                                                    [
                                                        "objetivosEspecificos",
                                                        idxObjetivo,
                                                        "metas",
                                                        idxMeta,
                                                        "indicadores",
                                                        idxIndicador,
                                                        "descripcion"
                                                    ],
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <div className="icon-buttons">
                                            <button
                                                className={"btn-add"}
                                                type="button"
                                                onClick={() =>
                                                    addByPath(
                                                        [
                                                            "objetivosEspecificos",
                                                            idxObjetivo,
                                                            "metas",
                                                            idxMeta,
                                                            "indicadores"
                                                        ],
                                                        {
                                                            descripcion: '',
                                                        }
                                                    )
                                                }
                                            >
                                                <Plus size={16} />
                                            </button>

                                            {meta.indicadores.length > 1 && (
                                                <button
                                                    hidden={editable && indicador?.id}
                                                    type="button"
                                                    className={"btn-delete"}
                                                    onClick={() =>
                                                        removeByPath(
                                                            [
                                                                "objetivosEspecificos",
                                                                idxObjetivo,
                                                                "metas",
                                                                idxMeta,
                                                                "indicadores"
                                                            ],
                                                            idxIndicador
                                                        )
                                                    }
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </fieldset>
                    ))}
                </fieldset>
            ))}
        </>
    );
}

export default ProyectoObjetivos;