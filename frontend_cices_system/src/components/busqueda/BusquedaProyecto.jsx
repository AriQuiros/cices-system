import { useContext, useState } from "react";
import Select from "react-select";
import { AppContext } from "../../context/AppContext.jsx";
import { useProyectosResumen } from "../../hooks/proyectoHooks/queries/useProyectosResumen.js"; // ← nuevo
import { useProyectosInvestigador } from "../../hooks/investigadorProyectoHooks/queries/useProyectosInvestigador.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { useAuth } from "../../hooks/authHooks/useAuth.js";
import {formatearFechaCR} from "../../utils/formatoFechaCR.js";
import "./BusquedaProyecto.css";

const BuscadorProyecto = ({ onSelect, soloPrincipalOPermiso = false }) => {
    const { user }          = useContext(AppContext);
    const { esInvestigador } = useAuth();

    const roles         = user?.roles || [];
    const tieneRolAdmin = roles.some(r =>
        ["DIRECCION", "ADMINISTRATIVO", "ASISTENTE"].includes(r)
    );
    const usarEndpointInvestigador =
        soloPrincipalOPermiso || (esInvestigador && !tieneRolAdmin);

    const [inputText, setInputText] = useState("");
    const [selected,  setSelected]  = useState(null);

    const textoDebounced = useDebounce(inputText, 400);
    const pageable       = { page: 0, size: 8 };

    // ← reemplaza useProyectos (filtro completo) por useProyectosResumen (ligero)
    const queryAdmin = useProyectosResumen(textoDebounced, pageable, {
        enabled: !usarEndpointInvestigador
    });

    const queryInv = useProyectosInvestigador(
        textoDebounced,
        soloPrincipalOPermiso,
        pageable,
        { enabled: usarEndpointInvestigador }
    );

    const queryActiva = usarEndpointInvestigador ? queryInv : queryAdmin;
    const rawData     = queryActiva.data?.data ?? queryActiva.data ?? {};
    const lista       = rawData.content ?? rawData ?? [];

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
                    textoDebounced.length === 0 ? "Escribir para buscar" : "No hay coincidencias"
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
                filterOption={() => true}
            />
            {selected && (
                <div className="buscador-info">
                    <p>
                        <b>Fecha inicio:</b> {formatearFechaCR(selected.value.fechaInicio)} |{" "}
                        <b>Fecha fin:</b> {formatearFechaCR(selected.value.fechaFinalizacion)}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BuscadorProyecto;