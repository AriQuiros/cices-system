import { useMutation } from "@tanstack/react-query";
import { loginSrv } from "../services/authService";
import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";

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