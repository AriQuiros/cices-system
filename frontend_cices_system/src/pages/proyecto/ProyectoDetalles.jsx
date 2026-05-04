import {useProyecto} from "../../context/proyectoCtx/UseProyecto.jsx";

function ProyectoDetalles({ editable }) {

    const { proyecto, actualizarCampo } = useProyecto();

    if (!editable) return null;

    return (
        <fieldset className="input-group">
            <legend>Detalles adicionales</legend>

            <textarea
                name={"detallesProyecto"}
                className="input-field"
                rows="5"
                value={proyecto.detalles ?? ""}
                onChange={(e) =>
                    actualizarCampo("detalles", e.target.value)
                }
                placeholder="Notas internas, observaciones..."
            />
        </fieldset>
    );
}

export default ProyectoDetalles;