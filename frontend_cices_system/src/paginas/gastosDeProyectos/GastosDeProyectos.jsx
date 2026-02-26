import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/useAuth.js";
import "./GastosDeProyectos.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export default function GastosDeProyectos() {
    const { token } = useAuth();

    const [q, setQ] = useState("");
    const [qSeleccionado, setQSeleccionado] = useState(null);
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [categoria, setCategoria] = useState("");
    const [horasMin, setHorasMin] = useState("");

    const [proyectoSug, setProyectoSug] = useState([]);
    const [showProyectoSug, setShowProyectoSug] = useState(false);
    const [categoriaSug, setCategoriaSug] = useState([]);
    const [showCategoriaSug, setShowCategoriaSug] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resultados, setResultados] = useState([]);

    const hayFiltrosActivos = useMemo(
        () => Boolean(q || fechaDesde || fechaHasta || categoria || horasMin),
        [q, fechaDesde, fechaHasta, categoria, horasMin]
    );

    const filasGastos = useMemo(() => {
        const rows = [];
        (resultados || []).forEach((p) => {
            (p.gastos || []).forEach((g, idx) => {
                rows.push({
                    id: `${p.proyectoId}_${idx}`,
                    codigoProyecto: p.codigoProyecto,
                    nombreProyecto: p.nombreProyecto,
                    categoria: g.categoria,
                    monto: g.monto,
                    fecha: g.fecha,
                    descripcion: g.descripcion,
                });
            });
        });
        return rows;
    }, [resultados]);

    useEffect(() => {
        const texto = q.trim();
        if (!texto) {
            setProyectoSug([]);
            setShowProyectoSug(false);
            setQSeleccionado(null);
            return;
        }

        const id = setTimeout(async () => {
            try {
                const res = await fetch(`${apiUrl}/proyectos/suggest?q=${encodeURIComponent(texto)}&limit=8`, {
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    setProyectoSug([]);
                    setShowProyectoSug(false);
                    return;
                }
                const data = await res.json();
                setProyectoSug(Array.isArray(data) ? data : []);
                setShowProyectoSug(Array.isArray(data) && data.length > 0);
            } catch {
                setProyectoSug([]);
                setShowProyectoSug(false);
            }
        }, 220);

        return () => clearTimeout(id);
    }, [q, token]);

    useEffect(() => {
        const texto = categoria.trim();
        if (!texto) {
            setCategoriaSug([]);
            setShowCategoriaSug(false);
            return;
        }

        const id = setTimeout(async () => {
            try {
                const res = await fetch(`${apiUrl}/proyectos/gastosDeProyectos/categorias/suggest?q=${encodeURIComponent(texto)}&limit=8`, {
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    setCategoriaSug([]);
                    setShowCategoriaSug(false);
                    return;
                }
                const data = await res.json();
                setCategoriaSug(Array.isArray(data) ? data : []);
                setShowCategoriaSug(Array.isArray(data) && data.length > 0);
            } catch {
                setCategoriaSug([]);
                setShowCategoriaSug(false);
            }
        }, 220);

        return () => clearTimeout(id);
    }, [categoria, token]);

    const cargar = async ({ limpiar = false } = {}) => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams();
            if (!limpiar && q.trim()) params.set("q", q.trim());
            if (!limpiar && fechaDesde) params.set("fechaDesde", fechaDesde);
            if (!limpiar && fechaHasta) params.set("fechaHasta", fechaHasta);
            if (!limpiar && categoria.trim()) params.set("categoria", categoria.trim());
            if (!limpiar && horasMin !== "") params.set("horasAsignadasMin", String(Number(horasMin)));

            const res = await fetch(`${apiUrl}/proyectos/gastosDeProyectos?${params.toString()}`, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("No fue posible cargar los gastos de proyectos");
            }

            const data = await res.json();
            setResultados(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e?.message || "Error al cargar información");
            setResultados([]);
        } finally {
            setLoading(false);
        }
    };

    const onAplicar = (e) => {
        e.preventDefault();
        cargar();
    };

    const onLimpiar = async () => {
        setQ("");
        setQSeleccionado(null);
        setFechaDesde("");
        setFechaHasta("");
        setCategoria("");
        setHorasMin("");
        await cargar({ limpiar: true });
    };

    useEffect(() => {
        if (!token) return;
        cargar({ limpiar: true });
    }, [token]);

    return (
        <div className="gdp">
            <div className="gdp__header">
                <h2>Gastos de Proyectos</h2>
                <p>Consulta financiera y de horas por proyecto</p>
            </div>

            <form className="gdp__filters" onSubmit={onAplicar}>
                <div className="gdp__row">
                    <div className="gdp__field">
                        <label>Proyecto</label>
                        <div className="gdp__autocomplete">
                            <input
                                placeholder="Código o nombre"
                                value={q}
                                onChange={(e) => {
                                    setQ(e.target.value);
                                    setQSeleccionado(null);
                                    setShowProyectoSug(true);
                                }}
                                onFocus={() => proyectoSug.length && setShowProyectoSug(true)}
                                onBlur={() => setTimeout(() => setShowProyectoSug(false), 140)}
                            />
                            {showProyectoSug && proyectoSug.length > 0 && (
                                <ul className="gdp__suggest">
                                    {proyectoSug.map((s) => (
                                        <li
                                            key={s.id}
                                            onMouseDown={() => {
                                                setQ(s.codigo);
                                                setQSeleccionado(s);
                                                setShowProyectoSug(false);
                                            }}
                                        >
                                            <span className="gdp__suggestCode">{s.codigo}</span>
                                            <span className="gdp__suggestName">{s.nombre}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {qSeleccionado && (
                            <small className="gdp__hint">{qSeleccionado.codigo} - {qSeleccionado.nombre}</small>
                        )}
                    </div>

                    <div className="gdp__field">
                        <label>Categoría</label>
                        <div className="gdp__autocomplete">
                            <input
                                placeholder="Materiales, RRHH, ..."
                                value={categoria}
                                onChange={(e) => {
                                    setCategoria(e.target.value);
                                    setShowCategoriaSug(true);
                                }}
                                onFocus={() => categoriaSug.length && setShowCategoriaSug(true)}
                                onBlur={() => setTimeout(() => setShowCategoriaSug(false), 140)}
                            />
                            {showCategoriaSug && categoriaSug.length > 0 && (
                                <ul className="gdp__suggest">
                                    {categoriaSug.map((s, idx) => (
                                        <li
                                            key={`${s}_${idx}`}
                                            onMouseDown={() => {
                                                setCategoria(s);
                                                setShowCategoriaSug(false);
                                            }}
                                        >
                                            <span className="gdp__suggestName">{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="gdp__field">
                        <label>Horas asignadas mínimas</label>
                        <input
                            inputMode="numeric"
                            placeholder="Ej. 40"
                            value={horasMin}
                            onChange={(e) => setHorasMin(e.target.value.replace(/[^\d]/g, ""))}
                        />
                    </div>
                </div>

                <div className="gdp__row">
                    <div className="gdp__field">
                        <label>Fecha desde</label>
                        <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
                    </div>
                    <div className="gdp__field">
                        <label>Fecha hasta</label>
                        <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
                    </div>
                    <div className="gdp__actions">
                        <button type="button" className="btn btn--gray" onClick={onLimpiar} disabled={loading}>
                            Limpiar
                        </button>
                        <button type="submit" className="btn btn--blue" disabled={loading}>
                            {loading ? "Buscando..." : "Aplicar filtros"}
                        </button>
                    </div>
                </div>
            </form>

            {error && <div className="gdp__error">{error}</div>}

            {!loading && resultados.length === 0 && (
                <div className="gdp__empty">
                    {hayFiltrosActivos
                        ? "Sin resultados para los filtros aplicados"
                        : "No hay proyectos para mostrar"}
                </div>
            )}

            {!loading && !hayFiltrosActivos && resultados.length > 0 && (
                <section className="gdp__allExpenses">
                    <h4>Todos los gastos (ordenado por código de proyecto)</h4>
                    <table className="gdp__table">
                        <thead>
                        <tr>
                            <th>Código proyecto</th>
                            <th>Proyecto</th>
                            <th>Categoría</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                            <th>Descripción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filasGastos.map((g) => (
                            <tr key={g.id}>
                                <td>{g.codigoProyecto}</td>
                                <td>{g.nombreProyecto}</td>
                                <td>{g.categoria}</td>
                                <td>₡{Number(g.monto || 0).toFixed(2)}</td>
                                <td>{fmt(g.fecha)}</td>
                                <td>{g.descripcion}</td>
                            </tr>
                        ))}
                        {filasGastos.length === 0 && (
                            <tr>
                                <td colSpan="6" className="gdp__emptyCell">No hay gastos registrados</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </section>
            )}

            {hayFiltrosActivos && (
            <div className="gdp__list">
                {resultados.map((p) => (
                    <article key={p.proyectoId} className="gdp__card">
                        <header className="gdp__cardHeader">
                            <h3>{p.codigoProyecto} - {p.nombreProyecto}</h3>
                        </header>

                        <section className="gdp__grid2">
                            <div>
                                <h4>Presupuesto financiero</h4>
                                <p><b>Inicial:</b> ₡{Number(p.presupuestoFinancieroInicial || 0).toFixed(2)}</p>
                                <p><b>Actual:</b> ₡{Number(p.presupuestoFinancieroActual || 0).toFixed(2)}</p>
                            </div>
                            <div>
                                <h4>Presupuesto de horas</h4>
                                <p><b>Inicial:</b> {Number(p.presupuestoHorasInicial || 0).toFixed(2)} h</p>
                                <p><b>Actual:</b> {Number(p.presupuestoHorasActual || 0).toFixed(2)} h</p>
                            </div>
                        </section>

                        <section>
                            <h4>Detalle de gastos</h4>
                            <table className="gdp__table">
                                <thead>
                                <tr>
                                    <th>Categoría</th>
                                    <th>Monto</th>
                                    <th>Fecha</th>
                                    <th>Descripción</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(p.gastos || []).map((g, idx) => (
                                    <tr key={`${p.proyectoId}_g_${idx}`}>
                                        <td>{g.categoria}</td>
                                        <td>₡{Number(g.monto || 0).toFixed(2)}</td>
                                        <td>{fmt(g.fecha)}</td>
                                        <td>{g.descripcion}</td>
                                    </tr>
                                ))}
                                {(p.gastos || []).length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="gdp__emptyCell">Sin gastos para los filtros actuales</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </section>

                        <section>
                            <h4>Horas asignadas a investigadores</h4>
                            <table className="gdp__table">
                                <thead>
                                <tr>
                                    <th>Nombre completo</th>
                                    <th>Horas asignadas</th>
                                    <th>Duración (meses)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(p.horasAsignadas || []).map((h, idx) => (
                                    <tr key={`${p.proyectoId}_h_${idx}`}>
                                        <td>{h.nombreCompleto}</td>
                                        <td>{Number(h.horasAsignadas || 0).toFixed(2)} h</td>
                                        <td>{h.duracionMeses}</td>
                                    </tr>
                                ))}
                                {(p.horasAsignadas || []).length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="gdp__emptyCell">Sin horas asignadas</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </section>
                    </article>
                ))}
            </div>
            )}
        </div>
    );
}

function fmt(fecha) {
    if (!fecha) return "";
    const [y, m, d] = String(fecha).split("-");
    if (!y || !m || !d) return String(fecha);
    return `${d}/${m}/${y}`;
}
