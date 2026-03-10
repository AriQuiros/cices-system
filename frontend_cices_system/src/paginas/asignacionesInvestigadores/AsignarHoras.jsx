import React, { useContext, useEffect, useMemo, useState } from "react";
import { notify } from "../../utils/estilo/notify.jsx";
import { AppContext } from "../../context/AppContext.jsx";

import { cargarProyectos } from "../../services/ProyectoService.jsx";
import { DistribucionHoras, obtenerInvestigadoresProyecto } from "../../services/ReportesService.jsx";
import { HorasService } from "../../services/HorasService.jsx";
import { fetchTiposCatalogo } from "../../services/CatalogoService.js";
import InputField from "../../utils/validaciones/InputField.jsx";
import {required, min, max} from "../../utils/validaciones/Validators.jsx";

const formularioVacio = {
    id: null,
    investigador: null,
    modalidad: null,
    tipoHora: null,
    cantidadHorasMes: "",
    cantidadMeses: ""
};

const AsignarHoras = () => {

    const { token } = useContext(AppContext);

    const [proyectos, setProyectos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showList, setShowList] = useState(false);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    const [presupuestos, setPresupuestos] = useState([]);
    const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);

    const [investigadoresProyecto, setInvestigadoresProyecto] = useState([]);

    const [tipos, setTipos] = useState({});

    const [horasRegistradas, setHorasRegistradas] = useState([]);

    const [horasForm, setHorasForm] = useState([{ ...formularioVacio }]);

    const [horaEditando, setHoraEditando] = useState(null);

    useEffect(() => {

        cargarProyectos(token, true).then(setProyectos);

        fetchTiposCatalogo("", ["MODALIDAD_HORARIA", "TIPO_HORAS"])
            .then(res => setTipos(res || {}));

    }, [token]);

    const proyectosFiltrados = useMemo(() =>
        proyectos.filter(p =>
            p.codigoProyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.nombreProyecto.toLowerCase().includes(searchTerm.toLowerCase())
        ), [proyectos, searchTerm]);

    const seleccionarProyecto = async (proyecto) => {

        setProyectoSeleccionado(proyecto);
        setSearchTerm(proyecto.codigoProyecto);
        setShowList(false);

        setPresupuestoSeleccionado(null);
        setHorasRegistradas([]);
        setHorasForm([{ ...formularioVacio }]);

        try {

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

    const cancelarEdicion = () => {

        setHoraEditando(null);
        setHorasForm([{ ...formularioVacio }]);

    };

    const eliminarHoraRegistrada = async (hora) => {

        if (!window.confirm("¿Eliminar estas horas?")) return;

        try {

            await HorasService.eliminarHora(hora.id);

            const data = await DistribucionHoras.obtenerPorProyecto(proyectoSeleccionado.codigoProyecto);

            setPresupuestos(data || []);

            const actualizado = data.find(
                p => p.id === presupuestoSeleccionado.id
            );

            setHorasRegistradas(actualizado?.horas || []);

            notify.success("Horas eliminadas");

        } catch {
            notify.error("Error eliminando horas");
        }

    };

    const guardarHoras = async () => {

        if (!proyectoSeleccionado || !presupuestoSeleccionado) {

            notify.warning("Seleccione proyecto y presupuesto");
            return;

        }

        const incompletos = horasForm.some(
            h => !h.investigador || !h.modalidad/* || !h.tipoHora */|| !h.cantidadHorasMes || !h.cantidadMeses
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

        try {

            if (horaEditando) {

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

            setHorasRegistradas(actualizado?.horas || []);

            setHorasForm([{ ...formularioVacio }]);
            setHoraEditando(null);

        } catch {

            notify.error("Error guardando horas");

        }

    };

    const totalHorasAsignadas = horasRegistradas.reduce(
        (acc, h) => acc + ((h.cantidadHorasMes || 0) * (h.cantidadMeses || 0)),
        0
    );

    const totalHorasPresupuesto =
        (presupuestoSeleccionado?.cantidadHoras || 0) *
        (presupuestoSeleccionado?.cantidadMeses || 0);

    const horasRestantes = totalHorasPresupuesto - totalHorasAsignadas;
    return (

        <div>

            <h3>Buscar proyecto</h3>

            <input
                type="text"
                placeholder="Buscar codigo o nombre..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowList(true);
                }}
            />

            {showList && searchTerm && proyectosFiltrados.map(p => (

                <div key={p.codigoProyecto}>
                    <button onClick={() => seleccionarProyecto(p)}>
                        {p.codigoProyecto} - {p.nombreProyecto}
                    </button>
                </div>

            ))}

            {presupuestos.length > 0 && (

                <select onChange={(e) => seleccionarPresupuesto(parseInt(e.target.value))}>
                    <option value="">Seleccione presupuesto</option>

                    {presupuestos.map(p => (

                        <option key={p.id} value={p.id}>
                            {p.categoria} - {p.descripcion}
                        </option>

                    ))}

                </select>

            )}

            {presupuestoSeleccionado && (

                <div>

                    <h4>
                        {presupuestoSeleccionado.categoria} - {presupuestoSeleccionado.descripcion}
                    </h4>

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

                    {horasForm.map((h, index) => (

                        <div key={index}>

                            <select required
                                value={h.investigador?.id || ""}
                                onChange={(e) =>
                                    actualizarCampo(
                                        index,
                                        "investigador",
                                        investigadoresProyecto.find(i => i.id === parseInt(e.target.value))
                                    )
                                }
                            >

                                <option value="">Investigador</option>

                                {investigadoresProyecto.map(i => (
                                    <option key={i.id} value={i.id}>
                                        {i.nombreInvestigador}
                                    </option>
                                ))}

                            </select>

                            <select required
                                value={h.modalidad?.valor || ""}
                                onChange={(e) =>
                                    actualizarCampo(
                                        index,
                                        "modalidad",
                                        tipos["MODALIDAD_HORARIA"]?.find(t => t.valor === e.target.value)
                                    )
                                }
                            >
                                <option value="">Modalidad</option>

                                {tipos["MODALIDAD_HORARIA"]?.map(t => (
                                    <option key={t.id} value={t.valor}>
                                        {t.despliegue}
                                    </option>
                                ))}

                            </select>


                            <InputField
                                label="Horas por mes"
                                type="number"
                                name={`horasMes-${index}`}
                                placeholder="Horas mes"
                                value={h.cantidadHorasMes}
                                onChange={(e) =>
                                    actualizarCampo(index, "cantidadHorasMes", e.target.value)
                                }
                                rules={[required(), min(1),
                                    max(h.modalidad?.valor === "REGIMEN POR TIEMPO" ? 40 : 20)]}
                                required
                                min={1}
                                max={h.modalidad?.valor === "REGIMEN POR TIEMPO" ? 40 : 20}
                            />

                            <InputField
                                label="Cantidad de meses"
                                type="number"
                                name={`meses-${index}`}
                                placeholder="Meses"
                                value={h.cantidadMeses}
                                onChange={(e) =>
                                    actualizarCampo(index, "cantidadMeses", e.target.value)
                                }
                                rules={[required(), min(1), max(120)]}
                                required
                                min={1}
                                max={120}
                            />

                            {horaEditando ? (

                                <button onClick={cancelarEdicion}>
                                    Cancelar
                                </button>

                            ) : (

                                <button onClick={() => eliminarFila(index)}>
                                    Eliminar
                                </button>

                            )}

                        </div>

                    ))}

                    <button onClick={agregarFila} hidden={horaEditando}>
                        + Agregar horas
                    </button>

                    <button onClick={guardarHoras}>
                        {horaEditando ? "Actualizar horas" : "Guardar horas"}
                    </button>

                    <h4>Horas registradas</h4>

                    <table border="1">

                        <thead>
                        <tr>
                            <th>Investigador</th>
                            <th>Modalidad</th>
                            <th>Tipo Hora</th>
                            <th>Horas/Mes</th>
                            <th>Meses</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>

                        <tbody>

                        {horasRegistradas.map(h => (

                            <tr key={h.id}>

                                <td>{h.investigador?.nombreInvestigador}</td>

                                <td>{h.modalidad?.despliegue}</td>

                                <td>{h.tipoHora?.despliegue || "-"}</td>

                                <td>{h.cantidadHorasMes}</td>

                                <td>{h.cantidadMeses}</td>

                                <td>{(h.cantidadHorasMes || 0) * (h.cantidadMeses || 0)}</td>

                                <td>

                                    <button
                                        onClick={() => editarHoraRegistrada(h)}
                                    >
                                        Editar
                                    </button>

                                    <button
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

            )}

        </div>

    );

};

export default AsignarHoras;