import { login, forgotPassword, resetPassword } from "../api/authApi";

// login
export const loginSrv = async (username, password) => {
    const res = await login(username, password);
    return res.data;
};

// forgot password
export const forgotPasswordSrv = async (correo) => {
    const res = await forgotPassword(correo);
    return res.data;
};

// reset password
export const resetPasswordSrv = async (token, pass) => {
    const res = await resetPassword(token, pass);
    return res.data;
};