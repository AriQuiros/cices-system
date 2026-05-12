export function filtrarProyectosInvestigador(proyectos, campoFiltro, valorBusqueda) {
    const q = (valorBusqueda || "").toLowerCase().trim();
    const toText = (v) => (v == null ? "" : String(v)).toLowerCase();

    return (proyectos || []).filter((p) => {
        const nombre = toText(p.nombreProyecto);
        const codigo = toText(p.codigoProyecto);
        const linea = toText(p.lineaInvestigacion);
        const fIni = toText(p.fechaInicio);
        const fFin = toText(p.fechaFinalizacion);

        switch (campoFiltro) {
            case "nombre":
                return nombre.includes(q);
            case "codigo":
                return codigo.includes(q);
            case "lineaInvestigacion":
                return linea.includes(q);
            case "fechaInicio":
                return fIni.includes(q);
            case "fechaFinalizacion":
                return fFin.includes(q);
            case "varios":
            default:
                return (
                    nombre.includes(q) ||
                    codigo.includes(q) ||
                    linea.includes(q) ||
                    fIni.includes(q) ||
                    fFin.includes(q)
                );
        }
    });
}

export function paginarProyectosInvestigador(proyectosFiltrados, paginaActual, proyectosPorPagina) {
    const total = (proyectosFiltrados || []).length;
    const totalPaginas = Math.max(1, Math.ceil(total / proyectosPorPagina));
    const pagina = Math.min(paginaActual, totalPaginas);
    const fin = pagina * proyectosPorPagina;
    const inicio = fin - proyectosPorPagina;

    return {
        pagina,
        totalPaginas,
        proyectosPagina: (proyectosFiltrados || []).slice(inicio, fin),
    };
}