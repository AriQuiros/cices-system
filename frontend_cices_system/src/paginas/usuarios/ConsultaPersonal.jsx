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
        <div className="lp-wrapper">
            <div className="lp-content">

                <div className="lp-toolbar">
                    <input
                        className="lp-search-input"
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={nombreFiltro}
                        onChange={(e) => setNombreFiltro(e.target.value)}
                    />

                    <div className="lp-filter-box">
                        <label className="lp-filter-label">Roles:</label>

                        <select
                            className="lp-filter-select"
                            value={rolFiltro}
                            onChange={(e) => setRolFiltro(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="ASISTENTE">Asistente</option>
                            <option value="ADMINISTRATIVO">Administrativo</option>
                        </select>
                    </div>
                <div className="lp-extra-filters">
                    <div className="lp-field">
                        <label className="lp-field-label">Grado académico</label>
                        <Select
                            classNamePrefix="lp-select"
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
                </div>

                <div className="lp-table-card">
                    <table className="lp-table">
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
                                <td colSpan="7" className="lp-empty">
                                    No se encontraron resultados
                                </td>
                            </tr>
                        ) : (
                            personasFiltradas.map((p, index) => (
                                <tr key={index}>
                                    <td>{p.nombreCompleto}</td>
                                    <td>{p.identificacion}</td>
                                    <td>{p.pais}</td>
                                    <td className="lp-email">{p.correo}</td>
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