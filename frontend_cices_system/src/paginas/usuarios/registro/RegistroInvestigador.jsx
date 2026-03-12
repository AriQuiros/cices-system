import React, { useContext, useEffect, useState } from "react";
import "./RegistroInvestigador.css";

import { fetchTiposCatalogo } from "../../../services/CatalogoService.js";
import { InvestigadorContext } from "../../../context/investigadorCtx/InvestigadorContext.jsx";
import { TituloDTO, CertificacionDTO } from "../../../modelos/investigadorDTO.jsx";

import InputField from "../../../utils/validaciones/InputField.jsx";
import Select from "react-select";
import { required, maxLength } from "../../../utils/validaciones/Validators.jsx";

function RegistroInvestigadorInner({ nivelAcademico }) {

    const {
        investigador,
        actualizarCampo,
        agregarItem,
        actualizarItem,
        eliminarItem,
    } = useContext(InvestigadorContext);

    const [tiposCertificacion, setTiposCertificacion] = useState([]);
    const [loadingCatalogos, setLoadingCatalogos] = useState(true);

    const [institucionOptions, setInstitucionOptions] = useState([]);
    const [unidadOptions, setUnidadOptions] = useState([]);

    // Cargar catálogos de certificaciones
    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                const tipos = await fetchTiposCatalogo("", ["TIPO_CERTIFICACION"]);
                if (!cancel) {
                    setTiposCertificacion(tipos?.TIPO_CERTIFICACION || []);
                }
            } catch {
                if (!cancel) setTiposCertificacion([]);
            } finally {
                if (!cancel) setLoadingCatalogos(false);
            }
        })();

        return () => { cancel = true; };
    }, []);

    // Cargar entidades y separar por tipo
    useEffect(() => {
        async function fetchEntidades() {
            const response = await fetch("http://localhost:8080/api/entidades");
            const data = await response.json();

            setInstitucionOptions(
                data
                    .filter(e => e.tipo.valor === "INSTITUTION")
                    .map(e => ({ value: e.id, label: e.nombre, tipo: e.tipo }))
            );

            setUnidadOptions(
                data
                    .filter(e => e.tipo.valor === "UNIDAD")
                    .map(e => ({ value: e.id, label: e.nombre, tipo: e.tipo }))
            );
        }

        fetchEntidades();
    }, []);

    // Función para manejar Select de entidad (institución/unidad/certificación/título)
    const construirEntidadPayload = (entidad, listaOpciones) => {
        if (!entidad) return null;

        if (entidad.id) {
            return {
                id: entidad.id,
                nombre: entidad.nombre,
                tipo: entidad.tipo // ya viene del backend
            };
        }

        // Nueva entidad → tomar tipo de la primera opción de la lista
        const tipoReferencia = listaOpciones.length > 0 ? listaOpciones[0].tipo : null;

        return {
            id: null,
            nombre: entidad.nombre,
            tipo: tipoReferencia
        };
    };

    const handleArrayChange = (collection, idx, field, value) => {

        if (field === "entidadEmisora") {
            actualizarItem(collection, idx, field, { nombre: value });
            return;
        }

        if (field === "tipoCertificacion") {
            const tipo = tiposCertificacion.find(t => t.valor === value);
            actualizarItem(collection, idx, field, tipo);
            return;
        }

        if (field === "nivelTitulo") {
            const nivel = nivelAcademico?.find(n => n.valor === value);
            actualizarItem(collection, idx, field, nivel);
            return;
        }

        actualizarItem(collection, idx, field, value);
    };

    const handleAdd = (collection, dto) => { agregarItem(collection, dto); };
    const handleRemove = (collection, idx) => { eliminarItem(collection, idx); };

    // Construir payload final para enviar al backend
    const construirPayload = () => {

        const payload = {
            ...investigador,
            institucionOrigen: construirEntidadPayload(investigador.institucionOrigen, institucionOptions),
            unidadAcademica: construirEntidadPayload(investigador.unidadAcademica, unidadOptions),
            titulos: (investigador.titulos || []).map(t => ({
                ...t,
                entidadEmisora: construirEntidadPayload(t.entidadEmisora, institucionOptions)
            })),
            certificaciones: (investigador.certificaciones || []).map(c => ({
                ...c,
                entidadEmisora: construirEntidadPayload(c.entidadEmisora, institucionOptions)
            }))
        };

        return payload;
    };

    // ----- Resto del formulario ----- //
    return (
        <div>
            <h2>Registro Investigador</h2>

            {/* Institución de origen */}
            <div className="input-group">
                <label className="input-label">Institución de origen</label>
                <Select
                    placeholder="Institución de origen (ej: UCR)"
                    options={institucionOptions}
                    value={
                        investigador.institucionOrigen?.nombre
                            ? { value: investigador.institucionOrigen.id || investigador.institucionOrigen.nombre, label: investigador.institucionOrigen.nombre }
                            : null
                    }
                    onChange={(option) =>
                        actualizarCampo(
                            "institucionOrigen",
                            { id: option?.value || null, nombre: option?.label, tipo: option?.tipo || null }
                        )
                    }
                    onInputChange={(inputValue) =>
                        actualizarCampo("institucionOrigen", { id: null, nombre: inputValue })
                    }
                    isClearable
                />
            </div>

            {/* Unidad académica */}
            <div className="input-group">
                <label className="input-label">Unidad académica</label>
                <Select
                    placeholder="Unidad académica (ej: Escuela de ...)"
                    options={unidadOptions}
                    value={
                        investigador.unidadAcademica?.nombre
                            ? { value: investigador.unidadAcademica.id || investigador.unidadAcademica.nombre, label: investigador.unidadAcademica.nombre }
                            : null
                    }
                    onChange={(option) =>
                        actualizarCampo(
                            "unidadAcademica",
                            { id: option?.value || null, nombre: option?.label, tipo: option?.tipo || null }
                        )
                    }
                    onInputChange={(inputValue) =>
                        actualizarCampo("unidadAcademica", { id: null, nombre: inputValue })
                    }
                    isClearable
                />
            </div>

            {/* Tema de interés */}
            <InputField
                label="Tema de interés / tesis"
                name="temaInteres"
                placeholder="Tema de investigación o área de interés"
                value={investigador.temaInteres || ""}
                onChange={(e) => actualizarCampo("temaInteres", e.target.value)}
                rules={[maxLength(254)]}
                maxLength={254}
            />

            {/* Certificaciones */}
            <h3 className="section-title">Certificaciones</h3>
            <p>No es obligatorio ingresar una certificación en este momento.</p>
            {(investigador.certificaciones || []).length === 0 && (
                <button type="button" onClick={() => handleAdd("certificaciones", CertificacionDTO)}>Agregar certificación</button>
            )}
            <div className="rows-group">
                {(investigador.certificaciones || []).map((c, idx) => (
                    <div className="row" key={idx}>
                        <InputField
                            name={`cert-nombre-${idx}`}
                            placeholder="Nombre de la certificación"
                            value={c.nombreCertificacion || ""}
                            onChange={(e) => handleArrayChange("certificaciones", idx, "nombreCertificacion", e.target.value)}
                            rules={[required(), maxLength(254)]}
                            required maxLength={254}
                        />
                        <Select
                            placeholder="Institución"
                            options={institucionOptions}
                            value={
                                c.entidadEmisora?.nombre
                                    ? { value: c.entidadEmisora.id || c.entidadEmisora.nombre, label: c.entidadEmisora.nombre }
                                    : null
                            }
                            onChange={(option) =>
                                handleArrayChange("certificaciones", idx, "entidadEmisora", { id: option?.value || null, nombre: option?.label, tipo: option?.tipo || null })
                            }
                            onInputChange={(inputValue) =>
                                handleArrayChange("certificaciones", idx, "entidadEmisora", { id: null, nombre: inputValue })
                            }
                            isClearable
                        />
                        <div className="field select-wrap">
                            <select
                                className="select"
                                value={c.tipoCertificacion?.valor || ""}
                                onChange={(e) => handleArrayChange("certificaciones", idx, "tipoCertificacion", e.target.value)}
                                required
                                disabled={loadingCatalogos || tiposCertificacion.length === 0}
                            >
                                <option value="">{loadingCatalogos ? "Cargando..." : "Tipo de certificación"}</option>
                                {tiposCertificacion.map((t) => (
                                    <option key={t.id} value={t.valor}>{t.despliegue}</option>
                                ))}
                            </select>
                        </div>
                        <InputField
                            name={`cert-exp-${idx}`}
                            type="date"
                            value={c.fechaExpiracion || ""}
                            onChange={(e) => handleArrayChange("certificaciones", idx, "fechaExpiracion", e.target.value)}
                        />
                        <button type="button" className="icon-btn remove-btn" onClick={() => handleRemove("certificaciones", idx)} disabled={(investigador.certificaciones || []).length === 0}>✖</button>
                        <button type="button" className="icon-btn" onClick={() => handleAdd("certificaciones", CertificacionDTO)}>+</button>
                    </div>
                ))}
            </div>

            {/* Títulos académicos */}
            <h3 className="section-title">Títulos académicos</h3>
            <p>No es obligatorio ingresar titulos en este momento.</p>
            {(investigador.titulos || []).length === 0 && (
                <button type="button" onClick={() => handleAdd("titulos", TituloDTO)}>Agregar título</button>
            )}
            <div className="rows-group">
                {(investigador.titulos || []).map((t, idx) => (
                    <div className="row" key={idx}>
                        <InputField
                            name={`titulo-nombre-${idx}`}
                            placeholder="Nombre del título"
                            value={t.nombreTitulo || ""}
                            onChange={(e) => handleArrayChange("titulos", idx, "nombreTitulo", e.target.value)}
                            rules={[required(), maxLength(254)]}
                            required
                            maxLength={254}
                        />
                        <Select
                            placeholder="Institución"
                            options={institucionOptions}
                            value={
                                t.entidadEmisora?.nombre
                                    ? { value: t.entidadEmisora.id || t.entidadEmisora.nombre, label: t.entidadEmisora.nombre }
                                    : null
                            }
                            onChange={(option) =>
                                handleArrayChange("titulos", idx, "entidadEmisora", { id: option?.value || null, nombre: option?.label, tipo: option?.tipo || null })
                            }
                            onInputChange={(inputValue) =>
                                handleArrayChange("titulos", idx, "entidadEmisora", { id: null, nombre: inputValue })
                            }
                            isClearable
                        />
                        <div className="input-group">
                            <label className="input-label">Nivel Académico</label>
                            <select
                                value={t.nivelTitulo?.valor || ""}
                                onChange={(e) => handleArrayChange("titulos", idx, "nivelTitulo", e.target.value)}
                            >
                                <option value="">Nivel</option>
                                {nivelAcademico?.map(tipo => (
                                    <option key={tipo.id} value={tipo.valor}>{tipo.despliegue}</option>
                                ))}
                            </select>
                        </div>
                        <InputField
                            name={`titulo-fecha-${idx}`}
                            type="date"
                            value={t.fechaEmision || ""}
                            onChange={(e) => handleArrayChange("titulos", idx, "fechaEmision", e.target.value)}
                            rules={[required()]}
                            required
                        />
                        <button type="button" className="icon-btn remove-btn" onClick={() => handleRemove("titulos", idx)} disabled={(investigador.titulos || []).length === 0}>✖</button>
                        <button type="button" className="icon-btn" onClick={() => handleAdd("titulos", TituloDTO)}>+</button>
                    </div>
                ))}
            </div>

            {/* BOTÓN DE ENVÍO */}
            <button type="button" onClick={() => console.log("Payload a enviar:", construirPayload())}>
                Enviar Investigador
            </button>
        </div>
    );
}

export default function RegistroInvestigador(props) {
    return <RegistroInvestigadorInner {...props} />;
}