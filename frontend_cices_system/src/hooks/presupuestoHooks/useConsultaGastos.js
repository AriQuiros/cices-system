// src/modules/presupuesto/hooks/useConsultaGastos.js
import {useEffect, useState} from "react";
import { useQuery } from "@tanstack/react-query";
import { obtenerPresupuestosProyectoTipo } from "../../services/presupuestoServices/presupuestoConsultaService.js";

export const useConsultaGastos = () => {

    const ANIO_MIN = 2020;
    const ANIO_MAX = new Date().getFullYear();

    const [filtro, setFiltro] = useState({
        codigoProyecto: null,
        categorias: [],
        anioDesde: ANIO_MIN,
        anioHasta: ANIO_MAX,
        tipoPresupuesto: "Financiero"
    });

    const [pageable, setPageable] = useState({
        page: 0,
        size: 3
    });

    const [ordenPresupuesto, setOrdenPresupuesto] = useState({
        campo: "fecha",
        direccion: "desc"
    });

    const [ordenGasto, setOrdenGasto] = useState({
        campo: "fecha",
        direccion: "desc"
    });

    const query = useQuery({
        queryKey: [
            "consulta-gastos",
            filtro,
            pageable,
            ordenPresupuesto,
            ordenGasto
        ],
        queryFn: () =>
            obtenerPresupuestosProyectoTipo(
                filtro,
                {
                    ordenarPorPresupuesto: ordenPresupuesto.campo,
                    direccionPresupuesto: ordenPresupuesto.direccion,
                    ordenarPorGasto: ordenGasto.campo,
                    direccionGasto: ordenGasto.direccion
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

        ordenGasto,
        setOrdenGasto,

        ANIO_MIN,
        ANIO_MAX
    };
};