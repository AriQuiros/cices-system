import PresupuestoResumen from "../../components/presupuestoComponents/PresupuestoResumen.jsx";
import HoraForm from "../../components/horaComponents/HoraForm.jsx";
import { HoraTable } from "../../components/horaComponents/HoraTable.jsx";
import { useHoraForm } from "../../hooks/horaHooks/useHoraForm.js";
import { useGestionHoras } from "../../hooks/horaHooks/useGestionHoras.js";
import BuscadorProyecto from "../../components/busqueda/BusquedaProyecto.jsx";
import { useFlujoPresupuesto } from "../../hooks/presupuestoHooks/useFlujoPresupuesto.js";
import SelectorPresupuesto from "../../components/presupuestoComponents/SelectorPresupuesto.jsx";
import { Pagination } from "../../components/shared/Pagination.jsx";

import "./GestionHoras.css";

const GestionHoras = () => {

    // =========================
    // FLUJO PROYECTO → PRESUPUESTO (tipo HORAS)
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
    } = useFlujoPresupuesto("Horas");  // ← pasar tipo para filtrar solo presupuestos de horas

    // =========================
    // HORAS
    // =========================
    const {
        horas,
        horaSeleccionada,
        handleEditarHora,
        formRef,
        eliminar,
        guardar,
        limpiarSeleccion,
        pageable,
        cambiarPagina,
        total,
        totalPages,
        investigadores,
        tipos
    } = useGestionHoras(presupuestoId, proyecto?.codigoProyecto);

    // =========================
    // FORM
    // =========================
    const {
        horasForm,
        actualizarCampo,
        agregarFila,
        eliminarFila,
        handleSubmit,
        totalFormulario,
        disponibleDinamico,
        maxHoras,
        calcularMesesParticipacion,
        isEditing
    } = useHoraForm({
        horaSeleccionada,
        presupuesto,
        onSubmit: guardar
    });

    // =========================
    // RENDER — idéntico en estructura a GestionGastos
    // =========================
    return (
        <div className="gestion-horas-page">

            <div className="gestion-gastos-title">
                <h2> Gestión de asignación de horas</h2>
            </div>

            <div  ref={formRef}>
            <BuscadorProyecto onSelect={seleccionarProyecto} />
            </div>

            {proyecto && (
                <SelectorPresupuesto
                    presupuestos={presupuestos}
                    loading={loadingPresupuestos}
                    onSelect={seleccionarPresupuesto}
                    onBuscar={setBusquedaPresupuesto}
                />
            )}

            {proyecto && !loadingPresupuestos && presupuestos.length === 0 && (
                <p>No hay presupuestos de horas para este proyecto</p>
            )}

            {presupuesto && (
                <>
                <div className="gestion-horas-content">
                    <div className="gestion-horas-card">

                    <PresupuestoResumen presupuesto={presupuesto} />
                    <HoraForm
                        horasForm={horasForm}
                        actualizarCampo={actualizarCampo}
                        agregarFila={agregarFila}
                        eliminarFila={eliminarFila}
                        handleSubmit={handleSubmit}

                        isEditing={isEditing}
                        maxHoras={maxHoras}
                        disponibleDinamico={disponibleDinamico}
                        totalFormulario={totalFormulario}

                        presupuesto={presupuesto}
                        horaSeleccionada={horaSeleccionada}
                        investigadores={investigadores}
                        horasRegistradas={horas}
                        calcularMesesParticipacion={calcularMesesParticipacion}
                        tipos={tipos}
                        onCancel={limpiarSeleccion}
                    />
                    </div>

                    <HoraTable
                        data={horas}
                        onEdit={handleEditarHora}
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
    );
};

export default GestionHoras;