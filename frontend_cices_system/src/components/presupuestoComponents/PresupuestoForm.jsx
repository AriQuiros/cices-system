import { CodigoDTO } from "../../modelos/codigoDTO.jsx";
import InputField from "../../utils/ui/InputField.jsx";
import {
    required, maxLength, min, max,
    fechaMayorIgualQue, fechaMenorIgualQue
} from "../../validators/Validators.jsx";
import {formatearNumeroCR} from "../../utils/formatoNumeroCR.js";

function PresupuestoForm({
                             proyecto,
                             catalogos,
                             presupuestos,
                             isEditing,
                             resumenEdicion,
                             getCategoriasDisponibles,
                             handleCampoChange,
                             handleTipoChange,
                             setByPath,
                             agregarPresupuesto,
                             eliminarPresupuesto,
                             onSubmit
                         }) {
    const totalUsado = resumenEdicion?.resumen?.totalUsado || 0;
    const minMonto = Math.max(1, totalUsado);
    return (
        <form
            id="formPresupuesto"
            className="presupuesto-form"
            onSubmit={onSubmit}
        >
            {(presupuestos || []).map((p, idx) => {
                const categoriasDisponibles = getCategoriasDisponibles(idx);
                const esFinanciero = p.tipoPresupuesto?.valor === "FINANCIERO";
                const esHoras      = p.tipoPresupuesto?.valor === "HORAS";

                const totalUsado = isEditing
                    ? (resumenEdicion?.resumen?.totalUsado || 0)
                    : 0;

                const horasMes = Number(p.cantidadHorasMes || 0);
                const meses    = Number(p.cantidadMeses || 0);

                const totalHoras = horasMes * meses;
                const errorHoras = isEditing && totalHoras < totalUsado;

                return (
                    <div key={idx} className="presupuesto-form-item">
                        <h4>Presupuesto {idx + 1}</h4>

                        {/* TIPO */}
                        <select
                            className="presupuesto-select"
                            required
                            disabled={isEditing}
                            value={p.tipoPresupuesto?.valor || ""}
                            onChange={(e) => {
                                const tipo = (catalogos["TIPO_PRESUPUESTO"] || [])
                                    .find(t => t.valor === e.target.value);
                                handleTipoChange(idx, tipo || { ...CodigoDTO });
                            }}
                        >
                            <option value="">Tipo presupuesto</option>
                            {(catalogos["TIPO_PRESUPUESTO"] || []).map(op => (
                                <option key={op.id} value={op.valor}>{op.despliegue}</option>
                            ))}
                        </select>

                        <button
                            className="btn-accion peligro"
                            type="button"
                            hidden={isEditing}
                            onClick={() => eliminarPresupuesto(idx)}
                        >
                            Eliminar
                        </button>

                        {p.tipoPresupuesto?.valor && (
                            <div className="presupuesto-form-fields">
                                <div className="row">
                                    <InputField
                                        label="Fecha de Asignación"
                                        type="date"
                                        name="fechaAsignacion"
                                        value={p.fechaAsignacion || ""}
                                        min={proyecto.fechaInicio}
                                        max={proyecto.fechaFinalizacion}
                                        onChange={(e) => handleCampoChange(idx, e)}
                                        rules={[
                                            required(),
                                            fechaMayorIgualQue(proyecto.fechaInicio),
                                            fechaMenorIgualQue(proyecto.fechaFinalizacion)
                                        ]}
                                        required
                                    />

                                    {/* CATEGORÍA — deshabilitada para HORAS (se autoasigna) */}
                                    <select
                                        className="presupuesto-select"
                                        required
                                        disabled={esHoras || isEditing}
                                        value={p.categoria?.valor || ""}
                                        onChange={(e) => {
                                            const cat = (catalogos["CATEGORIA_PRESUPUESTO"] || [])
                                                .find(c => c.valor === e.target.value);
                                            setByPath(
                                                ["presupuestos", idx, "categoria"],
                                                cat || { ...CodigoDTO }
                                            );
                                        }}
                                    >
                                        <option value="">Categoría</option>
                                        {categoriasDisponibles.map(cat => (
                                            <option key={cat.id} value={cat.valor}>
                                                {cat.despliegue}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <InputField
                                    label="Descripción"
                                    name="descripcion"
                                    placeholder={esHoras || p.categoria?.valor === "OTRO" ? "Requerida" : "Opcional"}
                                    value={p.descripcion || ""}
                                    onChange={(e) => handleCampoChange(idx, e)}
                                    rules={[maxLength(254)]}
                                />

                                {/* FINANCIERO */}
                                {esFinanciero && (
                                    <div className="row">
                                        <select
                                            className="presupuesto-select"
                                            required
                                            value={p.fuenteFinanciamiento?.valor || ""}
                                            onChange={(e) => {
                                                const f = (catalogos["FUENTE_FINANCIAMIENTO"] || [])
                                                    .find(x => x.valor === e.target.value);
                                                setByPath(
                                                    ["presupuestos", idx, "fuenteFinanciamiento"],
                                                    f || { ...CodigoDTO }
                                                );
                                            }}
                                        >
                                            <option value="">Fuente de financiamiento</option>
                                            {(catalogos["FUENTE_FINANCIAMIENTO"] || []).map(f => (
                                                <option key={f.id} value={f.valor}>{f.despliegue}</option>
                                            ))}
                                        </select>

                                        <InputField
                                            label="Monto (₡)"
                                            type="number"
                                            name="monto"
                                            value={p.monto ?? ""}
                                            onChange={(e) => handleCampoChange(idx, e)}
                                            rules={[required(), min(minMonto), max(9_999_999.99)]}
                                            min={minMonto}
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                )}

                                {/* HORAS */}

                                {esHoras && (
                                    <>
                                        <InputField
                                            label="Horas por mes"
                                            type="number"
                                            name="cantidadHorasMes"
                                            value={p.cantidadHorasMes ?? ""}
                                            onChange={(e) => handleCampoChange(idx, e)}
                                            rules={[required(), min(1), max(999)]}
                                            required
                                        />
                                        <InputField
                                            label="Cantidad de meses"
                                            type="number"
                                            name="cantidadMeses"
                                            value={p.cantidadMeses ?? ""}
                                            onChange={(e) => handleCampoChange(idx, e)}
                                            rules={[required(), min(1), max(999)]}
                                            required
                                        />
                                        <p>Total horas: {formatearNumeroCR(totalHoras)}</p>
                                        {errorHoras && (
                                            <p>
                                                El total de horas no puede ser menor a {formatearNumeroCR(totalUsado)}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}

            <button
                className="btn-accion"
                type="button"
                hidden={isEditing}
                onClick={agregarPresupuesto}
            >
                + Agregar presupuesto
            </button>
        </form>
    );
}

export default PresupuestoForm;