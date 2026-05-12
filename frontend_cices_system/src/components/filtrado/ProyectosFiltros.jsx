import Select from "react-select";
import "./ProyectoFiltros.css"
/**
 * Filtros comunes de proyecto — reutilizable en ListadoProyectos,
 * ConsultaGastos, AsignarInvestigadores, etc.
 *
 * Props:
 *   filtros        → objeto con texto, lineas[], tipos[], estado, ordenFecha
 *   onChange(campo, valor) → setter
 *   onClear()
 *   opcionesLineas / opcionesTipos / opcionesEstado → [{ value, label }]
 *   mostrarOrden   → bool (default true)
 */
function ProyectosFiltros({
                              filtros,
                              onChange,
                              onClear,
                              opcionesLineas  = [],
                              opcionesTipos   = [],
                              opcionesEstado  = [],
                              mostrarOrden    = true,
                          }) {
    return (
        <div className="buscar row">

            <input
                className="buscador"
                type="text"
                placeholder="Código o nombre"
                value={filtros.texto || ""}
                onChange={e => onChange("texto", e.target.value)}
            />

            <Select
                classNamePrefix="react-select"
                options={opcionesLineas}
                isMulti
                isClearable
                value={opcionesLineas.filter(l => filtros.lineas?.includes(l.value))}
                onChange={opt => onChange("lineas", opt ? opt.map(o => o.value) : [])}
                placeholder="Línea(s) de investigación"
                closeMenuOnSelect={false}
            />

            <Select
                classNamePrefix="react-select"
                options={opcionesTipos}
                isMulti
                isClearable
                value={opcionesTipos.filter(t => filtros.tipos?.includes(t.value))}
                onChange={opt => onChange("tipos", opt ? opt.map(o => o.value) : [])}
                placeholder="Tipo(s) de proyecto"
                closeMenuOnSelect={false}
            />

            <select
                className="filtro"
                value={filtros.estado || ""}
                onChange={e => onChange("estado", e.target.value)}
            >
                <option value="">Estado de proyecto</option>
                {opcionesEstado.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                ))}
            </select>

            {mostrarOrden && (
                <select
                    className="filtro"
                    value={filtros.ordenFecha || "desc"}
                    onChange={e => onChange("ordenFecha", e.target.value)}
                >
                    <option value="desc">Más nuevos primero</option>
                    <option value="asc">Más antiguos primero</option>
                </select>
            )}

            <button className="boton-limpiar" onClick={onClear}>Limpiar</button>
        </div>
    );
}

export default ProyectosFiltros;