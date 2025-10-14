/* eslint-env vitest */
import { describe, test, expect } from "vitest";

// Simula algunos proyectos de ejemplo
const proyectos = [
    {
        nombreProyecto: "Proyecto Solar",
        codigoProyecto: "PS-001",
        lineaInvestigacion: "Energías Renovables",
        fechaInicio: "2024-01-10",
        fechaFinalizacion: "2024-12-10",
    },
    {
        nombreProyecto: "Proyecto Lunar",
        codigoProyecto: "PL-002",
        lineaInvestigacion: "Astronomía",
        fechaInicio: "2023-05-01",
        fechaFinalizacion: "2023-10-01",
    },
];

// Función auxiliar para filtrar como hace el componente React
function filtrar(proyectos, campoFiltro, valorBusqueda) {
    const q = (valorBusqueda || "").toLowerCase().trim();
    const toText = (v) => (v == null ? "" : String(v)).toLowerCase();

    return proyectos.filter((p) => {
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

describe("Filtros de ProyectoInvestigador", () => {
    test("filtra por nombre del proyecto (case-insensitive)", () => {
        const res = filtrar(proyectos, "nombre", "solar");
        expect(res).toHaveLength(1);
        expect(res[0].codigoProyecto).toBe("PS-001");
    });

    test("filtra por código exacto", () => {
        const res = filtrar(proyectos, "codigo", "PL-002");
        expect(res).toHaveLength(1);
        expect(res[0].nombreProyecto).toBe("Proyecto Lunar");
    });

    test("filtra por línea de investigación", () => {
        const res = filtrar(proyectos, "lineaInvestigacion", "energías");
        expect(res).toHaveLength(1);
        expect(res[0].nombreProyecto).toBe("Proyecto Solar");
    });

    test("filtra por fecha de inicio", () => {
        const res = filtrar(proyectos, "fechaInicio", "2024");
        expect(res).toHaveLength(1);
        expect(res[0].codigoProyecto).toBe("PS-001");
    });

    test("filtra por varios campos", () => {
        const res = filtrar(proyectos, "varios", "astronomía");
        expect(res).toHaveLength(1);
        expect(res[0].codigoProyecto).toBe("PL-002");
    });

    test("sin coincidencias devuelve vacío", () => {
        const res = filtrar(proyectos, "nombre", "no existe");
        expect(res).toHaveLength(0);
    });
});
