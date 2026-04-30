import React, {useContext, useEffect, useState} from "react";
import { useProyecto } from "../../../context/proyectoCtx/UseProyecto.jsx";
import { registrarProyecto } from "../../../services/ProyectoService.jsx";
import { notify } from "../../../utils/ui/notify.jsx";
import { AppContext } from "../../../context/AppContext.jsx";
import { ProyectoDTO } from "../../../modelos/proyectoDTO.jsx";
import "../../../estilos/form.css"

import "./RegistroProyecto.css";

import GestionPresupuesto from "../../presupuesto/registro/GestionPresupuesto.jsx";
import VincularInvestigador from "./VincularInvestigador.jsx";

import ProyectoDatosBasicos from "./ProyectoDatosBasicos.jsx";
import ProyectoObjetivos from "./ProyectosObjetivos.jsx";
import ProyectoEntidades from "./EntidadesProyecto.jsx";
import ProyectoInformes from "./InformesProyectos.jsx";
import ProyectoDocumentos from "./DocumentosProyectos.jsx";
import BuscadorProyecto from "../../../components/ui/busqueda/BusquedaProyecto.jsx";
import BotonVolver from "../../../components/BotonVolver";
import {obtenerProyectoPorId} from "../../../services/ReportesService.jsx";
import ProyectoDetalles from "./ProyectoDetalles.jsx";
import {confirm} from "../../../utils/ui/confirm.jsx";

function RegistroProyecto({ editable = false }) {

    const { token, user } = useContext(AppContext);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const {
        proyecto,
        establecerProyecto,
        limpiarProyecto,
        limpiarPresupuestoActual
    } = useProyecto();

    useEffect(() => {
        limpiarProyecto();
        limpiarPresupuestoActual();
        setProyectoSeleccionado(null)
    }, [editable]);


    // (los dejo por si los usas luego)
    const [showPresupuesto, setShowPresupuesto] = useState(false);
    const [showAsignarInvestigador, setShowAsignarInvestigador] = useState(false);

    const agruparEntidades = (lista = []) => {

        const resultado = {
            instituciones: [],
            unidades: [],
            sitios: []
        };

        lista.forEach(e => {

            const tipo = e?.tipo?.valor?.toUpperCase();

            if (tipo === "INSTITUCION") {
                resultado.instituciones.push(e);
            }

            if (tipo === "UNIDAD") {
                resultado.unidades.push(e);
            }

            if (tipo === "SITIO") {
                resultado.sitios.push(e);
            }

        });

        if (resultado.instituciones.length === 0) resultado.instituciones.push({ nombre: "" });
        if (resultado.unidades.length === 0) resultado.unidades.push({ nombre: "" });
        if (resultado.sitios.length === 0) resultado.sitios.push({ nombre: "" });

        return resultado;
    };

    const normalizarDocumentos = (docs = []) => {
        return docs.map(d => ({
            id: d.id,
            name: d.nombreDocumento,
            size: 0,
            url: d.url,
            esNuevo: false
        }));
    };

    const seleccionarProyecto = async (proyecto) => {
        if (!proyecto) {
            setProyectoSeleccionado(null);
            limpiarProyecto();
            return;
        }

        setProyectoSeleccionado(proyecto);

        try {
            const data = await obtenerProyectoPorId(proyecto.codigoProyecto, token);

            establecerProyecto({
                ...data,

                entidadesVinculadas: agruparEntidades(data.entidadesVinculadas),

                // proteger otros arrays
                objetivosEspecificos: data.objetivosEspecificos || [],
                documentos: normalizarDocumentos(data.documentos) || [],
                presentacionesInformes: data.presentacionesInformes || []
            });
        } catch {
            notify.error("Error cargando proyecto completo");
        }
    };

    // ================== LIMPIAR ==================
    const handleClear = () => {
        limpiarProyecto();
        limpiarPresupuestoActual();
        setShowPresupuesto(false);
    };

    // ================== SUBMIT ==================

    function obtenerInformesValidos(informes) {
        return (informes || []).filter(
            informe => informe.tipoInforme?.valor && informe.fechaPresentacion
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editable) {
            const ok = await confirm.update();
            if (!ok) return;
        }

        const entidadesVinculadasFormateadas = [
            ...(proyecto.entidadesVinculadas?.unidades || [])
                .filter(e => e.nombre)
                .map(e => ({ id: e.id, nombre: e.nombre.trim(), tipo: e.tipo })),

            ...(proyecto.entidadesVinculadas?.instituciones || [])
                .filter(e => e.nombre)
                .map(e => ({ id: e.id, nombre: e.nombre.trim(), tipo: e.tipo })),

            ...(proyecto.entidadesVinculadas?.sitios || [])
                .filter(e => e.nombre)
                .map(e => ({ id: e.id, nombre: e.nombre.trim(), tipo: e.tipo })),
        ];

        const proyectoFinal = {
            ...ProyectoDTO,
            ...proyecto,
            entidadesVinculadas: entidadesVinculadasFormateadas,
            presentacionesInformes: obtenerInformesValidos(proyecto.presentacionesInformes) || []
        };
console.log(proyectoFinal)
        try {
            await registrarProyecto(proyectoFinal, token);

            notify.success(
                editable
                    ? "Proyecto actualizado correctamente"
                    : "Proyecto registrado exitosamente"
            );

            if (!editable) handleClear();

        } catch (err) {
            const message =
                err?.error ||
                err?.message ||
                err?.data?.error ||
                "Error al procesar el proyecto";

            notify.error(message);
        }
    };

    // ================== UI ==================
    return (
        <div className={`form-container ${editable ? "actualizar-proyecto-page" : "registro-proyecto-page"}`}>

            <div className={editable ? "actualizar-proyecto-card" : "registro-proyecto-card"}>

            {editable && !proyectoSeleccionado && (
                <div className="actualizar-proyecto-search">
                    <BuscadorProyecto
                        token={token}
                        user={user}
                        principal={true}
                        onSelect={seleccionarProyecto}
                    />
                </div>
            )}

            {/* 🔹 FORMULARIO */}
            {(!editable || proyectoSeleccionado) && (

                <form className={`form-content ${editable ? "actualizar-proyecto-form" : "registro-proyecto-form"}`} onSubmit={handleSubmit}>

                    <BotonVolver/>

                    <h2 className={editable ? "actualizar-proyecto-title" : "registro-proyecto-title"}>
                        {editable ? "Editar Proyecto" : "Registrar Proyecto"}
                    </h2>

                    {/* 🔹 COMPONENTES */}
                    <ProyectoDatosBasicos editable={editable} />
                    <ProyectoObjetivos editable={editable} />
                    <ProyectoEntidades editable={editable} />
                    <ProyectoInformes editable={editable} />
                    <ProyectoDocumentos editable={editable} />
                    <ProyectoDetalles editable={editable} />
                    <button type="submit" className="submit-btn">
                        {editable ? "Actualizar Proyecto" : "Registrar Proyecto"}
                    </button>

                </form>
            )}

            {showPresupuesto && <GestionPresupuesto />}
            {showAsignarInvestigador && <VincularInvestigador />}

            </div>

        </div>
    );
}

export default RegistroProyecto;