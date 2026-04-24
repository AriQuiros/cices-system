import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import {obtenerProyectos} from "../../services/ProyectoService.jsx";

export function useProyectos() {
    const { token, user } = useContext(AppContext);

    const [proyectos, setProyectos] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [page, setPage] = useState(0);
    const size = 8;

    const [orden, setOrden] = useState({ campo: "fechaInicio", asc: false });
    const [cargando, setCargando] = useState(true);

    const [filtros, setFiltros] = useState({
        texto: "",
        lineaInvestigacion: [],
        tipoProyecto: [],
        estado: ""
    });

    const cargar = async () => {
        setCargando(true);
        try {
            const data = await obtenerProyectos(token, user, filtros, page, size, orden);

            setProyectos(data.content);
            setTotal(data.totalElements);
            setTotalPages(data.totalPages);

        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    // recargar cuando cambie algo
    useEffect(() => {
        cargar();
    }, [filtros, page, orden]);

    const handleChange = (campo, valor) => {
        setPage(0); // resetear página al filtrar
        setFiltros(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    const limpiarFiltros = () => {
        setPage(0);
        setFiltros({
            texto: "",
            lineaInvestigacion: [],
            tipoProyecto: [],
            estado: ""
        });
    };

    return {
        proyectos,
        total,
        totalPages,
        page,
        setPage,
        orden,
        setOrden,
        cargando,
        filtros,
        handleChange,
        limpiarFiltros
    };
}