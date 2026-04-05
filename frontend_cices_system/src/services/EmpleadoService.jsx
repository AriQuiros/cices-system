import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const apiClient = axios.create({
    baseURL: API
});

const getControllerByRoles = (roles = []) => {
    const esInvestigador = roles.some(
        (r) => r === "INVESTIGADOR" || r?.nombreRol === "INVESTIGADOR"
    );

    return esInvestigador ? "investigadores" : "empleados";
};


// 🔹 obtener perfil
export async function getPerfil(roles, token) {
    const controller = getControllerByRoles(roles);

    try {
        const res = await apiClient.get(`/${controller}/perfil`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { ok: true, data: res.data };

    } catch (error) {
        return {
            ok: false,
            message: error.response?.data?.message || "Error obteniendo perfil"
        };
    }
}


// 🔹 actualizar perfil
export async function updatePerfil(payload, roles) {

    const controller = getControllerByRoles(roles);

    try {
        const res = await apiClient.put(`/${controller}/actualizar`, payload);
        return { ok: true, data: res.data };

    } catch (error) {
        return {
            ok: false,
            message: error.response?.data?.message || "Error actualizando perfil"
        };
    }
}

export const buildPayloadRegistro = ({ empleado, usuario, investigador }) => {

    const roles = usuario.roles || [];

    const esInvestigador = roles.some(
        r => r.nombreRol === "INVESTIGADOR"
    );

    if (esInvestigador) {
        return {
            ...investigador,
            empleado: {
                ...empleado,
                usuario
            }
        };
    }

    return {
        ...empleado,
        usuario
    };
};

export async function registerEmpleado(payload, roles) {

    const controller = getControllerByRoles(roles);

    try {

        const res = await apiClient.post(`/${controller}/registro`, payload);

        return { ok: true, data: res.data };

    } catch (error) {

        return {
            ok: false,
            status: error.response?.status || 0,
            message:
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Error en registro"
        };
    }
}