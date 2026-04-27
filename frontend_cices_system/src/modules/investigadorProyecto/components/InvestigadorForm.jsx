import React from "react";
import InputField from "../../../utils/validaciones/InputField.jsx";
import Select from "react-select";
import { required, fechaMayorIgualQue, fechaMenorIgualQue } from "../../../utils/validaciones/Validators.jsx";

const InvestigadorForm = ({
    investigadoresForm,
    actualizarCampo,
    agregarFila,
    eliminarFila,
    handleSubmit,
    candidatos,
    setFilaBuscando,
    seleccionarInvestigadorSelect,
    isEditing,
    roles,
    rolesParaAsignar,
    onCancel,
    proyecto
}) => {
    const opcionesCandidatos = candidatos.map(inv => ({ value: inv, label: inv.nombreCompleto }));

    return (
        <div className="asignar-contenido">
            <h3>Agregar investigadores</h3>

            <form className="asignar-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {investigadoresForm.map((fila, index) => (
                    <div key={index} className="asignar-fila">
                        <div className="campo-formulario">
                            <label className="label-campo">Investigador</label>
                            <Select
                                className="select-campo"
                                classNamePrefix="select"
                                required
                                placeholder="Buscar investigador..."
                                value={fila.investigador ? { value: fila.investigador, label: fila.investigador.nombreCompleto } : null}
                                options={opcionesCandidatos}
                                onInputChange={(inputValue) => { actualizarCampo(index, "search", inputValue); setFilaBuscando(index); }}
                                onChange={(selectedOption) => seleccionarInvestigadorSelect(index, selectedOption?.value)}
                                isClearable
                                noOptionsMessage={() => "No hay coincidencias"}
                                isSearchable
                                isDisabled={isEditing}
                            />
                        </div>

                        <div className="campo-formulario">
                            <label className="label-campo">Rol</label>
                            <Select
                                className="select-campo"
                                classNamePrefix="select"
                                placeholder="Rol"
                                value={fila.rolProyecto ? { value: fila.rolProyecto, label: fila.rolProyecto.nombreRolProyecto } : null}
                                options={roles.map(r => ({ value: r, label: r.nombreRolProyecto, isDisabled: r.nombreRolProyecto === "PRINCIPAL" && rolesParaAsignar && !isEditing }))}
                                onChange={(selectedOption) => actualizarCampo(index, "rolProyecto", selectedOption?.value)}
                                isSearchable
                                isClearable={false}
                                required
                            />
                        </div>

                        <div className="campo-formulario">
                            <InputField
                                label="Actividad en proyecto"
                                name={`actividad-${index}`}
                                placeholder="Opcional"
                                value={fila.actividadProyecto}
                                onChange={(e) => actualizarCampo(index, "actividadProyecto", e.target.value)}
                                maxLength={500}
                            />
                        </div>

                        <div className="campo-formulario">
                            <InputField
                                label="Fecha de inicio"
                                type="date"
                                name={`fechaInicio-${index}`}
                                value={fila.fechaInicio}
                                min={proyecto?.fechaInicio}
                                max={fila?.fechaFin || proyecto?.fechaFinalizacion}
                                required
                                onChange={(e) => actualizarCampo(index, "fechaInicio", e.target.value)}
                                rules={[ required(), fechaMayorIgualQue(proyecto?.fechaInicio), fechaMenorIgualQue(proyecto?.fechaFinalizacion), fechaMenorIgualQue(fila?.fechaFin) ]}
                            />
                        </div>

                        <div className="campo-formulario">
                            <InputField
                                label="Fecha fin"
                                type="date"
                                name={`fechaFin-${index}`}
                                value={fila.fechaFin}
                                min={fila?.fechaInicio}
                                max={proyecto?.fechaFinalizacion}
                                onChange={(e) => actualizarCampo(index, "fechaFin", e.target.value)}
                                rules={[ fechaMayorIgualQue(proyecto?.fechaInicio), fechaMayorIgualQue(fila?.fechaInicio), fechaMenorIgualQue(proyecto?.fechaFinalizacion) ]}
                            />
                        </div>

                        <div className="acciones-formulario">
                            {isEditing ? (
                                <button type="button" className="btn-danger" onClick={onCancel}>Cancelar</button>
                            ) : (
                                <button type="button" className="btn-danger" onClick={() => eliminarFila(index)}>Eliminar</button>
                            )}
                        </div>
                    </div>
                ))}

                <div className="acciones-principales">
                    <button hidden={isEditing} disabled={isEditing} type="button" className="btn-outline-primary" onClick={agregarFila}>+ Agregar investigador</button>
                    <button type="submit" className="btn-primary">{isEditing ? "Actualizar" : "Guardar"}</button>
                </div>
            </form>
        </div>
    );
};

export default InvestigadorForm;

