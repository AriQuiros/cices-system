export const getErrorMessage = (error) => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Error inesperado"
    );
};
/*
httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // logout automático
        }

        return Promise.reject(error);
    }
);*/