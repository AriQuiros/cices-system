import { useRef, useState } from "react";
import { useProyecto } from "../../context/proyectoCtx/UseProyecto.jsx";
import { CodigoDTO } from "../../modelos/codigoDTO.jsx";
import { notify } from "../../utils/ui/notify.jsx";
import CreatableSelect from "react-select/creatable";
import InputField from "../../utils/ui/InputField.jsx";
import { required, fechaMayorIgualQue, fechaMenorIgualQue } from "../../validators/Validators.jsx";

const MAX_LENGTH = 50;

function ProyectoDatosBasicos({ editable, tiposProyecto, opcionesLineas, cargandoLineas }) {
    const { proyecto, actualizarCampo, setByPath } = useProyecto();
    const inputCodigoRef = useRef(null);
    const [inputValue, setInputValue] = useState("");

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
                        placeholder="prefijo: 840"
                        className="input-field"
                        required
                        maxLength={252}
                        name="codigoProyecto"
                        ref={inputCodigoRef}
                        value={proyecto.codigoProyecto ?? ""}
                        onChange={handleChange}
                        disabled={editable}
                    />
                </div>
                <div className="input-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        placeholder="Nombre del proyecto"
                        className="input-field"
                        required
                        maxLength={252}
                        name="nombreProyecto"
                        value={proyecto.nombreProyecto ?? ""}
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
                            const seleccionado = tiposProyecto.find(t => t.valor === e.target.value);
                            setByPath(["tipoProyecto"], seleccionado || { ...CodigoDTO });
                        }}
                        required
                    >
                        <option value="">Tipo de proyecto</option>
                        {tiposProyecto.map(opcion => (
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
                        isLoading={cargandoLineas}
                        value={
                            proyecto.lineaInvestigacion
                                ? { value: proyecto.lineaInvestigacion, label: proyecto.lineaInvestigacion }
                                : null
                        }
                        inputValue={inputValue}
                        onInputChange={(val, { action }) => {
                            if (action === "input-change") setInputValue(val.slice(0, MAX_LENGTH));
                        }}
                        onChange={(option) => {
                            if (option?.value.length > MAX_LENGTH) {
                                notify.warning(`Máximo ${MAX_LENGTH} caracteres`);
                                return;
                            }
                            actualizarCampo("lineaInvestigacion", option ? option.value.slice(0, MAX_LENGTH) : "");
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
                    <textarea className="input-field" rows="6" required
                              name="descripcion" value={proyecto.descripcion ?? ""} onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Objetivo General:</label>
                    <textarea className="input-field" rows="6" required
                              name="objetivoGeneral" value={proyecto.objetivoGeneral ?? ""} onChange={handleChange} />
                </div>
            </div>

            {/* FECHAS */}
            <div className="form-row">
                <div className="input-group">
                    <InputField label="Fecha de inicio" type="date" name="fechaInicio"
                                value={proyecto.fechaInicio || ""} max={proyecto.fechaFinalizacion}
                                onChange={handleChange}
                                rules={[required(), fechaMenorIgualQue(proyecto?.fechaFinalizacion)]}
                                required />
                </div>
                <div className="input-group">
                    <InputField label="Fecha de finalización" type="date" name="fechaFinalizacion"
                                value={proyecto.fechaFinalizacion || ""} min={proyecto.fechaInicio}
                                onChange={handleChange}
                                rules={[required(), fechaMayorIgualQue(proyecto?.fechaInicio)]}
                                required />
                </div>
            </div>
        </>
    );
}

export default ProyectoDatosBasicos;