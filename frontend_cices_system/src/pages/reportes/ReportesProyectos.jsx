// src/paginas/proyecto/ReportesProyectos.jsx
import { useState } from "react";
import { useListadoProyectos } from "../../hooks/proyectoHooks/useListadoProyectos.js";
import { formatearFechaCR } from "../../utils/formatoFechaCR.js";
import {descargarArchivo} from "../../services/exportServices/exportService.js";
import {useExportarProyectos} from "../../hooks/exportHooks/useExport.js";
import ProyectosFiltros from "../../components/filtrado/ProyectosFiltros.jsx"; // reutiliza estilos

function ReportesProyectos() {

    const {
        proyectos,
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
    } = useListadoProyectos();

    const [formato, setFormato] = useState("pdf");
    const { mutateAsync: exportarProyectos, isPending } = useExportarProyectos();

    const handleExportar = async () => {
        try {
            const blob = await exportarProyectos({
                formato,
                filtro: {
                    texto: filtroProyecto.texto,
                    tipos: filtroProyecto.tipos,
                    estado: filtroProyecto.estado,
                    lineas: filtroProyecto.lineas,
                    ordenFecha: filtroProyecto.ordenFecha
                }
            });

            descargarArchivo(blob, `reporte_proyectos.${formato}`);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="listado-proyectos-page">
            <div className="listado-proyectos-card">

                <h2 className="listado-proyectos-title">
                    Reporte de proyectos
                </h2>

                {/* ── Filtros comunes ── */}
                <ProyectosFiltros
                    filtros={filtroProyecto}
                    onChange={cambiarFiltroProyecto}
                    onClear={limpiarFiltros}
                    opcionesLineas={opcionesLineas}
                    opcionesTipos={opcionesTipos}
                    opcionesEstado={opcionesEstado}
                    mostrarOrden={true}
                />

                {/* TOTAL */}
                <p>Total de proyectos: {totalElements}</p>

                {/* EXPORTACIÓN */}
                <div className="listado-export">
                    <select
                        value={formato}
                        onChange={e => setFormato(e.target.value)}
                    >
                        <option value="pdf">PDF</option>
                        <option value="xlsx">Excel</option>
                        <option value="docx">Word</option>
                    </select>

                    <button
                        onClick={handleExportar}
                        disabled={isPending}
                    >
                        {isPending ? "Exportando..." : "Exportar"}
                    </button>
                </div>

                {/* 🔽 ESTADOS */}
                {isLoading && <p>Cargando proyectos...</p>}
                {isError && <p style={{ color: "red" }}>Error al cargar proyectos.</p>}

                {/* 🔽 LISTA */}
                <section className="todosLosProyectos">

                    {!isLoading && !isError && proyectos.length === 0 && (
                        <p>No se encontraron proyectos.</p>
                    )}

                    <div className="label">
                        {proyectos.map(p => (
                            <div key={p.codigoProyecto} className="proyecto_card">

                                <h3>{p.codigoProyecto}</h3>

                                <p><b>Nombre:</b> {p.nombreProyecto}</p>
                                <p><b>Tipo:</b> {p.tipoProyecto}</p>
                                <p><b>Línea:</b> {p.lineaInvestigacion}</p>
                                <p><b>Estado:</b> {p.estado}</p>

                                <p>
                                    {formatearFechaCR(p.fechaInicio)}
                                    {" — "}
                                    {formatearFechaCR(p.fechaFinalizacion)}
                                </p>

                            </div>
                        ))}
                    </div>

                </section>

                {/* 🔽 PAGINACIÓN */}
                <div className="paginacion">

                    <button
                        disabled={pageable.page === 0}
                        onClick={() => cambiarPagina(pageable.page - 1)}
                    >
                        Anterior
                    </button>

                    <span>
                        Página {pageable.page + 1} de {totalPages || 1}
                    </span>

                    <button
                        disabled={pageable.page + 1 >= totalPages}
                        onClick={() => cambiarPagina(pageable.page + 1)}
                    >
                        Siguiente
                    </button>

                </div>

            </div>
        </div>
    );
}

export default ReportesProyectos;