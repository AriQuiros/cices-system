import Select from "react-select";

function FiltrosProyectos({
                              filtros,
                              onChange,
                              onClear,
                              orden,
                              setOrden,
                              opcionesLineas = [],
                              opcionesTipos = [],
                              opcionesEstado = [],
                              mostrarOrden = true
                          }) {

    const manejarMultiSelect = (campo, selectedOptions) => {
        onChange(campo, selectedOptions ? selectedOptions.map(o => o.value) : []);
    };

    return (
        <div className="buscar row">

            {/* Buscador */}
            <input
                className="buscador"
                type="text"
                placeholder="Código o nombre"
                value={filtros.texto || ""}
                onChange={(e) => onChange("texto", e.target.value)}
            />

            {/* Líneas */}
            <Select
                classNamePrefix="react-select"
                options={opcionesLineas}
                isMulti
                value={opcionesLineas.filter(l => filtros.lineaInvestigacion?.includes(l.value))}
                onChange={(opt) => manejarMultiSelect("lineaInvestigacion", opt)}
                placeholder="Línea(s) de investigación"
                closeMenuOnSelect={false}
            />

            {/* Tipos */}
            <Select
                classNamePrefix="react-select"
                options={opcionesTipos}
                isMulti
                value={opcionesTipos.filter(t => filtros.tipoProyecto?.includes(t.value))}
                onChange={(opt) => manejarMultiSelect("tipoProyecto", opt)}
                placeholder="Tipo(s) de proyecto"
                closeMenuOnSelect={false}
            />

            {/* Estado */}
            <select
                className="filtro"
                value={filtros.estado || ""}
                onChange={(e) => onChange("estado", e.target.value)}
            >
                <option value="">Estado de proyecto</option>
                {opcionesEstado.map(op => (
                    <option key={op.id} value={op.id}>
                        {op.despliegue}
                    </option>
                ))}
            </select>

            {/* Orden (opcional) */}
            {mostrarOrden && (
                <select
                    className="filtro"
                    value={`${orden.campo}_${orden.asc ? "asc" : "desc"}`}
                    onChange={e => {
                        const [campo, dir] = e.target.value.split("_");
                        setOrden({ campo, asc: dir === "asc" });
                    }}
                >
                    <option value="fechaInicio_desc">Proyectos más nuevos</option>
                    <option value="fechaInicio_asc">Proyectos más antiguos</option>
                    <option value="fechaFinalizacion_desc">Fecha fin lejana</option>
                    <option value="fechaFinalizacion_asc">Finalizados / próximos</option>
                </select>
            )}

            {/* Limpiar */}
            <button className="boton-limpiar" onClick={onClear}>
                Limpiar
            </button>

        </div>

    );
}

export default FiltrosProyectos;