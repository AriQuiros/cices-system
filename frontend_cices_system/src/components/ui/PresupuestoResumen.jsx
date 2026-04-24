const PresupuestoResumen = ({ presupuesto }) => {

    if (!presupuesto) return null;

    return (
        <div>
            <p>Tipo Presupuesto: {presupuesto?.tipoPresupuesto}</p>
            <p>Categoria: {presupuesto?.categoria}</p>
            <p>Descripción: {presupuesto?.descripcion || 'Sin descripción'}</p>
            <p>Fecha Asignación: {presupuesto?.fechaAsignacion}</p>
            <p>Monto asignado: ₡{presupuesto?.montoAsignado.toLocaleString("es-CR")}</p>
            <p>Total usado: ₡{presupuesto?.resumen?.totalUsado.toLocaleString("es-CR")}</p>
            <p>Disponible: ₡{presupuesto?.resumen?.disponible.toLocaleString("es-CR")}</p>
        </div>
    );
};

export default PresupuestoResumen;