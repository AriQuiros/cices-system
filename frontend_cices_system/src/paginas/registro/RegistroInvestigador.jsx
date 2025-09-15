import React, {useState, useEffect} from "react";
import "./RegistroInvestigador.css";

function RegistroInvestigador({onClose, onConfirm}) {
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

    // Maneja cambios en las acreditaciones
    const handleAcreditacionChange = (idx, field, value) => {
        const nuevas = acreditaciones.map((ac, i) =>
            i === idx ? {...ac, [field]: value} : ac
        );
        setAcreditaciones(nuevas);
    };
    // Estado para los grados académicos
    const [gradosAcademicos, setGradosAcademicos] = useState([]);

    // Estado para los campos del formulario
    const [formData, setFormData] = useState({
        institucion: "",
        unidadAcademica: "",
        gradoAcademico: ""
    });

    // Estado para las acreditaciones
    const [acreditaciones, setAcreditaciones] = useState([{text: "", date: ""}]);

    // Estado para mostrar el mensaje de error
    const [showError, setShowError] = useState(false);
    // Estado para controlar la animación/desaparición de la burbuja
    const [errorBubbleVisible, setErrorBubbleVisible] = useState(false);

    // Validación de campos obligatorios
    const camposObligatoriosCompletos =
        formData.institucion.trim() !== "" &&
        formData.unidadAcademica.trim() !== "" &&
        formData.gradoAcademico !== "";

    // Maneja cambios en los campos del formulario
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!camposObligatoriosCompletos) {
            setShowError(true);
            setErrorBubbleVisible(true);
            // Oculta la burbuja después de 2.5 segundos
            setTimeout(() => {
                setErrorBubbleVisible(false);
            }, 5000);
            return;
        }
        setShowError(false);
        setErrorBubbleVisible(false);
        // Envía los datos completos al padre
        onConfirm({
            institucion: formData.institucion,
            unidadAcademica: formData.unidadAcademica,
            gradoAcademico: formData.gradoAcademico,
            acreditaciones: acreditaciones.filter(ac => ac.text || ac.date)
        });
    };

    useEffect(() => {
        fetch("http://localhost:5173/api/catalogos/grados_academicos")
            .then(res => res.json())
            .then(data => setGradosAcademicos(data));
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.35)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Burbuja de error flotante */}
            {errorBubbleVisible && (
                <div style={{
                    position: 'absolute',
                    top: '8%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#d32f2f',
                    color: '#fff',
                    padding: '12px 28px',
                    borderRadius: '24px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                    zIndex: 10000,
                    transition: 'opacity 0.3s',
                    opacity: errorBubbleVisible ? 1 : 0
                }}>
                    Debe completar institución de origen, unidad académica y grado académico para confirmar.
                </div>
            )}
            <div style={{
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                padding: '32px 28px',
                minWidth: '350px',
                maxWidth: '95vw',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative'
            }}>
                <h2 style={{textAlign: 'center', marginBottom: '18px'}}>Registro Investigador</h2>
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
                                <option key={grado.id} value={grado.id}>
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