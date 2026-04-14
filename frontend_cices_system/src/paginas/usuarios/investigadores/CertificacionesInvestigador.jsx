import React, { useContext, useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { useTiposCatalogo } from "../../../hooks/useTiposCatalogo";
import { AppContext } from "../../../context/AppContext.jsx";
import "../../../estilos/form.css"
import {useDebounce} from "../../../hooks/useDebounce.js";
import "./CertificacionesInvestigador.css";

export default function MisCertificacionesPage() {
    const { token } = useContext(AppContext);
    const [busqueda, setBusqueda] = useState("");
    const busquedaDebounced = useDebounce(busqueda, 300);
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
        if (!token) return;

        fetch("/api/certificaciones/investigador", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("No se pudieron cargar las certificaciones");
                }
                return res.json();
            })
            .then((data) => setCertificaciones(Array.isArray(data) ? data : []))
            .catch((err) => {
                console.error(err);
                setCertificaciones([]);
            });
    }, [token]);

    const opcionesTipos = (catalogos?.TIPO_CERTIFICACION || []).map(
        ({ valor, despliegue }) => ({
            value: String(valor).toUpperCase(),
            label: despliegue,
        })
    );

    const opcionesEstados = (catalogos?.ESTADO_CERTIFICACION || []).map(
        ({ valor, despliegue }) => ({
            value: String(valor).toUpperCase(),
            label: despliegue,
        })
    );

    const filtradas = useMemo(() => {
        return certificaciones.filter((cert) => {
            const tipoValor = String(
                cert.tipoCertificacion?.valor ||
                cert.tipoCertificacion ||
                ""
            ).toUpperCase();

            const estadoValor = String(
                cert.estado?.valor ||
                cert.estado ||
                ""
            ).toUpperCase();

            const nombre = String(cert.nombreCertificacion || "").toLowerCase();
            const institucion = String(cert.entidadEmisora?.nombre || "").toLowerCase();

            const matchTipo =
                filtros.tipos.length === 0 ||
                filtros.tipos.some((t) => t.value === tipoValor);

            const matchEstado =
                filtros.estados.length === 0 ||
                filtros.estados.some((e) => e.value === estadoValor);

            const matchBusqueda =
                busquedaDebounced.trim() === "" ||
                nombre.includes(busquedaDebounced.toLowerCase()) ||
                institucion.includes(busquedaDebounced.toLowerCase());

            return matchTipo && matchEstado && matchBusqueda;
        });
    }, [certificaciones, filtros, busquedaDebounced]);

    return (
        <div className="certificaciones-investigador-page">
            <div className="certificaciones-investigador-card">
                <h1 className="certificaciones-investigador-title">
                    Mis Certificaciones
                </h1>
                <div className={"row"}>
                    <div className="certificaciones-filtro-item">
                        <label className="certificaciones-label">Buscar por nombre:</label>
                        <input
                            type="text"
                            placeholder="Ej: AWS, Scrum, etc..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="input-field"
                        />
                    </div>
                <div className="certificaciones-filtro-item">
                    <label className="certificaciones-label">Tipo Certificación:</label>
                    <Select
                        classNamePrefix="react-select"
                        isMulti
                        isClearable
                        closeMenuOnSelect={false}
                        options={opcionesTipos}
                        value={filtros.tipos}
                        onChange={(selected) =>
                            setFiltros((prev) => ({
                                ...prev,
                                tipos: selected || [],
                            }))
                        }
                    />
                </div>

                <div className="certificaciones-filtro-item">
                    <label className="certificaciones-label">Estado Certificación:</label>
                    <Select
                        classNamePrefix="react-select"
                        isMulti
                        isClearable
                        closeMenuOnSelect={false}
                        options={opcionesEstados}
                        value={filtros.estados}
                        onChange={(selected) =>
                            setFiltros((prev) => ({
                                ...prev,
                                estados: selected || [],
                            }))
                        }
                    />
                </div>
                </div>
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
                    {filtradas.length > 0 ? (
                        filtradas.map((cert, idx) => (
                            <tr key={cert.id || idx}>
                                <td>{cert.nombreCertificacion}</td>
                                <td>{cert.entidadEmisora?.nombre}</td>
                                <td>{cert.tipoCertificacion?.despliegue}</td>
                                <td>{cert.estado?.despliegue}</td>
                                <td>{cert.fechaExpiracion}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No se encontraron certificaciones.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}