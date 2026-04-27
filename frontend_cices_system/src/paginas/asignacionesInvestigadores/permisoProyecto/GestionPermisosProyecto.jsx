import React, { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext.jsx";
import BuscadorProyecto from "../../../components/BusquedaProyecto.jsx";
import PermisoProyectoForm from "../../../modules/permisoProyecto/components/PermisoProyectoForm.jsx";
import { notify } from "../../../utils/ui/notify.jsx";
import { useGestionPermisos } from "../../../modules/permisoProyecto/hooks/useGestionPermisos";
import PermisoProyectoTable from "../../../modules/permisoProyecto/components/PermisoProyectoTable.jsx";
import "../AsignarInvestigador.css"
export default function GestionPermisosProyecto() {

    const { token, user } = useContext(AppContext);

    const [proyecto, setProyecto] = useState(null);
    const [setInvestigadores] = useState([]);

    const { permisos, otorgarPermiso, removerPermiso, investigadores } = useGestionPermisos(proyecto?.codigoProyecto);

    const seleccionarProyecto = async (p) => {

        if (!p) {
            setProyecto(null);
            setInvestigadores([]);
            return;
        }

        setProyecto(p);

        try {
            // investigadores se obtienen desde el hook useGestionPermisos
            setInvestigadores([]);
        } catch {
            notify.error("Error cargando datos del proyecto");
        }
    };

    // useGestionPermisos exposes wrapper functions that handle confirm and mutations

    return (

        <div className="asignar-page">

            <h2>Gestión de Permisos de Proyecto</h2>

            <BuscadorProyecto
                token={token}
                user={user}
                principal={true}
                onSelect={seleccionarProyecto}
            />

            {proyecto && (

                <>
                    <h3>Otorgar permiso</h3>

                    <PermisoProyectoForm
                        proyectoSeleccionado={proyecto}
                        investigadoresProyecto={
                            investigadores.filter(i =>
                                !permisos.some(p => p.idInvestigadorProyecto === i.id)
                                &&
                                i.rolProyecto?.toUpperCase() !== "PRINCIPAL"
                            )
                        }
                        onGuardar={otorgarPermiso}
                    />

                    <hr />

                    <h3>Permisos actuales</h3>

                    <PermisoProyectoTable permisos={permisos} onRemove={removerPermiso} />

                </>

            )}

        </div>
    );
}