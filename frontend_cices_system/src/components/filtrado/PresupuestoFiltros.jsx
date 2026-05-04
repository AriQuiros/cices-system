import Select from "react-select";

/**
 * Filtros de presupuesto — reutilizable en ConsultaGastos y GestionPresupuesto.
 *
 * Props:
 *   filtro         → { categorias[], fechaDesde, fechaHasta }
 *   onChange(campo, valor)
 *   ordenPresupuesto / setOrdenPresupuesto → { campo, direccion }
 *   ordenGasto     / setOrdenGasto         → { campo, direccion } (opcional)
 *   opcionesCategorias → [{ value, label }]
 *   mostrarOrdenGasto  → bool (default true)
 */
function PresupuestoFiltros({
                                filtro,
                                onChange,
                                ordenPresupuesto,
                                setOrdenPresupuesto,
                                ordenGasto,
                                setOrdenGasto,
                                opcionesCategorias = [],
                                mostrarOrdenGasto  = true,
                            }) {
    const opcionesOrden = (campo) =>
        campo === "monto"
            ? [{ value: "desc", label: "Mayor a menor" }, { value: "asc", label: "Menor a mayor" }]
            : [{ value: "desc", label: "Más reciente primero" }, { value: "asc", label: "Más antiguo primero" }];

    return (
        <div className="filtros-presupuesto">

            {/* ── Categorías ── */}
            <div className="consulta-grid-filtros">
                <div className="gasto-form-item">
                    <label>Categorías</label>
                    <Select
                        options={opcionesCategorias}
                        isMulti
                        isClearable
                        placeholder="Todas las categorías"
                        value={opcionesCategorias.filter(c => filtro.categorias?.includes(c.value))}
                        onChange={opt => onChange("categorias", opt ? opt.map(o => o.value) : [])}
                        closeMenuOnSelect={false}
                    />
                </div>

                <div className="gasto-form-item">
                    <label>Fecha desde</label>
                    <input
                        type="date"
                        className="gestion-gastos-select"
                        value={filtro.fechaDesde || ""}
                        onChange={e => onChange("fechaDesde", e.target.value || null)}
                    />
                </div>

                <div className="gasto-form-item">
                    <label>Fecha hasta</label>
                    <input
                        type="date"
                        className="gestion-gastos-select"
                        value={filtro.fechaHasta || ""}
                        onChange={e => onChange("fechaHasta", e.target.value || null)}
                    />
                </div>
            </div>

            {/* ── Orden presupuestos ── */}
            <h3 className="gestion-gastos-subtitle">Ordenar presupuestos</h3>
            <div className="consulta-grid-filtros">
                <select
                    className="gestion-gastos-select"
                    value={ordenPresupuesto.campo}
                    onChange={e => setOrdenPresupuesto(prev => ({ ...prev, campo: e.target.value }))}
                >
                    <option value="fecha">Fecha de asignación</option>
                    <option value="monto">Monto asignado</option>
                </select>

                <select
                    className="gestion-gastos-select"
                    value={ordenPresupuesto.direccion}
                    onChange={e => setOrdenPresupuesto(prev => ({ ...prev, direccion: e.target.value }))}
                >
                    {opcionesOrden(ordenPresupuesto.campo).map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>

            {/* ── Orden gastos (opcional) ── */}
            {mostrarOrdenGasto && ordenGasto && setOrdenGasto && (
                <>
                    <h3 className="gestion-gastos-subtitle">Ordenar gastos</h3>
                    <div className="consulta-grid-filtros">
                        <select
                            className="gestion-gastos-select"
                            value={ordenGasto.campo}
                            onChange={e => setOrdenGasto(prev => ({ ...prev, campo: e.target.value }))}
                        >
                            <option value="fecha">Fecha del gasto</option>
                            <option value="monto">Monto</option>
                        </select>

                        <select
                            className="gestion-gastos-select"
                            value={ordenGasto.direccion}
                            onChange={e => setOrdenGasto(prev => ({ ...prev, direccion: e.target.value }))}
                        >
                            {opcionesOrden(ordenGasto.campo).map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                </>
            )}
        </div>
    );
}

export default PresupuestoFiltros;