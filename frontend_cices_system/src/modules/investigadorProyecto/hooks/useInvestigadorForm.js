import {useEffect, useMemo, useState} from "react";
import { notify } from "../../../utils/ui/notify.jsx";
import { useBuscarInvestigadores } from "../../investigador/hooks/queries/useBuscarInvestigadores.js";

const formularioVacio = {
    id: null,
    investigador: null,
    rolProyecto: null,
    actividadProyecto: "",
    fechaInicio: "",
    fechaFin: "",
    search: ""
};

export const useInvestigadorForm = ({ investigadorSeleccionado, proyecto, investigadoresRegistrados = [], onSubmit, isEditing = false, onClearSelection }) => {
    const [investigadoresForm, setInvestigadoresForm] = useState([{ ...formularioVacio }]);
    const [filaBuscando, setFilaBuscando] = useState(null);
    // loading flag kept for potential UI use
    const [loadingInvestigador] = useState(false);

    useEffect(() => {
        if (!investigadorSeleccionado) return;

        setInvestigadoresForm([{
            id: investigadorSeleccionado.id,
            investigador: {
                identificacion: investigadorSeleccionado.identificacionInvestigador,
                nombreCompleto: investigadorSeleccionado.nombreInvestigador
            },
            rolProyecto: investigadorSeleccionado.rolProyecto || null,
            actividadProyecto: investigadorSeleccionado.actividadProyecto || "",
            fechaInicio: investigadorSeleccionado.fechaInicio || "",
            fechaFin: investigadorSeleccionado.fechaFin || "",
            search: investigadorSeleccionado.nombreInvestigador
        }]);

    }, [investigadorSeleccionado]);

    // Debounce the search input and use the shared query hook
    const [debouncedTexto, setDebouncedTexto] = useState("");
    const busquedaQuery = useBuscarInvestigadores(proyecto ? debouncedTexto : "");

    useEffect(() => {
        if (filaBuscando === null) {
            setDebouncedTexto("");
            return;
        }

        const texto = investigadoresForm[filaBuscando]?.search;
        if (!texto) {
            setDebouncedTexto("");
            return;
        }

        const timeout = setTimeout(() => setDebouncedTexto(texto), 300);
        return () => clearTimeout(timeout);
    }, [investigadoresForm, filaBuscando]);

    const candidatos = useMemo(() => {
        if (!proyecto || filaBuscando === null) return [];

        const res = busquedaQuery.data || [];

        return res.filter(inv => {
            const registrados = investigadoresRegistrados.some(
                reg => reg.identificacion === inv.identificacion
            );

            const agregadosForm = investigadoresForm.some(
                f => f.investigador?.identificacion === inv.identificacion
            );

            return !registrados && !agregadosForm;
        });

    }, [busquedaQuery.data, investigadoresForm, investigadoresRegistrados, proyecto, filaBuscando]);

    const actualizarCampo = (index, campo, valor) => {
        const copia = [...investigadoresForm];
        copia[index][campo] = valor;
        setInvestigadoresForm(copia);
    };

    const agregarFila = () => setInvestigadoresForm(prev => [...prev, { ...formularioVacio }]);
    const eliminarFila = (index) => setInvestigadoresForm(prev => prev.filter((_, i) => i !== index));

    const seleccionarInvestigadorSelect = (index, inv) => {
        if (!inv) return;
        const copia = [...investigadoresForm];
        copia[index].investigador = inv;
        copia[index].search = inv.nombreCompleto;
        setInvestigadoresForm(copia);
    };

    const limpiar = () => setInvestigadoresForm([{ ...formularioVacio }]);

    const handleSubmit = async () => {
        if (!proyecto) {
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

        const lista = investigadoresForm.map(f => ({
            id: f.id,
            identificacionInvestigador: f.investigador.identificacion,
            nombreInvestigador: f.investigador.nombreCompleto,
            codigoProyecto: proyecto.codigoProyecto,
            rolProyecto: f.rolProyecto,
            actividadProyecto: f.actividadProyecto,
            fechaInicio: f.fechaInicio,
            fechaFin: f.fechaFin
        }));

        await onSubmit(lista);

        // If we were editing, notify the parent to clear the selection so
        // that `isEditing` becomes false in the parent/component tree.
        if (isEditing && typeof onClearSelection === "function") {
            try {
                onClearSelection();
            } catch (e) {
                // ignore errors from parent callback
            }
        }

        limpiar();
    };

    return {
        investigadoresForm,
        actualizarCampo,
        agregarFila,
        eliminarFila,
        handleSubmit,
        candidatos,
        setFilaBuscando,
        seleccionarInvestigadorSelect,
        loadingInvestigador,
        limpiar
    };
};

