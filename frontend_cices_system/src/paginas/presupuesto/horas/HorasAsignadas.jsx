import React, { useContext, useMemo, useState } from "react";
import { notify } from "../../../utils/ui/notify.jsx";
import { AppContext } from "../../../context/AppContext.jsx";

import { DistribucionHoras } from "../../../services/ReportesService.jsx";
import { obtenerInvestigadoresProyecto } from "../../../services/ReportesService.jsx";
import BuscadorProyecto from "../../../components/BusquedaProyecto.jsx";
import "./HorasAsignadas.css";

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

        if (/^\d{4}-\d{2}-\d{2}/.test(fecha)) {
            const time = Date.parse(fecha);
            return Number.isNaN(time) ? 0 : time;
        }

        if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
            const [dia, mes, anio] = fecha.split("/").map(Number);
            return new Date(anio, mes - 1, dia).getTime();
        }

        if (/^\d{2}-\d{2}-\d{4}$/.test(fecha)) {
            const [dia, mes, anio] = fecha.split("-").map(Number);
            return new Date(anio, mes - 1, dia).getTime();
        }

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

        <div className="horas-asignadas-page">
            <div className="horas-asignadas-card">

            <h2 className="horas-asignadas-title">Consulta de Horas</h2>

            <BuscadorProyecto
                token={token}
                user={user}
                onSelect={seleccionarProyecto}
            />

            {proyectoSeleccionado && (

                <div className="horas-asignadas-content">

                    <h3 className="horas-asignadas-subtitle">Informacion del presupuesto - horas</h3>

                    <div className="horas-filtros-grid">

                    <div className="horas-filtro-item">
                    <label className="horas-label">Fecha asignacion</label>

                    <select
                        className="horas-select"
                        value={ordenFecha}
                        onChange={(e) => setOrdenFecha(e.target.value)}
                    >
                        <option value="reciente">Más reciente</option>
                        <option value="antiguo">Más antiguo</option>
                    </select>

                    </div>

                    <div className="horas-filtro-item">

                    <label className="horas-label">Monto presupuesto</label>

                    <select
                        className="horas-select"
                        value={ordenMonto}
                        onChange={(e) => setOrdenMonto(e.target.value)}
                    >
                        <option value="">Sin ordenar</option>
                        <option value="mayor">Mayor a menor</option>
                        <option value="menor">Menor a mayor</option>
                    </select>

                    </div>

                    <div className="horas-filtro-item">

                    <label className="horas-label">Horas asignadas</label>

                    <select
                        className="horas-select"
                        value={ordenHoras}
                        onChange={(e) => setOrdenHoras(e.target.value)}
                    >
                        <option value="">Sin ordenar</option>
                        <option value="mayor">Mayor a menor</option>
                        <option value="menor">Menor a mayor</option>
                    </select>

                    </div>

                    </div>

                    <hr className="horas-divider" />

                    {presupuestosOrdenados.map(p => {

                        const total = totalPresupuesto(p);
                        const usadas = totalHorasAsignadas(p);
                        const restantes = total - usadas;

                        // ORDENAR INVESTIGADORES POR HORAS EN ESTE PRESUPUESTO
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

                            <div key={p.id} className="horas-presupuesto-card">

                                <h3 className="horas-presupuesto-title">{p.categoria} - {p.descripcion}</h3>

                                <div className="horas-resumen-grid">
                                <p><strong>Fecha asignacion:</strong> {p.fechaAsignacion}</p>

                                <p><strong>Horas por mes:</strong> {p.cantidadHoras}</p>

                                <p><strong>Meses:</strong> {p.cantidadMeses}</p>

                                <p><strong>Total horas presupuesto:</strong> {total}</p>

                                <p><strong>Horas asignadas:</strong> {usadas}</p>

                                <p>
                                    <strong>Horas restantes:</strong> {restantes}
                                </p>

                                </div>

                                <h4 className="horas-asignadas-subtitle">Horas asignadas a investigadores</h4>

                                <table className="horas-asignadas-table">

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

                                <hr className="horas-divider" />

                            </div>

                        );

                    })}

                </div>

            )}

            </div>

        </div>

    );

};

export default ConsultaPresupuestos;
