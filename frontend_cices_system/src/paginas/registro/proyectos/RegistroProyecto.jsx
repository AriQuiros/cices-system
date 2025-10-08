import { AppContext } from "../../../context/AppContext.jsx";
import { useContext, useState, useRef } from "react";
import { useTiposCatalogo } from '../../../hooks/useTiposCatalogo.js';

import "../usuarios/Registro.css";
import "./RegistroProyecto.css";
import RegistroPresupuesto from "./RegistroPresupuesto.jsx";

const MAX_TOTAL_SIZE_MB = 10;

const getTotalFileSizeMB = (files) => {
    return files.reduce((total, file) => total + file.size, 0) / (1024 * 1024);
};


function RegistroProyecto() {
    const [errorMessage, setErrorMessage] = useState("");
    const { proyectosState, setProyectosState, presupuestoState,
        setPresupuestoState, token } = useContext(AppContext);
    const [showPresupuesto, setShowPresupuesto] = useState(false);

    const { tipos, loading } = useTiposCatalogo(token, [
        "ESTADO PROYECTO",
        "TIPO ENTIDAD",
        "TIPO PROYECTO",
        "TIPO META"
    ]);

    if (loading) return <p>Cargando opciones...</p>;

    const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

    function handleChange(event) {
        const { name, value } = event.target;
        const proyectoChanged = { ...proyectosState.proyecto, [name]: value };
        if (name === "fechaInicio" || name === "fechaFinalizacion") {
            const fechaInicio = new Date(proyectoChanged.fechaInicio);
            const fechaFinalizacion = new Date(proyectoChanged.fechaFinalizacion);

            if (fechaInicio > fechaFinalizacion) {
                setErrorMessage("La fecha de inicio no puede ser mayor a la fecha de finalización.");
            } else {
                setErrorMessage("");
            }
        }
        setProyectosState({ ...proyectosState, proyecto: proyectoChanged });
    }

    function handleClear() {
        setProyectosState({
            ...proyectosState,
            proyecto: {
                codigo: '',
                nombre: '',
                unidadOrigen: '',
                estado: '',
                tipo: '',
                lineaInvestigacion: '',
                descripcion: '',
                objetivoGeneral: '',
                objetivosEspecificos: [
                    {
                        categoria: '',
                        descripcion: '',
                        metas: [
                            {
                                tipo: '',
                                cantidad: 0,
                                descripcion: '',
                                indicadores: ['']
                            }
                        ]
                    }
                ],
                unidades: [{ nombre: '' }],
                instituciones: [{ nombre: '' }],
                sitios: [{ nombre: '' }],
                fechaInicio: '',
                fechaFinalizacion: '',
                fechasInformes: [
                    {
                        descripcion: '',
                        fechaPresentacion: '',
                        codigoEstado: ''
                    }
                ],
                documentos: []
            }
        });
// --------LIMPIAR PRESEUPUESTOS-----------
        setPresupuestoState({
            financiero: {
                descripcion: '',
                fechaAsignacion: '',
                monto: 0,
                fuenteFinanciamiento: '',
                tipoPresupuesto: ''
            },
            horas: {
                descripcion: '',
                fechaAsignacion: '',
                cantidadHorasMes: 0,
                cantidadMeses: 0,
                tipoPresupuesto: ''
            }
        });


        setShowPresupuesto(false);
    }

    // Función genérica para actualizar listas anidadas en el proyecto
    function handleNestedChange(path, value) {
        const lastKey = path[path.length - 1];

        // Si el campo es "cantidad", forzar valor no negativo
        if (lastKey === "cantidad") {
            value = value === '' ? '' : Math.max(Number(value), 0);
        }

        // path: array con la ruta dentro de proyecto, ej: ['objetivosEspecificos', 0, 'categoria']
        const proyectoChanged = { ...proyectosState.proyecto };
        let temp = proyectoChanged;
        for (let i = 0; i < path.length - 1; i++) {
            temp[path[i]] = Array.isArray(temp[path[i]]) ? [...temp[path[i]]] : { ...temp[path[i]] };
            temp = temp[path[i]];
        }
        temp[path[path.length - 1]] = value;
        setProyectosState({ ...proyectosState, proyecto: proyectoChanged });
    }

    // Función genérica para agregar un elemento a una lista anidada
    function handleAddItem(path, newItem) {
        const proyectoChanged = { ...proyectosState.proyecto };
        let temp = proyectoChanged;
        for (let i = 0; i < path.length; i++) {
            temp[path[i]] = Array.isArray(temp[path[i]]) ? [...temp[path[i]]] : { ...temp[path[i]] };
            temp = temp[path[i]];
        }
        temp.push(newItem);
        setProyectosState({ ...proyectosState, proyecto: proyectoChanged });
    }

    // Función genérica para eliminar un elemento de una lista anidada
    function handleRemoveItem(path, index) {
        const proyectoChanged = { ...proyectosState.proyecto };
        let temp = proyectoChanged;
        for (let i = 0; i < path.length; i++) {
            temp[path[i]] = Array.isArray(temp[path[i]]) ? [...temp[path[i]]] : { ...temp[path[i]] };
            temp = temp[path[i]];
        }
        temp.splice(index, 1);
        setProyectosState({ ...proyectosState, proyecto: proyectoChanged });
    }

    function handleFileChange(event) {
        const nuevosArchivos = Array.from(event.target.files);

        const archivosActuales = proyectosState.proyecto.documentos || [];
        const archivosCombinados = [...archivosActuales, ...nuevosArchivos];

        const totalSizeMB = getTotalFileSizeMB(archivosCombinados);

        if (totalSizeMB > MAX_TOTAL_SIZE_MB) {
            setErrorMessage(`El tamaño total de los documentos (${totalSizeMB.toFixed(2)} MB) excede el límite permitido de ${MAX_TOTAL_SIZE_MB} MB.`);
            return;
        }
        setErrorMessage("");

        setProyectosState(prev => ({
            ...prev,
            proyecto: {
                ...prev.proyecto,
                documentos: archivosCombinados
            }
        }));

        event.target.value = null; // limpiar el input
    }

    function handleSubmit(e) {
        e.preventDefault();

        const { proyecto } = proyectosState;

        const totalSizeMB = getTotalFileSizeMB(proyecto.documentos);
        if (totalSizeMB > MAX_TOTAL_SIZE_MB) {
            setErrorMessage(`El tamaño total de los documentos (${totalSizeMB.toFixed(2)} MB) excede el límite permitido de ${MAX_TOTAL_SIZE_MB} MB.`);
            return;
        }
        setErrorMessage("");

        // Crear un objeto final (DTO) que incluya esas entidades ya con tipo
        const proyectoFinal = {
            nombreProyecto: proyecto.nombre,
            codigoProyecto: proyecto.codigo,
            descripcionProyecto: proyecto.descripcion,
            objetivoGeneralProyecto: proyecto.objetivoGeneral,
            fechaInicio: proyecto.fechaInicio,
            fechaFinalizacion: proyecto.fechaFinalizacion,
            lineaInvestigacion: proyecto.lineaInvestigacion,
            estado: proyecto.estado,
            tipoProyecto: proyecto.tipo,
            detallesProyectos: "",
            objetivosEspecificos: proyecto.objetivosEspecificos,
            presentacionesInforme: proyecto.fechasInformes,
            documentos: [],
            entidadesVinculadas: [
                ...proyecto.unidades.map(e => ({ nombre: e.nombre, tipo: 'UNIDAD' })).filter(e => e.nombre && e.nombre.trim() !== ''),
                ...proyecto.instituciones.map(e => ({ nombre: e.nombre, tipo: 'INSTITUCION' })).filter(e => e.nombre && e.nombre.trim() !== ''),
                ...proyecto.sitios.map(e => ({ nombre: e.nombre, tipo: 'SITIO' })).filter(e => e.nombre && e.nombre.trim() !== '')
            ]
        };
        /*REGISTRAR PRESUPUESTO*/
        const presupuestos = [];
        if (presupuestoState.financiero.tipoPresupuesto && presupuestoState.financiero) {
            presupuestos.push({
                ...presupuestoState.financiero
            });
        }

        if (presupuestoState.horas.tipoPresupuesto && presupuestoState.horas) {
            presupuestos.push({
                ...presupuestoState.horas
            });
        }

        const formData = new FormData();

        formData.append('proyecto', new Blob(
            [JSON.stringify(proyectoFinal)],
            { type: 'application/json' }
        ));
        formData.append('presupuesto', new Blob([JSON.stringify(presupuestos)], { type: 'application/json' }));


        if (proyecto.documentos && proyecto.documentos.length > 0) {
            proyecto.documentos.forEach((file) => {
                formData.append('documentos', file);
            });
        }
// ✅ DEBUG: Mostrar contenido del FormData
        for (let [key, value] of formData.entries()) {
            if (value instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    console.log(`🔸 ${key}:`, reader.result);
                };
                reader.readAsText(value);
            } else if (value instanceof File) {
                console.log(`📎 Documento - ${key}:`, value.name, value.size, "bytes");
            } else {
                console.log(`📦 ${key}:`, value);
            }
        }

        fetch(`${API}/api/proyectos/registrar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
            .then(async res => {
                const data = await res.json();

                if (!res.ok) {
                    setErrorMessage(data.error || 'Error desconocido al registrar el proyecto.');
                    return;
                }

                console.log('Proyecto registrado:', data);
                setErrorMessage("");
                handleClear();
            })
            .catch(err => {
                console.error('Error de red al registrar:', err);
                setErrorMessage('Ocurrió un error de red al registrar el proyecto.');
            });
    }

    return (
        <>
            <Show
                types={tipos}
                entity={proyectosState.proyecto}
                errorMessage={errorMessage}
                handleChange={handleChange}
                handleNestedChange={handleNestedChange}
                handleAddItem={handleAddItem}
                handleRemoveItem={handleRemoveItem}
                handleSubmit={handleSubmit}
                handleFileChange={handleFileChange}
                showPresupuesto={showPresupuesto}
                setShowPresupuesto={setShowPresupuesto}
                presupuesto={presupuestoState || []}
            />
        </>
    );
}

function Show({ types, entity, errorMessage, handleChange, handleNestedChange,
                  handleAddItem, handleRemoveItem, handleSubmit, handleFileChange,
                  showPresupuesto, setShowPresupuesto, presupuesto}) {
    const [showFechasInformes, setShowFechasInformes] = useState(false);
    const inputCodigoRef = useRef(null);
    return (
        <div className="form-container">
            <form id="form-project-content" className="form-content" onSubmit={handleSubmit}>
                <h2>Registrar Proyecto</h2>

                <div className="form-row">
                    <input type="text" placeholder="Código" className="input-field" required
                           name="codigo" ref={inputCodigoRef} value={entity.codigo} onChange={handleChange}/>
                    <input type="text" placeholder="Nombre" className="input-field" required
                           name="nombre" value={entity.nombre} onChange={handleChange}/>
                    <input type="text" placeholder="Unidad de Origen: CICES" className="input-field" required
                           name="unidadOrigen" value={entity.unidadOrigen} onChange={handleChange}/>
                </div>

                <div className="form-row">
                    <select className="input-field" name="estado" value={entity.estado} onChange={handleChange}
                            required>
                        <option value="">Estado</option>
                        {types["ESTADO PROYECTO"]?.map(opcion => (
                            <option key={opcion.id} value={opcion.valor}>{opcion.despliegue}</option>
                        ))}
                    </select>

                    <select className="input-field" name="tipo" value={entity.tipo} onChange={handleChange} required>
                        <option value="">Tipo de proyecto</option>
                        {types["TIPO PROYECTO"]?.map(opcion => (
                            <option key={opcion.id} value={opcion.valor}>{opcion.despliegue}</option>
                        ))}
                    </select>

                    <input type="text" placeholder="Línea de investigación" className="input-field" required
                           name="lineaInvestigacion" value={entity.lineaInvestigacion} onChange={handleChange}/>
                </div>

                <div className="form-row">
                    <textarea placeholder="Descripción" className="input-field" rows="8" required
                              name="descripcion" value={entity.descripcion} onChange={handleChange}></textarea>
                    <textarea placeholder="Objetivo General" className="input-field" rows="8" required
                              name="objetivoGeneral" value={entity.objetivoGeneral} onChange={handleChange}></textarea>
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
                                        metas: [{tipo: '', cantidad: 0, descripcion: '', indicadores: ['']}]
                                    })
                                }>➕
                                </button>
                                {entity.objetivosEspecificos.length > 1 && (
                                    <button type="button" onClick={() =>
                                        handleRemoveItem(["objetivosEspecificos"], idxObjetivo)
                                    }>❌</button>
                                )}
                            </div>
                        </legend>

                        <input type="text" placeholder="Categoría" className="input-field" required
                               value={objetivo.categoria}
                               onChange={e =>
                                   handleNestedChange(["objetivosEspecificos", idxObjetivo, "categoria"], e.target.value)
                               }
                        />
                        <textarea placeholder="Descripción del objetivo" className="input-field" rows="4" required
                                  value={objetivo.descripcion}
                                  onChange={e =>
                                      handleNestedChange(["objetivosEspecificos", idxObjetivo, "descripcion"], e.target.value)
                                  }
                        ></textarea>

                        <label>Metas</label>
                        {objetivo.metas.map((meta, idxMeta) => (
                            <fieldset key={idxMeta} className="input-group">
                                <legend>
                                    Meta {idxMeta + 1}
                                    <div className="icon-buttons">
                                        <button type="button" onClick={() =>
                                            handleAddItem(["objetivosEspecificos", idxObjetivo, "metas"], {
                                                tipo: '', cantidad: 0, descripcion: '', indicadores: ['']
                                            })
                                        }>➕
                                        </button>
                                        {objetivo.metas.length > 1 && (
                                            <button type="button" onClick={() =>
                                                handleRemoveItem(["objetivosEspecificos", idxObjetivo, "metas"], idxMeta)
                                            }>❌</button>
                                        )}
                                    </div>
                                </legend>

                                <div className="form-row">
                                    <select id="tipo-meta" className="input-field" required
                                            value={meta.tipo}
                                            onChange={(e) =>
                                                handleNestedChange(["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "tipo"], e.target.value)
                                            }
                                    >
                                        <option value="">Tipo</option>
                                        {types["TIPO META"]?.map((opcion) => (
                                            <option key={opcion.id} value={opcion.valor}>
                                                {opcion.despliegue}
                                            </option>
                                        ))}
                                    </select>

                                    {meta.tipo === "CUANTITATIVA" && (
                                        <input type="number" placeholder="Cantidad" id="cantidad-meta"
                                               className="input-field"
                                               required={true} min="0" value={meta.cantidad} onChange={(e) =>
                                            handleNestedChange(
                                                ["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "cantidad"],
                                                e.target.value
                                            )
                                        }
                                        />
                                    )}
                                </div>

                                <textarea placeholder="Descripción de la meta" className="input-field" required
                                          value={meta.descripcion}
                                          onChange={(e) =>
                                              handleNestedChange(["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "descripcion"], e.target.value)
                                          }
                                ></textarea>

                                <label><br/>Indicadores</label>
                                {meta.indicadores.map((indicador, idxIndicador) => (
                                    <div key={idxIndicador} id="inline-project-group" className="inline-group">
                                        <input type="text" placeholder={`Indicador ${idxIndicador + 1}`}
                                               className="input-field" value={indicador} onChange={(e) =>
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
                                            }>➕
                                            </button>
                                            {meta.indicadores.length > 1 && (
                                                <button type="button" onClick={() =>
                                                    handleRemoveItem(["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "indicadores"], idxIndicador)
                                                }>❌</button>
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
                    {entity.instituciones.map((institucion, idxInst) => (
                        <div key={idxInst} id="inline-project-group" className="inline-group">
                            <input type="text" placeholder={`Nombre de la institución ${idxInst + 1}`}
                                   className="input-field" value={institucion.nombre}
                                   onChange={(e) =>
                                       handleNestedChange(["instituciones", idxInst, "nombre"], e.target.value)
                                   }
                            />
                            <div className="icon-buttons">
                                <button type="button" onClick={() =>
                                    handleAddItem(["instituciones"], {nombre: ""})
                                }
                                >
                                    ➕
                                </button>
                                {entity.instituciones.length > 1 && (
                                    <button type="button" onClick={() =>
                                        handleRemoveItem(["instituciones"], idxInst)
                                    }
                                    >
                                        ❌
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Unidades participantes */}
                    <label>Unidades participantes</label>
                    {entity.unidades.map((unidad, idxUnidad) => (
                        <div key={idxUnidad} id="inline-project-group" className="inline-group">
                            <input type="text" placeholder={`Nombre de la unidad ${idxUnidad + 1}`}
                                   className="input-field" value={unidad.nombre}
                                   onChange={(e) =>
                                       handleNestedChange(["unidades", idxUnidad, "nombre"], e.target.value)
                                   }
                            />
                            <div className="icon-buttons">
                                <button type="button" onClick={() =>
                                    handleAddItem(["unidades"], {nombre: ""})
                                }
                                >
                                    ➕
                                </button>
                                {entity.unidades.length > 1 && (
                                    <button type="button" onClick={() =>
                                        handleRemoveItem(["unidades"], idxUnidad)
                                    }
                                    >
                                        ❌
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Sitios de investigación */}
                    <label>Sitios de investigación</label>
                    {entity.sitios.map((sitio, idxSitio) => (
                        <div key={idxSitio} id="inline-project-group" className="inline-group">
                            <input type="text" placeholder={`Nombre del sitio ${idxSitio + 1}`}
                                   className="input-field" value={sitio.nombre} onChange={(e) =>
                                handleNestedChange(["sitios", idxSitio, "nombre"], e.target.value)
                            }
                            />
                            <div className="icon-buttons">
                                <button type="button" onClick={() =>
                                    handleAddItem(["sitios"], {nombre: ""})
                                }
                                >
                                    ➕
                                </button>
                                {entity.sitios.length > 1 && (
                                    <button type="button" onClick={() =>
                                        handleRemoveItem(["sitios"], idxSitio)
                                    }
                                    >
                                        ❌
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </fieldset>

                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="fecha-inicio">Fecha de inicio</label>
                        <input type="date" id="fecha-inicio" name="fechaInicio" required
                               className="input-field" value={entity.fechaInicio} onChange={handleChange}/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="fecha-fin">Fecha de finalización</label>
                        <input type="date" id="fecha-fin" name="fechaFinalizacion" required
                               className="input-field" value={entity.fechaFinalizacion} onChange={handleChange}/>
                    </div>
                </div>

                <label className="checkbox-group">
                    <input type="checkbox" checked={showFechasInformes}
                           onChange={() => setShowFechasInformes(!showFechasInformes)}
                    />
                    Establecer Fechas de presentación de informes
                </label>

                {showFechasInformes && (
                    <>
                        <legend>Fechas de Informes</legend>

                        {entity.fechasInformes.map((informe, idx) => (
                            <div key={idx} id="inline-project-group" className="inline-group">
                                <input
                                    type="text"
                                    placeholder={`Descripción del informe ${idx + 1}`}
                                    className="input-field"
                                    value={informe.descripcion}
                                    onChange={(e) =>
                                        handleNestedChange(['fechasInformes', idx, 'descripcion'], e.target.value)
                                    }
                                />
                                <input
                                    type="date"
                                    placeholder={`Fecha de presentación ${idx + 1}`}
                                    className="input-field"
                                    value={informe.fechaPresentacion}
                                    onChange={(e) =>
                                        handleNestedChange(['fechasInformes', idx, 'fechaPresentacion'], e.target.value)
                                    }
                                />
                                <div className="icon-buttons">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddItem(['fechasInformes'], {
                                                descripcion: '',
                                                fechaEntrega: '',
                                                estado: ''
                                            })
                                        }
                                    >
                                        ➕
                                    </button>
                                    {entity.fechasInformes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(['fechasInformes'], idx)}
                                        >
                                            ❌
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}
                <button type="button" className="submit-btn"  id="submit-project-btn"  onClick={() => {
                    if (!entity.codigo?.trim()) {
                        if (inputCodigoRef.current) {
                            inputCodigoRef.current.focus();
                        }
                        return;
                    }
                    setShowPresupuesto(true);
                }}
                >Establecer presupuesto
                </button>
                {showPresupuesto && (
                    <RegistroPresupuesto
                        onClose={() => setShowPresupuesto(false)}
                        editable={false}
                    />
                )}
                    <div>
                        <h4>Presupuesto:</h4>
                        <div className="input-group">
                            {presupuesto.financiero.tipoPresupuesto === 'FINANCIERO' && (
                                <>
                                    <strong>{presupuesto.financiero.tipoPresupuesto || 'Sin tipo'}:</strong>
                                    {presupuesto.financiero.descripcion || 'Sin descripción'} <br/>
                                    Monto: ₡{presupuesto.financiero.monto} <br/>
                                    Fuente: {presupuesto.financiero.fuenteFinanciamiento} <br/>
                                    <em>Fecha de
                                        asignación:</em> {presupuesto.financiero.fechaAsignacion || 'Sin fecha'}<br/>
                                </>
                            )}
                            {presupuesto.horas.tipoPresupuesto === 'HORAS' && (
                                <>
                                    <br /><strong>{presupuesto.horas.tipoPresupuesto || 'Sin tipo'}:</strong>
                                    {presupuesto.horas.descripcion || 'Sin descripción'} <br />
                                    Horas: {presupuesto.horas.cantidadHorasMes}h / {presupuesto.horas.cantidadMeses}m <br />
                                    <em>Fecha de asignación:</em> {presupuesto.horas.fechaAsignacion || 'Sin fecha'}
                                </>
                            )}
                        </div>

                    </div>

                <fieldset id="input-project-group" className="input-group">
                    <legend>
                        Documentos Relacionados
                    </legend>

                    <div className="form-row">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="input-field"
                        />
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                    </div>

                    {entity.documentos.map((doc, idxDoc) => (
                        <div key={idxDoc} id="inline-project-group" className="inline-group">
                            <input type="text" readOnly className="input-field"
                                value={`${doc.name} (${(doc.size / 1024).toFixed(1)} KB)`}
                            />
                            <div className="icon-buttons" >
                                <button type="button" onClick={() => handleRemoveItem(["documentos"], idxDoc)}
                                >
                                    ❌
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

                <button type="submit" id="submit-project-btn" className="submit-btn">
                    Registrar Proyecto
                </button>
            </form>
        </div>
    );
}

export default RegistroProyecto;
