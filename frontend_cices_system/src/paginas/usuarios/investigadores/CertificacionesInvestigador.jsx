// src/paginas/usuarios/investigadores/CertificacionesInvestigador.jsx
import { Pagination } from "../../../components/ui/Pagination.jsx";
import { useConsultaCertificaciones } from "../../../modules/formacion/hooks/useConsultaCertificaciones.js";
import { CertificacionFiltros } from "../../../modules/formacion/components/CertificacionFiltros.jsx";
import { CertificacionResumen } from "../../../modules/formacion/components/CertificacionResumen.jsx";
import { CertificacionTabla } from "../../../modules/formacion/components/CertificacionTabla.jsx";
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