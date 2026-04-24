import InputField from "../../../utils/validaciones/InputField.jsx";
import {
    required,
    maxLength,
    min,
    max,
    fechaMayorIgualQue,
    fechaMenorIgualQue,
} from "../../../utils/validaciones/Validators.jsx";

const hoy = new Date();
const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;

const GastoForm = ({
                       gastosForm,
                       actualizarCampo,
                       agregarFila,
                       eliminarFila,
                       handleSubmit,

                       isEditing,
                       montoMax,
                       disponibleDinamico,
                       totalFormulario,

                       presupuesto,
                       onCancel
                   }) => {

    return (
        <div className="gestion-gastos-form-container">

            {/* ── INFO DINÁMICA ── */}
            <div className="gestion-gastos-total-form">
                <p>
                    <strong>
                        {isEditing ? "Monto editado:" : "Nuevos gastos:"}
                    </strong>{" "}
                    ₡{totalFormulario.toLocaleString("es-CR")}
                </p>
            </div>

            <p className={disponibleDinamico < 0
                ? "presupuesto-restante negativo"
                : "presupuesto-restante"}>
                <strong>Restante: </strong>
                ₡{disponibleDinamico.toLocaleString("es-CR")}
            </p>

            {/* ── FORM ── */}
            <form
                className="gestion-gastos-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >

                {gastosForm.map((gasto, index) => (
                    <div key={index} className="gasto-form-item">

                        <div className="row">

                            <InputField
                                label="Monto (₡)"
                                type="number"
                                name={`monto-${index}`}
                                placeholder="Monto"
                                value={gasto.monto}
                                onChange={(e) =>
                                    actualizarCampo(index, "monto", e.target.value)
                                }
                                rules={[
                                    required(),
                                    min(1),
                                    max(montoMax)
                                ]}
                                required
                                min={1}
                                max={montoMax}
                            />

                            <InputField
                                label="Fecha del gasto"
                                type="date"
                                name={`fecha-${index}`}
                                placeholder="Fecha del gasto"
                                value={gasto.fechaGasto}
                                onChange={(e) =>
                                    actualizarCampo(index, "fechaGasto", e.target.value)
                                }
                                rules={[
                                    required(),
                                    fechaMayorIgualQue(presupuesto.fechaAsignacion),
                                    fechaMenorIgualQue(
                                        fechaHoy,
                                        `No puede ser mayor a ${fechaHoy}`
                                    )
                                ]}
                                required
                                min={presupuesto.fechaAsignacion}
                                max={fechaHoy}
                            />

                            <InputField
                                label="Descripción"
                                type="text"
                                name={`descripcion-${index}`}
                                placeholder="Descripción del gasto"
                                value={gasto.descripcion}
                                onChange={(e) =>
                                    actualizarCampo(index, "descripcion", e.target.value)
                                }
                                rules={[
                                    required(),
                                    maxLength(254)
                                ]}
                                required
                                maxLength={254}
                            />

                        </div>

                        {/* ── BOTONES POR FILA ── */}
                        {isEditing ? (
                            <button
                                type="button"
                                className="btn-accion secundario"
                                onClick={() => { if (typeof onCancel === 'function') onCancel(); }}
                            >
                                Cancelar edición
                            </button>
                        ) : (
                            gastosForm.length > 1 && (
                                <button
                                    type="button"
                                    className="btn-accion peligro"
                                    onClick={() => eliminarFila(index)}
                                >
                                    Eliminar fila
                                </button>
                            )
                        )}

                    </div>
                ))}

                {/* ── ACCIONES ── */}
                <div className="gestion-gastos-actions">

                    {!isEditing && (
                        <button
                            type="button"
                            className="btn-accion"
                            onClick={agregarFila}
                        >
                            + Agregar gasto
                        </button>
                    )}

                    <button
                        type="submit"
                        className="btn-accion primario"
                    >
                        {isEditing ? "Actualizar gasto" : "Guardar gastos"}
                    </button>

                </div>

            </form>
        </div>
    );
};

export default GastoForm;