import { useEffect, useState } from "react";
import { BitacoraService } from "../../../services/BitacoraService";

const ModalBitacora = ({ gasto, token, onClose }) => {

    const [bitacora, setBitacora] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await BitacoraService.obtenerPorGasto(gasto.id, token);
                setBitacora(data || []);
            } catch {
                console.error("Error cargando bitácora");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [gasto, token]);

    const bitacoraOrdenada = [...bitacora].sort(
        (a, b) => new Date(b.bitacora.fecha) - new Date(a.bitacora.fecha)
    );

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/10 backdrop-blur-sm">

            <div className="bg-white w-[600px] max-h-[80vh] overflow-y-auto p-6 rounded-lg">

                <h2 className="text-xl font-bold mb-4">Bitácora Gasto</h2>
                <h4 className="font-bold text-blue-900">Gasto Actual:</h4>
                <div className="mb-4 p-3 rounded bg-gray-50">
                    <p><b>Descripción:</b> {gasto.descripcion}</p>
                    <p><b>Fecha:</b> {gasto.fechaGasto}</p>
                    <p><b>Monto:</b> {gasto.monto}</p>
                </div>

                {/* Bitácora */}
                {loading ? (
                    <p>Cargando...</p>
                ) : bitacoraOrdenada.length === 0 ? (
                    <div className="text-center text-gray-500 mt-6">
                    <p className="text-lg">📭</p>
                    <p>No hay actualizaciones para este gasto</p>
                    </div>
                    ) : (
                    bitacoraOrdenada.map((b, i) => {

                        const siguiente = bitacoraOrdenada[i - 1];

                        return (
                            <div key={i} className="border rounded p-3 mb-3">

                                <p className="text-sm text-gray-500 mb-2">
                                    {b.bitacora.fecha} - {b.bitacora.nombreUsuario}
                                </p>

                                <div className="space-y-1">

                                    {b.montoOld !== null && (
                                        <p>
                                            <strong>Monto:</strong>{" "}
                                            <span className="line-through text-red-500">
                                                {b.montoOld}
                                            </span>{" "}
                                            →{" "}
                                            <span className="text-green-600">
                                                {siguiente?.montoOld ?? gasto.monto}
                                            </span>
                                        </p>
                                    )}

                                    {b.fechaGastoOld && (
                                        <p>
                                            <strong>Fecha:</strong>{" "}
                                            <span className="line-through text-red-500">
                                                {b.fechaGastoOld}
                                            </span>{" "}
                                            →{" "}
                                            <span className="text-green-600">
                                                {siguiente?.fechaGastoOld ?? gasto.fechaGasto}
                                            </span>
                                        </p>
                                    )}

                                    {b.descripcionOld && (
                                        <p>
                                            <strong>Descripción:</strong>{" "}
                                            <span className="line-through text-red-500">
                                                {b.descripcionOld}
                                            </span>{" "}
                                            →{" "}
                                            <span className="text-green-600">
                                                {siguiente?.descripcionOld ?? gasto.descripcion}
                                            </span>
                                        </p>
                                    )}

                                </div>

                            </div>
                        );
                    })
                )}

                <button
                    onClick={onClose}
                    className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
                >
                    Cerrar
                </button>

            </div>
        </div>
    );
};

export default ModalBitacora;