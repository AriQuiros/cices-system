import { useState } from "react";
import { formatearFechaCR } from "../../utils/formatoFechaCR.js";
import { descargarArchivo } from "../../services/exportServices/exportService.js";
import { useExportarParticipantes } from "../../hooks/exportHooks/mutations/useExport.js";
import ProyectosFiltros from "../../components/filtrado/ProyectosFiltros.jsx";
import { Pagination } from "../../components/shared/Pagination.jsx";
import {formatearNumeroCR} from "../../utils/formatoNumeroCR.js";
import {useListadoParticipantes} from "../../hooks/exportHooks/useListadoParticipantes.js";

import "./ReporteInvestigadoresParticipantes.css";
import "./ReporteCertificaciones.css";

function ReportesParticipantes() {

    const {
        data,
        totalElements,
        totalPages,
        isLoading,
        isError,

        filtroProyecto,
        cambiarFiltroProyecto,
        limpiarFiltros,

        pageable,
        cambiarPagina,

        opcionesTipos,
        opcionesEstado,
        opcionesLineas
    } = useListadoParticipantes();

    const [formato, setFormato] = useState("pdf");
    const { mutateAsync: exportar, isPending } = useExportarParticipantes();

    const handleExportar = async () => {
        try {
            const blob = await exportar({ formato, filtro: filtroProyecto });
            descargarArchivo(blob, `reporte_participantes.${formato}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="listado-proyectos-page">
            <div className="listado-proyectos-card">

                <h2>Reporte de participantes</h2>

                {/* FILTROS */}
                <ProyectosFiltros
                    filtros={filtroProyecto}
                    onChange={cambiarFiltroProyecto}
                    onClear={limpiarFiltros}
                    opcionesLineas={opcionesLineas}
                    opcionesTipos={opcionesTipos}
                    opcionesEstado={opcionesEstado}
                />

                <p>Total de proyectos: {totalElements}</p>

                {/* EXPORT */}
                <div className="cert-controls">
                <div className="cert-export">
                    <select className="cert-select"
                        value={formato} onChange={e => setFormato(e.target.value)}>
                        <option value="pdf">PDF</option>
                        <option value="xlsx">Excel</option>
                        <option value="docx">Word</option>
                    </select>

                    <button className="cert-btn-export" onClick={handleExportar} disabled={isPending}>
                        {isPending ? "Exportando..." : "Exportar"}
                    </button>
                </div>
                </div>

                {/* ESTADOS */}
                {isLoading && <p>Cargando...</p>}
                {isError && <p style={{ color: "red" }}>Error al cargar.</p>}

                {/* LISTA */}
                <section className="lista-participantes">

                    {!isLoading && data.length === 0 && (
                        <p>No hay resultados.</p>
                    )}

                    {data.map(item => (
                        <div key={item.proyecto.codigoProyecto} className="participante-card">

                            {/* ENCABEZADO */}
                            <h3>{item.proyecto.codigoProyecto}</h3>

                            <p><b>Nombre:</b> {item.proyecto.nombreProyecto}</p>

                            <p>
                                <b>Periodo:</b>{" "}
                                {formatearFechaCR(item.proyecto.fechaInicio)} —{" "}
                                {formatearFechaCR(item.proyecto.fechaFinalizacion)}
                            </p>

                            {item.participantes.length > 0 ? (
                                <table className="tabla-participantes">
                                    <thead>
                                    <tr>
                                        <th>Investigador</th>
                                        <th>Rol</th>
                                        <th>Participación</th>
                                        <th>Modalidad</th>
                                        {/*<th>Carga</th>*/}
                                        <th>Horas/mes</th>
                                        <th>Meses</th>
                                        <th>Total horas</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {item.participantes.map(p => (
                                        <tr key={p.idInvestigadorProyecto}>
                                            <td>{p.investigador}</td>

                                            <td>
                        <span className={`badge-rol ${p.rolProyecto?.toLowerCase()}`}>
                            {p.rolProyecto}
                        </span>
                                            </td>

                                            <td>
                                                {formatearFechaCR(p.fechaInicio)} -{" "}
                                                {p.fechaFin ? formatearFechaCR(p.fechaFin) : "—"}
                                            </td>

                                            <td>{p.modalidad || "N/A"}</td>
                                            {/* <td>{p.cargaAcademica || "N/A"}</td>*/}
                                            <td>{p.horasMes || "N/A"}</td>
                                            <td>{p.meses || "N/A"}</td>

                                            <td>
                                                <b>{formatearNumeroCR(p.totalHorasAsignadas) || "N/A"}</b>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="sin-participantes">
                                    Este proyecto no tiene participantes.
                                    <br/>
                                    <br/>
                                </p>
                            )}

                            {/* +N MÁS */}
                            {item.restantes > 0 && (
                                <p className="mas-participantes">
                                    +{item.restantes} más
                                </p>
                            )}

                        </div>
                    ))}

                </section>

                {/* PAGINACIÓN */}
                <Pagination
                    page={pageable.page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    onPageChange={cambiarPagina}
                />

            </div>
        </div>
    );
}

export default ReportesParticipantes;