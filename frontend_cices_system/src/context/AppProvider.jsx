import {useEffect, useState} from "react";
import { AppContext } from "./AppContext.jsx";


export default function AppProvider({ children }) {
    const [user, setUser] = useState(() => {});
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        const cargarUsuario = () => {
            try{
                const usuarioGuardado = localStorage.getItem("user");
                const tokenGuardado = localStorage.getItem("token");

                if(usuarioGuardado){
                    setUser(JSON.parse(usuarioGuardado))
                }

                if(tokenGuardado){
                    setToken(tokenGuardado);
                }
            }catch (error){
                console.error(error);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
        cargarUsuario();
    }, []);



    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
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
            }],
            numeroBecario: ""
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
                            cantidad: 0,
                            descripcion: '',
                            indicadores: ['']
                        }
                    ]
                }
            ],
            unidades: [{ nombre: '' }],
            instituciones: [{ nombre: '' }],
            sitios: [{ nombre: '' }],
            fechaInicio: '',
            fechaFinalizacion: '',
            documentos: []
        }
    });

    return (
        <AppContext.Provider value={{
            user,
            token,
            login,
            logout,
            proyectosState: proyectosState,
            setProyectosState: setProyectosState,
            empleadosState: empleadosState,
            setEmpleadosState: setEmpleadosState
        }}>
            {children}
        </AppContext.Provider>
    );
}
