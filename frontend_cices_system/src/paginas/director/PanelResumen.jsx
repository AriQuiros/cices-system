import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { getResumen } from "../../services/UtilsService.jsx";
import "./Director.css";
import {notify} from "../../utils/ui/notify.jsx";

export default function PanelResumen() {
    const { token } = useContext(AppContext);
    const [data, setData] = useState({});

    useEffect(() => {
        //if (!token) return;
        getResumen(token)
            .then(res => setData(res))
            .catch(() => notify.error("No se pudo cargar el resumen"));
    }, [token]);

    return (
        <div className="contenedor_director">
            <div className="resumen_funcionalidades">

                <section className="resumen_personal">
                    <h3>Resumen de usuarios</h3>
                    <div className="label">
                        <label>Total usuarios: {data.totalUsuarios || 0}</label>
                        <label>Investigadores registrados: {data.investigadoresRegistrados || 0}</label>
                        <label>Administrativos: {data.administrativos || 0}</label>
                        <label>Asistentes: {data.asistentes || 0}</label>
                        <label>Directores: {data.directores || 0}</label>
                        <label>Usuarios inactivos: {data.usuariosInactivos || 0}</label>
                    </div>
                </section>

                <section className="resumen_proyectos">
                    <h3>Resumen de proyectos</h3>
                    <div className="label">
                        <label>Total proyectos: {data.totalProyectos || 0}</label>
                        <label>Proyectos activos: {data.proyectosActivos || 0}</label>
                        <label>Proyectos inactivos: {data.proyectosInactivos || 0}</label>
                        <label>Certificaciones vigentes: {data.certificacionesVigentes || 0}</label>
                        <label>Certificaciones por vencer: {data.certificacionesPorVencer || 0}</label>
                        <label>Certificaciones vencidas: {data.certificacionesVencidas || 0}</label>

                    </div>
                </section>

            </div>
        </div>
    );
}