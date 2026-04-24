import {formatearFechaCR} from "../../../utils/formatoFecha.js";

const PresupuestoResumen = ({ presupuesto }) => {
    if (!presupuesto) return null;

    const esFinanciero = presupuesto?.tipoPresupuesto === "Financiero";
    const esHoras = presupuesto?.tipoPresupuesto === "Horas";

    return (
        <div>
            <p>Tipo Presupuesto: {presupuesto?.tipoPresupuesto}</p>
            <p>Categoria: {presupuesto?.categoria}</p>
            <p>Descripción: {presupuesto?.descripcion || 'Sin descripción'}</p>
            <p>Fecha Asignación: {formatearFechaCR(presupuesto?.fechaAsignacion)}</p>

            {/* Financiero */}
            {esFinanciero && (
                <>
                    <p>Monto asignado: ₡{presupuesto?.montoAsignado?.toLocaleString("es-CR")}</p>
                    <p>Total usado: ₡{presupuesto?.resumen?.totalUsado?.toLocaleString("es-CR")}</p>
                    <p>Disponible: ₡{presupuesto?.resumen?.disponible?.toLocaleString("es-CR")}</p>
                    <p>Cantidad de gastos: {presupuesto?.resumen?.cantidad}</p>
                </>
            )}

            {/* Horas */}
            {esHoras && (
                <>
                    <p>Horas por mes: {presupuesto?.cantidadHorasMes?.toLocaleString("es-CR")}</p>
                    <p>Cantidad de meses: {presupuesto?.cantidadMeses?.toLocaleString("es-CR")}</p>
                    <p>Total de horas asignadas: {presupuesto?.resumen?.totalAsignado?.toLocaleString("es-CR")}</p>
                    <p>Total usadas: {presupuesto?.resumen?.totalUsado?.toLocaleString("es-CR")}</p>
                    <p>Disponible: {presupuesto?.resumen?.disponible?.toLocaleString("es-CR")}</p>
                    <p>Cantidad de horas asignadas: {presupuesto?.resumen?.cantidad}</p>
                </>
            )}
        </div>
    );
};

export default PresupuestoResumen;