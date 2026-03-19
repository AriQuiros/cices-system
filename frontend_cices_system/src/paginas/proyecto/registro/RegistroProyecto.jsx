// RegistroProyecto.jsx
import {useContext, useRef, useState} from "react";
import { useProyecto } from "../../../context/proyectoCtx/UseProyecto.jsx";
import { useTiposCatalogo } from '../../../hooks/useTiposCatalogo.js';
import {registrarProyecto} from "../../../services/ProyectoService.jsx";
import { notify } from '../../../utils/ui/notify.jsx';
import CreatableSelect from "react-select/creatable";
import {AppContext} from "../../../context/AppContext.jsx";
import { ProyectoDTO } from "../../../modelos/proyectoDTO.jsx";
import { CodigoDTO } from "../../../modelos/CodigoDTO.jsx";

import "../../usuarios/registro/Registro.css";
import "./RegistroProyecto.css";
import GestionPresupuesto from "../../presupuesto/registro/GestionPresupuesto.jsx";
import VincularInvestigador from "./VincularInvestigador.jsx";
import {useLineas} from "../../../hooks/proyectos/useLineas.jsx";
import EntidadSelect from "../../../components/EntidadSelect.jsx";

const MAX_TOTAL_SIZE_MB = 550;
const getTotalFileSizeMB = (files) => {
    return files.reduce((total, file) => total + file.size, 0) / (1024 * 1024);
};

function RegistroProyecto() {
    const [showPresupuesto, setShowPresupuesto] = useState(false);
    const [showAsignarInvestigador, setShowAsignarInvestigador] = useState(false); // new state
    const [showFechasInformes, setShowFechasInformes] = useState(false);
    const { opciones: opcionesLineas } = useLineas();

    const {
        proyecto,
        addByPath,
        setByPath,
        removeByPath,
        actualizarCampo,
        limpiarProyecto,
        limpiarPresupuestoActual
    } = useProyecto();

    // ================== CARGA DE TIPOS DE CATALOGO ==================
    const { token } = useContext(AppContext);
    const { tipos, loading } = useTiposCatalogo(token, [
        "TIPO_ENTIDAD",
        "TIPO_PROYECTO",
        "TIPO_META",
        "TIPO_INFORME"
    ]);

    if (loading) return <p>Cargando opciones...</p>;

    // ================== HANDLERS ==================
    const handleChange = (e) => {
        const { name, value } = e.target;
        actualizarCampo(name, value);

        // Validaci�n de fechas
        if (name === "fechaInicio" || name === "fechaFinalizacion") {
            const fechaInicio = new Date(proyecto.fechaInicio);
            const fechaFinal = new Date(proyecto.fechaFinalizacion);

            if (fechaInicio && fechaFinal && fechaInicio > fechaFinal) {
                notify.warning('La fecha de inicio no puede ser mayor a la de finalización.');
            }
         }
    };

    const handleClear = () => {
        limpiarProyecto();
        setShowPresupuesto(false);
        limpiarPresupuestoActual();
    };

    const handleFileChange = (event) => {
        const nuevosArchivos = Array.from(event.target.files);
        const archivosCombinados = [...(proyecto.documentos || []), ...nuevosArchivos];
        const totalSizeMB = getTotalFileSizeMB(archivosCombinados);

        if (totalSizeMB > MAX_TOTAL_SIZE_MB) {
            notify.warning(`El tamaño total (${totalSizeMB.toFixed(2)} MB) excede el límite de ${MAX_TOTAL_SIZE_MB} MB.`);
            return;
        }

        actualizarCampo('documentos', archivosCombinados);
        event.target.value = null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const entidadesVinculadasFormateadas = [
            ...(proyecto.entidadesVinculadas?.unidades || []).filter(e => e.nombre).map(e => ({ id:e.id, nombre: e.nombre.trim(), tipo: e.tipo })),
            ...(proyecto.entidadesVinculadas?.instituciones || []).filter(e => e.nombre).map(e => ({ id:e.id, nombre: e.nombre.trim(), tipo: e.tipo })),
            ...(proyecto.entidadesVinculadas?.sitios || []).filter(e => e.nombre).map(e => ({ id:e.id, nombre: e.nombre.trim(), tipo: e.tipo })),
        ];
        const proyectoFinal = {
            ...ProyectoDTO,
            ...proyecto,
            entidadesVinculadas: entidadesVinculadasFormateadas,
            presentacionesInformes: showFechasInformes
                ? proyecto.presentacionesInformes
                : []
        };

        try {
            const data = await registrarProyecto(proyectoFinal, token);

            handleClear();
            setShowFechasInformes(false);
            notify.success('Proyecto registrado exitosamente.');

        } catch (err) {
            const message = err?.error || err?.message || (err && err.data && err.data.error) || 'Error al registrar proyecto';
            notify.error(message);
        }
    };

    return (
        <>
            <Show
                 types={tipos}
                 opcionesLineas={opcionesLineas}
                 entity={proyecto}
                 handleChange={handleChange}
                 handleNestedChange={setByPath}
                 handleAddItem={addByPath}
                 handleRemoveItem={removeByPath}
                  handleSubmit={handleSubmit}
                  handleFileChange={handleFileChange}
                  showFechasInformes={showFechasInformes}
                  setShowFechasInformes={setShowFechasInformes}
                  showPresupuesto={showPresupuesto}
                  setShowPresupuesto={setShowPresupuesto}
                  showAsignarInvestigador={showAsignarInvestigador} // pass down
                  setShowAsignarInvestigador={setShowAsignarInvestigador} // pass down
              />
         </>
     );
 }

function Show({ types, opcionesLineas, entity, handleChange, handleNestedChange, showFechasInformes, setShowFechasInformes,
                  handleAddItem, handleRemoveItem, handleSubmit, handleFileChange,
                  showPresupuesto, setShowPresupuesto, showAsignarInvestigador, setShowAsignarInvestigador }) {
     const inputCodigoRef = useRef(null);
    const [inputValue, setInputValue] = useState("");
    const MAX_LENGTH = 50;

     return (
         <div className="form-container">
             <form id="form-project-content" className="form-content" onSubmit={handleSubmit}>
                <h2>Registrar Proyecto</h2>

                <div className="form-row">
                    <div className="input-group"> <label>Código:</label>
                    <input type="text" placeholder="prefijo: 840" className="input-field" required maxLength={252}
                           name="codigoProyecto" ref={inputCodigoRef} value={entity.codigoProyecto ?? ''} onChange={handleChange}/>
                    </div>
                    <div className="input-group"> <label>Nombre:</label>
                    <input type="text" placeholder="Nombre" className="input-field" required maxLength={252}
                           name="nombreProyecto" value={entity.nombreProyecto ?? ''} onChange={handleChange}/>
                    </div>
                </div>

                <div className="form-row">
                    <select
                        className="input-field"
                        name="tipoProyecto"
                        value={entity.tipoProyecto?.valor || ""}
                        onChange={(e) => {
                            const tipoSeleccionado = (types["TIPO_PROYECTO"] || []).find(
                                (t) => t.valor === e.target.value
                            );
                            handleNestedChange(["tipoProyecto"], tipoSeleccionado || { ...CodigoDTO });
                        }}
                        required>
                        <option value="">Tipo de proyecto</option>
                        {types["TIPO_PROYECTO"]?.map((opcion, idx) => (
                            <option key={opcion.id ?? opcion.valor ?? idx} value={opcion.valor}>{opcion.despliegue}</option>
                        ))}
                    </select>

                    <div className="input-group"> <label>Línea de investigación:</label>
                        <CreatableSelect
                            options={opcionesLineas}
                            value={
                                entity.lineaInvestigacion
                                    ? { value: entity.lineaInvestigacion, label: entity.lineaInvestigacion }
                                    : null
                            }
                            inputValue={inputValue}
                            onInputChange={(val, meta) => {
                                if (meta.action === "input-change") {
                                    setInputValue(val.slice(0, MAX_LENGTH));
                                }
                            }}
                            onChange={(selectedOption) => {
                                const value = selectedOption ? selectedOption.value.slice(0, MAX_LENGTH) : "";
                                if (selectedOption?.value.length > MAX_LENGTH) {
                                    notify.warning(`Máximo ${MAX_LENGTH} caracteres`);
                                    return;
                                }
                                handleChange({
                                    target: {
                                        name: "lineaInvestigacion",
                                        value
                                    }
                                });

                                setInputValue("");
                            }}
                            placeholder="Área en el que se desarrolla el proyecto. Ej: Entorno laboral"
                            isClearable
                            isSearchable
                        />
                        <small>{inputValue.length}/{MAX_LENGTH}</small>
                     </div>
                 </div>

                <div className="form-row">
                    <div className="input-group"> <label>Descripción:</label>
                    <textarea placeholder="Descripción" className="input-field" rows="8" required
                              name="descripcion" value={entity.descripcion ?? ''} onChange={handleChange}></textarea>
                     </div>
                     <div className="input-group"> <label>Objetivo General:</label>
                    <textarea placeholder="Objetivo General" className="input-field" rows="8" required
                              name="objetivoGeneral" value={entity.objetivoGeneral ?? ''} onChange={handleChange}></textarea>
                     </div>
                 </div>

                <label>Objetivos Específicos</label>
                {entity.objetivosEspecificos.map((objetivo, idxObjetivo) => (
                    <fieldset key={idxObjetivo} id="input-project-group" className="input-group">
                        <legend>
                            Objetivo Específico {idxObjetivo + 1}
                            <div className="icon-buttons">
                                <button type="button" onClick={() =>
                                    handleAddItem(["objetivosEspecificos"], {
                                        categoria: '',
                                        descripcion: '',
                                        metas: [{tipo: { ...CodigoDTO }, cantidad: 0, descripcion: '', indicadores: ['']}]
                                    })
                                }>?
                                </button>
                                {entity.objetivosEspecificos.length > 1 && (
                                    <button type="button" onClick={() =>
                                        handleRemoveItem(["objetivosEspecificos"], idxObjetivo)
                                    }>?</button>
                                )}
                            </div>
                        </legend>

                        <div className="input-group"> <label>Descripción del objetivo:</label>
                        <textarea placeholder="Descripción del objetivo" name="descripcion"  className="input-field" rows="4" required
                                  value={objetivo.descripcion}
                                  onChange={e =>
                                      handleNestedChange(["objetivosEspecificos", idxObjetivo, "descripcion"], e.target.value)
                                  }
                        ></textarea>
                        </div>

                        <label>Metas</label>
                        {objetivo.metas.map((meta, idxMeta) => (
                            <fieldset key={idxMeta} className="input-group">
                                <legend>
                                    Meta {idxMeta + 1}
                                    <div className="icon-buttons">
                                        <button type="button" onClick={() =>
                                            handleAddItem(["objetivosEspecificos", idxObjetivo, "metas"], {
                                                tipo: { ...CodigoDTO }, cantidad: 0, descripcion: '', indicadores: ['']
                                            })
                                        }>?
                                        </button>
                                        {objetivo.metas.length > 1 && (
                                            <button type="button" onClick={() =>
                                                handleRemoveItem(["objetivosEspecificos", idxObjetivo, "metas"], idxMeta)
                                            }>?</button>
                                        )}
                                    </div>
                                </legend>

                                <div className="form-row">
                                    <select id="tipo-meta" className="input-field" required name="tipo"
                                            value={meta.tipo?.valor || ""}
                                            onChange={(e) => {
                                                const valor = e.target.value;
                                                const tipoObj = (types["TIPO_META"] || []).find((t) => t.valor === valor);

                                                handleNestedChange(
                                                    ["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "tipo"],
                                                    tipoObj || { ...CodigoDTO }
                                                );
                                            }}
                                    >
                                        <option value="">Tipo</option>
                                        {types["TIPO_META"]?.map((opcion, idx) => (
                                            <option key={opcion.id ?? opcion.valor ?? idx} value={opcion.valor}>
                                                {opcion.despliegue}
                                            </option>
                                        ))}
                                    </select>

                                    {meta.tipo?.valor?.toUpperCase() === "CUANTITATIVA" && (
                                        <input type="number" placeholder="Cantidad" id="cantidad-meta" name="cantidad"
                                               className="input-field"
                                               required={true} min="1" value={meta.cantidad ?? ''} onChange={(e) =>
                                            handleNestedChange(
                                                ["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "cantidad"],
                                                e.target.value
                                            )
                                        }
                                        />
                                    )}
                                </div>

                                <div className="input-group"> <label>Descripción meta:</label>
                                <textarea placeholder="Descripción de la meta" className="input-field" required name="descripcion"
                                          value={meta.descripcion ?? ''}
                                          onChange={(e) =>
                                              handleNestedChange(["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "descripcion"], e.target.value)
                                          }
                                ></textarea>
                                </div>

                                <label><br/>Indicadores</label>
                                {meta.indicadores.map((indicador, idxIndicador) => (
                                    <div key={idxIndicador} id="inline-project-group" className="inline-group">
                                        <input type="text" placeholder={`Indicador ${idxIndicador + 1}`} name="indicador"
                                               className="input-field" value={indicador ?? ''} onChange={(e) =>
                                            handleNestedChange(
                                                ["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "indicadores", idxIndicador],
                                                e.target.value
                                            )
                                        }
                                               required
                                        />
                                        <div className="icon-buttons">
                                            <button type="button" onClick={() =>
                                                handleAddItem(["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "indicadores"], '')
                                            }>?
                                            </button>
                                            {meta.indicadores.length > 1 && (
                                                <button type="button" onClick={() =>
                                                    handleRemoveItem(["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "indicadores"], idxIndicador)
                                                }>?</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </fieldset>
                        ))}
                    </fieldset>
                ))}

                <fieldset id="input-project-group" className="input-group">
                    <legend>Entidades vinculadas</legend>

                    {/* Instituciones participantes */}
                    <label>Instituciones Participantes</label>
                    {entity.entidadesVinculadas.instituciones.map((institucion, idxInst) => (
                        <div key={idxInst} id="inline-project-group" className="inline-group">
                            <EntidadSelect
                                tipo="INSTITUCION"
                                value={institucion}
                                onChange={(val) =>
                                    handleNestedChange(
                                        ["entidadesVinculadas", "instituciones", idxInst],
                                        val
                                    )
                                }
                                placeholder={`Nombre de la institución ${idxInst + 1}`}
                            />
                            <div className="icon-buttons">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAddItem(["entidadesVinculadas", "instituciones"], {nombre: ""})
                                    }
                                >
                                    ?
                                </button>
                                {entity.entidadesVinculadas.instituciones.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveItem(["entidadesVinculadas", "instituciones"], idxInst)
                                        }
                                    >
                                        ?
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Unidades participantes */}
                    <label>Unidades participantes</label>
                    {entity.entidadesVinculadas.unidades.map((unidad, idxUnidad) => (
                        <div key={idxUnidad} id="inline-project-group" className="inline-group">
                            <EntidadSelect
                                tipo="UNIDAD"
                                value={unidad}
                                onChange={(val) =>
                                    handleNestedChange(
                                        ["entidadesVinculadas", "unidades", idxUnidad],
                                        val
                                    )
                                }
                                placeholder={`Nombre de la unidad ${idxUnidad + 1}`}
                            />
                            <div className="icon-buttons">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAddItem(["entidadesVinculadas", "unidades"], {nombre: ""})
                                    }
                                >
                                    ?
                                </button>
                                {entity.entidadesVinculadas.unidades.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveItem(["entidadesVinculadas", "unidades"], idxUnidad)
                                        }
                                    >
                                        ?
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Sitios de investigaci�n */}
                    <label>Sitios de investigación</label>
                    {entity.entidadesVinculadas.sitios.map((sitio, idxSitio) => (
                        <div key={idxSitio} id="inline-project-group" className="inline-group">
                            <EntidadSelect
                                tipo="SITIO"
                                value={sitio}
                                onChange={(val) =>
                                    handleNestedChange(
                                        ["entidadesVinculadas", "sitios", idxSitio],
                                        val
                                    )
                                }
                                placeholder={`Nombre del sitio ${idxSitio + 1}`}
                            />
                            <div className="icon-buttons">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAddItem(["entidadesVinculadas", "sitios"], {nombre: ""})
                                    }
                                >
                                    ?
                                </button>
                                {entity.entidadesVinculadas.sitios.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveItem(["entidadesVinculadas", "sitios"], idxSitio)
                                        }
                                    >
                                        ?
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </fieldset>

                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="fecha-inicio">Fecha de inicio</label>
                        <input type="date" id="fecha-inicio" name="fechaInicio" required  onChange={handleChange} max={entity.fechaFinalizacion ?? ''}
                               className={`input-field`} value={entity.fechaInicio ?? ''}/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="fecha-fin">Fecha de finalización</label>
                        <input type="date" id="fecha-fin" name="fechaFinalizacion" required  onChange={handleChange} min={entity.fechaInicio ?? ''}
                               className={`input-field`} value={entity.fechaFinalizacion ?? ''}/>
                    </div>
                </div>

                <label className="checkbox-group">
                    <input type="checkbox" checked={showFechasInformes}
                           onChange={() => {
                               const next = !showFechasInformes;
                               if (next && (!entity.presentacionesInformes || entity.presentacionesInformes.length === 0)) {
                                   handleAddItem(['presentacionesInformes'], { descripcion: '', fechaPresentacion: '', tipoInforme: { ...CodigoDTO }, estado: {...CodigoDTO} });
                               }
                               setShowFechasInformes(next);
                           }}
                    />
                    Establecer Fechas de presentación de informes
                </label>

                {showFechasInformes && (
                    <>
                        <legend>Fechas de Informes</legend>

                        {entity.presentacionesInformes.map((informe, idx) => (
                            <div key={idx} id="inline-project-group" className="inline-group">
                                    <select
                                        id={`tipoInforme-${idx}`}
                                        required={showFechasInformes}
                                        name={"tipoInforme"}
                                        className="input-field"
                                        value={informe.tipoInforme?.valor || ""}
                                        onChange={(e) =>
                                            handleNestedChange(["presentacionesInformes", idx, "tipoInforme"], (types["TIPO_INFORME"] || []).find((t) => t.valor === e.target.value) || { ...CodigoDTO })
                                        }
                                    >
                                        <option value="">Tipo de informe</option>
                                        {types["TIPO_INFORME"]?.map((opcion) => (
                                            <option key={opcion.id} value={opcion.valor}>{opcion.despliegue}</option>
                                        ))}
                                    </select>
                                <div className={"input-group"}>
                                <input
                                    type="date" required={showFechasInformes} min={entity.fechaInicio ?? ''}
                                    name={"fechaPresentacion"}
                                    placeholder={`Fecha de presentación ${idx + 1}`}
                                    className={`input-field`}
                                    value={informe.fechaPresentacion ?? ''}
                                    onChange={(e) =>
                                        handleNestedChange(['presentacionesInformes', idx, 'fechaPresentacion'], e.target.value)
                                    }
                                />
                                </div>
                                <div className="icon-buttons">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddItem(['presentacionesInformes'], {
                                                descripcion: '',
                                                fechaPresentacion: '',
                                                estado: {...CodigoDTO}
                                            })
                                        }
                                    >
                                        ?
                                    </button>
                                    {entity.presentacionesInformes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(['presentacionesInformes'], idx)}
                                        >
                                            ?
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}{/*
                <button type="button" className="submit-btn" name="btnEstablecerPresupuesto" id="submit-project-btn" onClick={() => {
                    if (!entity.codigoProyecto?.trim()) {
                        if (inputCodigoRef.current) {
                            inputCodigoRef.current.focus();
                        }
                        return;
                    }
                    setShowPresupuesto(true);
                }}
                >Establecer presupuesto
                </button>

                <button type="button" className="submit-btn" name="btnVincularInvestigadores" id="submit-project-btn" onClick={() => {
                    if (!entity.codigoProyecto?.trim()) {
                        if (inputCodigoRef.current) {
                            inputCodigoRef.current.focus();
                        }
                        return;
                    }
                    setShowAsignarInvestigador(true);
                }}
                >Vincular Investigadores
                </button>

                 {showPresupuesto && (
                     <div className="popup">
                     <GestionPresupuesto
                         modoRegistro={true}
                         proyecto={entity}
                         onClose={() => setShowPresupuesto(false)}
                         onSave={(presupuestos) => {
                             handleNestedChange(["presupuestos"], presupuestos);
                             setShowPresupuesto(false);
                         }}
                     />
                     </div>
                 )}

                {showAsignarInvestigador && (
                    <VincularInvestigador
                        onClose={() => setShowAsignarInvestigador(false)}
                        editable={false}
                    />
                )}
                <div>
                    <h4>Presupuestos:</h4>
                    <div className="input-group">
                        {(entity.presupuestos || []).length === 0 ? (
                            <div>Sin presupuestos asignados</div>
                        ) : (
                            (entity.presupuestos || []).map((pres, idx) => {
                                const tipoPresupuesto = pres.tipoPresupuesto?.valor;

                                return (
                                    <div key={idx} className="presupuesto-item">

                                        <strong>{tipoPresupuesto || "Sin tipo"}</strong>

                                        <div>{pres.descripcion || ""}</div>
                                        <div>Categoría: {pres.categoria?.despliegue || "Sin categoría"}</div>
                                        <div>Fecha asignación: {pres.fechaAsignacion || "Sin fecha"}</div>

                                        {tipoPresupuesto === "FINANCIERO" && (
                                            <>
                                                <div>Fuente: {pres.fuenteFinanciamiento?.despliegue || "N/A"}</div>
                                                <div>Monto: ₡{pres.monto ?? 0}</div>
                                            </>
                                        )}

                                        {tipoPresupuesto === "HORAS" && (
                                            <>
                                                <div>
                                                    Horas: {pres.cantidadHorasMes ?? 0} h /{" "}
                                                    {pres.cantidadMeses ?? 0} m
                                                </div>
                                            </>
                                        )}

                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
*/}
                <fieldset id="input-project-group" className="input-group">
                    <legend>
                        Documentos Relacionados
                    </legend>

                    <div className="form-row">
                        <input
                            name="documento"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className={`input-field`}
                        />
                     </div>

                    {entity.documentos.map((doc, idxDoc) => (
                        <div key={idxDoc} id="inline-project-group" className="inline-group">
                            <input type="text" readOnly className="input-field"
                                   value={`${doc.name} (${(doc.size / 1024).toFixed(1)} KB)`}
                            />
                            <div className="icon-buttons">
                                <button type="button" onClick={() => handleRemoveItem(["documentos"], idxDoc)}
                                >
                                    ?
                                </button>
                            </div>
                        </div>
                    ))}
                    <label>
                        Tamaño total: {getTotalFileSizeMB(entity.documentos).toFixed(2)} MB / {MAX_TOTAL_SIZE_MB} MB
                    </label>
                    <meter min="0" max={MAX_TOTAL_SIZE_MB} value={getTotalFileSizeMB(entity.documentos)}
                    >
                        {Math.round((getTotalFileSizeMB(entity.documentos) / MAX_TOTAL_SIZE_MB) * 100)}%
                    </meter>
                </fieldset>
                <button type="submit"  name="btnRegistrarProyecto"  id="submit-project-btn" className="submit-btn">
                    Registrar Proyecto
                </button>

              </form>
          </div>
      );
  }


export default RegistroProyecto;
