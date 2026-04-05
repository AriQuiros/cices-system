import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import "./ConsultaPersonal.css";

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
        <div className="ci-wrapper">
            <div className="ci-content">

                <h2 className="ci-title">Lista de Personal</h2>

                <div className="ci-toolbar row">

                    <input
                        className="ci-search-input"
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={nombreFiltro}
                        onChange={(e) => setNombreFiltro(e.target.value)}
                    />

                        <div className="ci-field">
                            <select
                                className="ci-search-input"
                                value={rolFiltro}
                                onChange={(e) => setRolFiltro(e.target.value)}
                            >
                                <option value="">Rol</option>
                                <option value="ASISTENTE">Asistente</option>
                                <option value="ADMINISTRATIVO">Administrativo</option>
                            </select>
                        </div>

                        <div className="ci-field">
                            <label className="ci-field-label">Grado académico</label>
                            <Select
                                classNamePrefix="ci-select"
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
                </div>

                <div className="ci-table-card">
                    <table className="ci-table">

                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Identificación</th>
                            <th>País</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Grado Académico</th>
                            <th>Rol</th>
                        </tr>
                        </thead>

                        <tbody>

                        {personasFiltradas.length === 0 ? (

                            <tr>
                                <td colSpan="7" className="ci-empty">
                                    No se encontraron resultados
                                </td>
                            </tr>

                        ) : (

                            personasFiltradas.map((p, index) => (

                                <tr key={index}>
                                    <td>{p.nombreCompleto}</td>
                                    <td>{p.identificacion}</td>
                                    <td>{p.pais}</td>
                                    <td className="ci-email">{p.correo}</td>
                                    <td>{p.numeroTelefono}</td>
                                    <td>{p.gradoAcademico}</td>
                                    <td>{p.roles.join(", ")}</td>
                                </tr>

                            ))

                        )}

                        </tbody>

                    </table>
                </div>

            </div>
        </div>
    );
}