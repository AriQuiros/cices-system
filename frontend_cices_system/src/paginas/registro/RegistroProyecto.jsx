import React, {useState, useEffect} from "react";
import "./RegistroInvestigador.css";

function RegistroInvestigador({onClose}) {
    const [gradosAcademicos, setGradosAcademicos] = useState([]);

    // Estado para los campos del formulario
    const [formData, setFormData] = useState({
        institucion: "",
        unidadAcademica: "",
        gradoAcademico: ""
    });

    // Estado para las acreditaciones
    const [acreditaciones, setAcreditaciones] = useState([{text: "", date: ""}]);

    // Ejemplo de grados académicos
    useEffect(() => {
        fetch("http://localhost:5173/api/catalogos/grados_academicos")
            .then(res => res.json())
            .then(data => setGradosAcademicos(data))
            .catch(err => setGradosAcademicos([]));
    }, []);

    // Maneja cambios en los campos del formulario
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Maneja cambios en las acreditaciones
    const handleAcreditacionChange = (idx, field, value) => {
        const nuevas = acreditaciones.map((ac, i) =>
            i === idx ? {...ac, [field]: value} : ac
        );
        setAcreditaciones(nuevas);
    };

    // Agrega una nueva fila de acreditación vacía
    const handleAddRow = () => {
        setAcreditaciones([...acreditaciones, {text: "", date: ""}]);
    };

    // Elimina la fila de acreditación en la posición indicada
    const handleRemoveRow = (idx) => {
        if (acreditaciones.length > 1) {
            setAcreditaciones(acreditaciones.filter((_, i) => i !== idx));
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes enviar los datos al backend si lo necesitas
        onClose();
    };

    return (
        <div className="overlay">
            <div className="popup">
                <h2>Registro Investigador</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <input
                        className="input"
                        type="text"
                        name="institucion"
                        placeholder="Institución de origen"
                        value={formData.institucion}
                        onChange={handleChange}
                    />
                    <input
                        className="input"
                        type="text"
                        name="unidadAcademica"
                        placeholder="Unidad académica"
                        value={formData.unidadAcademica}
                        onChange={handleChange}
                    />

                    <div className="select-wrap">
                        <select
                            className="select"
                            name="gradoAcademico"
                            value={formData.gradoAcademico}
                            onChange={handleChange}
                        >
                            <option value="">Grado académico</option>
                            {gradosAcademicos && gradosAcademicos.length > 0 && gradosAcademicos.map((grado) => (
                                <option key={grado.id} value={grado.valor}>
                                    {grado.despliegue ? grado.despliegue.charAt(0).toUpperCase() + grado.despliegue.slice(1).toLowerCase() : ""}
                                </option>
                            ))}
                        </select>
                        <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m6 9 6 6 6-6" strokeLinecap="round"/>
                        </svg>
                    </div>

                    <div className="rows-group">
                        {acreditaciones.map((ac, idx) => (
                            <div className="row" key={idx}>
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Acreditación o licencia"
                                    value={ac.text}
                                    onChange={e => handleAcreditacionChange(idx, "text", e.target.value)}
                                />
                                <div className="field with-icon">
                                    <input
                                        className="input"
                                        type="date"
                                        value={ac.date}
                                        onChange={e => handleAcreditacionChange(idx, "date", e.target.value)}
                                    />
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