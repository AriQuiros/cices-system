export async function fetchTiposCatalogo(token, tiposArray) {
    const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

    try {
        const response = await fetch(`${API}/api/catalogos/tipos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(tiposArray)
        });

        if (!response.ok) {
            alert("Error: " + response.status);
            return null;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error al obtener tipos:", error);
        alert("Error al conectar con el servidor");
        return null;
    }
}