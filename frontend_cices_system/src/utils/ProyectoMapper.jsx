/*export function prepararProyectoParaEnvio(proyecto) {

    const entidadesVinculadasFormateadas = [
        ...(proyecto.entidadesVinculadas?.unidades || [])
            .filter(e => e.nombre)
            .map(e => ({ nombre: e.nombre.trim(), tipo: 'UNIDAD' })),
        ...
    ];

    return {
        ...proyecto,
        entidadesVinculadas: entidadesVinculadasFormateadas
    };
}*/