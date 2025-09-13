import React, { useState } from "react";
import "./Registro.css";
import RegistroInvestigador from "./RegistroInvestigador";

function Registro() {
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [rolSeleccionado, setRolSeleccionado] = useState("");

    const handleRolChange = (e) => {
        setRolSeleccionado(e.target.value);
        if (e.target.value === "rol4" && e.target.checked) {
            setMostrarPopup(true);
        }
    };
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
                    <label><input type="radio" name="rol" value="rol1" onChange={handleRolChange}/> Dirección</label>
                    <label><input type="radio" name="rol" value="rol2" onChange={handleRolChange}/> Administración</label>
                    <label><input type="radio" name="rol" value="rol3" onChange={handleRolChange}/> Asistente</label>
                    <label className="round-checkbox">
                        <input
                            type="checkbox"
                            name="rol"
                            value="rol4"
                            onChange={handleRolChange}
                        />
                        Investigador
                        <span className="checkmark"></span>
                    </label>
                </div>

                {rolSeleccionado === "rol4" && (
                    <div className="input-group">
                        <label>Número de becario:</label>
                        <input type="text" placeholder="(Si aplica)" className="input-field"/>
                    </div>
                )}

                <button type="submit" className="submit-btn">Registrar</button>
            </form>
            {mostrarPopup && (
                <RegistroInvestigador onClose={() => setMostrarPopup(false)} />
            )}
        </div>
    );
}

export default Registro;