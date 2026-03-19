import { useEffect, useState } from "react";

export function useEntidades() {
    const [entidades, setEntidades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancel = false;

        const fetchEntidades = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/entidades");
                const data = await res.json();

                if (!cancel) setEntidades(data);
            } catch (e) {
                console.error(e);
            } finally {
                if (!cancel) setLoading(false);
            }
        };

        fetchEntidades();

        return () => { cancel = true; };
    }, []);

    const getOptionsByTipo = (tipo) =>
        entidades
            .filter(e => e.tipo?.valor === tipo)
            .map(e => ({
                value: e.id,
                label: e.nombre,
                tipo: e.tipo
            }));

    return {
        loading,
        entidades,
        getOptionsByTipo
    };
}