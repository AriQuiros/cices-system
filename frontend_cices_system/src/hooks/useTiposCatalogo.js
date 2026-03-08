
import { useEffect, useState } from 'react';
import { fetchTiposCatalogo } from '../services/catalogoService';
import {notify} from "../utils/estilo/notify.jsx";

export function useTiposCatalogo(token, tiposSolicitados = []) {
    const [tipos, setTipos] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (/*!token ||*/ tiposSolicitados.length === 0) return;

        const loadTipos = async () => {
            setLoading(true);
            const result = await fetchTiposCatalogo(token, tiposSolicitados);
            if (result) {
                setTipos(result);
            } else {
                setTipos({});
                notify.error('No se pudieron cargar los tipos');
            }
            setLoading(false);
        };

        loadTipos();
    }, [token, JSON.stringify(tiposSolicitados)]);

    return { tipos, loading };
}
