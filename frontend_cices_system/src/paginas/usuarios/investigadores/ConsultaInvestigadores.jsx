import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import InvestigadorDetalle from "./InvestigadorDetalle.jsx";

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
        <div>
            <h2>Lista de Investigadores</h2>

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
                    <th>Institución</th>
                    <th>Unidad</th>
                    <th>Ver</th> {/* Nueva columna */}
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
                        <td>{p.institucionOrigen}</td>
                        <td>{p.unidadAcademica}</td>
                        <td>
                            <button
                                onClick={() => {
                                    setInvestigadorSeleccionado(p);
                                    setMostrarDetalle(true);
                                }}
                            >
                                Ver
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {mostrarDetalle && (
                <InvestigadorDetalle
                    investigador={investigadorSeleccionado}
                    onClose={() => setMostrarDetalle(false)}
                />
            )}
        </div>
    );
}