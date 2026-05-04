// src/paginas/presupuesto/horas/ConsultaHoras.jsx
import React, { useState } from "react";
import BuscadorProyecto from "../../components/busqueda/BusquedaProyecto.jsx";
import PresupuestoItemHora from "../../components/horaComponents/PresupuestoItemHora.jsx";
import { Pagination } from "../../components/shared/Pagination.jsx";
import BotonInicio from "../../components/shared/BotonInicio.jsx";
import { useConsultaHoras } from "../../hooks/presupuestoHooks/useConsultaHoras.js";
import "./GestionHoras.css";

const ConsultaHoras = () => {

    const [proyecto, setProyecto] = useState(null);

    const {
        data,
        isLoading,
        isError,
        setFiltro,
        pageable,
        cambiarPagina,
        ordenPresupuesto,
        setOrdenPresupuesto,
        ordenHora,
        setOrdenHora
    } = useConsultaHoras();

    const seleccionarProyecto = (p) => {
        setProyecto(p);
        setFiltro(prev => ({
            ...prev,
            codigoProyecto: p?.codigoProyecto || null
        }));
    };

    const presupuestos = data?.content || [];

    return (
        <div className="gestion-horas-page">
            <div className="gestion-horas-card">

                <BotonInicio />

                <h2>Consulta de horas asignadas</h2>

                <BuscadorProyecto onSelect={seleccionarProyecto} />

                {proyecto && (
                    <div>

                        {/* ── ORDEN PRESUPUESTOS ── */}
                        <h3>Ordenar presupuestos</h3>

                        <div className="gestion-horas-filtros">
                            <select
                                className="gestion-horas-select"
                                value={ordenPresupuesto.campo}
                                onChange={e =>
                                    setOrdenPresupuesto(prev => ({
                                        ...prev,
                                        campo: e.target.value
                                    }))
                                }
                            >
                                <option value="fecha">Fecha de asignación</option>
                                <option value="monto">Horas asignadas</option>
                            </select>

                            <select
                                className="gestion-horas-select"
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

                        {/* ── ORDEN HORAS ── */}
                        <h3>Ordenar horas</h3>

                        <div className="gestion-horas-filtros">
                            <select
                                className="gestion-horas-select"
                                value={ordenHora.campo}
                                onChange={e =>
                                    setOrdenHora(prev => ({
                                        ...prev,
                                        campo: e.target.value
                                    }))
                                }
                            >
                                <option value="fechaInicio">Fecha inicio participación</option>
                                <option value="total">Total asignado</option>
                            </select>

                            <select
                                className="gestion-horas-select"
                                value={ordenHora.direccion}
                                onChange={e =>
                                    setOrdenHora(prev => ({
                                        ...prev,
                                        direccion: e.target.value
                                    }))
                                }
                            >
                                {ordenHora.campo === "total" ? (
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

                        <hr className="gestion-horas-divider" />

                        {/* ── ESTADO ── */}
                        {isLoading && <p>Cargando presupuestos de horas...</p>}

                        {isError && (
                            <p style={{ color: "red" }}>
                                Ocurrió un error al cargar los presupuestos.
                            </p>
                        )}

                        {!isLoading && !isError && presupuestos.length === 0 && (
                            <p>Este proyecto no tiene presupuestos de horas registrados.</p>
                        )}

                        {/* ── LISTA DE PRESUPUESTOS ── */}
                        {presupuestos.map(p => (
                            <PresupuestoItemHora
                                key={p.id}
                                presupuesto={p}
                                ordenHora={ordenHora}
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

export default ConsultaHoras;