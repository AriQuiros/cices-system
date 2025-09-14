import {AppContext} from "../../context/AppContext.jsx";
import {useContext, useEffect, useState} from "react";

import "./Registro.css";
import "./RegistroProyecto.css";

function RegistroProyecto() {
    const [tiposState, setTiposState] = useState({});
    const { proyectosState, setProyectosState, token } = useContext(AppContext);

    const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

    useEffect(()=> {
        handleTypes(); //pide los tipos y codigos para los selects
    }, []);

    async function types() {
        try {
            const response = await fetch(  `${API}/api/catalogos/tipos_registro_proyecto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(["ESTADO PROYECTO", "TIPO ENTIDAD", "TIPO PROYECTO", "TIPO META"])
            });

            if (!response.ok) {
                alert("Error: " + response.status);
                return null;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al obtener tipos:", error);
            alert("Error al conectar con el servidor");
            return null;
        }
    }

    function handleTypes() {
        (async () => {
            const tipos = await types();
            if (tipos) {
                setTiposState(tipos);
            }
        })();
    }

    function handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let proyectoChanged = {...proyectosState.proyecto};
        proyectoChanged[name] = value;
        setProyectosState({
            ...proyectosState,
            proyecto: proyectoChanged
        });
    }

    function handleClear(){
        setProyectosState({...proyectosState, proyecto:{codigo: '', nombre: '', unidadOrigen: '', estado: '', tipo: '',
                lineaInvestigacion: '', descripcion: '', objetivoGeneral: '',
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
                entidadesVinculadas: [
                    {
                        nombre: '',
                        tipo: ''
                    }
                ],
                fechaInicio: '', fechaFinalizacion: '',
                documentos: [
                    {
                        nombre: '',
                        directorio: ''
                    }
                ]
            }
        });
    }

    return (
        <>
            <Show
                types={tiposState}
                entity={proyectosState.proyecto}
                handleChange={handleChange}
                handleClear={handleClear}
            />
        </>
    );
}

function Show({types, entity, handleChange}){
    const [tipoMetaSeleccionado, setTipoMetaSeleccionado] = useState('');

    return (
        <div className="form-container">
            <h2>Registrar Proyecto</h2>

            <form id="form-project-content" className="form-content">
                <div className="form-row">
                    <input type="text" placeholder="Código" className="input-field"
                           name="codigo" value={entity.codigo} onChange={handleChange}/>
                    <input type="text" placeholder="Nombre" className="input-field"
                           name="nombre" value={entity.nombre} onChange={handleChange}
                    />
                    <input
                        type="text" placeholder="Unidad de Origen: CICES" className="input-field"
                        name="unidadOrigen" value={entity.unidadOrigen} onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <select className="input-field" name="estado" value={entity.estado} onChange={handleChange}>
                        <option value="">Estado</option>
                        {types["ESTADO PROYECTO"]?.map(opcion => (
                            <option key={opcion.id} value={opcion.valor}>
                                {opcion.despliegue}
                            </option>
                        ))}
                    </select>

                    <select className="input-field" name="tipo" value={entity.tipo} onChange={handleChange}>
                        <option value="">Tipo de proyecto</option>
                        {types["TIPO PROYECTO"]?.map(opcion => (
                            <option key={opcion.id} value={opcion.valor}>
                                {opcion.despliegue}
                            </option>
                        ))}
                    </select>

                    <input type="text" placeholder="Línea de investigación" className="input-field"
                           name="lineaInvestigacion" value={entity.lineaInvestigacion} onChange={handleChange}/>
                </div>

                <div className="form-row">
                    <textarea placeholder="Descripción" className="input-field" rows="8"
                              name="descripcion" value={entity.descripcion} onChange={handleChange}
                    ></textarea>
                    <textarea placeholder="Objetivo General" className="input-field" rows="8"
                              name="objetivoGeneral" value={entity.objetivoGeneral} onChange={handleChange}
                    ></textarea>
                </div>

                <label>Objetivos Específicos</label>
                <fieldset id="input-project-group" className="input-group">
                    <legend>Objetivo Específico 1
                        <div className="icon-buttons">
                            <button type="button">➕</button>
                            <button type="button">❌</button>
                        </div>
                    </legend>
                    <input type="text" placeholder="Categoría" className="input-field"/>
                    <textarea placeholder="Descripción" className="input-field"></textarea>
                    <label>Metas</label>
                    <div className="form-row">
                        <div id="inline-project-group" className="inline-group">
                            <small>Meta 1</small>
                            {/*momentaneamente tipoMetaSeleccionada*/}
                            <select className="input-field" name="tipoMeta"
                                    value={tipoMetaSeleccionado}
                                    onChange={(e) => setTipoMetaSeleccionado(e.target.value)}>
                                <option value="">Tipo</option>
                                {types["TIPO META"]?.map(opcion => (
                                    <option key={opcion.id} value={opcion.valor}>
                                        {opcion.despliegue}
                                    </option>
                                ))}
                            </select>

                            {tipoMetaSeleccionado === 'CUANTITATIVA' && (
                                <input
                                    type="number"
                                    placeholder="Cantidad"
                                    className="input-field"
                                />
                            )}
                        </div>

                        <textarea placeholder="Descripción" className="input-field"></textarea>
                        <div className="icon-buttons">
                            <button type="button">➕</button>
                            <button type="button">❌</button>
                        </div>
                    </div>


                    <label>Indicadores</label>
                    <div id="inline-project-group" className="inline-group">
                        <input type="text" placeholder="Indicador 1" className="input-field"/>
                        <div className="icon-buttons">
                            <button type="button">➕</button>
                            <button type="button">❌</button>
                        </div>
                    </div>
                </fieldset>

                {/*tipos y codigos*/}
                <fieldset id="input-project-group" className="input-group">
                    <legend>Entidades vinculadas</legend>
                    <label>Unidades participantes</label>
                    <div id="inline-project-group" className="inline-group">
                        <input type="text" placeholder="Nombre de la unidad 1" className="input-field"/>
                        <div className="icon-buttons">
                            <button type="button">➕</button>
                            <button type="button">❌</button>
                        </div>
                    </div>

                    <label>Instituciones Participantes</label>
                    <div id="inline-project-group" className="inline-group">
                        <input type="text" placeholder="Nombre de la institución 1" className="input-field"/>
                        <div className="icon-buttons">
                            <button type="button">➕</button>
                            <button type="button">❌</button>
                        </div>
                    </div>

                    <label>Sitios de investigación</label>
                    <div id="inline-project-group" className="inline-group">
                        <input type="text" placeholder="Nombre del sitio 1" className="input-field"/>
                        <div className="icon-buttons">
                            <button type="button">➕</button>
                            <button type="button">❌</button>
                        </div>
                    </div>
                </fieldset>

                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="fecha-inicio">Fecha de inicio</label>
                        <input type="date" id="fecha-inicio" name="fechaInicio"
                               className="input-field" value={entity.fechaInicio} onChange={handleChange}/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="fecha-fin">Fecha de finalización</label>
                        <input type="date" id="fecha-fin" name="fechaFinalizacion"
                               className="input-field" value={entity.fechaFinalizacion} onChange={handleChange}/>
                    </div>
                </div>

                <label className="checkbox-group">
                    <input type="checkbox"/> Establecer Fechas de presentación de informes
                </label>

                <button type="submit" id="submit-project-btn" className="submit-btn">
                    Registrar Proyecto
                </button>
            </form>
        </div>
    );
}

export default RegistroProyecto;
