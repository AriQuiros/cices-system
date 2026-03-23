import React, { useContext, useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { useTiposCatalogo } from "../../../hooks/useTiposCatalogo";
import { AppContext } from "../../../context/AppContext.jsx";
import "./Certificaciones.css";

// Función optimizada de agrupamiento que respeta ordenFecha
const agruparPorInvestigador = (data, ordenFecha = "desc") => {
    const grouped = data.reduce((acc, cert) => {
        const key = cert.identificacionInvestigador;
        if (!acc[key]) {
            acc[key] = {
                identificacion: key,
                nombre: cert.nombreInvestigador,
                certificaciones: [],
            };
        }
        acc[key].certificaciones.push(cert);
        return acc;
    }, {});

    // Ordenar cada grupo según ordenFecha
    Object.values(grouped).forEach((g) => {
        g.certificaciones.sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);
            return ordenFecha === "desc" ? fechaB - fechaA : fechaA - fechaB;
        });
    });

    return grouped;
};

export default function CertificacionesPage() {
    const { token } = useContext(AppContext);

    const [certificaciones, setCertificaciones] = useState([]);
    const [filtros, setFiltros] = useState({
        nombre: "",
        tipos: [],
        estados: [],
    });
    const [agrupado, setAgrupado] = useState(false);
    const [ordenFecha, setOrdenFecha] = useState("asc"); // default

    const { tipos: catalogos } = useTiposCatalogo(token, [
        "TIPO_CERTIFICACION",
        "ESTADO_CERTIFICACION",
    ]);

    // Cargar datos
    useEffect(() => {
        fetch("/api/reports/certificaciones/all")
            .then((res) => res.json())
            .then((data) => setCertificaciones(data))
            .catch((err) => console.error(err));
    }, []);

    // Filtrado
    const filtradas = useMemo(() => {
        return certificaciones.filter((cert) => {
            const matchNombre = cert.nombreInvestigador
                .toLowerCase()
                .includes(filtros.nombre.toLowerCase());

            const matchTipo =
                filtros.tipos.length === 0 ||
                filtros.tipos.some((t) => t.value === cert.tipo.toUpperCase());

            const matchEstado =
                filtros.estados.length === 0 ||
                filtros.estados.some((e) => e.value === cert.estado.toUpperCase());

            return matchNombre && matchTipo && matchEstado;
        });
    }, [certificaciones, filtros]);

    // Ordenamiento
    const ordenadas = useMemo(() => {
        return [...filtradas].sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);

            return ordenFecha === "desc" ? fechaB - fechaA : fechaA - fechaB;
        });
    }, [filtradas, ordenFecha]);

    // Resumen
    const resumen = useMemo(() => {
        const total = ordenadas.length;

        const porEstado = ordenadas.reduce((acc, cert) => {
            const estado = cert.estado || "SIN ESTADO";
            acc[estado] = (acc[estado] || 0) + 1;
            return acc;
        }, {});

        return { total, porEstado };
    }, [ordenadas]);

    // Agrupamiento según ordenFecha
    const agrupadas = agrupado
        ? Object.values(agruparPorInvestigador(ordenadas, ordenFecha))
        : null;

    return (
        <div className="cert-page">
            <div className="cert-card">
                <h1 className="cert-title">Certificaciones</h1>

            {/* Controles */}
            <div className="cert-controls">
                <label className="cert-checkbox-label">
                    <input
                        type="checkbox"
                        checked={agrupado}
                        onChange={(e) => setAgrupado(e.target.checked)}
                    />{" "}
                    Agrupar por investigador
                </label>

                <div className="cert-order-group">
                    <label className="cert-label">Orden por fecha:</label>
                <select
                    className="cert-select"
                    value={ordenFecha}
                    onChange={(e) => setOrdenFecha(e.target.value)}
                >
                    <option value="desc">Más recientes primero</option>
                    <option value="asc">Más antiguas primero</option>
                </select>
                </div>
            </div>

            {/* Filtros */}
            <div className="cert-filters-grid">
                <div className="cert-field">
                    <label className="cert-label">Nombre Investigador:</label>
                <input
                    className="cert-input"
                    type="text"
                    value={filtros.nombre}
                    onChange={(e) =>
                        setFiltros((prev) => ({ ...prev, nombre: e.target.value }))
                    }
                />
                </div>

                <div className="cert-field">
                    <label className="cert-label">Tipo Certificación:</label>
                <Select
                    classNamePrefix="cert-select"
                    isMulti
                    options={catalogos?.TIPO_CERTIFICACION?.map(({ valor, despliegue }) => ({
                        value: valor,
                        label: despliegue,
                    }))}
                    value={filtros.tipos}
                    onChange={(selected) =>
                        setFiltros((prev) => ({ ...prev, tipos: selected }))
                    }
                />
                </div>

                <div className="cert-field">
                    <label className="cert-label">Estado Certificación:</label>
                <Select
                    classNamePrefix="cert-select"
                    isMulti
                    options={catalogos?.ESTADO_CERTIFICACION?.map(({ valor, despliegue }) => ({
                        value: valor,
                        label: despliegue,
                    }))}
                    value={filtros.estados}
                    onChange={(selected) =>
                        setFiltros((prev) => ({ ...prev, estados: selected }))
                    }
                />
                </div>
            </div>

            {/* Resumen */}
            <div className="cert-summary">
                <h3 className="cert-summary-title">Resumen</h3>
                <p className="cert-summary-total">
                    <strong>Total:</strong> {resumen.total}
                </p>
                <div className="cert-summary-status">
                    <strong>Por estado:</strong>
                    <ul className="cert-summary-list">
                        {Object.entries(resumen.porEstado).map(([estado, cantidad]) => (
                            <li key={estado}>
                                {estado}: {cantidad}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Tabla */}
            <div className="cert-table-card">
            <table className="cert-table">
                <thead>
                <tr>
                    <th>Investigador</th>
                    <th>Certificación</th>
                    <th>Institución</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                </tr>
                </thead>
                <tbody>
                {ordenadas.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="cert-empty">No se encontraron resultados</td>
                    </tr>
                ) : agrupado
                    ? agrupadas.map(({ identificacion, nombre, certificaciones }) => (
                        <React.Fragment key={identificacion}>
                            <tr>
                                <td rowSpan={certificaciones.length}>{nombre}</td>
                                <td>{certificaciones[0].nombre}</td>
                                <td>{certificaciones[0].institucion}</td>
                                <td>{certificaciones[0].tipo}</td>
                                <td>{certificaciones[0].estado}</td>
                                <td>{certificaciones[0].fecha}</td>
                            </tr>
                            {certificaciones.slice(1).map((cert, idx) => (
                                <tr key={identificacion + idx}>
                                    <td>{cert.nombre}</td>
                                    <td>{cert.institucion}</td>
                                    <td>{cert.tipo}</td>
                                    <td>{cert.estado}</td>
                                    <td>{cert.fecha}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))
                    : ordenadas.map((cert, idx) => (
                        <tr key={idx}>
                            <td>{cert.nombreInvestigador}</td>
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
            </div>
        </div>
    );
}