import { Link } from "react-router-dom";
import { Pagination } from "../../components/shared/Pagination.jsx";
import ProyectosFiltros from "../../components/filtrado/ProyectosFiltros.jsx";
import InvestigadorProyectoFiltros from "../../components/filtrado/InvestigadorProyectoFiltros.jsx";
import { useListadoProyectos } from "../../hooks/proyectoHooks/useListadoProyectos.js";
import { formatearFechaCR } from "../../utils/formatoFechaCR.js";
import "./ListadoProyectos.css";

function ListadoProyectos() {
    const {
        puedeAlternar, vistaActiva, setVistaActiva,
        proyectos, totalElements, totalPages, isLoading, isError,
        filtroProyecto, filtroInv,
        cambiarFiltroProyecto, cambiarFiltroInv, limpiarFiltros,
        pageable, cambiarPagina,
        opcionesTipos, opcionesEstado, opcionesLineas, opcionesRolesProyecto,
    } = useListadoProyectos();

    return (
        <div className="listado-proyectos-page">
            <div className="listado-proyectos-card">

                <h2 className="listado-proyectos-title">
                    {vistaActiva === "mis" ? "Mis proyectos" : "Listado de proyectos"}
                </h2>

                {puedeAlternar && (
                    <div className="listado-switch">
                        <button
                            className={`listado-switch-btn ${vistaActiva === "todos" ? "activo" : ""}`}
                            onClick={() => setVistaActiva("todos")}
                        >
                            Todos los proyectos
                        </button>
                        <button
                            className={`listado-switch-btn ${vistaActiva === "mis" ? "activo" : ""}`}
                            onClick={() => setVistaActiva("mis")}
                        >
                            Mis proyectos
                        </button>
                    </div>
                )}

                <div className="contenedor_proyectos">

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

                    {/* ── Filtros extra investigador ── */}
                    {vistaActiva === "mis" && (
                        <InvestigadorProyectoFiltros
                            filtro={filtroInv}
                            onChange={cambiarFiltroInv}
                            opcionesRoles={opcionesRolesProyecto}
                        />
                    )}

                    <p>Total de proyectos: {totalElements}</p>

                    {isLoading && <p>Cargando proyectos...</p>}
                    {isError   && <p style={{ color: "red" }}>Error al cargar proyectos.</p>}

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

                                    {vistaActiva === "mis" && p.rolProyecto && (
                                        <div className="proyecto_card-inv">
                                            <span className="proyecto_card-rol">{p.rolProyecto}</span>
                                            <span className="proyecto_card-fechas-inv">
                                                {formatearFechaCR(p.fechaInicioInvestigador)}
                                                {p.fechaFinInvestigador ? " — " + formatearFechaCR(p.fechaFinInvestigador) : ""}
                                            </span>
                                        </div>
                                    )}

                                    <Link to={`/ver-proyecto/${p.codigoProyecto}`}>Ver proyecto</Link>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="paginacion">
                    <Pagination
                        page={pageable.page}
                        totalPages={totalPages}
                        totalElements={totalElements}
                        onPageChange={cambiarPagina}
                    />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListadoProyectos;