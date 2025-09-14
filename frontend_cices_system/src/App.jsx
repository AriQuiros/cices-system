import React, { useEffect, useRef, useState } from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import logoUCR from '../public/images/logoUCR.png';
import logoCICES from '../public/images/logoCICES.png';
import logoCICES2 from '../public/images/logoCICES2.png';

import Login from "./paginas/login/Login";
import Registro from "./paginas/registro/Registro";
import RegistroProyecto from "./paginas/registro/RegistroProyecto";
import Director from "./paginas/director/Director";
import AppProvider from "./context/AppProvider.jsx";

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
        <div className = "app-container">
            <BrowserRouter>
                <Header innerRef={headerRef} />
                <Main style={{ paddingTop: `${headerHeight}px` }} />
                <Footer />
            </BrowserRouter>
        </div>
    );
}


function Main({ style }){
    return(
        <main style={style}>
            <AppProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/Registro" element={<Registro />} />
                    <Route path="/RegistroProyecto" element={<RegistroProyecto />} />
                    <Route path="/director" element={<Director />} />
                </Routes>
            </AppProvider>
        </main>
    );
}


function Header({ innerRef }) {
    return (
        <header ref={innerRef}>
            <div className="header-content">
                <div className="page-name">Sistema de Información del CICES</div>
                <div className="logos">
                    <img src={logoUCR} alt="Logo UCR"/>
                    <img src={logoCICES} alt="Logo CICES"/>
                </div>
            </div>
            <div className="divider"></div>
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
