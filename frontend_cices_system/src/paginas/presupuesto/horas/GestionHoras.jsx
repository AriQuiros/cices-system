import React, { useContext, useState } from "react";
import { notify } from "../../../utils/ui/notify.jsx";
import { confirm } from "../../../utils/ui/confirm.jsx";
import { AppContext } from "../../../context/AppContext.jsx";
import Select from "react-select";
import { DistribucionHoras, obtenerInvestigadoresProyecto } from "../../../services/ReportesService.jsx";
import { HorasService } from "../../../services/HorasService.jsx";
import { fetchTiposCatalogo } from "../../../services/CatalogoService.js";
import InputField from "../../../utils/validaciones/InputField.jsx";
import {required, min, max} from "../../../utils/validaciones/Validators.jsx";
import BuscadorProyecto from "../../../components/BusquedaProyecto.jsx";
import "./GestionHoras.css";

const formularioVacio = {
    id: null,
    investigador: null,
    modalidad: null,
    tipoHora: null,
    cantidadHorasMes: "",
    cantidadMeses: ""
};

const GestionHoras = () => {

    const { token } = useContext(AppContext);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    const [presupuestos, setPresupuestos] = useState([]);
    const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);

    const [investigadoresProyecto, setInvestigadoresProyecto] = useState([]);

    const [tipos, setTipos] = useState({});

    const [horasRegistradas, setHorasRegistradas] = useState([]);

    const [horasForm, setHorasForm] = useState([{ ...formularioVacio }]);

    const [horaEditando, setHoraEditando] = useState(null);

    const seleccionarProyecto = async (proyecto) => {
        if (!proyecto) {
            setProyectoSeleccionado(null);
            return;
        }
        setProyectoSeleccionado(proyecto);

        setPresupuestoSeleccionado(null);
        setHorasRegistradas([]);
        setHorasForm([{ ...formularioVacio }]);

        try {
            fetchTiposCatalogo("", ["MODALIDAD_HORARIA", "TIPO_HORAS"])
                .then(res => setTipos(res || {}));
            const data = await DistribucionHoras.obtenerPorProyecto(proyecto.codigoProyecto);
            setPresupuestos(data || []);

            const inv = await obtenerInvestigadoresProyecto(proyecto.codigoProyecto, token);
            setInvestigadoresProyecto(inv || []);

        } catch {

            notify.error("Error cargando datos");

        }

    };

    const seleccionarPresupuesto = (idPresupuesto) => {

        const presupuesto = presupuestos.find(p => p.id === idPresupuesto);

        if (!presupuesto) return;

        setPresupuestoSeleccionado(presupuesto);

        setHorasRegistradas(presupuesto.horas || []);

        setHorasForm([{ ...formularioVacio }]);

    };

    const actualizarCampo = (index, campo, valor) => {

        const copia = [...horasForm];
        copia[index][campo] = valor;

        setHorasForm(copia);

    };

    const agregarFila = () => {

        setHorasForm(prev => [
            ...prev,
            { ...formularioVacio }
        ]);

    };

    const eliminarFila = (index) => {

        setHorasForm(prev => prev.filter((_, i) => i !== index));

    };

    const editarHoraRegistrada = (hora) => {
        const investigador = investigadoresProyecto.find(
            i => i.id === hora.investigador?.id
        );
        setHoraEditando(hora);

        setHorasForm([{
            id: hora.id,
            investigador: investigador ,
            modalidad: hora.modalidad,
            tipoHora: hora.tipoHora,
            cantidadHorasMes: hora.cantidadHorasMes,
            cantidadMeses: hora.cantidadMeses
        }]);

    };

    function limpiar(actualizado){
        setHorasRegistradas(actualizado?.horas || []);
        setHoraEditando(null);
        setHorasForm([{ ...formularioVacio }]);
    }

    const cancelarEdicion = () => {
        setHoraEditando(null);
        setHorasForm([{ ...formularioVacio }]);
    };

    const eliminarHoraRegistrada = async (hora) => {

        if (!(await confirm.delete("¿Eliminar estas horas?"))) return;

        try {

            await HorasService.eliminarHora(hora.id);

            const data = await DistribucionHoras.obtenerPorProyecto(proyectoSeleccionado.codigoProyecto);

            setPresupuestos(data || []);

            const actualizado = data.find(
                p => p.id === presupuestoSeleccionado.id
            );

            limpiar(actualizado)

            notify.success("Horas eliminadas");

        } catch {
            notify.error("Error eliminando horas");
        }

    };

    const totalFormulario = horasForm.reduce(
        (acc, h) => acc + (parseFloat(h.cantidadHorasMes || 0) * parseInt(h.cantidadMeses || 0)),
        0
    );

    const totalHorasAsignadas = horasRegistradas.reduce(
        (acc, h) => acc + ((h.cantidadHorasMes || 0) * (h.cantidadMeses || 0)),
        0
    );

    const totalHorasPresupuesto = (presupuestoSeleccionado?.cantidadHoras || 0) *
        (presupuestoSeleccionado?.cantidadMeses || 0);

    const horasEditando = horaEditando
        ? (horaEditando.cantidadHorasMes || 0) * (horaEditando.cantidadMeses || 0)
        : 0;

    const maxHoras = totalHorasPresupuesto - totalHorasAsignadas + horasEditando;

    const horasRestantes = maxHoras - totalFormulario;

    const guardarHoras = async () => {

        if (!proyectoSeleccionado || !presupuestoSeleccionado) {

            notify.warning("Seleccione proyecto y presupuesto");
            return;

        }

        const incompletos = horasForm.some(
            h => !h.investigador || !h.modalidad|| !h.cantidadHorasMes || !h.cantidadMeses
        );
        for (const h of horasForm) {
            const maxHoras = h.modalidad?.valor === "REGIMEN POR TIEMPO" ? 40 : 20;

            if (parseFloat(h.cantidadHorasMes) > maxHoras) {
                notify.warning(`La modalidad permite máximo ${maxHoras} horas por mes`);
                return;
            }
        }

        if (incompletos) {
            notify.warning("Complete todos los campos");
            return;
        }


        if (maxHoras > totalHorasPresupuesto) {
            notify.error("El total de horas asignadas excede el presupuesto disponible");
            return;
        }

        try {

            if (horaEditando) {
                if (!(await confirm.update())) return;

                const h = horasForm[0];

                await HorasService.actualizarHora({

                    id: horaEditando.id,
                    investigador: h.investigador,
                    idPresupuesto: presupuestoSeleccionado.id,
                    modalidad: h.modalidad,
                    tipoHora: h.tipoHora,
                    cantidadHorasMes: parseFloat(h.cantidadHorasMes),
                    cantidadMeses: parseInt(h.cantidadMeses)

                });

                notify.success("Horas actualizadas");

            } else {

                const horas = horasForm.map(h => ({

                    investigador: h.investigador,
                    idPresupuesto: presupuestoSeleccionado.id,
                    modalidad: h.modalidad,
                    tipoHora: h.tipoHora,
                    cantidadHorasMes: parseFloat(h.cantidadHorasMes),
                    cantidadMeses: parseInt(h.cantidadMeses)

                }));

                await HorasService.registrarHoras(horas);

                notify.success("Horas registradas");

            }

            const data = await DistribucionHoras.obtenerPorProyecto(
                proyectoSeleccionado.codigoProyecto
            );

            setPresupuestos(data || []);

            const actualizado = data.find(
                p => p.id === presupuestoSeleccionado.id
            );
            limpiar(actualizado)

        } catch {

            notify.error("Error guardando horas");

        }

    };


    const calcularMesesParticipacion = (investigador) => {
        if (!investigador?.fechaInicio || !investigador?.fechaFin) return 0;

        const inicio = new Date(investigador.fechaInicio);
        const fin = new Date(investigador.fechaFin);

        let meses = (fin.getFullYear() - inicio.getFullYear()) * 12;
        meses += fin.getMonth() - inicio.getMonth() + 1; // +1 contar inclusive el mes final

        return meses > 0 ? meses : 0;
    };

    return (

        <div className="gestion-horas-page">
            <div className="gestion-horas-card">

            <BuscadorProyecto
                token={token}
                onSelect={seleccionarProyecto}
            />

            {presupuestos.length > 0 && (

                <select className="gestion-horas-select" onChange={(e) => seleccionarPresupuesto(parseInt(e.target.value))}>
                    <option value="">Seleccione presupuesto</option>

                    {presupuestos.map(p => (

                        <option key={p.id} value={p.id}>
                            {p.categoria} - {p.descripcion}
                        </option>

                    ))}

                </select>

            )}

            {presupuestoSeleccionado && (

                <>
                <hr className="gestion-horas-divider" />
                <div className="gestion-horas-content">
                    <p>
                        Horas asignadas al presupuesto: {presupuestoSeleccionado.cantidadHoras} h/mes
                    </p>

                    <p>
                        Meses del presupuesto: {presupuestoSeleccionado.cantidadMeses}
                    </p>

                    <p>
                        <strong>Total de horas asignadas:</strong> {totalHorasPresupuesto}
                    </p>

                    <p>
                        <strong>Total horas utilizadas:</strong> {totalHorasAsignadas}
                    </p>

                    <p style={{ color: horasRestantes < 0 ? "red" : "green" }}>
                        <strong>Horas restantes:</strong> {horasRestantes}
                    </p>

                    <p>
                        <strong>Nuevas horas:</strong> {totalFormulario}
                    </p>
                    <form onSubmit={(e) => { e.preventDefault(); guardarHoras(); }}>
                    {horasForm.map((h, index) => (

                        <div key={index} className="fila-horas">

                            <div className="campo-formulario">
                                <label className="label-campo">Investigador</label>
                                <Select
                                    required
                                    placeholder="Seleccione investigador"
                                    value={h.investigador
                                        ? { label: h.investigador.nombreInvestigador, value: h.investigador.id }
                                        : null}
                                    options={investigadoresProyecto
                                        .filter(i =>
                                            horaEditando?.investigador?.id === i.id ||
                                            (!horasRegistradas.some(hr => hr.investigador?.id === i.id) &&
                                                !horasForm.some((f, idx) => idx !== index && f.investigador?.id === i.id))
                                        )
                                        .map(i => ({ label: i.nombreInvestigador, value: i.id }))}
                                    onChange={(option) =>
                                        actualizarCampo(
                                            index,
                                            "investigador",
                                            investigadoresProyecto.find(i => i.id === option.value)
                                        )
                                    }
                                    className="select-campo"
                                    classNamePrefix="select"
                                />
                            </div>

                            <div className="campo-formulario">
                                <label className="label-campo">Modalidad</label>
                                <Select
                                    required
                                    placeholder="Modalidad"
                                    value={h.modalidad
                                        ? { label: h.modalidad.despliegue, value: h.modalidad.valor }
                                        : null}
                                    options={tipos["MODALIDAD_HORARIA"]?.map(t => ({
                                        label: t.despliegue,
                                        value: t.valor
                                    }))}
                                    onChange={(option) =>
                                        actualizarCampo(
                                            index,
                                            "modalidad",
                                            tipos["MODALIDAD_HORARIA"]?.find(t => t.valor === option.value)
                                        )
                                    }
                                    className="select-campo"
                                    classNamePrefix="select"
                                />
                            </div>

                            <div className="campo-formulario">
                                <InputField
                                    label="Horas por mes"
                                    type="number"
                                    name={`horasMes-${index}`}
                                    placeholder="Horas mes"
                                    value={h.cantidadHorasMes}
                                    onChange={(e) =>
                                        actualizarCampo(index, "cantidadHorasMes", e.target.value)
                                    }
                                    rules={[
                                        required(),
                                        min(1),
                                        max(h.modalidad?.valor === "REGIMEN POR TIEMPO" ? 40 : 20)
                                    ]}
                                    required
                                    min={1}
                                    max={h.modalidad?.valor === "REGIMEN POR TIEMPO" ? 40 : 20}
                                />
                            </div>

                            <div className="campo-formulario">
                                <InputField
                                    label="Cantidad de meses"
                                    type="number"
                                    name={`meses-${index}`}
                                    placeholder="Meses"
                                    value={h.cantidadMeses}
                                    onChange={(e) =>
                                        actualizarCampo(index, "cantidadMeses", e.target.value)
                                    }
                                    rules={[
                                        required(),
                                        min(1),
                                        max(calcularMesesParticipacion(h.investigador))
                                    ]}
                                    required
                                    min={1}
                                    max={calcularMesesParticipacion(h.investigador)}
                                />
                            </div>

                            <div className="acciones-formulario">
                                {horaEditando ? (
                                    <button
                                        type="button"
                                        className="btn-danger"
                                        onClick={cancelarEdicion}
                                    >
                                        Cancelar
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn-danger"
                                        onClick={() => eliminarFila(index)}
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>

                        </div>

                    ))}

                        <button
                            type="button"
                            className="btn-outline-primary"
                            onClick={agregarFila}
                            hidden={horaEditando}
                        >
                            + Agregar horas
                        </button>

                        <button type="submit">
                            {horaEditando ? "Actualizar horas" : "Guardar horas"}
                        </button>
                    </form>

                    <h4>Horas registradas</h4>

                    <div className="tabla-container">
                        <table className="tabla-horas">
                            <thead>
                            <tr>
                                <th>Investigador</th>
                                <th>Fechas Investigador</th>
                                <th>Modalidad</th>
                                <th>Tipo Hora</th>
                                <th>Horas/Mes</th>
                                <th>Meses</th>
                                <th>Total</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>

                            <tbody>
                            {horasRegistradas.map((h) => (
                                <tr key={h.id}>
                                    <td>{h.investigador?.nombreInvestigador}</td>
                                    <td>
                                        {h.investigador?.fechaInicio} - {h.investigador?.fechaFin}
                                    </td>
                                    <td>{h.modalidad?.despliegue}</td>
                                    <td>{h.tipoHora?.despliegue || "-"}</td>
                                    <td>{h.cantidadHorasMes}</td>
                                    <td>{h.cantidadMeses}</td>
                                    <td>{(h.cantidadHorasMes || 0) * (h.cantidadMeses || 0)}</td>
                                    <td className="acciones-tabla">
                                        <button
                                            type="button"
                                            className="btn-editar"
                                            onClick={() => editarHoraRegistrada(h)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            className="btn-eliminar"
                                            onClick={() => eliminarHoraRegistrada(h)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                </>

            )}

            </div>
        </div>

    );

};

export default GestionHoras;