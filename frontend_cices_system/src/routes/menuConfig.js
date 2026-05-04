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
            { label: "Notificaciones", path: "/notificaciones", roles: ["*"] },
            {
                label: "Mis Certificaciones",
                path: "/certificaciones-investigador",
                roles: ["ADMINISTRATIVO","DIRECCION", "INVESTIGADOR"]
            },
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
                roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE", "INVESTIGADOR"]
            },
            {
                label: "Consultar",
                path: "/listado-proyectos",
                roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE", "INVESTIGADOR"]
            },
            {
                label: "Asignar Investigador",
                path: "/asignar-investigadores",
                roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE"]
            },
            {
                label: "Permiso Coordinador",
                path: "/gestion-permiso-proyecto",
                roles: ["INVESTIGADOR"]
            }
        ]
    },

    {
        section: "Presupuestos",
        items: [
            {
                label: "Gestión Presupuestos",
                path: "/registro-presupuesto",
                roles: ["ADMINISTRATIVO","DIRECCION"]
            },
            {
                label: "Gestión de Gastos",
                path: "/gestion-gastos",
                roles: ["ADMINISTRATIVO","DIRECCION","INVESTIGADOR"]
            },
            {
                label: "Consultar Gastos",
                path: "/consulta-gastos",
                roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE", "INVESTIGADOR"]
            },
            {
                label: "Gestión Asignación de Horas",
                path: "/gestion-horas",
                roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE"]
            },
            {
                label: "Consultar Asignación Horas",
                path: "/consulta-horas-asignadas",
                roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE"]
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
                label: "Gestión usuarios",
                path: "/gestion-usuarios",
                roles: ["DIRECCION"]
            }
        ]
    },

    {
        section: "Reportes",
        items: [
            { label: "Proyectos", path: "/reporte-proyectos", roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE"] },
            { label: "Presupuestos", path: "/reporte-presupuestos", roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE"] },
            { label: "Participantes", path: "/reporte-participantes", roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE"] },
            { label: "Certificaciones", path: "/reporte-certificaciones", roles: ["ADMINISTRATIVO","DIRECCION","ASISTENTE"] }
        ]
    }

];