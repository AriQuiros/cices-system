// src/paginas/administrador/Administrador.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Administrador.css";

function Administrador() {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const { pathname, state } = location;          // ← recibe { toast } desde login
    const navigate = useNavigate();
    const [toast, setToast] = useState(state?.toast || "");

    // Esc para cerrar panel
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Cierra panel al cambiar de ruta
    useEffect(() => { setOpen(false); }, [pathname]);

    // Auto-oculta toast y limpia history.state para no reaparecer
    useEffect(() => {
        if (!toast) return;
        const id = setTimeout(() => {
            setToast("");
            navigate(".", { replace: true, state: {} });
        }, 2500);
        return () => clearTimeout(id);
    }, [toast, navigate]);

    return (
        <div className="contenedor_administrador">
            <div className="contenido_administrador">
                <div className="admin-toolbar">
                    <button
                        className="menu-btn"
                        type="button"
                        aria-label="Abrir menú"
                        aria-haspopup="dialog"
                        aria-expanded={open}
                        onClick={() => setOpen(true)}
                    >
                        ⋮
                    </button>
                </div>

                <section className="Busqueda">
                    <div className="buscador">
                        <form className="buscar" onSubmit={(e)=>e.preventDefault()}>
                            <input type="text" name="speciality" placeholder="Proyecto/Investigador" />
                            <button type="submit">Buscar</button>
                        </form>
                    </div>
                </section>

                <section className="resultado">
                    <div className="resultado">
                        <p>esto es una lista<br/>esto es una lista<br/>...</p>
                    </div>
                </section>
            </div>

            <aside
                className={`side-panel ${open ? "open" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-label="Menú rápido"
            >
                <div className="panel-header">
                    <strong>Acciones</strong>
                    <button className="close-btn" type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)}>×</button>
                </div>
                <nav className="panel-nav">
                    <ul>
                        <li><Link to="/proyectos/registrar">Registrar proyecto</Link></li>
                        <li><Link to="/proyectos/actualizar">Actualizar proyecto</Link></li>
                        <li><Link to="/proyectos/asignar-investigadores">Asignar investigadores a proyectos</Link></li>
                        <li><Link to="/notificaciones">Notificaciones</Link></li>
                        <li><Link to="/reportes">Generar reportes</Link></li>
                        <li><Link to="/buscar/investigador">Buscar investigador</Link></li>
                        <li><Link to="/buscar/proyecto">Buscar proyecto</Link></li>
                        <li><Link to="/logout">Cerrar sesión</Link></li>
                    </ul>
                </nav>
            </aside>

            <div className={`backdrop ${open ? "show" : ""}`} onClick={() => setOpen(false)} />

            {toast && <div className="toast-welcome">{toast}</div>}
        </div>
    );
}

export default Administrador;


