import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { useTiposCatalogo } from "../../../hooks/useTiposCatalogo";
import { AppContext } from "../../../context/AppContext.jsx";
import "./CertificacionesInvestigador.css";

export default function MisCertificacionesPage() {
    const { token } = useContext(AppContext);

    const [certificaciones, setCertificaciones] = useState([]);
    const [filtros, setFiltros] = useState({
        tipos: [],
        estados: [],
    });

    const { tipos: catalogos } = useTiposCatalogo(token, [
        "TIPO_CERTIFICACION",
        "ESTADO_CERTIFICACION",
    ]);

    // Traer certificaciones del backend con token en headers
    useEffect(() => {
        if (!token) return;

        fetch("/api/certificaciones/investigador", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => setCertificaciones(data))
            .catch((err) => console.error(err));
    }, [token]);

    // Filtrado
    const filtradas = certificaciones.filter((cert) => {
        const matchTipo =
            filtros.tipos.length === 0 ||
            filtros.tipos.some(
                (t) => t.value === cert.tipoCertificacion?.valor?.toUpperCase()
            );

        const matchEstado =
            filtros.estados.length === 0 ||
            filtros.estados.some(
                (e) => e.value === cert.estado?.valor?.toUpperCase()
            );

        return matchTipo && matchEstado;
    });

    return (
        <div className="certificaciones-investigador-page">
            <div className="certificaciones-investigador-card">
                <h1 className="certificaciones-investigador-title">Mis Certificaciones</h1>

            {/* Filtros */}
            <div className="certificaciones-filtro-item">
                <label className="certificaciones-label">Tipo Certificacion:</label>
                <Select
                    classNamePrefix="react-select"
                    isMulti
                    options={catalogos?.TIPO_CERTIFICACION?.map(
                        ({ valor, despliegue }) => ({
                            value: valor,
                            label: despliegue,
                        })
                    )}
                    value={filtros.tipos}
                    onChange={(selected) =>
                        setFiltros((prev) => ({ ...prev, tipos: selected }))
                    }
                />
            </div>

            <div className="certificaciones-filtro-item">
                <label className="certificaciones-label">Estado Certificacion:</label>
                <Select
                    classNamePrefix="react-select"
                    isMulti
                    options={catalogos?.ESTADO_CERTIFICACION?.map(
                        ({ valor, despliegue }) => ({
                            value: valor,
                            label: despliegue,
                        })
                    )}
                    value={filtros.estados}
                    onChange={(selected) =>
                        setFiltros((prev) => ({ ...prev, estados: selected }))
                    }
                />
            </div>

            {/* Tabla de certificaciones */}
            <table className="certificaciones-table">
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
                        <td>{cert.nombreCertificacion}</td>
                        <td>{cert.entidadEmisora?.nombre}</td>
                        <td>{cert.tipoCertificacion?.despliegue}</td>
                        <td>{cert.estado?.despliegue}</td>
                        <td>{cert.fechaExpiracion}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            </div>
        </div>
    );
}