import React from "react";
import "./Registro.css";

function RegistroProyecto() {
    return (
        <div className="form-container">
            <form id="form-project-content" className="form-content">
                <h2>Registrar Proyecto</h2>

                <div className="form-row">
                    <input type="text" placeholder="Código" className="input-field"/>
                    <input type="text" placeholder="Nombre" className="input-field"/>
                    <input type="text" placeholder="Unidad de Origen: CICES" className="input-field"/>
                </div>

                <div className="form-row">
                    <select className="input-field">
                        <option value="">Estado</option>
                        <option value="activo">Activo</option>
                        <option value="finalizado">Finalizado</option>
                    </select>
                    <select className="input-field">
                        <option value="">Tipo de proyecto</option>
                        <option value="biomedicoObservacional">Biomédico observacional</option>
                        <option value="biomedicoIntervencional">Biomédico intervencional</option>
                        <option value="sociocultural">Sociocultural</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Línea de investigación"
                        className="input-field"
                    />

                </div>

                <div className="form-row">
                    <textarea placeholder="Descripción" className="input-field" rows="8"></textarea>
                    <textarea placeholder="Objetivo General" className="input-field" rows="8"></textarea>
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
                    <div id="inline-project-group" className="inline-group">
                        <small>Meta 1</small>
                        <select className="input-field">
                            <option value="">Tipo</option>
                            <option value="cuantitativa">Cuantitativa</option>
                            <option value="cualitativa">Cualitativa</option>
                        </select>
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
                    <div id="inline-project-group" className="inline-group">
                        <small>Meta 2</small>
                        <select className="input-field">
                            <option value="">Tipo</option>
                            <option value="cuantitativa">Cuantitativa</option>
                            <option value="cualitativa">Cualitativa</option>
                        </select>
                        <input type="number" placeholder="Cantidad" className="input-field"/>
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
                    <div id="inline-project-group" className="inline-group">
                        <input type="text" placeholder="Indicador 2" className="input-field"/>
                        <div className="icon-buttons">
                            <button type="button">➕</button>
                            <button type="button">❌</button>
                        </div>
                    </div>
                </fieldset>

                <label>Unidades participantes</label>
                <small>Unidad 1</small>
                <div id="inline-project-group" className="inline-group">
                    <input type="text" placeholder="Nombre de la unidad" className="input-field"/>
                    <div className="icon-buttons">
                        <button type="button">➕</button>
                        <button type="button">❌</button>
                    </div>
                </div>

                <label>Instituciones Participantes</label>
                <small>Institución 1</small>
                <div id="inline-project-group" className="inline-group">
                    <input type="text" placeholder="Nombre de la institución" className="input-field"/>
                    <div className="icon-buttons">
                        <button type="button">➕</button>
                        <button type="button">❌</button>
                    </div>
                </div>

                <label>Sitios de investigación</label>
                <small>Sitio 1</small>
                <div id="inline-project-group" className="inline-group">
                    <input type="text" placeholder="Nombre del sitio" className="input-field"/>
                    <div className="icon-buttons">
                        <button type="button">➕</button>
                        <button type="button">❌</button>
                    </div>
                </div>

                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="fecha-inicio">Fecha de inicio</label>
                        <input type="date" id="fecha-inicio" name="fecha-inicio" className="input-field"/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="fecha-fin">Fecha de finalización</label>
                        <input type="date" id="fecha-fin" name="fecha-fin" className="input-field"/>
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
