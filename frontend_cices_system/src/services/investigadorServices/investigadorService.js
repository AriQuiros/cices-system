import {
    crearInvestigador,
    buscarInvestigadores,
    obtenerPerfilInvestigador,
    actualizarInvestigador
} from "../../api/personaApi/investigadorApi.js";

// Registrar investigador (DTO complejo)
export const registrarInvestigador = async (dto) => {
    // aquí podrías validar o limpiar datos si quieres
    const res = await crearInvestigador(dto);
    return res.data; // id
};

// búsqueda por nombre (ligera)
export const buscarInvestigadoresSrv = async (nombre) => {
    const res = await buscarInvestigadores(nombre);
    return res.data;
};

// perfil
export const obtenerPerfilInvestigadorSrv = async () => {
    const res = await obtenerPerfilInvestigador();
    return res.data;
};

// actualizar (incluye certificaciones + títulos)
export const actualizarInvestigadorSrv = async (dto) => {
    const res = await actualizarInvestigador(dto);
    return res.data;
};