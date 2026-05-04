import { BrowserRouter, useLocation } from "react-router-dom";
import Sidebar from "./components/menu/Sidebar";
import NotificationMenu from "./components/menu/NotificationMenu";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";

import "./App.css";
import "./index.css";

/* IMÁGENES */
import logoUCR from "./assets/images/logoUCR.png";
import logoCICES from "./assets/images/logoCICES.png";
import logoCICES2 from "./assets/images/logoCICES2.png";
import { Link } from "react-router-dom";

/* CONTEXTO */
import AppProvider from "./context/AppProvider.jsx";
import {useContext, useRef, useState} from "react";
import {AppContext} from "./context/AppContext.jsx";

function App() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const toggleRef = useRef(null);

    return (
        <AppProvider>
            <Toaster richColors position="top-center"/>
            <div className="app-container flex flex-col min-h-screen">
                <BrowserRouter>
                    <Header
                        menuAbierto={menuAbierto}
                        setMenuAbierto={setMenuAbierto}
                        toggleRef={toggleRef}
                    />
                    <Main
                        menuAbierto={menuAbierto}
                        setMenuAbierto={setMenuAbierto}
                        toggleRef={toggleRef}
                    />
                    <Footer />
                </BrowserRouter>
            </div>
        </AppProvider>
    );
}

function Main({ menuAbierto, setMenuAbierto, toggleRef }) {
    return (
        <main className="flex flex-1 min-h-0 pt-22.75">
            <Sidebar
                abierto={menuAbierto}
                setMenuAbierto={setMenuAbierto}
                className="h-full overflow-y-auto"
                toggleRef={toggleRef}
            />
            <div className="flex-1 min-h-0">
                <AppRoutes />
            </div>
        </main>
    );
}

function Header({ setMenuAbierto, toggleRef }) {
    const { user } = useContext(AppContext);
    const location = useLocation();

    // Detectar si está en login o páginas de autenticación
    const isLoginPage = location.pathname === "/";
    const isAuthPage = location.pathname === "/reset-password" || location.pathname === "/forgot-password";
    const linkDestination = isAuthPage ? "/" : "/dashboard";

    return (
        <header>
            <div className="header-content">
                    {isLoginPage ? (
                        <span className="page-name page-name-static">
                            Sistema de Información del CICES
                        </span>
                    ) : (
                        <Link to={linkDestination} className="page-name">
                            Sistema de Información del CICES
                        </Link>
                    )}

                <div className="logos">
                    <img src={logoUCR} alt="Logo UCR" />
                    <img src={logoCICES} alt="Logo CICES" />
                </div>
            </div>

            <div className="divider">
                {user && (
                    <div className="topbar-actions">
                        <button
                            ref={toggleRef}
                            onClick={() => setMenuAbierto(prev => !prev)}
                            className="p-1 text-2 menu-toggle-btn"
                        >
                            ☰
                        </button>
                        <NotificationMenu />
                    </div>
                )}
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