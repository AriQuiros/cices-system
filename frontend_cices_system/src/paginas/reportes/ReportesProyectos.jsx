// src/paginas/proyecto/ReportesProyectos.jsx
import { useState } from "react";
import Select from "react-select";
import { useListadoProyectos } from "../../modules/proyecto/hooks/useListadoProyectos.js";
import { formatearFechaCR } from "../../utils/formatoFecha.js";
import {descargarArchivo} from "../../modules/export/services/exportService.js";
import {useExportarProyectos} from "../../modules/export/hook/useExport.js"; // reutiliza estilos

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

    // 🔽 exportación
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

                {/* 🔽 EXPORTACIÓN */}
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

                {/* 🔽 FILTROS (reutilizados del listado) */}
                <div className="buscar row">

                    <input
                        className="buscador"
                        type="text"
                        placeholder="Código o nombre"
                        value={filtroProyecto.texto}
                        onChange={e => cambiarFiltroProyecto("texto", e.target.value)}
                    />

                    <Select
                        classNamePrefix="react-select"
                        options={opcionesLineas}
                        isMulti
                        isClearable
                        value={opcionesLineas.filter(l =>
                            filtroProyecto.lineas?.includes(l.value)
                        )}
                        onChange={opt =>
                            cambiarFiltroProyecto(
                                "lineas",
                                opt ? opt.map(o => o.value) : []
                            )
                        }
                        placeholder="Línea(s) de investigación"
                        closeMenuOnSelect={false}
                    />

                    <Select
                        classNamePrefix="react-select"
                        options={opcionesTipos}
                        isMulti
                        isClearable
                        value={opcionesTipos.filter(t =>
                            filtroProyecto.tipos?.includes(t.value)
                        )}
                        onChange={opt =>
                            cambiarFiltroProyecto(
                                "tipos",
                                opt ? opt.map(o => o.value) : []
                            )
                        }
                        placeholder="Tipo(s) de proyecto"
                        closeMenuOnSelect={false}
                    />

                    <select
                        className="filtro"
                        value={filtroProyecto.estado}
                        onChange={e => cambiarFiltroProyecto("estado", e.target.value)}
                    >
                        <option value="">Estado de proyecto</option>
                        {opcionesEstado.map(op => (
                            <option key={op.value} value={op.value}>
                                {op.label}
                            </option>
                        ))}
                    </select>

                    <select
                        className="filtro"
                        value={filtroProyecto.ordenFecha}
                        onChange={e => cambiarFiltroProyecto("ordenFecha", e.target.value)}
                    >
                        <option value="desc">Más nuevos primero</option>
                        <option value="asc">Más antiguos primero</option>
                    </select>

                    <button
                        className="boton-limpiar"
                        onClick={limpiarFiltros}
                    >
                        Limpiar
                    </button>
                </div>

                {/* 🔽 TOTAL */}
                <p>Total de proyectos: {totalElements}</p>

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