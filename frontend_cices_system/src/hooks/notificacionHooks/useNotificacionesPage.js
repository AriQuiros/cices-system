import { useListadoNotificaciones } from "./useListadoNotificaciones.js";

import {
    useMarcarLeida,
    useMarcarNoLeida,
    useEliminarNotif
} from "./mutations/useNotificacionAcciones.js";
import {notify} from "../../utils/ui/notify.jsx";
import {confirm} from "../../utils/ui/confirm.jsx";

export const useNotificacionesPage = () => {

    // LISTADO
    const listado = useListadoNotificaciones();

    // MUTATIONS
    const {
        mutateAsync: marcarLeida,
        isPending: pL
    } = useMarcarLeida();

    const {
        mutateAsync: marcarNoLeida,
        isPending: pNL
    } = useMarcarNoLeida();

    const {
        mutateAsync: eliminar,
        isPending: pE
    } = useEliminarNotif();

    // ACTIONS

    const handleMarcarLeida = async (id) => {

        try {

            await marcarLeida(id);

            notify.success("Notificación marcada como leída");

        } catch (error) {

            notify.error("No se pudo marcar como leída");
        }
    };

    const handleMarcarNoLeida = async (id) => {

        try {

            await marcarNoLeida(id);

            notify.success("Notificación marcada como no leída");

        } catch (error) {

            notify.error("No se pudo actualizar");
        }
    };

    const handleEliminar = async (id) => {

        const confirmado = confirm.delete();

        if (!confirmado) return;

        try {

            await eliminar(id);

            notify.success("Notificación eliminada");

        } catch (error) {

            notify.error("No se pudo eliminar");
        }
    };

    return {

        // listado
        ...listado,

        // pending
        pL,
        pNL,
        pE,

        // actions
        handleMarcarLeida,
        handleMarcarNoLeida,
        handleEliminar
    };
};