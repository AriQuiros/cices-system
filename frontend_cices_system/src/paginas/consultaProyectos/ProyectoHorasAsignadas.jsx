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
            <Link to={`/proyectos/${id}`} className="btn-volver">← Volver</Link>
        </div>
    );
    if (!data) return null;

    const { investigadores = [], totalHorasAsignadas = 0, totalHorasDisponibles = 0 } = data;

    return (
        <div className="pha-wrap">
            <div className="pha-header">
                <h2>Horas asignadas — Proyecto #{id}</h2>
                <Link to={`/proyectos/${id}`} className="btn-volver">← Volver al proyecto</Link>
            </div>

            <div className="pha-totales">
                <div className="badge">
                    <span>Total horas asignadas/mes</span>
                    <strong>{totalHorasAsignadas}</strong>
                </div>
                <div className="badge">
                    <span>Total horas disponibles</span>
                    <strong>{totalHorasDisponibles}</strong>
                </div>
                <div className="badge">
                    <span>Investigadores</span>
                    <strong>{investigadores.length}</strong>
                </div>
            </div>

            <div className="pha-card">
                <table className="pha-table">
                    <thead>
                    <tr>
                        <th>Investigador</th>
                        <th>Horas/mes asignadas</th>
                        <th>Meses</th>
                    </tr>
                    </thead>
                    <tbody>
                    {investigadores.map(inv => (
                        <tr key={inv.idInvestigador}>
                            <td>{inv.nombreCompleto}</td>
                            <td>{inv.horasMesAsignadas}</td>
                            <td>{inv.mesesTotales}</td>
                        </tr>
                    ))}
                    {investigadores.length === 0 && (
                        <tr><td colSpan={3}><em>No hay registros.</em></td></tr>
                    )}
                    </tbody>
                    <tfoot>
                    <tr>
                        <th>Totales</th>
                        <th>{totalHorasAsignadas}</th>
                        <th>—</th>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
