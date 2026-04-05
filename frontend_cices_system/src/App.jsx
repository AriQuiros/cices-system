import { BrowserRouter } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AppRoutes from "./utils/routes/AppRoutes";
import { Toaster } from "sonner";

import "./App.css";
import "./index.css";

/* IMÁGENES */
import logoUCR from "./assets/images/logoUCR.png";
import logoCICES from "./assets/images/logoCICES.png";
import logoCICES2 from "./assets/images/logoCICES2.png";
import notificacionAlertaIcon from "./assets/images/notificacion-alerta.svg";
import notificacionNormalIcon from "./assets/images/notificacion-normal.svg";
import { Link } from "react-router-dom";

/* CONTEXTO */
import AppProvider from "./context/AppProvider.jsx";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "./context/AppContext.jsx";

function App() {
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <AppProvider>
            <Toaster richColors position="top-center"/>
            <div className="app-container flex flex-col min-h-screen">
                <BrowserRouter>
                    <Header menuAbierto={menuAbierto} setMenuAbierto={setMenuAbierto} />
                    <Main menuAbierto={menuAbierto}  setMenuAbierto={setMenuAbierto} />
                    <Footer />
                </BrowserRouter>
            </div>
        </AppProvider>
    );
}

function Main({ menuAbierto, setMenuAbierto }) {
    return (
        <main className="flex flex-1 min-h-0 pt-22.75">
                <Sidebar
                    abierto={menuAbierto}
                    setMenuAbierto={setMenuAbierto}
                    className="h-full overflow-y-auto"
                />
            <div className="flex-1 min-h-0">
                <AppRoutes />
            </div>
        </main>
    );
}

function Header({ menuAbierto, setMenuAbierto }) {
    const { user, token } = useContext(AppContext);
    const [tieneNoLeidas, setTieneNoLeidas] = useState(false);
    const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState([]);
    const [mostrarMenuNotificaciones, setMostrarMenuNotificaciones] = useState(false);
    const notificacionesMenuRef = useRef(null);
    const canceladoRef = useRef(false);

    const normalizarTexto = (valor) =>
        String(valor || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    const obtenerValorCampo = (notificacion, nombreCampo) => {
        const buscado = normalizarTexto(nombreCampo);
        const campo = (notificacion?.detalle || []).find(
            (c) => normalizarTexto(c?.label) === buscado
        );
        return campo?.value || "-";
    };

    const obtenerResumenNotificacion = (notificacion) => {
        const tipo = normalizarTexto(notificacion?.tipo);

        if (tipo === "informe") {
            return `Codigo del proyecto: ${obtenerValorCampo(notificacion, "Codigo de proyecto")} | Numero del informe: ${obtenerValorCampo(notificacion, "Numero de informe")} | Fecha de presentacion: ${obtenerValorCampo(notificacion, "Fecha de presentacion")}`;
        }

        if (tipo === "acreditacion o licencia" || tipo === "acreditacion") {
            return `Nombre de la acreditacion o licencia: ${obtenerValorCampo(notificacion, "Nombre de la acreditacion o licencia")} | Fecha de expiracion: ${obtenerValorCampo(notificacion, "Fecha de expiracion")} | Nombre del investigador: ${obtenerValorCampo(notificacion, "Nombre del investigador")}`;
        }

        if (tipo === "permiso coordinador") {
            return `Codigo del proyecto: ${obtenerValorCampo(notificacion, "Codigo de proyecto")} | Fecha de inicio: ${obtenerValorCampo(notificacion, "Fecha de inicio")} | Fecha de fin: ${obtenerValorCampo(notificacion, "Fecha fin")}`;
        }

        return (notificacion?.detalle || [])
            .map((c) => `${c?.label}: ${c?.value || "-"}`)
            .join(" | ");
    };

    const manejarClickCampana = () => {
        if (tieneNoLeidas) {
            setMostrarMenuNotificaciones((prev) => !prev);
            return;
        }

        window.location.href = "/Notificaciones";
    };

    const irATodasLasNotificaciones = () => {
        setMostrarMenuNotificaciones(false);
        window.location.href = "/Notificaciones";
    };

    const cargarNotificaciones = async () => {
        if (!user?.username) {
            setTieneNoLeidas(false);
            setNotificacionesNoLeidas([]);
            setMostrarMenuNotificaciones(false);
            return;
        }

        try {
            const headers = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const res = await fetch(
                `/api/reports/notificaciones/usuario/${encodeURIComponent(user.username)}/detalladas`,
                { headers }
            );

            if (!res.ok) throw new Error("No se pudieron cargar notificaciones");

            const data = await res.json();
            const noLeidas = Array.isArray(data)
                ? data.filter((n) => n && n.leido === false && n.eliminado !== true)
                : [];

            if (!canceladoRef.current) {
                setNotificacionesNoLeidas(noLeidas);
                setTieneNoLeidas(noLeidas.length > 0);
                if (noLeidas.length === 0) {
                    setMostrarMenuNotificaciones(false);
                }
            }
        } catch {
            if (!canceladoRef.current) {
                setTieneNoLeidas(false);
                setNotificacionesNoLeidas([]);
                setMostrarMenuNotificaciones(false);
            }
        }
    };

    useEffect(() => {
        canceladoRef.current = false;
        cargarNotificaciones();
        const intervalo = setInterval(cargarNotificaciones, 30000);
        const manejarRefresh = () => cargarNotificaciones();

        window.addEventListener("notificaciones:actualizadas", manejarRefresh);

        return () => {
            canceladoRef.current = true;
            clearInterval(intervalo);
            window.removeEventListener("notificaciones:actualizadas", manejarRefresh);
        };
    }, [user?.username, token]);

    useEffect(() => {
        if (!mostrarMenuNotificaciones) return;

        const manejarClickFuera = (event) => {
            if (notificacionesMenuRef.current && !notificacionesMenuRef.current.contains(event.target)) {
                setMostrarMenuNotificaciones(false);
            }
        };

        document.addEventListener("mousedown", manejarClickFuera);
        return () => document.removeEventListener("mousedown", manejarClickFuera);
    }, [mostrarMenuNotificaciones]);

    return (
        <header>
            <div className="header-content">
                <Link to="/dashboard" className="page-name">
                    Sistema de Información del CICES
                </Link>
                <div className="logos">
                    <img src={logoUCR} alt="Logo UCR" />
                    <img src={logoCICES} alt="Logo CICES" />
                </div>
            </div>
            <div className="divider">
                {user && (
                    <div className="topbar-actions">
                        <button
                            onClick={() => setMenuAbierto(!menuAbierto)}
                            className="p-1 text-2 menu-toggle-btn"
                            aria-label="Abrir menu"
                        >
                            ☰
                        </button>

                        <div className="notification-menu-wrapper" ref={notificacionesMenuRef}>
                            <button
                                type="button"
                                className="notification-bell-btn"
                                onClick={manejarClickCampana}
                                aria-label={tieneNoLeidas ? "Tiene notificaciones no leidas" : "No tiene notificaciones activas"}
                                title={tieneNoLeidas ? "Tiene notificaciones no leidas" : "No tiene notificaciones activas"}
                            >
                                <img
                                    src={tieneNoLeidas ? notificacionAlertaIcon : notificacionNormalIcon}
                                    alt={tieneNoLeidas ? "Notificaciones no leidas" : "Sin notificaciones activas"}
                                    className="notification-bell-img"
                                />
                            </button>

                            {tieneNoLeidas && mostrarMenuNotificaciones && (
                                <div className="notification-summary-menu">
                                    <p className="notification-summary-title">Notificaciones pendientes</p>

                                    <div className="notification-summary-list">
                                        {notificacionesNoLeidas.slice(0, 4).map((notificacion) => (
                                            <div key={notificacion.idNotificacionUsuario} className="notification-summary-item">
                                                <p className="notification-summary-item-type">{notificacion.tipo || "Notificacion"}</p>
                                                <p className="notification-summary-item-text">{obtenerResumenNotificacion(notificacion)}</p>
                                            </div>
                                        ))}

                                        {notificacionesNoLeidas.length > 4 && (
                                            <p className="notification-summary-more">
                                                y {notificacionesNoLeidas.length - 4} notificacion(es) mas...
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        className="notification-view-all-btn"
                                        onClick={irATodasLasNotificaciones}
                                    >
                                        Ver todas las notificaciones
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <div className="footer-logo">
                    <img src={logoCICES2} alt="LogoFooterCices" />
                </div>
                <div className="footer-contact">
                    <p>
                        Correo: cices@ucr.ac.cr
                        <br />
                        Teléfono: 2511-5191 / 2511-5187
                        <br />
                        Horario: De Lunes a Viernes de 7:00 a.m. a 5:00 p.m.
                    </p>
                </div>
                <div className="footer-location">
                    <p>
                        Ubicación: 2do piso de la Escuela de Enfermería,
                        <br />
                        Ciudad de la Investigación, frente al INISA;
                        <br />
                        Universidad de Costa Rica
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default App;
