import { useEffect, useState } from "react";
import axios from "axios";

export default function InvestigadorDetalle({ investigador, onClose }) {

    const [detalle, setDetalle] = useState(null);

    useEffect(() => {
        cargarDetalle();
    }, []);

    const cargarDetalle = async () => {
        const res = await axios.get(
            `/api/reports/investigadores/${investigador.identificacion}`
        );

        setDetalle(res.data);
    };

    if (!detalle) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

            <div className="bg-white rounded-lg p-6 w-[800px] max-h-[73vh] overflow-y-auto mt-10">

                <h2 className="text-xl font-bold mb-4">
                    {investigador.nombreCompleto}
                </h2>

                {/* FILA SUPERIOR */}
                <div className="grid grid-cols-2 gap-6 mb-6">

                    {/* INFORMACION BASE */}
                    <div>
                        <h3 className="font-semibold border-b mb-2">
                            Información básica
                        </h3>

                        <p><b>Identificación:</b> {investigador.identificacion}</p>
                        <p><b>País:</b> {investigador.pais}</p>
                        <p><b>Correo:</b> {investigador.correo}</p>
                        <p><b>Teléfono:</b> {investigador.numeroTelefono}</p>
                        <p><b>Grado:</b> {investigador.gradoAcademico}</p>
                        <p><b>Institución:</b> {investigador.institucionOrigen}</p>
                        <p><b>Unidad:</b> {investigador.unidadAcademica}</p>
                        <p><b>Tema interés:</b> {investigador.temaInteres}</p>
                    </div>

                    {/* PROYECTOS */}
                    <div>
                        <h3 className="font-semibold border-b mb-2">
                            Proyectos
                        </h3>

                        <ul className="list-disc pl-5">
                            {detalle.proyectos.map(p => (
                                <li key={p.codigoProyecto}>
                                    {p.codigoProyecto} - {p.nombreProyecto}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* CERTIFICACIONES */}
                <div className="mb-6">
                    <h3 className="font-semibold border-b mb-2">
                        Certificaciones
                    </h3>

                    {/* encabezado */}
                    <div className="grid grid-cols-[1fr_150px] gap-2 text-sm font-semibold border-b pb-1 mb-2">
                        <span>Información</span>
                        <span>Estado</span>
                    </div>

                    {detalle.certificaciones.map((c, i) => {

                        const tipo = c.tipo?.toUpperCase();

                        let color = "bg-gray-400";

                        if (tipo === "VIGENTE") color = "bg-green-500";
                        if (tipo === "POR VENCER") color = "bg-yellow-500";
                        if (tipo === "VENCIDA") color = "bg-red-500";

                        return (
                            <div key={i} className="grid grid-cols-[1fr_150px] gap-2 py-1 items-center border-b">

                                {/* INFORMACION */}
                                <div>
                                    {c.nombre} - {c.institucion} ({c.fecha})
                                </div>

                                {/* ESTADO */}
                                <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${color}`}></span>
                                    <span>{c.tipo}</span>
                                </div>

                            </div>
                        );
                    })}
                </div>

                {/* TITULOS */}
                <div className="mb-4">
                    <h3 className="font-semibold border-b mb-2">
                        Títulos
                    </h3>

                    <ul className="list-disc pl-5">
                        {detalle.titulos.map((t, i) => (
                            <li key={i}>
                                {t.nombre} - {t.institucion} ({t.fecha})
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="text-right">
                    <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>

            </div>

        </div>
    );
}