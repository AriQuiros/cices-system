// src/modules/persona/components/PersonaFiltros.jsx
import Select from "react-select";

export function PersonaFiltros({
                                   filtro,
                                   onChange,
                                   onLimpiar,
                                   opcionesGrados = [],
                                   opcionesRoles = [],
                                   mostrarEstado = false,
                                   mostrarRoles = true,
                               }) {
    return (
        <div className="ci-toolbar">

            <div className="ci-field">
                <label className="ci-field-label">Nombre</label>
                <input
                    className="ci-search-input"
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={filtro.nombre}
                    onChange={e => onChange("nombre", e.target.value)}
                />
            </div>

            {mostrarRoles && (
                <div className="ci-field">
                    <label className="ci-field-label">Roles</label>
                    <Select
                        classNamePrefix="ci-select"
                        isMulti
                        isClearable
                        closeMenuOnSelect={false}
                        options={opcionesRoles}
                        value={opcionesRoles.filter(r => filtro.roles?.includes(r.value))}
                        onChange={sel => onChange("roles", sel ? sel.map(s => s.value) : [])}
                        placeholder="Todos los roles"
                    />
                </div>
            )}

            <div className="ci-field">
                <label className="ci-field-label">Grado académico</label>
                <Select
                    classNamePrefix="ci-select"
                    isMulti
                    isClearable
                    closeMenuOnSelect={false}
                    options={opcionesGrados}
                    value={opcionesGrados.filter(g => filtro.gradosAcademicos?.includes(g.value))}
                    onChange={sel => onChange("gradosAcademicos", sel ? sel.map(s => s.value) : [])}
                    placeholder="Todos los grados"
                />
            </div>

            {mostrarEstado && (
                <div className="ci-field">
                    <label className="ci-field-label">Estado</label>
                    <select
                        className="ci-search-input"
                        value={filtro.activo === null ? "" : String(filtro.activo)}
                        onChange={e => {
                            const v = e.target.value;
                            // Convertir a Boolean o null para que el backend reciba el tipo correcto
                            onChange("activo", v === "" ? null : v === "true");
                        }}
                    >
                        <option value="">Todos</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                </div>
            )}

            <div className="ci-field ci-field-accion">
                <button className="ci-btn-limpiar" onClick={onLimpiar}>
                    Limpiar filtros
                </button>
            </div>

        </div>
    );
}