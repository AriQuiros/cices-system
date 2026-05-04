// src/paginas/usuarios/formUsuario/RegistroInvestigador.jsx
import EntidadSelect from "../../components/shared/EntidadSelect.jsx";
import InputField from "../../utils/ui/InputField.jsx";
import { maxLength } from "../../validators/Validators.jsx";
import { FormacionList } from "../../components/formacionComponents/FormacionList.jsx";
import { useCatalogos } from "../../hooks/referenceDataHooks/useCatalogos.js";
import { TituloDTO, CertificacionDTO } from "../../modelos/investigadorDTO.jsx";
import "./Registro.css";

export default function RegistroInvestigador({
                                                 investigador,
                                                 nivelAcademico = [],
                                                 modoPerfil = false,
                                                 onActualizarCampo,
                                                 onActualizarItem,
                                                 onAgregarItem,
                                                 onEliminarItem
                                             }) {

    const { data: catalogosRaw } = useCatalogos(["TIPO_CERTIFICACION"]);
    const catalogos = catalogosRaw?.data ?? catalogosRaw ?? {};
    const tiposCertificacion = catalogos["TIPO_CERTIFICACION"] || [];

    // Resuelve objetos de catálogo para campos especiales
    const handleActualizarItem = (coleccion, idx, campo, valor) => {
        if (campo === "nivelTitulo") {
            const nivel = nivelAcademico.find(n => n.valor === valor);
            onActualizarItem(coleccion, idx, campo, nivel);
            return;
        }
        if (campo === "tipoCertificacion") {
            const tipo = tiposCertificacion.find(t => t.valor === valor);
            onActualizarItem(coleccion, idx, campo, tipo);
            return;
        }
        onActualizarItem(coleccion, idx, campo, valor);
    };

    const configTitulos = {
        tipo:               "titulos",
        titulo:             "Títulos académicos (formal)",
        nota:               "No es obligatorio ingresar títulos en este momento.",
        labelNombre:        "Nombre del título",
        campNombre:         "nombreTitulo",
        mostrarNivel:       true,
        campNivel:          "nivelTitulo",
        opcionesNivel:      nivelAcademico,
        mostrarTipo:        false,
        mostrarFechaEmision: true,
        mostrarFechaExp:    false
    };

    const configCertificaciones = {
        tipo:               "certificaciones",
        titulo:             "Certificaciones (informal)",
        nota:               "No es obligatorio ingresar certificaciones en este momento.",
        labelNombre:        "Nombre de la certificación",
        campNombre:         "nombreCertificacion",
        mostrarNivel:       false,
        mostrarTipo:        true,
        campTipo:           "tipoCertificacion",
        opcionesTipo:       tiposCertificacion,
        mostrarFechaEmision: false,
        mostrarFechaExp:    true
    };

    return (
        <div className="formacion-section">
            <div className="formacion-header">
                <h2 className="formacion-title">Formación académica e investigativa</h2>
                <p className="formacion-description">
                    Complete la información de procedencia, títulos y certificaciones del investigador.
                </p>
            </div>

            {/* Institución y Unidad */}
            <div className="formacion-top-grid">
                <div className="input-group formacion-top-field">
                    <label className="input-label">Institución de origen</label>
                    <EntidadSelect
                        required
                        tipo="INSTITUCION"
                        value={investigador.institucionOrigen}
                        onChange={val => onActualizarCampo("institucionOrigen", val)}
                        placeholder="Institución de origen"
                    />
                </div>

                <div className="input-group formacion-top-field">
                    <label className="input-label">Unidad académica</label>
                    <EntidadSelect
                        required
                        tipo="UNIDAD"
                        value={investigador.unidadAcademica}
                        onChange={val => onActualizarCampo("unidadAcademica", val)}
                        placeholder="Unidad académica"
                    />
                </div>
            </div>

            {/* Tema interés */}
            <div className="formacion-topic">
                <InputField
                    label="Tema de interés / tesis"
                    name="temaInteres"
                    placeholder="Tema de investigación o área de interés"
                    value={investigador.temaInteres || ""}
                    onChange={e => onActualizarCampo("temaInteres", e.target.value)}
                    rules={[maxLength(254)]}
                    maxLength={254}
                />
            </div>

            {/* Títulos */}
            <FormacionList
                items={investigador.titulos || []}
                config={configTitulos}
                dtoVacio={TituloDTO}
                modoPerfil={modoPerfil}
                onAgregar={onAgregarItem}
                onActualizar={handleActualizarItem}
                onEliminar={onEliminarItem}
            />

            {/* Certificaciones */}
            <FormacionList
                items={investigador.certificaciones || []}
                config={configCertificaciones}
                dtoVacio={CertificacionDTO}
                modoPerfil={modoPerfil}
                onAgregar={onAgregarItem}
                onActualizar={handleActualizarItem}
                onEliminar={onEliminarItem}
            />
        </div>
    );
}