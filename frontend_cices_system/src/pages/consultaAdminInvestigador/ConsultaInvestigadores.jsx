// src/paginas/usuarios/investigadores/ConsultaInvestigadores.jsx
import { useState } from "react";
import { Pagination } from "../../components/shared/Pagination.jsx";
import { useConsultaPersonas } from "../../hooks/personaHooks/useConsultaPersonas.js";
import { PersonaFiltros } from "../../components/filtrado/PersonaFiltros.jsx";
import { RolChips } from "../../components/personaComponents/RolChips.jsx";
import InvestigadorDetalle from "./InvestigadorDetalle.jsx";
import "./ConsultaPersonal.css";

export default function ListaInvestigadores() {

    const [identificacionSeleccionada, setIdentificacionSeleccionada] = useState(null);

    const {
        personas,
        totalElements,
        totalPages,
        isLoading,
        filtro,
        cambiarFiltro,
        limpiarFiltros,
        pageable,
        cambiarPagina,
        opcionesGrados,
        opcionesRoles
    } = useConsultaPersonas("investigadores");

    return (
        <div className="ci-wrapper">
            <div className="ci-content">

                <h2 className="ci-title">Lista de investigadores</h2>

                <PersonaFiltros
                    filtro={filtro}
                    onChange={cambiarFiltro}
                    onLimpiar={limpiarFiltros}
                    opcionesGrados={opcionesGrados}
                    opcionesRoles={opcionesRoles}
                    mostrarRoles={false}
                    mostrarEstado={false}
                />

                <p className="ci-total">Total: {totalElements}</p>

                {isLoading && <p className="ci-cargando">Cargando...</p>}
                {!isLoading && personas.length === 0 && (
                    <p className="ci-empty-msg">No se encontraron resultados.</p>
                )}

                <div className="ci-table-card">
                    <table className="ci-table">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Identificación</th>
                            <th>País</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Grado académico</th>
                            <th>Roles</th>
                            <th>Institución</th>
                            <th>Unidad</th>
                            <th>Ver</th>
                        </tr>
                        </thead>
                        <tbody>
                        {personas.map((item, i) => {
                            // InvestigadorConsultaDTO: { persona, institucionOrigen, unidadAcademica, temaInteres }
                            const p = item.persona ?? item;
                            return (
                                <tr key={p.identificacion ?? i}>
                                    <td>{p.nombreCompleto}</td>
                                    <td>{p.identificacion}</td>
                                    <td>{p.pais}</td>
                                    <td className="ci-email">{p.correo}</td>
                                    <td>{p.numeroTelefono}</td>
                                    <td>{p.gradoAcademico}</td>
                                    <td><RolChips roles={p.roles} /></td>
                                    <td>{item.institucionOrigen ?? "—"}</td>
                                    <td>{item.unidadAcademica ?? "—"}</td>
                                    <td>
                                        <button
                                            className="ci-action-btn"
                                            onClick={() => setIdentificacionSeleccionada(p.identificacion)}
                                        >
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    page={pageable.page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    onPageChange={cambiarPagina}
                />

                {identificacionSeleccionada && (
                    <InvestigadorDetalle
                        identificacion={identificacionSeleccionada}
                        onClose={() => setIdentificacionSeleccionada(null)}
                    />
                )}

            </div>
        </div>
    );
}