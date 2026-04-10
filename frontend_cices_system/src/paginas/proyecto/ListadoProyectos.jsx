import { Link } from "react-router-dom";
import { useProyectos } from "../../hooks/proyectos/useProyectos";
import {useTiposCatalogo} from "../../hooks/useTiposCatalogo.js";
import Select from "react-select";
import {useLineas} from "../../hooks/proyectos/useLineas.jsx";
import {useContext} from "react";
import {AppContext} from "../../context/AppContext.jsx";
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
        limpiarFiltros
    } = useProyectos();

    const { tipos } = useTiposCatalogo(token, [
        "ESTADO_PROYECTO",
        "TIPO_PROYECTO"
    ]);

    const opcionesTipos = tipos["TIPO_PROYECTO"]?.map(t => ({
        value: t.valor,
        label: t.despliegue
    })) || [];
    const { opciones: opcionesLineas } = useLineas();
    const manejarLineasSelect = selectedOptions => {
        handleChange("lineaInvestigacion", selectedOptions ? selectedOptions.map(o => o.value) : []);
    };

    const manejarTiposSelect = selectedOptions => {
        handleChange("tipoProyecto", selectedOptions ? selectedOptions.map(o => o.value) : []);
    };

    const esSoloInvestigador = user.roles.length === 1 && user.roles[0] === "INVESTIGADOR";

    return (

        <div className="listado-proyectos-page">

            <div className="listado-proyectos-card">

                <h2 className="listado-proyectos-title">{esSoloInvestigador?"Mis Proyectos":"Listado de proyectos"}</h2>

        <div className="contenedor_proyectos">

            <div className="buscar row">

                <input
                    className="buscador"
                    type="text"
                    placeholder="Código o nombre"
                    value={filtros.texto}
                    onChange={(e) => handleChange("texto", e.target.value)}
                />

                <Select
                    classNamePrefix="react-select"
                    options={opcionesLineas}
                    isMulti
                    value={opcionesLineas.filter(l => filtros.lineaInvestigacion.includes(l.value))}
                    onChange={manejarLineasSelect}
                    placeholder="Línea(s) de investigación"
                    closeMenuOnSelect={false}
                />

                <Select
                    classNamePrefix="react-select"
                    options={opcionesTipos}
                    isMulti
                    value={opcionesTipos.filter(t => filtros.tipoProyecto.includes(t.value))}
                    onChange={manejarTiposSelect}
                    placeholder="Tipo(s) de proyecto"
                    closeMenuOnSelect={false}
                />

                <select
                    className="filtro"
                    value={filtros.estado}
                    onChange={(e) => handleChange("estado", e.target.value)}
                >
                    <option value="">Estado de proyecto</option>
                    {tipos["ESTADO_PROYECTO"]?.map((opcion) => (
                        <option key={opcion.id} value={opcion.valor}>
                            {opcion.despliegue}
                        </option>
                    ))}
                </select>

                <select
                    className="filtro"
                    value={`${orden.campo}_${orden.asc ? "asc" : "desc"}`}
                    onChange={e => {
                        const [campo, dir] = e.target.value.split("_");
                        setOrden({ campo, asc: dir === "asc" });
                    }}
                >
                    <option value="fechaInicio_desc">Proyectos más nuevos</option>
                    <option value="fechaInicio_asc">Proyectos más antiguos</option>
                    <option value="fechaFinalizacion_desc">Fecha fin lejana</option>
                    <option value="fechaFinalizacion_asc">Finalizados / próximos</option>
                </select>

                <button
                    className="boton-limpiar"
                    onClick={limpiarFiltros}
                >
                    Limpiar
                </button>

            </div>

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

        </div>

            </div>

        </div>
    );
}

export default ListadoProyectos;