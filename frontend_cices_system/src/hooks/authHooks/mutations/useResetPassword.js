import { useMutation } from "@tanstack/react-query";
import { resetPasswordSrv } from "../../../services/authServices/authService.js";

export const useResetPassword = () => {
    return useMutation({
        mutationFn: ({ token, password }) =>
            resetPasswordSrv(token, password)
    });
};