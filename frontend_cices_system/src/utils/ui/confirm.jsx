import Swal from "sweetalert2";

export const confirm = {

    delete: async (message = "¿Seguro que desea eliminar este registro?") => {

        const res = await Swal.fire({
            title: "Confirmar eliminación",
            text: message,
            icon: "warning",
            width: "400px",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#ef4444"
        });

        return res.isConfirmed;

    },

    update: async (message = "¿Desea guardar los cambios?") => {

        const res = await Swal.fire({
            title: "Confirmar cambios",
            text: message,
            icon: "question",
            width: "400px",
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar"
        });

        return res.isConfirmed;

    },

    action: async ({
                       title = "Confirmar acción",
                       message = "¿Desea continuar?",
                       confirmText = "Confirmar",
                       cancelText = "Cancelar",
                       icon = "question"
                   }) => {

        const res = await Swal.fire({
            title,
            text: message,
            icon,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText
        });

        return res.isConfirmed;

    }

};