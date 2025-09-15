// src/paginas/certificacion/Certificacion.jsx
import { useEffect, useMemo, useState } from "react";
import "./Certificacion.css";

function parseLocalDate(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function calcularEstado(expISO) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const exp = parseLocalDate(expISO);
    if (!exp) return null;

    if (exp <= hoy) return 11; // vencido

    const masUnMes = new Date(hoy);
    masUnMes.setMonth(masUnMes.getMonth() + 1);

    return exp >= masUnMes ? 9 : 10; // >1 mes (9) | <1 mes (10)
}

function getIdInvestigador() {
    try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        return (
            u?.investigador?.id ??
            u?.idInvestigador ??
            u?.id ??
            null
        );
    } catch {
        return null;
    }
}

export default function Certificacion() {
    const [form, setForm] = useState({
        nombre: "",
        tipo: "",          // id del código
        expiracion: ""     // YYYY-MM-DD
    });
    const [tipos, setTipos] = useState([]);
    const [loadingTipos, setLoadingTipos] = useState(true);
    const [error, setError] = useState("");

    const hoyISO = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d.toISOString().slice(0, 10);
    }, []);

    useEffect(() => {
        let cancel = false;
        (async () => {
            try {
                const res = await fetch("/api/catalogos/tipos_certificacion");
                if (!res.ok) throw new Error("No se pudo cargar tipos de certificación");
                const data = await res.json(); // [{id, despliegue, valor}]
                if (!cancel) {
                    setTipos(data);
                    // autoseleccionar si viene solo uno
                    if (data.length === 1) {
                        setForm((s) => ({ ...s, tipo: String(data[0].id) }));
                    }
                }
            } catch (e) {
                if (!cancel) setError(e.message);
            } finally {
                if (!cancel) setLoadingTipos(false);
            }
        })();
        return () => {
            cancel = true;
        };
    }, []);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const idInvestigador = getIdInvestigador();
        if (!idInvestigador) return setError("Sesión inválida. Falta id del investigador.");

        if (!form.nombre.trim()) return setError("El nombre es obligatorio.");
        if (!form.tipo) return setError("Seleccione el tipo de certificación.");
        if (!form.expiracion) return setError("Seleccione la fecha de expiración.");

        const estado = calcularEstado(form.expiracion);
        if (estado === 11) return setError("La fecha ya venció. Elija una fecha futura.");

        const payload = {
            nombreCertificacion: form.nombre.trim(),
            idCodigoTipoCertificacion: Number(form.tipo),
            fechaExpiracion: form.expiracion,
            idCodigoTipoEstado: estado,
            // Ajusta según contrato del backend:
            idInvestigador: { id: Number(idInvestigador) }
            // Si tu API espera solo el ID: usa -> idInvestigador: Number(idInvestigador)
        };

        // Enviar al backend (descomenta cuando tengas el endpoint)
        // const res = await fetch("/api/certificaciones", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(payload),
        //   credentials: "include"
        // });
        // if (!res.ok) return setError((await res.json().catch(() => ({}))).message || "Error al guardar");
        // Limpia o navega
        console.log("Payload a enviar:", payload);
        alert("Datos listos para enviar. Revisa la consola.");
    };

    return (
        <section className="certi-container">
            <h2>Ingresar Certificación</h2>

            <form className="certi-form" onSubmit={onSubmit}>
                <label className="field">
                    <span>Nombre de la certificación</span>
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre de la certificacion"
                        value={form.nombre}
                        onChange={onChange}
                        required
                    />
                </label>

                <label className="field">
                    <span>Tipo de certificación</span>
                    <select
                        name="tipo"
                        value={form.tipo}
                        onChange={onChange}
                        required
                        disabled={loadingTipos || tipos.length === 0}
                    >
                        <option value="">
                            {loadingTipos ? "Cargando..." : "Seleccione…"}
                        </option>
                        {tipos.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.despliegue}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="field">
                    <span>Fecha de expiración</span>
                    <input
                        type="date"
                        name="expiracion"
                        value={form.expiracion}
                        onChange={onChange}
                        min={hoyISO}
                        required
                    />
                    <small className="hint">No se permiten fechas anteriores a hoy.</small>
                </label>

                {error && <p className="form-error">{error}</p>}

                <button type="submit" className="btn-primary">Guardar</button>
            </form>
        </section>
    );
}
