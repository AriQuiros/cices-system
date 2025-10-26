import React, { useContext, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import "./App.css";

import logoUCR from "../public/images/logoUCR.png";
import logoCICES from "../public/images/logoCICES.png";
import logoCICES2 from "../public/images/logoCICES2.png";

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
import { AppContext } from "./context/AppContext.jsx";
import AsignarInvestigador from "./paginas/asignacionesInvestigadores/AsignarInvestigador.jsx";
import ProyectoSeleccionado from "./paginas/consultaProyectos/ProyectoSeleccionado.jsx";
import ProyectoHorasAsignadas from "./paginas/consultaProyectos/ProyectoHorasAsignadas.jsx";

/** Helper botón-enlace consistente */
const BtnLink = ({ to, children, onClick, variant = "primary" }) => (
    <li>
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) => `btn btn--${variant} ${isActive ? "is-active" : ""}`}
        >
            {children}
        </NavLink>
    </li>
);

function App() {
    return (
        <AppProvider>
            <div className="app-container">
                <BrowserRouter>
                    <Header />
                    <Main />
                    <Footer />
                </BrowserRouter>
            </div>
        </AppProvider>
    );
}

function Main() {
    return (
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
                <Route path="/administrador" element={<Administrador />} />
                <Route path="/consultar/:id" element={<ProyectoSeleccionado />} />
                <Route path="/proyectos/:id/horas" element={<ProyectoHorasAsignadas />} />
            </Routes>
        </main>
    );
}

function Header() {
    const { user: usuario, logout: cerrarSesion } = useContext(AppContext);
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [submenuAbierto, setSubmenuAbierto] = useState(false);

    const rol = usuario?.roles?.[0];

    function dirigirLogin() {
        cerrarSesion();
        navigate("/");
    }

    return (
        <header>
            <div className="header-content">
                <div className="page-name">Sistema de Información del CICES</div>
                <div className="logos">
                    <img src={logoUCR} alt="Logo UCR" />
                    <img src={logoCICES} alt="Logo CICES" />
                </div>
            </div>

            <div className="divider">
                <button className="menu-toggle" onClick={() => setMenuAbierto((v) => !v)}>
                    ☰
                </button>

                <nav>
                    <ul className={`Menu ${menuAbierto ? "show" : ""}`}>
                        {usuario && (
                            <>
                                {rol === "DIRECTOR" && (
                                    <>
                                        <BtnLink to="/director" onClick={() => setMenuAbierto(false)}>
                                            Resumen General
                                        </BtnLink>

                                        <BtnLink to="/director" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Gestionar Personal
                                        </BtnLink>

                                        {/* Dropdown Gestión de Proyectos */}
                                        <li className={`navbar-item ${submenuAbierto ? "active" : ""}`}>
                                            <div
                                                className="navbar-logo"
                                                onClick={() => setSubmenuAbierto((v) => !v)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") setSubmenuAbierto((v) => !v);
                                                }}
                                            >
                                                Gestión de Proyectos <span className="arrow">{submenuAbierto ? "▲" : "▼"}</span>
                                            </div>

                                            <ul className={`dropdown ${submenuAbierto ? "show" : ""}`}>
                                                <li>
                                                    <NavLink
                                                        to="/consultaProyectos"
                                                        onClick={() => {
                                                            setMenuAbierto(false);
                                                            setSubmenuAbierto(false);
                                                        }}
                                                        className="dropdown-link"
                                                    >
                                                        Consultar Proyectos
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/RegistroProyecto"
                                                        onClick={() => {
                                                            setMenuAbierto(false);
                                                            setSubmenuAbierto(false);
                                                        }}
                                                        className="dropdown-link"
                                                    >
                                                        Registrar Proyectos
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/AsignarInvestigador"
                                                        onClick={() => {
                                                            setMenuAbierto(false);
                                                            setSubmenuAbierto(false);
                                                        }}
                                                        className="dropdown-link"
                                                    >
                                                        Asignar Investigadores
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        </li>

                                        <BtnLink to="/director" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Gastos de Proyectos
                                        </BtnLink>
                                        <BtnLink to="/director" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Generar Reportes
                                        </BtnLink>
                                        <BtnLink to="/director" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Notificaciones
                                        </BtnLink>
                                        <BtnLink to="/perfil" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Perfil
                                        </BtnLink>

                                        <li>
                                            <button className="btn btn--danger" onClick={dirigirLogin}>
                                                Cerrar Sesión
                                            </button>
                                        </li>
                                    </>
                                )}

                                {rol === "ADMINISTRADOR" && (
                                    <>
                                        <BtnLink to="/RegistroProyecto" onClick={() => setMenuAbierto(false)}  variant="ghost">
                                            Registrar Proyecto
                                        </BtnLink>
                                        <BtnLink to="/consultaProyectos" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Consultar Proyectos
                                        </BtnLink>
                                        <BtnLink to="/consultaProyectos" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Actualizar Proyecto
                                        </BtnLink>
                                        <BtnLink to="/AsignarInvestigador" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Asignar Investigadores
                                        </BtnLink>
                                        <BtnLink to="/administrador" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Generar Reportes
                                        </BtnLink>
                                        <BtnLink to="/administrador" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Notificaciones
                                        </BtnLink>
                                        <BtnLink to="/perfil" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Perfil
                                        </BtnLink>

                                        <li>
                                            <button className="cerrarSesionbtn" onClick={dirigirLogin}>Cerrar Sesion </button>
                                        </li>
                                    </>
                                )}

                                {rol === "INVESTIGADOR" && (
                                    <>
                                        <BtnLink to="/investigador" onClick={() => setMenuAbierto(false)}>
                                            Historial de Participación
                                        </BtnLink>
                                        <BtnLink to="/investigador" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Mis Proyectos
                                        </BtnLink>
                                        <BtnLink to="/investigador" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Custodiar datos de Investigación
                                        </BtnLink>
                                        <BtnLink to="/investigador" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Actualizar Proyecto
                                        </BtnLink>
                                        <BtnLink to="/investigador" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Certificaciones y Licencias
                                        </BtnLink>
                                        <BtnLink to="/registrar-gastos" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Registrar Gastos
                                        </BtnLink>
                                        <BtnLink to="/investigador" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Consultar Gastos
                                        </BtnLink>
                                        <BtnLink to="/investigador" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Notificaciones
                                        </BtnLink>
                                        <BtnLink to="/perfil" onClick={() => setMenuAbierto(false)} variant="ghost">
                                            Perfil
                                        </BtnLink>

                                        <li>
                                            <button className="btn btn--danger" onClick={dirigirLogin}>
                                                Cerrar Sesión
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
