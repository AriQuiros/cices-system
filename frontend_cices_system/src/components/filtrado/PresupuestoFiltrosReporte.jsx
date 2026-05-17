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
                                       opcionesCategorias = [],
                                       ANIO_MIN = 2020,
                                       ANIO_MAX = new Date().getFullYear()
                                   }) {

    const opcionesAnio = Array.from(
        { length: ANIO_MAX - ANIO_MIN + 1 },
        (_, i) => ({ value: ANIO_MIN + i, label: String(ANIO_MIN + i) })
    ).reverse();

    const handleAnioDesde = (opt) => {
        const val = opt?.value ?? ANIO_MIN;
        onChange("anioDesde", val);
        if (filtros.anioHasta && val > filtros.anioHasta) onChange("anioHasta", val);
    };

    const handleAnioHasta = (opt) => {
        const val = opt?.value ?? ANIO_MAX;
        onChange("anioHasta", val);
        if (filtros.anioDesde && val < filtros.anioDesde) onChange("anioDesde", val);
    };

    return (
        <div className="filtros-presupuesto">
            <div style={{ marginBottom: "8px" }}>
                <h4 style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Filtros de presupuesto</h4>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "#666" }}>
                    El filtro por año actúa como un corte temporal sobre la fecha de asignación del presupuesto,
                    permitiendo acotar los resultados a un rango anual específico.
                </p>
            </div>
            <div className="consulta-grid-filtros">

                <div className="gasto-form-item">
                    <label>Tipo de presupuesto</label>
                    <select
                        className="gestion-gastos-select"
                        value={filtros.tipoPresupuesto || ""}
                        onChange={e =>
                            onChange(
                                "tipoPresupuesto",
                                e.target.value || null
                            )
                        }
                    >
                        <option value="">Todos</option>
                        {opcionesTiposPresupuesto.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
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

                {/* ── Año desde ── */}
                <div className="gasto-form-item">
                    <label>Año desde</label>
                    <Select
                        options={opcionesAnio}
                        value={opcionesAnio.find(o => o.value === filtros.anioDesde) ?? null}
                        onChange={handleAnioDesde}
                        placeholder="Año desde"
                        maxMenuHeight={220}
                        isSearchable
                        className="select-campo"
                        classNamePrefix="select"
                    />
                </div>

                {/* ── Año hasta ── */}
                <div className="gasto-form-item">
                    <label>Año hasta</label>
                    <Select
                        options={opcionesAnio.filter(o => o.value >= (filtros.anioDesde ?? ANIO_MIN))}
                        value={opcionesAnio.find(o => o.value === filtros.anioHasta) ?? null}
                        onChange={handleAnioHasta}
                        placeholder="Año hasta"
                        maxMenuHeight={220}
                        isSearchable
                        className="select-campo"
                        classNamePrefix="select"
                    />
                </div>

            </div>
        </div>
    );
}

export default PresupuestoFiltrosReporte;