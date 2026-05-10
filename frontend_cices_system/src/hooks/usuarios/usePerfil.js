import { useEffect, useState } from "react";
import { getPerfil, updatePerfil } from "../../services/EmpleadoService";
import { notify } from "../../utils/ui/notify.jsx";
import {useAuth} from "./useAuth.js";
import {loginRequest} from "../../services/AuthService.jsx";

export function usePerfil({ modoPerfil, setEmpleado, setUsuario, setInvestigador }) {

    const { roles, token, isInvestigador, user, login } = useAuth();

    const [loading, setLoading] = useState(false);

    // 🔹 cargar perfil
    useEffect(() => {
        if (!modoPerfil || !token) return;

        let cancel = false;

        (async () => {
            setLoading(true);

            const result = await getPerfil(roles, token);

            if (!result.ok) {
                if (!cancel) notify.error(result.message || "Error cargando perfil");
                setLoading(false);
                return;
            }

            if (cancel) return;

            const data = result.data;

            if (isInvestigador) {
                const investigadorData = data; // data ya es el objeto investigador
                const empleadoData = data.empleado || {};
                const usuarioData = empleadoData.usuario || {};

                // 🔹 setear datos del empleado
                setEmpleado(empleadoData);

                // 🔹 setear usuario
                setUsuario({
                    ...usuarioData,
                    nombreUsuario: empleadoData.correo
                });

                setInvestigador({
                    id: investigadorData.id || null,
                    institucionOrigen: investigadorData.institucionOrigen || null,
                    unidadAcademica: investigadorData.unidadAcademica || null,
                    temaInteres: investigadorData.temaInteres || "",
                    titulos: investigadorData.titulos || [],
                    certificaciones: investigadorData.certificaciones || []
                });

            } else {
                // 🔹 Para empleado normal
                const { usuario, ...empleadoData } = data;
                setEmpleado(empleadoData);
                setUsuario({
                    ...usuario,
                    nombreUsuario: data.correo
                });
            }

            setLoading(false);
        })();

        return () => { cancel = true; };
    }, [modoPerfil, roles, token, isInvestigador]);


    const actualizarPerfil = async (payload, authPassword) => {

        try {
            setLoading(true);

            const res = await updatePerfil(payload, roles);

            if (!res.ok) throw new Error("Error al actualizar perfil");

            const nuevoCorreo = payload.empleado?.correo || payload.correo;
            const correoActual = user?.username;

            const cambioUsername = nuevoCorreo !== correoActual;

            if (cambioUsername) {
                const loginRes = await loginRequest(nuevoCorreo, authPassword);

                if (!loginRes.ok) {
                    throw new Error("Perfil actualizado, pero debe iniciar sesión nuevamente");
                }

                const data = await loginRes.json();

                login(data.user, data.token);

            }

            notify.success("Perfil actualizado correctamente");

        } catch (error) {

            notify.error(error.message);

        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        actualizarPerfil
    };
}