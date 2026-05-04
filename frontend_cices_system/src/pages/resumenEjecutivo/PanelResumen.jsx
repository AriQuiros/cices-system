import { useResumenEjecutivo } from "../../hooks/referenceDataHooks/useResumenEjecutivo.js";
import "./Director.css";

export default function PanelResumen() {
    const { data, isLoading, isError } = useResumenEjecutivo();
    const resumen = data?.data?.[0];
    if (isLoading) return <p>Cargando resumen...</p>;
    if (isError)   return <p>No se pudo cargar el resumen.</p>;

    return (
        <div className="contenedor_director">
            <div className="resumen_funcionalidades">

                <section className="resumen_personal">
                    <h3>Resumen de usuarios</h3>
                    <div className="label">
                        <label>Total usuarios: {resumen?.totalUsuarios || 0}</label>
                        <label>Investigadores registrados: {resumen?.investigadoresRegistrados || 0}</label>
                        <label>Administrativos: {resumen?.administrativos || 0}</label>
                        <label>Asistentes: {resumen?.asistentes || 0}</label>
                        <label>Directores: {resumen?.directores || 0}</label>
                        <label>Usuarios inactivos: {resumen?.usuariosInactivos || 0}</label>
                    </div>
                </section>

                <section className="resumen_proyectos">
                    <h3>Resumen de proyectos</h3>
                    <div className="label">
                        <label>Total proyectos: {resumen?.totalProyectos || 0}</label>
                        <label>Proyectos activos: {resumen?.proyectosActivos || 0}</label>
                        <label>Proyectos inactivos: {resumen?.proyectosInactivos || 0}</label>
                        <label>Certificaciones vigentes: {resumen?.certificacionesVigentes || 0}</label>
                        <label>Certificaciones por vencer: {resumen?.certificacionesPorVencer || 0}</label>
                        <label>Certificaciones vencidas: {resumen?.certificacionesVencidas || 0}</label>
                    </div>
                </section>

            </div>
        </div>
    );
}