import InputField from "../../utils/ui/InputField.jsx";
import Select from "react-select";
import {
    required,
    min,
    max
} from "../../validators/Validators.jsx";
import {formatearNumeroCR} from "../../utils/formatoNumeroCR.js";

const HoraForm = ({
    horasForm,
    actualizarCampo,
    agregarFila,
    eliminarFila,
    handleSubmit,

    horaSeleccionada,
    isEditing,
    disponibleDinamico,
    totalFormulario,

    investigadores,
    horasRegistradas,
    calcularMesesParticipacion,
    tipos,
    onCancel
}) => {


    return (
        <div className="gestion-horas-form-container">

            <div className="gestion-hastos-total-form">
                <p>
                    <strong>{isEditing ? "Horas editadas:" : "Nuevas horas:"}</strong> {totalFormulario}
                </p>
            </div>

            <p className={disponibleDinamico < 0 ? "presupuesto-restante negativo" : "presupuesto-restante"}>
                <strong>Restante: </strong>
                {formatearNumeroCR(disponibleDinamico)}
            </p>

            <form className="gestion-horas-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {horasForm.map((h, index) => (
                    <div key={index} className="fila-horas">

                        <div className="campo-formulario">

                            <label className="label-campo">Investigador</label>
                            <Select
                                required
                                placeholder="Seleccione investigador"
                                value={
                                    h.investigador
                                        ? {
                                            label: h.investigador.nombreCompleto ?? h.investigador.nombreInvestigador,
                                            value: h.investigador.id
                                        }
                                        : null
                                }
                                options={investigadores
                                    .filter(i =>
                                        horaSeleccionada?.investigador?.id === i.id ||
                                        (
                                            !horasRegistradas.some(hr => hr.idInvestigadorProyecto === i.id) &&
                                            !horasForm.some((f, idx) => idx !== index && f.investigador?.id === i.id)
                                        )
                                    )
                                    .map(i => ({
                                        label: i.nombreCompleto,
                                        value: i.id
                                    }))
                                }
                                onChange={(option) => actualizarCampo(index, "investigador", investigadores.find(i => i.id === option.value))}
                                className="select-campo"
                                classNamePrefix="select"
                                isDisabled={isEditing}
                            />
                        </div>

                        <div className="campo-formulario">
                            <label className="label-campo">Modalidad</label>
                            <Select
                                required
                                placeholder="Modalidad"
                                value={h.modalidad ? { label: h.modalidad.despliegue, value: h.modalidad.valor } : null}
                                options={tipos["MODALIDAD_HORARIA"]?.map(t => ({ label: t.despliegue, value: t.valor }))}
                                onChange={(option) => actualizarCampo(index, "modalidad", tipos["MODALIDAD_HORARIA"]?.find(t => t.valor === option.value))}
                                className="select-campo"
                                classNamePrefix="select"
                            />
                        </div>

                        <div className="campo-formulario">
                            <InputField
                                label="Horas por mes"
                                type="number"
                                name={`horasMes-${index}`}
                                placeholder="Horas mes"
                                value={h.cantidadHorasMes}
                                onChange={(e) => actualizarCampo(index, "cantidadHorasMes", e.target.value)}
                                rules={[required(), min(1), max(h.modalidad?.valor === "REGIMEN POR TIEMPO" ? 40 : 20)]}
                                required
                                min={1}
                                max={h.modalidad?.valor === "REGIMEN POR TIEMPO" ? 40 : 20}
                            />
                        </div>

                        <div className="campo-formulario">
                            <InputField
                                label="Cantidad de meses"
                                type="number"
                                name={`meses-${index}`}
                                placeholder="Meses"
                                value={h.cantidadMeses}
                                onChange={(e) => actualizarCampo(index, "cantidadMeses", e.target.value)}
                                rules={[required(), min(1), max(calcularMesesParticipacion(h.investigador))]}   // ← AGREGAR max(maxMeses)
                                required
                                min={1}
                                max={calcularMesesParticipacion(h.investigador)}                                 // ← AGREGAR
                            />
                        </div>

                        <div className="acciones-formulario">
                            {isEditing ? (
                                <button type="button" className="btn-danger" onClick={() => onCancel && onCancel()}>Cancelar</button>
                            ) : (
                                <button type="button" className="btn-danger" onClick={() => eliminarFila(index)}>Eliminar</button>
                            )}
                        </div>

                    </div>
                ))}

                <div className="gestion-horas-actions">
                    {!isEditing && (
                        <button type="button" className="btn-outline-primary" onClick={agregarFila}>+ Agregar horas</button>
                    )}

                    <button type="submit" className="btn-primary">{isEditing ? "Actualizar horas" : "Guardar horas"}</button>
                </div>

            </form>
        </div>
    );
};

export default HoraForm;

