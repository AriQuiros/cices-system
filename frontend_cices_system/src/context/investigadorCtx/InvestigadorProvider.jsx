import { useState } from "react";
import { InvestigadorContext } from "./InvestigadorContext.jsx";
import { InvestigadorDTO, TituloDTO, CertificacionDTO } from "../../modelos/investigadorDTO.jsx";

export const InvestigadorProvider = ({ children }) => {
    const [investigador, setInvestigador] = useState({ ...InvestigadorDTO });

    const actualizarCampo = (campo, valor) => {
        setInvestigador(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    /* =========================
      FUNCIONES GENERICAS
   ========================= */
    const agregarItem = (campoArray, dtoBase) => {
        setInvestigador(prev => ({
            ...prev,
            [campoArray]: [...prev[campoArray], { ...dtoBase }]
        }));
    };

    const actualizarItem = (campoArray, index, campo, valor) => {
        setInvestigador(prev => {
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
        setInvestigador(prev => ({
            ...prev,
            [campoArray]: prev[campoArray].filter((_, i) => i !== index)
        }));
    };

    const limpiarInvestigador = () => {
        setInvestigador({ ...InvestigadorDTO });
    };

    return (
        <InvestigadorContext.Provider
            value={{
                investigador,
                actualizarCampo,
                agregarItem,
                actualizarItem,
                eliminarItem,
                limpiarInvestigador
            }}
        >
            {children}
        </InvestigadorContext.Provider>
    );
};