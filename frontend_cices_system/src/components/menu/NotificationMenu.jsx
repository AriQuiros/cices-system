import {useContext, useEffect, useRef, useState} from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { useNotificacionesQuery } from "../../hooks/notificacionHooks/queries/useNotificaciones.js";
import { useSseNotificaciones } from "../../hooks/notificacionHooks/useSseNotificaciones.js";
import { useNavigate } from "react-router-dom";
import notificacionAlertaIcon from "../../assets/images/notificacion-alerta.svg";
import notificacionNormalIcon from "../../assets/images/notificacion-normal.svg";
import "../../App.css";
import {useCantidadNoLeidasQuery} from "../../hooks/notificacionHooks/queries/useCantidadNoLeidas.js";


export default function NotificationMenu() {
    const { user, token } = useContext(AppContext);
    const navigate = useNavigate();
    const [abierto, setAbierto] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (!abierto) return;

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setAbierto(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };

    }, [abierto]);

    // Suscripción SSE — el servidor avisa cuando hay cambios
    useSseNotificaciones(token);

    // Solo las no leídas para el preview de la campana
    const filtro = {
        leido: false
    };

    const pageable = {
        page: 0,
        size: 4
    };

    const { data } = useNotificacionesQuery(filtro, pageable);

    const { data: cantidadNoLeidas = 0 } = useCantidadNoLeidasQuery();

    const noLeidas = data?.content ?? [];

    const tieneNoLeidas = cantidadNoLeidas > 0;


    const irANotificaciones = () => {
        setAbierto(false);
        navigate("/notificaciones");
    };

    const handleCampana = () => {
        if (tieneNoLeidas) {
            setAbierto(prev => !prev);
        } else {
            navigate("/notificaciones");
        }
    };

    if (!user) return null;

    return (
        <div className="notification-menu-wrapper" ref={menuRef}>
            <button type="button" className="notification-bell-btn" onClick={handleCampana}>
                <img
                    src={tieneNoLeidas ? notificacionAlertaIcon : notificacionNormalIcon}
                    className="notification-bell-img"
                    alt="Notificaciones"
                />
                {tieneNoLeidas && (
                    <span className="notification-badge">{cantidadNoLeidas}</span>
                )}
            </button>

            {abierto && tieneNoLeidas && (
                <div className="notification-summary-menu">
                    <p className="notification-summary-title">Notificaciones pendientes</p>
                    <div className="notification-summary-list">
                        {noLeidas.slice(0, 4).map(n => (
                            <div key={n.idNotificacionUsuario} className="notification-summary-item">
                                <p className="notification-summary-item-type">
                                    {n.categoria || "Notificación"}
                                </p>
                                <p className="notification-summary-item-text">
                                    <strong>{n.asunto}</strong>
                                    {n.mensaje ? ` — ${n.mensaje}` : ""}
                                </p>
                            </div>
                        ))}
                        {cantidadNoLeidas > 4 && (
                            <p className="notification-summary-more">
                                y {cantidadNoLeidas - 4} más...
                            </p>
                        )}
                    </div>
                    <button type="button" className="notification-view-all-btn"
                            onClick={irANotificaciones}>
                        Ver todas las notificaciones
                    </button>
                </div>
            )}
        </div>
    );
}