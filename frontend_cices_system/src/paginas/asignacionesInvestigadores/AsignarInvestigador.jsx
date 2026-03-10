import React, { useContext, useEffect, useMemo, useState } from "react";
import { notify } from "../../utils/estilo/notify.jsx";
import { AppContext } from "../../context/AppContext.jsx";

import { cargarProyectos } from "../../services/ProyectoService.jsx";
import { obtenerInvestigadoresActivos } from "../../services/InvestigadorService.jsx";
import { obtenerRolesProyecto } from "../../services/RolService.jsx";
import { InvestigadorProyectoService } from "../../services/InvestigadorProyectoService.jsx";
import { obtenerInvestigadoresProyecto } from "../../services/ReportesService.jsx";
import InputField from "../../utils/validaciones/InputField.jsx";
import {fechaMayorIgualQue, fechaMenorIgualQue, required} from "../../utils/validaciones/Validators.jsx";

const formularioVacio = {
    id: null,
    investigador: null,
    rolProyecto: null,
    actividadProyecto: "",
    fechaInicio: "",
    fechaFin: "",
    search: ""
};

const VincularInvestigadores = () => {

    const {token} = useContext(AppContext);

    const [proyectos, setProyectos] = useState([]);
    const [roles, setRoles] = useState([]);

    const [searchProyecto, setSearchProyecto] = useState("");
    const [showList, setShowList] = useState(false);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    const [filaBuscando, setFilaBuscando] = useState(null);
    const [candidatos, setCandidatos] = useState([]);

    const [investigadoresRegistrados, setInvestigadoresRegistrados] = useState([]);

    const [investigadoresForm, setInvestigadoresForm] = useState([{...formularioVacio}]);

    const [investigadorEditando, setInvestigadorEditando] = useState(null);

    useEffect(() => {

        cargarProyectos(token, true).then(setProyectos);
        obtenerRolesProyecto(token).then(setRoles);

    }, [token]);

    useEffect(() => {

        if (filaBuscando === null) return;

        const texto = investigadoresForm[filaBuscando]?.search;

        if (!texto) return;

        const timeout = setTimeout(async () => {

            try {

                const res = await obtenerInvestigadoresActivos(token, texto);

                const filtrados = (res || []).filter(
                    inv => !investigadoresRegistrados.some(
                        reg => reg.identificacionInvestigador === inv.identificacion
                    )
                );

                setCandidatos(filtrados);

            } catch {

                setCandidatos([]);

            }

        }, 300);

        return () => clearTimeout(timeout);

    }, [investigadoresForm, filaBuscando, token]);

    const proyectosFiltrados = useMemo(() =>
        proyectos.filter(p =>
            p.codigoProyecto.toLowerCase().includes(searchProyecto.toLowerCase()) ||
            p.nombreProyecto.toLowerCase().includes(searchProyecto.toLowerCase())
        ), [proyectos, searchProyecto]);

    const seleccionarProyecto = async (p) => {

        setProyectoSeleccionado(p);

        setSearchProyecto(p.codigoProyecto);
        setShowList(false);

        try {

            const lista = await obtenerInvestigadoresProyecto(p.codigoProyecto, token);
            setInvestigadoresRegistrados(lista || []);

        } catch {

            notify.error("Error cargando investigadores");

        }

    };

    const seleccionarInvestigador = (index, inv) => {

        const copia = [...investigadoresForm];

        copia[index].investigador = inv;
        copia[index].search = inv.nombreCompleto;

        setInvestigadoresForm(copia);
        setCandidatos([]);

    };

    const actualizarCampo = (index, campo, valor) => {

        const copia = [...investigadoresForm];

        copia[index][campo] = valor;

        setInvestigadoresForm(copia);

    };

    const agregarFila = () => {

        setInvestigadoresForm(prev => [
            ...prev,
            {...formularioVacio}
        ]);

    };

    const eliminarFila = (index) => {

        setInvestigadoresForm(prev =>
            prev.filter((_, i) => i !== index)
        );

    };

    const editarInvestigadorRegistrado = (inv) => {

        setInvestigadorEditando(inv);

        setInvestigadoresForm([{
            id: inv.id,
            investigador: {
                identificacion: inv.identificacionInvestigador,
                nombreCompleto: inv.nombreInvestigador
            },
            rolProyecto: inv.rolProyecto,
            actividadProyecto: inv.actividadProyecto || "",
            fechaInicio: inv.fechaInicio || "",
            fechaFin: inv.fechaFin || "",
            search: inv.nombreInvestigador
        }]);

    };

    const cancelarEdicion = () => {

        setInvestigadorEditando(null);
        setInvestigadoresForm([{...formularioVacio}]);

    };

    const eliminarInvestigadorRegistrado = async (inv) => {

        if (!window.confirm("¿Eliminar investigador del proyecto?")) return;

        try {

            await InvestigadorProyectoService.eliminarInvestigador(inv.id, token);

            setInvestigadoresRegistrados(prev =>
                prev.filter(i => i.id !== inv.id)
            );

            notify.success("Investigador eliminado");

        } catch {

            notify.error("Error eliminando investigador");

        }

    };

    const guardarInvestigadores = async () => {

        if (!proyectoSeleccionado) {

            notify.warning("Seleccione proyecto");
            return;

        }

        const incompletos = investigadoresForm.some(
            f => !f.investigador || !f.rolProyecto
        );

        if (incompletos) {

            notify.warning("Complete investigador y rol");
            return;

        }

        try {

            const lista = investigadoresForm.map(f => ({

                id: f.id,
                identificacionInvestigador: f.investigador.identificacion,
                nombreInvestigador: f.investigador.nombreCompleto,
                codigoProyecto: proyectoSeleccionado.codigoProyecto,
                rolProyecto: f.rolProyecto,
                actividadProyecto: f.actividadProyecto,
                fechaInicio: f.fechaInicio,
                fechaFin: f.fechaFin

            }));

            if (investigadorEditando) {

                await InvestigadorProyectoService.actualizarInvestigador(lista[0], token);
                notify.success("Investigador actualizado");

            } else {

                await InvestigadorProyectoService.guardarInvestigadoresProyecto(lista, token);
                notify.success("Investigadores asignados con éxito");

            }

            const actualizados = await obtenerInvestigadoresProyecto(
                proyectoSeleccionado.codigoProyecto,
                token
            );

            setInvestigadoresRegistrados(actualizados || []);
            setInvestigadoresForm([{...formularioVacio}]);
            setInvestigadorEditando(null);

        } catch {

            notify.error("Error guardando investigador");

        }

    };

    return (

        <div>

            <h3>Buscar proyecto</h3>

            <InputField
                name="searchProyecto"
                placeholder="Código o nombre..."
                value={searchProyecto}
                onChange={(e) => {
                    setSearchProyecto(e.target.value);
                    setShowList(true);
                }}
                maxLength={100}
            />

            {showList && searchProyecto && proyectosFiltrados.map(p => (

                <div key={p.codigoProyecto}>

                    <button onClick={() => seleccionarProyecto(p)}>
                        {p.codigoProyecto} - {p.nombreProyecto}
                    </button>

                </div>

            ))}

            {proyectoSeleccionado && (

                <div>
                    <h2>{proyectoSeleccionado.codigoProyecto}</h2>
                    <p>{proyectoSeleccionado.fechaInicio} - {proyectoSeleccionado.fechaFinalizacion}</p>

                    <h3>Agregar investigadores</h3>

                    {investigadoresForm.map((fila, index) => (

                        <div key={index}>

                            <InputField
                                label="Investigador"
                                name={`search-${index}`}
                                placeholder="Buscar investigador"
                                value={fila.search}
                                onChange={(e) => {
                                    actualizarCampo(index, "search", e.target.value);
                                    setFilaBuscando(index);
                                }}
                                required
                                maxLength={120}
                            />

                            {filaBuscando === index && candidatos.map(c => (

                                <button
                                    key={c.identificacion}
                                    onClick={() => seleccionarInvestigador(index, c)}
                                >
                                    {c.nombreCompleto}
                                </button>

                            ))}

                            <select
                                value={fila.rolProyecto?.id || ""}
                                onChange={(e) =>
                                    actualizarCampo(
                                        index,
                                        "rolProyecto",
                                        roles.find(r => r.id === parseInt(e.target.value))
                                    )
                                }
                                required
                            >

                                <option value="">Rol</option>

                                {roles.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.nombreRolProyecto}
                                    </option>
                                ))}

                            </select>

                            <InputField
                                label="Actividad en proyecto"
                                name={`actividad-${index}`}
                                placeholder="Opcional"
                                value={fila.actividadProyecto}
                                onChange={(e) =>
                                    actualizarCampo(index, "actividadProyecto", e.target.value)
                                }
                                maxLength={500}
                            />

                            <InputField
                                label="Fecha de inicio"
                                type="date"
                                name={`fechaInicio-${index}`}
                                value={fila.fechaInicio}
                                min={proyectoSeleccionado.fechaInicio}
                                max={fila.fechaFin || proyectoSeleccionado.fechaFinalizacion}
                                required
                                onChange={(e) =>
                                    actualizarCampo(index, "fechaInicio", e.target.value)
                                }
                                rules={[required(), fechaMayorIgualQue(proyectoSeleccionado.fechaInicio),
                                fechaMenorIgualQue(proyectoSeleccionado.fechaFinalizacion)]}
                            />

                            <InputField
                                label="Fecha Fin"
                                type="date"
                                name={`fechaFin-${index}`}
                                value={fila.fechaFin}
                                min={fila.fechaInicio}
                                max={proyectoSeleccionado.fechaFinalizacion}
                                onChange={(e) =>
                                    actualizarCampo(index, "fechaFin", e.target.value)
                                }
                                rules={[fechaMayorIgualQue(proyectoSeleccionado.fechaInicio),
                                    fechaMenorIgualQue(proyectoSeleccionado.fechaFinalizacion)]}
                            />

                            {investigadorEditando ? (

                                <button onClick={cancelarEdicion}>
                                    Cancelar
                                </button>

                            ) : (

                                <button onClick={() => eliminarFila(index)}>
                                    Eliminar
                                </button>

                            )}

                        </div>

                    ))}

                    <button onClick={agregarFila}>
                        + Agregar investigador
                    </button>

                    <button onClick={guardarInvestigadores}>
                        {investigadorEditando ? "Actualizar" : "Guardar"}
                    </button>

                    <h3>Investigadores vinculados</h3>

                    <table border="1">

                        <thead>

                        <tr>
                            <th>Investigador</th>
                            <th>Rol</th>
                            <th>Actividad</th>
                            <th>Acciones</th>
                        </tr>

                        </thead>

                        <tbody>

                        {investigadoresRegistrados.map(inv => (

                            <tr key={inv.id}>

                                <td>{inv.nombreInvestigador}</td>

                                <td>{inv.rolProyecto?.nombreRolProyecto}</td>

                                <td>{inv.actividadProyecto}</td>

                                <td>

                                    <button
                                        onClick={() => editarInvestigadorRegistrado(inv)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => eliminarInvestigadorRegistrado(inv)}
                                    >
                                        Eliminar
                                    </button>

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );
}

export default VincularInvestigadores;