import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { notify } from "../../utils/ui/notify.jsx";
import BuscadorProyecto from "../../components/BusquedaProyecto.jsx";
import BotonVolver from "../../components/BotonVolver.jsx";
import {
    DistribucionHoras,
    obtenerInvestigadoresProyecto
} from "../../services/ReportesService.jsx";
import {
    descargarReporteInvestigadoresProyecto
} from "../../services/ReporteInvestigadorService.jsx";
import "./ReporteInvestigadorProyecto.css";

const FORMATOS = [
    { value: "pdf", label: "PDF" },
    { value: "word", label: "Word" },
    { value: "excel", label: "Excel" }
];

const formatearFecha = (fecha) => {
    if (!fecha) return "No aplica";

    const parsed = new Date(fecha);
    if (Number.isNaN(parsed.getTime())) return fecha;

    return parsed.toLocaleDateString("es-CR");
};

const toNumber = (valor) => {
    if (valor === null || valor === undefined || valor === "") return 0;

    const numeroDirecto = Number(valor);
    if (Number.isFinite(numeroDirecto)) return numeroDirecto;

    const numeroConComa = Number(String(valor).replace(",", "."));
    return Number.isFinite(numeroConComa) ? numeroConComa : 0;
};

const obtenerTextoGradoAcademico = (inv) => {
    return (
        inv?.gradoAcademico ||
        inv?.nombreGradoAcademico ||
        inv?.gradoAcademicoInvestigador ||
        inv?.empleado?.gradoAcademico ||
        inv?.investigador?.gradoAcademico ||
        "No disponible"
    );
};

const obtenerTextoRol = (inv) => {
    return (
        inv?.rolProyecto?.nombreRolProyecto ||
        inv?.rolProyecto?.nombre ||
        inv?.nombreRolProyecto ||
        inv?.rol ||
        "No disponible"
    );
};

const ReporteInvestigadorProyecto = () => {
    const { token, user } = useContext(AppContext);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [participantes, setParticipantes] = useState([]);
    const [presupuestosHoras, setPresupuestosHoras] = useState([]);
    const [formato, setFormato] = useState("pdf");
    const [cargando, setCargando] = useState(false);
    const [descargando, setDescargando] = useState(false);

    const calcularHorasPorInvestigador = (investigadorId) => {
        return presupuestosHoras.reduce((accPresupuesto, presupuesto) => {
            const horas = presupuesto?.horas || [];

            const totalEnPresupuesto = horas.reduce((accHora, hora) => {
                const horaInvestigadorId =
                    hora?.investigador?.id ??
                    hora?.investigadorId ??
                    hora?.idInvestigador;

                if (String(horaInvestigadorId) !== String(investigadorId)) {
                    return accHora;
                }

                const horasMes = toNumber(hora?.cantidadHorasMes);
                const meses = toNumber(hora?.cantidadMeses);

                return accHora + (horasMes * meses);
            }, 0);

            return accPresupuesto + totalEnPresupuesto;
        }, 0);
    };

    const participantesVista = useMemo(() => {
        return participantes.map((inv) => ({
            idInvestigador: inv?.id,
            documentoIdentidad:
                inv?.identificacionInvestigador ||
                inv?.identificacion ||
                inv?.cedula ||
                "No disponible",
            nombreCompleto:
                inv?.nombreInvestigador ||
                inv?.nombreCompleto ||
                inv?.nombre ||
                "No disponible",
            gradoAcademico: obtenerTextoGradoAcademico(inv),
            rolProyecto: obtenerTextoRol(inv),
            horasAsignadas: calcularHorasPorInvestigador(inv?.id),
            fechaInicioParticipacion: inv?.fechaInicio || null,
            fechaFinParticipacion: inv?.fechaFin || null
        }));
    }, [participantes, presupuestosHoras]);

    const resumen = useMemo(() => {
        const totalInvestigadores = participantesVista.length;

        const totalHorasAsignadas = participantesVista.reduce(
            (acc, item) => acc + toNumber(item.horasAsignadas),
            0
        );

        const mapaRoles = participantesVista.reduce((acc, item) => {
            const rol = item.rolProyecto || "No disponible";
            acc[rol] = (acc[rol] || 0) + 1;
            return acc;
        }, {});

        const totalesPorRol = Object.entries(mapaRoles).map(([rol, total]) => ({
            rol,
            total
        }));

        return {
            totalInvestigadores,
            totalHorasAsignadas,
            totalesPorRol
        };
    }, [participantesVista]);

    const seleccionarProyecto = async (proyecto) => {
        if (!proyecto) {
            setProyectoSeleccionado(null);
            setParticipantes([]);
            setPresupuestosHoras([]);
            return;
        }

        setProyectoSeleccionado(proyecto);

        try {
            setCargando(true);

            const [investigadoresData, presupuestosData] = await Promise.all([
                obtenerInvestigadoresProyecto(proyecto.codigoProyecto),
                DistribucionHoras.obtenerPorProyecto(proyecto.codigoProyecto)
            ]);
            console.log("INVESTIGADORES REPORTE:", investigadoresData);

            setParticipantes(investigadoresData || []);
            setPresupuestosHoras(presupuestosData || []);
        } catch (error) {
            console.error(error);
            notify.error("Error cargando investigadores del proyecto");
            setParticipantes([]);
            setPresupuestosHoras([]);
        } finally {
            setCargando(false);
        }
    };

    const puedeDescargar = useMemo(() => {
        return !!proyectoSeleccionado && participantesVista.length > 0 && !descargando;
    }, [proyectoSeleccionado, participantesVista, descargando]);

    const handleDescargar = async () => {
        if (!proyectoSeleccionado) {
            notify.error("Debes seleccionar un proyecto");
            return;
        }

        if (!participantesVista.length) {
            notify.error("No hay participantes para generar el reporte");
            return;
        }

        try {
            setDescargando(true);

            await descargarReporteInvestigadoresProyecto({
                formato,
                proyecto: proyectoSeleccionado,
                resumen,
                participantes: participantesVista
            });

            notify.success("Reporte descargado correctamente");
        } catch (error) {
            console.error(error);
            notify.error("Error descargando el reporte");
        } finally {
            setDescargando(false);
        }
    };

    return (
        <div className="reporte-investigador-page">
            <div className="reporte-investigador-card">
                <BotonVolver />

                <h2 className="reporte-investigador-title">
                    Reporte de investigadores por proyecto
                </h2>

                <BuscadorProyecto
                    token={token}
                    user={user}
                    onSelect={seleccionarProyecto}
                />

                {cargando && (
                    <div className="reporte-cargando">
                        Cargando información del reporte...
                    </div>
                )}

                {proyectoSeleccionado && !cargando && (
                    <div className="reporte-contenido">

                        <h3 className="reporte-subtitle">Información del proyecto</h3>

                        <div className="reporte-resumen">
                            <p><b>Nombre del proyecto:</b> {proyectoSeleccionado.nombreProyecto}</p>
                            <p><b>Código del proyecto:</b> {proyectoSeleccionado.codigoProyecto}</p>
                            <p><b>Fecha inicio:</b> {formatearFecha(proyectoSeleccionado.fechaInicio)}</p>
                            <p><b>Fecha finalización:</b> {formatearFecha(proyectoSeleccionado.fechaFinalizacion)}</p>
                        </div>

                        <h3 className="reporte-subtitle">Resumen</h3>

                        <div className="reporte-resumen">
                            <p><b>Total investigadores:</b> {resumen.totalInvestigadores}</p>
                            <p><b>Total horas asignadas:</b> {resumen.totalHorasAsignadas}</p>

                            <div>
                                <b>Total por rol:</b>
                                {resumen.totalesPorRol.length ? (
                                    <ul>
                                        {resumen.totalesPorRol.map((rol, index) => (
                                            <li key={`${rol.rol}-${index}`}>
                                                {rol.rol}: {rol.total}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No hay desglose por rol.</p>
                                )}
                            </div>
                        </div>

                        <h3 className="reporte-subtitle">Participantes del proyecto</h3>

                        <table className="reporte-investigador-table">
                            <thead>
                            <tr>
                                <th>Documento</th>
                                <th>Nombre</th>
                                <th>Grado académico</th>
                                <th>Rol en el proyecto</th>
                                <th>Horas asignadas</th>
                                <th>Fecha inicio</th>
                                <th>Fecha fin</th>
                            </tr>
                            </thead>
                            <tbody>
                            {participantesVista.length ? (
                                participantesVista.map((p) => (
                                    <tr
                                        key={
                                            p.idInvestigador ??
                                            `${p.documentoIdentidad}-${p.nombreCompleto}`
                                        }
                                    >
                                        <td>{p.documentoIdentidad}</td>
                                        <td>{p.nombreCompleto}</td>
                                        <td>{p.gradoAcademico}</td>
                                        <td>{p.rolProyecto}</td>
                                        <td>{p.horasAsignadas}</td>
                                        <td>{formatearFecha(p.fechaInicioParticipacion)}</td>
                                        <td>{formatearFecha(p.fechaFinParticipacion)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No hay participantes para mostrar.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>

                        <h3 className="reporte-subtitle">Descarga</h3>

                        <div className="reporte-acciones">
                            <div className="reporte-form-item">
                                <label>Formato</label>
                                <select
                                    className="reporte-select"
                                    value={formato}
                                    onChange={(e) => setFormato(e.target.value)}
                                >
                                    {FORMATOS.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleDescargar}
                                disabled={!puedeDescargar}
                                className="reporte-btn-descargar"
                            >
                                {descargando ? "Descargando..." : "Descargar reporte"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReporteInvestigadorProyecto;