import React from "react";
import "./Registro.css";

function Registro() {
    return (
        <div className="form-container">
            <form className="form-content">
                <h2>Registro</h2>

                <input type="text" placeholder="Nombre completo" className="input-field"/>

                <select className="input-field">
                    <option value="">Identificación</option>
                    <option value="cedula">Cédula</option>
                    <option value="pasaporte">Pasaporte</option>
                    <option value="otro">Otro</option>
                </select>

                <div className="input-group">
                    <input type="text" placeholder="Número de identificación" className="input-field"/>
                    <small className="input-message">Sin guiones</small>
                </div>

                <div className="input-group">
                    <input type="tel" placeholder="Teléfono" className="input-field"/>
                    <small className="input-message">Sin guiones</small>
                </div>

                <input type="email" placeholder="Correo electrónico: example@ucr.ac.cr" className="input-field"/>

                <div className="input-group">
                    <input type="password" placeholder="Contraseña" className="input-field"/>
                    <small className="input-message">Mínimo 8 caracteres</small>
                </div>

                <div className="roles">
                    <label><input type="radio" name="rol" value="rol1"/> Dirección</label>
                    <label><input type="radio" name="rol" value="rol2"/> Administración</label>
                    <label><input type="radio" name="rol" value="rol3"/> Asistente</label>
                    <label><input type="checkbox" name="rol4"/> Investigador</label>
                </div>

                <button type="submit" className="submit-btn">Registrar</button>
            </form>
        </div>
    );
}

export default Registro;
