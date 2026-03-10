import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext.jsx";
import { PresupuestoDTO } from "../../../modelos/presupuestoDTO.jsx";
import { CodigoDTO } from "../../../modelos/CodigoDTO.jsx";
import { notify } from "../../../utils/estilo/notify.jsx";
import { useProyecto } from "../../../context/proyectoCtx/UseProyecto.jsx";

import { fetchTiposCatalogo } from "../../../services/CatalogoService.js";
import { cargarProyectos } from "../../../services/ProyectoService.jsx";
import { obtenerPresupuestosProyecto, registrarPresupuestos } from "../../../services/PresupuestoService.jsx";

import InputField from "../../../utils/validaciones/InputField.jsx";
import {
    required,
    maxLength,
    min,
    max,
    fechaMayorIgualQue,
    fechaMenorIgualQue
} from "../../../utils/validaciones/Validators.jsx";

function RegistroPresupuesto({ onClose, modoRegistro = false }) {

    const { token } = useContext(AppContext);

    const {
        proyecto,
        establecerProyecto,
        limpiarProyecto,
        setByPath,
        addByPath,
        removeByPath
    } = useProyecto();

    const editableBusqueda = !proyecto && !modoRegistro;

    const [tipos, setTipos] = useState({});
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState(proyecto?.codigoProyecto || "");
    const [showList, setShowList] = useState(false);

    useEffect(() => {

        async function cargarDatos() {

            setLoading(true);

            try {

                const tiposData = await fetchTiposCatalogo(
                    token,
                    ["TIPO_PRESUPUESTO", "CATEGORIA_PRESUPUESTO", "FUENTE_FINANCIAMIENTO"]
                );

                setTipos(tiposData);

                if (editableBusqueda) {

                    const proyectosData = await cargarProyectos(token);
                    setProyectos(proyectosData);

                }

            } catch {

                notify.error("Error cargando datos iniciales.");

            }

            setLoading(false);

        }

        cargarDatos();

    }, [token]);

    useEffect(() => {

        if (!proyecto?.codigoProyecto) return;
        if (modoRegistro) return;

        obtenerPresupuestosProyecto(token, proyecto.codigoProyecto)

            .then((pres) => {

                const data = (pres || []).map(p => ({
                    ...PresupuestoDTO,
                    ...p,
                    monto: p.monto ?? 0,
                    cantidadHorasMes: p.cantidadHorasMes ?? 0,
                    cantidadMeses: p.cantidadMeses ?? 0,
                    gastos: p.gastos ?? [],
                    horas: p.horas ?? []
                }));

                setByPath(["presupuestos"], data);

                notify.info(
                    data.length === 0
                        ? "Este proyecto no tiene presupuestos."
                        : "Presupuestos cargados."
                );

            })

            .catch(() => {

                notify.error("Error cargando presupuestos.");

            });

    }, [token, proyecto?.codigoProyecto]);

    if (loading) return <p>Cargando opciones...</p>;

    function handleSelectProyecto(p) {

        establecerProyecto({
            ...p,
            presupuestos: []
        });

        setSearchTerm(p.codigoProyecto);
        setShowList(false);

    }

    function handleAddPresupuesto() {

        if (!proyecto?.codigoProyecto) {

            notify.warning("Seleccione un proyecto.");
            return;

        }

        addByPath(["presupuestos"], {
            ...PresupuestoDTO
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

        if (tipoObj.valor === "FINANCIERO") {

            setByPath(["presupuestos", index, "cantidadHorasMes"], 0);
            setByPath(["presupuestos", index, "cantidadMeses"], 0);

        }

        if (tipoObj.valor === "HORAS") {

            setByPath(["presupuestos", index, "monto"], 0);
            setByPath(["presupuestos", index, "fuenteFinanciamiento"], { ...CodigoDTO });

        }

        const categoriaHoras = (tipos["CATEGORIA_PRESUPUESTO"] || [])
            .find(c => c.valor === "HORAS BECARIAS");

        setByPath(
            ["presupuestos", index, "categoria"],
            categoriaHoras || { ...CodigoDTO }
        );

    }

    async function handleSubmit() {

        if (modoRegistro) {

            onClose();
            return;

        }

        registrarPresupuestos(
            token,
            proyecto
        )
            .then(() => {

                notify.success("Presupuestos registrados.");
                limpiarProyecto();

            })
            .catch((e) => {

                console.log(e)
                notify.error("Error registrando presupuestos.");

            });

    }

    const filteredProyectos = proyectos.filter(p =>
        p.codigoProyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nombreProyecto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (

        <div className="overlay">

            <div className="popup">

                <h2>Agregar Presupuestos</h2>

                <div className="search-wrapper">

                    <label>Código del Proyecto:</label>

                    {editableBusqueda ? (

                        <div className="search-wrapper">

                            <input
                                type="text"
                                placeholder="Buscar código o nombre..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowList(true);
                                }}
                                onFocus={() => setShowList(true)}
                                className="search-input"
                            />

                            {showList && searchTerm && filteredProyectos.length > 0 && (

                                <ul className="search-list">

                                    {filteredProyectos.map((p) => (

                                        <li
                                            key={p.codigoProyecto}
                                            onClick={() => handleSelectProyecto(p)}
                                            className="search-list-item"
                                        >
                                            {p.codigoProyecto} - {p.nombreProyecto}
                                        </li>

                                    ))}

                                </ul>

                            )}

                        </div>

                    ) : (

                        <input
                            type="text"
                            className="search-input"
                            value={proyecto?.codigoProyecto || ""}
                            readOnly
                        />

                    )}

                </div>

                <div className="presupuestos-list">

                    {(proyecto?.presupuestos || []).map((p, idx) => (

                        <div key={idx} className="presupuesto-card">

                            <div className="presupuesto-header">

                                <select
                                    value={p.tipoPresupuesto?.valor || ""}
                                    required
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

                                <button
                                    type="button"
                                    onClick={() => removeByPath(["presupuestos"], idx)}
                                >
                                    🗑
                                </button>

                            </div>

                            {p.tipoPresupuesto?.valor && (

                                <div className="presupuesto-body">

                                    <InputField
                                        label="Fecha de Asignación"
                                        type="date"
                                        name="fechaAsignacion"
                                        value={p.fechaAsignacion || ""}
                                        min={proyecto.fechaInicio}
                                        max={proyecto.fechaFinalizacion}
                                        onChange={(e) => handleCampoChange(idx, e)}
                                        rules={[required(),
                                            fechaMayorIgualQue(proyecto.fechaInicio),
                                            fechaMenorIgualQue(proyecto.fechaFinalizacion)]}
                                        required
                                    />

                                    <select
                                        name="categoria"
                                        value={p.categoria?.valor || ""}
                                        required
                                        onChange={(e) => {

                                            const cat = (tipos["CATEGORIA_PRESUPUESTO"] || [])
                                                .find(c => c.valor === e.target.value);

                                            setByPath(
                                                ["presupuestos", idx, "categoria"],
                                                cat || { ...CodigoDTO }
                                            );

                                        }}
                                        disabled={p.tipoPresupuesto.valor === "HORAS"}
                                    >

                                        <option value="">Categoría</option>

                                        {(tipos["CATEGORIA_PRESUPUESTO"] || [])

                                            .filter(cat =>
                                                !(p.tipoPresupuesto.valor === "FINANCIERO" &&
                                                    cat.valor === "HORAS BECARIAS")
                                            )

                                            .map(cat => (

                                                <option key={cat.id} value={cat.valor}>
                                                    {cat.despliegue}
                                                </option>

                                            ))}

                                    </select>

                                    <InputField
                                        label="Descripción"
                                        name="descripcion"
                                        placeholder={p.tipoPresupuesto.valor === "FINANCIERO"
                                        && p.categoria.valor === "OTRO"? "OBLIGATORIO":"Opcional"}
                                        value={p.descripcion || ""}
                                        onChange={(e) => handleCampoChange(idx, e)}
                                        rules={[maxLength(254)]}
                                        maxLength={254}
                                    />

                                    {p.tipoPresupuesto.valor === "FINANCIERO" && (

                                        <>

                                            <select
                                                name="fuenteFinanciamiento"
                                                value={p.fuenteFinanciamiento?.valor || ""}
                                                required
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
                                                label="Monto Asignado (₡)"
                                                type="number"
                                                name="monto"
                                                placeholder="Monto (₡)"
                                                value={p.monto ?? ""}
                                                onChange={(e) => handleCampoChange(idx, e)}
                                                rules={[required(), min(1), max(9999999.99)]}
                                                required
                                                min={1}
                                                max={9999999.99}
                                            />

                                        </>

                                    )}

                                    {p.tipoPresupuesto.valor === "HORAS" && (

                                        <>

                                            <InputField
                                                label="Cantidad de horas al mes"
                                                type="number"
                                                name="cantidadHorasMes"
                                                placeholder="Horas por mes"
                                                value={p.cantidadHorasMes ?? ""}
                                                onChange={(e) => handleCampoChange(idx, e)}
                                                rules={[required(), min(1), max(999)]}
                                                required
                                                min={1}
                                                max={1000}
                                            />

                                            <InputField
                                                label="Cantidad de meses"
                                                type="number"
                                                name="cantidadMeses"
                                                placeholder="Cantidad de meses"
                                                value={p.cantidadMeses ?? ""}
                                                onChange={(e) => handleCampoChange(idx, e)}
                                                rules={[required(), min(1), max(999)]}
                                                required
                                                min={1}
                                                max={32767}
                                            />

                                        </>

                                    )}

                                </div>

                            )}

                        </div>

                    ))}

                    <div className="actions">

                        <button
                            type="button"
                            onClick={handleAddPresupuesto}
                            disabled={!proyecto?.codigoProyecto}
                        >
                            ➕ Agregar presupuesto
                        </button>

                        <button onClick={onClose}>
                            Cancelar
                        </button>

                        <button onClick={handleSubmit}>
                            Confirmar
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default RegistroPresupuesto;