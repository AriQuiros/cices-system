import { useMutation } from "@tanstack/react-query";
import { loginSrv } from "../../../services/authServices/authService.js";
import { useContext } from "react";
import { AppContext } from "../../../context/AppContext.jsx";

export const useLogin = () => {
    const { login } = useContext(AppContext);

    return useMutation({
        mutationFn: ({ username, password }) =>
            loginSrv(username, password),

        onSuccess: (data, variables) => {
            login(data.user, data.token, true);
        }
    });
};