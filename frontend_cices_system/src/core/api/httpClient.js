import axios from "axios";
import { getToken } from "../auth/tokenProvider";

const httpClient = axios.create({
    baseURL: "/api"
});

httpClient.interceptors.request.use((config) => {

    const rutasPublicas = [
        "/auth/login",
        "/auth/forgot-password",
        "/auth/reset-password",
        "/investigadores/registro",
        "/empleados/registro"
    ];

    const esPublica = rutasPublicas.some((ruta) =>
        config.url?.includes(ruta)
    );

    if (!esPublica) {
        const token = getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

export default httpClient;