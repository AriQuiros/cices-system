export const menuConfig = [

    {
        section: "Inicio",
        items: [
            {
                label: "Inicio",
                roles: ["DIRECTOR","ADMINISTRATIVO","ASISTENTE","INVESTIGADOR"],
                pathByRole: {
                    DIRECTOR: "/dashboard",
                    default: "/listado-proyectos"
                }
            }
        ]
    },

    {
        section: "Personal",
        items: [
            { label: "Perfil", path: "/dashboard", roles: ["*"] },
            { label: "Notificaciones", path: "/dashboard", roles: ["*"] }
        ]
    },

    {
        section: "Proyectos",
        items: [
            {
                label: "Registrar",
                path: "/registro-proyecto",
                roles: ["ADMINISTRATIVO","DIRECTOR","ASISTENTE"]
            },
            {
                label: "Consultar",
                path: "/listado-proyectos",
                roles: ["*"]
            },
            {
                label: "Actualizar",
                path: "/actualizar-proyecto",
                roles: ["*"]
            },
            {
                label: "Asignar Investigador",
                path: "/asignar-investigadores",
                roles: ["ADMINISTRATIVO","DIRECTOR","ASISTENTE"]
            }
        ]
    },

    {
        section: "Presupuestos",
        items: [
            {
                label: "Registrar / Actualizar",
                path: "/registro-presupuesto",
                roles: ["ADMINISTRATIVO","DIRECTOR","ASISTENTE"]
            },
            {
                label: "Gestión de Gastos",
                path: "/gestion-gastos",
                roles: ["*"]
            },
            {
                label: "Consultar Gastos",
                path: "/consulta-gastos",
                roles: ["*"]
            },
            {
                label: "Gestión Asignación de Horas",
                path: "/gestion-horas",
                roles: ["ADMINISTRATIVO","DIRECTOR","ASISTENTE"]
            },
            {
                label: "Consultar Asignación Horas",
                path: "/horas-asignadas",
                roles: ["*"]
            },
            {
                label: "Asignación Investigador y Horas",
                path: "/asignar-investigadores-horas",
                roles: ["ADMINISTRATIVO","DIRECTOR","ASISTENTE"]
            }
        ]
    },

    {
        section: "Usuarios",
        items: [
            {
                label: "Administradores y asistentes",
                path: "/consulta-personal",
                roles: ["DIRECTOR"]
            },
            {
                label: "Investigadores",
                path: "/consulta-investigadores",
                roles: ["ADMINISTRATIVO","DIRECTOR","ASISTENTE"]
            },
            {
                label: "Certificaciones",
                path: "/certificaciones",
                roles: ["*"]
            },
            {
                label: "Gestión usuarios",
                path: "/gestion-usuarios",
                roles: ["DIRECTOR"]
            }
        ]
    },

    {
        section: "Reportes",
        items: [
            { label: "Proyectos", path: "/reporte-proyectos", roles: ["*"] },
            { label: "Presupuestos", path: "/reporte-presupuestos", roles: ["*"] },
            { label: "Participantes", path: "/reporte-participantes", roles: ["*"] },
            { label: "Acreditaciones", path: "/reporte-acreditaciones", roles: ["*"] }
        ]
    },

    {
        section: "Otros",
        items: [
            { label: "Consulta Proyecto", path: "/consultar/:id", roles: ["*"] },
            { label: "Horas Proyecto", path: "/proyectos/:id/horas", roles: ["*"] },
            { label: "Consulta Proyectos", path: "/consulta-proyectos", roles: ["*"] },
            { label: "Vista Investigador", path: "/investigador", roles: ["*"] }
        ]
    }

];