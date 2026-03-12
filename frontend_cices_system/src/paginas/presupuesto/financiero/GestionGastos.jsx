import React, { useContext, useState } from "react";
import { notify } from "../../../utils/ui/notify.jsx";
import { confirm } from "../../../utils/ui/confirm.jsx";
import { AppContext } from "../../../context/AppContext.jsx";
import BuscadorProyecto from "../../../components/BusquedaProyecto.jsx";
import { DetalleGastos } from "../../../services/ReportesService.jsx";
import { GastosService } from "../../../services/GastosService.jsx";
import InputField from "../../../utils/validaciones/InputField.jsx";
import {required, maxLength, min, max, fechaMayorIgualQue} from "../../../utils/validaciones/Validators.jsx";

const formularioVacio = {
    id: null,
    monto: "",
    fechaGasto: "",
    descripcion: ""
};

const RegistroGastos = () => {

    const { token } = useContext(AppContext);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [presupuestos, setPresupuestos] = useState([]);
    const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);

    const [gastosRegistrados, setGastosRegistrados] = useState([]);
    const [gastosForm, setGastosForm] = useState([{ ...formularioVacio }]);
    const [gastoEditando, setGastoEditando] = useState(null);

    const seleccionarProyecto = async (proyecto) => {
        if (!proyecto) {
            setProyectoSeleccionado(null);
            return;
        }
        setProyectoSeleccionado(proyecto);

        setPresupuestoSeleccionado(null);
        setGastosRegistrados([]);
        setGastosForm([{ ...formularioVacio }]);

        try {

            const data = await DetalleGastos.obtenerPorProyecto(proyecto.codigoProyecto);
            setPresupuestos(data || []);

        } catch {

            notify.error("Error cargando presupuestos");

        }

    };

    const seleccionarPresupuesto = (idPresupuesto) => {

        const presupuesto = presupuestos.find(
            p => p.id === idPresupuesto
        );

        if (!presupuesto) return;

        setPresupuestoSeleccionado(presupuesto);
        setGastosRegistrados(presupuesto.gastos || []);
        setGastosForm([{ ...formularioVacio }]);

    };

    const actualizarCampo = (index, campo, valor) => {

        const copia = [...gastosForm];
        copia[index][campo] = valor;

        setGastosForm(copia);

    };

    const agregarFila = () => {
        setGastosForm(prev => [
            ...prev,
            { ...formularioVacio }
        ]);
    };

    const eliminarFila = (index) => {
        setGastosForm(prev => prev.filter((_, i) => i !== index));
    };

    const editarGastoRegistrado = (gasto) => {

        setGastoEditando(gasto);

        setGastosForm([{
            id: gasto.id,
            monto: gasto.monto,
            fechaGasto: gasto.fechaGasto,
            descripcion: gasto.descripcion
        }]);

    };

    function limpiar(actualizado){
        setGastosRegistrados(actualizado?.gastos || []);
        setGastoEditando(null);
        setGastosForm([{ ...formularioVacio }]);
    }

    const cancelarEdicion = () => {
        setGastoEditando(null);
        setGastosForm([{ ...formularioVacio }]);
    };

    const eliminarGastoRegistrado = async (gasto) => {

        if (!(await confirm.delete())) return;

        try {

            await GastosService.eliminarGasto(gasto.id);

            const data = await DetalleGastos.obtenerPorProyecto(proyectoSeleccionado.codigoProyecto);
            setPresupuestos(data || []);

            const actualizado = data.find(
                p => p.id === presupuestoSeleccionado.id
            );

            limpiar(actualizado)

            notify.success("Gasto eliminado");


        } catch {

            notify.error("Error eliminando gasto");

        }

    };


    const totalGastos = gastosRegistrados.reduce(
        (acc, g) => acc + (parseFloat(g.monto) || 0),
        0
    );

    const totalFormulario = gastosForm.reduce(
        (acc, g) => acc + (parseFloat(g.monto) || 0),
        0
    );

    const montoMax = !gastoEditando?(parseFloat(presupuestoSeleccionado?.monto) || 0) - totalGastos:
        (parseFloat(presupuestoSeleccionado?.monto) || 0) - totalGastos + parseFloat(gastoEditando.monto);
    const presupuestoRestante =  montoMax - totalFormulario;

    const guardarGastos = async () => {

        if (!proyectoSeleccionado || !presupuestoSeleccionado) {
            notify.warning("Seleccione proyecto y presupuesto");
            return;
        }

        const incompletos = gastosForm.some(
            g => !g.monto || !g.descripcion || !g.fechaGasto
        );

        if (incompletos) {
            notify.warning("Complete los campos");
            return;
        }

        if (presupuestoRestante < 0) {
            notify.error("El monto de los gastos excede el presupuesto restante");
            return;
        }

        try {

            if (gastoEditando) {
                const ok = await confirm.update();
                if (!ok) return;

                const gasto = gastosForm[0];

                await GastosService.actualizarGasto({
                    id: gastoEditando.id,
                    idPresupuesto: gastoEditando.idPresupuesto,
                    monto: parseFloat(gasto.monto),
                    descripcion: gasto.descripcion,
                    fechaGasto: gasto.fechaGasto
                });

                notify.success("Gasto actualizado");

            } else {

                const gastos = gastosForm.map(g => ({
                    idPresupuesto: presupuestoSeleccionado.id,
                    monto: parseFloat(g.monto),
                    descripcion: g.descripcion,
                    fechaGasto: g.fechaGasto
                }));

                await GastosService.registrarGastos(gastos);

                notify.success("Gastos registrados");
            }

            const data = await DetalleGastos.obtenerPorProyecto(proyectoSeleccionado.codigoProyecto);
            setPresupuestos(data || []);

            const actualizado = data.find(
                p => p.id === presupuestoSeleccionado.id
            );

            limpiar(actualizado)

        } catch {

            notify.error("Error guardando gasto");

        }

    };

    return (

        <div>

            <BuscadorProyecto
                token={token}
                onSelect={seleccionarProyecto}
            />

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

                    <h4>{presupuestoSeleccionado.categoria} - {presupuestoSeleccionado.descripcion}</h4>
                    <p>Fecha de asignación: {presupuestoSeleccionado.fechaAsignacion}</p>
                    <p>Monto asignado: {presupuestoSeleccionado.monto}</p>
                    <p>Total gastos registrados: {totalGastos}</p>
                    <p style={{ color: presupuestoRestante < 0 ? "red" : "green" }}>
                        <strong>Presupuesto restante:</strong>
                        {presupuestoRestante}
                    </p>
                    <h4>Agregar gastos</h4>
                    <div>

                        <p>
                            <strong>Nuevos gastos:</strong> {!gastoEditando?totalFormulario:totalFormulario-parseFloat(gastoEditando.monto)}
                        </p>

                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); guardarGastos(); }}>
                    {gastosForm.map((gasto, index) => (

                        <div key={index}>

                            <InputField
                                label="Monto"
                                type="number"
                                name={`monto-${index}`}
                                placeholder="Monto (₡)"
                                value={gasto.monto}
                                onChange={(e) =>
                                    actualizarCampo(index, "monto", e.target.value)
                                }
                                rules={[required(), min(1), max(montoMax)]}
                                required
                                min={1}
                                max={montoMax}
                            />

                            <InputField
                                label="Fecha del gasto"
                                type="date"
                                name={`fecha-${index}`}
                                placeholder="Fecha del gasto"
                                value={gasto.fechaGasto}
                                onChange={(e) =>
                                    actualizarCampo(index, "fechaGasto", e.target.value)
                                }
                                rules={[required(), fechaMayorIgualQue(presupuestoSeleccionado.fechaAsignacion)]}
                                required
                                min={presupuestoSeleccionado.fechaAsignacion}
                            />

                            <InputField
                                label="Descripción"
                                type="text"
                                name={`descripcion-${index}`}
                                placeholder="Descripción del gasto"
                                value={gasto.descripcion}
                                onChange={(e) =>
                                    actualizarCampo(index, "descripcion", e.target.value)
                                }
                                rules={[required(), maxLength(254)]}
                                required
                                maxLength={254}
                            />

                            {gastoEditando ? (
                                <button type="button" onClick={cancelarEdicion}>
                                    Cancelar
                                </button>

                            ) : (
                                <button type="button" onClick={() => eliminarFila(index)}>
                                    Eliminar
                                </button>
                            )}

                        </div>

                    ))}

                        <button type="button" onClick={agregarFila} hidden={gastoEditando}>+ Agregar gasto</button>

                        <button type="submit">{gastoEditando ? "Actualizar gasto" : "Guardar gasto"}</button>
                    </form>

                    <h4>Gastos registrados</h4>

                    <table border="1">

                        <thead>
                        <tr>
                            <th>Descripcion</th>
                            <th>Fecha</th>
                            <th>Monto</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>

                        <tbody>

                        {gastosRegistrados.map(g => (

                            <tr key={g.id}>
                                <td>{g.descripcion}</td>
                                <td>{g.fechaGasto}</td>
                                <td>{g.monto}</td>

                                <td>

                                    <button
                                        type="button"
                                        onClick={() => editarGastoRegistrado(g)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => eliminarGastoRegistrado(g)}
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

export default RegistroGastos;