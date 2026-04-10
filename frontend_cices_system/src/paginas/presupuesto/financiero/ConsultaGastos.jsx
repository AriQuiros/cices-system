import React, { useContext, useMemo, useState } from "react";
import { notify } from "../../../utils/ui/notify.jsx";
import { AppContext } from "../../../context/AppContext.jsx";
import { DetalleGastos } from "../../../services/ReportesService.jsx";
import Select from "react-select";
import BuscadorProyecto from "../../../components/BusquedaProyecto.jsx";
import "./GestionGastos.css";
import BotonVolver from "../../../components/BotonVolver.jsx";
import ModalBitacora from "./ModalBitacora.jsx";

const ConsultaGastos = () => {

    const { token, user } = useContext(AppContext);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [presupuestos, setPresupuestos] = useState([]);

    const [categoriasFiltro, setCategoriasFiltro] = useState([]);

    const [ordenFechaPresupuesto, setOrdenFechaPresupuesto] = useState("desc");
    const [ordenMontoPresupuesto, setOrdenMontoPresupuesto] = useState("ninguno");

    const [ordenFechaGasto, setOrdenFechaGasto] = useState("desc");
    const [ordenMontoGasto, setOrdenMontoGasto] = useState("ninguno");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [gastoSeleccionado, setGastoSeleccionado] = useState(null);

    const seleccionarProyecto = async (proyecto) => {
        if (!proyecto) {
            setProyectoSeleccionado(null);
            return;
        }

        setProyectoSeleccionado(proyecto);

        try {
            const data = await DetalleGastos.obtenerPorProyecto(proyecto.codigoProyecto);
            setPresupuestos(data || []);
        } catch {
            notify.error("Error cargando presupuestos");
        }
    };

    const categoriasDisponibles = useMemo(() =>
            [...new Set(presupuestos.map(p => p.categoria))]
        , [presupuestos]);

    const presupuestosFiltrados = useMemo(() => {

        let lista = [...presupuestos];

        if (categoriasFiltro.length > 0) {
            lista = lista.filter(p => categoriasFiltro.includes(p.categoria));
        }

        if (ordenFechaPresupuesto === "desc") {
            lista.sort((a,b)=> new Date(b.fechaAsignacion) - new Date(a.fechaAsignacion));
        }

        if (ordenFechaPresupuesto === "asc") {
            lista.sort((a,b)=> new Date(a.fechaAsignacion) - new Date(b.fechaAsignacion));
        }

        if (ordenMontoPresupuesto === "desc") {
            lista.sort((a,b)=> b.monto - a.monto);
        }

        if (ordenMontoPresupuesto === "asc") {
            lista.sort((a,b)=> a.monto - b.monto);
        }

        return lista;

    }, [presupuestos, categoriasFiltro, ordenFechaPresupuesto, ordenMontoPresupuesto]);

    const resumenGeneral = useMemo(() => {

        const montoAsignado = presupuestos.reduce(
            (acc,p)=> acc + (p.monto || 0),0
        );

        const totalGastos = presupuestos.reduce((acc,p)=>
                acc + (p.gastos || []).reduce((a,g)=> a + (g.monto || 0),0)
            ,0);

        const cantidadGastos = presupuestos.reduce(
            (acc,p)=> acc + (p.gastos || []).length
            ,0);

        return {
            montoAsignado,
            totalGastos,
            cantidadGastos,
            restante: montoAsignado - totalGastos
        };

    }, [presupuestos]);

    const opcionesCategorias = categoriasDisponibles.map(cat => ({
        value: cat,
        label: cat
    }));

    const manejarCategoriasSelect = (selectedOptions) => {
        setCategoriasFiltro(selectedOptions ? selectedOptions.map(o => o.value) : []);
    };

    const abrirBitacora = (gasto) => {
        setGastoSeleccionado(gasto);
        setMostrarModal(true);
    };

    return (

        <div className="gestion-gastos-page">

            <div className="gestion-gastos-card">
                <BotonVolver/>

                <h2 className="gestion-gastos-title">Consulta de gastos</h2>

                <BuscadorProyecto
                    token={token}
                    user={user}
                    onSelect={seleccionarProyecto}
                />

                {proyectoSeleccionado && (

                    <div className="gestion-gastos-content">

                        <h3 className="gestion-gastos-subtitle">Resumen del proyecto</h3>

                        <div className="gestion-gastos-resumen">
                            <p>Total presupuestos: {presupuestos.length}</p>
                            <p>Total gastos registrados: {resumenGeneral.cantidadGastos}</p>
                            <p>Monto total asignado: {resumenGeneral.montoAsignado}</p>
                            <p>Total gastado: {resumenGeneral.totalGastos}</p>
                            <p className={resumenGeneral.restante < 0 ? "presupuesto-restante negativo" : "presupuesto-restante"}>
                                Presupuesto restante: {resumenGeneral.restante}
                            </p>
                        </div>

                        <h3 className="gestion-gastos-subtitle">Filtros</h3>

                        <div className="consulta-grid-filtros">

                            <div className="gasto-form-item">
                                <label>Categorías</label>
                                <Select
                                    options={opcionesCategorias}
                                    isMulti
                                    value={opcionesCategorias.filter(c => categoriasFiltro.includes(c.value))}
                                    onChange={manejarCategoriasSelect}
                                    placeholder="Seleccione categoría(s)"
                                    closeMenuOnSelect={false}
                                />
                            </div>

                        </div>

                        <h3 className="gestion-gastos-subtitle">Ordenar presupuestos</h3>

                        <div className="consulta-grid-filtros">

                            <div className="gasto-form-item">
                                <label>Fecha</label>
                                <select
                                    className="gestion-gastos-select"
                                    value={ordenFechaPresupuesto}
                                    onChange={(e)=> setOrdenFechaPresupuesto(e.target.value)}
                                >
                                    <option value="desc">Más recientes</option>
                                    <option value="asc">Más antiguos</option>
                                </select>
                            </div>

                            <div className="gasto-form-item">
                                <label>Monto</label>
                                <select
                                    className="gestion-gastos-select"
                                    value={ordenMontoPresupuesto}
                                    onChange={(e)=> setOrdenMontoPresupuesto(e.target.value)}
                                >
                                    <option value="ninguno">Sin orden</option>
                                    <option value="desc">Mayor monto</option>
                                    <option value="asc">Menor monto</option>
                                </select>
                            </div>

                        </div>

                        <h3 className="gestion-gastos-subtitle">Ordenar gastos</h3>

                        <div className="consulta-grid-filtros">

                            <div className="gasto-form-item">
                                <label>Fecha</label>
                                <select
                                    className="gestion-gastos-select"
                                    value={ordenFechaGasto}
                                    onChange={(e)=> setOrdenFechaGasto(e.target.value)}
                                >
                                    <option value="desc">Más recientes</option>
                                    <option value="asc">Más antiguos</option>
                                </select>
                            </div>

                            <div className="gasto-form-item">
                                <label>Monto</label>
                                <select
                                    className="gestion-gastos-select"
                                    value={ordenMontoGasto}
                                    onChange={(e)=> setOrdenMontoGasto(e.target.value)}
                                >
                                    <option value="ninguno">Sin orden</option>
                                    <option value="desc">Mayor monto</option>
                                    <option value="asc">Menor monto</option>
                                </select>
                            </div>

                        </div>

                        <hr />

                        {presupuestosFiltrados.map(presupuesto => {

                            let gastos = [...(presupuesto.gastos || [])];

                            if (ordenFechaGasto === "desc") {
                                gastos.sort((a,b)=> new Date(b.fechaGasto) - new Date(a.fechaGasto));
                            }

                            if (ordenFechaGasto === "asc") {
                                gastos.sort((a,b)=> new Date(a.fechaGasto) - new Date(b.fechaGasto));
                            }

                            if (ordenMontoGasto === "desc") {
                                gastos.sort((a,b)=> b.monto - a.monto);
                            }

                            if (ordenMontoGasto === "asc") {
                                gastos.sort((a,b)=> a.monto - b.monto);
                            }

                            const totalGastos = gastos.reduce((acc,g)=> acc + g.monto,0);
                            const restante = presupuesto.monto - totalGastos;

                            return (

                                <div key={presupuesto.id}>

                                    <h4 className="gestion-gastos-subtitle">
                                        {presupuesto.categoria} - {presupuesto.descripcion}
                                    </h4>

                                    <div className="gestion-gastos-resumen">
                                        <p>Fecha de asignacion: {presupuesto.fechaAsignacion}</p>
                                        <p>Monto asignado: {presupuesto.monto}</p>
                                        <p>Total gastos: {totalGastos}</p>
                                        <p className={restante < 0 ? "presupuesto-restante negativo" : "presupuesto-restante"}>
                                            Restante: {restante}
                                        </p>
                                        <p>Cantidad de gastos: {gastos.length}</p>
                                    </div>

                                    <table className="gestion-gastos-table">

                                        <thead>
                                        <tr>
                                            <th>Descripcion</th>
                                            <th>Fecha</th>
                                            <th>Monto</th>
                                            <th>Acciones</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {gastos.map(g => (
                                            <tr key={g.id}>
                                                <td>{g.descripcion}</td>
                                                <td>{g.fechaGasto}</td>
                                                <td>{g.monto}</td>
                                                <td>
                                                    <button
                                                        onClick={() => abrirBitacora(g)}
                                                        className="bg-blue-400 text-white px-2 py-1 rounded"
                                                    >
                                                        Ver cambios
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>

                                    </table>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

            {mostrarModal && (
                <ModalBitacora
                    gasto={gastoSeleccionado}
                    token={token}
                    onClose={() => setMostrarModal(false)}
                />
            )}

        </div>

    );

};

export default ConsultaGastos;