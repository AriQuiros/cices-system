import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import "./ProyectoSeleccionado.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

function ProyectoSeleccionado() {
    const { codigo, id } = useParams();
    const [proyecto, setProyecto] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const referencia = (codigo || id || "").trim();

        if (!referencia) {
            setError("Referencia de proyecto inválida");
            return;
        }

        const obtenerProyecto = async () => {
            try {
                const esCodigoProyecto = Boolean(codigo) && isNaN(Number(codigo));
                const endpoint = esCodigoProyecto
                    ? `${API}/api/proyectos/${referencia}`
                    : `${API}/api/proyectos/consultar/${referencia}`;

                const res = await fetch(endpoint);

                if (!res.ok) {
                    const texto = await res.text();
                    throw new Error(texto || "Error al cargar el proyecto");
                }

                const data = await res.json();
                console.log("Proyecto DTO recibido:", data);

                setProyecto({
                    codigoProyecto: data.codigoProyecto ?? "",
                    nombreProyecto: data.nombreProyecto ?? "",
                    descripcion: data.descripcion ?? "",
                    objetivoGeneral: data.objetivoGeneral ?? "",
                    fechaInicio: data.fechaInicio ?? "",
                    fechaFinalizacion: data.fechaFinalizacion ?? "",
                    lineaInvestigacion: data.lineaInvestigacion ?? "",
                    tipoProyecto: data.tipoProyecto ?? null,
                    estado: data.estado ?? null,
                    detalles: data.detalles ?? "",
                    objetivosEspecificos: data.objetivosEspecificos ?? [],
                    presupuestos: data.presupuestos ?? [],
                    documentos: data.documentos ?? [],
                    entidadesVinculadas: data.entidadesVinculadas ?? [],
                    presentacionesInformes: data.presentacionesInformes ?? [],
                    investigadoresVinculados: data.investigadoresVinculados ?? []
                });

                setError(null);
            } catch (err) {
                console.error("Error al cargar proyecto:", err);
                setError(err.message || "No se pudo cargar el proyecto");
            }
        };

        obtenerProyecto();
    }, [codigo, id]);

    const handleVolver = () => {
        navigate(-1);
    };

    const mostrarCodigo = (codigoDto) => {
        if (!codigoDto) return "-";
        return codigoDto.despliegue || codigoDto.valor || codigoDto.id || "-";
    };

    const mostrarRol = (rolDto) => {
        if (!rolDto) return "-";
        return rolDto.nombreRolProyecto || rolDto.id || "-";
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!proyecto) {
        return <p>Cargando proyecto...</p>;
    }

    return (
        <div className="main">
            <button className="botonVolver" onClick={handleVolver}>
                Volver
            </button>

            <div className="proyecto-container">
                <div className="titulo">INFORMACIÓN GENERAL DEL PROYECTO</div>
                <p>Nombre: {proyecto.nombreProyecto || "Sin nombre"}</p>
                <p>Código: {proyecto.codigoProyecto || "Sin código"}</p>
                <p>Fecha Inicio: {proyecto.fechaInicio || "Sin fecha"}</p>
                <p>Fecha Finalización: {proyecto.fechaFinalizacion || "Sin fecha"}</p>
                <p>Estado: {mostrarCodigo(proyecto.estado)}</p>
                <p>Línea de Investigación: {proyecto.lineaInvestigacion || "Sin línea"}</p>
                <p>Tipo: {mostrarCodigo(proyecto.tipoProyecto)}</p>

                <div className="titulo">DESCRIPCIÓN</div>
                <p>{proyecto.descripcion || "Sin descripción"}</p>

                <div className="titulo">OBJETIVO GENERAL</div>
                <p>{proyecto.objetivoGeneral || "Sin objetivo general"}</p>

                <div className="titulo">DETALLES</div>
                <p>{proyecto.detalles || "Sin detalles"}</p>

                <div className="titulo">ENTIDADES VINCULADAS</div>
                {proyecto.entidadesVinculadas.length === 0 ? (
                    <p>Sin entidades vinculadas</p>
                ) : (
                    <ul>
                        {proyecto.entidadesVinculadas.map((ent) => (
                            <li key={ent.id ?? ent.nombre}>
                                {ent.nombre || "-"} - {mostrarCodigo(ent.tipo)}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="titulo">INVESTIGADORES</div>
                {proyecto.investigadoresVinculados.length === 0 ? (
                    <p>Sin investigadores vinculados</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>ROL</th>
                            <th>NOMBRE</th>
                            <th>IDENTIFICACIÓN</th>
                            <th>ACTIVIDAD</th>
                            <th>FECHA INICIO</th>
                            <th>FECHA FIN</th>
                        </tr>
                        </thead>
                        <tbody>
                        {proyecto.investigadoresVinculados.map((inv) => (
                            <tr key={inv.id ?? `${inv.identificacionInvestigador}-${inv.codigoProyecto}`}>
                                <td>{mostrarRol(inv.rolProyecto)}</td>
                                <td>{inv.nombreInvestigador || "-"}</td>
                                <td>{inv.identificacionInvestigador || "-"}</td>
                                <td>{inv.actividadProyecto || "-"}</td>
                                <td>{inv.fechaInicio || "-"}</td>
                                <td>{inv.fechaFin || "-"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                <div className="titulo">OBJETIVOS ESPECÍFICOS</div>
                {proyecto.objetivosEspecificos.length === 0 ? (
                    <p>Sin objetivos específicos</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>CATEGORÍA</th>
                            <th>DESCRIPCIÓN</th>
                        </tr>
                        </thead>
                        <tbody>
                        {proyecto.objetivosEspecificos.map((obj) => (
                            <React.Fragment key={obj.id ?? obj.descripcion}>
                                <tr>
                                    <td>{obj.categoria || "-"}</td>
                                    <td>{obj.descripcion || "-"}</td>
                                </tr>

                                {obj.metas?.length > 0 && (
                                    <tr>
                                        <td colSpan={2}>
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>TIPO</th>
                                                    <th>CANTIDAD</th>
                                                    <th>DESCRIPCIÓN</th>
                                                    <th>INDICADORES</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {obj.metas.map((meta, j) => (
                                                    <tr key={meta.id ?? j}>
                                                        <td>{mostrarCodigo(meta.tipo)}</td>
                                                        <td>{meta.cantidad ?? "-"}</td>
                                                        <td>{meta.descripcion || "-"}</td>
                                                        <td>
                                                            {meta.indicadores?.length > 0 ? (
                                                                <ul>
                                                                    {meta.indicadores.map((ind, k) => (
                                                                        <li key={ind.id ?? k}>
                                                                            {ind.descripcion ?? ind.nombre ?? ind}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                "Sin indicadores"
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                )}

                <div className="titulo">PRESUPUESTOS</div>
                {proyecto.presupuestos.length === 0 ? (
                    <p>Sin presupuestos</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>CATEGORÍA</th>
                            <th>FECHA ASIGNACIÓN</th>
                            <th>TIPO</th>
                            <th>FUENTE</th>
                            <th>DESCRIPCIÓN</th>
                            <th>MONTO</th>
                            <th>HORAS/MES</th>
                            <th>MESES</th>
                        </tr>
                        </thead>
                        <tbody>
                        {proyecto.presupuestos.map((pres) => (
                            <tr key={pres.id ?? pres.descripcion}>
                                <td>{mostrarCodigo(pres.categoria)}</td>
                                <td>{pres.fechaAsignacion || "-"}</td>
                                <td>{mostrarCodigo(pres.tipoPresupuesto)}</td>
                                <td>{mostrarCodigo(pres.fuenteFinanciamiento)}</td>
                                <td>{pres.descripcion || "-"}</td>
                                <td>{pres.monto ?? "-"}</td>
                                <td>{pres.cantidadHorasMes ?? "-"}</td>
                                <td>{pres.cantidadMeses ?? "-"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                <div className="titulo">DOCUMENTOS</div>
                {proyecto.documentos.length === 0 ? (
                    <p>Sin documentos</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>NOMBRE</th>
                            <th>DESCARGAR</th>
                        </tr>
                        </thead>
                        <tbody>
                        {proyecto.documentos.map((doc) => (
                            <tr key={doc.id ?? doc.nombreDocumento}>
                                <td>{doc.nombreDocumento || "-"}</td>
                                <td>
                                    {doc.directorio ? (
                                        <a
                                            href={doc.directorio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="botonDescargar"
                                        >
                                            Descargar
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                <div className="titulo">INFORMES</div>
                {proyecto.presentacionesInformes.length === 0 ? (
                    <p>Sin informes</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>TIPO</th>
                            <th>FECHA PRESENTACIÓN</th>
                            <th>ESTADO</th>
                        </tr>
                        </thead>
                        <tbody>
                        {proyecto.presentacionesInformes.map((inf) => (
                            <tr key={inf.id ?? `${inf.fechaPresentacion}-${inf.tipoInforme?.id}`}>
                                <td>{mostrarCodigo(inf.tipoInforme)}</td>
                                <td>{inf.fechaPresentacion || "-"}</td>
                                <td>{mostrarCodigo(inf.estado)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ProyectoSeleccionado;