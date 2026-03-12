import React, { useContext, useMemo, useState } from "react";
import { notify } from "../../../utils/ui/notify.jsx";
import { AppContext } from "../../../context/AppContext.jsx";

import { DistribucionHoras } from "../../../services/ReportesService.jsx";
import { obtenerInvestigadoresProyecto } from "../../../services/ReportesService.jsx";
import BuscadorProyecto from "../../../components/BusquedaProyecto.jsx";

const ConsultaPresupuestos = () => {

    const { token } = useContext(AppContext);

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

    const obtenerFechasInvestigador = (id) =>
        investigadoresProyecto.find(i => i.id === id);

    return (

        <div>

            <h2>Consulta de Presupuestos</h2>

            <BuscadorProyecto
                token={token}
                onSelect={seleccionarProyecto}
            />

            {proyectoSeleccionado && (

                <div>

                    <h3>Información del presupesto - Horas</h3>
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

                        return (

                            <div key={p.id}>

                                <h3>{p.categoria} - {p.descripcion}</h3>

                                <p><strong>Fecha asignación:</strong> {p.fechaAsignacion}</p>

                                <p><strong>Horas por mes:</strong> {p.cantidadHoras}</p>

                                <p><strong>Meses:</strong> {p.cantidadMeses}</p>

                                <p><strong>Total horas presupuesto:</strong> {total}</p>

                                <p><strong>Horas asignadas:</strong> {usadas}</p>

                                <p >
                                    <strong>Horas restantes:</strong> {restantes}
                                </p>

                                <h4>Horas asignadas a investigadores</h4>

                                <table border="1">

                                    <thead>
                                    <tr>
                                        <th>Investigador</th>
                                        <th>Fecha inicio</th>
                                        <th>Fecha fin</th>
                                        <th>Horas/Mes</th>
                                        <th>Meses</th>
                                        <th>Total</th>
                                    </tr>
                                    </thead>

                                    <tbody>

                                    {p.horas?.map(h => {

                                        const inv = obtenerFechasInvestigador(h.investigador?.id);

                                        const totalInv =
                                            (h.cantidadHorasMes || 0) *
                                            (h.cantidadMeses || 0);

                                        return (

                                            <tr key={h.id}>

                                                <td>{h.investigador?.nombreInvestigador}</td>

                                                <td>{inv?.fechaInicio || "-"}</td>

                                                <td>{inv?.fechaFin || "-"}</td>

                                                <td>{h.cantidadHorasMes}</td>

                                                <td>{h.cantidadMeses}</td>

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