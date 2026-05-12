import { useState } from "react";
import { formatearFechaCR } from "../../utils/formatoFechaCR.js";
import { descargarArchivo } from "../../services/exportServices/exportService.js";
import ProyectosFiltros from "../../components/filtrado/ProyectosFiltros.jsx";
import { Pagination } from "../../components/shared/Pagination.jsx";
import { useListadoPresupuestos } from "../../hooks/exportHooks/useListadoPresupuestos.js";
import { useExportarPresupuestos } from "../../hooks/exportHooks/mutations/useExport.js";
import "./ReporteInvestigadoresParticipantes.css";
import "./ReportesPresupuesto.css";
import PresupuestoResumen from "../../components/presupuestoComponents/PresupuestoResumen.jsx";
import PresupuestoFiltrosReporte from "../../components/filtrado/PresupuestoFiltrosReporte.jsx";
import {notify} from "../../utils/ui/notify.jsx";

function ReportePresupuestos() {
    const {
        data, totalElements, totalPages, isLoading, isError,
        filtroProyecto, cambiarFiltroProyecto,
        filtroPresupuesto, cambiarFiltroPresupuesto,
        limpiarFiltros, pageable, cambiarPagina,
        opcionesTipos, opcionesEstado, opcionesLineas,
        opcionesTiposPresupuesto, opcionesFuentes, opcionesCategorias
    } = useListadoPresupuestos();

    const [formato, setFormato] = useState("docx");
    const { mutateAsync: exportar, isPending } = useExportarPresupuestos();

    const handleExportar = async () => {
        try {
            const blob = await exportar({ filtroProyecto, filtroPresupuesto, formato });
            descargarArchivo(blob, `reporte_presupuestos.${formato}`);

            notify.success("Reporte de presupuestos generado!")
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="listado-proyectos-page">
            <div className="listado-proyectos-card">

                <h2>Reporte de Presupuestos</h2>

                <ProyectosFiltros
                    filtros={filtroProyecto}
                    onChange={cambiarFiltroProyecto}
                    onClear={limpiarFiltros}
                    opcionesLineas={opcionesLineas}
                    opcionesTipos={opcionesTipos}
                    opcionesEstado={opcionesEstado}
                />

                <PresupuestoFiltrosReporte
                    filtros={filtroPresupuesto}
                    onChange={cambiarFiltroPresupuesto}
                    opcionesTiposPresupuesto={opcionesTiposPresupuesto}
                    opcionesFuentes={opcionesFuentes}
                    opcionesCategorias={opcionesCategorias}
                />

                <p>Total de proyectos: {totalElements}</p>

                <div className="cert-export">
                    <select className={"cert-select"} value={formato} onChange={e => setFormato(e.target.value)}>
                        <option value="docx">Word</option>
                        <option value="pdf">PDF</option>
                        <option value="xlsx">Excel</option>
                    </select>
                    <button className="cert-btn-export"  data-testid="btn-exportar" onClick={handleExportar} disabled={isPending}>
                        {isPending ? "Exportando..." : "Exportar"}
                    </button>
                </div>

                {isLoading && <p>Cargando...</p>}
                {isError && <p style={{ color: "red" }}>Error al cargar.</p>}

                <section className="lista-participantes">

                    {!isLoading && data.length === 0 && <p>No hay resultados.</p>}

                    {data.map(item => (
                        <div key={item.proyecto.codigoProyecto} className="presupuesto-card">

                            <h3>{item.proyecto.codigoProyecto}</h3>
                            <p><b>Nombre:</b> {item.proyecto.nombreProyecto}</p>
                            <p>
                                <b>Período:</b>{" "}
                                {formatearFechaCR(item.proyecto.fechaInicio)} —{" "}
                                {formatearFechaCR(item.proyecto.fechaFinalizacion)}
                            </p>

                            {item.presupuestos.length > 0 ? (
                                item.presupuestos.map((p, index) => (
                                    <PresupuestoResumen
                                        key={index}
                                        presupuesto={p}
                                    />
                                ))
                            ) : (
                                <p className="sin-presupuestos">
                                    <br/>
                                    Este proyecto no tiene presupuestos registrados.
                                    <br/>
                                    <br/>

                                </p>
                            )}

                            {item.restantes > 0 && (
                                <p className="mas-presupuestos">+{item.restantes} más</p>
                            )}

                        </div>
                    ))}
                </section>

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

export default ReportePresupuestos;