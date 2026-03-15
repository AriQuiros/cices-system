import React, { useContext, useMemo, useState } from "react";
import { notify } from "../../../utils/ui/notify.jsx";
import { AppContext } from "../../../context/AppContext.jsx";

import { DistribucionHoras } from "../../../services/ReportesService.jsx";
import { obtenerInvestigadoresProyecto } from "../../../services/ReportesService.jsx";
import BuscadorProyecto from "../../../components/BusquedaProyecto.jsx";

const ConsultaPresupuestos = () => {

    const { token, user } = useContext(AppContext);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    const [presupuestos, setPresupuestos] = useState([]);
    const [investigadoresProyecto, setInvestigadoresProyecto] = useState([]);

    const [ordenFecha, setOrdenFecha] = useState("reciente");
    const [ordenMonto, setOrdenMonto] = useState("");
    const [ordenHoras, setOrdenHoras] = useState("");

    const seleccionarProyecto = async (proyecto) => {

        if (!proyecto) {
            setProyectoSeleccionado(null);
            return;
        }

        setProyectoSeleccionado(proyecto);

        try {

            const data = await DistribucionHoras.obtenerPorProyecto(proyecto.codigoProyecto);
            setPresupuestos(data || []);

            const inv = await obtenerInvestigadoresProyecto(proyecto.codigoProyecto, token);
            setInvestigadoresProyecto(inv || []);

        } catch {

            notify.error("Error cargando datos");

        }

    };

    const totalPresupuesto = (p) =>
        (p.cantidadHoras || 0) * (p.cantidadMeses || 0);

    const totalHorasAsignadas = (p) =>
        (p.horas || []).reduce(
            (acc, h) => acc + ((h.cantidadHorasMes || 0) * (h.cantidadMeses || 0)),
            0
        );

    const presupuestosOrdenados = useMemo(() => {

        let lista = [...presupuestos];

        if (ordenFecha) {

            lista.sort((a, b) => {

                const fa = new Date(a.fechaAsignacion);
                const fb = new Date(b.fechaAsignacion);

                return ordenFecha === "reciente"
                    ? fb - fa
                    : fa - fb;

            });

        }

        if (ordenMonto) {

            lista.sort((a, b) => {

                const ma = totalPresupuesto(a);
                const mb = totalPresupuesto(b);

                return ordenMonto === "mayor"
                    ? mb - ma
                    : ma - mb;

            });

        }

        if (ordenHoras) {

            lista.sort((a, b) => {

                const ha = totalHorasAsignadas(a);
                const hb = totalHorasAsignadas(b);

                return ordenHoras === "mayor"
                    ? hb - ha
                    : ha - hb;

            });

        }

        return lista;

    }, [presupuestos, ordenFecha, ordenMonto, ordenHoras]);

    return (

        <div>

            <h2>Consulta de Presupuestos</h2>

            <BuscadorProyecto
                token={token}
                user={user}
                onSelect={seleccionarProyecto}
            />

            {proyectoSeleccionado && (

                <div>

                    <h3>Información del presupuesto - Horas</h3>

                    <label>Fecha asignación:</label>

                    <select
                        value={ordenFecha}
                        onChange={(e) => setOrdenFecha(e.target.value)}
                    >
                        <option value="reciente">Más reciente</option>
                        <option value="antiguo">Más antiguo</option>
                    </select>

                    <label>Monto presupuesto:</label>

                    <select
                        value={ordenMonto}
                        onChange={(e) => setOrdenMonto(e.target.value)}
                    >
                        <option value="">Sin ordenar</option>
                        <option value="mayor">Mayor a menor</option>
                        <option value="menor">Menor a mayor</option>
                    </select>

                    <label>Horas asignadas:</label>

                    <select
                        value={ordenHoras}
                        onChange={(e) => setOrdenHoras(e.target.value)}
                    >
                        <option value="">Sin ordenar</option>
                        <option value="mayor">Mayor a menor</option>
                        <option value="menor">Menor a mayor</option>
                    </select>

                    <hr />

                    {presupuestosOrdenados.map(p => {

                        const total = totalPresupuesto(p);
                        const usadas = totalHorasAsignadas(p);
                        const restantes = total - usadas;

                        // ORDENAR INVESTIGADORES POR HORAS EN ESTE PRESUPUESTO
                        const investigadoresOrdenados = [...investigadoresProyecto].sort((a, b) => {

                            const ha = p.horas?.find(h => h.investigador?.id === a.id);
                            const hb = p.horas?.find(h => h.investigador?.id === b.id);

                            const totalA = (ha?.cantidadHorasMes || 0) * (ha?.cantidadMeses || 0);
                            const totalB = (hb?.cantidadHorasMes || 0) * (hb?.cantidadMeses || 0);

                            if (ordenHoras === "mayor") return totalB - totalA;
                            if (ordenHoras === "menor") return totalA - totalB;

                            return 0;

                        });

                        return (

                            <div key={p.id}>

                                <h3>{p.categoria} - {p.descripcion}</h3>

                                <p><strong>Fecha asignación:</strong> {p.fechaAsignacion}</p>

                                <p><strong>Horas por mes:</strong> {p.cantidadHoras}</p>

                                <p><strong>Meses:</strong> {p.cantidadMeses}</p>

                                <p><strong>Total horas presupuesto:</strong> {total}</p>

                                <p><strong>Horas asignadas:</strong> {usadas}</p>

                                <p>
                                    <strong>Horas restantes:</strong> {restantes}
                                </p>

                                <h4>Horas asignadas a investigadores</h4>

                                <table border="1">

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

                                        const h = p.horas?.find(hora => hora.investigador?.id === inv.id);

                                        const totalInv =
                                            (h?.cantidadHorasMes || 0) *
                                            (h?.cantidadMeses || 0);

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

                                <hr />

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );

};

export default ConsultaPresupuestos;
