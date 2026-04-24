export const getToken = () => {
    try {
        const raw =
            sessionStorage.getItem("auth") ||
            localStorage.getItem("auth");

        if (!raw) return null;

        const parsed = JSON.parse(raw);
        return parsed?.token ?? null;
    } catch {
        return null;
    }
};