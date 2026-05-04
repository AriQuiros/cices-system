import "./ProyectoSeleccionado.css";
import { useVerProyecto } from "../../hooks/proyectoHooks/useVerProyecto.js";
import { formatearFechaCR } from "../../utils/formatoFechaCR.js";
// Agregar estos imports arriba en VerProyecto.jsx
import PresupuestoResumen from "../../components/presupuestoComponents/PresupuestoResumen.jsx";
import { GastoTable } from "../../components/gastoComponents/GastoTable.jsx";
import { HoraTableSoloLectura } from "../../components/horaComponents/HoraTableSoloLectura.jsx";

const Seccion = ({ titulo, children }) => (
    <>
        <div className="titulo">{titulo}</div>
        {children}
    </>
);

const SinDatos = ({ texto = "Sin datos" }) => <p>{texto}</p>;

// Detecta si el archivo se puede previsualizar en el browser
const esVisualizableEnBrowser = (nombreDocumento = "") => {
    const nombre = nombreDocumento.toLowerCase();
    return nombre.endsWith(".pdf") || nombre.endsWith(".png") ||
        nombre.endsWith(".jpg") || nombre.endsWith(".jpeg");
};

export default function VerProyecto() {
    const {
        proyecto, isLoading, isError, handleVolver,
        descargar, descargandoId
    } = useVerProyecto();

    if (isLoading) return <div className="main"><p>Cargando proyecto...</p></div>;
    if (isError)   return <div className="main"><p style={{ color: "red" }}>No se pudo cargar el proyecto.</p></div>;
    if (!proyecto) return null;

    const {
        codigoProyecto, nombreProyecto, descripcionProyecto, objetivoGeneral,
        lineaInvestigacion, tipoProyecto, estado, fechaInicio, fechaFinalizacion,
        investigadores = [],
        entidades      = [],
        presupuestos   = [],
        objetivos      = [],
        documentos     = [],
        informes       = [],
    } = proyecto;

    return (
        <div className="main">
            <button className="botonVolver" onClick={handleVolver}>Volver</button>

            <div className="proyecto-container">

                {/* ── DATOS BÁSICOS ─────────────────────────────── */}
                <Seccion titulo="INFORMACIÓN GENERAL DEL PROYECTO">
                    <p><b>Código:</b> {codigoProyecto || "-"}</p>
                    <p><b>Nombre:</b> {nombreProyecto || "-"}</p>
                    <p><b>Tipo:</b> {tipoProyecto || "-"}</p>
                    <p><b>Estado:</b> {estado || "-"}</p>
                    <p><b>Línea de investigación:</b> {lineaInvestigacion || "-"}</p>
                    <p><b>Fecha inicio:</b> {formatearFechaCR(fechaInicio)}</p>
                    <p><b>Fecha finalización:</b> {formatearFechaCR(fechaFinalizacion)}</p>
                </Seccion>

                <Seccion titulo="DESCRIPCIÓN">
                    <p>{descripcionProyecto || "-"}</p>
                </Seccion>

                <Seccion titulo="OBJETIVO GENERAL">
                    <p>{objetivoGeneral || "-"}</p>
                </Seccion>

                {/* ── INVESTIGADORES ────────────────────────────── */}
                <Seccion titulo="INVESTIGADORES">
                    {investigadores.length === 0 ? <SinDatos texto="Sin investigadores vinculados" /> : (
                        <table>
                            <thead>
                            <tr>
                                <th>Nombre</th><th>Identificación</th><th>Rol</th>
                                <th>Actividad</th><th>Fecha inicio</th><th>Fecha fin</th>
                            </tr>
                            </thead>
                            <tbody>
                            {investigadores.map(inv => (
                                <tr key={inv.id}>
                                    <td>{inv.nombreCompleto || "-"}</td>
                                    <td>{inv.identificacion || "-"}</td>
                                    <td>{inv.rolProyecto || "-"}</td>
                                    <td>{inv.actividadProyecto || "-"}</td>
                                    <td>{formatearFechaCR(inv.fechaInicio)}</td>
                                    <td>{formatearFechaCR(inv.fechaFin)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </Seccion>

                {/* ── ENTIDADES ─────────────────────────────────── */}
                <Seccion titulo="ENTIDADES VINCULADAS">
                    {entidades.length === 0 ? <SinDatos texto="Sin entidades vinculadas" /> : (
                        <table>
                            <thead><tr><th>Nombre</th><th>Tipo</th></tr></thead>
                            <tbody>
                            {entidades.map((ent, i) => (
                                <tr key={i}>
                                    <td>{ent.nombreEntidad || "-"}</td>
                                    <td>{ent.tipoEntidad || "-"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </Seccion>

                {/* ── OBJETIVOS ESPECÍFICOS ─────────────────────── */}
                <Seccion titulo="OBJETIVOS ESPECÍFICOS">
                    {objetivos.length === 0 ? <SinDatos texto="Sin objetivos específicos" /> : (
                        objetivos.map((obj, i) => (
                            <div key={i} style={{ marginBottom: "1.5rem" }}>
                                <p><b>Objetivo {i + 1}:</b> {obj.descripcion || "-"}</p>
                                {(obj.metas || []).length > 0 && (
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Tipo</th><th>Cantidad</th>
                                            <th>Descripción</th><th>Indicadores</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {obj.metas.map((meta, j) => (
                                            <tr key={j}>
                                                <td>{meta.tipoMeta || "-"}</td>
                                                <td>{meta.cantidad || "-"}</td>
                                                <td>{meta.descripcion || "-"}</td>
                                                <td>
                                                    {(meta.indicadores || []).length === 0 ? "-" : (
                                                        <ul style={{ textAlign: "left", margin: 0, paddingLeft: "1rem" }}>
                                                            {meta.indicadores.map((ind, k) => (
                                                                <li key={k}>{ind.descripcion}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        ))
                    )}
                </Seccion>

                {/* ── PRESUPUESTOS ──────────────────────────────── */}
                <Seccion titulo="PRESUPUESTOS">
                    {presupuestos.length === 0 ? <SinDatos texto="Sin presupuestos" /> : (
                        presupuestos.map(pres => {
                            const esFinanciero = pres.tipoPresupuesto === "Financiero";
                            const esHoras      = pres.tipoPresupuesto === "Horas";

                            return (
                                <div key={pres.id} style={{ marginBottom: "2.5rem" }}>

                                    {/* Resumen del presupuesto — ya maneja la lógica Financiero/Horas */}
                                    <PresupuestoResumen presupuesto={pres} />

                                    {/* Gastos — solo si es Financiero y tiene registros */}
                                    {esFinanciero && (pres.gastos || []).length > 0 && (
                                        <>
                                            <p><b>Detalle de gastos</b></p>
                                            <GastoTable
                                                gastos={pres.gastos}
                                                soloLectura={true}
                                            />
                                        </>
                                    )}

                                    {esFinanciero && (pres.gastos || []).length === 0 && (
                                        <p style={{ color: "#999", fontSize: "0.9rem" }}>Sin gastos registrados</p>
                                    )}

                                    {/* Horas asignadas — solo si es Horas y tiene registros */}
                                    {esHoras && (pres.horasAsignadas || []).length > 0 && (
                                        <>
                                            <p><b>Detalle de horas asignadas</b></p>
                                            <HoraTableSoloLectura data={pres.horasAsignadas} />
                                        </>
                                    )}

                                    {esHoras && (pres.horasAsignadas || []).length === 0 && (
                                        <p style={{ color: "#999", fontSize: "0.9rem" }}>Sin horas asignadas</p>
                                    )}

                                </div>
                            );
                        })
                    )}
                </Seccion>

                {/* ── DOCUMENTOS ────────────────────────────────── */}
                <Seccion titulo="DOCUMENTOS">
                    {documentos.length === 0 ? <SinDatos texto="Sin documentos" /> : (
                        <table>
                            <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descargar</th>
                                <th>Visualizar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {documentos.map(doc => {
                                const ocupado = descargandoId === doc.id;
                                const puedeVer = esVisualizableEnBrowser(doc.nombreDocumento);
                                return (
                                    <tr key={doc.id}>
                                        <td>{doc.nombreDocumento || "-"}</td>
                                        <td>
                                            <button
                                                className="botonDescargar"
                                                disabled={ocupado}
                                                onClick={() => descargar(doc, "descargar")}
                                            >
                                                {ocupado ? "..." : "⬇ Descargar"}
                                            </button>
                                        </td>
                                        <td>
                                            {puedeVer ? (
                                                <button
                                                    className="botonVisualizar"
                                                    disabled={ocupado}
                                                    onClick={() => descargar(doc, "visualizar")}
                                                >
                                                    {ocupado ? "..." : "👁 Ver"}
                                                </button>
                                            ) : (
                                                <span style={{ color: "#999", fontSize: "0.85rem" }}>
                                                        No previsualizable
                                                    </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    )}
                </Seccion>

                {/* ── INFORMES ──────────────────────────────────── */}
                <Seccion titulo="INFORMES">
                    {informes.length === 0 ? <SinDatos texto="Sin informes" /> : (
                        <table>
                            <thead>
                            <tr><th>Tipo</th><th>Estado</th><th>Fecha presentación</th></tr>
                            </thead>
                            <tbody>
                            {informes.map((inf, i) => (
                                <tr key={i}>
                                    <td>{inf.tipoInforme || "-"}</td>
                                    <td>{inf.estado || "-"}</td>
                                    <td>{formatearFechaCR(inf.fechaPresentacion)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </Seccion>

            </div>
        </div>
    );
}