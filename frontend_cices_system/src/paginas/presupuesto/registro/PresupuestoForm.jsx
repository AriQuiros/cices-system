import { CodigoDTO } from "../../../modelos/CodigoDTO.jsx";
import InputField from "../../../utils/validaciones/InputField.jsx";
import {
    required,
    maxLength,
    min,
    max,
    fechaMayorIgualQue,
    fechaMenorIgualQue
} from "../../../utils/validaciones/Validators.jsx";

function PresupuestoForm({proyecto, tipos, presupuestos, presupuestosExistentes = [],
                             setByPath, addPresupuesto, removeByPath, editando, onSubmit
                         }) {

    function getCategoriasUsadasGlobal() {

        const usadas = new Set();

        presupuestosExistentes.forEach(p => {
            if (p.categoria?.valor && p.categoria.valor !== "OTRO") {
                usadas.add(p.categoria.valor);
            }
        });

        presupuestos.forEach(p => {
            if (p.categoria?.valor && p.categoria.valor !== "OTRO") {
                usadas.add(p.categoria.valor);
            }
        });

        return usadas;
    }

    function getCategoriasDisponibles(idx) {

        const usadas = getCategoriasUsadasGlobal();
        const actual = presupuestos[idx]?.categoria?.valor;

        return (tipos["CATEGORIA_PRESUPUESTO"] || []).filter(cat => {

            if (cat.valor === "OTRO") return true;
            if (cat.valor === actual) return true;

            return !usadas.has(cat.valor);
        });
    }

    function handleCampoChange(index, e) {

        const { name, value } = e.target;

        let v = value;

        if (["monto", "cantidadHorasMes", "cantidadMeses"].includes(name)) {
            v = value === "" ? "" : Number(value);
        }

        setByPath(["presupuestos", index, name], v);
    }

    function handleTipoChange(index, tipoObj) {

        setByPath(["presupuestos", index, "tipoPresupuesto"], tipoObj);

        const categoriaHoras = (tipos["CATEGORIA_PRESUPUESTO"] || [])
            .find(c => c.valor === "HORAS BECARIAS");

        if (tipoObj.valor === "FINANCIERO") {

            setByPath(["presupuestos", index, "cantidadHorasMes"], 0);
            setByPath(["presupuestos", index, "cantidadMeses"], 0);

            setByPath(["presupuestos", index, "categoria"], { ...CodigoDTO });

        }

        if (tipoObj.valor === "HORAS") {

            setByPath(["presupuestos", index, "monto"], 0);
            setByPath(["presupuestos", index, "fuenteFinanciamiento"], { ...CodigoDTO });

            setByPath(
                ["presupuestos", index, "categoria"],
                categoriaHoras || { ...CodigoDTO }
            );
        }
    }

    return (

        <form id="formPresupuesto" onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
        }}>

            {(presupuestos || []).map((p, idx) => {

                const categoriasDisponibles = getCategoriasDisponibles(idx);

                return (

                    <div key={idx}>

                        <h4>Presupuesto {idx + 1}</h4>

                        <select required={true} disabled={editando}
                            value={p.tipoPresupuesto?.valor || ""}
                            onChange={(e) => {

                                const tipo = (tipos["TIPO_PRESUPUESTO"] || [])
                                    .find(t => t.valor === e.target.value);

                                handleTipoChange(idx, tipo || { ...CodigoDTO });

                            }}
                        >
                            <option value="">Tipo presupuesto</option>

                            {(tipos["TIPO_PRESUPUESTO"] || []).map(op => (
                                <option key={op.id} value={op.valor}>
                                    {op.despliegue}
                                </option>
                            ))}
                        </select>

                        <button type="button" onClick={() => removeByPath(null, idx)} hidden={editando} disabled={editando}>
                            Eliminar
                        </button>

                        {/* BODY */}
                        {p.tipoPresupuesto?.valor && (

                            <div>

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

                                {/* CATEGORÍA DINÁMICA */}
                                <select required
                                    value={p.categoria?.valor || ""}
                                    onChange={(e) => {

                                        const cat = (tipos["CATEGORIA_PRESUPUESTO"] || [])
                                            .find(c => c.valor === e.target.value);

                                        setByPath(
                                            ["presupuestos", idx, "categoria"],
                                            cat || { ...CodigoDTO }
                                        );

                                    }}
                                    disabled={p.tipoPresupuesto.valor === "HORAS" || editando}
                                >

                                    <option value="">Categoría</option>

                                    {categoriasDisponibles.map(cat => (

                                        <option key={cat.id} value={cat.valor}>
                                            {cat.despliegue}
                                        </option>

                                    ))}

                                </select>

                                <InputField
                                    label="Descripción"
                                    name="descripcion"
                                    placeholder=
                                        {(p.tipoPresupuesto.valor === "HORAS" || p.categoria.valor === "OTRO")?"Requerido":"Opcional"}
                                    value={p.descripcion || ""}
                                    onChange={(e) => handleCampoChange(idx, e)}
                                    rules={[maxLength(254)]}
                                />

                                {/* FINANCIERO */}
                                {p.tipoPresupuesto.valor === "FINANCIERO" && (

                                    <>

                                        <select required
                                            value={p.fuenteFinanciamiento?.valor || ""}
                                            onChange={(e) => {

                                                const f = (tipos["FUENTE_FINANCIAMIENTO"] || [])
                                                    .find(x => x.valor === e.target.value);

                                                setByPath(
                                                    ["presupuestos", idx, "fuenteFinanciamiento"],
                                                    f || { ...CodigoDTO }
                                                );

                                            }}
                                        >
                                            <option value="">Fuente de financiamiento</option>

                                            {(tipos["FUENTE_FINANCIAMIENTO"] || []).map(f => (
                                                <option key={f.id} value={f.valor}>
                                                    {f.despliegue}
                                                </option>
                                            ))}

                                        </select>

                                        <InputField
                                            label="Monto (₡)"
                                            type="number"
                                            name="monto"
                                            value={p.monto ?? ""}
                                            onChange={(e) => handleCampoChange(idx, e)}
                                            rules={[required(), min(1), max(9999999.99)]}
                                            required
                                        />

                                    </>

                                )}

                                {/* HORAS */}
                                {p.tipoPresupuesto.valor === "HORAS" && (

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

                                    </>

                                )}

                            </div>

                        )}


                    </div>

                );
            })}

            <button type="button" onClick={addPresupuesto} hidden={editando}>
                + Agregar presupuesto
            </button>

        </form>

    );
}

export default PresupuestoForm;