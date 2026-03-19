import { Routes, Route } from "react-router-dom";

/* LOGIN */
import Login from "../../paginas/login/Login";

/* USUARIOS */
import Registro from "../../paginas/usuarios/registro/Registro";
import RegistroInvestigador from "../../paginas/usuarios/registro/RegistroInvestigador";
import ConsultaPersonal from "../../paginas/usuarios/ConsultaPersonal";
import ConsultaInvestigadores from "../../paginas/usuarios/investigadores/ConsultaInvestigadores";
import Certificaciones from "../../paginas/usuarios/investigadores/Certificaciones";
import GestionUsuarios from "../../paginas/usuarios/GestionUsuarios";

/* PROYECTOS */
import RegistroProyecto from "../../paginas/proyecto/registro/RegistroProyecto";
import RegistroPresupuesto from "../../paginas/presupuesto/registro/GestionPresupuesto.jsx";
import VincularInvestigador from "../../paginas/proyecto/registro/VincularInvestigador";
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

/* DIRECTOR */
import PanelResumen from "../../paginas/director/PanelResumen";

function AppRoutes() {
    return (
        <main>
            <Routes>

                {/* LOGIN */}
                <Route path="/" element={<Login />} />

                {/* USUARIOS */}
                <Route path="/registro" element={<Registro />} />
                <Route path="/registro-investigador" element={<RegistroInvestigador />} />
                <Route path="/consulta-personal" element={<ConsultaPersonal />} />
                <Route path="/consulta-investigadores" element={<ConsultaInvestigadores />} />
                <Route path="/certificaciones" element={<Certificaciones />} />
                <Route path="/gestion-usuarios" element={<GestionUsuarios />} />

                {/* PROYECTOS */}
                <Route path="/registro-proyecto" element={<RegistroProyecto />} />
                <Route path="/registro-presupuesto" element={<RegistroPresupuesto modoRegistro={false} />} />
                <Route path="/listado-proyectos" element={<ListadoProyectos />} />

                {/* CONSULTAS */}
                <Route path="/consulta-proyectos" element={<ConsultaProyectos />} />
                <Route path="/investigador" element={<ProyectoInvestigador />} />
                <Route path="/consultar/:id" element={<ProyectoSeleccionado />} />
                <Route path="/proyectos/:id/horas" element={<ProyectoHorasAsignadas />} />

                {/* PRESUPUESTO */}
                <Route path="/gestion-gastos" element={<GestionGastos />} />
                <Route path="/consulta-gastos" element={<ConsultaGastos />} />
                <Route path="/gestion-horas" element={<GestionHoras />} />
                <Route path="/horas-asignadas" element={<HorasAsignadas />} />

                {/* ASIGNACIONES */}
                <Route path="/asignar-investigadores" element={<AsignarInvestigadores />} />
                <Route path="/asignar-investigadores-horas" element={<AsignarInvestigadoresHoras />} />

                {/* DIRECTOR */}
                <Route path="/dashboard" element={<PanelResumen />} />

            </Routes>
        </main>
    );
}

export default AppRoutes;