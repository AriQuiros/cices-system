// src/paginas/usuarios/consulta/GestionUsuarios.jsx
import { Pagination } from "../../components/shared/Pagination.jsx";
import { useConsultaUsuarios } from "../../hooks/personaHooks/useConsultaUsuarios.js";
import { PersonaFiltros } from "../../components/filtrado/PersonaFiltros.jsx";
import { RolChips } from "../../components/personaComponents/RolChips.jsx";
import "./GestionUsuarios.css";

export default function ListaUsuarios() {

    const {
        usuarios,
        totalElements,
        totalPages,
        isLoading,
        filtro,
        cambiarFiltro,
        limpiarFiltros,
        pageable,
        cambiarPagina,
        opcionesRoles,
        cambiarEstado
    } = useConsultaUsuarios();

    return (
        <div className="gu-page">
            <div className="gu-card">

                <h2 className="gu-title">Gestión de usuarios</h2>

                <PersonaFiltros
                    filtro={filtro}
                    onChange={cambiarFiltro}
                    onLimpiar={limpiarFiltros}
                    opcionesGrados={[]}
                    opcionesRoles={opcionesRoles}
                    mostrarRoles={true}
                    mostrarEstado={true}
                />

                <p className="ci-total">Total: {totalElements}</p>

                {isLoading && <p className="ci-cargando">Cargando...</p>}
                {!isLoading && usuarios.length === 0 && (
                    <p className="ci-empty-msg">No se encontraron usuarios.</p>
                )}

                <div className="gu-table-card">
                    <table className="gu-table">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Usuario (correo)</th>
                            <th>Roles</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {usuarios.map(u => (
                            <tr key={u.id}>
                                <td>{u.nombreCompleto}</td>
                                <td>{u.nombreUsuario}</td>
                                <td><RolChips roles={u.roles} /></td>
                                <td>
                                    <span className={`gu-estado-badge ${u.activo ? "activo" : "inactivo"}`}>
                                        {u.activo ? "Activo" : "Inactivo"}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className={`gu-action-btn ${u.activo ? "danger" : "success"}`}
                                        onClick={() => cambiarEstado(u.id, u.activo)}
                                    >
                                        {u.activo ? "Desactivar" : "Activar"}
                                    </button>
                                </td>
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