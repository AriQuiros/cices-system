import { useEffect,  useState } from "react";
import { AppContext } from "./AppContext.jsx";

const parseJwt = (t) => { try { return JSON.parse(atob(t.split(".")[1])); } catch { return null; } };

const loadAuth = () => {
    try {
        const raw = sessionStorage.getItem("auth") || localStorage.getItem("auth");
        if (!raw) return { user: null, token: null, exp: 0 };
        const obj = JSON.parse(raw);
        const expMs = (obj?.exp ?? 0) * 1000;
        if (expMs && expMs < Date.now()) {
            sessionStorage.removeItem("auth"); localStorage.removeItem("auth");
            return { user: null, token: null, exp: 0 };
        }
        return { user: obj.user ?? null, token: obj.token ?? null, exp: obj.exp ?? 0 };
    } catch { return { user: null, token: null, exp: 0 }; }
};

export default function AppProvider({ children }) {
    const init = loadAuth();
    const [user, setUser] = useState(init.user);
    const [token, setToken] = useState(init.token);

    useEffect(() => {
        let id;
        if (token) {
            const p = parseJwt(token);
            const expMs = (p?.exp ?? 0) * 1000;
            const delay = expMs - Date.now();
            if (delay > 0) id = setTimeout(() => logout(), delay);
            else logout();
        }
        return () => id && clearTimeout(id);
    }, [token]);

    const login = (userData, jwt, remember = false) => {
        setUser(userData);
        setToken(jwt);
        const exp = parseJwt(jwt)?.exp ?? 0;
        const store = remember ? localStorage : sessionStorage;
        store.setItem("auth", JSON.stringify({ user: userData, token: jwt, exp }));
        (remember ? sessionStorage : localStorage).removeItem("auth");
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem("auth");
        localStorage.removeItem("auth");
    };

    /************EMPLEADOS***************/
    const [empleadosState, setEmpleadosState] = useState({
        empleado: {
            nombre: "",
            nacionalidad: "",
            tipoIdentificacion: "",
            identificacion: "",
            telefono: "",
            correo: "",
            contrasena: "",
            roles: [{
                id: "",
                nombre: ""
            }]
        }
    });

    /********PROYECTOS**********/
    const [proyectosState, setProyectosState] = useState({
        proyecto: {
            codigo: '',
            nombre: '',
            unidadOrigen: '',
            estado: '',
            tipo: '',
            lineaInvestigacion: '',
            descripcion: '',
            objetivoGeneral: '',
            objetivosEspecificos: [
                {
                    categoria: '',
                    descripcion: '',
                    metas: [
                        {
                            tipo: '',
                            cantidad: 1,
                            descripcion: '',
                            indicadores: ['']
                        }
                    ]
                }
            ],
            entidadesVinculadas: {
                instituciones: [{ nombre: '' }],
                unidades: [{ nombre: '' }],
                sitios: [{ nombre: '' }]
            },
            fechaInicio: '',
            fechaFinalizacion: '',
            presentacionesInformes: [
                {
                    descripcion: '',
                    fechaPresentacion: '',
                    codigoEstado: ''
                }
            ],
            documentos: []
        }
    });

    /***************Presupuestos*********************/
    const [presupuestoState, setPresupuestoState] = useState(
        {
            financiero: {
                descripcion: '',
                fechaAsignacion: '',
                monto: 0,
                fuenteFinanciamiento: '',
                tipoPresupuesto: ''
            },
            horas: {
                descripcion: '',
                fechaAsignacion: '',
                cantidadHorasMes: 0,
                cantidadMeses: 0,
                tipoPresupuesto: ''
            }
        });

    /************* ASIGNAR INVESTIGADORES *************/
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

    const searchInvestigadores = async (q = "") => {
        const res = await fetch(`${apiUrl}/investigador/investigadores?q=${encodeURIComponent(q)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await res.json(); // [{id,nombre,unidad}]
    };


    const searchProyecto = async (q = "") => {
        if (!q) return null;
        const res = await fetch(`${apiUrl}/proyectos/search?q=${encodeURIComponent(q)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data) return null;
        return {
            id: data.id,
            codigo: data.codigo,
            nombre: data.nombre,
            estado: data.estado,
            linea: data.linea,
            periodo: { ini: data.ini, fin: data.fin },
            horasPlanificadas: Number(data.horas_planificadas || 0),
            asignados: { count: Number(data.asignados_cnt || 0), horas: Number(data.horas_comprometidas || 0) },
        };
    };

    const listarAsignados = async (proyectoId, q = "") => {
        const res = await fetch(`${apiUrl}/proyectos/${proyectoId}/asignados?q=${encodeURIComponent(q)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await res.json(); // [{id,nombre,rol,periodo:{ini,fin},horas,estado}]
    };

    // AppProvider.jsx
    const listarRolesProyecto = async () => {
        const res = await fetch(`${apiUrl}/catalogos/roles-proyecto`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Error al listar roles");
        return await res.json(); // [{id, nombre}]
    };





    const agregarAsignacion = async (p) => {
        await fetch(`${apiUrl}/proyectos/${p.proyectoId}/asignaciones`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(p),
        });
    };

    const quitarAsignacion = async ({ proyectoId, investigadorId }) => {
        await fetch(`${apiUrl}/proyectos/${proyectoId}/asignaciones/${investigadorId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
    };

    const sugerirProyectos = async (q = "") => {
        if (!q) return [];
        const res = await fetch(`${apiUrl}/proyectos/suggest?q=${encodeURIComponent(q)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return [];
        // [{id,codigo,nombre}]
        return await res.json();
    };

    return (
        <AppContext.Provider value={{
            user,
            token,
            login,
            logout,
            proyectosState: proyectosState,
            setProyectosState: setProyectosState,
            empleadosState: empleadosState,
            setEmpleadosState: setEmpleadosState,
            presupuestoState: presupuestoState,
            setPresupuestoState: setPresupuestoState,
            searchInvestigadores,
            searchProyecto,
            listarAsignados,
            listarRolesProyecto,
            agregarAsignacion,
            quitarAsignacion,
            sugerirProyectos,
        }}>
            {children}
        </AppContext.Provider>
    );




}
