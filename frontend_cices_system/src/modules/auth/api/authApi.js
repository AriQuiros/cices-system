import httpClient from "../../../core/api/httpClient";

// login
export const login = (username, password) => {
    return httpClient.post("/auth/login", {
        username,
        password
    });
};

// forgot password
export const forgotPassword = (correo) => {
    return httpClient.post("/auth/forgot-password", null, {
        params: { correo }
    });
};

// reset password
export const resetPassword = (token, nuevaPassword) => {
    return httpClient.post("/auth/reset-password", {
        token,
        nuevaPassword
    });
};