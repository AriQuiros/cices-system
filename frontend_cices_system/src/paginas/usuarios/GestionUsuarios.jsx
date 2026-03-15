import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import {notify} from "../../utils/ui/notify";
import {confirm} from "../../utils/ui/confirm";

export default function ListaUsuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [rolesDisponibles, setRolesDisponibles] = useState([]);

    const [nombreFiltro, setNombreFiltro] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("");
    const [rolesSeleccionados, setRolesSeleccionados] = useState([]);

    useEffect(() => {
        cargarUsuarios();
        cargarRoles();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [nombreFiltro, estadoFiltro, rolesSeleccionados, usuarios]);

    const cargarUsuarios = async () => {
        try {
            const res = await axios.get("/api/reports/personas/usuarios");
            setUsuarios(res.data);
        } catch (error) {
            console.error("Error cargando usuarios", error);
        }
    };

    const cargarRoles = async () => {
        try {
            const res = await axios.get("/api/rol-sistema");
            setRolesDisponibles(res.data);
        } catch (error) {
            console.error("Error cargando roles", error);
        }
    };

    const manejarRolesSelect = (selectedOptions) => {
        setRolesSeleccionados(selectedOptions ? selectedOptions.map(o => o.value) : []);
    };

    const aplicarFiltros = () => {

        let resultado = [...usuarios];

        // filtro por nombre
        if (nombreFiltro) {
            resultado = resultado.filter(u =>
                u.nombreCompleto.toLowerCase().includes(nombreFiltro.toLowerCase())
            );
        }

        // filtro por estado
        if (estadoFiltro !== "") {
            resultado = resultado.filter(u =>
                u.activo === (estadoFiltro === "ACTIVO")
            );
        }

        // filtro por roles
        if (rolesSeleccionados.length > 0) {
            resultado = resultado.filter(u =>
                rolesSeleccionados.some(r => u.roles.includes(r))
            );
        }

        setUsuariosFiltrados(resultado);
    };

    const cambiarEstado = async (idUsuario, estadoActual) => {
        const accion = estadoActual ? "desactivar" : "activar";

        const confirmar = await confirm.action({
            title: `¿Desea ${accion} este usuario?`,
            message: ""
        });

        if (!confirmar) return;

        try {

            await axios.put(`/api/usuarios/${idUsuario}/estado`, {
                activo: !estadoActual
            });

            cargarUsuarios();

        } catch (error) {
            notify.error("Error cambiando estado", error);
        }
    };



    return (
        <div>

            <h2>Gestión de Usuarios</h2>

            <hr/>

            <div>

                <div>
                    <label>Nombre</label>
                    <br/>
                    <input
                        type="text"
                        value={nombreFiltro}
                        onChange={(e) => setNombreFiltro(e.target.value)}
                        placeholder="Buscar por nombre"
                    />
                </div>

                <br/>

                <div>
                    <label>Estado</label>
                    <br/>
                    <select
                        value={estadoFiltro}
                        onChange={(e) => setEstadoFiltro(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="ACTIVO">Activo</option>
                        <option value="INACTIVO">Inactivo</option>
                    </select>
                </div>

                <br/>

                <div>
                    <label>Roles</label>
                    <br />
                    <Select
                        options={rolesDisponibles.map(r => ({ value: r.nombreRol, label: r.nombreRol }))}
                        isMulti
                        value={rolesDisponibles
                            .map(r => ({ value: r.nombreRol, label: r.nombreRol }))
                            .filter(r => rolesSeleccionados.includes(r.value))
                        }
                        onChange={manejarRolesSelect}
                        placeholder="Seleccione rol(es)"
                    />
                </div>

            </div>

            <hr/>

            {/* TABLA */}

            <table border="1">

                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Roles</th>
                    <th>Estado</th>
                    <th>Acción</th>
                </tr>
                </thead>

                <tbody>

                {usuariosFiltrados.map(u => (

                    <tr key={u.id}>

                        <td>{u.nombreCompleto}</td>

                        <td>{u.nombreUsuario}</td>

                        <td>{u.roles.join(", ")}</td>

                        <td>
                            {u.activo ? "Activo" : "Inactivo"}
                        </td>

                        <td>

                            <button
                                onClick={() =>
                                    cambiarEstado(u.id, u.activo)
                                }
                            >
                                {u.activo ? "Desactivar" : "Activar"}
                            </button>

                        </td>

                    </tr>

                ))}

                </tbody>

            </table>

        </div>
    );
}