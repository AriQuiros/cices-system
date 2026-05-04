import { useState, useMemo } from "react";
import BuscadorProyecto from "../../components/busqueda/BusquedaProyecto.jsx";
import PresupuestoFiltros from "../../components/filtrado/PresupuestoFiltros.jsx";
import PresupuestoItemGasto from "../../components/gastoComponents/PresupuestoItemGasto.jsx";
import { Pagination } from "../../components/shared/Pagination.jsx";
import BotonInicio from "../../components/shared/BotonInicio.jsx";
import { useConsultaGastos } from "../../hooks/presupuestoHooks/useConsultaGastos.js";
import { useCatalogos } from "../../hooks/referenceDataHooks/useCatalogos.js";
import "./GestionGastos.css";

const ConsultaGastos = () => {
    const [proyecto, setProyecto] = useState(null);

    const { data: catalogosData } = useCatalogos(["CATEGORIA_PRESUPUESTO"]);
    const opcionesCategorias = useMemo(() => {
        const lista = catalogosData?.data?.["CATEGORIA_PRESUPUESTO"] || [];
        return lista.map(cat => ({ value: cat.despliegue || cat, label: cat.despliegue || cat }));
    }, [catalogosData]);

    const {
        data, isLoading, isError,
        filtro, setFiltro,
        pageable, cambiarPagina,
        ordenPresupuesto, setOrdenPresupuesto,
        ordenGasto, setOrdenGasto,
    } = useConsultaGastos();

    const seleccionarProyecto = (p) => {
        setProyecto(p);
        setFiltro(prev => ({ ...prev, codigoProyecto: p?.codigoProyecto || null }));
    };

    const presupuestos = data?.content || [];

    return (
        <div className="gestion-gastos-page">
            <div className="gestion-gastos-card">
                <BotonInicio />
                <h2 className="gestion-gastos-title">Consulta de gastos</h2>

                <BuscadorProyecto onSelect={seleccionarProyecto} />

                {proyecto && (
                    <div className="gestion-gastos-content">

                        <PresupuestoFiltros
                            filtro={filtro}
                            onChange={(campo, valor) => setFiltro(prev => ({ ...prev, [campo]: valor }))}
                            ordenPresupuesto={ordenPresupuesto}
                            setOrdenPresupuesto={setOrdenPresupuesto}
                            ordenGasto={ordenGasto}
                            setOrdenGasto={setOrdenGasto}
                            opcionesCategorias={opcionesCategorias}
                            mostrarOrdenGasto={true}
                        />


                        {isLoading && <p>Cargando presupuestos...</p>}
                        {isError   && <p style={{ color: "red" }}>Ocurrió un error al cargar los presupuestos.</p>}
                        {!isLoading && !isError && presupuestos.length === 0 && (
                            <p>Este proyecto no tiene presupuestos financieros registrados.</p>
                        )}

                        {presupuestos.map(p => (
                            <PresupuestoItemGasto key={p.id} presupuesto={p} ordenGasto={ordenGasto} />

                        ))}

                        <Pagination
                            page={pageable.page}
                            totalPages={data?.totalPages || 0}
                            totalElements={data?.totalElements || 0}
                            onPageChange={cambiarPagina}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsultaGastos;