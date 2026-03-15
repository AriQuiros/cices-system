import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useTiposCatalogo } from "../../../hooks/useTiposCatalogo";

const agruparPorInvestigador = (data) => {
    return data.reduce((acc, cert) => {
        const key = cert.identificacionInvestigador;
        if (!acc[key]) {
            acc[key] = {
                identificacion: cert.identificacionInvestigador,
                nombre: cert.nombreInvestigador,
                certificaciones: [],
            };
        }
        acc[key].certificaciones.push(cert);
        return acc;
    }, {});
};

export default function CertificacionesPage() {
    const token = localStorage.getItem("token");

    const [certificaciones, setCertificaciones] = useState([]);
    const [filtros, setFiltros] = useState({
        nombre: "",
        tipos: [],
        estados: [],
    });
    const [agrupado, setAgrupado] = useState(true); // toggle agrupamiento

    const { tipos: catalogos } = useTiposCatalogo(token, [
        "TIPO_CERTIFICACION",
        "ESTADO_CERTIFICACION",
    ]);

    // Traer certificaciones
    useEffect(() => {
        fetch("/api/reports/certificaciones/all")
            .then((res) => res.json())
            .then((data) => setCertificaciones(data))
            .catch((err) => console.error(err));
    }, []);

    // Filtrado
    const filtradas = certificaciones.filter((cert) => {
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

    const agrupadas = agrupado
        ? Object.values(agruparPorInvestigador(filtradas))
        : null;

    return (
        <div>
            <h1>Certificaciones</h1>

            {/* Toggle agrupamiento */}
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={agrupado}
                        onChange={(e) => setAgrupado(e.target.checked)}
                    />{" "}
                    Agrupar por investigador
                </label>
            </div>

            {/* Filtros */}
            <div>
                <label>Nombre Investigador:</label>
                <input
                    type="text"
                    value={filtros.nombre}
                    onChange={(e) =>
                        setFiltros((prev) => ({ ...prev, nombre: e.target.value }))
                    }
                />
            </div>

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

            {/* Tabla */}
            <table border="1" cellPadding="4" cellSpacing="0">
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
                {agrupado
                    ? agrupadas.map(({ identificacion, nombre, certificaciones }) => (
                        <>
                            <tr key={identificacion}>
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
                        </>
                    ))
                    : filtradas.map((cert, idx) => (
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
    );
}