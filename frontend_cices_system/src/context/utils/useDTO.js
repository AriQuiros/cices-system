import { useState } from "react";

export const useDTO = (DTO) => {

    const [data, setData] = useState({ ...DTO });

    const actualizarCampo = (campo, valor) => {
        setData(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    const limpiar = () => {
        setData({ ...DTO });
    };

    const establecer = (obj) => {
        setData({ ...DTO, ...obj });
    };

    return {
        data,
        setData,
        actualizarCampo,
        limpiar,
        establecer
    };
};