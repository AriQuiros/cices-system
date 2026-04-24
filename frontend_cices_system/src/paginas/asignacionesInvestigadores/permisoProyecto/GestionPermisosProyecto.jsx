import React, { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext.jsx";
import BuscadorProyecto from "../../../components/BusquedaProyecto.jsx";
import PermisoProyectoForm from "./PermisoProyectoForm.jsx";
import { obtenerInvestigadoresProyecto } from "../../../services/ReportesService.jsx";
import { notify } from "../../../utils/ui/notify.jsx";
import {confirm} from "../../../utils/ui/confirm.jsx";
import "../AsignarInvestigador.css"

const API = "/api/permiso-proyecto";

export default function GestionPermisosProyecto() {

    const { token, user } = useContext(AppContext);

    const [proyecto, setProyecto] = useState(null);
    const [investigadores, setInvestigadores] = useState([]);
    const [permisos, setPermisos] = useState([]);

    const cargarPermisos = async (codigoProyecto) => {
        try {

            const res = await fetch(`${API}/obtener/${codigoProyecto}`);

            if (!res.ok) throw new Error();

            const data = await res.json();

            setPermisos(data || []);

        } catch {
            notify.error("Error cargando permisos");
        }
    };

    const seleccionarProyecto = async (p) => {

        if (!p) {
            setProyecto(null);
            setInvestigadores([]);
            setPermisos([]);
            return;
        }

        setProyecto(p);

        try {
            const inv = await obtenerInvestigadoresProyecto(p.codigoProyecto, token);
            setInvestigadores(inv || []);

            await cargarPermisos(p.codigoProyecto);

        } catch {
            notify.error("Error cargando datos del proyecto");
        }
    };

    const otorgarPermiso = async (permiso) => {
        try {

            const res = await fetch(`${API}/otorgar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(permiso)
            });

            if (!res.ok) throw new Error();

            notify.success("Permiso otorgado correctamente");

            await cargarPermisos(proyecto.codigoProyecto);

        } catch {
            notify.error("Error otorgando permiso");
        }
    };

    const removerPermiso = async (id) => {
        if (!(await confirm.action({
            title: "Eliminar permiso",
            message: "¿Remover permiso a investigador?",
            confirmText:"Remover"
        }
        ))) return;
        try {

            const res = await fetch(`${API}/remover/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error();

            notify.success("Permiso removido correctamente");

            await cargarPermisos(proyecto.codigoProyecto);

        } catch {
            notify.error("Error eliminando permiso");
        }

    };

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
                                i.rolProyecto?.nombreRolProyecto?.toUpperCase() !== "PRINCIPAL"
                            )
                        }
                        onGuardar={otorgarPermiso}
                    />

                    <hr />

                    <h3>Permisos actuales</h3>

                    {permisos.length === 0 ? (
                        <p>No hay permisos asignados</p>
                    ) : (

                        <table className="tabla-horas">
                            <thead>
                            <tr>
                                <th>Investigador</th>
                                <th>Identificación</th>
                                <th>Fecha inicio</th>
                                <th>Fecha fin</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>

                            <tbody>
                            {permisos.map(p => (
                                <tr key={p.id}>

                                    <td>
                                        {p.nombreInvestigador}
                                    </td>

                                    <td>
                                        {p.identificacionInvestigador}
                                    </td>

                                    <td>
                                        {p.fechaInicio}
                                    </td>

                                    <td>
                                        {p.fechaFin || "Indefinida"}
                                    </td>

                                    <td>
                                        <button
                                            className="btn-danger"
                                            onClick={() => removerPermiso(p.id)}
                                        >
                                            Remover
                                        </button>
                                    </td>

                                </tr>
                            ))}
                            </tbody>
                        </table>

                    )}

                </>

            )}

        </div>
    );
}