import {formatearFechaCR} from "../../utils/formatoFechaCR.js";
import {formatearMonedaCR, formatearNumeroCR} from "../../utils/formatoNumeroCR.js";
import "../../pages/gasto/GestionGastos.css";

const PresupuestoResumen = ({ presupuesto }) => {
    if (!presupuesto) return null;

    const esFinanciero = presupuesto?.tipoPresupuesto === "Financiero";
    const esHoras = presupuesto?.tipoPresupuesto === "Horas";

    return (
        <div className="gestion-gastos-resumen">
            {esFinanciero && (
                <p>Categoria: {presupuesto?.categoria}</p>
            )}

            <p>Descripción: {presupuesto?.descripcion || 'Sin descripción'}</p>
            <p>Fecha Asignación: {formatearFechaCR(presupuesto?.fechaAsignacion)}</p>

            {/* Financiero */}
            {esFinanciero && (
                <>
                    <p>Fuente de financiamiento: {presupuesto?.fuenteFinanciamiento}</p>
                    <p>Monto asignado: {formatearMonedaCR(presupuesto?.montoAsignado)}</p>
                    <p>Total usado: {formatearMonedaCR(presupuesto?.resumen?.totalUsado)}</p>
                    <p>Disponible: {formatearMonedaCR(presupuesto?.resumen?.disponible)}</p>
                    <p>Cantidad de gastos: {formatearNumeroCR(presupuesto?.resumen?.cantidad)}</p>
                </>
            )}

            {/* Horas */}
            {esHoras && (
                <>
                    <p>Horas por mes: {formatearNumeroCR(presupuesto?.cantidadHorasMes)}</p>
                    <p>Cantidad de meses: {formatearNumeroCR(presupuesto?.cantidadMeses)}</p>
                    <p>Total de horas asignadas: {formatearNumeroCR(presupuesto?.resumen?.totalAsignado)}</p>
                    <p>Total usadas: {formatearNumeroCR(presupuesto?.resumen?.totalUsado)}</p>
                    <p>Disponible: {formatearNumeroCR(presupuesto?.resumen?.disponible)}</p>
                    <p>Cantidad de horas asignadas: {formatearNumeroCR(presupuesto?.resumen?.cantidad)}</p>
                </>
            )}
        </div>
    );
};

export default PresupuestoResumen;