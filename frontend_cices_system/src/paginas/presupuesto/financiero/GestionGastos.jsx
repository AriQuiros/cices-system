import PresupuestoResumen from "../../../components/ui/Presupuesto/PresupuestoResumen.jsx";
import GastoForm from "../../../modules/gasto/components/GastoForm.jsx";
import {GastoTable} from "../../../modules/gasto/components/GastoTable.jsx";
import {useGastoForm} from "../../../modules/gasto/hooks/useGastoForm.js";
import {useGestionGastos} from "../../../modules/gasto/hooks/useGestionGastos.js";

import BuscadorProyecto from "../../../components/BusquedaProyecto.jsx";
import {useFlujoPresupuesto} from "../../../modules/presupuesto/hooks/useFlujoPresupuesto.js";
import SelectorPresupuesto from "../../../components/ui/Presupuesto/SelectorPresupuesto.jsx";
import {Pagination} from "../../../components/ui/Pagination.jsx";

const GestionGastos = () => {

    // =========================
    // FLUJO PROYECTO → PRESUPUESTO
    // =========================
    const {
        proyecto,
        seleccionarProyecto,

        presupuestos,
        loadingPresupuestos,

        presupuestoId,
        seleccionarPresupuesto,

        presupuesto,
        setBusquedaPresupuesto
    } = useFlujoPresupuesto("Financiero");

    // =========================
    // GASTOS
    // =========================
    const {
        gastos,
        gastoSeleccionado,
        seleccionarParaEditar,
        eliminar,
        guardar,
        limpiarSeleccion,
        pageable,
        cambiarPagina,
        total,
        totalPages
    } = useGestionGastos(presupuestoId);

    // =========================
    // FORM
    // =========================
    const {
        gastosForm,
        actualizarCampo,
        agregarFila,
        eliminarFila,
        handleSubmit,

        totalFormulario,
        disponibleDinamico,
        montoMax,
        isEditing
    } = useGastoForm({
        gastoSeleccionado,
        presupuesto,
        onSubmit: guardar
    });
    // =========================
    // RENDER
    // =========================
    return (
        <div className="gestion-gastos-page">

            <BuscadorProyecto
                principal={true}
                onSelect={seleccionarProyecto}
            />

            {proyecto && (
                <SelectorPresupuesto
                    presupuestos={presupuestos}
                    loading={loadingPresupuestos}
                    onSelect={seleccionarPresupuesto}
                    onBuscar={setBusquedaPresupuesto}
                />
            )}

            {proyecto && !loadingPresupuestos && presupuestos.length === 0 && (
                <p>No hay presupuestos financieros para este proyecto</p>
            )}

            {presupuesto && (
                <>
                    <PresupuestoResumen presupuesto={presupuesto} />

                    <GastoForm
                        gastosForm={gastosForm}
                        actualizarCampo={actualizarCampo}
                        agregarFila={agregarFila}
                        eliminarFila={eliminarFila}
                        handleSubmit={handleSubmit}

                        isEditing={isEditing}
                        montoMax={montoMax}
                        disponibleDinamico={disponibleDinamico}
                        totalFormulario={totalFormulario}

                        presupuesto={presupuesto}
                        onCancel={limpiarSeleccion}
                    />

                    <GastoTable
                        gastos={gastos}
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

export default GestionGastos;