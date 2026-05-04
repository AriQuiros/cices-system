import { useNavigate, useParams } from "react-router-dom";
import { useProyectoReporte } from "./queries/useProyectoReporte.js";
import { useDescargarDocumento } from "./useDescargarDocumento.js";

export const useVerProyecto = () => {
    const { codigo } = useParams();
    const navigate   = useNavigate();

    const { data: proyecto, isLoading, isError } = useProyectoReporte(codigo);
    const { descargar, descargandoId } = useDescargarDocumento();

    const handleVolver = () => navigate(-1);

    return {
        codigoProyecto: codigo,
        proyecto,
        isLoading,
        isError,
        handleVolver,
        descargar,
        descargandoId,
    };
};