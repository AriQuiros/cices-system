import { useEffect, useState } from "react";
import {notify} from "../../../utils/ui/notify.jsx";

const formularioVacio = {
    id: null,
    investigador: null,
    modalidad: null,
    tipoHora: null,
    cantidadHorasMes: "",
    cantidadMeses: ""
};

export const useHoraForm = ({ horaSeleccionada, presupuesto, onSubmit }) => {
    const [horasForm, setHorasForm] = useState([{ ...formularioVacio }]);

    useEffect(() => {
        if (horaSeleccionada) {
            setHorasForm([{
                id: horaSeleccionada.id,
                investigador: horaSeleccionada.investigador
                    ? {
                        id: horaSeleccionada.investigador.id,
                        nombreCompleto:
                            horaSeleccionada.investigador.nombreCompleto
                            ?? horaSeleccionada.investigador.nombreInvestigador
                    }
                    : null,
                modalidad: horaSeleccionada.modalidad,
                tipoHora: horaSeleccionada.tipoHora,
                cantidadHorasMes: horaSeleccionada.cantidadHorasMes,
                cantidadMeses: horaSeleccionada.cantidadMeses
            }]);
        } else {
            setHorasForm([{ ...formularioVacio }]);
        }
    }, [horaSeleccionada]);

    const actualizarCampo = (index, campo, valor) => {
        setHorasForm(prev => {
            const copia = [...prev];
            copia[index][campo] = valor;
            return copia;
        });
    };

    const agregarFila = () => {
        setHorasForm(prev => [...prev, { ...formularioVacio }]);
    };

    const eliminarFila = (index) => {
        setHorasForm(prev => prev.filter((_, i) => i !== index));
    };

    const limpiar = () => {
        setHorasForm([{ ...formularioVacio }]);
    };

    const totalFormulario = horasForm.reduce(
        (acc, h) => acc + (parseFloat(h.cantidadHorasMes || 0) * parseInt(h.cantidadMeses || 0)),
        0
    );

    const disponibleBackend = presupuesto?.resumen?.disponible ?? 0;

    const horasEditando = horaSeleccionada
        ? (horaSeleccionada.cantidadHorasMes || 0) * (horaSeleccionada.cantidadMeses || 0)
        : 0;

    const maxHoras = disponibleBackend + horasEditando;

    const disponibleDinamico = maxHoras - totalFormulario;

    const handleSubmit = async () => {

        // 1. Campos incompletos
        const incompletos = horasForm.some(
            h => !h.investigador || !h.modalidad || !h.cantidadHorasMes || !h.cantidadMeses
        );
        if (incompletos) {
            notify.warning("Complete todos los campos");
            return;
        }

        // 2. Validación por modalidad (regla de negocio del original)
        for (const h of horasForm) {
            const limiteModalidad = h.modalidad?.valor === "REGIMEN POR TIEMPO" ? 40 : 20;
            if (parseFloat(h.cantidadHorasMes) > limiteModalidad) {
                notify.warning(`La modalidad "${h.modalidad?.despliegue}" permite máximo ${limiteModalidad} horas por mes`);
                return;
            }
            const mesesMax = calcularMesesParticipacion(h.investigador);

            if (parseInt(h.cantidadMeses) > mesesMax) {
                notify.warning(
                    `El investigador solo puede participar ${mesesMax} meses`
                );
                return;
            }
        }

        // 3. Presupuesto disponible
        if (disponibleDinamico < 0) {
            notify.error("El total de horas asignadas excede el presupuesto disponible");
            return;
        }

        // 4. Confirmación
        /*if (isEditing) {
            if (!(await confirm.update())) return;
        }*/

        const payload = horasForm.map(h => ({
            id: h.id ?? null,
            idPresupuesto: presupuesto.id,

            investigador: h.investigador
                ? {
                    id: h.investigador.id
                }
                : null,

            modalidad: h.modalidad,
            tipoHora: h.tipoHora,

            cantidadHorasMes: parseFloat(h.cantidadHorasMes),
            cantidadMeses: parseInt(h.cantidadMeses)
        }));

        onSubmit(payload);
        limpiar();
    };

    const calcularMesesParticipacion = (investigador) => {
        if (!investigador?.fechaInicio || !investigador?.fechaFin) return 1;

        const inicio = new Date(investigador.fechaInicio);
        const fin = new Date(investigador.fechaFin);

        let meses = (fin.getFullYear() - inicio.getFullYear()) * 12;
        meses += fin.getMonth() - inicio.getMonth() + 1;

        return Math.max(meses, 1);
    };

    return {
        horasForm,
        actualizarCampo,
        agregarFila,
        eliminarFila,
        handleSubmit,

        totalFormulario,
        disponibleBackend,
        disponibleDinamico,
        maxHoras,
        calcularMesesParticipacion,

        isEditing: !!horaSeleccionada
    };
};
