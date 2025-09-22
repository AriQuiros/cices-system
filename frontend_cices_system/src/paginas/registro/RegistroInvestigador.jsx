import React, { useEffect, useMemo, useState } from "react";
import "./RegistroInvestigador.css";

function parseLocalDate(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
}
function calcularEstado(expISO) {
    const hoy = new Date(); hoy.setHours(0,0,0,0);
    const exp = parseLocalDate(expISO);
    if (!exp) return null;
    if (exp <= hoy) return 11;               // vencido
    const masUnMes = new Date(hoy); masUnMes.setMonth(masUnMes.getMonth() + 1);
    return exp >= masUnMes ? 9 : 10;         // >1 mes (9) | <1 mes (10)
}

function RegistroInvestigador({ onClose, onConfirm }) {
    // catálogo grados académicos
    const [gradosAcademicos, setGradosAcademicos] = useState([]);
    // formulario base
    const [formData, setFormData] = useState({
        institucion: "",
        unidadAcademica: "",
        gradoAcademico: ""
    });

    // <<< NUEVO >>> lista de certificaciones dinámicas
    const [tipos, setTipos] = useState([]);
    const [loadingTipos, setLoadingTipos] = useState(true);
    const [certificaciones, setCertificaciones] = useState([
        { nombre: "", tipo: "", expiracion: "" }
    ]);

    // UI error burbuja
    const [showError, setShowError] = useState(false);
    const [errorBubbleVisible, setErrorBubbleVisible] = useState(false);
    const [errorForm, setErrorForm] = useState("");

    const hoyISO = useMemo(() => {
        const d = new Date(); d.setHours(0,0,0,0);
        return d.toISOString().slice(0,10);
    }, []);

    const camposObligatoriosCompletos =
        formData.institucion.trim() !== "" &&
        formData.unidadAcademica.trim() !== "" &&
        formData.gradoAcademico !== "";

    // cambios base
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((s) => ({ ...s, [name]: value }));
    };

    // <<< NUEVO >>> cambios en certificaciones
    const handleCertChange = (idx, field, value) => {
        setCertificaciones((arr) =>
            arr.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
        );
    };
    const handleAddCert = () => {
        setCertificaciones((arr) => [...arr, { nombre: "", tipo: "", expiracion: "" }]);
    };
    const handleRemoveCert = (idx) => {
        if (certificaciones.length > 1) {
            setCertificaciones((arr) => arr.filter((_, i) => i !== idx));
        }
    };

    // submit
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorForm("");

        if (!camposObligatoriosCompletos) {
            setShowError(true);
            setErrorBubbleVisible(true);
            setTimeout(() => setErrorBubbleVisible(false), 5000);
            return;
        }

        // valida certificaciones: permite filas vacías, pero si hay datos, todos obligatorios
        for (const c of certificaciones) {
            const filled = c.nombre.trim() || c.tipo || c.expiracion;
            if (filled) {
                if (!c.nombre.trim()) return setErrorForm("Falta el nombre de una certificación.");
                if (!c.tipo) return setErrorForm("Falta el tipo de una certificación.");
                if (!c.expiracion) return setErrorForm("Falta la fecha de expiración en una certificación.");
                if (calcularEstado(c.expiracion) === 11)
                    return setErrorForm("Una certificación tiene fecha ya vencida. Elija una fecha futura.");
            }
        }

        const certsLimpias = certificaciones
            .filter((c) => c.nombre.trim() || c.tipo || c.expiracion)
            .map((c) => ({
                nombreCertificacion: c.nombre.trim(),
                idCodigoTipoCertificacion: Number(c.tipo),
                fechaExpiracion: c.expiracion,
                idCodigoTipoEstado: calcularEstado(c.expiracion)
            }));

        setShowError(false);
        setErrorBubbleVisible(false);

        onConfirm({
            institucion: formData.institucion,
            unidadAcademica: formData.unidadAcademica,
            gradoAcademico: formData.gradoAcademico,
            certificaciones: certsLimpias
        });
    };

    // catálogos
    useEffect(() => {
        fetch("http://localhost:5173/api/catalogos/grados_academicos")
            .then((r) => r.json())
            .then(setGradosAcademicos)
            .catch(() => {});
    }, []);
    useEffect(() => {
        let cancel = false;
        (async () => {
            try {
                const res = await fetch("/api/catalogos/tipos_certificacion");
                const data = res.ok ? await res.json() : [];
                if (!cancel) setTipos(data);
            } catch { if (!cancel) setTipos([]); }
            finally { if (!cancel) setLoadingTipos(false); }
        })();
        return () => { cancel = true; };
    }, []);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.35)', zIndex: 9999, display: 'flex',
            alignItems: 'center', justifyContent: 'center'
        }}>
            {/* Burbuja de error de campos base */}
            {errorBubbleVisible && (
                <div style={{
                    position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)',
                    background: '#d32f2f', color: '#fff', padding: '12px 28px',
                    borderRadius: '24px', fontWeight: 'bold', fontSize: '16px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.18)', zIndex: 10000
                }}>
                    Debe completar institución de origen, unidad académica y grado académico para confirmar.
                </div>
            )}

            <div style={{
                background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                padding: '32px 28px', minWidth: '350px', maxWidth: '95vw',
                maxHeight: '90vh', overflowY: 'auto', position: 'relative'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '18px' }}>Registro Investigador</h2>

                <form className="form" onSubmit={handleSubmit}>
                    {/* Base */}
                    <input
                        className="input" type="text" name="institucion"
                        placeholder="Institución de origen" value={formData.institucion}
                        onChange={handleChange}
                    />
                    <input
                        className="input" type="text" name="unidadAcademica"
                        placeholder="Unidad académica" value={formData.unidadAcademica}
                        onChange={handleChange}
                    />

                    <div className="select-wrap">
                        <select
                            className="select" name="gradoAcademico"
                            value={formData.gradoAcademico} onChange={handleChange}
                        >
                            <option value="">Grado académico</option>
                            {gradosAcademicos.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.despliegue
                                        ? g.despliegue.charAt(0).toUpperCase() + g.despliegue.slice(1).toLowerCase()
                                        : ""}
                                </option>
                            ))}
                        </select>
                        <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m6 9 6 6 6-6" strokeLinecap="round" />
                        </svg>
                    </div>

                    {/* <<< NUEVO >>> Certificaciones dentro del mismo pop-up */}
                    <h3 className="section-title">Certificaciones</h3>

                    <div className="rows-group">
                        {certificaciones.map((c, idx) => (
                            <div className="row" key={idx}>
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Nombre de la certificación"
                                    value={c.nombre}
                                    onChange={(e) => handleCertChange(idx, "nombre", e.target.value)}
                                />

                                <div className="select-wrap">
                                    <select
                                        className="select"
                                        value={c.tipo}
                                        onChange={(e) => handleCertChange(idx, "tipo", e.target.value)}
                                        disabled={loadingTipos || tipos.length === 0}
                                    >
                                        <option value="">{loadingTipos ? "Cargando..." : "Tipo de certificación"}</option>
                                        {tipos.map((t) => (
                                            <option key={t.id} value={t.id}>{t.despliegue}</option>
                                        ))}
                                    </select>
                                    <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="m6 9 6 6 6-6" strokeLinecap="round" />
                                    </svg>
                                </div>

                                <div className="field with-icon">
                                    <input
                                        className="input"
                                        type="date"
                                        value={c.expiracion}
                                        min={hoyISO}
                                        onChange={(e) => handleCertChange(idx, "expiracion", e.target.value)}
                                    />
                                </div>

                                {/* Conserva el +. Quita campos viejos de acreditación. */}
                                {idx === certificaciones.length - 1 ? (
                                    <button type="button" className="icon-btn" onClick={handleAddCert}>+</button>
                                ) : certificaciones.length > 1 && (
                                    <button
                                        type="button"
                                        className="icon-btn remove-btn"
                                        onClick={() => handleRemoveCert(idx)}
                                        aria-label="Quitar certificación"
                                    >
                                        &#10006;
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {errorForm && <p className="form-error">{errorForm}</p>}

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
