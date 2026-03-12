import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

export default function ListaPersonas() {

    const [personas, setPersonas] = useState([]);
    const [personasFiltradas, setPersonasFiltradas] = useState([]);
    const [grados, setGrados] = useState([]);

    const [nombreFiltro, setNombreFiltro] = useState("");
    const [gradosSeleccionados, setGradosSeleccionados] = useState([]);
    const [rolFiltro, setRolFiltro] = useState("");

    useEffect(() => {
        cargarPersonas();
        cargarGrados();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [nombreFiltro, gradosSeleccionados, rolFiltro, personas]);

    const cargarPersonas = async () => {
        const res = await axios.get("/api/reports/personas/empleados");
        setPersonas(res.data);
    };

    const cargarGrados = async () => {
        const res = await axios.get("/api/catalogos/grados_academicos");
        setGrados(res.data);
    };

    const manejarGradosSelect = (selectedOptions) => {
        setGradosSeleccionados(selectedOptions ? selectedOptions.map(o => o.value) : []);
    };

    const aplicarFiltros = () => {

        let resultado = [...personas];

        if (nombreFiltro) {
            resultado = resultado.filter(p =>
                p.nombreCompleto.toLowerCase().includes(nombreFiltro.toLowerCase())
            );
        }

        if (gradosSeleccionados.length > 0) {
            resultado = resultado.filter(p =>
                gradosSeleccionados.includes(p.gradoAcademico)
            );
        }

        if (rolFiltro) {
            resultado = resultado.filter(p =>
                p.roles.includes(rolFiltro)
            );
        }

        setPersonasFiltradas(resultado);
    };

    return (
        <div>

            <h2>Lista de Personas Usuarias</h2>

            <div>
                <label>Nombre</label>
                <input
                    type="text"
                    value={nombreFiltro}
                    onChange={(e) => setNombreFiltro(e.target.value)}
                />
            </div>

            <div>
                <label>Grado académico</label>
                <Select
                    options={grados.map(g => ({ value: g, label: g }))}
                    isMulti
                    value={grados
                        .map(g => ({ value: g, label: g }))
                        .filter(g => gradosSeleccionados.includes(g.value))
                    }
                    onChange={manejarGradosSelect}
                    placeholder="Seleccione grado(s)"
                />
            </div>

            <div>
                <label>Rol</label>
                <select
                    value={rolFiltro}
                    onChange={(e) => setRolFiltro(e.target.value)}
                >
                    <option value="">Todos</option>
                    <option value="ASISTENTE">Asistente</option>
                    <option value="ADMINISTRATIVO">Administrativo</option>
                </select>
            </div>

            <hr/>

            <table border="1">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Identificación</th>
                    <th>País</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Grado Académico</th>
                    <th>Roles</th>
                </tr>
                </thead>

                <tbody>
                {personasFiltradas.map((p, index) => (
                    <tr key={index}>
                        <td>{p.nombreCompleto}</td>
                        <td>{p.identificacion}</td>
                        <td>{p.pais}</td>
                        <td>{p.correo}</td>
                        <td>{p.numeroTelefono}</td>
                        <td>{p.gradoAcademico}</td>
                        <td>{p.roles.join(", ")}</td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
}
