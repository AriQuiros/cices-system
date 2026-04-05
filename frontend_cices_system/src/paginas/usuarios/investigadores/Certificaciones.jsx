import React, { useContext, useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { useTiposCatalogo } from "../../../hooks/useTiposCatalogo";
import { useDebounce } from "../../../hooks/useDebounce";
import { AppContext } from "../../../context/AppContext.jsx";
import "../../../styles/paginas.css";

// Agrupamiento se mantiene en frontend
const agruparPorInvestigador = (data, ordenFecha = "desc") => {
    const grouped = data.reduce((acc, cert) => {
        const key = cert.identificacionInvestigador;
        if (!acc[key]) {
            acc[key] = {
                identificacion: key,
                nombre: cert.nombreInvestigador,
                certificaciones: [],
            };
        }
        acc[key].certificaciones.push(cert);
        return acc;
    }, {});

    Object.values(grouped).forEach((g) => {
        g.certificaciones.sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);
            return ordenFecha === "desc" ? fechaB - fechaA : fechaA - fechaB;
        });
    });

    return grouped;
};

export default function CertificacionesPage() {
    const { token } = useContext(AppContext);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [formato, setFormato] = useState("pdf");
    const [exportando, setExportando] = useState(false);
    const [certificaciones, setCertificaciones] = useState([]);
    const [filtros, setFiltros] = useState({
        nombre: "",
        tipos: [],
        estados: [],
    });

    const [agrupado, setAgrupado] = useState(false);
    const [ordenFecha, setOrdenFecha] = useState("asc");

    const nombreDebounced = useDebounce(filtros.nombre, 400);

    const { tipos: catalogos } = useTiposCatalogo(token, [
        "TIPO_CERTIFICACION",
        "ESTADO_CERTIFICACION",
    ]);

    useEffect(() => {
        fetch(`/api/reports/certificaciones/filtrar?page=${page}&size=12`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre: nombreDebounced,
                tipos: filtros.tipos.map(t => t.value),
                estados: filtros.estados.map(e => e.value),
                ordenFecha: ordenFecha
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setCertificaciones(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(console.error);
    }, [nombreDebounced, filtros.tipos, filtros.estados, ordenFecha, page]);

    useEffect(() => {
        setPage(0);
    }, [nombreDebounced, filtros.tipos, filtros.estados, ordenFecha]);

    // Resumen (sobre datos del backend)
    const resumen = useMemo(() => {
        const total = certificaciones.length;

        const porEstado = certificaciones.reduce((acc, cert) => {
            const estado = cert.estado || "SIN ESTADO";
            acc[estado] = (acc[estado] || 0) + 1;
            return acc;
        }, {});

        return { total, porEstado };
    }, [certificaciones]);

    // Agrupamiento opcional
    const agrupadas = agrupado
        ? Object.values(agruparPorInvestigador(certificaciones, ordenFecha))
        : null;

    const handleExportar = async () => {
        try {
            setExportando(true);

            const response = await fetch(
                `/api/reports/certificaciones/reporte?formato=${formato}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nombre: nombreDebounced,
                        tipos: filtros.tipos.map(t => t.value),
                        estados: filtros.estados.map(e => e.value),
                        ordenFecha: ordenFecha
                    }),
                }
            );

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;

            a.download = `certificaciones.${formato}`;
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        } finally {
            setExportando(false);
        }
    };

    return (
        <div className="cert-page">
            <div className="cert-card">
                <h1 className="cert-title">Certificaciones</h1>

                {/* Controles */}
                <div className="cert-controls">
                    <label className="cert-checkbox-label">
                        <input
                            type="checkbox"
                            checked={agrupado}
                            onChange={(e) => setAgrupado(e.target.checked)}
                        />
                        Agrupar por investigador
                    </label>

                    <div className="cert-order-group">
                        <label className="cert-label">Orden por fecha:</label>
                        <select
                            className="cert-select"
                            value={ordenFecha}
                            onChange={(e) => setOrdenFecha(e.target.value)}
                        >
                            <option value="desc">Más recientes primero</option>
                            <option value="asc">Más antiguas primero</option>
                        </select>
                    </div>
                </div>

                {/* Filtros */}
                <div className="cert-filters-grid">
                    <div className="cert-field">
                        <label className="cert-label">Nombre Investigador:</label>
                        <input
                            placeholder={"Nombre..."}
                            className="cert-input"
                            type="text"
                            value={filtros.nombre}
                            onChange={(e) =>
                                setFiltros((prev) => ({
                                    ...prev,
                                    nombre: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className="cert-field">
                        <label className="cert-label">Tipo Certificación:</label>
                        <Select
                            isMulti
                            options={catalogos?.TIPO_CERTIFICACION?.map(({ valor, despliegue }) => ({
                                value: valor,
                                label: despliegue,
                            }))}
                            value={filtros.tipos}
                            onChange={(selected) =>
                                setFiltros((prev) => ({ ...prev, tipos: selected }))
                            }
                        />
                    </div>

                    <div className="cert-field">
                        <label className="cert-label">Estado Certificación:</label>
                        <Select
                            isMulti
                            options={catalogos?.ESTADO_CERTIFICACION?.map(({ valor, despliegue }) => ({
                                value: valor,
                                label: despliegue,
                            }))}
                            value={filtros.estados}
                            onChange={(selected) =>
                                setFiltros((prev) => ({ ...prev, estados: selected }))
                            }
                        />
                    </div>
                </div>

                {/* Resumen */}
                <div className="cert-summary-header">
                    <h3 className="cert-summary-title">Resumen</h3>

                    <div className="cert-export">
                        <select
                            value={formato}
                            onChange={(e) => setFormato(e.target.value)}
                            className="cert-select"
                        >
                            <option value="pdf">PDF</option>
                            <option value="xlsx">Excel</option>
                            <option value="docx">Word</option>
                        </select>

                        <button
                            className="cert-btn-export"
                            onClick={handleExportar}
                            disabled={exportando}
                        >
                            {exportando ? "Exportando..." : "Exportar"}
                        </button>
                    </div>
                </div>

                <p className="cert-summary-total">
                    <strong>Total:</strong> {resumen.total}
                </p>

                <div className="cert-summary-status">
                    <strong>Por estado:</strong>
                    <ul className="cert-summary-list">
                        {Object.entries(resumen.porEstado).map(([estado, cantidad]) => (
                            <li key={estado}>
                                {estado}: {cantidad}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tabla */}
                <table className="cert-table">
                    <thead>
                    <tr>
                        <th>Investigador</th>
                        <th>Certificación</th>
                        <th>Institución</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Fecha vencimiento</th>
                    </tr>
                    </thead>

                    <tbody>
                    {certificaciones.length === 0 ? (
                        <tr>
                            <td colSpan="6">No se encontraron resultados</td>
                        </tr>
                    ) : agrupado ? (
                        agrupadas.map(({ identificacion, nombre, certificaciones }) => (
                            <React.Fragment key={identificacion}>
                                <tr>
                                    <td rowSpan={certificaciones.length}>{nombre}</td>
                                    <td>{certificaciones[0].nombre}</td>
                                    <td>{certificaciones[0].institucion}</td>
                                    <td>{certificaciones[0].tipo}</td>
                                    <td>{certificaciones[0].estado}</td>
                                    <td>{certificaciones[0].fecha}</td>
                                </tr>

                                {certificaciones.slice(1).map((cert, idx) => (
                                    <tr key={identificacion + idx}>
                                        <td>{cert.nombre}</td>
                                        <td>{cert.institucion}</td>
                                        <td>{cert.tipo}</td>
                                        <td>{cert.estado}</td>
                                        <td>{cert.fecha}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))
                    ) : (
                        certificaciones.map((cert, idx) => (
                            <tr key={idx}>
                                <td>{cert.nombreInvestigador}</td>
                                <td>{cert.nombre}</td>
                                <td>{cert.institucion}</td>
                                <td>{cert.tipo}</td>
                                <td>{cert.estado}</td>
                                <td>{cert.fecha}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
                <div className="cert-pagination">
                    <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                    >
                        ← Anterior
                    </button>

                    <span>
                        Página {page + 1} de {totalPages}
                    </span>

                    <button
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                        disabled={page >= totalPages - 1}
                    >
                        Siguiente →
                    </button>
                </div>
            </div>
        </div>
    );
}