// modules/proyecto/hooks/useDescargarDocumento.js
import { useState } from "react";
import { fetchDocumentoBlob } from "../../api/proyectoApi/proyectoConsultaApi.js";

/**
 * Hook para descargar o visualizar un documento autenticado.
 *
 * Por qué fetch-as-blob y no <a href>:
 * El endpoint requiere Authorization: Bearer — el browser no lo envía
 * al navegar por href. Se descarga con httpClient (que adjunta el token),
 * se crea una URL de objeto temporal y se simula el click.
 */
export const useDescargarDocumento = () => {
    const [descargandoId, setDescargandoId] = useState(null);

    const descargar = async (doc, mode = "descargar") => {
        if (!doc?.id) return;
        setDescargandoId(doc.id);
        try {
            const res  = await fetchDocumentoBlob(doc.id, mode);
            const blob = new Blob([res.data], { type: res.headers["content-type"] });
            const url  = URL.createObjectURL(blob);

            if (mode === "visualizar") {
                // Abre en pestaña nueva — el browser lo renderiza si soporta el tipo
                window.open(url, "_blank", "noopener,noreferrer");
            } else {
                // Dispara descarga con el nombre original del archivo
                const link = document.createElement("a");
                link.href  = url;
                link.download = doc.nombreDocumento || "documento";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            // Liberar la URL de objeto después de usarla
            setTimeout(() => URL.revokeObjectURL(url), 10_000);
        } catch {
            // El componente muestra el error desde isError o se puede agregar notify aquí
            console.error("Error descargando documento", doc.id);
        } finally {
            setDescargandoId(null);
        }
    };

    return { descargar, descargandoId };
};