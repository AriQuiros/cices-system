import { useQuery } from "@tanstack/react-query";
import { obtenerHoraSrv } from "../../services/horasService";

export const useHora = (id) => {
	return useQuery({
		queryKey: ["hora", id],
		queryFn: () => obtenerHoraSrv(id),
		enabled: !!id
	});
};


