import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import "./Director.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Director() {
    const { token } = useContext(AppContext);
    const [data, setData] = useState(null);
    const [err, setErr] = useState("");

    useEffect(() => {
        if (!token) return;
        let cancel = false;
        (async () => {
            try {
                const res = await fetch(`${API}/director/resumen?dias=30`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error();
                const json = await res.json();
                if (!cancel) setData(json);
            } catch {
                if (!cancel) setErr("No se pudo cargar el resumen");
            }
        })();
        return () => { cancel = true; };
    }, [token]);

    const d = data ?? {
        certsPorVencer: 0,
        investigadoresActivos: 0,
        totalInvestigadores: 0,
        personalAdministrativo: 0,
        totalProyectos: 0,
        investigadoresAsignados: 0,
    };

    return (
        <div className="contenedor_director">
            <div className="resumen_funcionalidades">
                <section className="resumen_personal">
                    <h3>Resumen de personal</h3>
                    <div className="label">
                        <label>Certificaciones próximas a vencer: {d.certsPorVencer}</label>
                        <label>Investigadores activos: {d.investigadoresActivos}</label>
                        <label>Total investigadores: {d.totalInvestigadores}</label>
                        <label>Personal administrativo: {d.personalAdministrativo}</label>
                    </div>
                </section>

                <section className="resumen_proyectos">
                    <h3>
                        Resumen de proyectos
                        {err && <span className="error-chip">No se pudo cargar el resumen</span>}
                    </h3>
                    <div className="label">
                        <label>Total proyectos: {d.totalProyectos}</label>
                        <label>Investigadores asignados: {d.investigadoresAsignados}</label>
                    </div>
                </section>
            </div>
        </div>
    );
}
