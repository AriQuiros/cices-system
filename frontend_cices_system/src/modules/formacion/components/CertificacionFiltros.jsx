// src/modules/formacion/components/CertificacionFiltros.jsx
import Select from "react-select";

export function CertificacionFiltros({
                                         filtro,
                                         onChange,
                                         onLimpiar,
                                         opcionesTipos = [],
                                         opcionesEstados = [],
                                         mostrarInvestigador = true
                                     }) {
    return (
        <div className="cert-filters-grid">

            {mostrarInvestigador && (
                <div className="cert-field">
                    <label className="cert-label">Investigador:</label>
                    <input
                        className="cert-input"
                        type="text"
                        placeholder="Nombre o identificación..."
                        value={filtro.investigador}
                        onChange={e => onChange("investigador", e.target.value)}
                    />
                </div>
            )}

            <div className="cert-field">
                <label className="cert-label">Nombre de certificación:</label>
                <input
                    className="cert-input"
                    type="text"
                    placeholder="Buscar certificación..."
                    value={filtro.nombreCertificacion}
                    onChange={e => onChange("nombreCertificacion", e.target.value)}
                />
            </div>

            <div className="cert-field">
                <label className="cert-label">Tipo:</label>
                <Select
                    classNamePrefix="react-select"
                    isMulti
                    isClearable
                    closeMenuOnSelect={false}
                    options={opcionesTipos}
                    value={opcionesTipos.filter(t => filtro.tipos?.includes(t.value))}
                    onChange={sel => onChange("tipos", sel ? sel.map(s => s.value) : [])}
                    placeholder="Todos los tipos"
                />
            </div>

            <div className="cert-field">
                <label className="cert-label">Estado:</label>
                <Select
                    classNamePrefix="react-select"
                    isMulti
                    isClearable
                    closeMenuOnSelect={false}
                    options={opcionesEstados}
                    value={opcionesEstados.filter(e => filtro.estados?.includes(e.value))}
                    onChange={sel => onChange("estados", sel ? sel.map(s => s.value) : [])}
                    placeholder="Todos los estados"
                />
            </div>

            <div className="cert-field">
                <label className="cert-label">Orden por fecha:</label>
                <select
                    className="cert-select"
                    value={filtro.ordenFecha}
                    onChange={e => onChange("ordenFecha", e.target.value)}
                >
                    <option value="desc">Más recientes primero</option>
                    <option value="asc">Más antiguas primero</option>
                </select>
            </div>

            <div className="cert-field cert-field-accion">
                <button className="cert-btn-limpiar" onClick={onLimpiar}>
                    Limpiar filtros
                </button>
            </div>

        </div>
    );
}