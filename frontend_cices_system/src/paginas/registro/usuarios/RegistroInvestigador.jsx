import React, { useContext, useEffect, useState } from "react";
import "./RegistroInvestigador.css";

import { fetchTiposCatalogo } from "../../../services/CatalogoService.js";
import { InvestigadorContext } from "../../../context/investigadorCtx/InvestigadorContext.jsx";
import { TituloDTO, CertificacionDTO } from "../../../modelos/investigadorDTO.jsx";

import InputField from "../../../utils/validaciones/InputField.jsx";
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

        return () => {

            cancel = true;

        };

    }, []);

    const handleBaseChange = (e) => {

        const { name, value } = e.target;

        if (name === "institucionOrigen") {

            actualizarCampo("institucionOrigen", {
                ...investigador.institucionOrigen,
                nombre: value
            });

            return;

        }

        if (name === "unidadAcademica") {

            actualizarCampo("unidadAcademica", {
                ...investigador.unidadAcademica,
                nombre: value
            });

        }

    };

    const handleArrayChange = (collection, idx, field, value) => {

        if (field === "entidadEmisora") {

            actualizarItem(collection, idx, field, {
                nombre: value
            });

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

    const handleAdd = (collection, dto) => {

        agregarItem(collection, dto);

    };

    const handleRemove = (collection, idx) => {

        eliminarItem(collection, idx);

    };

    return (

        <div>

            <h2>Registro Investigador</h2>

            <InputField
                label="Institución de origen"
                name="institucionOrigen"
                placeholder="Institucion de origen (ej: UCR)"
                value={investigador.institucionOrigen?.nombre || ""}
                onChange={handleBaseChange}
                rules={[required(), maxLength(254)]}
                required
                maxLength={254}
            />

            <InputField
                label="Unidad académica"
                name="unidadAcademica"
                placeholder="Unidad academica (ej: Escuela de ...)"
                value={investigador.unidadAcademica?.nombre || ""}
                onChange={handleBaseChange}
                rules={[required(), maxLength(254)]}
                required
                maxLength={254}
            />

            <InputField
                label="Tema de interés / tesis"
                name="temaInteres"
                placeholder="Tema de investigación o área de interés"
                value={investigador.temaInteres || ""}
                onChange={(e) => actualizarCampo("temaInteres", e.target.value)}
                rules={[maxLength(254)]}
                maxLength={254}
            />

            <h3 className="section-title">Certificaciones</h3>

            <p>
                En este apartado se pueden registrar acreditaciones o licencias profesionales
                que requieran para la participación en los proyectos.
            </p>

            <p className="info-text">
                No es obligatorio ingresar una certificación en este momento.
            </p>

            {(investigador.certificaciones || []).length === 0 && (

                <button
                    type="button"
                    onClick={() => handleAdd("certificaciones", CertificacionDTO)}
                >
                    Agregar certificación
                </button>

            )}

            <div className="rows-group">

                {(investigador.certificaciones || []).map((c, idx) => (

                    <div className="row" key={idx}>

                        <InputField
                            name={`cert-institucion-${idx}`}
                            placeholder="Institución"
                            value={c.entidadEmisora?.nombre || ""}
                            onChange={(e) =>
                                handleArrayChange("certificaciones", idx, "entidadEmisora", e.target.value)
                            }
                            rules={[required(), maxLength(254)]}
                            required
                            maxLength={254}
                        />

                        <InputField
                            name={`cert-nombre-${idx}`}
                            placeholder="Nombre de la certificación"
                            value={c.nombreCertificacion || ""}
                            onChange={(e) =>
                                handleArrayChange("certificaciones", idx, "nombreCertificacion", e.target.value)
                            }
                            rules={[required(), maxLength(254)]}
                            required
                            maxLength={254}
                        />

                        <div className="field select-wrap">

                            <select
                                className="select"
                                value={c.tipoCertificacion?.valor || ""}
                                onChange={(e) =>
                                    handleArrayChange("certificaciones", idx, "tipoCertificacion", e.target.value)
                                }
                                required
                                disabled={loadingCatalogos || tiposCertificacion.length === 0}
                            >

                                <option value="">
                                    {loadingCatalogos ? "Cargando..." : "Tipo de certificación"}
                                </option>

                                {tiposCertificacion.map((t) => (

                                    <option key={t.id} value={t.valor}>
                                        {t.despliegue}
                                    </option>

                                ))}

                            </select>

                        </div>

                        <InputField
                            name={`cert-exp-${idx}`}
                            type="date"
                            value={c.fechaExpiracion || ""}
                            onChange={(e) =>
                                handleArrayChange("certificaciones", idx, "fechaExpiracion", e.target.value)
                            }
                        />

                        {idx === (investigador.certificaciones || []).length - 1 ? (

                            <button
                                type="button"
                                className="icon-btn"
                                onClick={() => handleAdd("certificaciones", CertificacionDTO)}
                            >
                                +
                            </button>

                        ) : (investigador.certificaciones || []).length > 1 ? (

                            <button
                                type="button"
                                className="icon-btn remove-btn"
                                onClick={() => handleRemove("certificaciones", idx)}
                            >
                                ✖
                            </button>

                        ) : null}

                    </div>

                ))}

            </div>

            <h3 className="section-title">Títulos académicos</h3>

            <p>No es obligatorio ingresar un título en este momento.</p>

            {(investigador.titulos || []).length === 0 && (

                <button
                    type="button"
                    onClick={() => handleAdd("titulos", TituloDTO)}
                >
                    Agregar título
                </button>

            )}

            <div className="rows-group">

                {(investigador.titulos || []).map((t, idx) => (

                    <div className="row" key={idx}>

                        <InputField
                            name={`titulo-inst-${idx}`}
                            placeholder="Institución"
                            value={t.entidadEmisora?.nombre || ""}
                            onChange={(e) =>
                                handleArrayChange("titulos", idx, "entidadEmisora", e.target.value)
                            }
                            rules={[required(), maxLength(254)]}
                            required
                            maxLength={254}
                        />

                        <InputField
                            name={`titulo-nombre-${idx}`}
                            placeholder="Nombre del título"
                            value={t.nombreTitulo || ""}
                            onChange={(e) =>
                                handleArrayChange("titulos", idx, "nombreTitulo", e.target.value)
                            }
                            rules={[required(), maxLength(254)]}
                            required
                            maxLength={254}
                        />

                        <div className="input-group">

                            <label className="input-label">Nivel Académico</label>

                            <select
                                value={t.nivelTitulo?.valor || ""}
                                onChange={(e) =>
                                    handleArrayChange("titulos", idx, "nivelTitulo", e.target.value)
                                }
                            >

                                <option value="">Nivel</option>

                                {nivelAcademico?.map(tipo => (

                                    <option key={tipo.id} value={tipo.valor}>
                                        {tipo.despliegue}
                                    </option>

                                ))}

                            </select>

                        </div>

                        <InputField
                            name={`titulo-fecha-${idx}`}
                            type="date"
                            value={t.fechaEmision || ""}
                            onChange={(e) =>
                                handleArrayChange("titulos", idx, "fechaEmision", e.target.value)
                            }
                            rules={[required()]}
                            required
                        />

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
                            >
                                ✖
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