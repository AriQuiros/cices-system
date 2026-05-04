// src/paginas/usuarios/investigadores/CertificacionesInvestigador.jsx
import { Pagination } from "../../components/shared/Pagination.jsx";
import { useConsultaCertificaciones } from "../../hooks/formacionHooks/useConsultaCertificaciones.js";
import { CertificacionFiltros } from "../../components/filtrado/CertificacionFiltros.jsx";
import { CertificacionResumen } from "../../components/formacionComponents/CertificacionResumen.jsx";
import { CertificacionTabla } from "../../components/formacionComponents/CertificacionTabla.jsx";
import "./CertificacionesInvestigador.css";

export default function MisCertificacionesPage() {

    const {
        certificaciones,
        totalElements,
        totalPages,
        isLoading,
        filtro,
        cambiarFiltro,
        limpiarFiltros,
        pageable,
        cambiarPagina,
        opcionesTipos,
        opcionesEstados,
        resumenEstados
    } = useConsultaCertificaciones("mis");

    return (
        <div className="certificaciones-investigador-page">
            <div className="certificaciones-investigador-card">

                <h1 className="certificaciones-investigador-title">Mis certificaciones</h1>

                <CertificacionFiltros
                    filtro={filtro}
                    onChange={cambiarFiltro}
                    onLimpiar={limpiarFiltros}
                    opcionesTipos={opcionesTipos}
                    opcionesEstados={opcionesEstados}
                    mostrarInvestigador={false}
                />

                <CertificacionResumen
                    totalElements={totalElements}
                    resumenEstados={resumenEstados}
                />

                {isLoading && <p className="cert-cargando">Cargando...</p>}

                <CertificacionTabla
                    certificaciones={certificaciones}
                    mostrarInvestigador={false}
                />

                <Pagination
                    page={pageable.page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    onPageChange={cambiarPagina}
                />

            </div>
        </div>
    );
}