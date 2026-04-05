import { useProyecto } from "../../../context/proyectoCtx/UseProyecto.jsx";
import { useTiposCatalogo } from "../../../hooks/useTiposCatalogo.js";
import { useLineas } from "../../../hooks/proyectos/useLineas.jsx";
import { useContext, useRef, useState } from "react";
import { AppContext } from "../../../context/AppContext.jsx";
import { CodigoDTO } from "../../../modelos/CodigoDTO.jsx";
import { notify } from "../../../utils/ui/notify.jsx";
import CreatableSelect from "react-select/creatable";
import InputField from "../../../utils/validaciones/InputField.jsx";

import {
    required,
    fechaMayorIgualQue,
    fechaMenorIgualQue
} from "../../../utils/validaciones/Validators.jsx";

function ProyectoDatosBasicos({editable}) {

    const { proyecto, actualizarCampo, setByPath } = useProyecto();
    const { token } = useContext(AppContext);

    const { tipos } = useTiposCatalogo(token, ["TIPO_PROYECTO"]);
    const { opciones: opcionesLineas } = useLineas();

    const inputCodigoRef = useRef(null);
    const [inputValue, setInputValue] = useState("");
    const MAX_LENGTH = 50;

    const handleChange = (e) => {
        const { name, value } = e.target;
        actualizarCampo(name, value);
    };

    return (
        <>
            {/* CÓDIGO + NOMBRE */}
            <div className="form-row">
                <div className="input-group">
                    <label>Código:</label>
                    <input
                        type="text"
                        placeholder={"prefijo: 840"}
                        className="input-field"
                        required
                        maxLength={252}
                        name="codigoProyecto"
                        ref={inputCodigoRef}
                        value={proyecto.codigoProyecto ?? ''}
                        onChange={handleChange}
                        disabled={editable}
                    />
                </div>

                <div className="input-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        placeholder={"Nombre del proyecto"}
                        className="input-field"
                        required
                        maxLength={252}
                        name="nombreProyecto"
                        value={proyecto.nombreProyecto ?? ''}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* TIPO + LÍNEA */}
            <div className="form-row">
                <div className="input-group">
                    <label>Tipo de proyecto:</label>

                <select
                    className="input-field"
                    value={proyecto.tipoProyecto?.valor || ""}
                    onChange={(e) => {
                        const tipoSeleccionado = (tipos["TIPO_PROYECTO"] || []).find(
                            (t) => t.valor === e.target.value
                        );

                        setByPath(["tipoProyecto"], tipoSeleccionado || { ...CodigoDTO });
                    }}
                    required
                >
                    <option value="">Tipo de proyecto</option>
                    {tipos["TIPO_PROYECTO"]?.map((opcion) => (
                        <option key={opcion.id} value={opcion.valor}>
                            {opcion.despliegue}
                        </option>
                    ))}
                </select>
                </div>
                <div className="input-group">
                    <label>Línea de investigación:</label>

                    <CreatableSelect
                        options={opcionesLineas}
                        value={
                            proyecto.lineaInvestigacion
                                ? {
                                    value: proyecto.lineaInvestigacion,
                                    label: proyecto.lineaInvestigacion
                                }
                                : null
                        }
                        inputValue={inputValue}
                        onInputChange={(val, meta) => {
                            if (meta.action === "input-change") {
                                setInputValue(val.slice(0, MAX_LENGTH));
                            }
                        }}
                        onChange={(selectedOption) => {
                            const value = selectedOption
                                ? selectedOption.value.slice(0, MAX_LENGTH)
                                : "";

                            if (selectedOption?.value.length > MAX_LENGTH) {
                                notify.warning(`Máximo ${MAX_LENGTH} caracteres`);
                                return;
                            }

                            actualizarCampo("lineaInvestigacion", value);
                            setInputValue("");
                        }}
                        placeholder="Área del proyecto"
                        isClearable
                        isSearchable
                    />

                    <small>{inputValue.length}/{MAX_LENGTH}</small>
                </div>
            </div>

            {/* DESCRIPCIÓN + OBJETIVO */}
            <div className="form-row">
                <div className="input-group">
                    <label>Descripción:</label>
                    <textarea
                        className="input-field"
                        rows="6"
                        required
                        name="descripcion"
                        value={proyecto.descripcion ?? ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label>Objetivo General:</label>
                    <textarea
                        className="input-field"
                        rows="6"
                        required
                        name="objetivoGeneral"
                        value={proyecto.objetivoGeneral ?? ''}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* FECHAS */}
            <div className="form-row">
                <div className="input-group">
                    <InputField
                        label="Fecha de inicio"
                        type="date"
                        name="fechaInicio"
                        value={proyecto.fechaInicio || ""}
                        max={proyecto.fechaFinalizacion}
                        onChange={handleChange}
                        rules={[
                            required(),
                            fechaMenorIgualQue(proyecto?.fechaFinalizacion)
                        ]}
                        required
                    />
                </div>

                <div className="input-group">
                    <InputField
                        label="Fecha de finalización"
                        type="date"
                        name="fechaFinalizacion"
                        value={proyecto.fechaFinalizacion || ""}
                        min={proyecto.fechaInicio}
                        onChange={handleChange}
                        rules={[
                            required(),
                            fechaMayorIgualQue(proyecto?.fechaInicio)
                        ]}
                        required
                    />
                </div>
            </div>
        </>
    );
}

export default ProyectoDatosBasicos;