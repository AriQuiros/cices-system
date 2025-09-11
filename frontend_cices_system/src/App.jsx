import './App.css';
import logoUCR from '../public/images/logoUCR.png';
import logoCICES from '../public/images/logoCICES.png';
import logoCICES2 from '../public/images/logoCICES2.png';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./paginas/login/Login"

function App() {
    return (
        <div className = "App-main">
            <BrowserRouter>
                <Header />
                <Main />
                <Footer />
            </BrowserRouter>
        </div>
    );
}


function Main(){
    return(
        <main>
            <Routes>
                <Route path="/" element={<Login />} />
            </Routes>
        </main>
    );
}


function Header() {
    return (
        <header>
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
                    <p>Correo: cices@ucr.ac.cr</p>
                    <p>Teléfono: 2511-5191 / 2511-5187</p>
                    <p>Horario: De Lunes a Viernes de 7:00 a.m. a 5:00 p.m.</p>
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
