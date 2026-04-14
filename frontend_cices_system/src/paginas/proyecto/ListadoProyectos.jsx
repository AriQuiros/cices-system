import { Link } from "react-router-dom";
import { useProyectos } from "../../hooks/proyectos/useProyectos";
import {useTiposCatalogo} from "../../hooks/useTiposCatalogo.js";
import Select from "react-select";
import {useLineas} from "../../hooks/proyectos/useLineas.jsx";
import {useContext} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import FiltrosProyectos from "../../components/FiltradoProyectos";
import "./ListadoProyectos.css";

function ListadoProyectos() {
    const { token, user } = useContext(AppContext);
    const {
        proyectos,
        orden,
        setOrden,
        cargando,
        filtros,
        handleChange,
        limpiarFiltros,
        total,
        page,
        setPage,
        totalPages
    } = useProyectos();

    const { tipos } = useTiposCatalogo(token, [
        "ESTADO_PROYECTO",
        "TIPO_PROYECTO"
    ]);

    const opcionesTipos = tipos["TIPO_PROYECTO"]?.map(t => ({
        value: t.id,
        label: t.despliegue
    })) || [];
    const { opciones: opcionesLineas } = useLineas();

    const esSoloInvestigador = user.roles.length === 1 && user.roles[0] === "INVESTIGADOR";

    return (

        <div className="listado-proyectos-page">

            <div className="listado-proyectos-card">

                <h2 className="listado-proyectos-title">{esSoloInvestigador?"Mis Proyectos":"Listado de proyectos"}</h2>

        <div className="contenedor_proyectos">

            <FiltrosProyectos
                filtros={filtros}
                onChange={handleChange}
                onClear={limpiarFiltros}
                orden={orden}
                setOrden={setOrden}
                opcionesLineas={opcionesLineas}
                opcionesTipos={opcionesTipos}
                opcionesEstado={tipos["ESTADO_PROYECTO"] || []}
            />
            <p>Total de proyectos: {total}</p>
            <section className="todosLosProyectos">

                {cargando && <p>Cargando proyectos...</p>}

                {!cargando && proyectos.length === 0 && (
                    <p>No se encontraron proyectos</p>
                )}

                <div className="label">

                    {proyectos.map(p => (

                        <div key={p.codigoProyecto} className="proyecto_card">

                            <h3>{p.codigoProyecto}</h3>

                            <p><b>Nombre:</b> {p.nombreProyecto}</p>
                            <p><b>Tipo:</b> {p.tipoProyecto}</p>
                            <p><b>Línea:</b> {p.lineaInvestigacion}</p>
                            <p><b>Estado:</b> {p.estado}</p>
                            <p>{p.fechaInicio} - {p.fechaFinalizacion}</p>

                            <Link to={`/proyectos/${p.codigoProyecto}`}>Ver proyecto</Link>
                        </div>

                    ))}

                </div>

            </section>
            <div className="paginacion">

                <button disabled={page === 0} onClick={() => setPage(page - 1)}>
                    Anterior
                </button>

                <span>Página {page + 1} de {totalPages}</span>

                <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
                    Siguiente
                </button>

            </div>
        </div>

            </div>

        </div>
    );
}

export default ListadoProyectos;