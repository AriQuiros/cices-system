import axios from "axios";
import { getToken } from "../auth/tokenProvider";

const httpClient = axios.create({
    baseURL: "/api"
});

httpClient.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default httpClient;