import { useState } from "react";
import { ProyectoContext } from "./ProyectoContext.jsx";
import {ProyectoDTO} from "../../modelos/proyectoDTO.jsx";
import {PresupuestoDTO} from "../../modelos/presupuestoDTO.jsx";

export const ProyectoProvider = ({ children }) => {
    const [proyecto, setProyecto] = useState({ ...ProyectoDTO });

    // ===================== CAMPOS SIMPLES =====================
    const actualizarCampo = (campo, valor) => {
        setProyecto(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    // ===================== PRESUPUESTO ACTUAL (single) =====================
    const [presupuesto, setPresupuesto] = useState({ ...PresupuestoDTO });

    const limpiarPresupuestoActual = () => {
        setPresupuesto({ ...PresupuestoDTO });
    };

    const limpiarProyecto = () => {
        setProyecto({ ...ProyectoDTO });
    };

    // Establecer proyecto completo (usado por registros que seleccionan un proyecto)
    const establecerProyecto = (p) => {
        setProyecto({ ...ProyectoDTO, ...p });
    };

    // Reemplaza la lista de presupuestos del proyecto
    const setPresupuestos = (pres) => {
        setProyecto(prev => ({ ...prev, presupuestos: pres.map(pp => ({ ...PresupuestoDTO, ...pp })) }));
    };

    // ===================== funciones genericas para agregar, actualiza o eliminar =====================

    // Generic nested helpers (path: ['entidadesVinculadas','instituciones', idx, 'nombre'])
    const setByPath = (path, value) => {
        if (!Array.isArray(path) || path.length === 0) return;

        setProyecto(prev => {
            const topKey = path[0];
            const topValue = prev[topKey];

            let newTop = Array.isArray(topValue)
                ? [...topValue]
                : (topValue && typeof topValue === 'object'
                    ? { ...topValue }
                    : topValue);

            let target = newTop;

            for (let i = 1; i < path.length - 1; i++) {
                const key = path[i];

                if (target[key] == null) {
                    const nextKey = path[i + 1];
                    target[key] = typeof nextKey === 'number' ? [] : {};
                }

                if (Array.isArray(target[key])) {
                    target[key] = [...target[key]];
                } else if (typeof target[key] === 'object') {
                    target[key] = { ...target[key] };
                }

                target = target[key];
            }

            const lastKey = path[path.length - 1];
            target[lastKey] = value;

            return {
                ...prev,
                [topKey]: newTop
            };
        });
    };

    const addByPath = (path, valueToAdd) => {
        if (!Array.isArray(path) || path.length === 0) return;
        const topKey = path[0];
        const topValue = proyecto[topKey];
        let newTop = Array.isArray(topValue) ? [...topValue] : (topValue && typeof topValue === 'object' ? { ...topValue } : []);

        let target = newTop;
        for (let i = 1; i < path.length; i++) {
            const key = path[i];
            if (i === path.length - 1) {
                if (!Array.isArray(target[key])) target[key] = [];
                target[key] = [...target[key], valueToAdd];
            } else {
                if (target[key] == null) target[key] = {};
                if (Array.isArray(target[key])) target[key] = [...target[key]];
                else if (target[key] && typeof target[key] === 'object') target[key] = { ...target[key] };
                target = target[key];
            }
        }
        if (path.length === 1) {
            if (!Array.isArray(newTop)) newTop = [];
            newTop = [...newTop, valueToAdd];
        }
        actualizarCampo(topKey, newTop);
    };

    const removeByPath = (path, index) => {
        if (!Array.isArray(path) || path.length === 0) return;
        const topKey = path[0];
        const topValue = proyecto[topKey];
        let newTop = Array.isArray(topValue) ? [...topValue] : (topValue && typeof topValue === 'object' ? { ...topValue } : []);

        let target = newTop;
        for (let i = 1; i < path.length; i++) {
            const key = path[i];
            if (i === path.length - 1) {
                if (!Array.isArray(target[key])) return;
                const arr = [...target[key]];
                arr.splice(index, 1);
                target[key] = arr;
            } else {
                if (target[key] == null) return;
                if (Array.isArray(target[key])) target[key] = [...target[key]];
                else if (target[key] && typeof target[key] === 'object') target[key] = { ...target[key] };
                target = target[key];
            }
        }
        if (path.length === 1) {
            if (!Array.isArray(newTop)) return;
            newTop.splice(index, 1);
        }
        actualizarCampo(topKey, newTop);
    };

    return (
        <ProyectoContext.Provider
            value={{
                proyecto,
                addByPath,
                setByPath,
                removeByPath,
                actualizarCampo,
                limpiarProyecto,
                establecerProyecto,
                setPresupuestos,
                // presupuesto single
                presupuesto,
                limpiarPresupuestoActual
            }}
        >
            {children}
        </ProyectoContext.Provider>
    );
};