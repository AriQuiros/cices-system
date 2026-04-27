// src/paginas/proyecto/ListadoProyectos.jsx
import { Link } from "react-router-dom";
import Select from "react-select";
import { Pagination } from "../../components/ui/Pagination.jsx";
import { useListadoProyectos } from "../../modules/proyecto/hooks/useListadoProyectos.js";
import { formatearFechaCR } from "../../utils/formatoFecha.js";
import "./ListadoProyectos.css";

function ListadoProyectos() {

    const {
        puedeAlternar,
        vistaActiva,
        setVistaActiva,

        proyectos,
        totalElements,
        totalPages,
        isLoading,
        isError,

        filtroProyecto,
        filtroInv,
        cambiarFiltroProyecto,
        cambiarFiltroInv,
        limpiarFiltros,

        pageable,
        cambiarPagina,

        opcionesTipos,
        opcionesEstado,
        opcionesLineas,
        opcionesRolesProyecto
    } = useListadoProyectos();

    const titulo = vistaActiva === "mis" ? "Mis proyectos" : "Listado de proyectos";

    return (
        <div className="listado-proyectos-page">
            <div className="listado-proyectos-card">

                <h2 className="listado-proyectos-title">{titulo}</h2>

                {/* ── SWITCH de vista (solo usuarios con doble rol) ── */}
                {puedeAlternar && (
                    <div className="listado-switch">
                        <button
                            className={`listado-switch-btn ${vistaActiva === "mis" ? "activo" : ""}`}
                            onClick={() => setVistaActiva("mis")}
                        >
                            Mis proyectos
                        </button>
                        <button
                            className={`listado-switch-btn ${vistaActiva === "todos" ? "activo" : ""}`}
                            onClick={() => setVistaActiva("todos")}
                        >
                            Todos los proyectos
                        </button>
                    </div>
                )}

                <div className="contenedor_proyectos">

                    {/* ── FILTROS COMUNES (texto, lineas, tipos, estado, fecha) ── */}
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
                            value={opcionesLineas.filter(l => filtroProyecto.lineas?.includes(l.value))}
                            onChange={opt => cambiarFiltroProyecto("lineas", opt ? opt.map(o => o.value) : [])}
                            placeholder="Línea(s) de investigación"
                            closeMenuOnSelect={false}
                        />

                        <Select
                            classNamePrefix="react-select"
                            options={opcionesTipos}
                            isMulti
                            isClearable
                            value={opcionesTipos.filter(t => filtroProyecto.tipos?.includes(t.value))}
                            onChange={opt => cambiarFiltroProyecto("tipos", opt ? opt.map(o => o.value) : [])}
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
                                <option key={op.value} value={op.value}>{op.label}</option>
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

                        <button className="boton-limpiar" onClick={limpiarFiltros}>
                            Limpiar
                        </button>

                    </div>

                    {/* ── FILTROS EXTRA INVESTIGADOR (rol y fechas de participación) ── */}
                    {vistaActiva === "mis" && (
                        <div className="buscar row filtros-inv">

                            <Select
                                classNamePrefix="react-select"
                                options={opcionesRolesProyecto}
                                isClearable
                                value={opcionesRolesProyecto.find(r => r.value === filtroInv.rol) || null}
                                onChange={opt => cambiarFiltroInv("rol", opt?.value || "")}
                                placeholder="Rol en el proyecto"
                            />

                            <div className="filtro-fecha-grupo">
                                <label>Participación desde</label>
                                <input
                                    type="date"
                                    className="filtro"
                                    value={filtroInv.desde || ""}
                                    onChange={e => cambiarFiltroInv("desde", e.target.value || null)}
                                />
                            </div>

                            <div className="filtro-fecha-grupo">
                                <label>Participación hasta</label>
                                <input
                                    type="date"
                                    className="filtro"
                                    value={filtroInv.hasta || ""}
                                    onChange={e => cambiarFiltroInv("hasta", e.target.value || null)}
                                />
                            </div>

                        </div>
                    )}

                    {/* ── TOTAL ── */}
                    <p>Total de proyectos: {totalElements}</p>

                    {/* ── ESTADO ── */}
                    {isLoading && <p>Cargando proyectos...</p>}
                    {isError && <p style={{ color: "red" }}>Error al cargar proyectos.</p>}

                    {/* ── GRID DE TARJETAS ── */}
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

                                    {/* Datos extra solo en vista investigador */}
                                    {vistaActiva === "mis" && p.rolProyecto && (
                                        <div className="proyecto_card-inv">
                                            <span className="proyecto_card-rol">{p.rolProyecto}</span>
                                            <span className="proyecto_card-fechas-inv">
                                                {formatearFechaCR(p.fechaInicioInvestigador)}
                                                {" – "}
                                                {formatearFechaCR(p.fechaFinInvestigador)}
                                            </span>
                                        </div>
                                    )}

                                    <Link to={`/proyectos/${p.codigoProyecto}`}>Ver proyecto</Link>

                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── PAGINACIÓN ── */}
                    <div className="paginacion">
                        <button
                            disabled={pageable.page === 0}
                            onClick={() => cambiarPagina(pageable.page - 1)}
                        >
                            Anterior
                        </button>
                        <span>Página {pageable.page + 1} de {totalPages || 1}</span>
                        <button
                            disabled={pageable.page + 1 >= totalPages}
                            onClick={() => cambiarPagina(pageable.page + 1)}
                        >
                            Siguiente
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ListadoProyectos;