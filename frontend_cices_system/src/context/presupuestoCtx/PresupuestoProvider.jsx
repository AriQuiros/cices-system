import { useDTO } from "../utils/useDTO.js";
import { PresupuestoContext } from "./PresupuestoContext.jsx";
import { PresupuestoDTO, HorasAsignadasDTO, GastoDTO } from "../../modelos/presupuestoDTO.jsx";
import {useState} from "react";

export const PresupuestoProvider = ({ children }) => {

    const presupuestoState = useDTO(PresupuestoDTO);

    const [horasAsignadas, setHorasAsignadas] = useState([]);
    const [gastos, setGastos] = useState([]);

    const setters = {
        horasAsignadas: setHorasAsignadas,
        gastos: setGastos
    };

    const dtos = {
        horasAsignadas: HorasAsignadasDTO,
        gastos: GastoDTO
    };

    const setLista = (nombreLista, lista) => {

        const setter = setters[nombreLista];
        const dto = dtos[nombreLista];

        if (!setter) return;

        setter(
            lista.map(item => ({
                ...dto,
                ...item
            }))
        );
    };

    const agregarItem = (nombreLista, item) => {

        const setter = setters[nombreLista];
        const dto = dtos[nombreLista];

        if (!setter) return;

        setter(prev => [
            ...prev,
            {
                ...dto,
                ...item,
                presupuesto: presupuestoState.data
            }
        ]);
    };

    const actualizarItem = (nombreLista, index, cambios) => {

        const setter = setters[nombreLista];

        if (!setter) return;

        setter(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, ...cambios }
                    : item
            )
        );
    };

    const eliminarItem = (nombreLista, index) => {

        const setter = setters[nombreLista];

        if (!setter) return;

        setter(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <PresupuestoContext.Provider
            value={{
                presupuesto: presupuestoState.data,
                actualizarCampo: presupuestoState.actualizarCampo,
                limpiarPresupuesto: presupuestoState.limpiar,

                horasAsignadas,
                gastos,

                setLista,
                agregarItem,
                actualizarItem,
                eliminarItem
            }}
        >
            {children}
        </PresupuestoContext.Provider>
    );
};