// src/modules/presupuesto/hooks/useConsultaHoras.js
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { obtenerPresupuestosProyectoTipo } from "../../services/presupuestoServices/presupuestoConsultaService.js";

export const useConsultaHoras = () => {

    const [filtro, setFiltro] = useState({
        codigoProyecto: null,
        tipoPresupuesto: "Horas"
    });

    const [pageable, setPageable] = useState({
        page: 0,
        size: 3
    });

    const [ordenPresupuesto, setOrdenPresupuesto] = useState({
        campo: "fecha",
        direccion: "desc"
    });

    const [ordenHora, setOrdenHora] = useState({
        campo: "fechaInicioInvestigador",
        direccion: "desc"
    });

    const query = useQuery({
        queryKey: [
            "consulta-horas",
            filtro,
            pageable,
            ordenPresupuesto,
            ordenHora
        ],
        queryFn: () =>
            obtenerPresupuestosProyectoTipo(
                filtro,
                {
                    ordenarPorPresupuesto: ordenPresupuesto.campo,
                    direccionPresupuesto: ordenPresupuesto.direccion,
                    ordenarPorGasto: ordenHora.campo,
                    direccionGasto: ordenHora.direccion
                },
                pageable
            ),
        keepPreviousData: true,
        enabled: !!filtro.codigoProyecto
    });

    const cambiarPagina = (page) => {
        setPageable(prev => ({ ...prev, page }));
    };

    useEffect(() => {
        setPageable(prev => ({ ...prev, page: 0 }));
    }, [filtro]);

    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,

        filtro,
        setFiltro,

        pageable,
        cambiarPagina,

        ordenPresupuesto,
        setOrdenPresupuesto,

        ordenHora,
        setOrdenHora
    };
};