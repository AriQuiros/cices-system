import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext.jsx";
import { useTiposCatalogo } from '../../../hooks/useTiposCatalogo.js';
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

    const [presupuestoFinanciero, setPresupuestoFinanciero] = useState({
        descripcion: '',
        fechaAsignacion: '',
        monto: 0,
        fuenteFinanciamiento: '',
        tipo: 'financiero'
    });

    const [presupuestoHoras, setPresupuestoHoras] = useState({
        descripcion: '',
        fechaAsignacion: '',
        horas: 0,
        meses: 0,
        tipo: 'horas'
    });

    const mostrarError = !tipoPresupuesto.financiero && !tipoPresupuesto.horas;

    const { tipos, loading } = useTiposCatalogo(token, [
        "TIPO PRESUPUESTO",
        "FUENTE FINANCIAMIENTO"
    ]);

    const proyectosDisponibles = [
        { codigo: "PROY-2025-001", nombre: "Investigación en IA" },
        { codigo: "PROY-2025-002", nombre: "Desarrollo sostenible" },
        { codigo: "PROY-2025-003", nombre: "Educación digital" },
    ];

    const filteredProyectos = proyectosDisponibles.filter(p =>
        p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Cargar datos existentes en el estado local al montar
    useEffect(() => {
        if (presupuestoState.presupuestos?.length > 0) {
            const financiero = presupuestoState.presupuestos.find(p => p.tipo === 'financiero');
            const horas = presupuestoState.presupuestos.find(p => p.tipo === 'horas');

            setTipoPresupuesto({
                financiero: !!financiero,
                horas: !!horas
            });

            if (financiero) setPresupuestoFinanciero(financiero);
            if (horas) setPresupuestoHoras(horas);
        }
    }, [presupuestoState.presupuestos]);
    if (loading) return <p>Cargando tipos de presupuesto...</p>;

    function handleSelectProyecto(proyecto) {
        setProyectosState(prev => ({
            ...prev,
            proyecto: {
                codigo: proyecto.codigo,
                nombre: proyecto.nombre
            }
        }));
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
        setPresupuestoFinanciero(prev => ({
            ...prev,
            [name]: name === "monto" ? Number(value) : value
        }));
    }

    function handleHorasChange(e) {
        const { name, value } = e.target;
        setPresupuestoHoras(prev => ({
            ...prev,
            [name]: ["horas", "meses"].includes(name) ? Number(value) : value
        }));
    }

    function handleCancel() {
        // Solo cerrar, no borrar ni modificar estados
        if (onClose) onClose();
    }

    function handleConfirm() {
        const nuevosPresupuestos = [...(presupuestoState.presupuestos || [])];

        if (tipoPresupuesto.financiero) {
            const financieroIndex = nuevosPresupuestos.findIndex(p => p.tipo === 'financiero');

            if (financieroIndex >= 0) {
                nuevosPresupuestos[financieroIndex] = presupuestoFinanciero;
            } else {
                nuevosPresupuestos.push(presupuestoFinanciero);
            }
        } else {
            // Si no está seleccionado, eliminar el presupuesto financiero si existe
            const financieroIndex = nuevosPresupuestos.findIndex(p => p.tipo === 'financiero');
            if (financieroIndex >= 0) nuevosPresupuestos.splice(financieroIndex, 1);
        }

        if (tipoPresupuesto.horas) {
            const horasIndex = nuevosPresupuestos.findIndex(p => p.tipo === 'horas');

            if (horasIndex >= 0) {
                nuevosPresupuestos[horasIndex] = presupuestoHoras;
            } else {
                nuevosPresupuestos.push(presupuestoHoras);
            }
        } else {
            // Si no está seleccionado, eliminar el presupuesto en horas si existe
            const horasIndex = nuevosPresupuestos.findIndex(p => p.tipo === 'horas');
            if (horasIndex >= 0) nuevosPresupuestos.splice(horasIndex, 1);
        }

        setPresupuestoState(prev => ({
            ...prev,
            presupuestos: nuevosPresupuestos
        }));

        if (onClose) onClose();
    }
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
                                        name="horas"
                                        value={presupuestoHoras.horas}
                                        onChange={handleHorasChange}
                                    />

                                    <label>Tiempo (cantidad meses)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="Cantidad de meses"
                                        min="0"
                                        name="meses"
                                        value={presupuestoHoras.meses}
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
