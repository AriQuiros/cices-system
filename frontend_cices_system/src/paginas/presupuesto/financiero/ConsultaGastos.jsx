// src/paginas/presupuesto/financiero/ConsultaGastos.jsx
import React, { useMemo, useState } from "react";
import BuscadorProyecto from "../../../components/ui/busqueda/BusquedaProyecto.jsx";
import Select from "react-select";
import PresupuestoItem from "../../../components/ui/Presupuesto/PresupuestoItem.jsx";
import { Pagination } from "../../../components/ui/Pagination.jsx";
import "./GestionGastos.css";
import BotonVolver from "../../../components/BotonVolver.jsx";
import { useConsultaGastos } from "../../../modules/presupuesto/hooks/useConsultaGastos.js";
import {useCatalogos} from "../../../modules/referenceData/hooks/useCatalogos.js";

const ConsultaGastos = () => {

    const [proyecto, setProyecto] = useState(null);
    const { data: catalogos } = useCatalogos(["CATEGORIA_PRESUPUESTO"]);

    const {
        data,
        isLoading,
        isError,
        filtro,
        setFiltro,
        pageable,
        cambiarPagina,
        ordenPresupuesto,
        setOrdenPresupuesto,
        ordenGasto,
        setOrdenGasto
    } = useConsultaGastos();

    const seleccionarProyecto = (p) => {
        setProyecto(p);
        setFiltro(prev => ({
            ...prev,
            codigoProyecto: p?.codigoProyecto || null
        }));
    };

    const presupuestos = data?.content || [];

    const opcionesCategorias = useMemo(() => {
        const lista = catalogos?.data?.["CATEGORIA_PRESUPUESTO"] || [];

        return lista.map(cat => ({
            value: cat.despliegue || cat,
            label: cat.despliegue || cat
        }));
    }, [catalogos]);

    const manejarCategorias = (values) => {
        setFiltro(prev => ({
            ...prev,
            categorias: values?.map(v => v.value) || []
        }));
    };

    return (
        <div className="gestion-gastos-page">
            <div className="gestion-gastos-card">

                <BotonVolver />

                <h2 className="gestion-gastos-title">Consulta de gastos</h2>

                <BuscadorProyecto onSelect={setProyecto} />

                {proyecto && (
                    <div className="gestion-gastos-content">

                        {/* ── FILTROS ── */}
                        <h3 className="gestion-gastos-subtitle">Filtros</h3>

                        <div className="consulta-grid-filtros">
                            <div className="gasto-form-item">
                                <label>Categorías</label>
                                <Select
                                    options={opcionesCategorias}
                                    isMulti
                                    isClearable
                                    placeholder="Todas las categorías"
                                    value={opcionesCategorias.filter(c => filtro.categorias.includes(c.value))}
                                    onChange={manejarCategorias}
                                    closeMenuOnSelect={false}
                                />
                            </div>

                            <div className="gasto-form-item">
                                <label>Fecha desde</label>
                                <input
                                    type="date"
                                    className="gestion-gastos-select"
                                    value={filtro.fechaDesde || ""}
                                    onChange={e =>
                                        setFiltro(prev => ({
                                            ...prev,
                                            fechaDesde: e.target.value || null
                                        }))
                                    }
                                />
                            </div>

                            <div className="gasto-form-item">
                                <label>Fecha hasta</label>
                                <input
                                    type="date"
                                    className="gestion-gastos-select"
                                    value={filtro.fechaHasta || ""}
                                    onChange={e =>
                                        setFiltro(prev => ({
                                            ...prev,
                                            fechaHasta: e.target.value || null
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        {/* ── ORDEN PRESUPUESTOS ── */}
                        <h3 className="gestion-gastos-subtitle">Ordenar presupuestos</h3>

                        <div className="consulta-grid-filtros">
                            <select
                                className="gestion-gastos-select"
                                value={ordenPresupuesto.campo}
                                onChange={e =>
                                    setOrdenPresupuesto(prev => ({
                                        ...prev,
                                        campo: e.target.value
                                    }))
                                }
                            >
                                <option value="fecha">Fecha de asignación</option>
                                <option value="monto">Monto asignado</option>
                            </select>

                            <select
                                className="gestion-gastos-select"
                                value={ordenPresupuesto.direccion}
                                onChange={e =>
                                    setOrdenPresupuesto(prev => ({
                                        ...prev,
                                        direccion: e.target.value
                                    }))
                                }
                            >
                                {ordenPresupuesto.campo === "monto" ? (
                                    <>
                                        <option value="desc">Mayor a menor</option>
                                        <option value="asc">Menor a mayor</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="desc">Más reciente primero</option>
                                        <option value="asc">Más antiguo primero</option>
                                    </>
                                )}
                            </select>
                        </div>


                        {/* ── ORDEN GASTOS ── */}
                        <h3 className="gestion-gastos-subtitle">Ordenar gastos</h3>

                        <div className="consulta-grid-filtros">
                            <select
                                className="gestion-gastos-select"
                                value={ordenGasto.campo}
                                onChange={e =>
                                    setOrdenGasto(prev => ({
                                        ...prev,
                                        campo: e.target.value
                                    }))
                                }
                            >
                                <option value="fecha">Fecha del gasto</option>
                                <option value="monto">Monto</option>
                            </select>

                            <select
                                className="gestion-gastos-select"
                                value={ordenGasto.direccion}
                                onChange={e =>
                                    setOrdenGasto(prev => ({
                                        ...prev,
                                        direccion: e.target.value
                                    }))
                                }
                            >
                                {ordenGasto.campo === "monto" ? (
                                    <>
                                        <option value="desc">Mayor a menor</option>
                                        <option value="asc">Menor a mayor</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="desc">Más reciente primero</option>
                                        <option value="asc">Más antiguo primero</option>
                                    </>
                                )}
                            </select>
                        </div>


                        <hr />

                        {/* ── ESTADO ── */}
                        {isLoading && <p>Cargando presupuestos...</p>}

                        {isError && (
                            <p style={{ color: "red" }}>
                                Ocurrió un error al cargar los presupuestos.
                            </p>
                        )}

                        {!isLoading && !isError && presupuestos.length === 0 && (
                            <p>Este proyecto no tiene presupuestos financieros registrados.</p>
                        )}

                        {/* ── LISTA DE PRESUPUESTOS ── */}
                        {presupuestos.map(p => (
                            <PresupuestoItem
                                key={p.id}
                                presupuesto={p}
                                ordenGasto={ordenGasto}
                            />

                        ))}

                        {/* ── PAGINACIÓN DE PRESUPUESTOS ── */}
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