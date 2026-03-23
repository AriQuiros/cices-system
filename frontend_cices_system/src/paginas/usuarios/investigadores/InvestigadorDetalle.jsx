import { useEffect, useState } from "react";
import axios from "axios";
import "../../../styles/paginas.css";

export default function InvestigadorDetalle({ investigador, onClose }) {

    const [detalle, setDetalle] = useState(null);

    useEffect(() => {
        cargarDetalle();
    }, []);

    const cargarDetalle = async () => {
        const res = await axios.get(
            `/api/reports/investigadores/${investigador.identificacion}`
        );

        setDetalle(res.data);
    };

    if (!detalle) return null;

    return (
        <div className="id-modal-overlay">

            <div className="id-modal-card">

                <h2 className="id-modal-title">
                    {investigador.nombreCompleto}
                </h2>

                {/* FILA SUPERIOR */}
                <div className="id-top-grid">

                    {/* INFORMACION BASE */}
                    <section className="id-section-card">
                        <h3 className="id-section-title">
                            Información básica
                        </h3>

                        <div className="id-basic-grid">
                            <p><b>Identificación:</b> {investigador.identificacion}</p>
                            <p><b>País:</b> {investigador.pais}</p>
                            <p><b>Correo:</b> {investigador.correo}</p>
                            <p><b>Teléfono:</b> {investigador.numeroTelefono}</p>
                            <p><b>Grado:</b> {investigador.gradoAcademico}</p>
                            <p><b>Institución:</b> {investigador.institucionOrigen}</p>
                            <p><b>Unidad:</b> {investigador.unidadAcademica}</p>
                            <p><b>Tema interés:</b> {investigador.temaInteres}</p>
                        </div>
                    </section>

                    {/* PROYECTOS */}
                    <section className="id-section-card">
                        <h3 className="id-section-title">
                            Proyectos
                        </h3>

                        <ul className="id-list">
                            {(detalle.proyectos || []).map(p => (
                                <li key={p.codigoProyecto}>
                                    {p.codigoProyecto} - {p.nombreProyecto}
                                </li>
                            ))}
                        </ul>
                    </section>

                </div>

                {/* CERTIFICACIONES */}
                <section className="id-section-card id-certificaciones-section">
                    <h3 className="id-section-title">
                        Certificaciones
                    </h3>

                    {/* encabezado */}
                    <div className="id-cert-row id-cert-header">
                        <span>Información</span>
                        <span>Tipo</span>
                        <span>Estado</span>
                    </div>

                    {(detalle.certificaciones || []).map((c, i) => {

                        const estado = c.estado?.toUpperCase();

                        let estadoClass = "id-estado-neutro";

                        if (estado === "VIGENTE") estadoClass = "id-estado-vigente";
                        if (estado === "PROXIMA A VENCER") estadoClass = "id-estado-proxima";
                        if (estado === "VENCIDA") estadoClass = "id-estado-vencida";

                        return (
                            <div key={i} className="id-cert-row">

                                {/* INFORMACION */}
                                <div>
                                    {c.nombre} - {c.institucion} ({c.fecha})
                                </div>

                                {/* TIPO */}
                                <div className="id-tipo-cell">
                                    <span>{c.tipo}</span>
                                </div>
                                {/* ESTADO */}
                                <div className="id-estado-cell">
                                    <span className={`id-estado-dot ${estadoClass}`}></span>
                                    <span>{c.estado}</span>
                                </div>

                            </div>
                        );
                    })}
                </section>

                {/* TITULOS */}
                <section className="id-section-card id-titulos-section">
                    <h3 className="id-section-title">
                        Títulos
                    </h3>

                    <ul className="id-list">
                        {(detalle.titulos || []).map((t, i) => (
                            <li key={i}>
                                {t.nombre} - {t.institucion} ({t.fecha})
                            </li>
                        ))}
                    </ul>
                </section>

                <div className="id-modal-actions">
                    <button
                        className="id-btn-cerrar"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>

            </div>

        </div>
    );
}