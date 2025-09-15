
import { useEffect, useState } from 'react';
import { fetchTiposCatalogo } from '../services/catalogoService';

export function useTiposCatalogo(token, tiposSolicitados = []) {
    const [tipos, setTipos] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (/*!token ||*/ tiposSolicitados.length === 0) return;

        const loadTipos = async () => {
            setLoading(true);
            const result = await fetchTiposCatalogo(token, tiposSolicitados);
            if (result) {
                setTipos(result);
                setError(null);
            } else {
                setTipos({});
                setError('No se pudieron cargar los tipos');
            }
            setLoading(false);
        };

        loadTipos();
    }, [token, JSON.stringify(tiposSolicitados)]);

    return { tipos, loading, error };
}
