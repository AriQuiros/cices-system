import './App.css';
import logoUCR from '../public/images/logoUCR.png';
import logoCICES from '../public/images/logoCICES.png';
import logoCICES2 from '../public/images/logoCICES2.png';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Hello from "./Hello.jsx";

function App() {
    return (
        <div className = "App">
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
        <div className={"App-main"}>
            {/* <AppProvider> */}
            <Routes>
                <Route path="/" element={<Hello />} />
            </Routes>
            {/* </AppProvider> */}
        </div>
    );
}


function Header() {
    return (
        <header>
                <div className="encabezado">
                    <div className="titulo">
                        <h1>Sistema de Información del CICES</h1>
                    </div>
                    <div className="logos">
                        <div className="poligono">
                            <div className="fondoblanco">
                                <svg width="360" height="100%" viewBox="0 0 360 135" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M169.036 70L360 0V135H0L169.036 70Z" fill="white"/>
                                </svg>
                            </div>
                            <div className="cuadroPoligono">
                                <div className="logo">
                                    <img className="logoUCR" src={logoUCR}/>
                                </div>
                                <div className="logo">
                                    <img className="logoCICES" src={logoCICES}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="barrita"></div>
        </header>
    );
}

function Footer() {
    return (
        <footer>
            <div className="logo">
                <img className="logoCices2" src={logoCICES2} alt="Logo CICES" />
            </div>
            <div className="info_footer">
                <p>Correo: cices@ucr.ac.cr</p>
                <p>Teléfono: 2511-5191 / 2511-5187</p>
                <p>Horario: De Lunes a Viernes de 7:00 a.m. a 5:00 p.m.</p>
            </div>
            <div className="info_footer">
                <p>Ubicación: 2do piso de la Escuela de Enfermería,<br />
                    Ciudad de la Investigación, frente al INISA;<br />
                    Universidad de Costa Rica</p>
            </div>
        </footer>
    );
}


export default App
