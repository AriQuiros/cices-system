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

    // Listas
    const [roles, setRoles] = useState([]);
    const [disp, setDisp] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    const [asignados, setAsignados] = useState([]);
    const [qAsignados, setQAsignados] = useState("");

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        listarRolesProyecto().then(setRoles).catch(() => setRoles([]));
    }, [listarRolesProyecto]);

    useEffect(() => {
        let alive = true;
        searchInvestigadores(filtroInv).then((r) => alive && setDisp(r));
        return () => { alive = false; };
    }, [filtroInv, searchInvestigadores]);

    useEffect(() => {
        if (!proyecto) return;
        let alive = true;
        listarAsignados(proyecto.id, qAsignados).then((r) => alive && setAsignados(r));
        return () => { alive = false; };
    }, [proyecto, qAsignados, listarAsignados]);

    const limpiar = () => {
        setFiltroInv("");
        setRolId("");
        setHorasMes("");
        setMeses("");
        setIni("");
        setFin("");
        setSeleccionado(null);
        setMsg("");
    };

    const buscarProyecto = async () => {
        setLoading(true);
        setMsg("");
        try {
            const p = await searchProyecto(qProyecto.trim());
            setProyecto(p);
            if (p) setAsignados(await listarAsignados(p.id, ""));
            else setAsignados([]);
        } catch {
            setMsg("Error al buscar proyecto");
        } finally {
            setLoading(false);
        }
    };

    const agregar = async () => {
        if (!proyecto) return setMsg("Seleccione un proyecto");
        if (!seleccionado) return setMsg("Seleccione un investigador");
        if (!rolId) return setMsg("Seleccione un rol");
        try {
            setLoading(true);
            await agregarAsignacion({
                proyectoId: proyecto.id,
                investigadorId: seleccionado.id,
                rolProyectoId: Number(rolId),
                horasMes: Number(horasMes || 0),
                meses: Number(meses || 1),
                ini: ini || proyecto.periodo?.ini,
                fin: fin || proyecto.periodo?.fin,
            });
            setAsignados(await listarAsignados(proyecto.id, qAsignados));
            setMsg("Asignación registrada");
            limpiar();
        } catch {
            setMsg("No fue posible asignar");
        } finally {
            setLoading(false);
        }
    };

    const quitar = async (id) => {
        if (!proyecto) return;
        setLoading(true);
        try {
            await quitarAsignacion({ proyectoId: proyecto.id, investigadorId: id });
            setAsignados(await listarAsignados(proyecto.id, qAsignados));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="aix">
            <div className="aix__header">
                <h2>Asignar investigador a este proyecto</h2>
                {msg && <span className="aix__msg">{msg}</span>}
            </div>

            <div className="aix__toolbar">
                <div className="aix__row">
                    <div className="aix__field">
                        <label>Investigador</label>
                        <input
                            placeholder="Nombre"
                            value={filtroInv}
                            onChange={(e) => setFiltroInv(e.target.value)}
                        />
                    </div>

                    <div className="aix__field">
                        <label>Rol</label>
                        <select value={rolId} onChange={(e) => setRolId(e.target.value)}>
                            <option value="">Seleccione</option>
                            {roles.map((r) => (
                                <option key={r.id} value={r.id}>{r.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="aix__field">
                        <label>Horas asignadas</label>
                        <input
                            placeholder="Ej. 120"
                            inputMode="numeric"
                            value={horasMes}
                            onChange={(e) => setHorasMes(e.target.value.replace(/[^\d]/g, ""))}
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
                                <input type="date" value={ini} onChange={(e) => setIni(e.target.value)} />
                            </div>
                            <div>
                                <span>Fin</span>
                                <input type="date" value={fin} onChange={(e) => setFin(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="aix__actions">
                        <button className="btn btn--green" onClick={limpiar}>Limpiar</button>
                        <button className="btn btn--blue" onClick={agregar} disabled={loading}>Agregar</button>
                    </div>
                </div>
            </div>

            <div className="aix__grid">
                <section className="aix__left">
                    <div className="aix__card">
                        <div className="aix__projectsearch">
                            <label>Proyecto seleccionado</label>
                            <div className="aix__projectsearch__row">
                                <input
                                    placeholder="Código/Nombre"
                                    value={qProyecto}
                                    onChange={(e) => setQProyecto(e.target.value)}
                                />
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
                                    placeholder="Nombre, especialidad o unidad"
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
                                <th>Rol</th>
                                <th>Período</th>
                                <th>Horas</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {asignados.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.nombre}</td>
                                    <td>{a.rol}</td>
                                    <td>{fmt(a.periodo?.ini)} - {fmt(a.periodo?.fin)}</td>
                                    <td>{a.horas} h</td>
                                    <td><span className="badge badge--gray">{a.estado || "Vigente"}</span></td>
                                    <td><button className="btn btn--danger" onClick={() => quitar(a.id)}>Quitar</button></td>
                                </tr>
                            ))}
                            {asignados.length === 0 && (
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
                            <input
                                placeholder="Nombre, especialidad o unidad"
                                value={filtroInv}
                                onChange={(e) => setFiltroInv(e.target.value)}
                            />
                        </div>
                        <ul className="aix__list">
                            {disp.map((i) => (
                                <li
                                    key={i.id}
                                    className={`aix__listitem ${seleccionado?.id === i.id ? "is-active" : ""}`}
                                    onClick={() => setSeleccionado(i)}
                                >
                                    <div className="aix__listitem__name">{i.nombre}</div>
                                    <div className="aix__listitem__unit">Unidad: {i.unidad}</div>
                                    <button
                                        className="btn btn--mini"
                                        onClick={(e) => { e.stopPropagation(); setSeleccionado(i); }}
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
        </div>
    );
}

function fmt(s) {
    if (!s) return "";
    const [y, m, d] = s.split("-"); // yyyy-mm-dd
    return `${d}/${m}/${y}`;
}
