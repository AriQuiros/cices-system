import React, {useContext, useEffect, useRef, useState} from "react";
import './App.css';
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

import logoUCR from '../public/images/logoUCR.png';
import logoCICES from '../public/images/logoCICES.png';
import logoCICES2 from '../public/images/logoCICES2.png';

import Login from "./paginas/login/Login";
import Registro from "./paginas/registro/Registro";
import RegistroProyecto from "./paginas/registro/RegistroProyecto";
import Director from "./paginas/director/Director";
import Administrador from "./paginas/administrador/Administrador.jsx";


import AppProvider from "./context/AppProvider.jsx";
import {AppContext} from "./context/AppContext.jsx";

function useElementHeight() {
    const ref = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const updateHeight = () => {
            if (ref.current) {
                setHeight(ref.current.offsetHeight);
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    return [ref, height];
}

function App() {
    const [headerRef, headerHeight] = useElementHeight();

    return (
        <AppProvider>
        <div className = "app-container">
            <BrowserRouter>
                <Header innerRef={headerRef} />
                <Main style={{ paddingTop: `${headerHeight}px` }} />
                <Footer />
            </BrowserRouter>
        </div>
        </AppProvider>
    );
}


function Main({ style }){
    return(
        <main style={style}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/Registro" element={<Registro />} />
                    <Route path="/RegistroProyecto" element={<RegistroProyecto />} />
                    <Route path="/director" element={<Director />} />
                    <Route path="/administrador" element={<Administrador />} />
                </Routes>
        </main>
    );
}


function Header({ innerRef }) {
    const {user: usuario, logout: cerrarSesion} = useContext(AppContext);
    const navigate = useNavigate();

    //obtener rol de usuario
    const rol = usuario?.roles?.[0];

    function dirigirLogin() {
        cerrarSesion();
        navigate("/")
    }

    return (
        <header ref={innerRef}>
            <div className="header-content">
                <div className="page-name">Sistema de Información del CICES</div>
                <div className="logos">
                    <img src={logoUCR} alt="Logo UCR"/>
                    <img src={logoCICES} alt="Logo CICES"/>
                </div>
            </div>
            <div className="divider">
                <nav>
                    <ul className="Menu">
                        {usuario && (
                            <>
                                <span className="bienvenida">Bienvenido, {usuario.username}</span>
                                {rol === 'DIRECTOR' && (
                                    <>
                                        <li><Link to="/director/resumen">Resumen General</Link></li>
                                        <li><Link to="/director/personal">Gestionar Personal</Link></li>
                                        <li><Link to="/director/proyectos">Gestionar Proyectos</Link></li>
                                        <li><Link to="/director/gastos">Gastos de Proyectos</Link></li>
                                        <li><Link to="/director/reportes">Generar Reportes</Link></li>
                                        <li><Link to="/director/notificaciones">Notificaciones</Link></li>
                                        <li><Link to="/perfil">Perfil</Link></li>
                                        <li><button onClick={dirigirLogin}>Cerrar Sesion</button></li>
                                    </>
                                )}

                                {rol === 'ADMINISTRADOR' && (
                                    <>
                                        <li><Link to="/director/resumen">Registar Proyecto</Link></li>
                                        <li><Link to="/director/personal">Actualizar Proyecto</Link></li>
                                        <li><Link to="/director/proyectos">Asignar Investigadores</Link></li>
                                        <li><Link to="/director/gastos">Generar Reportes</Link></li>
                                        <li><Link to="/director/reportes">Generar Reportes</Link></li>
                                        <li><Link to="/director/notificaciones">Notificaciones</Link></li>
                                        <li><Link to="/perfil">Perfil</Link></li>
                                        <li>
                                            <button onClick={dirigirLogin}>Cerrar Sesion</button>
                                        </li>
                                    </>
                                )}

                                {rol === 'INVESTIGADOR' && (
                                    <>
                                        <li><Link to="/director/resumen">Historia de Participacion</Link></li>
                                        <li><Link to="/director/resumen">Mis Proyectos</Link></li>
                                        <li><Link to="/director/personal">Custodiar datos de Investigacion</Link></li>
                                        <li><Link to="/director/proyectos">Actualizar Proyecto</Link></li>
                                        <li><Link to="/director/gastos">Certificaciones y Licencias</Link></li>
                                        <li><Link to="/director/reportes">Registrar Gastos</Link></li>
                                        <li><Link to="/director/reportes">Consultar Gastos</Link></li>
                                        <li><Link to="/director/notificaciones">Notificaciones</Link></li>
                                        <li><Link to="/perfil">Perfil</Link></li>
                                        <li>
                                            <button onClick={dirigirLogin}>Cerrar Sesion</button>
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
