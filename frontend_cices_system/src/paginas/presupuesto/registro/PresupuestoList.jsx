function PresupuestoList({ presupuestos = [], onEditar }) {

    // 🔹 separar HORAS y resto
    const horas = presupuestos.filter(p => p.tipoPresupuesto?.valor === "HORAS");
    const otros = presupuestos.filter(p => p.tipoPresupuesto?.valor !== "HORAS");

    const ordenados = [...horas, ...otros];

    return (
        <div>
            <hr />
            <h3>Presupuestos existentes</h3>

            {ordenados.length === 0 && (
                <p>No hay presupuestos</p>
            )}

            {ordenados.map((p, i) => (
                <div key={i}>
                    <div>
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

                    <button onClick={() => onEditar(p, i)}>Editar</button>
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default PresupuestoList;