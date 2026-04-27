// src/paginas/presupuesto/financiero/ModalBitacora.jsx
import { formatearFechaCR } from "../../../utils/formatoFecha.js";

const ModalBitacora = ({
                           gasto,
                           bitacoraOrdenada,
                           isLoading,
                           onClose
                       }) => {
    if (!gasto) return null;

    return (
        <div className="modal-bitacora-overlay" onClick={onClose}>
            <div
                className="modal-bitacora-contenido"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="modal-bitacora-titulo">Bitácora del gasto</h2>

                {/* ── Gasto actual ── */}
                <h4 className="modal-bitacora-subtitulo">Gasto actual</h4>
                <div className="modal-bitacora-gasto-actual">
                    <p><strong>Descripción:</strong> {gasto.descripcion}</p>
                    <p><strong>Fecha:</strong> {formatearFechaCR(gasto.fechaGasto)}</p>
                    <p><strong>Monto:</strong> ₡{Number(gasto.monto).toLocaleString("es-CR")}</p>
                </div>

                {/* ── Historial de cambios ── */}
                <h4 className="modal-bitacora-subtitulo">Historial de cambios</h4>

                {isLoading ? (
                    <p className="modal-bitacora-info">Cargando historial...</p>
                ) : bitacoraOrdenada.length === 0 ? (
                    <p className="modal-bitacora-info">Este gasto no tiene cambios registrados.</p>
                ) : (
                    bitacoraOrdenada.map((b, i) => {
                        // El valor "nuevo" de cada campo es el valor "viejo" del registro anterior
                        // (más reciente en el orden ya invertido), o el valor actual del gasto
                        // si este es el registro más antiguo (último en el array ordenado desc).
                        const anterior = bitacoraOrdenada[i - 1];

                        return (
                            <div key={i} className="modal-bitacora-entrada">

                                <p className="modal-bitacora-meta">
                                    {formatearFechaCR(b.bitacora?.fecha)}
                                    {b.bitacora?.nombreUsuario && (
                                        <> — <strong>{b.bitacora.nombreUsuario}</strong></>
                                    )}
                                </p>

                                <div className="modal-bitacora-cambios">

                                    {b.montoOld != null && (
                                        <p>
                                            <strong>Monto: </strong>
                                            <span className="modal-bitacora-old">
                                                ₡{Number(b.montoOld).toLocaleString("es-CR")}
                                            </span>
                                            {" → "}
                                            <span className="modal-bitacora-new">
                                                ₡{Number(anterior?.montoOld ?? gasto.monto).toLocaleString("es-CR")}
                                            </span>
                                        </p>
                                    )}

                                    {b.fechaGastoOld && (
                                        <p>
                                            <strong>Fecha: </strong>
                                            <span className="modal-bitacora-old">
                                                {formatearFechaCR(b.fechaGastoOld)}
                                            </span>
                                            {" → "}
                                            <span className="modal-bitacora-new">
                                                {formatearFechaCR(anterior?.fechaGastoOld ?? gasto.fechaGasto)}
                                            </span>
                                        </p>
                                    )}

                                    {b.descripcionOld && (
                                        <p>
                                            <strong>Descripción: </strong>
                                            <span className="modal-bitacora-old">
                                                {b.descripcionOld}
                                            </span>
                                            {" → "}
                                            <span className="modal-bitacora-new">
                                                {anterior?.descripcionOld ?? gasto.descripcion}
                                            </span>
                                        </p>
                                    )}

                                </div>
                            </div>
                        );
                    })
                )}

                <button className="modal-bitacora-cerrar" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ModalBitacora;