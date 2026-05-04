import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import "./BotonInicio.css";

const BotonInicio = ({ texto = "Inicio" }) => {
    const { user } = useContext(AppContext);
    const ruta = user?.roles?.includes("DIRECCION") ? "/dashboard" : "/listado-proyectos";
    const navigate = useNavigate();

    const handleClick = () => {
        if (ruta) {
            navigate(ruta);
        } else {
            navigate(-1);
        }
    };

    return (
        <button type={"button"} className={`btn-volver`} onClick={handleClick}>
            ⬅ {texto}
        </button>
    );
};

export default BotonInicio;