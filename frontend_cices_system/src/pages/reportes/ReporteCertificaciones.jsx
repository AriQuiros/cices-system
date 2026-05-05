// src/paginas/reportes/ReporteCertificaciones.jsx
import { useState } from "react";
import { useConsultaCertificaciones } from "../../hooks/formacionHooks/useConsultaCertificaciones.js";
import { CertificacionFiltros } from "../../components/filtrado/CertificacionFiltros.jsx";
import { CertificacionResumen } from "../../components/formacionComponents/CertificacionResumen.jsx";
import { CertificacionTabla } from "../../components/formacionComponents/CertificacionTabla.jsx";
import "./ReporteCertificaciones.css";
import {descargarArchivo} from "../../services/exportServices/exportService.js";
import {useExportarCertificaciones} from "../../hooks/exportHooks/mutations/useExport.js";

export default function CertificacionesPage() {

    const [agrupado, setAgrupado] = useState(false);
    const [formato, setFormato] = useState("pdf");
    const { mutateAsync: exportarCertificaciones, isPending } = useExportarCertificaciones();

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
            const blob = await exportarCertificaciones({
                filtro: {
                    investigador: filtro.investigador,
                    nombreCertificacion: filtro.nombreCertificacion,
                    tipos: filtro.tipos,
                    estados: filtro.estados,
                    ordenFecha: filtro.ordenFecha
                },
                formato
            });

            descargarArchivo(blob, `certificaciones.${formato}`);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="cert-page">
            <div className="cert-card">

                <h1 className="cert-title">Certificaciones</h1>

                {/* Filtros */}
                <CertificacionFiltros
                    filtro={filtro}
                    onChange={cambiarFiltro}
                    onLimpiar={limpiarFiltros}
                    opcionesTipos={opcionesTipos}
                    opcionesEstados={opcionesEstados}
                    mostrarInvestigador={true}
                />

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
                            disabled={isPending}
                        >
                            {isPending ? "Exportando..." : "Exportar"}
                        </button>
                    </div>
                </div>

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