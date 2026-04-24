import { useMutation } from "@tanstack/react-query";
import { forgotPasswordSrv } from "../services/authService";

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPasswordSrv
    });
};