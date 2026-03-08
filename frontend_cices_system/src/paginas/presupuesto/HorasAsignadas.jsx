import React, { useEffect, useState } from "react";
import { DistribucionHoras } from "../../services/ReportesService.jsx";
import {notify} from "../../utils/estilo/notify.jsx";

const HorasAsignadas = ({ codigoProyecto }) => {

    const [presupuestos, setPresupuestos] = useState([]);

    useEffect(() => {
        cargarDatos();
    }, [codigoProyecto]);

    const cargarDatos = async () => {
        try {
            const data = await DistribucionHoras.obtenerPorProyecto("C1766");
            setPresupuestos(data);
        } catch (error) {
            notify.error(error);
        }
    };

    const totalAsignado = (horas) => {
        return horas.reduce((acc, h) => acc + (h.horasMes * h.cantidadMeses), 0);
    };

    return (
        <div>

            <h1>Presupuestos de Horas</h1>

            {presupuestos.map((p, index) => {

                const totalPresupuesto = p.cantidadHoras * p.cantidadMeses;
                const asignado = totalAsignado(p.horas);
                const restante = totalPresupuesto - asignado;

                return (
                    <div key={index}>

                        <h2>Presupuesto</h2>

                        <p><b>Descripción:</b> {p.descripcion}</p>
                        <p><b>Categoría:</b> {p.categoria}</p>
                        <p><b>Fecha asignación:</b> {p.fechaAsignacion}</p>
                        <p><b>Tipo:</b> {p.tipoPresupuesto}</p>

                        <p><b>Horas por mes:</b> {p.cantidadHoras}</p>
                        <p><b>Cantidad de meses:</b> {p.cantidadMeses}</p>
                        <p><b>Total horas x meses:</b> {totalPresupuesto}</p>

                        <p><b>Horas asignadas:</b> {asignado}</p>
                        <p><b>Horas restantes:</b> {restante}</p>

                        <h3>Detalle de horas asignadas</h3>

                        <table border="1">
                            <thead>
                            <tr>
                                <th>Investigador</th>
                                <th>Modalidad</th>
                                <th>Horas Mes</th>
                                <th>Meses</th>
                                <th>Total Horas</th>
                            </tr>
                            </thead>
                            <tbody>

                            {p.horas.map((h, i) => {

                                const total = h.horasMes * h.cantidadMeses;

                                return (
                                    <tr key={i}>
                                        <td>{h.nombreInvestigador}</td>
                                        <td>{h.modalidad}</td>
                                        <td>{h.horasMes}</td>
                                        <td>{h.cantidadMeses}</td>
                                        <td>{total}</td>
                                    </tr>
                                );
                            })}

                            </tbody>
                        </table>

                        <hr/>

                    </div>
                );
            })}

        </div>
    );
};

export default HorasAsignadas;