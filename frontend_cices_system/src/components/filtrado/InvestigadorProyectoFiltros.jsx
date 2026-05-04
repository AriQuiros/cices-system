import Select from "react-select";

/**
 * Filtros extra de participación — solo se monta en vista "mis proyectos".
 *
 * Props:
 *   filtro        → { rol, desde, hasta }
 *   onChange(campo, valor)
 *   opcionesRoles → [{ value, label }]
 */
function InvestigadorProyectoFiltros({ filtro, onChange, opcionesRoles = [] }) {
    return (
        <div className="buscar row filtros-inv">

            <Select
                classNamePrefix="react-select"
                options={opcionesRoles}
                isClearable
                value={opcionesRoles.find(r => r.value === filtro.rol) || null}
                onChange={opt => onChange("rol", opt?.value || "")}
                placeholder="Rol en el proyecto"
            />

            <div className="filtro-fecha-grupo">
                <label>Participación desde</label>
                <input
                    type="date"
                    className="filtro"
                    value={filtro.desde || ""}
                    onChange={e => onChange("desde", e.target.value || null)}
                />
            </div>

            <div className="filtro-fecha-grupo">
                <label>Participación hasta</label>
                <input
                    type="date"
                    className="filtro"
                    value={filtro.hasta || ""}
                    onChange={e => onChange("hasta", e.target.value || null)}
                />
            </div>

        </div>
    );
}

export default InvestigadorProyectoFiltros;