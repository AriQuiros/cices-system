import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import "../../styles/paginas.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function ProyectoHorasAsignadas() {
    const { id } = useParams();
    const { token } = useContext(AppContext);

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
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                const text = await res.text();

                if (!res.ok) {
                    if (!cancel) setErr(`HTTP ${res.status}`);
                    return;
                }

                const json = text ? JSON.parse(text) : null;

                if (!cancel) {
                    setData(json);
                }
            } catch (e) {
                console.error("Error cargando horas asignadas:", e);
                if (!cancel) setErr("No se pudo conectar con el servidor.");
            } finally {
                if (!cancel) setLoading(false);
            }
        })();

        return () => {
            cancel = true;
        };
    }, [id, token]);

    if (loading) {
        return (
            <div className="pha-wrap">
                <p>Cargando…</p>
            </div>
        );
    }

    if (err) {
        return (
            <div className="pha-wrap">
                <div className="pha-card pha-error">
                    <strong>Error:</strong> {err}
                </div>
                <Link to="/administrador" className="btn-volver">
                    ← Volver
                </Link>
            </div>
        );
    }

    const proyectoNombre = data?.proyectoNombre ?? "";
    const investigadores = Array.isArray(data?.investigadores) ? data.investigadores : [];
    const totalHorasAsignadas = Number(data?.totalHorasAsignadas ?? 0);
    const totalHorasDisponibles = Number(data?.totalHorasDisponibles ?? 0);

    return (
        <div className="pha-wrap">
            <div className="pha-header">
                <Link to="/administrador" className="btn-volver">
                    ← Volver
                </Link>
                <h2>Horas asignadas — Proyecto {proyectoNombre}</h2>
            </div>

            <div className="pha-totales">
                <div className="badge">
                    <span>Total de horas asignadas</span>
                    <strong>{totalHorasAsignadas}</strong>
                </div>

                <div className="badge">
                    <span>Total de horas disponibles</span>
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
                        <th>Régimen / tipo</th>
                        <th>Horas al mes</th>
                        <th>Duración (meses)</th>
                        <th>Total asignado</th>
                    </tr>
                    </thead>
                    <tbody>
                    {investigadores.map((inv, index) => {
                        const horasMes = Number(inv?.horasMesAsignadas ?? 0);
                        const meses = Number(inv?.mesesTotales ?? 0);
                        const total = horasMes * meses;

                        return (
                            <tr key={inv?.idInvestigador ?? index}>
                                <td>{index + 1}</td>
                                <td>{inv?.nombreCompleto ?? ""}</td>
                                <td>{inv?.tipoHoras ?? ""}</td>
                                <td>{horasMes}</td>
                                <td>{meses}</td>
                                <td>{total}</td>
                            </tr>
                        );
                    })}

                    {investigadores.length === 0 && (
                        <tr>
                            <td colSpan={6}>
                                <em>No hay horas asignadas para este proyecto.</em>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}