import { Link } from "react-router-dom";
import { useProyectos } from "../../hooks/proyectos/useProyectos";
import "../consultaProyectos/ConsultaProyectos.css";
import {useTiposCatalogo} from "../../hooks/useTiposCatalogo.js";

function ListadoProyectos() {
    const token = localStorage.getItem("token");
    const {
        proyectos,
        lineas,
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

    return (

        <div className="contenedor_proyectos">

            <div className="buscar">

                <input
                    type="text"
                    placeholder="Código o nombre"
                    value={filtros.texto}
                    onChange={(e) => handleChange("texto", e.target.value)}
                />

                <select
                    value={filtros.lineaInvestigacion}
                    onChange={(e) => handleChange("lineaInvestigacion", e.target.value)}
                >
                    <option value="">Tipo de proyecto</option>
                    {lineas?.map((opcion, idx) => (
                        <option key={opcion ?? idx} value={opcion}>{opcion}</option>
                    ))}
                </select>

                <select
                    value={filtros.tipoProyecto}
                    onChange={(e) => handleChange("tipoProyecto", e.target.value)}
                >
                    <option value="">Tipo de proyecto</option>
                    {tipos["TIPO_PROYECTO"]?.map((opcion, idx) => (
                        <option key={opcion.id ?? opcion.valor ?? idx} value={opcion.valor}>{opcion.despliegue}</option>
                    ))}
                </select>

                <select
                    value={filtros.estado}
                    onChange={(e) => handleChange("estado", e.target.value)}
                >
                    <option value="">Tipo de proyecto</option>
                    {tipos["ESTADO_PROYECTO"]?.map((opcion, idx) => (
                        <option key={opcion.id ?? opcion.valor ?? idx} value={opcion.valor}>{opcion.despliegue}</option>
                    ))}
                </select>

                <select
                    value={`${orden.campo}_${orden.asc ? "asc" : "desc"}`}
                    onChange={e => {
                        const [campo, dir] = e.target.value.split("_");
                        setOrden({ campo, asc: dir === "asc" });
                    }}
                >
                    <option value="fechaInicio_desc">Proyectos más nuevos</option>
                    <option value="fechaInicio_asc">Proyectos más antiguos</option>
                    <option value="fechaFinalizacion_desc">Fecha fin lejana</option>
                    <option value="fechaFinalizacion_asc">Finalizados / pronto</option>
                </select>

                <button onClick={limpiarFiltros}>
                    Limpiar
                </button>

            </div>

            <section className="resultados">

                {cargando && <p>Cargando proyectos...</p>}

                {!cargando && proyectos.length === 0 && (
                    <p>No se encontraron proyectos</p>
                )}

                <div className="lista_proyectos">

                    {proyectos.map(p => (

                        <div key={p.codigo} className="proyecto_card">

                            <h3>{p.codigo}</h3>

                            <p><b>Nombre:</b> {p.nombre}</p>
                            <p><b>Tipo:</b> {p.tipoProyecto}</p>
                            <p><b>Línea:</b> {p.lineaInvestigacion}</p>
                            <p><b>Estado:</b> {p.estado}</p>
                            <p>{p.fechaInicio} - {p.fechaFinalizacion}</p>

                            <Link
                                to={`/consultar/${p.codigo}`}
                                className="ver-mas"
                            >
                                Ver más
                            </Link>

                        </div>

                    ))}

                </div>

            </section>

        </div>
    );
}

export default ListadoProyectos;