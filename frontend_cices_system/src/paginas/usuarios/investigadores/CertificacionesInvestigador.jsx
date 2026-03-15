import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useTiposCatalogo } from "../../../hooks/useTiposCatalogo";

export default function MisCertificacionesPage() {
    const token = localStorage.getItem("token");

    const [certificaciones, setCertificaciones] = useState([]);
    const [filtros, setFiltros] = useState({
        tipos: [],
        estados: [],
    });

    const { tipos: catalogos } = useTiposCatalogo(token, [
        "TIPO_CERTIFICACION",
        "ESTADO_CERTIFICACION",
    ]);

    useEffect(() => {
        fetch("/api/reports/certificaciones/all")
            .then((res) => res.json())
            .then((data) => setCertificaciones(data))
            .catch((err) => console.error(err));
    }, []);

    // Filtrado
    const filtradas = certificaciones.filter((cert) => {
        const matchTipo =
            filtros.tipos.length === 0 ||
            filtros.tipos.some((t) => t.value === cert.tipo.toUpperCase());

        const matchEstado =
            filtros.estados.length === 0 ||
            filtros.estados.some((e) => e.value === cert.estado.toUpperCase());

        return matchTipo && matchEstado;
    });

    return (
        <div>
            <h1>Mis Certificaciones</h1>

            <div>
                <label>Tipo Certificación:</label>
                <Select
                    isMulti
                    options={catalogos?.TIPO_CERTIFICACION?.map(({ valor, despliegue }) => ({
                        value: valor,
                        label: despliegue,
                    }))}
                    value={filtros.tipos}
                    onChange={(selected) => setFiltros((prev) => ({ ...prev, tipos: selected }))}
                />
            </div>

            <div>
                <label>Estado Certificación:</label>
                <Select
                    isMulti
                    options={catalogos?.ESTADO_CERTIFICACION?.map(({ valor, despliegue }) => ({
                        value: valor,
                        label: despliegue,
                    }))}
                    value={filtros.estados}
                    onChange={(selected) => setFiltros((prev) => ({ ...prev, estados: selected }))}
                />
            </div>

            <table border="1" cellPadding="4" cellSpacing="0">
                <thead>
                <tr>
                    <th>Certificación</th>
                    <th>Institución</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                </tr>
                </thead>
                <tbody>
                {filtradas.map((cert, idx) => (
                    <tr key={idx}>
                        <td>{cert.nombre}</td>
                        <td>{cert.institucion}</td>
                        <td>{cert.tipo}</td>
                        <td>{cert.estado}</td>
                        <td>{cert.fecha}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}