import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import "./Notificaciones.css";

const estadoTexto = (valor) => (valor ? "Leida" : "No leida");

const parseDateFlexible = (valor) => {
    if (!valor) return null;

    const texto = String(valor).trim();

    const iso = texto.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
        const fechaIso = new Date(`${iso[1]}-${iso[2]}-${iso[3]}T00:00:00`);
        return Number.isNaN(fechaIso.getTime()) ? null : fechaIso;
    }

    const dmy = texto.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
    if (dmy) {
        const fechaDmy = new Date(`${dmy[3]}-${dmy[2]}-${dmy[1]}T00:00:00`);
        return Number.isNaN(fechaDmy.getTime()) ? null : fechaDmy;
    }

    const fallback = new Date(texto);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
};


const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    const f = parseDateFlexible(fecha) || new Date(fecha);
    if (Number.isNaN(f.getTime())) return fecha;
    return f.toLocaleDateString("es-CR");
};

export default function NotificacionesPage() {
    const { user, token } = useContext(AppContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [accionError, setAccionError] = useState("");
    const [actualizandoId, setActualizandoId] = useState(null);
    const [tipoFiltro, setTipoFiltro] = useState("TODOS");
    const [estadoFiltro, setEstadoFiltro] = useState("TODAS");
    const [ordenFecha, setOrdenFecha] = useState("MAS_ANTIGUA");
    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        if (!user?.username) {
            setNotificaciones([]);
            return;
        }

        let cancelado = false;

        const cargar = async () => {
            setLoading(true);
            setError("");

            try {
                const headers = {
                    "Content-Type": "application/json",
                };

                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }

                const res = await fetch(
                    `/api/reports/notificaciones/usuario/${encodeURIComponent(user.username)}/detalladas`,
                    { headers }
                );

                if (!res.ok) {
                    throw new Error("No se pudieron cargar las notificaciones");
                }

                const data = await res.json();

                if (!cancelado) {
                    setNotificaciones(Array.isArray(data) ? data.filter((n) => n?.eliminado !== true) : []);
                }
            } catch {
                if (!cancelado) {
                    setError("No se pudieron cargar las notificaciones");
                    setNotificaciones([]);
                }
            } finally {
                if (!cancelado) {
                    setLoading(false);
                }
            }
        };

        cargar();

        return () => {
            cancelado = true;
        };
    }, [user?.username, token]);

    useEffect(() => {
        if (!user?.username) return undefined;

        let cancelado = false;

        const refrescar = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                };

                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }

                const res = await fetch(
                    `/api/reports/notificaciones/usuario/${encodeURIComponent(user.username)}/detalladas`,
                    { headers }
                );

                if (!res.ok) {
                    return;
                }

                const data = await res.json();

                if (!cancelado) {
                    setNotificaciones(Array.isArray(data) ? data.filter((n) => n?.eliminado !== true) : []);
                }
            } catch {
                // Ignorar errores transitorios en refrescos por evento.
            }
        };

        const manejarActualizacion = () => {
            refrescar();
        };

        window.addEventListener("notificaciones:actualizadas", manejarActualizacion);

        return () => {
            cancelado = true;
            window.removeEventListener("notificaciones:actualizadas", manejarActualizacion);
        };
    }, [user?.username, token]);

    const llamarAccion = async (idNotificacionUsuario, accion) => {
        if (!user?.username || !idNotificacionUsuario) return;

        setActualizandoId(idNotificacionUsuario);
        setAccionError("");

        try {
            const headers = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            let endpoint = "";
            let method = "PUT";

            if (accion === "leido") {
                endpoint = `/api/reports/notificaciones/usuario/${encodeURIComponent(user.username)}/${idNotificacionUsuario}/leido`;
            } else if (accion === "no-leido") {
                endpoint = `/api/reports/notificaciones/usuario/${encodeURIComponent(user.username)}/${idNotificacionUsuario}/no-leido`;
            } else {
                endpoint = `/api/reports/notificaciones/usuario/${encodeURIComponent(user.username)}/${idNotificacionUsuario}`;
                method = "DELETE";
            }

            const res = await fetch(endpoint, { method, headers });

            if (!res.ok) {
                throw new Error("No se pudo actualizar la notificacion");
            }

            setNotificaciones((prev) =>
                prev
                    .map((n) => {
                        if (n.idNotificacionUsuario !== idNotificacionUsuario) return n;

                        if (accion === "leido") {
                            return {
                                ...n,
                                leido: true,
                                fechaLeido: new Date().toISOString().slice(0, 10),
                            };
                        }

                        if (accion === "no-leido") {
                            return {
                                ...n,
                                leido: false,
                                fechaLeido: null,
                            };
                        }

                        return {
                            ...n,
                            eliminado: true,
                        };
                    })
                    .filter((n) => n?.eliminado !== true)
            );

            window.dispatchEvent(new Event("notificaciones:actualizadas"));
        } catch {
            setAccionError("No se pudo completar la accion");
        } finally {
            setActualizandoId(null);
        }
    };

    const lista = useMemo(() => {
        return notificaciones
            .filter((n) => n?.eliminado !== true)
            .map((n) => {
                const referenciaFecha = n?.fechaObjetivo || n?.fechaCreacion;
                const fechaComparable = parseDateFlexible(referenciaFecha)?.getTime() || 0;

                return {
                    ...n,
                    referenciaFecha,
                    fechaComparable,
                };
            });
    }, [notificaciones]);

    const listaOrdenada = useMemo(() => {
        const copia = [...lista];
        if (ordenFecha === "MAS_RECIENTE") {
            return copia.sort((a, b) => b.fechaComparable - a.fechaComparable);
        }
        return copia.sort((a, b) => a.fechaComparable - b.fechaComparable);
    }, [lista, ordenFecha]);

    const tiposDisponibles = useMemo(() => {
        const tipos = new Set(listaOrdenada.map((n) => n?.tipo || "Otro"));
        return ["TODOS", ...Array.from(tipos).sort()];
    }, [listaOrdenada]);

    const listaFiltrada = useMemo(() => {
        let resultado = [...listaOrdenada];

        if (tipoFiltro !== "TODOS") {
            resultado = resultado.filter((n) => (n?.tipo || "Otro") === tipoFiltro);
        }

        if (estadoFiltro === "LEIDAS") {
            resultado = resultado.filter((n) => n?.leido === true);
        }

        if (estadoFiltro === "NO_LEIDAS") {
            resultado = resultado.filter((n) => n?.leido === false);
        }

        return resultado;
    }, [listaOrdenada, tipoFiltro, estadoFiltro]);

    const etiquetasFiltro = {
        TODOS: "Todos los tipos",
        Informe: "Informe",
        "Acreditacion o licencia": "Acreditación/Licencia",
        "Permiso coordinador": "Permiso Coordinador",
        Otro: "Otro",
    };

    return (
        <section className="notificaciones-page">
            <div className="notificaciones-card">
                <div className="notificaciones-filtro-row">
                    <div className="notificaciones-filtro-item">
                        <label className="notificaciones-filtro-label" htmlFor="filtro-tipo-notificacion">
                            Filtrar por tipo
                        </label>
                        <select
                            id="filtro-tipo-notificacion"
                            className="notificaciones-filtro-select"
                            value={tipoFiltro}
                            onChange={(event) => setTipoFiltro(event.target.value)}
                        >
                            {tiposDisponibles.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {etiquetasFiltro[tipo] || tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="notificaciones-filtro-item">
                        <label className="notificaciones-filtro-label" htmlFor="filtro-estado-notificacion">
                            Filtrar por estado
                        </label>
                        <select
                            id="filtro-estado-notificacion"
                            className="notificaciones-filtro-select"
                            value={estadoFiltro}
                            onChange={(event) => setEstadoFiltro(event.target.value)}
                        >
                            <option value="TODAS">Todas</option>
                            <option value="LEIDAS">Leidas</option>
                            <option value="NO_LEIDAS">No leidas</option>
                        </select>
                    </div>

                    <div className="notificaciones-filtro-item">
                        <label className="notificaciones-filtro-label" htmlFor="orden-fecha-notificacion">
                            Orden por fecha
                        </label>
                        <select
                            id="orden-fecha-notificacion"
                            className="notificaciones-filtro-select"
                            value={ordenFecha}
                            onChange={(event) => setOrdenFecha(event.target.value)}
                        >
                            <option value="MAS_RECIENTE">Mas reciente primero</option>
                            <option value="MAS_ANTIGUA">Mas antigua primero</option>
                        </select>
                    </div>
                    <label> Resultados : {listaFiltrada.length}</label>
                </div>

                {loading && <p className="notificaciones-feedback">Cargando notificaciones...</p>}
                {error && <p className="notificaciones-feedback error">{error}</p>}
                {accionError && <p className="notificaciones-feedback error">{accionError}</p>}

                {!loading && !error && listaOrdenada.length === 0 && (
                    <p className="notificaciones-feedback">No hay notificaciones disponibles.</p>
                )}

                {!loading && !error && listaOrdenada.length > 0 && listaFiltrada.length === 0 && (
                    <p className="notificaciones-feedback">No hay notificaciones para el tipo seleccionado.</p>
                )}

                {!loading && !error && listaFiltrada.length > 0 && (
                    <div className="notificaciones-table-wrap">
                        <table className="notificaciones-table">
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Detalle</th>
                                    <th>Estado</th>
                                    <th>Fecha objetivo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaFiltrada.map((n) => (
                                    <tr key={n.idNotificacionUsuario} className={n?.leido === false ? "row-unread" : ""}>
                                        <td>{n.tipo || "Otro"}</td>
                                        <td>
                                            <ul className="notificaciones-detalle-list">
                                                {(n.detalle || []).map((campo) => (
                                                    <li key={`${n.idNotificacionUsuario}-${campo.label}`}>
                                                        <strong>{campo.label}:</strong> {campo.value || "-"}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td>{estadoTexto(n.leido)}</td>
                                        <td>{formatearFecha(n.referenciaFecha)}</td>
                                        <td>
                                            <div className="notificaciones-acciones">
                                                <button
                                                    type="button"
                                                    className="notificaciones-accion-btn"
                                                    onClick={() => llamarAccion(n.idNotificacionUsuario, "leido")}
                                                    disabled={actualizandoId === n.idNotificacionUsuario || n?.leido === true}
                                                >
                                                    Marcar leida
                                                </button>
                                                <button
                                                    type="button"
                                                    className="notificaciones-accion-btn"
                                                    onClick={() => llamarAccion(n.idNotificacionUsuario, "no-leido")}
                                                    disabled={actualizandoId === n.idNotificacionUsuario || n?.leido === false}
                                                >
                                                    Marcar no leida
                                                </button>
                                                <button
                                                    type="button"
                                                    className="notificaciones-accion-btn danger"
                                                    onClick={() => llamarAccion(n.idNotificacionUsuario, "eliminar")}
                                                    disabled={actualizandoId === n.idNotificacionUsuario}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}
