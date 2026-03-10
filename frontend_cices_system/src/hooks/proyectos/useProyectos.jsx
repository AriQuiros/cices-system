import { useEffect, useMemo, useState } from "react";
import { obtenerProyectos, obtenerLineas } from "../../services/proyectoService";

export function useProyectos() {

    const [proyectos, setProyectos] = useState([]);
    const [lineas, setLineas] = useState([]);
    const [orden, setOrden] = useState({ campo: "fechaInicio", asc: false });
    const [cargando, setCargando] = useState(true);

    const [filtros, setFiltros] = useState({
        texto: "",
        lineaInvestigacion: "",
        tipoProyecto: "",
        estado: "",
        institucion: ""
    });

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await obtenerProyectos(true);
                setProyectos(data);
                const lineasData = await obtenerLineas();
                setLineas(lineasData);
            } catch (error) {
                console.error(error);
            } finally {
                setCargando(false);
            }
        };

        cargar();
    }, []);

    const handleChange = (campo, valor) => {
        setFiltros(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    const limpiarFiltros = () => {
        setFiltros({
            texto: "",
            lineaInvestigacion: "",
            tipoProyecto: "",
            estado: "",
            institucion: ""
        });
    };

    const proyectosFiltrados = useMemo(() => {

        let resultado = proyectos.filter(p => {
            // lógica de filtros
            if (filtros.texto) {
                const texto = filtros.texto.toLowerCase();
                if (!p.nombre?.toLowerCase().includes(texto) && !p.codigoProyecto?.toLowerCase().includes(texto)) {
                    return false;
                }
            }
            if (filtros.estado && p.estado.despliegue !== filtros.estado) return false;
            if (filtros.tipoProyecto && p.tipoProyecto.despliegue !== filtros.tipoProyecto) return false;
            if (filtros.lineaInvestigacion && p.lineaInvestigacion !== filtros.lineaInvestigacion) return false;
            if (filtros.institucion && !p.institucion?.toLowerCase().includes(filtros.institucion.toLowerCase())) return false;
            return true;
        });

        resultado.sort((a, b) => {
            const valA = new Date(a[orden.campo]);
            const valB = new Date(b[orden.campo]);

            return orden.asc ? valA - valB : valB - valA;
        });

        return resultado;

    }, [proyectos, filtros, orden]);

    return {
        proyectos: proyectosFiltrados,
        lineas,
        orden,
        setOrden,
        cargando,
        filtros,
        handleChange,
        limpiarFiltros
    };
}