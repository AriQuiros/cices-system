const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function loginRequest(username, password) {
    const payload = {
        username: username.trim(),
        password: password
    };

    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    return res;
}