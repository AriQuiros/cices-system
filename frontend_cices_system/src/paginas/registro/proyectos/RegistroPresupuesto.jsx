import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext.jsx";
import "../usuarios/RegistroInvestigador.css";
import "../usuarios/Registro.css";
import "./RegistroProyecto.css";
import "./Presupuesto.css";

function RegistroPresupuesto({ onClose, editable = false }) {
    const {
        proyectosState,
        setProyectosState,
        presupuestoState,
        setPresupuestoState,
        token
    } = useContext(AppContext);

    const [searchTerm, setSearchTerm] = useState("");
    const [showList, setShowList] = useState(false);

    const [tipoPresupuesto, setTipoPresupuesto] = useState({
        financiero: false,
        horas: false
    });
    const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

    const [datosIniciales, setDatosIniciales] = useState({
        tipos: {
            "TIPO PRESUPUESTO": [],
            "FUENTE FINANCIAMIENTO": []
        },
        proyectos: []
    });
    const [loadingInicial, setLoadingInicial] = useState(true);

    const mostrarError = !tipoPresupuesto.financiero && !tipoPresupuesto.horas;

    async function fetchDatosIniciales() {
        try {
            const response = await fetch(`${API}/api/presupuesto/datos_iniciales`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Error al cargar datos iniciales");

            const data = await response.json();

            setDatosIniciales(data);
        } catch (error) {
            console.error("Error cargando datos iniciales:", error);
        } finally {
            setLoadingInicial(false);
        }
    }

    useEffect(() => {
        fetchDatosIniciales();
    }, [token]);

    useEffect(() => {
        if (!loadingInicial) {
            console.log('Reseteando tipoPresupuesto con:', presupuestoState.financiero, presupuestoState.horas);
            setTipoPresupuesto({
                financiero: !!presupuestoState.financiero?.descripcion || presupuestoState.financiero?.monto > 0,
                horas: !!presupuestoState.horas?.descripcion || presupuestoState.horas?.horas > 0,
            });
        }
    }, [loadingInicial, presupuestoState.financiero?.descripcion, presupuestoState.financiero?.monto, presupuestoState.horas?.descripcion, presupuestoState.horas?.horas]);

    if (loadingInicial) return <p>Cargando datos iniciales...</p>;

    const filteredProyectos = datosIniciales.proyectos.filter(p =>
        p.codigoProyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nombreProyecto.toLowerCase().includes(searchTerm.toLowerCase())
    );
    function handleSelectProyecto(proyecto) {
        setProyectosState(prev => ({
            ...prev,
            proyecto: {
                codigo: proyecto.codigoProyecto,
                nombre: proyecto.nombreProyecto
            }
        }));
        setSearchTerm(proyecto.codigoProyecto);
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
                [name]: name === "monto" ? Number(value) : value
            }
        }));
    }

    function handleHorasChange(e) {
        const { name, value } = e.target;
        console.log(`Valor de ${name}: ${value}`);  // Verifica el valor recibido
        setPresupuestoState(prev => ({
            ...prev,
            horas: {
                ...prev.horas,
                [name]: name === "cantidadHorasMes" || name === "cantidadMeses" ? (value === "" ? 0 : Number(value)) : value
            }
        }));
    }


    function handleCancel() {
        if (onClose) onClose();
    }

    function handleConfirm() {
        if (tipoPresupuesto.financiero && presupuestoState.financiero) {
            setPresupuestoState(prevState => ({
                ...prevState,
                financiero: {
                    ...prevState.financiero,
                    tipoPresupuesto: 'FINANCIERO'
                }
            }));
        }

        if (tipoPresupuesto.horas && presupuestoState.horas) {
            setPresupuestoState(prevState => ({
                ...prevState,
                horas: {
                    ...prevState.horas,
                    tipoPresupuesto: 'HORAS'
                }
            }));
        }

        if (onClose) onClose();
    }


    return (
        <Show
            editable={editable}
            searchTerm={searchTerm}
            showList={showList}
            setShowList={setShowList}
            filteredProyectos={filteredProyectos}
            proyectosState={proyectosState}
            tipoPresupuesto={tipoPresupuesto}
            handleSearchChange={handleSearchChange}
            handleSelectProyecto={handleSelectProyecto}
            tipos={datosIniciales.tipos}
            handleCheckboxChange={handleCheckboxChange}
            mostrarError={mostrarError}
            presupuestoFinanciero={presupuestoState.financiero || {}}
            handleFinancieroChange={handleFinancieroChange}
            presupuestoHoras={presupuestoState.horas || {}}
            handleHorasChange={handleHorasChange}
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
        />
    );
}

function Show({editable, searchTerm, showList, setShowList, filteredProyectos, proyectosState,
                  tipoPresupuesto, handleSearchChange, handleSelectProyecto, tipos, handleCheckboxChange,
                  mostrarError, presupuestoFinanciero, handleFinancieroChange, presupuestoHoras, handleHorasChange,
                  handleCancel,handleConfirm }){
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
                        value={proyectosState.proyecto.codigo || ''}
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
                                />
                                {opcion.despliegue}
                            </label>
                        ))}
                    </div>

                    {mostrarError && (
                        <div className="error-message">
                            <strong>⚠️</strong> Seleccione al menos un tipo de presupuesto
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
                                            required
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
                                        type="text"
                                        className="input"
                                        placeholder="Descripción corta"
                                        name="descripcion"
                                        value={presupuestoFinanciero.descripcion}
                                        onChange={handleFinancieroChange}
                                    />

                                    <label>Monto</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="Monto"
                                        min="0"
                                        name="monto"
                                        value={presupuestoFinanciero.monto}
                                        onChange={handleFinancieroChange}
                                    />

                                    <label>Fecha de asignación</label>
                                    <input
                                        type="date"
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
                                        type="text"
                                        className="input"
                                        placeholder="Descripción corta"
                                        name="descripcion"
                                        value={presupuestoHoras.descripcion}
                                        onChange={handleHorasChange}
                                    />

                                    <label>Horas asignadas</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="Horas presupuestarias"
                                        min="0"
                                        name="cantidadHorasMes"
                                        value={presupuestoHoras.cantidadHorasMes}
                                        onChange={handleHorasChange}
                                    />

                                    <label>Tiempo (cantidad meses)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="Cantidad de meses"
                                        min="0"
                                        name="cantidadMeses"
                                        value={presupuestoHoras.cantidadMeses}
                                        onChange={handleHorasChange}
                                    />

                                    <label>Fecha de asignación</label>
                                    <input
                                        type="date"
                                        className="input"
                                        name="fechaAsignacion"
                                        value={presupuestoHoras.fechaAsignacion}
                                        onChange={handleHorasChange}
                                    />
                                </div>
                            </fieldset>
                        )}
                    </div>

                    <div className="actions">
                        <button type="button" className="btn btn-cancel" onClick={handleCancel}>
                            Cancelar
                        </button>
                        {(tipoPresupuesto.financiero || tipoPresupuesto.horas) && (
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
