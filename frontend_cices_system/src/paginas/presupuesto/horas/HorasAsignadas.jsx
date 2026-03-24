import React, { useContext, useMemo, useState } from "react";
import { notify } from "../../../utils/ui/notify.jsx";
import { AppContext } from "../../../context/AppContext.jsx";

import { DistribucionHoras, obtenerInvestigadoresProyecto } from "../../../services/ReportesService.jsx";
import BuscadorProyecto from "../../../components/BusquedaProyecto.jsx";

import "./GestionHoras.css";
import BotonVolver from "../../../components/BotonVolver.jsx";

const ConsultaPresupuestos = () => {

    const { token, user } = useContext(AppContext);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [presupuestos, setPresupuestos] = useState([]);
    const [investigadoresProyecto, setInvestigadoresProyecto] = useState([]);

    const [ordenFecha, setOrdenFecha] = useState("reciente");
    const [ordenMonto, setOrdenMonto] = useState("");
    const [ordenHoras, setOrdenHoras] = useState("");

    const toNumber = (valor) => {
        if (valor === null || valor === undefined || valor === "") return 0;
        const numeroDirecto = Number(valor);
        if (Number.isFinite(numeroDirecto)) return numeroDirecto;
        const numeroConComa = Number(String(valor).replace(",", "."));
        return Number.isFinite(numeroConComa) ? numeroConComa : 0;
    };

    const toTimestamp = (fecha) => {
        if (!fecha) return 0;
        const time = Date.parse(fecha);
        return Number.isNaN(time) ? 0 : time;
    };

    const cargarDatosProyecto = async (codigoProyecto) => {
        const data = await DistribucionHoras.obtenerPorProyecto(codigoProyecto);
        setPresupuestos(data || []);

        const inv = await obtenerInvestigadoresProyecto(codigoProyecto, token);
        setInvestigadoresProyecto(inv || []);
    };

    const seleccionarProyecto = async (proyecto) => {

        if (!proyecto) {
            setProyectoSeleccionado(null);
            return;
        }

        setProyectoSeleccionado(proyecto);

        try {
            await cargarDatosProyecto(proyecto.codigoProyecto);
        } catch {
            notify.error("Error cargando datos");
        }

    };

    const totalPresupuesto = (p) =>
        toNumber(p.cantidadHoras) * toNumber(p.cantidadMeses);

    const totalHorasAsignadas = (p) =>
        (p.horas || []).reduce(
            (acc, h) => acc + (toNumber(h.cantidadHorasMes) * toNumber(h.cantidadMeses)),
            0
        );

    const esMismoInvestigador = (idA, idB) => String(idA) === String(idB);

    const presupuestosOrdenados = useMemo(() => {

        return [...presupuestos].sort((a, b) => {

            if (ordenFecha) {
                const fa = toTimestamp(a.fechaAsignacion);
                const fb = toTimestamp(b.fechaAsignacion);
                const diffFecha = ordenFecha === "reciente" ? fb - fa : fa - fb;
                if (diffFecha !== 0) return diffFecha;
            }

            if (ordenMonto) {
                const ma = totalPresupuesto(a);
                const mb = totalPresupuesto(b);
                const diffMonto = ordenMonto === "mayor" ? mb - ma : ma - mb;
                if (diffMonto !== 0) return diffMonto;
            }

            if (ordenHoras) {
                const ha = totalHorasAsignadas(a);
                const hb = totalHorasAsignadas(b);
                const diffHoras = ordenHoras === "mayor" ? hb - ha : ha - hb;
                if (diffHoras !== 0) return diffHoras;
            }

            return 0;
        });

    }, [presupuestos, ordenFecha, ordenMonto, ordenHoras]);

    return (

        <div className="gestion-horas-page">
            <div className="gestion-horas-card">
                <BotonVolver/>

                <h1 className="gestion-gastos-title">Consulta de Horas</h1>

                <BuscadorProyecto
                    token={token}
                    user={user}
                    onSelect={seleccionarProyecto}
                />

                {proyectoSeleccionado && (

                    <>
                        <h2><strong>Ordenamientos:</strong></h2>
                        <div className="gestion-horas-filtros">
                            <div className="filtro-item">
                                <label>Fecha asignacion</label>
                                <select
                                    className="gestion-horas-select"
                                    value={ordenFecha}
                                    onChange={(e) => setOrdenFecha(e.target.value)}
                                >
                                    <option value="reciente">Más reciente</option>
                                    <option value="antiguo">Más antiguo</option>
                                </select>
                            </div>

                            <div className="filtro-item">
                                <label>Monto presupuesto</label>
                                <select
                                    className="gestion-horas-select"
                                    value={ordenMonto}
                                    onChange={(e) => setOrdenMonto(e.target.value)}
                                >
                                    <option value="">Sin ordenar</option>
                                    <option value="mayor">Mayor a menor</option>
                                    <option value="menor">Menor a mayor</option>
                                </select>
                            </div>
                            <div className="filtro-item">
                                <label>Horas asignadas</label>
                                <select
                                    className="gestion-horas-select"
                                    value={ordenHoras}
                                    onChange={(e) => setOrdenHoras(e.target.value)}
                                >
                                    <option value="">Sin ordenar</option>
                                    <option value="mayor">Mayor a menor</option>
                                    <option value="menor">Menor a mayor</option>
                                </select>
                            </div>

                        </div>

                        <hr className="gestion-horas-divider" />

                        {presupuestosOrdenados.map(p => {

                            const total = totalPresupuesto(p);
                            const usadas = totalHorasAsignadas(p);
                            const restantes = total - usadas;

                            const investigadoresOrdenados = [...investigadoresProyecto].sort((a, b) => {

                                const ha = p.horas?.find(h => esMismoInvestigador(h.investigador?.id, a.id));
                                const hb = p.horas?.find(h => esMismoInvestigador(h.investigador?.id, b.id));

                                const totalA = toNumber(ha?.cantidadHorasMes) * toNumber(ha?.cantidadMeses);
                                const totalB = toNumber(hb?.cantidadHorasMes) * toNumber(hb?.cantidadMeses);

                                if (ordenHoras === "mayor") return totalB - totalA;
                                if (ordenHoras === "menor") return totalA - totalB;

                                return 0;

                            });

                            return (


                                <div key={p.id} className="gestion-horas-content">
                                    <div className={"input"}>
                                    <h3><strong>{p.categoria} - {p.descripcion}</strong></h3>
                                    </div>
                                    <p><strong>Fecha asignacion:</strong> {p.fechaAsignacion}</p>
                                    <p><strong>Horas por mes:</strong> {p.cantidadHoras}</p>
                                    <p><strong>Meses:</strong> {p.cantidadMeses}</p>
                                    <p><strong>Total horas presupuesto:</strong> {total}</p>
                                    <p><strong>Horas asignadas:</strong> {usadas}</p>
                                    <p>
                                        <strong>Horas restantes:</strong> {restantes}
                                    </p>

                                    <h4>Horas asignadas a investigadores</h4>

                                    <div className="tabla-container">
                                        <table className="tabla-horas">

                                            <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Investigador</th>
                                                <th>Rol</th>
                                                <th>Fecha inicio</th>
                                                <th>Fecha fin</th>
                                                <th>Horas/Mes</th>
                                                <th>Meses</th>
                                                <th>Total</th>
                                            </tr>
                                            </thead>

                                            <tbody>

                                            {investigadoresOrdenados.map(inv => {

                                                const h = p.horas?.find(hora => esMismoInvestigador(hora.investigador?.id, inv.id));

                                                const totalInv =
                                                    toNumber(h?.cantidadHorasMes) *
                                                    toNumber(h?.cantidadMeses);

                                                return (

                                                    <tr key={inv.id}>

                                                        <td>{inv.identificacionInvestigador}</td>
                                                        <td>{inv.nombreInvestigador}</td>
                                                        <td>{inv.rolProyecto?.nombreRolProyecto}</td>
                                                        <td>{inv.fechaInicio || "-"}</td>
                                                        <td>{inv.fechaFin || "-"}</td>
                                                        <td>{h?.cantidadHorasMes || 0}</td>
                                                        <td>{h?.cantidadMeses || 0}</td>
                                                        <td>{totalInv}</td>

                                                    </tr>

                                                );

                                            })}

                                            </tbody>

                                        </table>
                                    </div>

                                    <hr className="gestion-horas-divider" />

                                </div>

                            );

                        })}

                    </>

                )}

            </div>
        </div>

    );

};

export default ConsultaPresupuestos;