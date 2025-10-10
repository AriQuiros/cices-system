// ProyectoInvestigador.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import "./ProyectoInvestigador.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function ProyectoInvestigador() {
    const { token } = useContext(AppContext);

    const [proyectos, setProyectos] = useState([]);
    const [proyectosFiltrados, setProyectosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    // filtros
    const [campoFiltro, setCampoFiltro] = useState("varios");
    const [valorBusqueda, setValorBusqueda] = useState("");

    // paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const [proyectosPorPagina] = useState(6); // cámbialo si quieres

    useEffect(() => {
        let cancel = false;

        if (!token) {
            setErr("Debes iniciar sesión como investigador.");
            setLoading(false);
            return () => {
                cancel = true;
            };
        }

        (async () => {
            try {
                const res = await fetch(`${API}/api/investigador/mis-proyectos`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    if (res.status === 401) setErr("No autorizado. Vuelve a iniciar sesión.");
                    else if (res.status === 403) setErr("No tienes permisos de INVESTIGADOR.");
                    else setErr(`Error ${res.status} cargando proyectos.`);
                    return;
                }

                const data = await res.json();
                const arr = Array.isArray(data) ? data : [];
                if (!cancel) {
                    setProyectos(arr);
                    setProyectosFiltrados(arr);
                }
            } catch {
                if (!cancel) setErr("No se pudo conectar con el servidor.");
            } finally {
                if (!cancel) setLoading(false);
            }
        })();

        return () => {
            cancel = true;
        };
    }, [token]);

    // aplicar filtros en memoria
    useEffect(() => {
        let resultados = proyectos;

        const q = (valorBusqueda || "").toLowerCase().trim();
        const toText = (v) => (v == null ? "" : String(v)).toLowerCase();

        if (q) {
            resultados = proyectos.filter((p) => {
                const nombre = toText(p.nombreProyecto);
                const codigo = toText(p.codigoProyecto);
                const linea = toText(p.lineaInvestigacion);
                const fIni = toText(p.fechaInicio);
                const fFin = toText(p.fechaFinalizacion);

                switch (campoFiltro) {
                    case "nombre":
                        return nombre.includes(q);
                    case "codigo":
                        return codigo.includes(q);
                    case "lineaInvestigacion":
                        return linea.includes(q);
                    case "fechaInicio":
                        return fIni.includes(q);
                    case "fechaFinalizacion":
                        return fFin.includes(q);
                    case "varios":
                    default:
                        return (
                            nombre.includes(q) ||
                            codigo.includes(q) ||
                            linea.includes(q) ||
                            fIni.includes(q) ||
                            fFin.includes(q)
                        );
                }
            });
        }

        setProyectosFiltrados(resultados);
        setPaginaActual(1);
    }, [campoFiltro, valorBusqueda, proyectos]);

    // paginación calculada
    const { pagina, totalPaginas } = useMemo(() => {
        const total = proyectosFiltrados.length;
        const tp = Math.max(1, Math.ceil(total / proyectosPorPagina));
        const pa = Math.min(paginaActual, tp);
        const i2 = pa * proyectosPorPagina;
        const i1 = i2 - proyectosPorPagina;
        return {
            pagina: proyectosFiltrados.slice(i1, i2),
            totalPaginas: tp,
        };
    }, [proyectosFiltrados, paginaActual, proyectosPorPagina]);

    const numerosPagina = useMemo(
        () => Array.from({ length: totalPaginas }, (_, i) => i + 1),
        [totalPaginas]
    );

    const limpiarFiltros = () => {
        setCampoFiltro("varios");
        setValorBusqueda("");
        setPaginaActual(1);
    };

    if (loading) return <div className="contenedor_proyectos"><p>Cargando…</p></div>;

    return (
        <div className="contenedor_proyectos">
            {/* Barra de búsqueda/filtros */}
            <form className="buscar" onSubmit={(e) => e.preventDefault()}>
                <select
                    className="filtro"
                    value={campoFiltro}
                    onChange={(e) => setCampoFiltro(e.target.value)}
                >
                    <option value="varios">Todos los campos</option>
                    <option value="nombre">Nombre del proyecto</option>
                    <option value="codigo">Código o número</option>
                    <option value="lineaInvestigacion">Línea de investigación</option>
                    <option value="fechaInicio">Fecha de inicio</option>
                    <option value="fechaFinalizacion">Fecha de finalización</option>
                </select>

                <input
                    className="buscador"
                    type="text"
                    placeholder="Buscar"
                    value={valorBusqueda}
                    onChange={(e) => setValorBusqueda(e.target.value)}
                />

                <button
                    type="button"
                    className="boton-limpiar"
                    onClick={limpiarFiltros}
                    disabled={!valorBusqueda && campoFiltro === "varios"}
                >
                    Limpiar Filtros
                </button>
            </form>

            <section className="todosLosProyectos">
                <h2>Mis proyectos</h2>

                {err ? (
                    <div className="contador-paginacion">{err}</div>
                ) : proyectosFiltrados.length === 0 ? (
                    <div className="contador-paginacion">No tienes proyectos asignados.</div>
                ) : (
                    <>
                        <div className="label">
                            {pagina.map((p) => (
                                <label key={p.codigoProyecto}>
                                    <h3>{p.nombreProyecto}</h3>
                                    <p>Código: {p.codigoProyecto}</p>
                                    <p>Fecha inicio: {p.fechaInicio}</p>
                                    <p>Fecha finalización: {p.fechaFinalizacion}</p>
                                    <p>Línea de investigación: {p.lineaInvestigacion}</p>
                                </label>
                            ))}
                        </div>

                        {totalPaginas > 1 && (
                            <div className="paginacion">
                                <button
                                    onClick={() => setPaginaActual((x) => Math.max(1, x - 1))}
                                    disabled={paginaActual === 1}
                                    className="boton-paginacion"
                                >
                                    ← Anterior
                                </button>

                                <div className="numeros-pagina">
                                    {numerosPagina.map((n) => (
                                        <button
                                            key={n}
                                            onClick={() => setPaginaActual(n)}
                                            className={`numero-pagina ${paginaActual === n ? "activo" : ""}`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() =>
                                        setPaginaActual((x) => Math.min(totalPaginas, x + 1))
                                    }
                                    disabled={paginaActual === totalPaginas}
                                    className="boton-paginacion"
                                >
                                    Siguiente →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            <div className="contador-paginacion">
                Mostrando {pagina.length} de {proyectosFiltrados.length} proyectos
                {totalPaginas > 1 && ` - Página ${paginaActual} de ${totalPaginas}`}
            </div>
        </div>
    );
}
