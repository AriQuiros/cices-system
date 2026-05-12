import { formatearFechaCR } from "../../utils/formatoFechaCR.js";
import { Pagination } from "../../components/shared/Pagination.jsx";
import "./Notificaciones.css";
import {useNotificacionesPage} from "../../hooks/notificacionHooks/useNotificacionesPage.js";

export default function NotificacionesPage() {
    const {
        data,
        totalPages,
        totalElements,
        isLoading,
        isError,
        filtro,
        cambiarFiltro,
        limpiarFiltros,
        opcionesCategorias,
        pageable,
        cambiarPagina,

        pL,
        pNL,
        pE,

        handleMarcarLeida,
        handleMarcarNoLeida,
        handleEliminar

    } = useNotificacionesPage();

    return (
        <section className="notificaciones-page">
            <div className="notificaciones-card">

                {/* ── FILTROS ── */}
                <div className="notificaciones-filtro-row">

                    <div className="notificaciones-filtro-item">
                        <label className="notificaciones-filtro-label">Tipo</label>
                        <select
                            className="notificaciones-filtro-select"
                            value={filtro.categoria}
                            onChange={e => cambiarFiltro("categoria", e.target.value)}
                        >
                            {opcionesCategorias.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="notificaciones-filtro-item">
                        <label className="notificaciones-filtro-label">Estado</label>
                        <select
                            className="notificaciones-filtro-select"
                            value={filtro.leido == null ? "TODAS" : filtro.leido ? "LEIDAS" : "NO_LEIDAS"}
                            onChange={e => {
                                const v = e.target.value;
                                cambiarFiltro("leido", v === "TODAS" ? null : v === "LEIDAS");
                            }}
                        >
                            <option value="TODAS">Todas</option>
                            <option value="LEIDAS">Leídas</option>
                            <option value="NO_LEIDAS">No leídas</option>
                        </select>
                    </div>

                    <div className="notificaciones-filtro-item">
                        <label className="notificaciones-filtro-label">Buscar</label>
                        <input
                            type="text"
                            className="notificaciones-filtro-select"
                            placeholder="Asunto o mensaje..."
                            value={filtro.busqueda}
                            onChange={e => cambiarFiltro("busqueda", e.target.value)}
                        />
                    </div>

                    <button className="notificaciones-accion-btn" onClick={limpiarFiltros}>
                        Limpiar filtros
                    </button>

                    <label>Total: {totalElements}</label>
                </div>

                {/* ── FEEDBACK ── */}
                {isLoading && <p className="notificaciones-feedback">Cargando...</p>}
                {isError   && <p className="notificaciones-feedback error">Error al cargar.</p>}
                {!isLoading && !isError && data.length === 0 && (
                    <p className="notificaciones-feedback">No hay notificaciones.</p>
                )}

                {/* ── CARDS ── */}
                {!isLoading && data.length > 0 && (
                    <div className="notificaciones-list">
                        {data.map(n => (
                            <article
                                key={n.idNotificacionUsuario}
                                className={`notif-card ${!n.leido ? "unread" : "read"}`}
                            >
                                {/* HEADER */}
                                <div className="notif-card-header">

                                    <div className="notif-card-info">
                        <span className="notif-categoria">
                            {n.categoria || "NOTIFICACIÓN"}
                        </span>

                                        <h3 className="notif-asunto">
                                            {n.asunto || "Sin asunto"}
                                        </h3>
                                    </div>

                                    <span className={`notif-estado ${n.leido ? "leida" : "no-leida"}`}>
                        {n.leido ? "Leída" : "No leída"}
                    </span>
                                </div>

                                {/* BODY */}
                                <div className="notif-card-body">
                                    <p className="notif-mensaje">
                                        {n.mensaje || "Sin mensaje"}
                                    </p>

                                    <p className="notif-fecha">
                                        {formatearFechaCR(n.fechaCreacion)}
                                    </p>
                                </div>

                                {/* FOOTER */}
                                <div className="notif-card-actions">

                                    <button
                                        className="notif-btn primary"
                                        disabled={n.leido || pL}
                                        onClick={() => handleMarcarLeida(n.idNotificacionUsuario)}
                                    >
                                        Marcar leída
                                    </button>

                                    <button
                                        className="notif-btn warning"
                                        disabled={!n.leido || pNL}
                                        onClick={() => handleMarcarNoLeida(n.idNotificacionUsuario)}
                                    >
                                        Marcar no leída
                                    </button>

                                    <button
                                        className="notif-btn danger"
                                        disabled={pE}
                                        onClick={() => handleEliminar(n.idNotificacionUsuario)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <Pagination
                    page={pageable.page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    onPageChange={cambiarPagina}
                />
            </div>
        </section>
    );
}