// src/components/AsignarInvestigador.jsx
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
    const [asignadosSrv, setAsignadosSrv] = useState([]); // desde backend
    const [pendientes, setPendientes] = useState([]);     // solo UI
    const [qAsignados, setQAsignados] = useState("");

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        listarRolesProyecto().then(setRoles).catch(() => setRoles([]));
    }, [listarRolesProyecto]);

    useEffect(() => {
        let alive = true;
        searchInvestigadores(filtroInv).then((r) => alive && setDisp(r || []));
        return () => { alive = false; };
    }, [filtroInv, searchInvestigadores]);

    // cargar asignados del servidor
    useEffect(() => {
        if (!proyecto?.id) { setAsignadosSrv([]); return; }
        let alive = true;
        listarAsignados(proyecto.id, qAsignados)
            .then((r) => alive && setAsignadosSrv(Array.isArray(r) ? r : []));
        return () => { alive = false; };
    }, [proyecto?.id, qAsignados, listarAsignados]);

    // sugerencias con debounce
    useEffect(() => {
        const q = qProyecto.trim();
        if (!q) { setSugs([]); setShowSugs(false); return; }
        const id = setTimeout(async () => {
            try { setSugs((await sugerirProyectos(q)) || []); setShowSugs(true); }
            catch { setSugs([]); setShowSugs(false); }
        }, 250);
        return () => clearTimeout(id);
    }, [qProyecto, sugerirProyectos]);

    const limpiarFormulario = () => {
        setFiltroInv(""); setRolId(""); setHorasMes("");
        setMeses(""); setIni(""); setFin("");
        setSeleccionado(null);
    };

    const buscarProyecto = async () => {
        setLoading(true); setMsg("");
        try {
            const p = await searchProyecto(qProyecto.trim());
            setProyecto(p);
            setPendientes([]); // limpiar buffer al cambiar proyecto
            setAsignadosSrv(p ? await listarAsignados(p.id, "") : []);
            if (!p) setMsg("Proyecto no encontrado");
        } catch {
            setProyecto(null); setAsignadosSrv([]); setPendientes([]);
            setMsg("Error al buscar proyecto");
        } finally { setLoading(false); }
    };

    // ---- Validación de fechas y período ----
    function validarFechasYPeriodo({ iniForm, finForm, periodo }) {
        const iniEff = (iniForm || periodo?.ini || "").trim();
        const finEff = (finForm || periodo?.fin || "").trim();

        if (iniEff && finEff && new Date(finEff) < new Date(iniEff)) {
            return { ok: false, msg: "La fecha fin no puede ser menor que la fecha de inicio" };
        }
        if (iniEff && periodo?.ini && new Date(iniEff) < new Date(periodo.ini)) {
            return { ok: false, msg: "Inicio fuera del período del proyecto" };
        }
        if (finEff && periodo?.fin && new Date(finEff) > new Date(periodo.fin)) {
            return { ok: false, msg: "Fin fuera del período del proyecto" };
        }
        return { ok: true, iniEff, finEff };
    }
    // ----------------------------------------

    const agregar = () => {
        setMsg("");
        if (!proyecto) return setMsg("Seleccione un proyecto");
        if (!seleccionado) return setMsg("Seleccione un investigador");
        if (!rolId) return setMsg("Seleccione un rol");

        const yaAsignadoSrv = asignadosSrv.some(a => String(a.id) === String(seleccionado.id));
        const yaEnPend = pendientes.some(p => String(p.investigadorId) === String(seleccionado.id));
        if (yaAsignadoSrv || yaEnPend) return setMsg("Ese investigador ya está asignado o pendiente");

        // validar fechas aquí
        const v = validarFechasYPeriodo({ iniForm: ini, finForm: fin, periodo: proyecto?.periodo });
        if (!v.ok) return setMsg(v.msg);

        const rolNombre = roles.find(r => String(r.id) === String(rolId))?.nombre ?? "";

        const item = {
            id: `_tmp_${Date.now()}`, temp: true,
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
            periodo: { ini: v.iniEff || "", fin: v.finEff || "" }
        };

        setPendientes(prev => [...prev, item]);
        setMsg("Añadido a la lista. Recuerde Guardar.");
        limpiarFormulario();
    };

    const quitar = async (row) => {
        if (!proyecto) return;
        if (row?.temp || String(row?.id).startsWith("_tmp_")) {
            setPendientes(prev => prev.filter(p => p.id !== row.id));
            return;
        }
        setLoading(true);
        try {
            await quitarAsignacion({ proyectoId: proyecto.id, investigadorId: row.id });
            setAsignadosSrv(await listarAsignados(proyecto.id, qAsignados));
        } finally { setLoading(false); }
    };

    // Guardar todo lo pendiente
    const onGuardar = async () => {
        if (!proyecto) return setMsg("Seleccione un proyecto");
        if (pendientes.length === 0) return setMsg("No hay cambios por guardar");
        setLoading(true);
        try {
            await Promise.all(pendientes.map(p =>
                agregarAsignacion({
                    proyectoId: proyecto.id,
                    investigadorId: p.investigadorId,
                    rolProyectoId: p.rolId,
                    horasMes: p.horasMes,
                    meses: p.meses,
                    ini: p.ini,
                    fin: p.fin,
                })
            ));
            setPendientes([]);
            setAsignadosSrv(await listarAsignados(proyecto.id, qAsignados));
            setMsg("Cambios guardados");
        } catch {
            setMsg("No fue posible guardar");
        } finally { setLoading(false); }
    };

    // Cancelar descarta pendientes y recarga server
    const onCancelar = async () => {
        setPendientes([]);
        if (proyecto?.id) setAsignadosSrv(await listarAsignados(proyecto.id, qAsignados));
        limpiarFormulario();
        setMsg("Cambios descartados");
    };

    const filas = [...asignadosSrv, ...pendientes];

    const fechasInvalidas = !validarFechasYPeriodo({
        iniForm: ini, finForm: fin, periodo: proyecto?.periodo
    }).ok;

    return (
        <div className="aix aix--hassticky">
            <div className="aix__header">
                <h2>Asignar investigador a este proyecto</h2>
                {msg && <span className={`aix__msg ${msg.toLowerCase().includes("error") || msg.toLowerCase().includes("menor") || msg.toLowerCase().includes("fuera") ? "aix__msg--error" : ""}`}>{msg}</span>}
                {fechasInvalidas && (
                    <span className="aix__msg aix__msg--error">
            La fecha fin no puede ser menor que la fecha de inicio o fuera del período del proyecto
          </span>
                )}
            </div>

            <div className="aix__toolbar">
                <div className="aix__row">
                    <div className="aix__field">
                        <label>Investigador</label>
                        <input placeholder="Nombre" value={filtroInv}
                               onChange={(e) => setFiltroInv(e.target.value)} />
                    </div>

                    <div className="aix__field">
                        <label>Tipo de Participación</label>
                        <select value={rolId} onChange={(e) => setRolId(e.target.value)}>
                            <option value="">Seleccione</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.id}>{r.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="aix__field">
                        <label>Horas asignadas</label>
                        <input placeholder="Ej. 120" inputMode="numeric"
                               value={horasMes}
                               onChange={(e) => setHorasMes(e.target.value.replace(/[^\d]/g, ""))} />
                    </div>

                    <div className="aix__field">
                        <label>Meses</label>
                        <input placeholder="Ej. 6" inputMode="numeric"
                               value={meses}
                               onChange={(e) => setMeses(e.target.value.replace(/[^\d]/g, ""))} />
                    </div>
                </div>

                <div className="aix__row">
                    <div className="aix__field">
                        <label>Fechas</label>
                        <div className="aix__dates">
                            <div>
                                <span>Inicio</span>
                                <input type="date" value={ini} onChange={(e) => setIni(e.target.value)} />
                            </div>
                            <div>
                                <span>Fin</span>
                                <input type="date" value={fin} onChange={(e) => setFin(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="aix__actions">
                        <button className="btn btn--green" onClick={limpiarFormulario}>Limpiar</button>
                        <button
                            className="btn btn--blue"
                            onClick={agregar}
                            disabled={loading || fechasInvalidas}
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
                                        onChange={(e) => { setQProyecto(e.target.value); setShowSugs(true); }}
                                        onFocus={() => sugs.length && setShowSugs(true)}
                                        onBlur={() => setTimeout(() => setShowSugs(false), 150)}
                                    />
                                    {showSugs && sugs.length > 0 && (
                                        <ul className="aix__suggest">
                                            {sugs.map(s => (
                                                <li key={s.id}
                                                    onMouseDown={() => { setQProyecto(s.codigo); setShowSugs(false); }}>
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
                                    <h3>{proyecto.codigo} {proyecto.nombre}</h3>
                                    <span className="badge badge--green">{proyecto.estado}</span>
                                </div>
                                <div className="aix__project__meta">
                                    <div><b>Línea:</b> {proyecto.linea}</div>
                                    <div><b>Período:</b> {fmt(proyecto.periodo?.ini)} - {fmt(proyecto.periodo?.fin)}</div>
                                    <div><b>Horas planificadas:</b> {proyecto.horasPlanificadas} h</div>
                                    <div><b>Estado de asignaciones:</b> {proyecto.asignados?.count} asignados - {proyecto.asignados?.horas}h comprometidas</div>
                                </div>
                            </div>
                        ) : (
                            <div className="aix__project --placeholder">Sin proyecto seleccionado</div>
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
                                <th>Investigador</th><th>Tipo de Participación</th><th>Período</th><th>Horas</th><th>Estado</th><th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {(filas || []).map((a) => (
                                <tr key={a.id}>
                                    <td>{a.nombre}</td>
                                    <td>{a.rol}</td>
                                    <td>{fmt(a.periodo?.ini)} - {fmt(a.periodo?.fin)}</td>
                                    <td>{a.horas} h</td>
                                    <td>
                    <span className={`badge ${a.temp ? "badge--blue" : "badge--gray"}`}>
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
                                <tr><td className="aix__empty" colSpan="6">No hay asignaciones</td></tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="aix__right">
                    <div className="aix__card">
                        <div className="aix__available__head">
                            <label>Investigadores disponibles</label>
                            <input placeholder="Nombre" value={filtroInv}
                                   onChange={(e) => setFiltroInv(e.target.value)} />
                        </div>
                        <ul className="aix__list">
                            {disp.map((i) => (
                                <li
                                    key={i.id}
                                    className={`aix__listitem ${seleccionado?.id === i.id ? "is-active" : ""}`}
                                    onClick={() => { setSeleccionado(i); setFiltroInv(i.nombre); }}
                                >
                                    <div className="aix__listitem__name">{i.nombre}</div>
                                    <div className="aix__listitem__unit">Unidad: {i.unidad}</div>
                                    <button
                                        className="btn btn--mini"
                                        onClick={(e) => { e.stopPropagation(); setSeleccionado(i); setFiltroInv(i.nombre); }}
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
                    <button className="btn btn--gray" onClick={onCancelar}>Cancelar</button>
                    <button className="btn btn--blue" onClick={onGuardar} disabled={loading || pendientes.length===0}>
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
