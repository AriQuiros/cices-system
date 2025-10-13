import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext.jsx";
import "../usuarios/RegistroInvestigador.css";
import "../usuarios/Registro.css";
import "./RegistroProyecto.css";
import "./Presupuesto.css";

function RegistroPresupuesto({ onClose, editable = true }) {
    const {proyectosState, setProyectosState, presupuestoState, setPresupuestoState, token} = useContext(AppContext);
    const [errores, setErrores] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [showList, setShowList] = useState(false);
    const [tipoPresupuesto, setTipoPresupuesto] = useState({
        financiero: false,
        horas: false
    });
    const [presupuestosExistentes, setPresupuestosExistentes] = useState({
        financiero: false,
        horas: false
    });
    const [datosIniciales, setDatosIniciales] = useState({
        tipos: {
            "TIPO PRESUPUESTO": [],
            "FUENTE FINANCIAMIENTO": []
        },
        proyectos: [],
        presupuestos:[]
    });

    const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

    async function fetchDatosIniciales() {
        const endpoint = editable ? "datos_form" : "tipos_form";

        try {
            const response = await fetch(`${API}/api/presupuesto/${endpoint}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Error al cargar datos iniciales");

            const data = await response.json();
            console.log("Datos iniciales recibidos:", data);

            if (!editable) {
                setDatosIniciales(prev => ({
                    ...prev,
                    tipos: data.tipos || {}
                }));
            } else {
                setDatosIniciales(data);
            }
        } catch (error) {
            console.error("Error cargando datos iniciales:", error);
        }
    }

    useEffect(() => {
        fetchDatosIniciales();
        if (!editable) {
            setTipoPresupuesto({
                financiero: presupuestoState.financiero?.tipoPresupuesto === 'FINANCIERO',
                horas: presupuestoState.horas?.tipoPresupuesto === 'HORAS'
            });
        }
    }, [token]);
    const filteredProyectos = datosIniciales.proyectos
        .filter(p => p.codigo.toLowerCase()
            .includes(searchTerm.toLowerCase()) || p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) );

    function handleSelectProyecto(proyecto) {
        if (editable) {
            const presupuestosProyecto = (datosIniciales.presupuestos || []).filter(
                p => p.idProyecto === proyecto.idProyecto
            );

            setProyectosState(prev => ({
                ...prev,
                proyecto: {
                    codigo: proyecto.codigo,
                    nombre: proyecto.nombre,
                    fechaInicio: proyecto.fechaInicio,
                    fechaFinalizacion: proyecto.fechaFinalizacion
                }
            }));
            const financiero = presupuestosProyecto.find(p => p.tipoPresupuesto === "FINANCIERO");
            const horas = presupuestosProyecto.find(p => p.tipoPresupuesto === "HORAS");

            setTipoPresupuesto({
                financiero: !!financiero,
                horas: !!horas
            });

            setPresupuestoState({
                financiero: financiero ? {
                    tipoPresupuesto: "FINANCIERO",
                    descripcion: financiero.descripcion || "",
                    monto: financiero.monto || "",
                    fuenteFinanciamiento: financiero.fuenteFinanciamiento || "",
                    fechaAsignacion: financiero.fechaAsignacion || ""
                } : {
                    descripcion: "",
                    monto: "",
                    fuenteFinanciamiento: "",
                    fechaAsignacion: ""
                },
                horas: horas ? {
                    tipoPresupuesto: "HORAS",
                    descripcion: horas.descripcion || "",
                    cantidadHorasMes: horas.cantidadHorasMes || "",
                    cantidadMeses: horas.cantidadMeses || "",
                    fechaAsignacion: horas.fechaAsignacion || ""
                } : {
                    descripcion: "",
                    cantidadHorasMes: "",
                    cantidadMeses: "",
                    fechaAsignacion: ""
                }
            });

            setPresupuestosExistentes({
                financiero: !!financiero,
                horas: !!horas
            });
        }
        setSearchTerm(proyecto.codigo);
        setShowList(false);
    }

    function handleSearchChange(e) {
        setSearchTerm(e.target.value);
        setShowList(true);
    }

    function handleCheckboxChange(e) {
        const { value, checked } = e.target;
        setTipoPresupuesto(prev => ({
            ...prev,
            [value.toLowerCase()]: checked
        }));
    }

    function handleFinancieroChange(e) {
        const { name, value } = e.target;
        setPresupuestoState(prev => ({
            ...prev,
            financiero: {
                ...prev.financiero,
                [name]: name === "monto" ? (value === '' ? '' : Math.max(Number(value), 1))
                    : value
            }
        }));
    }

    function handleHorasChange(e) {
        const { name, value } = e.target;
        setPresupuestoState(prev => ({
            ...prev,
            horas: {
                ...prev.horas,
                [name]: (name === "cantidadHorasMes" || name === "cantidadMeses")
                    ? (value === '' ? '' : Math.max(Number(value), 1))
                    : value
            }
        }));
    }

    function handleClear() {
        setPresupuestoState({
            financiero: {},
            horas: {}
        });

        setTipoPresupuesto({
            financiero: false,
            horas: false
        });

        setProyectosState({
            proyecto: {
                id: null,
                codigo: "",
                nombre: "",
                fechaInicio: ""
            }
        });

        setSearchTerm("");
    }

    async function handleSubmit() {
        const presupuestos = [];

        if (tipoPresupuesto.financiero && !presupuestosExistentes.financiero) {
            presupuestos.push({
                ...presupuestoState.financiero,
                tipoPresupuesto: 'FINANCIERO'
            });
        }

        if (tipoPresupuesto.horas && !presupuestosExistentes.horas) {
            presupuestos.push({
                ...presupuestoState.horas,
                tipoPresupuesto: 'HORAS'
            });
        }
        if (presupuestos.length === 0) {
            console.warn("No hay presupuestos seleccionados para enviar.");
            return;
        }

        try {
            // Crear el FormData
            const formData = new FormData();
            formData.append("idProyecto", proyectosState.proyecto.codigo);
            formData.append(
                "presupuestos",
                new Blob([JSON.stringify(presupuestos)], { type: "application/json" })
            );

            const response = await fetch(`${API}/api/presupuesto/registrar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error("Error al registrar presupuesto");

            handleClear();
            if (onClose) onClose();
        } catch (error) {
            console.error("Error registrando presupuesto:", error);
        }
    }

    function validarCampos() {
        const nuevosErrores = {};

        // Validar proyecto
        if (!proyectosState.proyecto.codigo) {
            nuevosErrores.proyecto = "Debe seleccionar un proyecto.";
        }

        // Validar presupuesto financiero
        if (tipoPresupuesto.financiero && !presupuestosExistentes.financiero) {
            const p = presupuestoState.financiero;
            if (!p.descripcion) nuevosErrores.descripcionFinanciero = "Descripción requerida.";
            if (!p.monto || Number(p.monto) <= 0) nuevosErrores.monto = "Monto inválido.";
            if (!p.fuenteFinanciamiento) nuevosErrores.fuente = "Fuente requerida.";
            if (!p.fechaAsignacion) nuevosErrores.fechaFinanciero = "Fecha requerida.";
        }

        // Validar presupuesto en horas
        if (tipoPresupuesto.horas && !presupuestosExistentes.horas) {
            const p = presupuestoState.horas;
            if (!p.descripcion) nuevosErrores.descripcionHoras = "Descripción requerida.";
            if (!p.cantidadHorasMes || Number(p.cantidadHorasMes) <= 0) nuevosErrores.horas = "Horas inválidas.";
            if (!p.cantidadMeses || Number(p.cantidadMeses) <= 0) nuevosErrores.meses = "Meses inválidos.";
            if (!p.fechaAsignacion) nuevosErrores.fechaHoras = "Fecha requerida.";
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    }

    function handleConfirm() {
        const esValido = validarCampos();
        if (!esValido) return;
        if (editable) {
            handleSubmit();
        }
        else{
            setPresupuestoState(prevState => ({
                ...prevState,
                financiero: {
                    ...prevState.financiero,
                    tipoPresupuesto: tipoPresupuesto.financiero ? 'FINANCIERO' : ''
                },
                horas: {
                    ...prevState.horas,
                    tipoPresupuesto: tipoPresupuesto.horas ? 'HORAS' : ''
                }
            }));
            if (onClose) onClose();
        }
    }
    function handleCancel() {
        if(editable){
            handleClear();
            onClose();
        } else
        if (onClose) onClose();
    }

    return (
        <Show
            editable={editable}
            existe={presupuestosExistentes}
            errores={errores}
            searchTerm={searchTerm}
            showList={showList}
            setShowList={setShowList}
            filteredProyectos={filteredProyectos}
            proyecto={proyectosState.proyecto}
            tipoPresupuesto={tipoPresupuesto}
            handleSearchChange={handleSearchChange}
            handleSelectProyecto={handleSelectProyecto}
            tipos={datosIniciales.tipos}
            handleCheckboxChange={handleCheckboxChange}
            presupuestoFinanciero={presupuestoState.financiero || {}}
            handleFinancieroChange={handleFinancieroChange}
            presupuestoHoras={presupuestoState.horas || {}}
            handleHorasChange={handleHorasChange}
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
        />
    );
}

function Show({editable, existe, searchTerm, showList, setShowList, filteredProyectos, proyecto,
                 errores, tipoPresupuesto, handleSearchChange, handleSelectProyecto, tipos, handleCheckboxChange,
                  presupuestoFinanciero, handleFinancieroChange, presupuestoHoras, handleHorasChange,
                  handleCancel, handleConfirm }){
    const mostrarError = !tipoPresupuesto.financiero && !tipoPresupuesto.horas;

    return (
        <div className="overlay">
                <div className="popup">
                    <h2>Establecer presupuesto</h2>

                    <label>Código del Proyecto</label>

                    {editable ? (
                        <div className="search-wrapper">
                            <input
                                type="text"
                                placeholder="Buscar código o nombre..."
                                value={searchTerm}
                                onChange={handleSearchChange}
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
                        <input
                            type="text"
                            className="search-input"
                            value={proyecto.codigo || ''}
                            readOnly
                        />
                    )}

                    <div className="form">
                        <div className="inline-group" id="checkbox-project-group">
                            {(tipos["TIPO PRESUPUESTO"] || []).map(opcion => (
                                <label key={opcion.id}>
                                    <input
                                        type="checkbox"
                                        name="tipo"
                                        value={opcion.valor.toLowerCase()}
                                        checked={tipoPresupuesto[opcion.valor.toLowerCase()] || false}
                                        onChange={handleCheckboxChange}
                                        disabled={existe[opcion.valor.toLowerCase()] || !proyecto.codigo}
                                    />
                                    {opcion.despliegue}
                                </label>
                            ))}
                        </div>

                        {mostrarError && (
                            <div className="error-message">
                                <strong>⚠️<br/></strong> Seleccione al menos un tipo de presupuesto
                            </div>
                        )}

                        <div className="form-row">
                            {tipoPresupuesto.financiero && (
                                <fieldset className="input-field">
                                    <legend>Presupuesto Financiero</legend>
                                    <div className="form">
                                        <div className="select-wrap">
                                            <select
                                                className="select"
                                                required={tipoPresupuesto.financiero}
                                                disabled={existe.financiero}
                                                name="fuenteFinanciamiento"
                                                value={presupuestoFinanciero.fuenteFinanciamiento}
                                                onChange={handleFinancieroChange}
                                            >
                                                <option value="">Fuente de financiamiento</option>
                                                {(tipos["FUENTE FINANCIAMIENTO"] || []).map(fuente => (
                                                    <option key={fuente.id} value={fuente.valor}>
                                                        {fuente.despliegue}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <input
                                            type="text" required={tipoPresupuesto.financiero}
                                            readOnly={existe.financiero}
                                            className="input"
                                            placeholder="Descripción corta"
                                            maxLength={50}
                                            name="descripcion"
                                            value={presupuestoFinanciero.descripcion}
                                            onChange={handleFinancieroChange}
                                        />

                                        <label>Monto</label>
                                        <input
                                            type="number" required={tipoPresupuesto.financiero}
                                            readOnly={existe.financiero}
                                            className="input"
                                            placeholder="Monto"
                                            min="0"
                                            name="monto"
                                            value={presupuestoFinanciero.monto}
                                            onChange={handleFinancieroChange}
                                        />

                                        <label>Fecha de asignación</label>
                                        <input
                                            type="date" required={tipoPresupuesto.financiero}
                                            readOnly={existe.financiero}
                                            min={proyecto.fechaInicio}
                                            max={proyecto.fechaFinalizacion}
                                            className="input"
                                            name="fechaAsignacion"
                                            value={presupuestoFinanciero.fechaAsignacion}
                                            onChange={handleFinancieroChange}
                                        />
                                    </div>
                                </fieldset>
                            )}

                            {tipoPresupuesto.horas && (
                                <fieldset className="input-field">
                                    <legend>Presupuesto en Horas</legend>
                                    <div className="form">
                                        <input
                                            type="text" required={tipoPresupuesto.horas}
                                            readOnly={existe.horas}
                                            maxLength={50}
                                            className="input"
                                            placeholder="Descripción corta"
                                            name="descripcion"
                                            value={presupuestoHoras.descripcion}
                                            onChange={handleHorasChange}
                                        />

                                        <label>Horas asignadas</label>
                                        <input
                                            type="number" required={tipoPresupuesto.horas}
                                            readOnly={existe.horas}
                                            className="input"
                                            placeholder="Horas presupuestarias"
                                            min="0"
                                            name="cantidadHorasMes"
                                            value={presupuestoHoras.cantidadHorasMes}
                                            onChange={handleHorasChange}
                                        />

                                        <label>Tiempo (cantidad meses)</label>
                                        <input
                                            type="number" required={tipoPresupuesto.horas}
                                            readOnly={existe.horas}
                                            className="input"
                                            placeholder="Cantidad de meses"
                                            min="0"
                                            name="cantidadMeses"
                                            value={presupuestoHoras.cantidadMeses}
                                            onChange={handleHorasChange}
                                        />

                                        <label>Fecha de asignación</label>
                                        <input
                                            type="date" required={tipoPresupuesto.horas}
                                            readOnly={existe.horas}
                                            min={proyecto.fechaInicio}
                                            max={proyecto.fechaFinalizacion}
                                            className="input"
                                            name="fechaAsignacion"
                                            value={presupuestoHoras.fechaAsignacion}
                                            onChange={handleHorasChange}
                                        />
                                    </div>
                                </fieldset>
                            )}
                        </div>
                        {Object.keys(errores).length > 0 && (
                            <div className="error-text">
                                ⚠️ <br/>Por favor complete todos los campos obligatorios.<br/><br/>
                            </div>
                        )}
                        <div className="actions">
                            <button type="button" className="btn btn-cancel" onClick={handleCancel}>
                                Cancelar
                            </button>

                            {(!editable || tipoPresupuesto.financiero || tipoPresupuesto.horas) && (
                                <button type="button" className="btn btn-confirm" onClick={handleConfirm}>
                                    Confirmar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default RegistroPresupuesto;
