import { formatearFechaCR } from "../../utils/formatoFechaCR.js";

const TENDENCIA_ICON = {
    subio: { icono: "↑", clase: "modal-bitacora-new",     texto: "Aumento" },
    bajo:  { icono: "↓", clase: "modal-bitacora-bajo",     texto: "Disminución" },
    igual: { icono: "→", clase: "modal-bitacora-neutro",  texto: "Sin cambio" },
};

const ModalBitacoraPresupuesto = ({
                                      presupuesto,
                                      bitacoraConTendencia,
                                      isLoading,
                                      onClose
                                  }) => {
    if (!presupuesto) return null;

    const esHoras      = presupuesto.tipoPresupuesto === "Horas";
    const esFinanciero = presupuesto.tipoPresupuesto === "Financiero";

    return (
        <div className="modal-bitacora-overlay" onClick={onClose}>
            <div className="modal-bitacora-contenido" onClick={e => e.stopPropagation()}>

                <h2 className="modal-bitacora-titulo">Bitácora del presupuesto</h2>

                {/* ── Estado actual ── */}
                <h4 className="modal-bitacora-subtitulo">Estado actual</h4>
                <div className="modal-bitacora-gasto-actual">
                    <p><strong>Tipo:</strong> {presupuesto.tipoPresupuesto}</p>
                    <p><strong>Categoría:</strong> {presupuesto.categoria}</p>
                    <p><strong>Fecha asignación:</strong> {formatearFechaCR(presupuesto.fechaAsignacion)}</p>

                    {esFinanciero && (
                        <p>
                            <strong>Monto asignado: </strong>
                            ₡{Number(presupuesto.montoAsignado || 0).toLocaleString("es-CR")}
                        </p>
                    )}

                    {esHoras && (
                        <p>
                            <strong>Horas totales: </strong>
                            {Number(presupuesto.cantidadHorasMes || 0) * Number(presupuesto.cantidadMeses || 0)}
                            {" "}({presupuesto.cantidadHorasMes} h/mes × {presupuesto.cantidadMeses} meses)
                        </p>
                    )}
                </div>

                {/* ── Historial ── */}
                <h4 className="modal-bitacora-subtitulo">Historial de cambios</h4>

                {isLoading ? (
                    <p className="modal-bitacora-info">Cargando historial...</p>
                ) : bitacoraConTendencia.length === 0 ? (
                    <p className="modal-bitacora-info">Este presupuesto no tiene cambios registrados.</p>
                ) : (
                    bitacoraConTendencia.map((b, i) => {
                        const anterior    = bitacoraConTendencia[i - 1];
                        const { icono, clase, texto } = TENDENCIA_ICON[b.tendencia] || TENDENCIA_ICON.igual;

                        return (
                            <div key={i} className="modal-bitacora-entrada">

                                {/* Meta: fecha + usuario + tendencia */}
                                <p className="modal-bitacora-meta">
                                    {formatearFechaCR(b.bitacora?.fecha)}
                                    {b.bitacora?.nombreUsuario && (
                                        <> — <strong>{b.bitacora.nombreUsuario}</strong></>
                                    )}
                                    <span className={`modal-bitacora-tendencia ${clase}`}>
                                        {" "}{icono} {texto}
                                    </span>
                                </p>

                                <div className="modal-bitacora-cambios">

                                    {/* FINANCIERO: monto */}
                                    {esFinanciero && b.montoAsignadoOld != null && (
                                        <p>
                                            <strong>Monto: </strong>
                                            <span className="modal-bitacora-old">
                                                ₡{Number(b.montoAsignadoOld).toLocaleString("es-CR")}
                                            </span>
                                            {" → "}
                                            <span className="modal-bitacora-new">
                                                ₡{Number(
                                                anterior?.montoAsignadoOld ?? presupuesto.montoAsignado
                                            ).toLocaleString("es-CR")}
                                            </span>
                                        </p>
                                    )}

                                    {/* HORAS: horas/mes y meses por separado */}
                                    {esHoras && b.cantidadHorasMesOld != null && (
                                        <p>
                                            <strong>Horas/mes: </strong>
                                            <span className="modal-bitacora-old">
                                                {b.cantidadHorasMesOld}
                                            </span>
                                            {" → "}
                                            <span className="modal-bitacora-new">
                                                {anterior?.cantidadHorasMesOld ?? presupuesto.cantidadHorasMes}
                                            </span>
                                        </p>
                                    )}

                                    {esHoras && b.cantidadMesesOld != null && (
                                        <p>
                                            <strong>Meses: </strong>
                                            <span className="modal-bitacora-old">
                                                {b.cantidadMesesOld}
                                            </span>
                                            {" → "}
                                            <span className="modal-bitacora-new">
                                                {anterior?.cantidadMesesOld ?? presupuesto.cantidadMeses}
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

export default ModalBitacoraPresupuesto;