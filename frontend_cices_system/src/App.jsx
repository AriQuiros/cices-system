import React, {useContext, useState} from "react";
import './App.css';
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

import logoUCR from '../public/images/logoUCR.png';
import logoCICES from '../public/images/logoCICES.png';
import logoCICES2 from '../public/images/logoCICES2.png';

import Login from "./paginas/login/Login";
import Registro from "./paginas/registro/usuarios/Registro.jsx";
import RegistroProyecto from "./paginas/registro/proyectos/RegistroProyecto.jsx";
import RegistroPresupuesto from "./paginas/registro/proyectos/RegistroPresupuesto.jsx";
import Director from "./paginas/director/Director";
import Administrador from "./paginas/administrador/Administrador.jsx";
import Certificacion from "./paginas/certificacion/Certificacion.jsx";
import Investigador from "./paginas/investigador/Investigador.jsx";
import RegistroInvestigador from "./paginas/registro/usuarios/RegistroInvestigador.jsx";
import ConsultaProyectos from "./paginas/consultaProyectos/ConsultaProyectos.jsx";
import RegistrarGastosFinancieros from "./paginas/RegistrarGastosFinancieros/RegistrarGastosFinancieros.jsx";
import ProyectoInvestigador from "./paginas/consultaProyectos/ProyectoInvestigador.jsx";


import AppProvider from "./context/AppProvider.jsx";
import {AppContext} from "./context/AppContext.jsx";
import AsignarInvestigador from "./paginas/asignacionesInvestigadores/AsignarInvestigador.jsx";
import ProyectoSeleccionado from "./paginas/consultaProyectos/ProyectoSeleccionado.jsx";
import ProyectoHorasAsignadas from "./paginas/consultaProyectos/ProyectoHorasAsignadas.jsx";


function App() {
    return (
        <AppProvider>
        <div className = "app-container">
            <BrowserRouter>
                <Header/>
                <Main/>
                <Footer />
            </BrowserRouter>
        </div>
        </AppProvider>
    );
}


function Main(){
    return(
        <main>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/Registro" element={<Registro />} />
                    <Route path="/RegistroInvestigador" element={<RegistroInvestigador />} />
                    <Route path="/certificacion" element={<Certificacion />} />
                    <Route path="/investigador" element={<ProyectoInvestigador />} />

                    <Route path="/RegistroProyecto" element={<RegistroProyecto />} />
                    <Route path="/RegistroPresupuesto" element={<RegistroPresupuesto />} />
                    <Route path="/consultaProyectos" element={<ConsultaProyectos />} />
                    <Route path="/registrar-gastos" element={<RegistrarGastosFinancieros />} />

                    <Route path="/AsignarInvestigador" element={<AsignarInvestigador />} />


                    <Route path="/director" element={<Director />} />
                    <Route path="/administrador" element={<ConsultaProyectos />} />
                    <Route path="/consultar/:id" element={<ProyectoSeleccionado />} />
                    <Route path="/proyectos/:id/horas" element={<ProyectoHorasAsignadas />} />

                </Routes>
        </main>
    );
}


function Header() {
    const {user: usuario, logout: cerrarSesion} = useContext(AppContext);
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [submenuAbierto, setSubmenuAbierto] = useState(false);

    //obtener rol de usuario
    const rol = usuario?.roles?.[0];

    function dirigirLogin() {
        cerrarSesion();
        navigate("/")
    }

    return (
        <header>
            <div className="header-content">
                <div className="page-name">Sistema de Información del CICES</div>
                <div className="logos">
                    <img src={logoUCR} alt="Logo UCR"/>
                    <img src={logoCICES} alt="Logo CICES"/>
                </div>
            </div>
            <div className="divider">
                <button className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
                    ☰
                </button>
                <nav>
                    <ul className={`Menu ${menuAbierto ? 'show' : ''}`}>
                        {usuario && (
                            <>
                                {rol === 'DIRECTOR' && (
                                    <>
                                        <li><Link to="/director" onClick={() => setMenuAbierto(false)}>Resumen General</Link></li>
                                        <li><Link to="/director" onClick={() => setMenuAbierto(false)}>Gestionar Personal</Link></li>

                                        <li className={`navbar-item ${submenuAbierto ? 'active' : ''}`}>
                                            <nav className="navbar">
                                                <div className="navbar-logo"
                                                     onClick={() => setSubmenuAbierto(!submenuAbierto)}>
                                                    Gestión de Proyectos
                                                    <span className="arrow">{submenuAbierto ? '▲' : '▼'}</span>
                                                </div>
                                                <ul className="dropdown">
                                                    <li>
                                                        <Link to="/consultaProyectos" onClick={() => setMenuAbierto(false)}>Consultar Proyectos</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/RegistroProyecto" onClick={() => setMenuAbierto(false)}>Registar Proyectos</Link>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </li>
                                        <li><Link to="/director" onClick={() => setMenuAbierto(false)}>Gastos de Proyectos</Link></li>
                                        <li><Link to="/director" onClick={() => setMenuAbierto(false)}>Generar Reportes</Link></li>
                                        <li><Link to="/director" onClick={() => setMenuAbierto(false)}>Notificaciones</Link></li>
                                        <li><Link to="/perfil" onClick={() => setMenuAbierto(false)}>Perfil</Link></li>
                                        <li>
                                            <button className="cerrarSesionbtn" onClick={dirigirLogin}>Cerrar Sesion
                                            </button>
                                        </li>
                                    </>
                                )}

                                {rol === 'ADMINISTRADOR' && (
                                    <>
                                        <li><Link to="/RegistroProyecto" onClick={() => setMenuAbierto(false)}>Registar Proyecto</Link></li>
                                        <li><Link to="/consultaProyectos" onClick={() => setMenuAbierto(false)}>Actualizar Proyecto</Link></li>
                                        <li><Link to="/AsignarInvestigador" onClick={() => setMenuAbierto(false)}>Asignar Investigadores</Link></li>
                                        <li><Link to="/administrador" onClick={() => setMenuAbierto(false)}>Generar Reportes</Link></li>
                                        <li><Link to="/administrador" onClick={() => setMenuAbierto(false)}>Notificaciones</Link></li>
                                        <li><Link to="/perfil" onClick={() => setMenuAbierto(false)}>Perfil</Link></li>
                                        <li>
                                            <button className="cerrarSesionbtn" onClick={dirigirLogin}>Cerrar Sesion
                                            </button>
                                        </li>
                                    </>
                                )}

                                {rol === 'INVESTIGADOR' && (
                                    <>
                                        <li><Link to="/investigador" onClick={() => setMenuAbierto(false)}>Historial de Participacion</Link></li>
                                        <li><Link to="/investigador" onClick={() => setMenuAbierto(false)}>Mis Proyectos</Link></li>
                                        <li><Link to="/investigador" onClick={() => setMenuAbierto(false)}>Custodiar datos de Investigacion</Link></li>
                                        <li><Link to="/investigador" onClick={() => setMenuAbierto(false)}>Actualizar Proyecto</Link></li>
                                        <li><Link to="/investigador" onClick={() => setMenuAbierto(false)}>Certificaciones y Licencias</Link></li>
                                        <li><Link to="/registrar-gastos" onClick={() => setMenuAbierto(false)}>Registrar Gastos</Link></li>
                                        <li><Link to="/investigador" onClick={() => setMenuAbierto(false)}>Consultar Gastos</Link></li>
                                        <li><Link to="/investigador" onClick={() => setMenuAbierto(false)}>Notificaciones</Link></li>
                                        <li><Link to="/perfil" onClick={() => setMenuAbierto(false)}>Perfil</Link></li>
                                        <li>
                                            <button className="cerrarSesionbtn" onClick={dirigirLogin}>Cerrar Sesion
                                            </button>
                                        </li>
                                    </>
                                )}
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <div className="footer-logo">
                    <img src={logoCICES2} alt="LogoFooterCices"/>
                </div>
                <div className="footer-contact">
                    <p>Correo: cices@ucr.ac.cr<br/>
                        Teléfono: 2511-5191 / 2511-5187<br/>
                        Horario: De Lunes a Viernes de 7:00 a.m. a 5:00 p.m.</p>
                </div>
                <div className="footer-location">
                    <p>Ubicación: 2do piso de la Escuela de Enfermería,<br/>
                        Ciudad de la Investigación, frente al INISA;<br/>
                        Universidad de Costa Rica</p>
                </div>
            </div>
        </footer>
    );
}


export default App
