// src/components/ui/Presupuesto/PresupuestoItemGasto.jsx
import { useState } from "react";
import PresupuestoResumen from "../presupuestoComponents/PresupuestoResumen.jsx";
import { Pagination } from "../shared/Pagination.jsx";
import { GastoTable } from "./GastoTable.jsx";
import { useGastosPorPresupuesto } from "../../hooks/gastoHooks/queries/useGastoPorPresupuesto.js";
import { useModalBitacoraGasto } from "../../hooks/gastoHooks/useModalBitacoraGasto.js";
import ModalBitacoraGasto from "../../pages/gasto/ModalBitacoraGasto.jsx";

const PresupuestoItemGasto = ({ presupuesto, ordenGasto }) => {

    const [pageable, setPageable] = useState({ page: 0, size: 10 });

    const gastosQuery = useGastosPorPresupuesto(
        pageable.page > 0 ? presupuesto.id : null,
        pageable,
        ordenGasto?.campo || "fecha",
        ordenGasto?.direccion || "desc"
    );

    const gastosActuales =
        pageable.page === 0
            ? (presupuesto.gastos || [])
            : (gastosQuery.data?.lista || []);

    const totalGastos = presupuesto.resumen?.cantidad || 0;
    const totalPages = Math.ceil(totalGastos / pageable.size);

    const cambiarPagina = (nuevaPagina) => {
        setPageable(prev => ({ ...prev, page: nuevaPagina }));
    };

    // ── Modal bitácora ──
    const {
        modalAbierto,
        gastoSeleccionado,
        bitacoraOrdenada,
        isLoading: loadingBitacora,
        abrirModal,
        cerrarModal
    } = useModalBitacoraGasto();

    return (
        <div className="presupuesto-item-wrapper">

            <PresupuestoResumen presupuesto={presupuesto} />

            {gastosQuery.isLoading && pageable.page > 0 && (
                <p className="presupuesto-cargando">Cargando gastos...</p>
            )}

            {gastosActuales.length === 0 ? (
                <p className="presupuesto-sin-gastos"><br/>Sin gastos registrados.</p>
            ) : (
                <GastoTable
                    gastos={gastosActuales}
                    soloLectura={true}
                    onVerCambios={abrirModal}
                />
            )}

            <Pagination
                page={pageable.page}
                totalPages={totalPages}
                totalElements={totalGastos}
                onPageChange={cambiarPagina}
            />

            <hr />

            {/* ── Modal ── */}
            {modalAbierto && (
                <ModalBitacoraGasto
                    gasto={gastoSeleccionado}
                    bitacoraOrdenada={bitacoraOrdenada}
                    isLoading={loadingBitacora}
                    onClose={cerrarModal}
                />
            )}

        </div>
    );
};

export default PresupuestoItemGasto;