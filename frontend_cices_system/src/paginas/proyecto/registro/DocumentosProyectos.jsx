import { useProyecto } from "../../../context/proyectoCtx/UseProyecto.jsx";
import { notify } from "../../../utils/ui/notify.jsx";
import { FolderMinusIcon, FolderPlus } from "lucide-react";
const MAX_TOTAL_SIZE_MB = 550;

const getTotalFileSizeMB = (files = []) => {
    return files.reduce((total, file) => {
        if (file.esNuevo) {
            return total + file.size;
        }
        return total;
    }, 0) / (1024 * 1024);
};

function ProyectoDocumentos({editable}) {

    const { proyecto, actualizarCampo, removeByPath } = useProyecto();

    const handleFileChange = (event) => {
        const nuevosArchivos = Array.from(event.target.files).map(file => {
            file.esNuevo = true;
            return file;
        });
        const archivosCombinados = [...(proyecto.documentos || []), ...nuevosArchivos];

        const totalSizeMB = getTotalFileSizeMB(archivosCombinados);

        if (totalSizeMB > MAX_TOTAL_SIZE_MB) {
            notify.warning(
                `El tamaño total (${totalSizeMB.toFixed(2)} MB) excede el límite de ${MAX_TOTAL_SIZE_MB} MB.`
            );
            return;
        }

        actualizarCampo("documentos", archivosCombinados);
        event.target.value = null;
    };

    return (
        <fieldset className="input-group">
            <legend>Documentos Relacionados</legend>

            {/* INPUT FILE */}
            <div className="form-row">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="input-field"
                />
            </div>

            {/* LISTA */}
            {(proyecto.documentos || []).map((doc, idx) => (
                <div key={idx} className="inline">
                    <input
                        type="text"
                        readOnly
                        className="input-field"
                        value={
                            doc?.esNuevo
                                ? `${doc.name} (${(doc.size / 1024).toFixed(1)} KB)`
                                : `${doc.name} (existente)`
                        }
                    />

                    <div className="icon-buttons">
                        <button hidden={editable && !doc?.esNuevo}
                                type="button" className={"btn-delete"}
                                onClick={() =>
                                    removeByPath(["documentos"], idx)
                                }
                        >
                            <FolderMinusIcon/>
                        </button>
                    </div>
                </div>
            ))}

            {/* RESUMEN */}
            <label>
                Tamaño total:{" "}
                {getTotalFileSizeMB(proyecto.documentos).toFixed(2)} MB / {MAX_TOTAL_SIZE_MB} MB
            </label>

            <meter
                min="0"
                max={MAX_TOTAL_SIZE_MB}
                value={getTotalFileSizeMB(proyecto.documentos)}
            >
                {Math.round(
                    (getTotalFileSizeMB(proyecto.documentos) / MAX_TOTAL_SIZE_MB) * 100
                )}%
            </meter>
        </fieldset>
    );
}

export default ProyectoDocumentos;