// src/components/BusquedaProyecto.jsx
import { useContext, useState } from "react";
import Select from "react-select";
import { AppContext } from "../../../context/AppContext.jsx";
import { useProyectos } from "../../../modules/proyecto/hooks/queries/useProyectos.js";
import { useProyectosInvestigador } from "../../../modules/investigadorProyecto/hooks/queries/useProyectosInvestigador.js";
import { useDebounce } from "../../../hooks/useDebounce.js";
import "./BusquedaProyecto.css";

// El componente ya no recibe token/user/principal como props.
// onSelect sigue igual: recibe el objeto proyecto o null.
const BuscadorProyecto = ({ onSelect, soloPrincipalOPermiso = false }) => {

    const { user } = useContext(AppContext);

    const roles = user?.roles || [];
    const esInvestigador = roles.includes("INVESTIGADOR");
    const tieneRolAdmin  = roles.some(r =>
        ["DIRECCION", "ADMINISTRATIVO", "ASISTENTE"].includes(r)
    );
    // Solo usa el endpoint de investigador si NO tiene ningún rol admin
    const usarEndpointInvestigador =
        soloPrincipalOPermiso || (esInvestigador && !tieneRolAdmin);

    const [inputText, setInputText]   = useState("");
    const [selected,  setSelected]    = useState(null);

    const textoDebounced = useDebounce(inputText, 400);

    const pageable = { page: 0, size: 8 };

    // ── Query admins ──────────────────────────────────────────────────
    const filtroAdmin = { texto: textoDebounced };
    const queryAdmin = useProyectos(filtroAdmin, pageable, {
        enabled: !usarEndpointInvestigador
    });

    const queryInv = useProyectosInvestigador(
        textoDebounced,
        soloPrincipalOPermiso,
        pageable,
        {
            enabled: usarEndpointInvestigador
        }
    );
    // Datos activos según rol
    const queryActiva  = usarEndpointInvestigador ? queryInv : queryAdmin;
    const rawData      = queryActiva.data?.data ?? queryActiva.data ?? {};

    // Ambos endpoints devuelven Page<ProyectoFechasDTO>:
    // { codigoProyecto, nombreProyecto, fechaInicio, fechaFinalizacion }
    const lista = rawData.content ?? rawData ?? [];

    const options = (Array.isArray(lista) ? lista : []).map(p => ({
        value: p,
        label: `${p.codigoProyecto} — ${p.nombreProyecto}`
    }));

    const handleChange = (option) => {
        setSelected(option);
        onSelect?.(option?.value || null);
    };

    return (
        <div className="buscador-proyecto">
            <h3>Buscar proyecto</h3>

            <Select
                className="buscador-select"
                classNamePrefix="buscador"
                placeholder="Buscar proyecto..."
                value={selected}
                options={options}
                isSearchable
                isClearable
                isLoading={queryActiva.isLoading}
                noOptionsMessage={() =>
                    textoDebounced.length === 0
                        ? "Escribir para buscar"
                        : "No hay coincidencias"
                }
                onChange={handleChange}
                onInputChange={(inputValue, { action }) => {
                    if (action === "input-change") {
                        setInputText(inputValue);
                        setSelected(null);
                        onSelect?.(null);
                    }
                    return inputValue;
                }}
                filterOption={() => true} // el filtrado lo hace el backend
            />

            {selected && (
                <div className="buscador-info">
                    <p>
                        <b>Fecha inicio:</b> {selected.value.fechaInicio} |{" "}
                        <b>Fecha finalización:</b> {selected.value.fechaFinalizacion}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BuscadorProyecto;