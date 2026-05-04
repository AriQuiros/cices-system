const ROLES_RESTRINGIDOS = new Set(["DIRECCION", "ADMINISTRATIVO", "ASISTENTE"]);

export const normalizarNombreRol = (nombreRol = "") =>
    nombreRol
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();

export const combinacionRolesValida = (roles = []) => {
    const nombres = roles.map((r) => normalizarNombreRol(r?.nombreRol));
    const incluyeInvestigador = nombres.includes("INVESTIGADOR");

    if (roles.length > 2) {
        return { valida: false, mensaje: "Solo se permiten máximo 2 roles" };
    }

    if (roles.length === 2 && !incluyeInvestigador) {
        return {
            valida: false,
            mensaje: "La combinación permitida es INVESTIGADOR y un rol adicional"
        };
    }

    const incluyeRolRestringido = nombres.some((nombre) =>
        ROLES_RESTRINGIDOS.has(nombre)
    );

    const mezclaInvalida =
        incluyeRolRestringido &&
        nombres.some(
            (nombre) =>
                nombre !== "INVESTIGADOR" &&
                !ROLES_RESTRINGIDOS.has(nombre)
        );

    if (mezclaInvalida) {
        return {
            valida: false,
            mensaje:
                "DIRECCION, ADMINISTRATIVO y ASISTENTE solo se pueden combinar con INVESTIGADOR"
        };
    }

    return { valida: true, mensaje: "" };
};