import { InvestigadorContext } from "./InvestigadorContext.jsx";
import { InvestigadorDTO } from "../../modelos/investigadorDTO.jsx";
import { useDTO } from "../utils/useDTO.js";

export const InvestigadorProvider = ({ children }) => {

    const investigadorState = useDTO(InvestigadorDTO);

    const agregarItem = (campoArray, dtoBase) => {

        investigadorState.setData(prev => ({
            ...prev,
            [campoArray]: [...prev[campoArray], { ...dtoBase }]
        }));
    };

    const actualizarItem = (campoArray, index, campo, valor) => {

        investigadorState.setData(prev => {

            const nuevos = [...prev[campoArray]];

            nuevos[index] = {
                ...nuevos[index],
                [campo]: valor
            };

            return {
                ...prev,
                [campoArray]: nuevos
            };
        });
    };

    const eliminarItem = (campoArray, index) => {

        investigadorState.setData(prev => ({
            ...prev,
            [campoArray]: prev[campoArray].filter((_, i) => i !== index)
        }));
    };

    return (
        <InvestigadorContext.Provider
            value={{
                investigador: investigadorState.data,
                setInvestigador: investigadorState.setData,
                actualizarCampo: investigadorState.actualizarCampo,
                limpiarInvestigador: investigadorState.limpiar,
                agregarItem,
                actualizarItem,
                eliminarItem
            }}
        >
            {children}
        </InvestigadorContext.Provider>
    );
};