import { useMutation } from "@tanstack/react-query";
import { forgotPasswordSrv } from "../../../services/authServices/authService.js";

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPasswordSrv
    });
};