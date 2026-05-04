import { useRegistroProyecto } from "../../hooks/proyectoHooks/useRegistroProyecto.js";
import "../../estilos/form.css";
import "./RegistroProyecto.css";

import ProyectoDatosBasicos from "./ProyectoDatosBasicos.jsx";
import ProyectoObjetivos from "./ProyectosObjetivos.jsx";
import ProyectoEntidades from "./EntidadesProyecto.jsx";
import ProyectoInformes from "./InformesProyectos.jsx";
import ProyectoDocumentos from "./DocumentosProyectos.jsx";
import ProyectoDetalles from "./ProyectoDetalles.jsx";
import BuscadorProyecto from "../../components/busqueda/BusquedaProyecto.jsx";
import BotonInicio from "../../components/shared/BotonInicio.jsx";
function RegistroProyecto({ editable = false }) {
    const {
        tiposProyecto, tipoMeta, tipoInforme, opcionesLineas, cargandoLineas,

        codigoSeleccionado,
        cargandoDetalle,
        isPending,
        seleccionarProyecto,
        handleSubmit,
    } = useRegistroProyecto({ editable });
    return (
        <div className={`form-container ${editable ? "actualizar-proyecto-page" : "registro-proyecto-page"}`}>
            <div className={editable ? "actualizar-proyecto-card" : "registro-proyecto-card"}>

                {editable && !codigoSeleccionado && (
                    <div className="actualizar-proyecto-search">
                        <BuscadorProyecto principal={true} onSelect={seleccionarProyecto} />
                    </div>
                )}

                {cargandoDetalle && <p className="loading-detalle">Cargando proyecto...</p>}

                {(!editable || codigoSeleccionado) && !cargandoDetalle && (
                    <form
                        className={`form-content ${editable ? "actualizar-proyecto-form" : "registro-proyecto-form"}`}
                        onSubmit={handleSubmit}
                    >
                        <BotonInicio />
                        <h2 className={editable ? "actualizar-proyecto-title" : "registro-proyecto-title"}>
                            {editable ? "Editar Proyecto" : "Registrar Proyecto"}
                        </h2>

                        <ProyectoDatosBasicos
                            editable={editable}
                            tiposProyecto={tiposProyecto}
                            opcionesLineas={opcionesLineas}
                            cargandoLineas={cargandoLineas}
                        />
                        <ProyectoObjetivos    editable={editable} tipoMeta={tipoMeta} />
                        <ProyectoEntidades    editable={editable} />
                        <ProyectoInformes     editable={editable} tipoInforme={tipoInforme} />
                        <ProyectoDocumentos   editable={editable} />
                        <ProyectoDetalles     editable={editable} />

                        <button type="submit" className="submit-btn" disabled={isPending}>
                            {isPending ? "Guardando..." : editable ? "Actualizar Proyecto" : "Registrar Proyecto"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
export default RegistroProyecto;