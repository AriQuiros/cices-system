import { Routes, Route } from "react-router-dom";

/* LOGIN */
import Login from "../pages/auth/Login.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";

/* USUARIOS */
import Registro from "../pages/formUsuario/Registro.jsx";
import Perfil from "../pages/formUsuario/Perfil.jsx";
import ConsultaPersonal from "../pages/consultaAdminInvestigador/ConsultaPersonal.jsx";
import ConsultaInvestigadores from "../pages/consultaAdminInvestigador/ConsultaInvestigadores.jsx";
import GestionUsuarios from "../pages/usuarios/GestionUsuarios.jsx";

/* USUARIOS */
import CertificacionesInvestigador from "../pages/certificacionesInvestigador/CertificacionesInvestigador.jsx";

/* PROYECTOS */
import RegistroProyecto from "../pages/proyecto/RegistroProyecto.jsx";
import RegistroPresupuesto from "../pages/presupuesto/GestionPresupuesto.jsx";

/* CONSULTA PROYECTOS */
import ListadoProyectos from "../pages/consultaProyectos/ListadoProyectos.jsx";
import VerProyecto from "../pages/consultaProyectos/VerProyecto.jsx";

/* PRESUPUESTO */
import GestionHoras from "../pages/horas/GestionHoras.jsx";
import GestionGastos from "../pages/gasto/GestionGastos.jsx";
import ConsultaGastos from "../pages/gasto/ConsultaGastos.jsx";
import HorasAsignadas from "../pages/horas/HorasAsignadas.jsx";

/* ASIGNACIONES */
import AsignarInvestigadores from "../pages/investigadorProyecto/AsignarInvestigadores.jsx";

import GestionPermisoProyecto from "../pages/permisoProyecto/GestionPermisosProyecto.jsx";

/* DIRECTOR */
import PanelResumen from "../pages/resumenEjecutivo/PanelResumen.jsx";

/* NOTIFICACIONES */
import NotificacionesPage from "../pages/notificaciones/Notificaciones.jsx";

/* REPORTES */
import ReporteProyectos from "../pages/reportes/ReportesProyectos.jsx"
import ReportePresupuestos from "../pages/reportes/ReportePresupuestos.jsx";
import ReporteCertificaciones from "../pages/reportes/ReporteCertificaciones.jsx";
import ReporteInvestigadoresParticipantes from "../pages/reportes/ReporteInvestigadoresParticipantes.jsx";

function AppRoutes() {
    return (
        <main>
            <Routes>

                {/* LOGIN */}
                <Route path="/" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* USUARIOS */}
                <Route path="/registro" element={<Registro />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/consulta-personal" element={<ConsultaPersonal />} />
                <Route path="/consulta-investigadores" element={<ConsultaInvestigadores />} />
                <Route path="/gestion-usuarios" element={<GestionUsuarios />} />

                {/* CERTIFICACIONES */}
                <Route path="/certificaciones-investigador" element={<CertificacionesInvestigador />} />

                {/* PROYECTOS */}
                <Route path="/registro-proyecto" element={<RegistroProyecto />} />
                <Route path="/actualizar-proyecto" element={<RegistroProyecto editable={true} />} />
                <Route path="/registro-presupuesto" element={<RegistroPresupuesto modoRegistro={false} />} />

                {/* CONSULTAS */}
                <Route path="/listado-proyectos" element={<ListadoProyectos />} />
                <Route path="/ver-proyecto/:codigo" element={<VerProyecto />} />

                {/* PRESUPUESTO */}
                <Route path="/gestion-gastos" element={<GestionGastos />} />
                <Route path="/consulta-gastos" element={<ConsultaGastos />} />
                <Route path="/gestion-horas" element={<GestionHoras />} />
                <Route path="/consulta-horas-asignadas" element={<HorasAsignadas />} />

                {/* ASIGNACIONES */}
                <Route path="/asignar-investigadores" element={<AsignarInvestigadores />} />
                <Route path="/gestion-permiso-proyecto" element={<GestionPermisoProyecto />} />

                {/* DIRECTOR */}
                <Route path="/dashboard" element={<PanelResumen />} />

                {/* NOTIFICACIONES */}
                <Route path="/notificaciones" element={<NotificacionesPage />} />

                {/* REPORTES */}
                <Route path="/reporte-proyectos" element={<ReporteProyectos />} />
                <Route path="/reporte-presupuestos" element={<ReportePresupuestos />} />
                <Route path="/reporte-certificaciones" element={<ReporteCertificaciones />} />
                <Route path="/reporte-participantes" element={<ReporteInvestigadoresParticipantes />} />

                {/* NOTIFICACIONES */}
                <Route path="/notificaciones" element={<NotificacionesPage />} />

            </Routes>
        </main>
    );
}

export default AppRoutes;