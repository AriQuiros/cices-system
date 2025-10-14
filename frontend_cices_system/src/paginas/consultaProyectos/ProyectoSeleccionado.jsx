import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProyectoSeleccionado.css";

function ProyectoSeleccionado() {
    const { id } = useParams();
    const [proyecto, setProyecto] = useState();
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerProyecto = async () => {
            try {
                const res = await fetch(`/api/proyectos/consultar/${id}`);
                if (!res.ok) throw new Error("Error al cargar el proyecto");

                const data = await res.json();
                setProyecto(data);
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar el proyecto");
            }
        };
        obtenerProyecto();
    }, [id]);

    if (!proyecto) {
        return <p>Cargando proyecto...</p>;
    }

    return (
        <div className="proyecto-container">
            <div className="titulo">INFORMACIÓN GENERAL DEL PROYECTO</div>
            <p> Nombre:{proyecto.nombre}</p>
            <p>Código: {proyecto.codigo}</p>
            <p>Fecha Inicio: {proyecto.fechaInicio}</p>
            <p>Fecha Finalizacion: {proyecto.fechaFinalizacion}</p>
            <p>Estado: {proyecto.estado?.toLowerCase().replace(/^\w/, c => c.toUpperCase())}</p>
            <p>Linea de Investigacion: {proyecto.lineaInvestigacion}</p>
            <p>Tipo: {proyecto.tipoProyecto?.toLowerCase().replace(/^\w/, c => c.toUpperCase())}</p>


            <div className="titulo">DESCRIPCION</div>
            <p>{proyecto.descripcion}</p>
            <div className="titulo">OBJETIVO GENERAL</div>
            <p>{proyecto.objetivoGeneral}</p>
            <div className="titulo">DETALLES</div>
            <p>{proyecto.detalles}</p>
            <div className="titulo">UNIDADES PARTICIPANTES</div>
            <ul>
                {proyecto.entidadesVinculadas.map(ent => (
                    <li key={ent.nombre}>{ent.nombre} - {ent.tipo}</li>
                ))}
            </ul>
            {/*<h3>ADSCRIPCIONES</h3>*/}
            <div className="titulo">INVESTIGADORES</div>
            <table>
                <thead>
                <tr>
                    <th>ROL</th>
                    <th>NOMBRE COMPLETO</th>
                    <th>CEDULA</th>
                    <th>GRADO ACADEMICO</th>
                    <th>INSTITUCION</th>
                    <th>UNIDAD</th>
                </tr>
                </thead>
                <tbody>
                {proyecto.investigadoresProyectos?.map((ent) => (
                    <tr key={ent.id}>
                        <td>{ent.rolProyecto?.toLowerCase()
                            .replace(/_/g, ' ')
                            .replace(/^\w/, c => c.toUpperCase())}</td>
                        <td>{ent.nombre}</td>
                        <td>{ent.cedula}</td>
                        <td>{ent.gradoAcademico?.toLowerCase().replace(/^\w/, c => c.toUpperCase())}</td>
                        <td>{ent.institucion}</td>
                        <td>{ent.unidadAcademica}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="titulo">OBJETIVOS ESPECIFICOS</div>
            <table>
                <thead>
                <th className="encabezados" colSpan={2}>OBJETIVO</th>
                <tr>
                    <th>CATEGORIA</th>
                    <th>DESCRIPCIÓN</th>
                </tr>
                </thead>
                <tbody>
                {proyecto.objetivosEspecificos?.map((ent) => (
                    <>
                        <tr key={ent.idObjetivo}>
                            <td>{ent.categoria}</td>
                            <td>{ent.descripcion}</td>
                        </tr>
                        {ent.metas?.length > 0 && (
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
                                        {ent.metas.map((meta, i) => (
                                            <tr key={i}>
                                                <td>{meta.tipo?.toLowerCase().replace(/^\w/, c => c.toUpperCase())}</td>
                                                <td>{meta.cantidad ?? "-"}</td>
                                                <td>{meta.descripcion}</td>
                                                <td>
                                                    <ul>
                                                        {meta.indicadores?.map((indicador, j) => (
                                                            <li key={j}>{indicador.descripcion ?? indicador}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                        )}
                        {(!ent.metas || ent.metas.length === 0) && (
                            <tr>
                                <td>
                                    <em>No hay metas asociadas a este objetivo</em>
                                </td>
                            </tr>
                        )}
                    </>
                ))}
                </tbody>
            </table>

            <div className="titulo">PRESUPUESTOS</div>
            <table>
                <thead>
                <tr>
                    <th>FUENTE FINANCIAMIENTO</th>
                    <th>TIPO PRESUPUESTO</th>
                    <th>DESCRIPCION</th>
                    <th>MONTO</th>
                </tr>
                </thead>
                <tbody>
                {proyecto.presupuestos?.map((ent) => (
                    <tr key={ent.idPresupuesto}>
                        <td>{ent.fuenteFinanciamiento?.toLowerCase().replace(/^\w/, c => c.toUpperCase())}</td>
                        <td>{ent.tipoPresupuesto?.toLowerCase().replace(/^\w/, c => c.toUpperCase())}</td>
                        <td>{ent.descripcion}</td>
                        <td>{ent.monto}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="titulo">DOCUMENTOS</div>
            <table>
                <thead>
                <tr>
                    <th>NOMBRE</th>
                    <th>DESCARGAR</th>
                </tr>
                </thead>
                <tbody>
                {proyecto.documentos?.map((ent) => (
                    <tr key={ent.idDocumento}>
                        <td>{ent.nombreDocumento}</td>
                        <td>{ent.directorio}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="titulo">INFORMES</div>
            <table>
                <thead>
                <tr>
                    <th>DESCRIPCION</th>
                    <th>FECHA DE PRESENTACION</th>
                </tr>
                </thead>
                <tbody>
                {proyecto.presentacionesInformes?.map((ent) => (
                    <tr key={ent.idInforme}>
                        <td>{ent.descripcion}</td>
                        <td>{ent.fechaPresentacion}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProyectoSeleccionado;