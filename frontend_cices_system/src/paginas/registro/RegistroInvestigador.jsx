import React, {useState} from "react";
import "./RegistroInvestigador.css";

function RegistroInvestigador({onClose}) {
    // Estado inicial: lista de acreditaciones, cada una con texto y fecha vacíos
    const [acreditaciones, setAcreditaciones] = useState([{text: "", date: ""}]);

    // Agrega una nueva fila de acreditación vacía al final de la lista
    const handleAddRow = () => {
        setAcreditaciones([...acreditaciones, {text: "", date: ""}]);
    };

    // Elimina la fila de acreditación en la posición indicada (idx),
    // solo si hay más de una fila en la lista
    const handleRemoveRow = (idx) => {
        if (acreditaciones.length > 1) {
            setAcreditaciones(acreditaciones.filter((_, i) => i !== idx));
        }
    };
    return (
        <div className="overlay">
            <div className="popup">
                <h2>Registro Investigador</h2>
                <form className="form">
                    <input className="input" type="text" placeholder="Institución o Unidad de origen"/>

                    <div className="select-wrap">
                        <select className="select">
                            <option>Grado académico</option>
                            <option>Licenciatura</option>
                            <option>Maestría</option>
                            <option>Doctorado</option>
                        </select>
                        <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m6 9 6 6 6-6" strokeLinecap="round"/>
                        </svg>
                    </div>

                    <div className="rows-group">
                        {acreditaciones.map((_, idx) => (
                            <div className="row" key={idx}>
                                <input className="input" type="text" placeholder="Acreditación o licencia"/>
                                <div className="field with-icon">
                                    <input className="input" type="date"/>
                                </div>
                                {idx === acreditaciones.length - 1 ? (
                                    <button type="button" className="icon-btn" onClick={handleAddRow}>+</button>
                                ) : acreditaciones.length > 1 && (
                                    <button
                                        type="button"
                                        className="icon-btn remove-btn"
                                        onClick={() => handleRemoveRow(idx)}
                                    >
                                        &#10006;
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="actions">
                        <button type="button" className="btn btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-confirm">Confirmar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegistroInvestigador;