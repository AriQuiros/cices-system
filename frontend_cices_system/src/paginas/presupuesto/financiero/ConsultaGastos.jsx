import React, { useContext, useMemo, useState } from "react";
import { notify } from "../../../utils/ui/notify.jsx";
import { AppContext } from "../../../context/AppContext.jsx";
import { DetalleGastos } from "../../../services/ReportesService.jsx";
import Select from "react-select";
import BuscadorProyecto from "../../../components/BusquedaProyecto.jsx";
import "../../../styles/paginas.css";

const ConsultaGastos = () => {

    const { token, user } = useContext(AppContext);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [presupuestos, setPresupuestos] = useState([]);

    const [categoriasFiltro, setCategoriasFiltro] = useState([]);

    const [ordenFechaPresupuesto, setOrdenFechaPresupuesto] = useState("desc");
    const [ordenMontoPresupuesto, setOrdenMontoPresupuesto] = useState("ninguno");

    const [ordenFechaGasto, setOrdenFechaGasto] = useState("desc");
    const [ordenMontoGasto, setOrdenMontoGasto] = useState("ninguno");

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

            lista = lista.filter(p =>
                categoriasFiltro.includes(p.categoria)
            );

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

                acc + (p.gastos || []).reduce(
                    (a,g)=> a + (g.monto || 0),0
                )

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
    return (

        <div className="consulta-gastos-page">

            <div className="consulta-gastos-card">

            <h2 className="consulta-gastos-title">Consulta de gastos</h2>

            <BuscadorProyecto
                token={token}
                user={user}
                onSelect={seleccionarProyecto}
            />

            {proyectoSeleccionado && (

                <div className="consulta-gastos-content">

                    <h3 className="consulta-gastos-subtitle">Resumen del proyecto</h3>

                    <div className="consulta-gastos-resumen">
                        <p>Total presupuestos: {presupuestos.length}</p>
                        <p>Total gastos registrados: {resumenGeneral.cantidadGastos}</p>
                        <p>Monto total asignado: {resumenGeneral.montoAsignado}</p>
                        <p>Total gastado: {resumenGeneral.totalGastos}</p>
                        <p className={resumenGeneral.restante < 0 ? "consulta-restante negativo" : "consulta-restante"}>
                            Presupuesto restante: {resumenGeneral.restante}
                        </p>
                    </div>

                    <h3 className="consulta-gastos-subtitle">Filtros</h3>

                    <div className="consulta-filtro-item">
                        <label className="consulta-label">Categorias</label>
                        <Select
                            options={opcionesCategorias}
                            isMulti
                            value={opcionesCategorias.filter(c => categoriasFiltro.includes(c.value))}
                            onChange={manejarCategoriasSelect}
                            placeholder="Seleccione categoría(s)"
                            closeMenuOnSelect={false}
                        />
                    </div>

                    <h3 className="consulta-gastos-subtitle">Ordenar presupuestos</h3>

                    <div className="consulta-grid-filtros">

                    <div className="consulta-filtro-item">

                        <label className="consulta-label">Fecha</label>

                        <select
                            className="consulta-select"
                            value={ordenFechaPresupuesto}
                            onChange={(e)=> setOrdenFechaPresupuesto(e.target.value)}
                        >

                            <option value="desc">Más recientes</option>
                            <option value="asc">Más antiguos</option>

                        </select>

                    </div>

                    <div className="consulta-filtro-item">

                        <label className="consulta-label">Monto</label>

                        <select
                            className="consulta-select"
                            value={ordenMontoPresupuesto}
                            onChange={(e)=> setOrdenMontoPresupuesto(e.target.value)}
                        >
                            <option value="ninguno">Sin orden</option>
                            <option value="desc">Mayor monto</option>
                            <option value="asc">Menor monto</option>

                        </select>

                    </div>

                    </div>

                    <h3 className="consulta-gastos-subtitle">Ordenar gastos</h3>

                    <div className="consulta-grid-filtros">

                    <div className="consulta-filtro-item">

                        <label className="consulta-label">Fecha</label>

                        <select
                            className="consulta-select"
                            value={ordenFechaGasto}
                            onChange={(e)=> setOrdenFechaGasto(e.target.value)}
                        >
                            <option value="desc">Más recientes</option>
                            <option value="asc">Más antiguos</option>
                        </select>

                    </div>

                    <div className="consulta-filtro-item">

                        <label className="consulta-label">Monto</label>

                        <select
                            className="consulta-select"
                            value={ordenMontoGasto}
                            onChange={(e)=> setOrdenMontoGasto(e.target.value)}
                        >

                            <option value="ninguno">Sin orden</option>
                            <option value="desc">Mayor monto</option>
                            <option value="asc">Menor monto</option>

                        </select>

                    </div>

                    </div>

                    <hr className="consulta-divider" />
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

                        const totalGastos = gastos.reduce(
                            (acc,g)=> acc + g.monto,0
                        );

                        const restante = presupuesto.monto - totalGastos;

                        return (

                            <div key={presupuesto.id}>

                                <h4 className="consulta-presupuesto-title">
                                    {presupuesto.categoria} - {presupuesto.descripcion}
                                </h4>

                                <div className="consulta-presupuesto-resumen">
                                    <p>Fecha de asignacion: {presupuesto.fechaAsignacion}</p>
                                    <p>Monto asignado: {presupuesto.monto}</p>
                                    <p>Total gastos: {totalGastos}</p>
                                    <p className={restante < 0 ? "consulta-restante negativo" : "consulta-restante"}>Restante: {restante}</p>
                                    <p>Cantidad de gastos: {gastos.length}</p>
                                </div>

                                <table className="consulta-gastos-table">

                                    <thead>

                                    <tr>
                                        <th>Descripcion</th>
                                        <th>Fecha</th>
                                        <th>Monto</th>
                                    </tr>

                                    </thead>

                                    <tbody>

                                    {gastos.map(g => (

                                        <tr key={g.id}>

                                            <td>{g.descripcion}</td>
                                            <td>{g.fechaGasto}</td>
                                            <td>{g.monto}</td>

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

        </div>

    );

};

export default ConsultaGastos;