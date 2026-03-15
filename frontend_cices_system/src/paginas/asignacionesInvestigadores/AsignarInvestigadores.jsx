import React, { useContext, useEffect, useState } from "react";
import { notify } from "../../utils/ui/notify.jsx";
import { confirm } from "../../utils/ui/confirm.jsx";
import { AppContext } from "../../context/AppContext.jsx";

import { obtenerInvestigadoresActivos } from "../../services/InvestigadorService.jsx";
import { obtenerRolesProyecto } from "../../services/RolService.jsx";
import { InvestigadorProyectoService } from "../../services/InvestigadorProyectoService.jsx";
import { obtenerInvestigadoresProyecto } from "../../services/ReportesService.jsx";
import InputField from "../../utils/validaciones/InputField.jsx";
import {fechaMayorIgualQue, fechaMenorIgualQue, required} from "../../utils/validaciones/Validators.jsx";
import Select from "react-select";
import BuscadorProyecto from "../../components/BusquedaProyecto.jsx";

const formularioVacio = {
    id: null,
    investigador: null,
    rolProyecto: null,
    actividadProyecto: "",
    fechaInicio: "",
    fechaFin: "",
    search: ""
};

const AsignarInvestigadores = () => {

    const {token} = useContext(AppContext);

    const [roles, setRoles] = useState([]);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    const [filaBuscando, setFilaBuscando] = useState(null);
    const [candidatos, setCandidatos] = useState([]);

    const [investigadoresRegistrados, setInvestigadoresRegistrados] = useState([]);

    const [investigadoresForm, setInvestigadoresForm] = useState([{...formularioVacio}]);

    const [investigadorEditando, setInvestigadorEditando] = useState(null);

    useEffect(() => {

        if (filaBuscando === null) return;

        const texto = investigadoresForm[filaBuscando]?.search;

        if (!texto) return;

        const timeout = setTimeout(async () => {

            try {
                obtenerRolesProyecto(token).then(setRoles);

                const res = await obtenerInvestigadoresActivos(token, texto);

                const filtrados = (res || []).filter(inv => {
                    const registrados = investigadoresRegistrados.some(
                        reg => reg.identificacionInvestigador === inv.identificacion
                    );
                    const agregadosForm = investigadoresForm.some(
                        f => f.investigador?.identificacion === inv.identificacion
                    );
                    return !registrados && !agregadosForm;
                });

                setCandidatos(filtrados);

            } catch {

                setCandidatos([]);

            }

        }, 300);

        return () => clearTimeout(timeout);

    }, [investigadoresForm, filaBuscando, token]);

    const seleccionarProyecto = async (p) => {
        if (!p) {
            setProyectoSeleccionado(null);
            return;
        }
        setProyectoSeleccionado(p);

        try {

            const lista = await obtenerInvestigadoresProyecto(p.codigoProyecto, token);
            setInvestigadoresRegistrados(lista || []);

        } catch {

            notify.error("Error cargando investigadores");

        }

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

    function limpiar(){
        setInvestigadorEditando(null);
        setInvestigadoresForm([{...formularioVacio}]);
    }

    const cancelarEdicion = () => {
        limpiar()
    };

    const eliminarInvestigadorRegistrado = async (inv) => {

        if (!(await confirm.delete("¿Eliminar investigador del proyecto?"))) return;

        try {

            await InvestigadorProyectoService.eliminarInvestigador(inv.id, token);

            setInvestigadoresRegistrados(prev =>
                prev.filter(i => i.id !== inv.id)
            );

            limpiar()

            notify.success("Investigador eliminado");

        }  catch (error) {

            notify.error(error.message || "Error eliminando investigador");

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
                if (!(await confirm.update())) return;

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

            limpiar()

        } catch {

            notify.error("Error guardando investigador");

        }

    };

    const rolesParaAsignar =
        investigadoresRegistrados.some(
            inv => inv.rolProyecto?.nombreRolProyecto === "PRINCIPAL"
        ) ||
        investigadoresForm.some(
            f => f.rolProyecto?.nombreRolProyecto === "PRINCIPAL"
        );

    const opcionesCandidatos = candidatos.map(inv => ({
        value: inv,
        label: inv.nombreCompleto
    }));
    const seleccionarInvestigadorSelect = (index, selectedOption) => {
        if (!selectedOption) return;

        const inv = selectedOption.value;
        const copia = [...investigadoresForm];

        copia[index].investigador = inv;
        copia[index].search = inv.nombreCompleto;

        setInvestigadoresForm(copia);
        setCandidatos([]); // limpiar candidatos
    };

    return (

        <div>

            {!proyectoSeleccionado && (
                <BuscadorProyecto token={token} onSelect={seleccionarProyecto} />
            )}

            {proyectoSeleccionado && (

                <div>
                    <h3>Agregar investigadores</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        guardarInvestigadores();
                    }}>
                    {investigadoresForm.map((fila, index) => (

                        <div key={index}>

                            <Select
                                required
                                placeholder="Buscar investigador..."
                                value={fila.investigador ? { value: fila.investigador, label: fila.investigador.nombreCompleto } : null}
                                options={opcionesCandidatos}
                                onInputChange={(inputValue) => {
                                    actualizarCampo(index, "search", inputValue);
                                    setFilaBuscando(index);
                                }}
                                onChange={(selectedOption) => seleccionarInvestigadorSelect(index, selectedOption)}
                                isClearable
                                noOptionsMessage={() => "No hay coincidencias"}
                                isSearchable
                                isDisabled={investigadorEditando}
                            />

                            <Select
                                placeholder="Rol"
                                value={fila.rolProyecto ? { value: fila.rolProyecto, label: fila.rolProyecto.nombreRolProyecto } : null}
                                options={roles.map(r => ({
                                    value: r,
                                    label: r.nombreRolProyecto,
                                    isDisabled: r.nombreRolProyecto === "PRINCIPAL" && rolesParaAsignar && !investigadorEditando
                                }))}
                                onChange={(selectedOption) => actualizarCampo(index, "rolProyecto", selectedOption?.value)}
                                isSearchable
                                isClearable={false} // para que siempre haya un rol seleccionado
                                required
                            />

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

                        <button type="button" onClick={agregarFila}>+ Agregar investigador</button>
                        <button type="submit">{investigadorEditando ? "Actualizar" : "Guardar"}</button>
                    </form>

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

export default AsignarInvestigadores;