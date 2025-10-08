import {useEffect, useState} from "react";
import "./ConsultaProyectos.css";

function ConsultaProyectos() {
    const [proyectos, setProyectos] = useState([]);
    const [cargado, setCargado] = useState(true);
    const [proyectosFiltrados, setProyectosFiltrados] = useState([]);

    //estado para filtros
    const [campoFiltro, setCampoFiltro] = useState("varios");
    const [valorBusqueda, setValorBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");

    //paginacion
    const [paginaActual, setPaginaActual] = useState(1);
    //Eventualmente cambiar a 8 por pagina
    const [proyectosPorPagina] = useState(1);


    useEffect(() => {
        const cargarProyectos = async () => {
            try {
                const response = await fetch("/api/proyectos/consultar");
                const datos = await response.json();
                setProyectos(datos);
                setProyectosFiltrados(datos); //mostrar todos inicialmente
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setCargado(false);
            }
        };
        cargarProyectos();
    }, []);

    useEffect(() => {
        let resultados = proyectos;

        if (valorBusqueda) {
            switch (campoFiltro) {
                case "varios":
                    resultados = resultados.filter(proyectos => proyectos.nombreProyecto.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
                        proyectos.codigoProyecto.toLowerCase().includes(valorBusqueda.toLowerCase()) || proyectos.lineaInvestigacion.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
                        proyectos.fechaInicio.toLowerCase().includes(valorBusqueda.toLowerCase()) || proyectos.fechaFinalizacion.toLowerCase().includes(valorBusqueda.toLowerCase()));
                    break;

                case "nombre":
                    resultados = resultados.filter(proyectos => proyectos.nombreProyecto.toLowerCase().includes(valorBusqueda.toLowerCase()));
                    break;

                case "codigo":
                    resultados = resultados.filter(proyectos => proyectos.codigoProyecto.toLowerCase().includes(valorBusqueda.toLowerCase()));
                    break;

                case "lineaInvestigacion":
                    resultados = resultados.filter(proyectos => proyectos.lineaInvestigacion.toLowerCase().includes(valorBusqueda.toLowerCase()));
                    break;

                case "fechaInicio":
                    resultados = resultados.filter(proyectos => proyectos.fechaInicio.toLowerCase().includes(valorBusqueda.toLowerCase()));
                    break;

                case "fechaFinalizacion":
                    resultados = resultados.filter(proyectos => proyectos.fechaFinalizacion.toLowerCase().includes(valorBusqueda.toLowerCase()));
                    break;
                default:
                    break;
                // case "investigadorPrincipal":
                //     resultados = resultados.filter(proyectos => proyectos.investigadoresAsignados.toLowerCase().includes(valorBusqueda.toLowerCase()));
                //     break;

            }
            setProyectosFiltrados(resultados);
            setPaginaActual(1);
        } else {
            setProyectosFiltrados(proyectos);
        }
    },[campoFiltro, valorBusqueda, proyectos]); //dependencias

    //Calcular paginacion
    const indexUltimoProyecto = paginaActual * proyectosPorPagina;
    const indexPrimerProyecto = indexUltimoProyecto - proyectosPorPagina;
    const proyectosPaginaActual = proyectosFiltrados.slice(indexPrimerProyecto, indexUltimoProyecto);
    const totalPaginas = Math.ceil(proyectosFiltrados.length / proyectosPorPagina);

    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    const paginaAnterior = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
        }
    };
    const paginaSiguiente = () => {
        if (paginaActual < totalPaginas) {
            setPaginaActual(paginaActual + 1);
        }
    };

    const numerosPagina = [];
    for (let i = 1; i <= totalPaginas; i++) {
        numerosPagina.push(i);
    }

    const limpiarFiltros = () => {
        setCampoFiltro("varios");
        setValorBusqueda("");
        setFiltroEstado("");
        setPaginaActual(1);
    };


    return(
        <div className="contenedor_proyectos">
            <form className="buscar">
                <select className="filtro"
                        value={campoFiltro}
                        onChange={(e) => setCampoFiltro(e.target.value)}
                >
                    <option value="varios">Todos los campos</option>
                    <option value="nombre">Nombre</option>
                    <option value="codigo">Código</option>
                    <option value="lineaInvestigacion">Línea de investigación</option>
                    <option value="fechaInicio">Fecha inicio</option>
                    <option value="fechaFinalizacion">Fecha finalización</option>
                </select>

                <input className="buscador"
                       type="text"
                       placeholder={"Buscar"}
                       value={valorBusqueda}
                       onChange={(e) => setValorBusqueda(e.target.value)}
                />

                <button
                    type="button"
                    className="boton-limpiar"
                    onClick={limpiarFiltros}
                    disabled={!valorBusqueda && campoFiltro === "varios" && !filtroEstado}
                >
                    Limpiar Filtros
                </button>
            </form>

            <section className="todosLosProyectos">
                <h2>Lista de Proyectos</h2>
                <div className="label">
                    {proyectosPaginaActual.map(proyecto => (
                        <label key={proyecto.codigoProyecto}>
                            <h3>{proyecto.nombreProyecto}</h3>
                            <p>Código: {proyecto.codigoProyecto}</p>
                            <p>Fecha Inicio: {proyecto.fechaInicio}</p>
                            <p>Fecha finalización: {proyecto.fechaFinalizacion}</p>
                            <p>Línea de investigación: {proyecto.lineaInvestigacion}</p>
                        </label>
                    ))}
                </div>

                {totalPaginas > 1 && (
                    <div className="paginacion">
                        <button
                            onClick={paginaAnterior}
                            disabled={paginaActual === 1}
                            className="boton-paginacion"
                        >
                            ← Anterior
                        </button>

                        <div className="numeros-pagina">
                            {numerosPagina.map(numero => (
                                <button
                                    key={numero}
                                    onClick={() => cambiarPagina(numero)}
                                    className={`numero-pagina ${paginaActual === numero ? 'activo' : ''}`}
                                >
                                    {numero}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={paginaSiguiente}
                            disabled={paginaActual === totalPaginas}
                            className="boton-paginacion"
                        >
                            Siguiente →
                        </button>
                    </div>
                )}

            </section>

            <div className="contador-paginacion">
                Mostrando {proyectosPaginaActual.length} de {proyectosFiltrados.length} proyectos
                {totalPaginas > 1 && ` - Página ${paginaActual} de ${totalPaginas}`}
            </div>

        </div>
    );


}

export default ConsultaProyectos;