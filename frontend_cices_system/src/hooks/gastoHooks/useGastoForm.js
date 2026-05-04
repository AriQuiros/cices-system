import { useEffect, useState } from "react";
import {notify} from "../../utils/ui/notify.jsx";

const MAX_GASTOS = 5;

const formularioVacio = {
    id: null,
    monto: "",
    fechaGasto: "",
    descripcion: "",
};

export const useGastoForm = ({
                                 gastoSeleccionado,
                                 presupuesto,
                                 onSubmit
                             }) => {

    const [gastosForm, setGastosForm] = useState([{ ...formularioVacio }]);

    // cargar para edición
    useEffect(() => {
        if (gastoSeleccionado) {
            setGastosForm([{
                id: gastoSeleccionado.id,
                monto: gastoSeleccionado.monto,
                fechaGasto: gastoSeleccionado.fechaGasto,
                descripcion: gastoSeleccionado.descripcion
            }]);
        } else {
            setGastosForm([{ ...formularioVacio }]);
        }
    }, [gastoSeleccionado]);

    // =========================
    // HANDLERS
    // =========================

    const actualizarCampo = (index, campo, valor) => {
        setGastosForm(prev => {
            const copia = [...prev];
            copia[index][campo] = valor;
            return copia;
        });
    };

    const agregarFila = () => {
        if (gastosForm.length >= MAX_GASTOS) {
            notify.warning(`No se pueden agregar más de ${MAX_GASTOS} gastos a la vez`)
            return;
        }
        setGastosForm(prev => [...prev, { ...formularioVacio }]);
    };

    const eliminarFila = (index) => {
        setGastosForm(prev => prev.filter((_, i) => i !== index));
    };

    const limpiar = () => {
        setGastosForm([{ ...formularioVacio }]);
    };

    // =========================
    // CALCULOS
    // =========================

    const totalFormulario = gastosForm.reduce(
        (acc, g) => acc + (parseFloat(g.monto) || 0),
        0
    );

    const disponibleBackend = presupuesto?.resumen?.disponible ?? 0;

    const montoMax = gastoSeleccionado
        ? disponibleBackend + (gastoSeleccionado.monto || 0)
        : disponibleBackend;

    const disponibleDinamico = montoMax - totalFormulario;

    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = () => {

        const incompletos = gastosForm.some(
            g => !g.monto || !g.descripcion || !g.fechaGasto
        );

        if (incompletos) {
            throw new Error("Campos incompletos");
        }

        if (disponibleDinamico < 0) {
            throw new Error("Monto excede presupuesto");
        }

        const payload = gastosForm.map(g => ({
            id: g.id,
            idPresupuesto: presupuesto.id,
            monto: parseFloat(g.monto),
            descripcion: g.descripcion,
            fechaGasto: g.fechaGasto
        }));

        onSubmit(payload);
        limpiar();
    };

    return {
        gastosForm,
        actualizarCampo,
        agregarFila,
        eliminarFila,
        handleSubmit,

        totalFormulario,
        disponibleBackend,
        disponibleDinamico,
        montoMax,

        isEditing: !!gastoSeleccionado
    };
};