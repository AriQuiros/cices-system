// src/modules/formacion/components/CertificacionResumen.jsx
import { colorPorEstado } from "../../hooks/formacionHooks/useConsultaCertificaciones.js";

export function CertificacionResumen({ totalElements, resumenEstados }) {
    return (
        <div className="cert-resumen-wrapper">

            <div className="cert-resumen-total">
                <span className="cert-resumen-label">Total</span>
                <span className="cert-resumen-numero">{totalElements}</span>
            </div>

            <div className="cert-resumen-estados">
                {Object.entries(resumenEstados).map(([estado, cantidad]) => {
                    const estilos = colorPorEstado(estado);
                    return (
                        <div
                            key={estado}
                            className="cert-resumen-chip"
                            style={{
                                backgroundColor: estilos.bg,
                                color: estilos.color,
                                border: `1px solid ${estilos.border}`
                            }}
                        >
                            <span
                                className="cert-resumen-dot"
                                style={{ backgroundColor: estilos.color }}
                            />
                            <span>{estado}</span>
                            <strong>{cantidad}</strong>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}