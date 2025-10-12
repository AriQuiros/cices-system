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
            <h2 className="proyecto-titulo">INFORMACIÓN GENERAL DEL PROYECTO</h2>
            <p> Nombre:{proyecto.nombre}</p>
            <p>Código: {proyecto.codigo}</p>
            <p>Fecha Inicio: {proyecto.fechaInicio}</p>
            <p>Fecha Finalizacion: {proyecto.fechaFinalizacion}</p>
            <p>Estado: {proyecto.estado}</p>
            <p>Tipo de Investigacion: {proyecto.lineaInvestigacion}</p>


            <h3>DESCRIPCION</h3>
            <p>{proyecto.descripcion}</p>
            <h3>OBJETIVO GENERAL</h3>
            <p>{proyecto.objetivoGeneral}</p>
            <h3>DETALLES</h3>
            <p>{proyecto.detalles}</p>
            <h3>UNIDADES PARTICIPANTES</h3>
            <ul>
                {proyecto.entidadesVinculadas.map(ent => (
                    <li key={ent.nombre}>{ent.nombre} - {ent.tipo}</li>
                ))}
            </ul>
            <h3>ADSCRIPCIONES</h3>
            <h3>INVESTIGADORES</h3>
            <h3>OBJETIVOS ESPECIFICOS</h3>
            <h3>OBJETIVO</h3>
            <h3>PRESUPUESTO</h3>
            <h3>DOCUMENTOS</h3>
            <h3>INFORMES</h3>
        </div>
    );
}

export default ProyectoSeleccionado;