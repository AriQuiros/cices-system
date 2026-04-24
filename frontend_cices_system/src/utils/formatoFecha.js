const parseFecha = (fecha) => {
    if (!fecha) return null;

    // Si ya es Date
    if (fecha instanceof Date) return fecha;

    // Si viene como string tipo "YYYY-MM-DD"
    return new Date(fecha + "T00:00:00"); // evita problemas de zona horaria
};

export const formatearFecha = (fecha) => {
    const f = parseFecha(fecha);
    if (!f) return "";

    return f.toLocaleDateString("es-CR");
};

export const obtenerAnio = (fecha) => {
    const f = parseFecha(fecha);
    return f ? f.getFullYear() : "";
};