// src/components/VincularInvestigador.jsx
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import "./AsignarInvestigador.css";

export default function AsignarInvestigador() {
    const {
        searchInvestigadores,
        searchProyecto,
        listarAsignados,
        listarRolesProyecto,
        agregarAsignacion,
        quitarAsignacion,
        sugerirProyectos,
    } = useContext(AppContext);

    // --- UI local ---
    const [helpOpen, setHelpOpen] = useState(false);

    // Form superior
    const [filtroInv, setFiltroInv] = useState("");
    const [rolId, setRolId] = useState("");
    const [horasMes, setHorasMes] = useState("");
    const [meses, setMeses] = useState("");
    const [ini, setIni] = useState("");
    const [fin, setFin] = useState("");

    // Proyecto
    const [qProyecto, setQProyecto] = useState("");
    const [proyecto, setProyecto] = useState(null);

    // Sugerencias
    const [sugs, setSugs] = useState([]);
    const [showSugs, setShowSugs] = useState(false);

    // Listas
    const [roles, setRoles] = useState([]);
    const [disp, setDisp] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    const [asignadosSrv, setAsignadosSrv] = useState([]);
    const [pendientes, setPendientes] = useState([]);
    const [qAsignados, setQAsignados] = useState("");

    const [loading, setLoading] = useState(false);

    // --- TOASTS ---
    const [toasts, setToasts] = useState([]); // {id, text, variant}
    const dismissToast = (id) =>
        setToasts((ts) => ts.filter((t) => t.id !== id));
    const pushToast = (text, variant = "info", ms = 3800) => {
        const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        setToasts((ts) => [...ts, { id, text, variant }]);
        if (ms > 0) setTimeout(() => dismissToast(id), ms);
    };

    useEffect(() => {
        listarRolesProyecto().then(setRoles).catch(() => setRoles([]));
    }, [listarRolesProyecto]);

    useEffect(() => {
        let alive = true;
        searchInvestigadores(filtroInv).then((r) => alive && setDisp(r || []));
        return () => {
            alive = false;
        };
    }, [filtroInv, searchInvestigadores]);

    useEffect(() => {
        if (!proyecto?.id) {
            setAsignadosSrv([]);
            return;
        }
        let alive = true;
        listarAsignados(proyecto.id, qAsignados).then(
            (r) => alive && setAsignadosSrv(Array.isArray(r) ? r : [])
        );
        return () => {
            alive = false;
        };
    }, [proyecto?.id, qAsignados, listarAsignados]);

    useEffect(() => {
        const q = qProyecto.trim();
        if (!q) {
            setSugs([]);
            setShowSugs(false);
            return;
        }
        const id = setTimeout(async () => {
            try {
                setSugs((await sugerirProyectos(q)) || []);
                setShowSugs(true);
            } catch {
                setSugs([]);
                setShowSugs(false);
            }
        }, 250);
        return () => clearTimeout(id);
    }, [qProyecto, sugerirProyectos]);

    // Cerrar con ESC
    useEffect(() => {
        if (!helpOpen) return;
        const onKey = (e) => {
            if (e.key === "Escape") setHelpOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [helpOpen]);

    const limpiarFormulario = () => {
        setFiltroInv("");
        setRolId("");
        setHorasMes("");
        setMeses("");
        setIni("");
        setFin("");
        setSeleccionado(null);
    };

    const buscarProyecto = async () => {
        setLoading(true);
        try {
            const p = await searchProyecto(qProyecto.trim());
            setProyecto(p);
            setPendientes([]);
            setAsignadosSrv(p ? await listarAsignados(p.id, "") : []);
            if (!p) pushToast("Proyecto no encontrado", "error");
        } catch {
            setProyecto(null);
            setAsignadosSrv([]);
            setPendientes([]);
            pushToast("Error al buscar proyecto", "error");
        } finally {
            setLoading(false);
        }
    };

    function validarFechasYPeriodo({ iniForm, finForm, periodo }) {
        const iniEff = (iniForm || periodo?.ini || "").trim();
        const finEff = (finForm || periodo?.fin || "").trim();
        if (iniEff && finEff && new Date(finEff) < new Date(iniEff)) {
            return { ok: false, msg: "La fecha fin no puede ser menor que la fecha de inicio" };
        }
        if (iniEff && periodo?.ini && new Date(iniEff) < new Date(periodo.ini)) {
            return { ok: false, msg: "Fecha de Inicio fuera del período del proyecto" };
        }
        if (finEff && periodo?.fin && new Date(finEff) > new Date(periodo.fin)) {
            return { ok: false, msg: "Fecha de Fin fuera del período del proyecto" };
        }
        return { ok: true, iniEff, finEff };
    }

    const agregar = () => {
        if (!proyecto) return pushToast("Seleccione un proyecto", "error");
        if (!seleccionado) return pushToast("Seleccione un investigador", "error");
        if (!rolId) return pushToast("Seleccione un rol", "error");

        const yaAsignadoSrv = asignadosSrv.some(
            (a) => String(a.id) === String(seleccionado.id)
        );
        const yaEnPend = pendientes.some(
            (p) => String(p.investigadorId) === String(seleccionado.id)
        );
        if (yaAsignadoSrv || yaEnPend)
            return pushToast("Ese investigador ya está asignado o pendiente", "error");

        const v = validarFechasYPeriodo({
            iniForm: ini,
            finForm: fin,
            periodo: proyecto?.periodo,
        });
        if (!v.ok) return pushToast(v.msg, "error");

        const rolNombre =
            roles.find((r) => String(r.id) === String(rolId))?.nombre ?? "";

        const item = {
            id: `_tmp_${Date.now()}`,
            temp: true,
            investigadorId: seleccionado.id,
            rolId: Number(rolId),
            nombre: seleccionado.nombre,
            rol: rolNombre,
            ini: v.iniEff || "",
            fin: v.finEff || "",
            horasMes: Number(horasMes || 0),
            meses: Number(meses || 1),
            horas: Number(horasMes || 0) * Number(meses || 1),
            estado: "Nuevo",
            periodo: { ini: v.iniEff || "", fin: v.finEff || "" },
        };

        setPendientes((prev) => [...prev, item]);
        pushToast("Añadido a la lista. Recuerde Guardar.", "info");
        limpiarFormulario();
    };

    const quitar = async (row) => {
        if (!proyecto) return;
        if (row?.temp || String(row?.id).startsWith("_tmp_")) {
            setPendientes((prev) => prev.filter((p) => p.id !== row.id));
            return;
        }
        setLoading(true);
        try {
            await quitarAsignacion({ proyectoId: proyecto.id, investigadorId: row.id });
            setAsignadosSrv(await listarAsignados(proyecto.id, qAsignados));
            pushToast("Asignación eliminada", "success");
        } catch {
            pushToast("No fue posible eliminar", "error");
        } finally {
            setLoading(false);
        }
    };

    const onGuardar = async () => {
        if (!proyecto) return pushToast("Seleccione un proyecto", "error");
        if (pendientes.length === 0)
            return pushToast("No hay cambios por guardar", "info");
        setLoading(true);
        try {
            await Promise.all(
                pendientes.map((p) =>
                    agregarAsignacion({
                        proyectoId: proyecto.id,
                        investigadorId: p.investigadorId,
                        rolProyectoId: p.rolId,
                        horasMes: p.horasMes,
                        meses: p.meses,
                        ini: p.ini,
                        fin: p.fin,
                    })
                )
            );
            setPendientes([]);
            setAsignadosSrv(await listarAsignados(proyecto.id, qAsignados));
            pushToast("Cambios guardados", "success");
        } catch {
            pushToast("No fue posible guardar", "error");
        } finally {
            setLoading(false);
        }
    };

    const onCancelar = async () => {
        setPendientes([]);
        if (proyecto?.id)
            setAsignadosSrv(await listarAsignados(proyecto.id, qAsignados));
        limpiarFormulario();
        pushToast("Cambios descartados", "info");
    };

    const filas = [...asignadosSrv, ...pendientes];

    return (
        <div className="aix aix--hassticky">
            {/* keyframes locales para animación */}
            <style>{`@keyframes slideIn{from{transform:translateY(-8px);opacity:.0}to{transform:translateY(0);opacity:1}}`}</style>

            {/* TOASTS */}
            <div style={toastStyles.container} aria-live="polite" aria-atomic="true">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role="status"
                        style={{
                            ...toastStyles.toast,
                            ...(t.variant === "error"
                                ? toastStyles.error
                                : t.variant === "success"
                                    ? toastStyles.success
                                    : toastStyles.info),
                        }}
                        onClick={() => dismissToast(t.id)}
                    >
                        <span style={toastStyles.dot} />
                        <div style={toastStyles.text}>{t.text}</div>
                        <button
                            type="button"
                            style={toastStyles.close}
                            aria-label="Cerrar"
                            onClick={(e) => {
                                e.stopPropagation();
                                dismissToast(t.id);
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {/* Botón fijo de ayuda */}
            <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={helpOpen}
                aria-controls="aixHelpDialog"
                onClick={() => setHelpOpen(true)}
                style={styles.helpBtn}
            >
                Ayuda
            </button>

            {/* Popup de ayuda */}
            {helpOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    id="aixHelpDialog"
                    style={styles.modalBackdrop}
                    onClick={() => setHelpOpen(false)}
                >
                    <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHead}>
                            <h3 style={{ margin: 0 }}>¿Cómo asignar un investigador?</h3>
                            <button
                                type="button"
                                aria-label="Cerrar"
                                onClick={() => setHelpOpen(false)}
                                style={styles.closeBtn}
                            >
                                ×
                            </button>
                        </div>
                        <div style={styles.modalBody}>
                            <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
                                <li style={styles.li}>
                                    En el panel inferior izquierdo <b>“Proyecto Seleccionado”</b>, en la
                                    barra de búsqueda escriba el código del proyecto y presione{" "}
                                    <b>Seleccionar</b>.
                                </li>
                                <li style={styles.li}>
                                    En el panel inferior derecho <b>“Investigadores disponibles”</b>,
                                    busque por nombre y presione <b>Seleccionar</b>.
                                </li>
                                <li style={styles.li}>
                                    Complete los datos del panel superior central y presione{" "}
                                    <b>Agregar</b>.
                                </li>
                                <li style={styles.li}>
                                    Presione <b>Guardar</b>.
                                </li>
                            </ol>
                        </div>
                        <div style={styles.modalFoot}>
                            <button
                                type="button"
                                className="btn btn--blue"
                                onClick={() => setHelpOpen(false)}
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="aix__header">
                <h2>Asignar investigador a este proyecto</h2>
            </div>

            <div className="aix__toolbar">
                <div className="aix__row">
                    <div className="aix__field">
                        <label>Investigador</label>
                        <input placeholder="Nombre" value={filtroInv} disabled />
                    </div>

                    <div className="aix__field">
                        <label>Tipo de Participación</label>
                        <select value={rolId} onChange={(e) => setRolId(e.target.value)}>
                            <option value="">Seleccione</option>
                            {roles.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="aix__field">
                        <label>Carga académica</label>
                        <input
                            placeholder="Ej. 120"
                            inputMode="numeric"
                            value={horasMes}
                            onChange={(e) =>
                                setHorasMes(e.target.value.replace(/[^\d]/g, ""))
                            }
                        />
                    </div>

                    <div className="aix__field">
                        <label>Meses</label>
                        <input
                            placeholder="Ej. 6"
                            inputMode="numeric"
                            value={meses}
                            onChange={(e) => setMeses(e.target.value.replace(/[^\d]/g, ""))}
                        />
                    </div>
                </div>

                <div className="aix__row">
                    <div className="aix__field">
                        <label>Fechas</label>
                        <div className="aix__dates">
                            <div>
                                <span>Inicio</span>
                                <input
                                    type="date"
                                    value={ini}
                                    onChange={(e) => setIni(e.target.value)}
                                />
                            </div>
                            <div>
                                <span>Fin</span>
                                <input
                                    type="date"
                                    value={fin}
                                    onChange={(e) => setFin(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="aix__actions">
                        <button className="btn btn--green" onClick={limpiarFormulario}>
                            Limpiar
                        </button>
                        <button
                            className="btn btn--blue"
                            onClick={agregar}
                            disabled={loading}
                        >
                            Agregar
                        </button>
                    </div>
                </div>
            </div>

            <div className="aix__grid">
                <section className="aix__left">
                    <div className="aix__card">
                        <div className="aix__projectsearch">
                            <label>Proyecto seleccionado</label>
                            <div className="aix__projectsearch__row aix__projectsearch__wrap">
                                <div className="aix__projectsearch__input">
                                    <input
                                        placeholder="Código o Nombre"
                                        value={qProyecto}
                                        onChange={(e) => {
                                            setQProyecto(e.target.value);
                                            setShowSugs(true);
                                        }}
                                        onFocus={() => sugs.length && setShowSugs(true)}
                                        onBlur={() => setTimeout(() => setShowSugs(false), 150)}
                                    />
                                    {showSugs && sugs.length > 0 && (
                                        <ul className="aix__suggest">
                                            {sugs.map((s) => (
                                                <li
                                                    key={s.id}
                                                    onMouseDown={() => {
                                                        setQProyecto(s.codigo);
                                                        setShowSugs(false);
                                                    }}
                                                >
                                                    <span className="aix__suggest-code">{s.codigo}</span>
                                                    <span className="aix__suggest-name">{s.nombre}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <button onClick={buscarProyecto}>Seleccionar</button>
                            </div>
                        </div>

                        {proyecto ? (
                            <div className="aix__project">
                                <div className="aix__project__head">
                                    <h3>
                                        {proyecto.codigo} {proyecto.nombre}
                                    </h3>
                                    <span className="badge badge--green">{proyecto.estado}</span>
                                </div>
                                <div className="aix__project__meta">
                                    <div>
                                        <b>Línea:</b> {proyecto.linea}
                                    </div>
                                    <div>
                                        <b>Período:</b> {fmt(proyecto.periodo?.ini)} -{" "}
                                        {fmt(proyecto.periodo?.fin)}
                                    </div>
                                    <div>
                                        <b>Horas planificadas:</b> {proyecto.horasPlanificadas} h
                                    </div>
                                    <div>
                                        <b>Estado de asignaciones:</b> {proyecto.asignados?.count} asignados -{" "}
                                        {proyecto.asignados?.horas}h comprometidas
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="aix__project --placeholder">
                                Sin proyecto seleccionado
                            </div>
                        )}
                    </div>

                    <div className="aix__card">
                        <div className="aix__assigned__head">
                            <label>Investigadores asignados</label>
                            <div className="aix__projectsearch__row">
                                <input
                                    placeholder="Nombre"
                                    value={qAsignados}
                                    onChange={(e) => setQAsignados(e.target.value)}
                                />
                                <button onClick={() => setQAsignados(qAsignados)}>Buscar</button>
                            </div>
                        </div>

                        <table className="aix__table">
                            <thead>
                            <tr>
                                <th>Investigador</th>
                                <th>Tipo de Participación</th>
                                <th>Período</th>
                                <th>Horas</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {(filas || []).map((a) => (
                                <tr key={a.id}>
                                    <td>{a.nombre}</td>
                                    <td>{a.rol}</td>
                                    <td>
                                        {fmt(a.periodo?.ini)} - {fmt(a.periodo?.fin)}
                                    </td>
                                    <td>{a.horas} h</td>
                                    <td>
                      <span
                          className={`badge ${a.temp ? "badge--blue" : "badge--gray"}`}
                      >
                        {a.estado || "Vigente"}
                      </span>
                                    </td>
                                    <td>
                                        <button className="btn btn--danger" onClick={() => quitar(a)}>
                                            {a.temp ? "Quitar (pend.)" : "Quitar"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {(!filas || filas.length === 0) && (
                                <tr>
                                    <td className="aix__empty" colSpan="6">
                                        No hay asignaciones
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="aix__right">
                    <div className="aix__card">
                        <div className="aix__available__head">
                            <label>Investigadores disponibles</label>
                            <input
                                placeholder="Nombre"
                                value={filtroInv}
                                onChange={(e) => setFiltroInv(e.target.value)}
                            />
                        </div>
                        <ul className="aix__list">
                            {disp.map((i) => (
                                <li
                                    key={i.id}
                                    className={`aix__listitem ${
                                        seleccionado?.id === i.id ? "is-active" : ""
                                    }`}
                                    onClick={() => {
                                        setSeleccionado(i);
                                        setFiltroInv(i.nombre);
                                    }}
                                >
                                    <div className="aix__listitem__name">{i.nombre}</div>
                                    <div className="aix__listitem__unit">Unidad: {i.unidad}</div>
                                    <button
                                        className="btn btn--mini"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSeleccionado(i);
                                            setFiltroInv(i.nombre);
                                        }}
                                    >
                                        Seleccionar
                                    </button>
                                </li>
                            ))}
                            {disp.length === 0 && <li className="aix__empty">Sin resultados</li>}
                        </ul>
                    </div>
                </section>
            </div>

            {/* barra fija inferior */}
            <div className="aix__stickybar">
                <div className="aix__stickybar__inner">
                    <button className="btn btn--gray" onClick={onCancelar}>
                        Cancelar
                    </button>
                    <button
                        className="btn btn--blue"
                        onClick={onGuardar}
                        disabled={loading || pendientes.length === 0}
                    >
                        Guardar {pendientes.length ? `(${pendientes.length})` : ""}
                    </button>
                </div>
            </div>
        </div>
    );
}

function fmt(s) {
    if (!s) return "";
    const [y, m, d] = s.split("-");
    return `${d}/${m}/${y}`;
}

// --- estilos inline mínimos para mantener el JSX autocontenido ---
const styles = {
    helpBtn: {
        position: "fixed",
        top: 150, // bajo el header fijo (~98px)
        right: 16,
        zIndex: 2000,
        padding: "8px 20px",
        borderRadius: 8,
        border: "2px solid #005DA4",
        background: "#fff",
        color: "#005DA4",
        fontWeight: 700,
        cursor: "pointer",
    },
    modalBackdrop: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.4)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
    },
    modalCard: {
        width: "min(720px, 96vw)",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 20px 60px rgba(0,0,0,.25)",
        overflow: "hidden",
    },
    modalHead: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderBottom: "1px solid #e6eef5",
    },
    closeBtn: {
        background: "transparent",
        border: "none",
        fontSize: 24,
        lineHeight: 1,
        cursor: "pointer",
        color: "#2c3e50",
    },
    modalBody: {
        padding: "16px",
        color: "#2c3e50",
        fontSize: 15,
        lineHeight: 1.5,
    },
    modalFoot: {
        padding: "12px 16px",
        borderTop: "1px solid #e6eef5",
        display: "flex",
        justifyContent: "flex-end",
        gap: 8,
    },
    li: { marginBottom: 8 },
};

const toastStyles = {
    container: {
        position: "fixed",
        top: 190,
        right: "14%",                  // centrado horizontal
        transform: "translateX(50%)",  // centrado visual
        zIndex: 4000,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: "min(420px, 90vw)",
        pointerEvents: "none",
    },
    toast: {
        display: "grid",
        gridTemplateColumns: "10px 1fr auto",
        alignItems: "start",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 10,
        boxShadow: "0 10px 30px rgba(0,0,0,.2)",
        pointerEvents: "auto",
        animation: "slideIn .2s ease-out",
    },
    // variantes
    error: {
        borderLeft: "10px solid #E63946",
        background: "#FDECEE",
        border: "1px solid #F8D7DA",
        color: "#7A1C21",
    },
    success: {
        borderLeft: "10px solid #2BA84A",
        background: "#E6F9ED",
        border: "1px solid #C2F0D2",
        color: "#1B5E20",
    },
    info: {
        borderLeft: "10px solid #3A86FF",
        background: "#E6F9ED",
        border: "1px solid #C2F0D2",
        color: "#1B5E20",
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: "50%",
        marginTop: 4,
        background: "currentColor",
        opacity: 0.0,
    },
    text: {
        fontSize: 14,
        lineHeight: 1.35,
        paddingRight: 6,
    },
    close: {
        fontSize: 18,
        lineHeight: 1,
        cursor: "pointer",
        padding: 0,
        background: "transparent",
        border: "none",
        color: "inherit",
    },
};
