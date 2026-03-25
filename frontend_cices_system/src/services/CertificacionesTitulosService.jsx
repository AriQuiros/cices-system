export const eliminarFormacion = async (collection, id) => {
    const allowedCollections = ["titulos", "certificaciones"];

    if (!allowedCollections.includes(collection)) {
        throw new Error("Colección no válida");
    }
    return fetch(`/api/${collection}/eliminar/${id}`, {
        method: "DELETE"
    });
};