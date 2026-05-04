import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import BuscadorProyecto from "../../components/busqueda/BusquedaProyecto.jsx";
import PermisoProyectoForm from "../../components/permisoProyectoComponents/PermisoProyectoForm.jsx";
import { useGestionPermisos } from "../../hooks/permisoProyectoHooks/useGestionPermisos.js";
import PermisoProyectoTable from "../../components/permisoProyectoComponents/PermisoProyectoTable.jsx";
import "../investigadorProyecto/AsignarInvestigador.css"
export default function GestionPermisosProyecto() {

    const [proyecto, setProyecto] = useState(null);

    const { permisos, otorgarPermiso, removerPermiso, investigadores } = useGestionPermisos(proyecto?.codigoProyecto);

    return (

        <div className="asignar-page">

            <h2>Gestión de Permisos de Proyecto</h2>

            <BuscadorProyecto onSelect={setProyecto} soloPrincipalOPermiso={true} />

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