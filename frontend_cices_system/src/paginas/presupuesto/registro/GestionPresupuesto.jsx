import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext.jsx";
import { notify } from "../../../utils/ui/notify.jsx";

import BuscadorProyecto from "../../../components/BusquedaProyecto.jsx";

import { fetchTiposCatalogo } from "../../../services/CatalogoService.js";
import { obtenerPresupuestosProyecto, registrarPresupuestos, actualizarPresupuesto } from "../../../services/PresupuestoService.jsx";

import PresupuestoForm from "./PresupuestoForm.jsx";
import PresupuestoList from "./PresupuestoList.jsx";
import "../../../styles/paginas.css";

function GestionPresupuestos({modoRegistro = false, proyecto: proyectoProp, onClose, onSave}) {
    const { token } = useContext(AppContext);

    const [proyecto, setProyecto] = useState(proyectoProp || null);

    const [tipos, setTipos] = useState({});
    const [presupuestosExistentes, setPresupuestosExistentes] = useState([]);
    const [presupuestosForm, setPresupuestosForm] = useState([]);
    const [editandoIndex, setEditandoIndex] = useState(null);

    useEffect(() => {
        fetchTiposCatalogo(
            token,
            ["TIPO_PRESUPUESTO", "CATEGORIA_PRESUPUESTO", "FUENTE_FINANCIAMIENTO"]
        )
            .then(setTipos)
            .catch(() => notify.error("Error cargando catálogos"));
    }, [token]);

    // 🔹 seleccionar proyecto (modo independiente)
    function seleccionarProyecto(p) {
        if (!p) {
            setProyecto(null);
            setPresupuestosExistentes([]);
            return;
        }

        setProyecto(p);
    }

    // 🔹 cargar presupuestos existentes
    useEffect(() => {

        if (!proyecto?.codigoProyecto) return;
        if (modoRegistro) return;

        obtenerPresupuestosProyecto(token, proyecto.codigoProyecto)
            .then(data => setPresupuestosExistentes(data || []))
            .catch(() => notify.error("Error cargando presupuestos"));

    }, [proyecto?.codigoProyecto]);


    useEffect(() => {

        setPresupuestosForm([]);
        setEditandoIndex(null);

    }, [proyecto?.codigoProyecto]);
    // 🔹 helpers form
    function setByPathLocal(path, value) {
        setPresupuestosForm(prev => {
            const copia = structuredClone(prev);
            let ref = copia;

            for (let i = 1; i < path.length - 1; i++) {
                ref = ref[path[i]];
            }

            ref[path[path.length - 1]] = value;
            return copia;
        });
    }

    function addPresupuesto() {
        setPresupuestosForm(prev => [...prev, {}]);
        setEditandoIndex(null);
    }

    function removePresupuesto(index) {
        setPresupuestosForm(prev => prev.filter((_, i) => i !== index));
    }

    function editarPresupuesto(pres) {
        setPresupuestosForm([pres]);
        setEditandoIndex(0);
    }

    async function guardar() {

        if (!proyecto?.codigoProyecto) {
            notify.warning("Seleccione proyecto");
            return;
        }

        if (modoRegistro) {
            onSave(presupuestosForm);
            return;
        }

        try {

            if (editandoIndex !== null) {

                const presupuesto = presupuestosForm[0];

                await actualizarPresupuesto(token, presupuesto);

                notify.success("Actualizado");

            } else {

                await registrarPresupuestos(token, {
                    ...proyecto,
                    presupuestos: presupuestosForm
                });

                notify.success("Guardado");
            }

            const nuevos = await obtenerPresupuestosProyecto(token, proyecto.codigoProyecto);
            setPresupuestosExistentes(nuevos || []);

            setPresupuestosForm([]);
            setEditandoIndex(null);

        } catch {
            notify.error("Error guardando");
        }
    }

    return (

        <div className="registro-presupuesto-page">

            <div className="registro-presupuesto-card">

            <h2 className="registro-presupuesto-title">Gestion de presupuestos</h2>

            {!modoRegistro && (
                <div className="registro-presupuesto-search">
                    <BuscadorProyecto
                        token={token}
                        onSelect={seleccionarProyecto}
                    />
                </div>
            )}

            {proyecto && (

                <div className="registro-presupuesto-content">

                    <button className="btn-accion secundario" type="button" onClick={() => {
                        setEditandoIndex(null);
                        setPresupuestosForm([{}]);
                    }}>
                        Limpiar formulario
                    </button>

                    {editandoIndex === null && <p className="registro-presupuesto-status">Agregando presupuestos</p>}

                    <PresupuestoForm
                        proyecto={proyecto}
                        tipos={tipos}
                        presupuestos={presupuestosForm}
                        presupuestosExistentes={presupuestosExistentes}
                        setByPath={setByPathLocal}
                        addPresupuesto={addPresupuesto}
                        removeByPath={(_, idx) => removePresupuesto(idx)}
                        editando={editandoIndex !== null}
                        onSubmit={guardar}
                    />

                    {editandoIndex !== null && (
                        <div className="registro-presupuesto-editing">
                            <p className="registro-presupuesto-status">Editando un presupuesto</p>

                            <button className="btn-accion secundario" type="button" onClick={() => {
                                setPresupuestosForm([]);
                                setEditandoIndex(null);
                            }}>
                                Cancelar edición
                            </button>
                        </div>
                    )}

                    <div className="registro-presupuesto-actions">
                        <button className="btn-accion primario" form="formPresupuesto" type="submit">
                            Guardar
                        </button>

                        {onClose && <button className="btn-accion" type="button" onClick={onClose}>Cerrar</button>}
                    </div>

                    {!modoRegistro && (
                        <PresupuestoList
                            presupuestos={presupuestosExistentes}
                            onEditar={editarPresupuesto}
                        />
                    )}

                </div>

            )}

            </div>

        </div>

    );
}

export default GestionPresupuestos;