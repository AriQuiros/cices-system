import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext.jsx";
import { PresupuestoDTO } from "../../../modelos/presupuestoDTO.jsx";
import { notify } from "../../../utils/estilo/notify.jsx";
import { useProyecto } from "../../../context/proyectoCtx/UseProyecto.jsx";
import {fetchTiposCatalogo} from "../../../services/CatalogoService.js";
import {cargarProyectos} from "../../../services/ProyectoService.jsx";
import {obtenerPresupuestosProyecto, registrarPresupuestos} from "../../../services/PresupuestoService.jsx";

function RegistroPresupuesto({ onClose, editable }) {
    const { token } = useContext(AppContext);
    const { proyecto, limpiarProyecto, establecerProyecto, setPresupuestos, addByPath, setByPath, removeByPath } = useProyecto();

    const [tipos, setTipos] = useState({});
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(proyecto.codigo || "");
    const [showList, setShowList] = useState(false);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetchTiposCatalogo(token, [
                "TIPO_PRESUPUESTO",
                "CATEGORIA_PRESUPUESTO",
                "FUENTE_FINANCIAMIENTO"
            ]).then(setTipos),              // carga tipos
            cargarProyectos(token, editable).then(setProyectos) // carga proyectos
        ]).finally(() => setLoading(false));
    }, [token, editable]);
    if (loading) return <p>Cargando opciones...</p>;

    function handleSelectProyecto(p) {
        establecerProyecto({
            codigo: p.codigo,
            nombre: p.nombre,
            fechaInicio: p.fechaInicio,
            fechaFinalizacion: p.fechaFinalizacion,
            presupuestos: [] // solo al seleccionar
        });
        setSearchTerm(p.codigo);
        setShowList(false);

        console.log(tipos)
    }

    function handleAddPresupuesto() {
        if (!proyecto?.codigo) {
            notify.warning("Seleccione un proyecto.");
            return;
        }
        addByPath(["presupuestos"], {
            ...PresupuestoDTO,
            codigoProyecto: proyecto.codigo
        });
    }

    function handleCampoChange(index, e) {
        const { name, value } = e.target;

        let v = value;
        if (["monto", "cantidadHorasMes", "cantidadMeses"].includes(name)) {
            v = value === "" ? "" : Number(value);
        }

        setByPath(['presupuestos', index, name], v);
    }

    function handleTipoChange(index, tipo) {
        const tipoNormalizado = (tipo || "").toUpperCase();

        setByPath(['presupuestos', index, 'tipoPresupuesto'], tipoNormalizado);

        if (tipoNormalizado === "FINANCIERO") {
            setByPath(['presupuestos', index, 'cantidadHorasMes'], 0);
            setByPath(['presupuestos', index, 'cantidadMeses'], 0);
        }

        if (tipoNormalizado === "HORAS") {
            setByPath(['presupuestos', index, 'monto'], 0);
            setByPath(['presupuestos', index, 'fuenteFinanciamiento'], '');
        }
    }

    function handlePresupuestosProyecto() {
        obtenerPresupuestosProyecto(token, proyecto.codigo)
            .then(pres => {
                if (pres) {
                    setPresupuestos(pres);
                    const cant = proyecto.presupuestos.length;
                    notify.info(cant===0?"Presupuestos del proyecto cargados.":"Este proyecto no tiene presupuestos asignados.");
                } else {
                    notify.warning("No se encontraron presupuestos para este proyecto.");
                }
            })
            .catch(() => {
                notify.error("Error al cargar presupuestos del proyecto.");
            });
    }

    async function handleSubmit() {
        if(!editable) {onClose(); return}
        registrarPresupuestos(token, proyecto.codigo, proyecto.presupuestos)
            .then(() => {
                notify.success("Presupuestos registrados exitosamente.");
                limpiarProyecto()
                setSearchTerm("");
                onClose();
            })
            .catch(() => {
                notify.error("Error al registrar presupuestos.");
            });
    }

    const filteredProyectos = proyectos.filter(p =>
        p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="overlay">
            <div className="popup">
                <h2>Agregar Presupuestos</h2>

                {/* Selector proyecto */}
                <div className="search-wrapper">
                    <label>Código del Proyecto: </label>

                    {editable ? (
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
                                autoComplete="off"
                                className="search-input"
                            />
                            {showList && searchTerm && filteredProyectos.length > 0 && (
                                <ul className="search-list">
                                    {filteredProyectos.map(p => (
                                        <li
                                            key={p.codigo}
                                            onClick={() => handleSelectProyecto(p)}
                                            className="search-list-item"
                                        >
                                            {p.codigo} - {p.nombre}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : (
                        <input type="text" className="search-input" value={proyecto.codigo || ''} readOnly/>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handlePresupuestosProyecto}
                    disabled={!proyecto.codigo}
                >
                    Desplegar datos de proyecto
                </button>

                {/* Lista presupuestos */}
                <div className="presupuestos-list">
                    {(proyecto?.presupuestos || []).map((p, idx) => (
                        <div key={idx} className="presupuesto-card">

                            <div className="presupuesto-header">
                                <select
                                    required={true}
                                    value={p.tipoPresupuesto || ""}
                                    onChange={(e) => handleTipoChange(idx, e.target.value)}
                                >
                                    <option value="">Tipo presupuesto</option>
                                    {(tipos?.["TIPO_PRESUPUESTO"] || [])
                                        .map(op => (
                                            <option key={op.id} value={op.valor}>
                                                {op.despliegue}
                                            </option>
                                        ))}
                                </select>

                                <button
                                    type="button"
                                    onClick={() => removeByPath(['presupuestos'], idx)}
                                >
                                    🗑
                                </button>
                            </div>

                            {p.tipoPresupuesto && (
                                <div className="presupuesto-body">
                                    <label>Descripción: </label>
                                    <input
                                        type="text"
                                        name="descripcion"
                                        placeholder="Opcional"
                                        value={p.descripcion || ""}
                                        onChange={(e) => handleCampoChange(idx, e)}
                                    />

                                    <input
                                        type="date"
                                        name="fechaAsignacion"
                                        value={p.fechaAsignacion || ""}
                                        onChange={(e) => handleCampoChange(idx, e)}
                                    />

                                    <select
                                        required={true}
                                        name="categoria"
                                        value={p.categoria || ""}
                                        onChange={(e) => handleCampoChange(idx, e)}
                                    >
                                        <option value="">Categoría</option>
                                        {(tipos?.["CATEGORIA_PRESUPUESTO"] || []).map(cat => (
                                            <option key={cat.id ?? cat.valor} value={cat.valor}>{cat.despliegue}</option>
                                        ))}
                                    </select>

                                    {p.tipoPresupuesto.toUpperCase() === "FINANCIERO" && (
                                        <>
                                            <select
                                                required={p.tipoPresupuesto?.toUpperCase() === "FINANCIERO"}
                                                name="fuenteFinanciamiento"
                                                value={p.fuenteFinanciamiento || ""}
                                                onChange={(e) => handleCampoChange(idx, e)}
                                            >
                                                <option value="">Fuente</option>
                                                {(tipos?.["FUENTE_FINANCIAMIENTO"] || [])
                                                    .map(f => (
                                                        <option key={f.id} value={f.valor}>
                                                            {f.despliegue}
                                                        </option>
                                                    ))}
                                            </select>

                                            <input
                                                required={p.tipoPresupuesto?.toUpperCase() === "FINANCIERO"}
                                                type="number"
                                                name="monto"
                                                placeholder={"Monto (₡)"}
                                                min="0"
                                                value={p.monto || ""}
                                                onChange={(e) => handleCampoChange(idx, e)}
                                            />
                                        </>
                                    )}

                                    {p.tipoPresupuesto.toUpperCase() === "HORAS" && (
                                        <>
                                            <label>Horas por mes: </label>
                                            <input
                                                type="number"
                                                name="cantidadHorasMes"
                                                placeholder={"Cantidad horas"}
                                                min="0"
                                                value={p.cantidadHorasMes || ""}
                                                onChange={(e) => handleCampoChange(idx, e)}
                                            />

                                            <label>Cantidad meses: </label>
                                            <input
                                                type="number"
                                                placeholder={"Cantidad meses"}
                                                name="cantidadMeses"
                                                min="0"
                                                value={p.cantidadMeses || ""}
                                                onChange={(e) => handleCampoChange(idx, e)}
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
                            disabled={!proyecto?.codigo}
                        >
                            ➕ Agregar presupuesto
                        </button>

                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>

                        <button type="button" onClick={handleSubmit}>
                            Confirmar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default RegistroPresupuesto;

