import React, { useContext, useEffect, useState } from "react";
import "./RegistroInvestigador.css";
import { fetchTiposCatalogo } from "../../../services/CatalogoService.js";
import { InvestigadorContext } from "../../../context/investigadorCtx/InvestigadorContext.jsx";
import { TituloDTO, CertificacionDTO } from "../../../modelos/investigadorDTO.jsx";

function RegistroInvestigadorInner({nivelAcademico}) {
    const {
        investigador,
        actualizarCampo,
        agregarItem,
        actualizarItem,
        eliminarItem,
    } = useContext(InvestigadorContext);

    const [tiposCertificacion, setTiposCertificacion] = useState([]);
    const [loadingCatalogos, setLoadingCatalogos] = useState(true);

    useEffect(() => {
        let cancel = false;
        (async () => {
            try {
                const tipos = await fetchTiposCatalogo("", ["TIPO_CERTIFICACION"]);
                if (!cancel) {
                    setTiposCertificacion(tipos?.TIPO_CERTIFICACION || []);
                }
            } catch {
                if (!cancel) {
                    setTiposCertificacion([]);
                }
            } finally {
                if (!cancel) setLoadingCatalogos(false);
            }
        })();

        return () => {
            cancel = true;
        };
    }, []);

    const handleBaseChange = (e) => {
        const { name, value } = e.target;

        if (name === "institucionOrigen") {
            actualizarCampo("institucionOrigen", {
                ...investigador.institucionOrigen,
                nombre: value,
                tipo: "INSTITUTION"
            });
            return;
        }

        if (name === "unidadAcademica") {
            actualizarCampo("unidadAcademica", {
                ...investigador.unidadAcademica,
                nombre: value,
                tipo: "UNIDAD"
            });

        }

    };

    const handleArrayChange = (collection, idx, field, value) => {
        if (field === "entidadEmisora") {
            actualizarItem(collection, idx, field, {
                nombre: value,
                tipo: "INSTITUTION"
            });
            return;
        }

        actualizarItem(collection, idx, field, value);
    };

    const handleAdd = (collection, dto) => {
        agregarItem(collection, dto);
    };

    const handleRemove = (collection, idx) => {
        eliminarItem(collection, idx);
    };

    return (
        <div>
            <h2>Registro Investigador</h2>

                <input
                    className="input"
                    type="text"
                    name="institucionOrigen"
                    placeholder="Institucion de origen (ej: UCR)"
                    value={investigador.institucionOrigen?.nombre || ""}
                    onChange={handleBaseChange}
                    required
                />

                <input
                    className="input"
                    type="text"
                    name="unidadAcademica"
                    placeholder="Unidad academica (ej: Escuela de ...)"
                    value={investigador.unidadAcademica?.nombre || ""}
                    onChange={handleBaseChange}
                    required
                />

                <div className="field">
                    <label className="input-label">Tema de interés / tesis</label>
                    <input
                        className="input"
                        type="text"
                        name="temaInteres"
                        placeholder="Tema de investigación o área de interés"
                        value={investigador.temaInteres || ""}
                        onChange={(e) => actualizarCampo("temaInteres", e.target.value)}
                    />
                </div>

                <h3 className="section-title">Certificaciones (capacitaciones, cursos, etc.)</h3>
                <p>
                    En este apartado se pueden registrar acreditaciones o licencias profesionales
                    <br />
                    que requieran para la participacion en los proyectos.
                </p>
                <p className="info-text">No es obligatorio ingresar una certificacion en este momento.</p>
                {(investigador.certificaciones || []).length === 0 && (
                    <button onClick={() => handleAdd("certificaciones", CertificacionDTO)}>Agregar certificación</button>
                )}
                <div className="rows-group">
                    {(investigador.certificaciones || []).map((c, idx) => (
                        <div className="row" key={idx}>
                            <div className="field">
                                <label />
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Institución"
                                    value={c.entidadEmisora?.nombre || ""}
                                    onChange={(e) => handleArrayChange("certificaciones", idx, "entidadEmisora", e.target.value)}
                                />
                            </div>

                            <div className="field">
                                <label />
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Nombre de la certificacion"
                                    value={c.nombreCertificacion || ""}
                                    onChange={(e) => handleArrayChange("certificaciones", idx, "nombreCertificacion", e.target.value)}
                                />
                            </div>

                            <div className="field select-wrap">
                                <label />
                                <select
                                    className="select"
                                    value={c.tipoCertificacion || ""}
                                    onChange={(e) => handleArrayChange("certificaciones", idx, "tipoCertificacion", e.target.value)}
                                    disabled={loadingCatalogos || tiposCertificacion.length === 0}
                                >
                                    <option value="">{loadingCatalogos ? "Cargando..." : "Tipo de certificacion"}</option>
                                    {tiposCertificacion.map((t) => (
                                        <option key={t.id} value={t.valor}>
                                            {t.despliegue}
                                        </option>
                                    ))}
                                </select>
                                <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m6 9 6 6 6-6" strokeLinecap="round" />
                                </svg>
                            </div>

                            <div className="field with-icon">
                                <label htmlFor={`expiracion-${idx}`} className="label-small">
                                    Fecha de expiracion
                                </label>
                                <input
                                    id={`expiracion-${idx}`}
                                    className="input"
                                    type="date"
                                    value={c.fechaExpiracion || ""}
                                    onChange={(e) => handleArrayChange("certificaciones", idx, "fechaExpiracion", e.target.value)}
                                />
                            </div>

                            {idx === (investigador.certificaciones || []).length - 1 ? (
                                <button type="button" className="icon-btn" onClick={() => handleAdd("certificaciones", CertificacionDTO)}>
                                    +
                                </button>
                            ) : (investigador.certificaciones || []).length > 1 ? (
                                <button
                                    type="button"
                                    className="icon-btn remove-btn"
                                    onClick={() => handleRemove("certificaciones", idx)}
                                    aria-label="Quitar certificacion"
                                >
                                    &#10006;
                                </button>
                            ) : null}
                        </div>
                    ))}
                </div>
            <h3 className="section-title">Títulos académicos</h3>
            <p>
                En este apartado se pueden registrar los títulos académicos.
            </p>
            <p className="info-text">No es obligatorio ingresar un título en este momento.</p>
            {(investigador.titulos || []).length === 0 && (
                <button type="button" onClick={() => agregarItem("titulos", TituloDTO)}>
                    Agregar título
                </button>
            )}
            <div className="rows-group">
                {(investigador.titulos || []).map((t, idx) => (
                    <div className="row" key={idx}>
                        <div className="field">
                            <label />
                            <input
                                className="input"
                                type="text"
                                placeholder="Institución"
                                value={t.entidadEmisora?.nombre || ""}
                                onChange={(e) => handleArrayChange("titulos", idx, "entidadEmisora", e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label />
                            <input
                                className="input"
                                type="text"
                                placeholder="Nombre del título"
                                value={t.nombreTitulo || ""}
                                onChange={(e) => handleArrayChange("titulos", idx, "nombreTitulo", e.target.value)}
                            />
                        </div>

                       <div className="input-group">
                        <label htmlFor="nivelAcademico" className="input-label">Nivel Academico</label>
                           <select
                               id={`nivelAcademico-${idx}`}
                            className="input-field"
                            name="nivelAcademico"
                            value={t.nivelTitulo || ""}
                               onChange={(e) => handleArrayChange("titulos", idx, "nivelTitulo", e.target.value)}
                        >
                            <option value="">Nivel</option>
                            {nivelAcademico?.map(tipo => (
                                <option key={tipo.id} value={tipo.valor}>
                                    {tipo.despliegue ? tipo.despliegue.charAt(0).toUpperCase() + tipo.despliegue.slice(1).toLowerCase() : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                        <div className="field with-icon">
                            <label htmlFor={`fechaEmision-${idx}`} className="label-small">
                                Fecha de emisión
                            </label>
                            <input
                                id={`fechaEmision-${idx}`}
                                className="input"
                                type="date"
                                value={t.fechaEmision || ""}
                                onChange={(e) => handleArrayChange("titulos", idx, "fechaEmision", e.target.value)}
                            />
                        </div>

                        {idx === (investigador.titulos || []).length - 1 ? (
                            <button
                                type="button"
                                className="icon-btn"
                                onClick={() => handleAdd("titulos", TituloDTO)}
                            >
                                +
                            </button>
                        ) : (investigador.titulos || []).length > 1 ? (
                            <button
                                type="button"
                                className="icon-btn remove-btn"
                                onClick={() => handleRemove("titulos", idx)}
                                aria-label="Quitar título"
                            >
                                &#10006;
                            </button>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function RegistroInvestigador(props) {
    return <RegistroInvestigadorInner {...props} />;
}
