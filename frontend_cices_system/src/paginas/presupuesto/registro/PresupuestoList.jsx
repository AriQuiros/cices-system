function PresupuestoList({ presupuestos = [], onEditar }) {

    // 🔹 separar HORAS y resto
    const horas = presupuestos.filter(p => p.tipoPresupuesto?.valor === "HORAS");
    const otros = presupuestos.filter(p => p.tipoPresupuesto?.valor !== "HORAS");

    const ordenados = [...horas, ...otros];

    return (
        <div className="presupuesto-list">
            <h3 className="presupuesto-list-title">Presupuestos existentes</h3>

            {ordenados.length === 0 && (
                <p className="presupuesto-empty">No hay presupuestos</p>
            )}

            {ordenados.map((p, i) => (
                <div key={i} className="presupuesto-list-item">
                    <div className="presupuesto-list-item-content">
                        <p><b>Tipo:</b> {p.tipoPresupuesto?.despliegue || "-"}</p>
                        <p><b>Categoría:</b> {p.categoria?.despliegue || "-"}</p>
                        <p><b>Fecha de Asignación:</b> {p.fechaAsignacion || "-"}</p>

                        {p.tipoPresupuesto?.valor === "FINANCIERO" && (
                            <>
                                <p><b>Fuente de Financiamiento:</b> {p.fuenteFinanciamiento?.despliegue || "-"}</p>
                                <p><b>Monto:</b> ₡{p.monto ?? 0}</p>
                            </>
                        )}

                        {p.tipoPresupuesto?.valor === "HORAS" && (
                            <p><b>Horas:</b> {p.cantidadHorasMes ?? 0} x {p.cantidadMeses ?? 0} meses</p>
                        )}

                        <p><b>Descripción:</b> {p.descripcion || "-"}</p>
                    </div>

                    <button className="btn-accion secundario" type="button" onClick={() => onEditar(p, i)}>Editar</button>
                </div>
            ))}
        </div>
    );
}

export default PresupuestoList;