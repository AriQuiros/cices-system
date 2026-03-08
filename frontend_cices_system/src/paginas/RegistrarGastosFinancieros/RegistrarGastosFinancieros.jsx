import React, {useState, useEffect, useContext} from "react";
import GastosAsignados from "../presupuesto/ConsultaGastos";
import { DetalleGastos } from "../../services/ReportesService";
import { GastosService } from "../../services/GastosService";
import { notify } from "../../utils/estilo/notify.jsx";
import {cargarProyectos} from "../../services/ProyectoService.jsx";
import {AppContext} from "../../context/AppContext.jsx";
import {PresupuestoDTO} from "../../modelos/presupuestoDTO.jsx";

const RegistroGastos = () => {
    const { token } = useContext(AppContext);

    const [proyectos, setProyectos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showList, setShowList] = useState(false);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [presupuestos, setPresupuestos] = useState([]);
    const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);

    const [nuevoGasto, setNuevoGasto] = useState({monto:0, fecha:"", descripcion:""});

    useEffect(() => {
        cargarProyectos(token, true).then(setProyectos)
    }, [token]);

    const handleSelectProyecto = (p) => {
        setProyectoSeleccionado(p);
        setSearchTerm(p.codigo);
        setShowList(false);
        cargarPresupuestos(p.codigo);
        setPresupuestoSeleccionado(null);
    }

    const cargarPresupuestos = async (codigoProyecto) => {
        try {
            const data = await DetalleGastos.obtenerPorProyecto(codigoProyecto);
            setPresupuestos(data);
        } catch(e) {
            notify.error("Error cargando presupuestos del proyecto");
        }
    }

    const handleSelectPresupuesto = (p) => {
        setPresupuestoSeleccionado(p);
    }

    const handleCampoGasto = (e) => {
        const { name, value } = e.target;
        setNuevoGasto({...nuevoGasto, [name]: value});
    }

    const handleRegistrarGasto = async () => {
        if(!presupuestoSeleccionado || !proyectoSeleccionado) {
            notify.warning("Seleccione proyecto y presupuesto");
            return;
        }

        // Crear objeto GastosDTO
        const gastoDTO = {
            presupuesto: {...PresupuestoDTO, ...presupuestoSeleccionado},
            monto: parseFloat(nuevoGasto.monto),
            descripcion: nuevoGasto.descripcion,
            fecha: nuevoGasto.fecha
        };
        console.log("Enviando GastoDTO:", JSON.stringify(gastoDTO));
        try {
            await GastosService.registrarGasto(proyectoSeleccionado.codigo, gastoDTO);
            notify.success("Gasto registrado correctamente");

            // Actualizar listado local
            const updatedPresupuesto = {
                ...presupuestoSeleccionado,
                gastos: [...(presupuestoSeleccionado.gastos || []), gastoDTO]
            };
            setPresupuestoSeleccionado(updatedPresupuesto);

            // Limpiar formulario
            setNuevoGasto({monto:0, descripcion:"", fecha:""});

        } catch(e) {
            notify.error("Error registrando gasto");
        }
    }

    const proyectosFiltrados = proyectos.filter(p =>
        p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>

            {/* PANEL IZQUIERDO: Búsqueda y registro */}
            <div>
                <h3>Buscar proyecto</h3>
                <input
                    type="text"
                    placeholder="Buscar código o nombre..."
                    value={searchTerm}
                    onChange={e=>{setSearchTerm(e.target.value); setShowList(true)}}
                    onFocus={()=>setShowList(true)}
                />
                {showList && searchTerm && proyectosFiltrados.map(p=>(
                    <div key={p.codigo} onClick={()=>handleSelectProyecto(p)}>
                        {p.codigo} - {p.nombre}
                    </div>
                ))}

                {presupuestos.length > 0 && (
                    <>
                        <h4>Seleccione presupuesto</h4>
                        <select
                            value={presupuestoSeleccionado?.categoria || ""}
                            onChange={e=>{
                                const p = presupuestos.find(p=>p.categoria===e.target.value);
                                handleSelectPresupuesto(p);
                            }}
                        >
                            <option value="">--Seleccione--</option>
                            {presupuestos.map(p=>(
                                <option key={p.categoria} value={p.categoria}>
                                    {p.categoria} - {p.descripcion}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {presupuestoSeleccionado && (
                    <>
                        <h4>Registrar nuevo gasto</h4>
                        <input type="number" name="monto" placeholder="Monto" value={nuevoGasto.monto} onChange={handleCampoGasto}/>
                        <input type="date" name="fecha" value={nuevoGasto.fecha} onChange={handleCampoGasto}/>
                        <input type="text" name="descripcion" placeholder="Descripción" value={nuevoGasto.descripcion} onChange={handleCampoGasto}/>
                        <button onClick={handleRegistrarGasto}>Registrar gasto</button>
                    </>
                )}
            </div>

            {/* PANEL DERECHO: Gastos asignados */}
            <div>
                <GastosAsignados presupuesto={presupuestoSeleccionado} />
            </div>

        </div>
    );
}

export default RegistroGastos;