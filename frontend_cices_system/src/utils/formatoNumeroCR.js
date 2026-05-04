export const formatearNumeroCR = (
    valor,
    {
        tipo = "numero", // "numero" | "moneda"
        moneda = "CRC",
        minDecimales = 0,
        maxDecimales = 0
    } = {}
) => {
    if (valor === null || valor === undefined || isNaN(valor)) return "";

    const numero = Number(valor);

    const opciones = {
        minimumFractionDigits: minDecimales,
        maximumFractionDigits: maxDecimales
    };

    if (tipo === "moneda") {
        opciones.style = "currency";
        opciones.currency = moneda;
    }

    return new Intl.NumberFormat("es-CR", opciones).format(numero);
};

export const formatearMonedaCR = (valor) =>
    formatearNumeroCR(valor, {
        tipo: "moneda",
        moneda: "CRC",
        minDecimales: 2,
        maxDecimales: 5
    });