import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import BuscadorProyecto from "../../components/ui/busqueda/BusquedaProyecto.jsx";
import BotonVolver from "../../components/BotonVolver.jsx";
import "./AsignarInvestigador.css";

import { useGestionInvestigadores } from "../../modules/investigadorProyecto/hooks/useGestionInvestigadores.js";
import InvestigadorForm from "../../modules/investigadorProyecto/components/InvestigadorForm.jsx";
import InvestigadorTable from "../../modules/investigadorProyecto/components/InvestigadorTable.jsx";
import { useInvestigadorForm } from "../../modules/investigadorProyecto/hooks/useInvestigadorForm.js";
import { obtenerRolesProyecto } from "../../services/RolService.jsx";
import {Pagination} from "../../components/ui/Pagination.jsx";

const AsignarInvestigadores = () => {
    const { token } = useContext(AppContext);

    const [proyecto, setProyecto] = useState(null);
    const [roles, setRoles] = useState([]);

    const {
        investigadores,
        investigadorSeleccionado,
        seleccionarParaEditar,
        eliminar,
        guardar,
        limpiarSeleccion,

        pageable,
        cambiarPagina,
        total,
        totalPages
    } = useGestionInvestigadores(proyecto?.codigoProyecto);

    // form hook
    const form = useInvestigadorForm({
        investigadorSeleccionado,
        proyecto,
        investigadoresRegistrados: investigadores,
        onSubmit: guardar,
        isEditing: !!investigadorSeleccionado,
        onClearSelection: limpiarSeleccion
    });

    useEffect(() => {
        const cargar = async () => {
            try {
                const res = await obtenerRolesProyecto(token);
                setRoles(res || []);
            } catch {
                // fall back silent
            }
        };

        cargar();
    }, [token]);

    const seleccionarProyecto = async (p) => {
        if (!p) {
            setProyecto(null);
            return;
        }
        setProyecto(p);
    };

    const rolesParaAsignar = investigadores.some(inv => inv.rolProyecto === "PRINCIPAL") ||
        form.investigadoresForm.some(f => f.rolProyecto?.nombreRolProyecto === "PRINCIPAL");

    return (
        <div className="asignar-page">
            <BotonVolver />
            <div className="asignar-header">
                <h2>Asignación de Investigadores</h2>
            </div>

            <BuscadorProyecto onSelect={setProyecto} />

            {proyecto && (
                <>
                    <InvestigadorForm
                        investigadoresForm={form.investigadoresForm}
                        actualizarCampo={form.actualizarCampo}
                        agregarFila={form.agregarFila}
                        eliminarFila={form.eliminarFila}
                        handleSubmit={form.handleSubmit}
                        candidatos={form.candidatos}
                        setFilaBuscando={form.setFilaBuscando}
                        seleccionarInvestigadorSelect={form.seleccionarInvestigadorSelect}
                        isEditing={!!investigadorSeleccionado}
                        roles={roles}
                        rolesParaAsignar={rolesParaAsignar}
                        onCancel={() => { form.limpiar(); limpiarSeleccion(); }}
                        proyecto={proyecto}
                    />

                    <InvestigadorTable
                        investigadores={investigadores}
                        onEdit={seleccionarParaEditar}
                        onDelete={eliminar}
                    />

                    <Pagination
                        page={pageable.page}
                        totalPages={totalPages}
                        totalElements={total}
                        onPageChange={cambiarPagina}
                    />
                </>
            )}
        </div>
    );
};

export default AsignarInvestigadores;