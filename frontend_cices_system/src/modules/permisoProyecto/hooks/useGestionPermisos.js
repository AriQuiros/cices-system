import { usePermisosProyecto } from "./queries/usePermisosProyecto";
import { useOtorgarPermisoProyecto } from "./mutations/useOtorgarPermisoProyecto";
import { useRemoverPermisoProyecto } from "./mutations/useRemoverPermisoProyecto";
import { useInvestigadoresPorProyecto } from "../../investigadorProyecto/hooks/queries/useInvestigadoresPorProyecto";
import { confirm } from "../../../utils/ui/confirm.jsx";

export const useGestionPermisos = (codigoProyecto) => {
	const permisosQuery = usePermisosProyecto(codigoProyecto);

	const investigadoresQuery = useInvestigadoresPorProyecto(codigoProyecto, { page: 0, size: 10 }, "nombreCompleto", "asc");

	const otorgarMutation = useOtorgarPermisoProyecto();
	const removerMutation = useRemoverPermisoProyecto();

	const otorgarPermiso = (permiso) => {
		return otorgarMutation.mutate(permiso);
	};

	const removerPermiso = async (id) => {
		if (!(await confirm.action({
			title: "Eliminar permiso",
			message: "¿Remover permiso a investigador?",
			confirmText: "Remover"
		}))) return;

		return removerMutation.mutate(id);
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


