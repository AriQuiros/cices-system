import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { cargarProyectos } from "../../services/ProyectoService.jsx";

import AsignarInvestigador from "./AsignarInvestigador.jsx";
import AsignarHoras from "./AsignarHoras.jsx";

export default function AsignarInvestigadorHoras() {

    const { token } = useContext(AppContext);

    const [paso, setPaso] = useState(1);

    const [proyectos, setProyectos] = useState([]);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    useEffect(() => {
        obtenerProyectos();
    }, []);

    const obtenerProyectos = async () => {
        try {
            const data = await cargarProyectos(token, true);
            setProyectos(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const seleccionarProyecto = (p) => {
        setProyectoSeleccionado(p);
    };

    return (
        <div>

            <h2>Asignar Investigadores y Horas</h2>

            {/* PASOS */}
            <div>

                <button type="button" onClick={() => setPaso(1)}>
                    <span>1</span>
                    <span>Seleccionar proyecto</span>
                </button>

                <button
                    type="button"
                    disabled={!proyectoSeleccionado}
                    onClick={() => setPaso(2)}
                >
                    <span>2</span>
                    <span>Asignar investigadores</span>
                </button>

                <button
                    type="button"
                    disabled={!proyectoSeleccionado}
                    onClick={() => setPaso(3)}
                >
                    <span>3</span>
                    <span>Asignar horas</span>
                </button>

            </div>


            {/* PASO 1 */}
            {paso === 1 && (

                <section>

                    <h3>Paso 1: Seleccionar proyecto</h3>

                    <input
                        type="text"
                        placeholder="Filtrar por código o nombre"
                    />

                    <div>

                        {proyectos.map((p) => (
                            <div
                                key={`${p.codigo}-${p.nombre}`}
                                onClick={() => seleccionarProyecto(p)}
                            >
                                <b>{p.codigo}</b> - {p.nombre}
                            </div>
                        ))}

                    </div>

                    <button
                        type="button"
                        disabled={!proyectoSeleccionado}
                        onClick={() => setPaso(2)}
                    >
                        Continuar
                    </button>

                </section>
            )}


            {/* PASO 2 */}
            {paso === 2 && (

                <section>

                    <h3>Paso 2: Asignar investigadores</h3>

                    <AsignarInvestigador
                        codigoProyecto={proyectoSeleccionado?.codigo}
                        esconder={true}
                    />

                    <div>

                        <button
                            type="button"
                            onClick={() => setPaso(1)}
                        >
                            Volver
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaso(3)}
                        >
                            Continuar
                        </button>

                    </div>

                </section>
            )}


            {/* PASO 3 */}
            {paso === 3 && (

                <section>

                    <h3>Paso 3: Asignar horas</h3>

                    <AsignarHoras
                        proyectoInicial={proyectoSeleccionado}
                        mostrarSelectorProyecto={false}
                    />

                    <button
                        type="button"
                        onClick={() => setPaso(2)}
                    >
                        Volver
                    </button>

                </section>
            )}


            {/* RESULTADO */}
            <section>

                <h3>Resultado actual</h3>

                <pre>
                    {JSON.stringify(proyectoSeleccionado, null, 2)}
                </pre>

            </section>

        </div>
    );
}