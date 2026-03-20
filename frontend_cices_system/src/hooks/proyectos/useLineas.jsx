import { useEffect, useState } from "react";
import { obtenerLineas } from "../../services/proyectoService";

export function useLineas() {
    const [lineas, setLineas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancel = false;

        const fetchLineas = async () => {
            try {
                const data = await obtenerLineas();
                if (!cancel) setLineas(data);
            } catch (e) {
                console.error(e);
            } finally {
                if (!cancel) setLoading(false);
            }
        };

        fetchLineas();

        return () => { cancel = true; };
    }, []);

    const opciones = lineas.map(l => ({
        value: l,
        label: l
    }));

    return { lineas, opciones, loading };
}