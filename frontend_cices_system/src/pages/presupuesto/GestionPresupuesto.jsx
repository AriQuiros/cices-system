import "./Presupuesto.css";
import { useGestionPresupuesto } from "../../hooks/presupuestoHooks/useGestionPresupuesto.js";
import BuscadorProyecto from "../../components/busqueda/BusquedaProyecto.jsx";
import PresupuestoForm from "../../components/presupuestoComponents/PresupuestoForm.jsx";
import PresupuestoList from "../../components/presupuestoComponents/PresupuestoList.jsx";
import PresupuestoResumen from "../../components/presupuestoComponents/PresupuestoResumen.jsx";

function GestionPresupuestos() {
    const {
        proyecto, seleccionarProyecto,
        catalogos,
        existentes, totalElements, totalPages, loadingListado, pageable, cambiarPagina,
        presupuestosForm, isEditing, isPending, cargandoEdicion, resumenEdicion,
        agregarPresupuesto, eliminarPresupuesto,
        handleCampoChange, handleTipoChange, setByPath,
        getCategoriasDisponibles,
        handleIniciarEdicion, formRef, cancelarEdicion,
        handleSubmit,
    } = useGestionPresupuesto();

    return (
        <div className="registro-presupuesto-page">
            <div className="registro-presupuesto-card">

                <h2 className="registro-presupuesto-title">Gestión de Presupuestos</h2>

                <div className="registro-presupuesto-search">
                    <BuscadorProyecto onSelect={seleccionarProyecto} />
                </div>

                {proyecto && (
                    <div className="registro-presupuesto-content" ref={formRef}>

                        {/* Resumen del presupuesto que se está editando */}
                        {isEditing && resumenEdicion && (
                            <div className="registro-presupuesto-resumen-edicion">
                                <h4>Resumen del presupuesto a editar</h4>
                                <PresupuestoResumen presupuesto={resumenEdicion} />
                            </div>
                        )}

                        {cargandoEdicion ? (
                            <p>Cargando presupuesto...</p>
                        ) : (
                            <PresupuestoForm
                                proyecto={proyecto}
                                catalogos={catalogos}
                                presupuestos={presupuestosForm}
                                isEditing={isEditing}
                                resumenEdicion={resumenEdicion}
                                getCategoriasDisponibles={getCategoriasDisponibles}
                                handleCampoChange={handleCampoChange}
                                handleTipoChange={handleTipoChange}
                                setByPath={setByPath}
                                agregarPresupuesto={agregarPresupuesto}
                                eliminarPresupuesto={eliminarPresupuesto}
                                onSubmit={handleSubmit}
                            />
                        )}

                        <div className="registro-presupuesto-actions">
                            <button
                                className="btn-accion primario"
                                form="formPresupuesto"
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? "Guardando..." : isEditing ? "Actualizar" : "Registrar"}
                            </button>

                            {isEditing && (
                                <button
                                    className="btn-accion secundario"
                                    type="button"
                                    onClick={cancelarEdicion}
                                >
                                    Cancelar edición
                                </button>
                            )}
                        </div>

                        <PresupuestoList
                            presupuestos={existentes}
                            loading={loadingListado}
                            totalElements={totalElements}
                            totalPages={totalPages}
                            page={pageable.page}
                            onPageChange={cambiarPagina}
                            onEditar={handleIniciarEdicion}
                        />

                    </div>
                )}
            </div>
        </div>
    );
}

export default GestionPresupuestos;