import { useProyecto } from "../../../context/proyectoCtx/UseProyecto.jsx";
import { useTiposCatalogo } from "../../../hooks/useTiposCatalogo.js";
import { useContext } from "react";
import { AppContext } from "../../../context/AppContext.jsx";
import { CodigoDTO } from "../../../modelos/CodigoDTO.jsx";
import {IndicadorDTO} from "../../../modelos/proyectoDTO.jsx";

function ProyectoObjetivos({editable}) {
    const { proyecto, setByPath, addByPath, removeByPath } = useProyecto();
    const { token } = useContext(AppContext);

    const { tipos } = useTiposCatalogo(token, ["TIPO_META"]);

    return (
        <>
            <label>Objetivos Específicos</label>

            {proyecto.objetivosEspecificos.map((objetivo, idxObjetivo) => (
                <fieldset key={idxObjetivo} className="input-group">

                    <legend>
                        Objetivo Específico {idxObjetivo + 1}

                            <div className="icon-buttons">
                                <button
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
                                    +
                                </button>

                                {proyecto.objetivosEspecificos.length > 1 && (
                                    <button hidden={editable}
                                        type="button"
                                        onClick={() =>
                                            removeByPath(["objetivosEspecificos"], idxObjetivo)
                                        }
                                    >
                                        -
                                    </button>
                                )}
                            </div>
                    </legend>

                    {/* DESCRIPCIÓN OBJETIVO */}
                    <textarea
                        className="input-field"
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
                        <fieldset key={idxMeta} className="input-group">

                            <legend>
                                Meta {idxMeta + 1}

                                    <div className="icon-buttons">
                                        <button
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
                                            +
                                        </button>

                                        {objetivo.metas.length > 1 && (
                                            <button hidden={editable}
                                                type="button"
                                                onClick={() =>
                                                    removeByPath(
                                                        ["objetivosEspecificos", idxObjetivo, "metas"],
                                                        idxMeta
                                                    )
                                                }
                                            >
                                                -
                                            </button>
                                        )}
                                    </div>
                            </legend>

                            {/* TIPO META */}
                            <select
                                className="input-field"
                                required
                                value={meta.tipo?.valor || ""}
                                onChange={(e) => {
                                    const tipoObj = (tipos["TIPO_META"] || []).find(
                                        (t) => t.valor === e.target.value
                                    );

                                    setByPath(
                                        ["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "tipo"],
                                        tipoObj || { ...CodigoDTO }
                                    );
                                }}
                            >
                                <option value="">Tipo</option>
                                {tipos["TIPO_META"]?.map((opcion) => (
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

                            {/* DESCRIPCIÓN META */}
                            <textarea
                                className="input-field"
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
                                <div key={idxIndicador} className="inline-group">
                                    <input
                                        type="text"
                                        className="input-field"
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
                                                +
                                            </button>

                                            {meta.indicadores.length > 1 && (
                                                <button hidden={editable}
                                                    type="button"
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
                                                    -
                                                </button>
                                            )}
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