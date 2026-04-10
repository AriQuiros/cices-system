import React, { useState } from "react";
import Select from "react-select";
import InputField from "../../../utils/validaciones/InputField.jsx";
import {fechaMayorIgualQue, fechaMenorIgualQue, required} from "../../../utils/validaciones/Validators.jsx";
import "../AsignarInvestigador.css";

const hoy = () => {
    return new Date().toISOString().split("T")[0];
};

export default function PermisoProyectoForm({   proyectoSeleccionado,
                                                investigadoresProyecto = [],
                                                onGuardar
                                            }) {

    const [form, setForm] = useState({
        investigador: null,
        fechaInicio: hoy(),
        fechaFin: ""
    });

    const actualizarCampo = (campo, valor) => {
        setForm(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.investigador) {
            alert("Seleccione un investigador");
            return;
        }

        const payload = {
            id: null,
            investigadorProyectoDTO: form.investigador,
            fechaInicio: form.fechaInicio,
            fechaFin: form.fechaFin || null
        };

        onGuardar(payload);

        // reset
        setForm({
            investigador: null,
            fechaInicio: hoy(),
            fechaFin: ""
        });
    };

    return (
        <form className="asignar-form" onSubmit={handleSubmit}>

            <div className="asignar-fila">

                <div className="campo-formulario">
                    <label className="label-campo">Investigador</label>
                    <Select
                        classNamePrefix="select"
                        required
                        placeholder="Seleccione investigador"
                        value={
                            form.investigador
                                ? {
                                    label: form.investigador.nombreInvestigador,
                                    value: form.investigador.id
                                }
                                : null
                        }
                        options={investigadoresProyecto.map(i => ({
                            label: i.nombreInvestigador,
                            value: i.id
                        }))}
                        onChange={(option) =>
                            actualizarCampo(
                                "investigador",
                                investigadoresProyecto.find(i => i.id === option.value)
                            )
                        }
                    />
                </div>

                <div className="campo-formulario">
                    <InputField
                        label="Fecha inicio"
                        type="date"
                        name="fechaInicio"
                        value={form.fechaInicio}
                        onChange={(e) => actualizarCampo("fechaInicio", e.target.value)}
                        rules={[
                            required(),
                            fechaMayorIgualQue(proyectoSeleccionado.fechaInicio),
                            fechaMenorIgualQue(proyectoSeleccionado.fechaFinalizacion)
                        ]}
                        required
                        min={proyectoSeleccionado.fechaInicio}
                        max={form.fechaFin || proyectoSeleccionado.fechaFinalizacion}
                    />
                </div>

                <div className="campo-formulario">
                    <InputField
                        label="Fecha fin (opcional)"
                        type="date"
                        name="fechaFin"
                        value={form.fechaFin}
                        onChange={(e) => actualizarCampo("fechaFin", e.target.value)}
                        rules={[
                            fechaMayorIgualQue(form.fechaInicio),
                            fechaMenorIgualQue(proyectoSeleccionado.fechaFinalizacion)
                        ]}
                        min={proyectoSeleccionado.fechaInicio || form.fechaFin}
                        max={proyectoSeleccionado.fechaFinalizacion}
                    />
                </div>

            </div>

            <button className="btn-primary" type="submit">
                Otorgar permiso
            </button>

        </form>
    );
}