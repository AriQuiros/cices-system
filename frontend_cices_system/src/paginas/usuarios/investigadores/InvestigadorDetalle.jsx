// src/paginas/usuarios/investigadores/InvestigadorDetalle.jsx
import { useInvestigadorDetalle } from "../../../modules/persona/hooks/queries/useInvestigadorDetalle.js";
import { RolChips } from "../../../modules/persona/components/RolChips.jsx";
import { colorPorEstado } from "../../../modules/formacion/hooks/useConsultaCertificaciones.js";
import { formatearFechaCR } from "../../../utils/formatoFecha.js";
import "./InvestigadorDetalle.css";

export default function InvestigadorDetalle({ identificacion, onClose }) {

    const { data: raw, isLoading, isError } = useInvestigadorDetalle(identificacion);
    const detalle = raw?.data ?? raw;

    if (isLoading) {
        return (
            <div className="id-modal-overlay">
                <div className="id-modal-card">
                    <p>Cargando...</p>
                </div>
            </div>
        );
    }

    if (isError || !detalle) {
        return (
            <div className="id-modal-overlay">
                <div className="id-modal-card">
                    <p style={{ color: "red" }}>Error al cargar el detalle.</p>
                    <button className="id-btn-cerrar" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        );
    }

    const persona = detalle.investigador?.persona ?? {};
    const inv     = detalle.investigador ?? {};

    return (
        <div className="id-modal-overlay" onClick={onClose}>
            <div className="id-modal-card" onClick={e => e.stopPropagation()}>

                <h2 className="id-modal-title">{persona.nombreCompleto}</h2>

                <div className="id-top-grid">

                    {/* Información básica */}
                    <section className="id-section-card">
                        <h3 className="id-section-title">Información básica</h3>
                        <div className="id-basic-grid">
                            <p><b>Identificación:</b> {persona.identificacion}</p>
                            <p><b>País:</b> {persona.pais}</p>
                            <p><b>Correo:</b> {persona.correo}</p>
                            <p><b>Teléfono:</b> {persona.numeroTelefono}</p>
                            <p><b>Grado:</b> {persona.gradoAcademico}</p>
                            <p><b>Institución:</b> {inv.institucionOrigen}</p>
                            <p><b>Unidad:</b> {inv.unidadAcademica}</p>
                            <p><b>Tema interés:</b> {inv.temaInteres}</p>
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <RolChips roles={persona.roles} />
                        </div>
                    </section>

                    {/* Proyectos */}
                    <section className="id-section-card">
                        <h3 className="id-section-title">Proyectos</h3>
                        {(detalle.proyectos || []).length === 0
                            ? <p className="id-vacio">Sin proyectos registrados.</p>
                            : (
                                <ul className="id-list">
                                    {detalle.proyectos.map((p, i) => (
                                        <li key={i}>{p}</li>
                                    ))}
                                </ul>
                            )
                        }
                    </section>

                </div>

                {/* Certificaciones */}
                <section className="id-section-card id-certificaciones-section">
                    <h3 className="id-section-title">Certificaciones</h3>

                    <div className="id-cert-row id-cert-header">
                        <span>Nombre / Institución</span>
                        <span>Tipo</span>
                        <span>Estado</span>
                        <span>Fecha vencimiento</span>
                    </div>

                    {(detalle.certificaciones || []).length === 0
                        ? <p className="id-vacio">Sin certificaciones.</p>
                        : detalle.certificaciones.map((c, i) => {
                            const estilos = colorPorEstado(c.estado);
                            return (
                                <div key={i} className="id-cert-row">
                                    <div>{c.nombre} — {c.institucion}</div>
                                    <div>{c.tipo}</div>
                                    <div className="id-estado-cell">
                                        <span
                                            className="id-estado-dot"
                                            style={{ backgroundColor: estilos.color }}
                                        />
                                        <span style={{ color: estilos.color }}>{c.estado}</span>
                                    </div>
                                    <div>{formatearFechaCR(c.fecha)}</div>
                                </div>
                            );
                        })
                    }
                </section>

                {/* Títulos */}
                <section className="id-section-card id-titulos-section">
                    <h3 className="id-section-title">Títulos</h3>
                    {(detalle.titulos || []).length === 0
                        ? <p className="id-vacio">Sin títulos registrados.</p>
                        : (
                            <ul className="id-list">
                                {detalle.titulos.map((t, i) => (
                                    <li key={i}>
                                        {t.nombre} — {t.institucion} ({formatearFechaCR(t.fecha)})
                                    </li>
                                ))}
                            </ul>
                        )
                    }
                </section>

                <div className="id-modal-actions">
                    <button className="id-btn-cerrar" onClick={onClose}>Cerrar</button>
                </div>

            </div>
        </div>
    );
}