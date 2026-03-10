// src/components/proyecto/VincularInvestigador.jsx
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext.jsx";
import { useProyecto } from "../../../context/proyectoCtx/UseProyecto.jsx";
import { InvestigadorProyectoDTO } from "../../../modelos/InvestigadorProyectoDTO.jsx";
import { notify } from "../../../utils/estilo/notify.jsx";
import { obtenerInvestigadoresActivos } from "../../../services/InvestigadorService.jsx";
import { cargarProyectos } from "../../../services/ProyectoService.jsx";
import { obtenerRolesProyecto } from "../../../services/RolService.jsx";

function VincularInvestigador({ onClose, editable = true }) {
    const { proyecto, addByPath, removeByPath, establecerProyecto } = useProyecto();
    const { token } = useContext(AppContext);

    // proyectos
    const [proyectos, setProyectos] = useState([]);
    const [projectSearch, setProjectSearch] = useState(proyecto.codigo || "");
    const [showListProjects, setShowListProjects] = useState(false);

    // investigadores
    const [searchTerm, setSearchTerm] = useState("");
    const [showList, setShowList] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    const [current, setCurrent] = useState({
        investigador: { identificacion: "", nombre: "" },
        rolProyecto: "",
        actividadProyecto: "",
        fechaInicio: "",
        fechaFin: "",
        modalidad: "",
        tipoHora: "",
        cantidadHorasMes: "",
        cantidadMeses: "",
    });

    // cargar proyectos, roles y catálogos
    useEffect(() => {
        setLoading(true);
        cargarProyectos(token, editable)
            .then(list => setProyectos(list || []))
            .catch(() => notify.error("Error cargando proyectos"))
            .finally(() => setLoading(false));

        obtenerRolesProyecto(token)
            .then(r => setRoles(r || []))
            .catch(() => notify.error("Error cargando roles"));

    }, [token, editable]);

    // búsqueda de candidatos
    useEffect(() => {
        if (!searchTerm.trim()) {
            setCandidates([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await obtenerInvestigadoresActivos(token, searchTerm);

                // excluir ya vinculados
                const selectedIds = (proyecto?.investigadoresVinculados || [])
                    .map(i => i.identificacionInvestigador);

                const filtered = (res || []).filter(x => !selectedIds.includes(x.identificacion));
                setCandidates(filtered);
            } catch {
                notify.error("Error buscando investigadores");
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchTerm, token, proyecto]);

    function handleSelectCandidate(c) {
        setCurrent(prev => ({ ...prev, investigador: c }));
        setSearchTerm(c.nombre);
        setShowList(false);
    }

    function handleSelectProyecto(p) {
        establecerProyecto({
            codigo: p.codigo,
            nombre: p.nombre,
            fechaInicio: p.fechaInicio,
            fechaFinalizacion: p.fechaFinalizacion,
            investigadoresVinculados: proyecto.investigadoresVinculados || []
        });
        setProjectSearch(p.codigo);
        setShowListProjects(false);
    }

    function handleChangeField(e) {
        const { name, value } = e.target;
        setCurrent(prev => ({ ...prev, [name]: value }));
    }

    function handleAdd() {
        if (!proyecto?.codigo) {
            notify.warning("Seleccione un proyecto.");
            return;
        }
        if (!current.investigador?.identificacion) {
            notify.warning("Seleccione un investigador");
            return;
        }
        if (!current.rolProyecto) {
            notify.warning("Seleccione un rol para el investigador");
            return;
        }

        const id = current.investigador.identificacion;
        const exists = (proyecto?.investigadoresVinculados || [])
            .some(iv => iv.identificacionInvestigador === id);
        if (exists) {
            notify.warning("Investigador ya asignado al proyecto");
            return;
        }


        const toAdd = {
            ...InvestigadorProyectoDTO,
            identificacionInvestigador: current.investigador.identificacion,
            nombreInvestigador: current.investigador.nombre,
            rolProyecto: current.rolProyecto,
            actividadProyecto: current.actividadProyecto || "",
            fechaInicio: current.fechaInicio || "",
            fechaFin: current.fechaFin || "",
        };

        addByPath(["investigadoresVinculados"], toAdd);

        setCurrent({
            investigador: { identificacion: "", nombre: "" },
            rolProyecto: "",
            actividadProyecto: "",
            fechaInicio: "",
            fechaFin: ""
        });
        setSearchTerm("");
        notify.success("Investigador agregado");
    }

    function handleRemove(idx) {
        removeByPath(["investigadoresVinculados"], idx);
        notify.info("Investigador removido");
    }

    function handleConfirm() {
        onClose();
    }

    const filteredCandidates = candidates.filter(c =>
        (c.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) || (c.identificacion || "").includes(searchTerm)
    );

    const filteredProyectos = (proyectos || []).filter(p =>
        (p.codigo || "").toLowerCase().includes(projectSearch.toLowerCase()) ||
        (p.nombre || "").toLowerCase().includes(projectSearch.toLowerCase())
    );

    return (
        <div className="overlay">
            <div className="popup">
                <h2>Asignar Investigadores</h2>

                {loading && <div className="loading-text">Cargando...</div>}

                <div className="search-wrapper">
                    <label>Código del Proyecto: </label>
                    {editable ? (
                        <div className="search-wrapper">
                            <input
                                type="text"
                                placeholder="Buscar código o nombre..."
                                value={projectSearch}
                                onChange={e => { setProjectSearch(e.target.value); setShowListProjects(true); }}
                                onFocus={() => setShowListProjects(true)}
                                autoComplete="off"
                                className="search-input"
                            />
                            {showListProjects && projectSearch && filteredProyectos.length > 0 && (
                                <ul className="search-list">
                                    {filteredProyectos.map(p => (
                                        <li key={p.codigo} onClick={() => handleSelectProyecto(p)} className="search-list-item">
                                            {p.codigo} - {p.nombre}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : (
                        <input type="text" className="search-input" value={proyecto.codigo || ''} readOnly />
                    )}
                </div>

                {/* Buscador de investigadores */}
                <div className="search-wrapper">
                    <label>Buscar Investigador: </label>
                    <input
                        type="text"
                        placeholder="Nombre o identificación..."
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setShowList(true); }}
                        onFocus={() => setShowList(true)}
                        autoComplete="off"
                        className="search-input"
                    />

                    {showList && searchTerm && filteredCandidates.length > 0 && (
                        <ul className="search-list">
                            {filteredCandidates.map(c => (
                                <li key={c.identificacion} className="search-list-item" onClick={() => handleSelectCandidate(c)}>
                                    {c.nombre || c.identificacion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="form-row">
                    <label>Rol</label>
                    <select name="rolProyecto" value={current.rolProyecto} onChange={handleChangeField}>
                        <option value="">Seleccione rol</option>
                        {roles.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <label>Actividad en el proyecto</label>
                    <input name="actividadProyecto" value={current.actividadProyecto} onChange={handleChangeField} placeholder="Actividad" />
                </div>

                <div className="form-row">
                    <label>Fecha inicio</label>
                    <input type="date" name="fechaInicio" value={current.fechaInicio || ""} onChange={handleChangeField} />
                    <label>Fecha fin</label>
                    <input type="date" name="fechaFin" value={current.fechaFin || ""} onChange={handleChangeField} />
                </div>

                <div className="actions">
                    <button type="button" onClick={handleAdd}>➕ Agregar</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                    <button type="button" onClick={handleConfirm}>Confirmar</button>
                </div>

                <div className="list">
                    {(proyecto?.investigadoresVinculados || []).map((iv, idx) => (
                        <div key={idx} className="list-item">
                            <div>
                                <strong>{iv.nombreInvestigador || iv.identificacionInvestigador || 'Sin nombre'}</strong>
                                <div>{iv.rolProyecto}</div>
                                <div>{iv.actividadProyecto}</div>
                                <div>{iv.fechaInicio || ''} - {iv.fechaFin || ''}</div>
                            </div>
                            <div>

                                <button type="button" onClick={() => handleRemove(idx)}>🗑</button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default VincularInvestigador;