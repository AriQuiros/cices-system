// src/paginas/reportes/Certificaciones.jsx
import { useState } from "react";
import { Pagination } from "../../components/ui/Pagination.jsx";
import { useConsultaCertificaciones } from "../../modules/formacion/hooks/useConsultaCertificaciones.js";
import { CertificacionFiltros } from "../../modules/formacion/components/CertificacionFiltros.jsx";
import { CertificacionResumen } from "../../modules/formacion/components/CertificacionResumen.jsx";
import { CertificacionTabla } from "../../modules/formacion/components/CertificacionTabla.jsx";
import "./Certificaciones.css";

export default function CertificacionesPage() {

    const [agrupado, setAgrupado] = useState(false);
    const [formato, setFormato] = useState("pdf");
    const [exportando, setExportando] = useState(false);

    const {
        certificaciones,
        totalElements,
        totalPages,
        isLoading,
        filtro,
        cambiarFiltro,
        limpiarFiltros,
        pageable,
        cambiarPagina,
        opcionesTipos,
        opcionesEstados,
        resumenEstados,
        agruparPorInvestigador
    } = useConsultaCertificaciones("todas");

    const handleExportar = async () => {
        try {
            setExportando(true);
            const response = await fetch(
                `/api/reports/certificaciones/reporte?formato=${formato}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        investigador:        filtro.investigador,
                        nombreCertificacion: filtro.nombreCertificacion,
                        tipos:               filtro.tipos,
                        estados:             filtro.estados,
                        ordenFecha:          filtro.ordenFecha
                    })
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

                {/* Controles generales */}
                <div className="cert-controls">
                    <label className="cert-checkbox-label">
                        <input
                            type="checkbox"
                            checked={agrupado}
                            onChange={e => setAgrupado(e.target.checked)}
                        />
                        Agrupar por investigador
                    </label>

                    <div className="cert-export">
                        <select
                            className="cert-select"
                            value={formato}
                            onChange={e => setFormato(e.target.value)}
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

                {/* Filtros */}
                <CertificacionFiltros
                    filtro={filtro}
                    onChange={cambiarFiltro}
                    onLimpiar={limpiarFiltros}
                    opcionesTipos={opcionesTipos}
                    opcionesEstados={opcionesEstados}
                    mostrarInvestigador={true}
                />

                {/* Resumen */}
                <CertificacionResumen
                    totalElements={totalElements}
                    resumenEstados={resumenEstados}
                />

                {isLoading && <p className="cert-cargando">Cargando...</p>}

                {/* Tabla */}
                <CertificacionTabla
                    certificaciones={certificaciones}
                    mostrarInvestigador={true}
                    agrupado={agrupado}
                    agruparFn={agruparPorInvestigador}
                    ordenFecha={filtro.ordenFecha}
                />

                {/* Paginación */}
                <div className="cert-pagination">
                    <button
                        disabled={pageable.page === 0}
                        onClick={() => cambiarPagina(pageable.page - 1)}
                    >
                        ← Anterior
                    </button>
                    <span>Página {pageable.page + 1} de {totalPages || 1}</span>
                    <button
                        disabled={pageable.page >= totalPages - 1}
                        onClick={() => cambiarPagina(pageable.page + 1)}
                    >
                        Siguiente →
                    </button>
                </div>

            </div>
        </div>
    );
}