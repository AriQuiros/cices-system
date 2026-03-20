export const menuConfig = [

    {
        section: "Inicio",
        items: [
            {
                label: "Inicio",
                roles: ["DIRECCION","ADMINISTRATIVO","ASISTENTE","INVESTIGADOR"],
                pathByRole: {
                    DIRECCION: "/dashboard",
                    default: "/listado-proyectos"
                }
            }
        ]
    },

    {
        section: "Personal",
        items: [
            { label: "Perfil", path: "/perfil", roles: ["*"] },
            { label: "Notificaciones", path: "/dashboard", roles: ["*"] }
        ]
    },

    {
        section: "Proyectos",
        items: [
            {
                label: "Registrar",
                path: "/registro-proyecto",
                roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE"]
            },
            {
                label: "Actualizar",
                path: "/actualizar-proyecto",
                roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE"]
            },
            {
                label: "Consultar",
                path: "/listado-proyectos",
                roles: ["*"]
            },
            {
                label: "Asignar Investigador",
                path: "/asignar-investigadores",
                roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE"]
            }
        ]
    },

    {
        section: "Presupuestos",
        items: [
            {
                label: "Registrar / Actualizar",
                path: "/registro-presupuesto",
                roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE"]
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
                roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE"]
            },
            {
                label: "Consultar Asignación Horas",
                path: "/horas-asignadas",
                roles: ["*"]
            },
            {
                label: "Asignación Investigador y Horas",
                path: "/asignar-investigadores-horas",
                roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE"]
            }
        ]
    },

    {
        section: "Usuarios",
        items: [
            {
                label: "Administradores y asistentes",
                path: "/consulta-personal",
                roles: ["DIRECCION"]
            },
            {
                label: "Investigadores",
                path: "/consulta-investigadores",
                roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE"]
            },
            {
                label: "Certificaciones",
                path: "/certificaciones",
                roles: ["*"]
            },
            {
                label: "Gestión usuarios",
                path: "/gestion-usuarios",
                roles: ["DIRECCION"]
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
            { label: "Consulta Proyecto", path: "/consulta-proyectos", roles: ["*"] },
            { label: "Horas Proyecto", path: "/proyectos/:id/horas", roles: ["*"] },
            { label: "Consulta Proyectos", path: "/consulta-proyectos", roles: ["*"] },
            { label: "Vista Investigador", path: "/investigador", roles: ["*"] }
        ]
    }

];