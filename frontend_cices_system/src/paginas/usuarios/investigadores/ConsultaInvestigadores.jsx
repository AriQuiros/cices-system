import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import InvestigadorDetalle from "./InvestigadorDetalle.jsx";
import "../ConsultaPersonal.css";

export default function ListaInvestigadores() {
    const [investigadorSeleccionado, setInvestigadorSeleccionado] = useState(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);

    const [personas, setPersonas] = useState([]);
    const [personasFiltradas, setPersonasFiltradas] = useState([]);
    const [grados, setGrados] = useState([]);

    const [nombreFiltro, setNombreFiltro] = useState("");
    const [gradosSeleccionados, setGradosSeleccionados] = useState([]);

    useEffect(() => {
        cargarPersonas();
        cargarGrados();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [nombreFiltro, gradosSeleccionados, personas]);

    const cargarPersonas = async () => {
        const res = await axios.get("/api/reports/personas/investigadores");
        setPersonas(res.data);
        console.log(res.data)
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

        setPersonasFiltradas(resultado);
    };

    return (
        <div className="ci-wrapper">
            <div className="ci-content">
                <h2 className="ci-title">Lista de Investigadores</h2>

                <div className="ci-toolbar">
                    <input
                        className="ci-search-input"
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={nombreFiltro}
                        onChange={(e) => setNombreFiltro(e.target.value)}
                    />

                    <div className="ci-extra-filters">
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
                            <th>Institución</th>
                            <th>Unidad</th>
                            <th>Ver</th>
                        </tr>
                        </thead>

                        <tbody>
                        {personasFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="ci-empty">
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
                                    <td>{p.institucionOrigen}</td>
                                    <td>{p.unidadAcademica}</td>
                                    <td>
                                        <button
                                            className="ci-action-btn"
                                            onClick={() => {
                                                setInvestigadorSeleccionado(p);
                                                setMostrarDetalle(true);
                                            }}
                                        >
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {mostrarDetalle && (
                    <InvestigadorDetalle
                        investigador={investigadorSeleccionado}
                        onClose={() => setMostrarDetalle(false)}
                    />
                )}
            </div>
        </div>
    );
}