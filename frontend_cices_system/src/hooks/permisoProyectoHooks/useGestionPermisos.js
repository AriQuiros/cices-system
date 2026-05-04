import { usePermisosProyecto } from "./queries/usePermisosProyecto.js";
import { useOtorgarPermisoProyecto } from "./mutations/useOtorgarPermisoProyecto.js";
import { useRemoverPermisoProyecto } from "./mutations/useRemoverPermisoProyecto.js";
import { useInvestigadoresPorProyecto } from "../investigadorProyectoHooks/queries/useInvestigadoresPorProyecto.js";
import { confirm } from "../../utils/ui/confirm.jsx";
import {notify} from "../../utils/ui/notify.jsx";

export const useGestionPermisos = (codigoProyecto) => {
	const permisosQuery = usePermisosProyecto(codigoProyecto);

	const investigadoresQuery = useInvestigadoresPorProyecto(codigoProyecto, { page: 0, size: 10 }, "nombreCompleto", "asc");

	const otorgarMutation = useOtorgarPermisoProyecto();
	const removerMutation = useRemoverPermisoProyecto();

	const otorgarPermiso = (permiso) => {
		otorgarMutation.mutate(permiso, {
			onSuccess: () => notify.success("Permiso otorgado"),
			onError:   (err) => notify.error(err?.response?.data?.message || "Error al otorgar permiso"),
		});
	};

	const removerPermiso = async (id) => {
		if (!(await confirm.action({
			title:       "Eliminar permiso",
			message:     "¿Remover permiso a investigador?",
			confirmText: "Remover"
		}))) return;

		removerMutation.mutate(id, {
			onSuccess: () => notify.success("Permiso removido"),
			onError:   (err) => notify.error(err?.response?.data?.message || "Error al remover permiso"),
		});
	};

	return {
		permisos: permisosQuery.data?.data || [],
		isLoading: permisosQuery.isLoading,
		investigadores: investigadoresQuery.data?.content || [],
		otorgarPermiso,
		removerPermiso,
		otorgar: otorgarMutation.mutate,
		otorgarAsync: otorgarMutation.mutateAsync,
		remover: removerMutation.mutate,
		removerAsync: removerMutation.mutateAsync,
		refetch: permisosQuery.refetch
	};
};


