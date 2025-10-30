// src/paginas/proyecto/ProyectoHorasAsignadas.jsx
import {useContext, useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {AppContext} from "../../context/AppContext.jsx";
import "./ProyectoHorasAsignadas.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function ProyectoHorasAsignadas() {
    const { id } = useParams();                 // id del proyecto
    const { token } = useContext(AppContext);   // JWT
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        console.log("Horas Asignadas:", data);
    }, [data]);


    useEffect(() => {
        let cancel = false;

        (async () => {
            setLoading(true);
            setErr("");
            try {
                const res = await fetch(`${API}/api/proyectos/${id}/horas-asignadas`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) {
                    const msg = `HTTP ${res.status}`;
                    setErr(msg);
                    return;
                }
                const json = await res.json();
                if (!cancel) setData(json);
            } catch {
                if (!cancel) setErr("No se pudo conectar con el servidor.");
            } finally {
                if (!cancel) setLoading(false);
            }
        })();

        return () => { cancel = true; };
    }, [id, token]);

    if (loading) return <div className="pha-wrap"><p>Cargando…</p></div>;
    if (err) return (
        <div className="pha-wrap">
            <div className="pha-card error">Error: {err}</div>
            <Link to={`/administrador`} className="btn-volver">← Volver</Link>
        </div>
    );
    if (!data) return null;


    const { proyectoNombre = '', investigadores = [], totalHorasAsignadas = 0, totalHorasDisponibles = 0 } = data;

    return (
        <div className="pha-wrap">
            <div className="pha-header">
                <Link to={`/administrador`} className="btn-volver">← Volver</Link>

                <h2>Horas asignadas — Proyecto {proyectoNombre}</h2>
            </div>

            <div className="pha-totales">
                <div className="badge">
                    <span>Presupuesto asignado (Carga academica)</span>
                    <strong>{totalHorasAsignadas}</strong>
                </div>
                <div className="badge">
                    <span>Presupuesto actual (Carga academica)</span>
                    <strong>{totalHorasDisponibles}</strong>
                </div>
                <div className="badge">
                    <span>Investigadores totales</span>
                    <strong>{investigadores.length}</strong>
                </div>
            </div>

            <div className="pha-card">
                <table className="pha-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Investigador</th>
                        <th>Carga Horaria</th>
                        <th>Horas asignadas al mes</th>
                        <th>Meses</th>
                        <th>Horas totales asignadas</th>
                    </tr>
                    </thead>
                    <tbody>
                    {investigadores.map((inv, index) => (
                        <tr key={inv.idInvestigador}>
                            <th>{index + 1}</th>
                            <td>{inv.nombreCompleto}</td>
                            <td>{inv.tipoHoras}</td>
                            <td>{inv.horasMesAsignadas}</td>
                            <td>{inv.mesesTotales}</td>
                            <td>{inv.horasMesAsignadas * inv.mesesTotales}</td>
                        </tr>
                    ))}
                    {investigadores.length === 0 && (
                        <tr><td colSpan={3}><em>No hay Investigadores.</em></td></tr>
                    )}
                    </tbody>
                    <tfoot>
                    {/*<tr>*/}
                    {/*    <th>Totales</th>*/}
                    {/*    <th>{totalHorasAsignadas}</th>*/}
                    {/*    <th>—</th>*/}
                    {/*</tr>*/}
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
