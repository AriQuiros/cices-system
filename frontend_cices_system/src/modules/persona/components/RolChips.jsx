// src/modules/persona/components/RolChips.jsx

// Paleta de colores por nombre de rol (case-insensitive)
const PALETA_ROLES = {
    "INVESTIGADOR":   { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
    "DIRECTOR":       { bg: "#fce7f3", color: "#9d174d", border: "#fbcfe8" },
    "ADMINISTRATIVO": { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
    "ASISTENTE":      { bg: "#fef9c3", color: "#854d0e", border: "#fde68a" },
    "COORDINADOR":    { bg: "#ede9fe", color: "#5b21b6", border: "#ddd6fe" }
};

const colorPorRol = (rol = "") => {
    const key = rol.toUpperCase().trim();
    return PALETA_ROLES[key] || { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
};

export function RolChips({ roles = [] }) {
    if (!roles || roles.length === 0) return <span className="persona-sin-rol">—</span>;

    return (
        <div className="persona-rol-chips">
            {roles.map(rol => {
                const estilos = colorPorRol(rol);
                return (
                    <span
                        key={rol}
                        className="persona-rol-chip"
                        style={{
                            backgroundColor: estilos.bg,
                            color: estilos.color,
                            border: `1px solid ${estilos.border}`
                        }}
                    >
                        {rol}
                    </span>
                );
            })}
        </div>
    );
}