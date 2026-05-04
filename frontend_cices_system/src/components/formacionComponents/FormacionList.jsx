// src/modules/formacion/components/FormacionList.jsx
import InputField from "../../utils/ui/InputField.jsx";
import { fechaMenorIgualQue, maxLength, required } from "../../validators/Validators.jsx";
import EntidadSelect from "../shared/EntidadSelect.jsx";
import { useEliminarCertificacion } from "../../hooks/formacionHooks/mutation/useEliminarCertificacion.js";
import { useEliminarTitulo } from "../../hooks/formacionHooks/mutation/useEliminarTitulo.js";
import { confirm } from "../../utils/ui/confirm.jsx";
import { notify } from "../../utils/ui/notify.jsx";

/**
 * config para TÍTULOS:
 * {
 *   tipo: "titulos",
 *   titulo: "Títulos académicos (formal)",
 *   nota: "No es obligatorio ingresar títulos.",
 *   labelNombre: "Nombre del título",
 *   campNombre: "nombreTitulo",
 *   mostrarTipo: false,
 *   mostrarNivel: true,
 *   opcionesNivel: [...],
 *   campNivel: "nivelTitulo",
 *   mostrarFechaExp: false,
 *   mostrarFechaEmision: true,
 * }
 *
 * config para CERTIFICACIONES:
 * {
 *   tipo: "certificaciones",
 *   titulo: "Certificaciones (informal)",
 *   nota: "No es obligatorio ingresar certificaciones.",
 *   labelNombre: "Nombre de la certificación",
 *   campNombre: "nombreCertificacion",
 *   mostrarTipo: true,
 *   opcionesTipo: [...],
 *   campTipo: "tipoCertificacion",
 *   mostrarNivel: false,
 *   mostrarFechaExp: true,
 *   mostrarFechaEmision: false,
 * }
 */
export function FormacionList({
                                  items = [],
                                  config,
                                  dtoVacio,
                                  modoPerfil = false,
                                  onAgregar,
                                  onActualizar,
                                  onEliminar
                              }) {

    const eliminarCertMutation = useEliminarCertificacion();
    const eliminarTituloMutation = useEliminarTitulo();

    const handleChange = (idx, campo, valor) => {
        // Para campos con catálogo (objeto), el padre ya resuelve el objeto
        onActualizar(config.tipo, idx, campo, valor);
    };

    const handleAgregar = () => onAgregar(config.tipo, dtoVacio);

    const handleEliminar = async (idx) => {
        const item = items[idx];
        const nombreSingular = config.tipo === "titulos" ? "título" : "certificación";

        if (modoPerfil && item?.id) {
            if (!(await confirm.delete(`¿Eliminar ${nombreSingular}?`))) return;

            const mutation = config.tipo === "titulos"
                ? eliminarTituloMutation
                : eliminarCertMutation;

            mutation.mutate(item.id, {
                onSuccess: () => {
                    notify.success(`${nombreSingular.charAt(0).toUpperCase() + nombreSingular.slice(1)} eliminada exitosamente`);
                    onEliminar(config.tipo, idx);
                },
                onError: () => notify.error(`Error al eliminar ${nombreSingular}`)
            });
            return;
        }

        onEliminar(config.tipo, idx);
    };

    return (
        <section className="formacion-card">
            <div className="formacion-card-header">
                <div>
                    <h3 className="formacion-subtitle">{config.titulo}</h3>
                    <p className="formacion-note">{config.nota}</p>
                </div>
                {items.length === 0 && (
                    <button
                        className="add-item-btn"
                        type="button"
                        onClick={handleAgregar}
                    >
                        Agregar {config.tipo === "titulos" ? "título" : "certificación"}
                    </button>
                )}
            </div>

            <div className="rows-group">
                {items.map((item, idx) => (
                    <div className="formacion-row" key={item.id ?? idx}>

                        {/* Nombre */}
                        <div className="formacion-field formacion-field--wide">
                            <InputField
                                label={config.labelNombre}
                                name={`${config.tipo}-nombre-${idx}`}
                                placeholder={config.labelNombre}
                                value={item[config.campNombre] || ""}
                                onChange={e => handleChange(idx, config.campNombre, e.target.value)}
                                rules={[required(), maxLength(254)]}
                                required
                                maxLength={254}
                            />
                        </div>

                        {/* Institución */}
                        <div className="formacion-field formacion-field--wide">
                            <label className="input-label">Institución</label>
                            <EntidadSelect
                                required
                                tipo="INSTITUCION"
                                value={item.entidadEmisora}
                                onChange={val => handleChange(idx, "entidadEmisora", val)}
                                placeholder="Institución"
                            />
                        </div>

                        {/* Nivel académico (solo títulos) */}
                        {config.mostrarNivel && (
                            <div className="formacion-field">
                                <label className="input-label">Nivel académico</label>
                                <select
                                    className="select"
                                    required
                                    value={item[config.campNivel]?.valor || ""}
                                    onChange={e => handleChange(idx, config.campNivel, e.target.value)}
                                >
                                    <option value="">Nivel académico</option>
                                    {(config.opcionesNivel || []).map(op => (
                                        <option key={op.id} value={op.valor}>{op.despliegue}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Tipo de certificación (solo certificaciones) */}
                        {config.mostrarTipo && (
                            <div className="formacion-field">
                                <label className="input-label">Tipo de certificación</label>
                                <select
                                    className="select"
                                    required
                                    value={item[config.campTipo]?.valor || ""}
                                    onChange={e => handleChange(idx, config.campTipo, e.target.value)}
                                    disabled={!config.opcionesTipo?.length}
                                >
                                    <option value="">
                                        {!config.opcionesTipo?.length ? "Cargando..." : "Tipo de certificación"}
                                    </option>
                                    {(config.opcionesTipo || []).map(t => (
                                        <option key={t.id} value={t.valor}>{t.despliegue}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Fecha emisión (solo títulos) */}
                        {config.mostrarFechaEmision && (
                            <div className="formacion-field formacion-field--date">
                                <InputField
                                    label="Fecha de emisión"
                                    name={`titulo-fecha-${idx}`}
                                    type="date"
                                    value={item.fechaEmision || ""}
                                    onChange={e => handleChange(idx, "fechaEmision", e.target.value)}
                                    rules={[required(), fechaMenorIgualQue(new Date())]}
                                    max={new Date().toISOString().split("T")[0]}
                                    required
                                />
                            </div>
                        )}

                        {/* Fecha expiración (solo certificaciones) */}
                        {config.mostrarFechaExp && (
                            <div className="formacion-field formacion-field--date">
                                <InputField
                                    label="Fecha de expiración"
                                    name={`cert-exp-${idx}`}
                                    type="date"
                                    value={item.fechaExpiracion || ""}
                                    onChange={e => handleChange(idx, "fechaExpiracion", e.target.value)}
                                />
                            </div>
                        )}

                        {/* Acciones por fila */}
                        <div className="formacion-actions">
                            <button
                                type="button"
                                className="icon-btn remove-btn"
                                onClick={() => handleEliminar(idx)}
                                aria-label={`Eliminar ${config.tipo === "titulos" ? "título" : "certificación"}`}
                            >
                                ✖
                            </button>
                            <button
                                type="button"
                                className="icon-btn"
                                onClick={handleAgregar}
                                aria-label={`Agregar ${config.tipo === "titulos" ? "título" : "certificación"}`}
                            >
                                +
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
}