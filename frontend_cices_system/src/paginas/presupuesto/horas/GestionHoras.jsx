import PresupuestoResumen from "../../../components/ui/Presupuesto/PresupuestoResumen.jsx";
import HoraForm from "../../../modules/horas/components/HoraForm.jsx";
import { HoraTable } from "../../../modules/horas/components/HoraTable.jsx";
import { useHoraForm } from "../../../modules/horas/hooks/useHoraForm.js";
import { useGestionHoras } from "../../../modules/horas/hooks/useGestionHoras.js";
import BuscadorProyecto from "../../../components/BusquedaProyecto.jsx";
import { useFlujoPresupuesto } from "../../../modules/presupuesto/hooks/useFlujoPresupuesto.js";
import SelectorPresupuesto from "../../../components/ui/Presupuesto/SelectorPresupuesto.jsx";
import { Pagination } from "../../../components/ui/Pagination.jsx";
import { fetchTiposCatalogo } from "../../../services/CatalogoService.js";
import { useEffect, useState } from "react";

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
    // CATÁLOGOS
    // =========================
    const [tipos, setTipos] = useState({});

    useEffect(() => {
        if (!proyecto) {
            setTipos({});
            return;
        }
        fetchTiposCatalogo("", ["MODALIDAD_HORARIA", "TIPO_HORAS"])
            .then(res => setTipos(res || {}));
        // ver punto 7 sobre cómo obtener investigadores
    }, [proyecto]);

    // =========================
    // HORAS
    // =========================
    const {
        horas,
        horaSeleccionada,
        seleccionarParaEditar,
        eliminar,
        guardar,
        limpiarSeleccion,
        pageable,
        cambiarPagina,
        total,
        totalPages,
        investigadores
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

            <BuscadorProyecto principal={true} onSelect={seleccionarProyecto} />

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

                    <HoraTable
                        data={horas}
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

export default GestionHoras;