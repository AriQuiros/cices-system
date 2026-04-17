import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { useProyectos } from "../../hooks/proyectos/useProyectos";
import { useTiposCatalogo } from "../../hooks/useTiposCatalogo.js";
import { useLineas } from "../../hooks/proyectos/useLineas.jsx";
import FiltrosProyectos from "../../components/FiltradoProyectos";
import { exportarReporteProyectos } from "../../services/proyectoService";
import "./ReportesProyectos.css";

function ReportesProyectos() {

    const { token, user } = useContext(AppContext);

    const {
        proyectos,
        total,
        totalPages,
        page,
        setPage,
        orden,
        setOrden,
        cargando,
        filtros,
        handleChange,
        limpiarFiltros
    } = useProyectos();

    const { tipos } = useTiposCatalogo(token, [
        "ESTADO_PROYECTO",
        "TIPO_PROYECTO"
    ]);

    const { opciones: opcionesLineas } = useLineas();

    const opcionesTipos = tipos["TIPO_PROYECTO"]?.map(t => ({
        value: t.id,
        label: t.despliegue
    })) || [];

    const [formato, setFormato] = useState("pdf");

    const handleExportar = async () => {
        try {
            await exportarReporteProyectos(token, filtros, formato, orden);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="listado-proyectos-page">

            <div className="listado-proyectos-card">

                <h2 className="listado-proyectos-title">Reportes de proyectos</h2>

                {/* 🔽 FILTROS reutilizados */}
                <FiltrosProyectos
                    filtros={filtros}
                    onChange={handleChange}
                    onClear={limpiarFiltros}
                    orden={orden}
                    setOrden={setOrden}
                    opcionesLineas={opcionesLineas}
                    opcionesTipos={opcionesTipos}
                    opcionesEstado={tipos["ESTADO_PROYECTO"] || []}
                />

                {/* 🔽 EXPORTACIÓN */}
                <div className="exportar-container">

                    <select
                        value={formato}
                        onChange={(e) => setFormato(e.target.value)}
                    >
                        <option value="pdf">PDF</option>
                        <option value="xlsx">Excel</option>
                        <option value="docx">Word</option>
                    </select>

                    <button onClick={handleExportar}>
                        Exportar
                    </button>

                </div>

                {/* 🔽 TOTAL */}
                <p>Total de proyectos: {total}</p>

                {/* 🔽 LISTA (igual que listado) */}
                <section className="todosLosProyectos">

                    {cargando && <p>Cargando proyectos...</p>}

                    {!cargando && proyectos.length === 0 && (
                        <p>No se encontraron proyectos</p>
                    )}

                    <div className="label">
                        {proyectos.map(p => (
                            <div key={p.codigoProyecto} className="proyecto_card">
                                <h3>{p.codigoProyecto}</h3>
                                <p><b>Nombre:</b> {p.nombreProyecto}</p>
                                <p><b>Tipo:</b> {p.tipoProyecto}</p>
                                <p><b>Línea:</b> {p.lineaInvestigacion}</p>
                                <p><b>Estado:</b> {p.estado}</p>
                                <p>{p.fechaInicio} - {p.fechaFinalizacion}</p>
                            </div>
                        ))}
                    </div>

                </section>

                {/* 🔽 PAGINACIÓN */}
                <div className="paginacion">

                    <button disabled={page === 0} onClick={() => setPage(page - 1)}>
                        Anterior
                    </button>

                    <span>Página {page + 1} de {totalPages}</span>

                    <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
                        Siguiente
                    </button>

                </div>

            </div>
        </div>
    );
}

export default ReportesProyectos;