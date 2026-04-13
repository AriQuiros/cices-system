import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";

/* IMÁGENES */
import notificacionAlertaIcon from "../assets/images/notificacion-alerta.svg";
import notificacionNormalIcon from "../assets/images/notificacion-normal.svg";
import "../App.css"

export default function NotificationMenu() {
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

        window.location.href = "/notificaciones";
    };

    const irATodasLasNotificaciones = () => {
        setMostrarMenuNotificaciones(false);
        window.location.href = "/notificaciones";
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

            if (!res.ok) throw new Error();

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
        let detener = false;

        const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const escucharCambios = async () => {
            while (!detener && !canceladoRef.current) {
                if (!user?.username) {
                    break;
                }

                try {
                    const headers = {
                        "Content-Type": "application/json",
                    };

                    if (token) {
                        headers.Authorization = `Bearer ${token}`;
                    }

                    const res = await fetch(
                        `/api/reports/notificaciones/usuario/${encodeURIComponent(user.username)}/esperar-cambios`,
                        { headers, cache: "no-store" }
                    );

                    if (detener || canceladoRef.current) {
                        break;
                    }

                    if (res.ok) {
                        await cargarNotificaciones();
                        window.dispatchEvent(new Event("notificaciones:actualizadas"));
                    }
                } catch {
                    if (detener || canceladoRef.current) {
                        break;
                    }

                    await esperar(2000);
                }
            }
        };

        const manejarRefresh = () => cargarNotificaciones();
        window.addEventListener("notificaciones:actualizadas", manejarRefresh);
        escucharCambios();

        return () => {
            detener = true;
            canceladoRef.current = true;
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

    if (!user) return null;

    return (
        <div className="notification-menu-wrapper" ref={notificacionesMenuRef}>
            <button
                type="button"
                className="notification-bell-btn"
                onClick={manejarClickCampana}
            >
                <img
                    src={tieneNoLeidas ? notificacionAlertaIcon : notificacionNormalIcon}
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
                                <p className="notification-summary-item-text">
                                    {obtenerResumenNotificacion(notificacion)}
                                </p>
                            </div>
                        ))}

                        {notificacionesNoLeidas.length > 4 && (
                            <p className="notification-summary-more">
                                y {notificacionesNoLeidas.length - 4} más...
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
    );
}