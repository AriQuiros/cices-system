// src/modules/formacion/components/CertificacionTabla.jsx
import React from "react";
import { formatearFechaCR } from "../../utils/formatoFechaCR.js";
import { colorPorEstado } from "../../hooks/formacionHooks/useConsultaCertificaciones.js";

function ChipEstado({ estado }) {
    const estilos = colorPorEstado(estado);
    return (
        <span
            className="cert-estado-chip"
            style={{
                backgroundColor: estilos.bg,
                color: estilos.color,
                border: `1px solid ${estilos.border}`
            }}
        >
            <span
                className="cert-estado-dot"
                style={{ backgroundColor: estilos.color }}
            />
            {estado}
        </span>
    );
}

export function CertificacionTabla({
                                       certificaciones = [],
                                       mostrarInvestigador = true,
                                       agrupado = false,
                                       agruparFn,
                                       ordenFecha = "desc"
                                   }) {

    if (certificaciones.length === 0) {
        return <p className="cert-sin-datos">No se encontraron certificaciones.</p>;
    }

    // Vista agrupada por investigador (solo disponible cuando mostrarInvestigador=true)
    if (agrupado && mostrarInvestigador && agruparFn) {
        const grupos = agruparFn(certificaciones, ordenFecha);

        return (
            <table className="cert-table">
                <thead>
                <tr>
                    <th>Investigador</th>
                    <th>Certificación</th>
                    <th>Institución</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Fecha expira</th>
                </tr>
                </thead>
                <tbody>
                {grupos.map(({ identificacion, nombre, certificaciones: certs }) => (
                    <React.Fragment key={identificacion}>
                        <tr>
                            <td rowSpan={certs.length}>{nombre}</td>
                            <td>{certs[0].nombre}</td>
                            <td>{certs[0].institucion}</td>
                            <td>{certs[0].tipo}</td>
                            <td><ChipEstado estado={certs[0].estado} /></td>
                            <td>{formatearFechaCR(certs[0].fecha)}</td>
                        </tr>
                        {certs.slice(1).map((cert, idx) => (
                            <tr key={identificacion + idx}>
                                <td>{cert.nombre}</td>
                                <td>{cert.institucion}</td>
                                <td>{cert.tipo}</td>
                                <td><ChipEstado estado={cert.estado} /></td>
                                <td>{formatearFechaCR(cert.fecha)}</td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        );
    }

    // Vista plana
    return (
        <table className="cert-table">
            <thead>
            <tr>
                {mostrarInvestigador && <th>Investigador</th>}
                <th>Certificación</th>
                <th>Institución</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha expira</th>
            </tr>
            </thead>
            <tbody>
            {certificaciones.map((cert, idx) => (
                <tr key={cert.identificacionInvestigador + idx}>
                    {mostrarInvestigador && <td>{cert.nombreInvestigador}</td>}
                    <td>{cert.nombre}</td>
                    <td>{cert.institucion}</td>
                    <td>{cert.tipo}</td>
                    <td><ChipEstado estado={cert.estado} /></td>
                    <td>{formatearFechaCR(cert.fecha)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}