import { useState } from "react";
import { AppContext } from "./AppContext.jsx";

export default function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

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
            entidadesVinculadas: [
                {
                    nombre: '',
                    tipo: ''
                }
            ],
            fechaInicio: '',
            fechaFinalizacion: '',
            documentos: [
                {
                    nombre: '',
                    directorio: ''
                }
            ]
        }
    });

    return (
        <AppContext.Provider value={{
            user,
            token,
            login,
            logout,
            proyectosState: proyectosState,
            setProyectosState: setProyectosState
        }}>
            {children}
        </AppContext.Provider>
    );
}
