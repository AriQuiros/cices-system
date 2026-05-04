import { Pagination } from "../shared/Pagination.jsx";
import { formatearFechaCR } from "../../utils/formatoFechaCR.js";
import ModalBitacoraPresupuesto from "../../pages/presupuesto/ModalBitacoraPresupuesto.jsx";
import { useModalBitacoraPresupuesto } from "../../hooks/presupuestoHooks/useModalBitacoraPresupuesto.js";
import {formatearMonedaCR, formatearNumeroCR} from "../../utils/formatoNumeroCR.js";

function PresupuestoList({
                             presupuestos = [],
                             loading,
                             totalElements,
                             totalPages,
                             page,
                             onPageChange,
                             onEditar
                         }) {
    const {
        modalAbierto,
        presupuestoSeleccionado,
        bitacoraConTendencia,
        isLoading: loadingBitacora,
        abrirModal,
        cerrarModal,
    } = useModalBitacoraPresupuesto();

    if (loading) return <p>Cargando presupuestos...</p>;

    return (
        <div className="presupuesto-list">
            <h3 className="presupuesto-list-title">
                Presupuestos del proyecto ({totalElements})
            </h3>

            {presupuestos.length === 0 && (
                <p className="presupuesto-empty">No hay presupuestos registrados</p>
            )}

            {presupuestos.map((p) => (
                <div key={p.id} className="presupuesto-list-item">
                    <div className="presupuesto-list-item-content">
                        <p><b>Tipo:</b> {p.tipoPresupuesto || "-"}</p>
                        <p><b>Categoría:</b> {p.categoria || "-"}</p>
                        <p><b>Fecha asignación:</b> {formatearFechaCR(p.fechaAsignacion)}</p>
                        <p><b>Descripción:</b> {p.descripcion || "-"}</p>

                        {p.tipoPresupuesto === "Financiero" && (
                            <>
                                <p><b>Fuente:</b> {p.fuenteFinanciamiento || "-"}</p>
                                <p><b>Monto:</b> {formatearMonedaCR(p.montoAsignado )|| 0}</p>
                                {p.resumen && (
                                    <>
                                        <p><b>Usado:</b> {formatearMonedaCR(p.resumen.totalUsado) || 0}</p>
                                        <p><b>Disponible:</b> {formatearMonedaCR(p.resumen.disponible) || 0}</p>
                                    </>
                                )}
                            </>
                        )}

                        {p.tipoPresupuesto === "Horas" && (
                            <>
                                <p><b>Horas/mes:</b> {p.cantidadHorasMes ?? "-"} × {p.cantidadMeses ?? "-"} meses</p>
                                {p.resumen && (
                                    <>
                                        <p><b>Horas asignadas:</b> {formatearNumeroCR(p.resumen.totalAsignado) || 0}</p>
                                        <p><b>Horas usadas:</b> {formatearNumeroCR(p.resumen.totalUsado) || 0}</p>
                                        <p><b>Disponibles:</b> {formatearNumeroCR(p.resumen.disponible) || 0}</p>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* ── Acciones ── */}
                    <div className="presupuesto-list-item-actions">
                        <button
                            className="btn-accion secundario"
                            type="button"
                            onClick={() => onEditar(p)}
                        >
                            Editar
                        </button>
                        <button
                            className="btn-accion"
                            type="button"
                            onClick={() => abrirModal(p)}
                        >
                            Bitácora
                        </button>
                    </div>
                </div>
            ))}

            <Pagination
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                onPageChange={onPageChange}
            />

            {modalAbierto && (
                <ModalBitacoraPresupuesto
                    presupuesto={presupuestoSeleccionado}
                    bitacoraConTendencia={bitacoraConTendencia}
                    isLoading={loadingBitacora}
                    onClose={cerrarModal}
                />
            )}
        </div>
    );
}

export default PresupuestoList;