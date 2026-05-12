export const required = (msg = "No puede ser vacío") => v =>
    v !== undefined && v !== null && v.toString().trim() !== ""
        ? ""
        : msg;

export const minLength = (min, msg) => v =>
    !v || v.length >= min
        ? ""
        : msg || `Mínimo ${min} caracteres`;

export const maxLength = (max, msg) => v =>
    !v || v.length <= max-1
        ? ""
        : msg || `Máximo ${max} caracteres`;

export const min = (minValue, msg) => v =>
    v === "" || Number(v) >= minValue
        ? ""
        : msg || `Debe ser mayor o igual a ${minValue}`;

export const max = (maxValue, msg) => v =>
    v === "" || Number(v) <= maxValue
        ? ""
        : msg || `Debe ser menor o igual a ${maxValue}`;

export const pattern = (regex, msg) => v =>
    !v || regex.test(v)
        ? ""
        : msg || "Formato inválido";

export const fechaMayorIgualQue = (fechaRef, msg) => v => {

    // si no hay valor, no validar aquí
    if (!v) return "";

    // si no hay fecha referencia, no comparar
    if (!fechaRef) return "";

    return new Date(v) >= new Date(fechaRef)
        ? ""
        : msg || `Debe ser mayor o igual a ${fechaRef}`;
};

export const fechaMenorIgualQue = (fechaRef, msg) => v => {

    if (!v) return "";

    if (!fechaRef) return "";

    return new Date(v) <= new Date(fechaRef)
        ? ""
        : msg || `Debe ser menor o igual a ${fechaRef}`;
};

export const correoUCR = (msg) => v =>
    !v || v.endsWith("@ucr.ac.cr")
        ? ""
        : msg || "Debe terminar en @ucr.ac.cr";

export const match = (getValue, msg) => v =>
    v === getValue()
        ? ""
        : msg || "Los valores no coinciden";