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
                <p><strong>Categoría:</strong> {presupuesto?.categoria}</p>
            )}

            <p><strong>Descripción:</strong> {presupuesto?.descripcion || 'Sin descripción'}</p>
            <p><strong>Fecha de asignación:</strong> {formatearFechaCR(presupuesto?.fechaAsignacion)}</p>

            {/* Financiero */}
            {esFinanciero && (
                <>
                    <p><strong>Fuente de financiamiento:</strong> {presupuesto?.fuenteFinanciamiento}</p>
                    <p><strong>Monto asignado:</strong> {formatearMonedaCR(presupuesto?.montoAsignado)}</p>
                    <p><strong>Total usado:</strong> {formatearMonedaCR(presupuesto?.resumen?.totalUsado)}</p>
                    <p><strong>Disponible:</strong> {formatearMonedaCR(presupuesto?.resumen?.disponible)}</p>
                    <p><strong>Cantidad de gastos:</strong> {formatearNumeroCR(presupuesto?.resumen?.cantidad)}</p>
                </>
            )}

            {/* Horas */}
            {esHoras && (
                <>
                    <p><strong>Horas por mes:</strong> {formatearNumeroCR(presupuesto?.cantidadHorasMes)}</p>
                    <p><strong>Cantidad de meses:</strong> {formatearNumeroCR(presupuesto?.cantidadMeses)}</p>
                    <p><strong>Total de horas asignadas:</strong> {formatearNumeroCR(presupuesto?.resumen?.totalAsignado)}</p>
                    <p><strong>Total usadas:</strong> {formatearNumeroCR(presupuesto?.resumen?.totalUsado)}</p>
                    <p><strong>Disponible:</strong> {formatearNumeroCR(presupuesto?.resumen?.disponible)}</p>
                    <p><strong>Cantidad de horas asignadas:</strong> {formatearNumeroCR(presupuesto?.resumen?.cantidad)}</p>
                </>
            )}
        </div>
    );
};

export default PresupuestoResumen;