export const calcularTotalHoras = (horas) => {

    return horas.reduce(
        (acc, h) => acc + ((h.cantidadHorasMes || 0) * (h.cantidadMeses || 0)),
        0
    );

};

export const calcularTotalHorasPresupuesto = (presupuesto) => {

    return (presupuesto?.cantidadHoras || 0) *
        (presupuesto?.cantidadMeses || 0);

};

export const calcularHorasRestantes = (
    presupuesto,
    horasRegistradas,
    horasFormulario,
    horasEditando = 0
) => {

    const totalPresupuesto = calcularTotalHorasPresupuesto(presupuesto);

    const totalAsignadas = calcularTotalHoras(horasRegistradas);

    const maxHoras = totalPresupuesto - totalAsignadas + horasEditando;

    const totalFormulario = calcularTotalHoras(horasFormulario);

    return maxHoras - totalFormulario;

};

export const calcularTotalGastos = (gastos) => {

    return gastos.reduce(
        (acc, g) => acc + (parseFloat(g.monto) || 0),
        0
    );

};

export const calcularPresupuestoRestante = (
    presupuesto,
    gastosRegistrados,
    gastosFormulario,
    montoEditando = 0
) => {

    const totalRegistrado = calcularTotalGastos(gastosRegistrados);

    const totalFormulario = calcularTotalGastos(gastosFormulario);

    const montoMax =
        (parseFloat(presupuesto?.monto) || 0) -
        totalRegistrado +
        montoEditando;

    return montoMax - totalFormulario;

};