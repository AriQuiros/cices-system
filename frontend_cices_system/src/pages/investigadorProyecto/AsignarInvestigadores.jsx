import BuscadorProyecto from "../../components/busqueda/BusquedaProyecto.jsx";
import BotonInicio from "../../components/shared/BotonInicio.jsx";
import { Pagination } from "../../components/shared/Pagination.jsx";
import { useGestionInvestigadores } from "../../hooks/investigadorProyectoHooks/useGestionInvestigadores.js";
import { useInvestigadorForm } from "../../hooks/investigadorProyectoHooks/useInvestigadorForm.js";
import InvestigadorForm from "../../components/investigadorProyectoComponents/InvestigadorForm.jsx";
import InvestigadorTable from "../../components/investigadorProyectoComponents/InvestigadorTable.jsx";
import { useState } from "react";
import "./AsignarInvestigador.css";

const AsignarInvestigadores = () => {
    const [proyecto, setProyecto] = useState(null);

    const {
        investigadores,
        investigadorSeleccionado,
        handleEditarInvestigador,
        formRef,
        eliminar,
        guardar,
        limpiarSeleccion,
        roles,           // ← viene del hook, sin useEffect manual
        pageable,
        cambiarPagina,
        total,
        totalPages,
    } = useGestionInvestigadores(proyecto?.codigoProyecto);

    const form = useInvestigadorForm({
        investigadorSeleccionado,
        proyecto,
        investigadoresRegistrados: investigadores,
        onSubmit: guardar,
        isEditing: !!investigadorSeleccionado,
        onClearSelection: limpiarSeleccion,
    });

    const rolesParaAsignar =
        investigadores.some(inv => inv.rolProyecto === "PRINCIPAL") ||
        form.investigadoresForm.some(f => f.rolProyecto?.nombreRolProyecto === "PRINCIPAL");

    return (
        <div className="asignar-page">
            <BotonInicio />
            <div className="asignar-header" ref={formRef}>
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
                        onEdit={handleEditarInvestigador}
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