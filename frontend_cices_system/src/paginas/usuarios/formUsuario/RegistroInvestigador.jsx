import React, {useContext, useEffect, useState} from "react";

import {fetchTiposCatalogo} from "../../../services/CatalogoService.js";
import {InvestigadorContext} from "../../../context/investigadorCtx/InvestigadorContext.jsx";
import {CertificacionDTO, TituloDTO} from "../../../modelos/investigadorDTO.jsx";

import InputField from "../../../utils/validaciones/InputField.jsx";
import {fechaMenorIgualQue, maxLength, required} from "../../../utils/validaciones/Validators.jsx";
import EntidadSelect from "../../../components/EntidadSelect.jsx";
import {eliminarFormacion} from "../../../services/CertificacionesTitulosService.jsx";
import {confirm} from "../../../utils/ui/confirm.jsx";
import {notify} from "../../../utils/ui/notify.jsx";

import "./Registro.css";

function RegistroInvestigadorInner({ nivelAcademico, modoPerfil }) {

    const {
        investigador,
        actualizarCampo,
        agregarItem,
        actualizarItem,
        eliminarItem,
    } = useContext(InvestigadorContext);

    const [tiposCertificacion, setTiposCertificacion] = useState([]);
    const [loadingCatalogos, setLoadingCatalogos] = useState(true);

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


    const handleArrayChange = (collection, idx, field, value) => {

        if (field === "entidadEmisora") {
            actualizarItem(collection, idx, field, value);
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
    const handleRemove = async (collection, idx) => {

        const item = investigador[collection][idx];

        if (modoPerfil && item?.id) {
            const nombresSingular = {
                titulos: "título",
                certificaciones: "certificación"
            };
            const nombre = nombresSingular[collection] || collection;

            if (!(await confirm.delete(`¿Eliminar ${nombre}?`))) return;

            try {
                const res = await eliminarFormacion(collection, item.id);
                if(res.ok)
                    notify.success(`${nombre} eliminado/a exitosamente`)

            } catch (e) {
                console.error("Error eliminando:", e);
                return;
            }
        }

        eliminarItem(collection, idx);
    };

    // ----- Resto del formulario ----- //
    return (
        <div className="formacion-section">

            {/* Institución de origen */}
            <div className="input-group">
                <label className="input-label">Institución de origen</label>
                <EntidadSelect
                    required={true}
                    tipo="INSTITUCION"
                    value={investigador.institucionOrigen}
                    onChange={(val) => actualizarCampo("institucionOrigen", val)}
                    placeholder="Institución de origen"
                />
            </div>

            {/* Unidad académica */}
            <div className="input-group">
                <label className="input-label">Unidad académica</label>
                <EntidadSelect
                    required={true}
                    tipo="UNIDAD"
                    value={investigador.unidadAcademica}
                    onChange={(val) => actualizarCampo("unidadAcademica", val)}
                    placeholder="Unidad académica"
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

            <h2 className="formacion-title">FORMACIÓN</h2>


            {/* Títulos académicos */}
            <h3 className="formacion-subtitle"> Títulos Acádemicos (Formal)</h3>
            <p>No es obligatorio ingresar titulos en este momento.</p>
            {(investigador.titulos || []).length === 0 && (
                <button className="add-item-btn" type="button" onClick={() => handleAdd("titulos", TituloDTO)}>Agregar título</button>
            )}

            <div className="rows-group">
                {(investigador.titulos || []).map((t, idx) => (
                    <div className="formacion-row" key={idx}>
                        <InputField
                            name={`titulo-nombre-${idx}`}
                            placeholder="Nombre del título"
                            value={t.nombreTitulo || ""}
                            onChange={(e) => handleArrayChange("titulos", idx, "nombreTitulo", e.target.value)}
                            rules={[required(), maxLength(254)]}
                            required
                            maxLength={254}
                        />
                        <EntidadSelect
                            required={true}
                            tipo="INSTITUCION"
                            value={t.entidadEmisora}
                            onChange={(val) =>
                                handleArrayChange(
                                    "titulos",
                                    idx,
                                    "entidadEmisora",
                                    val
                                )
                            }
                            placeholder="Institución"
                        />
                        <div className="input-group">
                            <label className="input-label">Nivel Académico</label>
                            <select
                                className="select"
                                required={true}
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
                            rules={[required(), fechaMenorIgualQue(new Date())]}
                            max={new Date().toISOString().split("T")[0]}
                            required
                        />
                        <div className="formacion-actions">
                            <button type="button" className="icon-btn remove-btn" onClick={() => handleRemove("titulos", idx)} disabled={(investigador.titulos || []).length === 0}>✖</button>
                            <button type="button" className="icon-btn" onClick={() => handleAdd("titulos", TituloDTO)}>+</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Certificaciones */}
            <h3 className="formacion-subtitle"> Certificaciones (Informal)</h3>
            <p>No es obligatorio ingresar una certificación en este momento.</p>

            {(investigador.certificaciones || []).length === 0 && (
                <button className="add-item-btn" type="button" onClick={() => handleAdd("certificaciones", CertificacionDTO)}>Agregar certificación</button>
            )}
            <div className="rows-group">
                {(investigador.certificaciones || []).map((c, idx) => (
                    <div className="formacion-row" key={idx}>
                        <InputField
                            name={`cert-nombre-${idx}`}
                            placeholder="Nombre de la certificación"
                            value={c.nombreCertificacion || ""}
                            onChange={(e) => handleArrayChange("certificaciones", idx, "nombreCertificacion", e.target.value)}
                            rules={[required(), maxLength(254)]}
                            required maxLength={254}
                        />
                        <EntidadSelect
                            required={true}
                            tipo="INSTITUCION"
                            value={c.entidadEmisora}
                            onChange={(val) =>
                                handleArrayChange(
                                    "certificaciones",
                                    idx,
                                    "entidadEmisora",
                                    val
                                )
                            }
                            placeholder="Institución"
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

        </div>
    );
}

export default function RegistroInvestigador(props) {
    return <RegistroInvestigadorInner {...props} />;
}