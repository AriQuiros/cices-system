import { useMutation } from "@tanstack/react-query";
import { resetPasswordSrv } from "../services/authService";

export const useResetPassword = () => {
    return useMutation({
        mutationFn: ({ token, password }) =>
            resetPasswordSrv(token, password)
    });
};