// src/components/ui/Presupuesto/PresupuestoItemHora.jsx
import { useState } from "react";
import PresupuestoResumen from "../presupuestoComponents/PresupuestoResumen.jsx";
import { Pagination } from "../shared/Pagination.jsx";
import { HoraTableSoloLectura } from "./HoraTableSoloLectura.jsx";
import { useHorasPorPresupuesto } from "../../hooks/horaHooks/queries/useHorasPorPresupuesto.js";

const PresupuestoItemHora = ({ presupuesto, ordenHora }) => {

    const [pageable, setPageable] = useState({ page: 0, size: 10 });

    // Solo activa el fetch cuando el usuario pasa de página 0
    const horasQuery = useHorasPorPresupuesto(
        pageable.page > 0 ? presupuesto.id : null,
        pageable,
        ordenHora?.campo || "fechaInicio",
        ordenHora?.direccion || "desc"
    );

    // Página 0: usa las horas embebidas que vienen del endpoint /tipo/proyecto
    // Páginas > 0: usa el fetch independiente por presupuesto
    const horasActuales =
        pageable.page === 0
            ? (presupuesto.horasAsignadas || [])
            : (horasQuery.data?.lista || []);

    const totalHoras = presupuesto.resumen?.cantidad || 0;
    const totalPages = Math.ceil(totalHoras / pageable.size);

    const cambiarPagina = (nuevaPagina) => {
        setPageable(prev => ({ ...prev, page: nuevaPagina }));
    };

    return (
        <div className="presupuesto-item-wrapper">

            <PresupuestoResumen presupuesto={presupuesto} />

            {horasQuery.isLoading && pageable.page > 0 && (
                <p className="presupuesto-cargando">Cargando horas...</p>
            )}

            {horasActuales.length === 0 ? (
                <p className="presupuesto-sin-gastos">Sin horas asignadas registradas.</p>
            ) : (
                <HoraTableSoloLectura data={horasActuales} />
            )}

            <Pagination
                page={pageable.page}
                totalPages={totalPages}
                totalElements={totalHoras}
                onPageChange={cambiarPagina}
            />

            <hr />

        </div>
    );
};

export default PresupuestoItemHora;