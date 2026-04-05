import { Routes, Route } from "react-router-dom";

/* LOGIN */
import Login from "../../paginas/usuarios/login/Login";
import ForgotPassword from "../../paginas/usuarios/login/ForgotPassword";
import ResetPassword from "../../paginas/usuarios/login/ResetPassword";

/* USUARIOS */
import Registro from "../../paginas/usuarios/formUsuario/Registro";
import Perfil from "../../paginas/usuarios/formUsuario/Perfil";
import ConsultaPersonal from "../../paginas/usuarios/consulta/ConsultaPersonal.jsx";
import ConsultaInvestigadores from "../../paginas/usuarios/investigadores/ConsultaInvestigadores";
import GestionUsuarios from "../../paginas/usuarios/consulta/GestionUsuarios.jsx";

/* USUARIOS */
import CertificacionesInvestigador from "../../paginas/usuarios/investigadores/CertificacionesInvestigador";

/* PROYECTOS */
import RegistroProyecto from "../../paginas/proyecto/registro/RegistroProyecto";
import RegistroPresupuesto from "../../paginas/presupuesto/registro/GestionPresupuesto.jsx";
import ListadoProyectos from "../../paginas/proyecto/ListadoProyectos";

/* CONSULTA PROYECTOS */
import ConsultaProyectos from "../../paginas/consultaProyectos/ConsultaProyectos";
import ProyectoInvestigador from "../../paginas/consultaProyectos/ProyectoInvestigador";
import ProyectoSeleccionado from "../../paginas/consultaProyectos/ProyectoSeleccionado";
import ProyectoHorasAsignadas from "../../paginas/consultaProyectos/ProyectoHorasAsignadas";

/* PRESUPUESTO */
import GestionHoras from "../../paginas/presupuesto/horas/GestionHoras.jsx";
import GestionGastos from "../../paginas/presupuesto/financiero/GestionGastos";
import ConsultaGastos from "../../paginas/presupuesto/financiero/ConsultaGastos";
import HorasAsignadas from "../../paginas/presupuesto/horas/HorasAsignadas";

/* ASIGNACIONES */
import AsignarInvestigadores from "../../paginas/asignacionesInvestigadores/AsignarInvestigadores";
import AsignarInvestigadoresHoras from "../../paginas/asignacionesInvestigadores/AsignarInvestigadorHoras.jsx";

import GestionPermisoProyecto from "../../paginas/asignacionesInvestigadores/permisoProyecto/GestionPermisosProyecto.jsx";

/* DIRECTOR */
import PanelResumen from "../../paginas/director/PanelResumen";

/* NOTIFICACIONES */
import NotificacionesPage from "../../paginas/usuarios/Notificaciones.jsx";

/* REPORTES */
import Certificaciones from "../../paginas/reportes/Certificaciones.jsx";

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
                <Route path="/listado-proyectos" element={<ListadoProyectos />} />

                {/* CONSULTAS */}
                <Route path="/consulta-proyectos" element={<ConsultaProyectos />} />
                <Route path="/investigador" element={<ProyectoInvestigador />} />
                <Route path="/proyectos/:codigo" element={<ProyectoSeleccionado />} />
                <Route path="/consultar/:id" element={<ProyectoSeleccionado />} />
                <Route path="/proyectos/:id/horas-asignadas" element={<ProyectoHorasAsignadas />} />

                {/* PRESUPUESTO */}
                <Route path="/gestion-gastos" element={<GestionGastos />} />
                <Route path="/consulta-gastos" element={<ConsultaGastos />} />
                <Route path="/gestion-horas" element={<GestionHoras />} />
                <Route path="/horas-asignadas" element={<HorasAsignadas />} />

                {/* ASIGNACIONES */}
                <Route path="/asignar-investigadores" element={<AsignarInvestigadores />} />
                <Route path="/asignar-investigadores-horas" element={<AsignarInvestigadoresHoras />} />
                <Route path="/gestion-permiso-proyecto" element={<GestionPermisoProyecto />} />

                {/* DIRECTOR */}
                <Route path="/dashboard" element={<PanelResumen />} />

                {/* NOTIFICACIONES */}
                <Route path="/notificaciones" element={<NotificacionesPage />} />

                {/* REPORTES */}
                <Route path="/reporte-certificaciones" element={<Certificaciones />} />

                {/* NOTIFICACIONES */}
                <Route path="/notificaciones" element={<NotificacionesPage />} />

            </Routes>
        </main>
    );
}

export default AppRoutes;