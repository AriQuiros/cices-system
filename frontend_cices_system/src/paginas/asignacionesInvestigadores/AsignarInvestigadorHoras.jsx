import { useState, useRef } from "react";
import AsignarInvestigadores from "./AsignarInvestigadores.jsx";
import GestionHoras from "../presupuesto/horas/GestionHoras.jsx";
import BuscadorProyecto from "../../components/ui/busqueda/BusquedaProyecto.jsx"; // <- import

import { useContext } from "react";
import { AppContext } from "../../context/AppContext.jsx";

export default function WizardAsignacion() {
    const { token } = useContext(AppContext);
    const containerRef = useRef(null);

    const [paso, setPaso] = useState(1);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    const scrollToTop = () => {
        // Si se dispone del header fijo, compensa su altura para que el formulario quede visible
        const doc = document.scrollingElement || document.documentElement;
        const header = document.querySelector("header");
        const headerHeight = header ? header.offsetHeight : 0;

        const currentY = doc.scrollTop || window.pageYOffset || 0;

        if (containerRef.current) {
            const rectTop = containerRef.current.getBoundingClientRect().top;
            const y = rectTop + currentY - headerHeight - 16; // pequeño offset
            console.log("scrollToTop: currentY=", currentY, "targetY=", y, "headerH=", headerHeight, "rectTop=", rectTop);
            // Solo desplazarse si el destino está por encima de la posición actual (scroll hacia arriba)
            if (y + 5 < currentY) {
                (doc).scrollTo({ top: Math.max(0, y), behavior: "smooth" });
            }
            return;
        }

        // Si no hay contenedor, subir al principio solo si podemos subir
        if (currentY > 5) {
            (doc).scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const pasos = [
        { id: 1, label: "Seleccionar proyecto" },
        { id: 2, label: "Asignar investigadores" },
        { id: 3, label: "Asignar horas" },
    ];

    return (
        <div className="max-w-5xl mx-auto p-6 relative z-0" ref={containerRef}>
            <h2 className="text-2xl font-bold mb-6 relative z-0">Asignar Investigadores y Horas</h2>

            {/* Burbujas de pasos */}
            <div className="flex justify-between items-center mb-8">
                {pasos.map((p, idx) => (
                    <div key={p.id} className="flex-1 flex flex-col items-center relative">
                        <button
                            className={`
                w-10 h-10 rounded-full flex items-center justify-center mb-2
                ${paso === p.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}
                ${p.id > 1 && !proyectoSeleccionado ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-400"}
              `}
                            disabled={p.id > 1 && !proyectoSeleccionado}
                            onClick={() => setPaso(p.id)}
                        >
                            {p.id}
                        </button>
                        <span className="text-sm text-center">{p.label}</span>
                        {idx < pasos.length - 1 && (
                            <div
                                className={`absolute top-4 left-1/2 w-full h-1 -translate-x-1/2 bg-gray-300 ${
                                    paso > p.id ? "bg-blue-600" : ""
                                }`}
                                style={{ zIndex: -1 }}
                            ></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Contenido de pasos */}
            <div className="space-y-6">
                {paso === 1 && (
                    <div className="p-4 border rounded-lg shadow-sm bg-white">
                        <h3 className="font-semibold mb-4">Paso 1: Seleccionar proyecto</h3>

                        {/* Buscador real de proyectos */}
                        <BuscadorProyecto onSelect={setProyectoSeleccionado} />

                        {proyectoSeleccionado && (
                            <div className="mt-4 p-2 bg-gray-100 rounded border">
                                <strong>Proyecto seleccionado:</strong> {proyectoSeleccionado.nombre} ({proyectoSeleccionado.codigoProyecto})
                            </div>
                        )}

                        <button
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                            disabled={!proyectoSeleccionado}
                            onClick={() => setPaso(2)}
                        >
                            Continuar
                        </button>
                    </div>
                )}

                {paso === 2 && (
                    <div className="p-4 border rounded-lg shadow-sm bg-white">
                        <h3 className="font-semibold mb-4">Paso 2: Asignar investigadores</h3>
                        <AsignarInvestigadores proyectoSeleccionado={proyectoSeleccionado} onEdit={scrollToTop} />
                        <div className="flex justify-between mt-4">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setPaso(1)}
                            >
                                Volver
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                                onClick={() => setPaso(3)}
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                )}

                {paso === 3 && (
                    <div className="p-4 border rounded-lg shadow-sm bg-white">
                        <h3 className="font-semibold mb-4">Paso 3: Asignar horas</h3>
                        <GestionHoras proyectoInicial={proyectoSeleccionado} mostrarSelectorProyecto={false} onEdit={scrollToTop} />
                        <button
                            className="mt-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => setPaso(2)}
                        >
                            Volver
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}