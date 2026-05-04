import PresupuestoResumen from "../../components/presupuestoComponents/PresupuestoResumen.jsx";
import GastoForm from "../../components/gastoComponents/GastoForm.jsx";
import {GastoTable} from "../../components/gastoComponents/GastoTable.jsx";
import {useGastoForm} from "../../hooks/gastoHooks/useGastoForm.js";
import {useGestionGastos} from "../../hooks/gastoHooks/useGestionGastos.js";

import BuscadorProyecto from "../../components/busqueda/BusquedaProyecto.jsx";
import {useFlujoPresupuesto} from "../../hooks/presupuestoHooks/useFlujoPresupuesto.js";
import SelectorPresupuesto from "../../components/presupuestoComponents/SelectorPresupuesto.jsx";
import {Pagination} from "../../components/shared/Pagination.jsx";

import "./GestionGastos.css";

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
        handleEditarGasto,
        formRef,
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
            <div className="gestion-gastos-card">

            <div ref={formRef}>
                <h2 className="gestion-gastos-title">Gestión de Gastos</h2>
            </div>

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
                    <div className="gestion-gastos-content">
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
                        onEdit={handleEditarGasto}
                        onDelete={eliminar}
                    />

                    <Pagination
                        page={pageable.page}
                        totalPages={totalPages}
                        totalElements={total}
                        onPageChange={cambiarPagina}
                    />
                    </div>
                </>
            )}
            </div>
        </div>
    );
};

export default GestionGastos;