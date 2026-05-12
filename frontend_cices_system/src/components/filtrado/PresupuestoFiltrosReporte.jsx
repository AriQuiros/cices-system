import Select from "react-select";

/**
 * Filtros de presupuesto para la sección de reportes.
 * Sin controles de ordenamiento (eso lo hace el backend via Pageable).
 */
function PresupuestoFiltrosReporte({
                                       filtros,
                                       onChange,
                                       opcionesTiposPresupuesto = [],
                                       opcionesFuentes = [],
                                       opcionesCategorias = []
                                   }) {
    return (
        <div className="filtros-presupuesto">
            <div className="consulta-grid-filtros">

                <div className="gasto-form-item">
                    <label>Búsqueda</label>
                    <input
                        type="text"
                        className="gestion-gastos-select"
                        placeholder="Descripción o categoría..."
                        value={filtros.busqueda || ""}
                        onChange={e => onChange("busqueda", e.target.value)}
                    />
                </div>

                <div className="gasto-form-item">
                    <label>Tipo de presupuesto</label>
                    <select
                        className="gestion-gastos-select"
                        value={filtros.tipoPresupuesto || ""}
                        onChange={e => onChange("tipoPresupuesto", e.target.value)}
                    >
                        <option value="">Todos</option>
                        {opcionesTiposPresupuesto.map(o => (
                            <option key={o.value} value={o.label}>{o.label}</option>
                        ))}
                    </select>
                </div>

                <div className="gasto-form-item">
                    <label>Fuentes de financiamiento</label>
                    <Select
                        options={opcionesFuentes}
                        isMulti
                        isClearable
                        placeholder="Todas las fuentes"
                        value={opcionesFuentes.filter(o => filtros.fuentesFinanciamiento?.includes(o.value))}
                        onChange={opt => onChange("fuentesFinanciamiento", opt ? opt.map(o => o.value) : [])}
                        closeMenuOnSelect={false}
                    />
                </div>

                <div className="gasto-form-item">
                    <label>Categorías</label>
                    <Select
                        options={opcionesCategorias}
                        isMulti
                        isClearable
                        placeholder="Todas las categorías"
                        value={opcionesCategorias.filter(o => filtros.categorias?.includes(o.value))}
                        onChange={opt => onChange("categorias", opt ? opt.map(o => o.value) : [])}
                        closeMenuOnSelect={false}
                    />
                </div>

                <div className="gasto-form-item">
                    <label>Fecha desde</label>
                    <input
                        type="date"
                        className="gestion-gastos-select"
                        value={filtros.fechaDesde || ""}
                        onChange={e => onChange("fechaDesde", e.target.value || null)}
                    />
                </div>

                <div className="gasto-form-item">
                    <label>Fecha hasta</label>
                    <input
                        type="date"
                        className="gestion-gastos-select"
                        value={filtros.fechaHasta || ""}
                        onChange={e => onChange("fechaHasta", e.target.value || null)}
                    />
                </div>

            </div>
        </div>
    );
}

export default PresupuestoFiltrosReporte;