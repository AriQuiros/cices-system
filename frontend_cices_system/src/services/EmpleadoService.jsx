import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function registerEmpleado(empleado, esInvestigador) {

    const controller = esInvestigador ? "investigadores" : "empleados";

    try {

        const res = await axios.post(`${API}/${controller}/registro`, empleado);

        return { ok: true, data: res.data };

    } catch (error) {

        const message =
            error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            "Error inesperado";

        return {
            ok: false,
            status: error.response?.status || 0,
            message
        };

    }

}