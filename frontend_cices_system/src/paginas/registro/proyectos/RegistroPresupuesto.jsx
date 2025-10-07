import { AppContext } from "../../../context/AppContext.jsx";
import { useContext, useState } from "react";
import { useTiposCatalogo } from '../../../hooks/useTiposCatalogo.js';

import "../usuarios/RegistroInvestigador.css";
import "../usuarios/Registro.css";
import "./RegistroProyecto.css";
import "./Presupuesto.css";

function RegistroPresupuesto({ onClose }) {
    const {
        PresupuestoFState, setPresupuestoFState,
        PresupuestoHState, setPresupuestoHState,
        token
    } = useContext(AppContext);

    const [tipoPresupuesto, setTipoPresupuesto] = useState({
        financiero: false,
        horas: false
    });

    const mostrarError = !tipoPresupuesto.financiero && !tipoPresupuesto.horas;

    const { tipos, loading } = useTiposCatalogo(token, [
        "TIPO PRESUPUESTO",
        "FUENTE FINANCIAMIENTO"
    ]);
    if (loading) return <p>Cargando tipos de presupuesto...</p>;

    function handleCheckboxChange(e) {
        const { value, checked } = e.target;
        setTipoPresupuesto(prev => ({
            ...prev,
            [value.toLowerCase()]: checked
        }));

        // Si desmarcamos un tipo, limpiamos su presupuesto asociado
        if (!checked) {
            if (value.toLowerCase() === "financiero") {
                setPresupuestoFState({
                    PresupuestoF: {
                        fuenteFinanciamiento: '',
                        descripcion: '',
                        monto: 0,
                        fechaAsignacion: '',
                        tipo: 'Financiero'
                    }
                });
            }
            if (value.toLowerCase() === "horas") {
                setPresupuestoHState({
                    PresupuestoH: {
                        descripcion: '',
                        horas: 0,
                        meses: 0,
                        fechaAsignacion: '',
                        tipo: 'Horas'
                    }
                });
            }
        }
    }

    function handleFinancieroChange(e) {
        const { name, value } = e.target;
        setPresupuestoFState(prev => ({
            PresupuestoF: {
                ...prev.PresupuestoF,
                [name]: name === 'monto' ? Number(value) : value
            }
        }));
    }

    function handleHorasChange(e) {
        const { name, value } = e.target;
        setPresupuestoHState(prev => ({
            PresupuestoH: {
                ...prev.PresupuestoH,
                [name]: (name === 'horas' || name === 'meses') ? Number(value) : value
            }
        }));
    }

    function handleCancel() {
        setTipoPresupuesto({ financiero: false, horas: false });
        if (onClose) onClose();
    }

    function handleConfirm() {

        // mensaje de exitomuest
        if (onClose) onClose();
    }

    return (
        <Show
            tiposPresupuesto={tipos["TIPO PRESUPUESTO"] || []}
            fuentesFinanciamiento={tipos["FUENTE FINANCIAMIENTO"] || []}
            tipoPresupuesto={tipoPresupuesto}
            mostrarError={mostrarError}
            PresupuestoFState={PresupuestoFState}
            PresupuestoHState={PresupuestoHState}
            handleCheckboxChange={handleCheckboxChange}
            handleFinancieroChange={handleFinancieroChange}
            handleHorasChange={handleHorasChange}
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
        />
    );
}

function Show({
                  tiposPresupuesto,
                  fuentesFinanciamiento,
                  tipoPresupuesto,
                  mostrarError,
                  PresupuestoFState,
                  PresupuestoHState,
                  handleCheckboxChange,
                  handleFinancieroChange,
                  handleHorasChange,
                  handleCancel,
                  handleConfirm
              }) {
    return (
        <div className="overlay">
            <div className="popup">
                <h2>Establecer presupuesto</h2>

                <div className="form">
                    <div className="inline-group" id="checkbox-project-group">
                        {tiposPresupuesto.map(opcion => (
                            <label key={opcion.id}>
                                <input
                                    type="checkbox"
                                    name="tipo"
                                    value={opcion.valor.toLowerCase()}
                                    checked={tipoPresupuesto[opcion.valor.toLowerCase()] || false}
                                    onChange={handleCheckboxChange}
                                />
                                {opcion.despliegue}
                            </label>
                        ))}
                    </div>

                    {mostrarError && (
                        <div className="error-message">
                            <strong>⚠️ <br />Seleccione al menos un tipo de presupuesto</strong><br />
                            Para continuar, debe elegir entre Financiero, Horas o ambos
                        </div>
                    )}

                    <div className="form-row">
                        {tipoPresupuesto.financiero && (
                            <fieldset className="input-field">
                                <legend> Presupuesto Financiero</legend>
                                <div className="form">
                                    <div className="select-wrap">
                                        <select
                                            className="select"
                                            required
                                            name="fuenteFinanciamiento"
                                            value={PresupuestoFState.PresupuestoF.fuenteFinanciamiento}
                                            onChange={handleFinancieroChange}
                                        >
                                            <option value="">Fuente de financiamiento</option>
                                            {fuentesFinanciamiento.map(fuente => (
                                                <option key={fuente.id} value={fuente.valor}>
                                                    {fuente.despliegue}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Descripción corta"
                                        name="descripcion"
                                        value={PresupuestoFState.PresupuestoF.descripcion}
                                        onChange={handleFinancieroChange}
                                    />
                                    <label>Monto</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="Monto"
                                        min="0"
                                        name="monto"
                                        value={PresupuestoFState.PresupuestoF.monto}
                                        onChange={handleFinancieroChange}
                                    />

                                    <label>Fecha de asignación</label>
                                    <input
                                        type="date"
                                        className="input"
                                        name="fechaAsignacion"
                                        value={PresupuestoFState.PresupuestoF.fechaAsignacion}
                                        onChange={handleFinancieroChange}
                                    />
                                </div>
                            </fieldset>
                        )}

                        {tipoPresupuesto.horas && (
                            <fieldset className="input-field">
                                <legend> Presupuesto en Horas</legend>
                                <div className="form">
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Descripción corta"
                                        name="descripcion"
                                        value={PresupuestoHState.PresupuestoH.descripcion}
                                        onChange={handleHorasChange}
                                    />
                                    <label>Horas asignadas</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="Horas presupuestarias"
                                        min="0"
                                        name="horas"
                                        value={PresupuestoHState.PresupuestoH.horas}
                                        onChange={handleHorasChange}
                                    />
                                    <label>Tiempo (cantidad meses)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="Cantidad de meses"
                                        min="0"
                                        name="meses"
                                        value={PresupuestoHState.PresupuestoH.meses}
                                        onChange={handleHorasChange}
                                    />

                                    <label>Fecha de asignación</label>
                                    <input
                                        type="date"
                                        className="input"
                                        name="fechaAsignacion"
                                        value={PresupuestoHState.PresupuestoH.fechaAsignacion}
                                        onChange={handleHorasChange}
                                    />
                                </div>
                            </fieldset>
                        )}
                    </div>

                    <div className="actions">
                        <button type="button" className="btn btn-cancel" onClick={handleCancel}>Cancelar</button>
                        {(tipoPresupuesto.financiero || tipoPresupuesto.horas) && (
                            <button type="button" className="btn btn-confirm" onClick={handleConfirm}>Confirmar</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegistroPresupuesto;
