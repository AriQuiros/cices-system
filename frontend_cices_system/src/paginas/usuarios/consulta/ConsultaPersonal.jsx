// src/paginas/usuarios/consulta/ConsultaPersonal.jsx
import { Pagination } from "../../../components/ui/Pagination.jsx";
import { useConsultaPersonas } from "../../../modules/persona/hooks/useConsultaPersonas.js";
import { PersonaFiltros } from "../../../modules/persona/components/PersonaFiltros.jsx";
import { RolChips } from "../../../modules/persona/components/RolChips.jsx";
import "./ConsultaPersonal.css";

export default function ListaPersonas() {

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
    } = useConsultaPersonas("empleados");

    return (
        <div className="ci-wrapper">
            <div className="ci-content">

                <h2 className="ci-title">Lista de personal</h2>

                <PersonaFiltros
                    filtro={filtro}
                    onChange={cambiarFiltro}
                    onLimpiar={limpiarFiltros}
                    opcionesGrados={opcionesGrados}
                    opcionesRoles={opcionesRoles}
                    mostrarRoles={true}
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
                        </tr>
                        </thead>
                        <tbody>
                        {personas.map((p, i) => (
                            <tr key={p.identificacion ?? i}>
                                <td>{p.nombreCompleto}</td>
                                <td>{p.identificacion}</td>
                                <td>{p.pais}</td>
                                <td className="ci-email">{p.correo}</td>
                                <td>{p.numeroTelefono}</td>
                                <td>{p.gradoAcademico}</td>
                                <td><RolChips roles={p.roles} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    page={pageable.page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    onPageChange={cambiarPagina}
                />

            </div>
        </div>
    );
}