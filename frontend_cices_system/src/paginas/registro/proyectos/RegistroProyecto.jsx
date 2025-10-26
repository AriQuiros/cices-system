import { AppContext } from "../../../context/AppContext.jsx";
import { useContext, useState, useRef } from "react";
import { useTiposCatalogo } from '../../../hooks/useTiposCatalogo.js';

import "../usuarios/Registro.css";
import "./RegistroProyecto.css";
import RegistroPresupuesto from "./RegistroPresupuesto.jsx";

const MAX_TOTAL_SIZE_MB = 550;

const getTotalFileSizeMB = (files) => {
    return files.reduce((total, file) => total + file.size, 0) / (1024 * 1024);
};

function RegistroProyecto() {
    const [errores, setErrores] = useState({});
    const { proyectosState, setProyectosState, presupuestoState,
        setPresupuestoState, token } = useContext(AppContext);
    const [showPresupuesto, setShowPresupuesto] = useState(false);
    const [popupExito, setPopupExito] = useState(false);

    const { tipos, loading } = useTiposCatalogo(token, [
        "ESTADO PROYECTO",
        "TIPO ENTIDAD",
        "TIPO PROYECTO",
        "TIPO META"
    ]);

    if (loading) return <p>Cargando opciones...</p>;

    const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

    function getErrorKey(path) {
        return Array.isArray(path) ? path.join('.') : path;
    }

    function handleChange(event) {
        const { name, value } = event.target;
        const proyectoChanged = { ...proyectosState.proyecto, [name]: value };

        const fechaInicio = new Date(proyectoChanged.fechaInicio);
        const fechaFinal = new Date(proyectoChanged.fechaFinalizacion);

        let nuevosErrores = { ...errores };

        if (name === "fechaInicio" || name === "fechaFinalizacion") {
            if (proyectoChanged.fechaInicio && proyectoChanged.fechaFinalizacion && fechaInicio > fechaFinal) {
                nuevosErrores["fechaInicio"] = "La fecha de inicio no puede ser mayor a la de finalización.";
                nuevosErrores["fechaFinalizacion"] = "La fecha de finalización no puede ser menor a la de inicio.";
            } else {
                delete nuevosErrores["fechaInicio"];
                delete nuevosErrores["fechaFinalizacion"];
            }
        }

        setErrores(nuevosErrores);
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
                                cantidad: 1,
                                descripcion: '',
                                indicadores: ['']
                            }
                        ]
                    }
                ],
                entidadesVinculadas: {
                    instituciones: [{ nombre: '' }],
                    unidades: [{ nombre: '' }],
                    sitios: [{ nombre: '' }]
                },
                fechaInicio: '',
                fechaFinalizacion: '',
                presentacionesInformes: [
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
        const errorKey = getErrorKey(path);
        if (lastKey === "cantidad") {
            value = value === '' ? '' : Math.max(Number(value), 1);
        }
        const proyectoChanged = { ...proyectosState.proyecto };
        let temp = proyectoChanged;
        for (let i = 0; i < path.length - 1; i++) {
            temp[path[i]] = Array.isArray(temp[path[i]]) ? [...temp[path[i]]] : { ...temp[path[i]] };
            temp = temp[path[i]];
        }

        let nuevosErrores = { ...errores };

        // Validaciones específicas
        if (lastKey === "fechaPresentacion") {
            const fechaInicio = new Date(proyectosState.proyecto.fechaInicio);
            const nuevaFecha = new Date(value);
            const idx = path[1];
            const presentaciones = proyectosState.proyecto.presentacionesInformes || [];

            if (fechaInicio && !isNaN(fechaInicio.getTime()) && nuevaFecha < fechaInicio) {
                nuevosErrores[errorKey] = "La fecha no puede ser anterior a la fecha de inicio.";
                setErrores(nuevosErrores);
                return;
            }

            const duplicado = presentaciones.some((inf, i) => i !== idx && inf.fechaPresentacion === value);
            if (duplicado) {
                nuevosErrores[errorKey] = "Esta fecha ya está registrada en otro informe.";
                setErrores(nuevosErrores);
                return;
            }

            delete nuevosErrores[errorKey]; // limpia si no hay errores
        }

        temp[lastKey] = value;
        setErrores(nuevosErrores);
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

        let nuevosErrores = { ...errores };

        if (totalSizeMB > MAX_TOTAL_SIZE_MB) {
            nuevosErrores["documentos"] = `El tamaño total (${totalSizeMB.toFixed(2)} MB) excede el límite de ${MAX_TOTAL_SIZE_MB} MB.`;
            setErrores(nuevosErrores);
            return;
        } else {
            delete nuevosErrores["documentos"];
        }

        setErrores(nuevosErrores);

        setProyectosState(prev => ({
            ...prev,
            proyecto: {
                ...prev.proyecto,
                documentos: archivosCombinados
            }
        }));

        event.target.value = null;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const proyecto = proyectosState.proyecto;
        let nuevosErrores = {};
        const totalSizeMB = getTotalFileSizeMB(proyecto.documentos);
// FORZAR VALIDACION DE FECHAS
        const fechaInicio = new Date(proyecto.fechaInicio);
        const fechaFin = proyecto.fechaFin ? new Date(proyecto.fechaFin) : null;

        if (presupuestoState.financiero.fechaAsignacion) {
            const fechaFinanciero = new Date(presupuestoState.financiero.fechaAsignacion);

            if (fechaFinanciero < fechaInicio) {
                setErrores({ general: 'La fecha de asignación del presupuesto financiero no puede ser anterior a la fecha de inicio del proyecto.' });
                return;
            }

            if (fechaFin && fechaFinanciero > fechaFin) {
                setErrores({ general: 'La fecha de asignación del presupuesto financiero no puede ser posterior a la fecha de finalización del proyecto.' });
                return;
            }
        }

        if (presupuestoState.horas.fechaAsignacion) {
            const fechaHoras = new Date(presupuestoState.horas.fechaAsignacion);

            if (fechaHoras < fechaInicio) {
                setErrores({ general: 'La fecha de asignación del presupuesto por horas no puede ser anterior a la fecha de inicio del proyecto.' });
                return;
            }

            if (fechaFin && fechaHoras > fechaFin) {
                setErrores({ general: 'La fecha de asignación del presupuesto por horas no puede ser posterior a la fecha de finalización del proyecto.' });
                return;
            }
        }
// FIN VALIDACION DE FECHAS

        if (totalSizeMB > MAX_TOTAL_SIZE_MB) {
            nuevosErrores["documentos"] = `El tamaño total de los documentos (${totalSizeMB.toFixed(2)} MB) excede el límite permitido de ${MAX_TOTAL_SIZE_MB} MB.`;
            return;
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return; // No envía si hay errores
        }
        setErrores({}); // limpia los errores anteriores

        const entidadesVinculadasFormateadas = [
            ...(proyecto.entidadesVinculadas?.unidades || []).filter(e => e.nombre && e.nombre.trim() !== '').map(e => ({ nombre: e.nombre.trim(), tipo: 'UNIDAD' })),
            ...(proyecto.entidadesVinculadas?.instituciones || []).filter(e => e.nombre && e.nombre.trim() !== '').map(e => ({ nombre: e.nombre.trim(), tipo: 'INSTITUCION' })),
            ...(proyecto.entidadesVinculadas?.sitios || []).filter(e => e.nombre && e.nombre.trim() !== '').map(e => ({ nombre: e.nombre.trim(), tipo: 'SITIO' }))
        ];

        const proyectoFinal = {
            ...proyecto,
            entidadesVinculadas: entidadesVinculadasFormateadas
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
                    setErrores({ general: data.error || 'Error desconocido al registrar el proyecto' });
                    return;
                }

                console.log('Proyecto registrado:', data);
                setErrores({});
                handleClear();

                // Mostrar popup de éxito
                setPopupExito(true);

                // Ocultar popup automáticamente después de 4 segundos
                setTimeout(() => setPopupExito(false), 4000);

                handleClear();
            })
            .catch(err => {
                console.error('Error de red al registrar:', err);
                setErrores({ general: 'Ocurrió un error de red al registrar el proyecto.' });
            });
    }

    return (
        <>
            <Show
                types={tipos}
                entity={proyectosState.proyecto}
                errores={errores}
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
            {/* Popup de éxito visual */}
            {popupExito && (
                <div className="popup-success">
                    <div className="popup-title-success">
                        Proyecto registrado exitosamente
                    </div>
                </div>
            )}
        </>
    );
}

function Show({ types, entity, errores, handleChange, handleNestedChange,
                  handleAddItem, handleRemoveItem, handleSubmit, handleFileChange,
                  showPresupuesto, setShowPresupuesto, presupuesto}) {
    const [showFechasInformes, setShowFechasInformes] = useState(false);
    const inputCodigoRef = useRef(null);
    return (
        <div className="form-container">
            <form id="form-project-content" className="form-content" onSubmit={handleSubmit}>
                <h2>Registrar Proyecto</h2>

                <div className="form-row">
                    <input type="text" placeholder="Código (prefijo: 840)" className="input-field" required maxLength={252}
                           name="codigo" ref={inputCodigoRef} value={entity.codigo} onChange={handleChange}/>
                    <input type="text" placeholder="Nombre" className="input-field" required maxLength={252}
                           name="nombre" value={entity.nombre} onChange={handleChange}/>
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

                    <input type="text" placeholder="Línea de investigación (área en el que se desarrolla el proyecto) ej: Entorno laboral" className="input-field" required  maxLength={252}
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

                        <textarea placeholder="Descripción del objetivo" name="descripcionObjetivo"  className="input-field" rows="4" required
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
                                    <select id="tipo-meta" className="input-field" required name="tipoMeta"
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
                                        <input type="number" placeholder="Cantidad" id="cantidad-meta" name="cantidadMeta"
                                               className="input-field"
                                               required={true} min="1" value={meta.cantidad} onChange={(e) =>
                                            handleNestedChange(
                                                ["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "cantidad"],
                                                e.target.value
                                            )
                                        }
                                        />
                                    )}
                                </div>

                                <textarea placeholder="Descripción de la meta" className="input-field" required name="descripcionMeta"
                                          value={meta.descripcion}
                                          onChange={(e) =>
                                              handleNestedChange(["objetivosEspecificos", idxObjetivo, "metas", idxMeta, "descripcion"], e.target.value)
                                          }
                                ></textarea>

                                <label><br/>Indicadores</label>
                                {meta.indicadores.map((indicador, idxIndicador) => (
                                    <div key={idxIndicador} id="inline-project-group" className="inline-group">
                                        <input type="text" placeholder={`Indicador ${idxIndicador + 1}`} name="indicador"
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
                    {entity.entidadesVinculadas.instituciones.map((institucion, idxInst) => (
                        <div key={idxInst} id="inline-project-group" className="inline-group">
                            <input
                                type="text"
                                placeholder={`Nombre de la institución ${idxInst + 1}`}
                                className="input-field"
                                maxLength={252}
                                name="nombreInstitucion"
                                value={institucion.nombre}
                                onChange={(e) =>
                                    handleNestedChange(
                                        ["entidadesVinculadas", "instituciones", idxInst, "nombre"],
                                        e.target.value
                                    )
                                }
                            />
                            <div className="icon-buttons">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAddItem(["entidadesVinculadas", "instituciones"], {nombre: ""})
                                    }
                                >
                                    ➕
                                </button>
                                {entity.entidadesVinculadas.instituciones.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveItem(["entidadesVinculadas", "instituciones"], idxInst)
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
                    {entity.entidadesVinculadas.unidades.map((unidad, idxUnidad) => (
                        <div key={idxUnidad} id="inline-project-group" className="inline-group">
                            <input
                                type="text"
                                placeholder={`Nombre de la unidad ${idxUnidad + 1}`}
                                className="input-field"
                                value={unidad.nombre}
                                maxLength={252}
                                name="nombreUnidad"
                                onChange={(e) =>
                                    handleNestedChange(
                                        ["entidadesVinculadas", "unidades", idxUnidad, "nombre"],
                                        e.target.value
                                    )
                                }
                            />
                            <div className="icon-buttons">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAddItem(["entidadesVinculadas", "unidades"], {nombre: ""})
                                    }
                                >
                                    ➕
                                </button>
                                {entity.entidadesVinculadas.unidades.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveItem(["entidadesVinculadas", "unidades"], idxUnidad)
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
                    {entity.entidadesVinculadas.sitios.map((sitio, idxSitio) => (
                        <div key={idxSitio} id="inline-project-group" className="inline-group">
                            <input
                                type="text"
                                placeholder={`Nombre del sitio ${idxSitio + 1}`}
                                className="input-field"
                                value={sitio.nombre}
                                name="nombreSitio"
                                maxLength={252}
                                onChange={(e) =>
                                    handleNestedChange(
                                        ["entidadesVinculadas", "sitios", idxSitio, "nombre"],
                                        e.target.value
                                    )
                                }
                            />
                            <div className="icon-buttons">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAddItem(["entidadesVinculadas", "sitios"], {nombre: ""})
                                    }
                                >
                                    ➕
                                </button>
                                {entity.entidadesVinculadas.sitios.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveItem(["entidadesVinculadas", "sitios"], idxSitio)
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
                        <input type="date" id="fecha-inicio" name="fechaInicio" required  onChange={handleChange} max={entity.fechaFinalizacion || ''}
                               className={`input-field ${errores["fechaInicio"] ? "input-error" : ""}`} value={entity.fechaInicio}/>
                        {errores["fechaInicio"] && <div className="error-text">{errores["fechaInicio"]}</div>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="fecha-fin">Fecha de finalización</label>
                        <input type="date" id="fecha-fin" name="fechaFinalizacion" required  onChange={handleChange} min={entity.fechaInicio || ''}
                               className={`input-field ${errores["fechaFinalizacion"] ? "input-error" : ""}`} value={entity.fechaFinalizacion}/>
                        {errores["fechaFinalizacion"] && <div className="error-text">{errores["fechaFinalizacion"]}</div>}
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

                        {entity.presentacionesInformes.map((informe, idx) => (
                            <div key={idx} id="inline-project-group" className="inline-group">
                                <input
                                    type="text" required={showFechasInformes}
                                    name={"descripcionInforme"}
                                    placeholder={`Descripción del informe ${idx + 1}`}
                                    className="input-field"
                                    value={informe.descripcion}
                                    maxLength={252}
                                    onChange={(e) =>
                                        handleNestedChange(['presentacionesInformes', idx, 'descripcion'], e.target.value)
                                    }
                                />
                                <div className={"input-group"}>
                                <input
                                    type="date" required={showFechasInformes} min={entity.fechaInicio || ''}
                                    name={"fechaInforme"}
                                    placeholder={`Fecha de presentación ${idx + 1}`}
                                    className={`input-field ${errores[`presentacionesInformes.${idx}.fechaPresentacion`] ? 'input-error' : ''}`}
                                    value={informe.fechaPresentacion}
                                    onChange={(e) =>
                                        handleNestedChange(['presentacionesInformes', idx, 'fechaPresentacion'], e.target.value)
                                    }
                                />
                                {errores[`presentacionesInformes.${idx}.fechaPresentacion`] && <div className="error-text">{errores[`presentacionesInformes.${idx}.fechaPresentacion`]}</div>}
                                </div>
                                <div className="icon-buttons">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddItem(['presentacionesInformes'], {
                                                descripcion: '',
                                                fechaPresentacion: '',
                                                estado: ''
                                            })
                                        }
                                    >
                                        ➕
                                    </button>
                                    {entity.presentacionesInformes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(['presentacionesInformes'], idx)}
                                        >
                                            ❌
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}
                <button type="button" className="submit-btn" name="btnEstablecerPresupuesto" id="submit-project-btn" onClick={() => {
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
                                <br/><strong>{presupuesto.horas.tipoPresupuesto || 'Sin tipo'}:</strong>
                                {presupuesto.horas.descripcion || 'Sin descripción'} <br/>
                                Horas: {presupuesto.horas.cantidadHorasMes}h / {presupuesto.horas.cantidadMeses}m <br/>
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
                            name="documento"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className={`input-field ${errores["documentos"] ? "input-error" : ""}`}
                        />
                        {errores["documentos"] && <div className="error-text">{errores["documentos"]}</div>}
                    </div>

                    {entity.documentos.map((doc, idxDoc) => (
                        <div key={idxDoc} id="inline-project-group" className="inline-group">
                            <input type="text" readOnly className="input-field"
                                   value={`${doc.name} (${(doc.size / 1024).toFixed(1)} KB)`}
                            />
                            <div className="icon-buttons">
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
                {errores["general"] && (
                    <div className="error-text">
                        {errores["general"]}
                    </div>
                )}
                <button type="submit"  name="btnRegistrarProyecto"  id="submit-project-btn" className="submit-btn">
                    Registrar Proyecto
                </button>

            </form>
        </div>
    );
}


export default RegistroProyecto;
