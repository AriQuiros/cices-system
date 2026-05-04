import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cambiarEstadoUsuario } from "../../api/personaApi/usuarioApi.js";

export const useCambiarEstadoUsuario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, activo }) =>
            cambiarEstadoUsuario(id, activo),

        onSuccess: (_, variables) => {
            queryClient.setQueriesData(
                { queryKey: ["personas-usuarios"] },
                (paginaAnterior) => {
                    if (!paginaAnterior) return paginaAnterior;

                    // La respuesta puede estar en data.content o directamente en content
                    const wrapper = paginaAnterior.data ?? paginaAnterior;
                    if (!wrapper?.content) return paginaAnterior;

                    const nuevoContent = wrapper.content.map(u =>
                        u.id === variables.id
                            ? { ...u, activo: variables.activo }
                            : u
                    );

                    // Reconstruir respetando la estructura original
                    if (paginaAnterior.data) {
                        return { ...paginaAnterior, data: { ...wrapper, content: nuevoContent } };
                    }
                    return { ...wrapper, content: nuevoContent };
                }
            );
        }
    });
};