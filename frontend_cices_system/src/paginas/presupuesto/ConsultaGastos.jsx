import React, { useContext, useEffect, useMemo, useState } from "react";
import { notify } from "../../utils/estilo/notify.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { cargarProyectos } from "../../services/ProyectoService.jsx";
import { DetalleGastos } from "../../services/ReportesService";

const ConsultaGastos = () => {

    const { token } = useContext(AppContext);

    const [proyectos, setProyectos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showList, setShowList] = useState(false);

    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [presupuestos, setPresupuestos] = useState([]);

    const [categoriasFiltro, setCategoriasFiltro] = useState([]);

    const [ordenFechaPresupuesto, setOrdenFechaPresupuesto] = useState("desc");
    const [ordenMontoPresupuesto, setOrdenMontoPresupuesto] = useState("ninguno");

    const [ordenFechaGasto, setOrdenFechaGasto] = useState("desc");
    const [ordenMontoGasto, setOrdenMontoGasto] = useState("ninguno");

    useEffect(() => {
        cargarProyectos(token, true).then(setProyectos);
    }, [token]);

    const proyectosFiltrados = useMemo(() =>
        proyectos.filter(p =>
            p.codigoProyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.nombreProyecto.toLowerCase().includes(searchTerm.toLowerCase())
        ), [proyectos, searchTerm]);

    const seleccionarProyecto = async (proyecto) => {

        setProyectoSeleccionado(proyecto);
        setSearchTerm(proyecto.codigoProyecto);
        setShowList(false);

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

    const toggleCategoria = (categoria) => {

        if (categoriasFiltro.includes(categoria)) {

            setCategoriasFiltro(
                categoriasFiltro.filter(c => c !== categoria)
            );

        } else {

            setCategoriasFiltro([...categoriasFiltro, categoria]);

        }

    };

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

    return (

        <div>

            <h2>Consulta de gastos</h2>

            <h3>Buscar proyecto</h3>

            <input
                type="text"
                placeholder="Buscar código o nombre..."
                value={searchTerm}
                onChange={(e)=>{
                    setSearchTerm(e.target.value);
                    setShowList(true);
                }}
            />

            {showList && searchTerm && proyectosFiltrados.map(p => (

                <div key={p.codigoProyecto}>
                    <button onClick={()=> seleccionarProyecto(p)}>
                        {p.codigoProyecto} - {p.nombreProyecto}
                    </button>
                </div>

            ))}

            {proyectoSeleccionado && (

                <div>

                    <h3>
                        Proyecto: {proyectoSeleccionado.codigoProyecto} - {proyectoSeleccionado.nombreProyecto}
                    </h3>

                    <h3>Resumen del proyecto</h3>

                    <p>Total presupuestos: {presupuestos.length}</p>
                    <p>Total gastos registrados: {resumenGeneral.cantidadGastos}</p>
                    <p>Monto total asignado: {resumenGeneral.montoAsignado}</p>
                    <p>Total gastado: {resumenGeneral.totalGastos}</p>
                    <p>Presupuesto restante: {resumenGeneral.restante}</p>

                    <h3>Filtros</h3>

                    <details>

                        <summary>Categorías</summary>

                        {categoriasDisponibles.map(cat => (

                            <div key={cat}>

                                <label>

                                    <input
                                        type="checkbox"
                                        checked={categoriasFiltro.includes(cat)}
                                        onChange={()=> toggleCategoria(cat)}
                                    />

                                    {cat}

                                </label>

                            </div>

                        ))}

                    </details>

                    <h3>Ordenar presupuestos</h3>

                    <div>

                        <label>Fecha</label>

                        <select
                            value={ordenFechaPresupuesto}
                            onChange={(e)=> setOrdenFechaPresupuesto(e.target.value)}
                        >

                            <option value="desc">Más recientes</option>
                            <option value="asc">Más antiguos</option>

                        </select>

                    </div>

                    <div>

                        <label>Monto</label>

                        <select
                            value={ordenMontoPresupuesto}
                            onChange={(e)=> setOrdenMontoPresupuesto(e.target.value)}
                        >

                            <option value="ninguno">Sin orden</option>
                            <option value="desc">Mayor monto</option>
                            <option value="asc">Menor monto</option>

                        </select>

                    </div>

                    <h3>Ordenar gastos</h3>

                    <div>

                        <label>Fecha</label>

                        <select
                            value={ordenFechaGasto}
                            onChange={(e)=> setOrdenFechaGasto(e.target.value)}
                        >

                            <option value="desc">Más recientes</option>
                            <option value="asc">Más antiguos</option>

                        </select>

                    </div>

                    <div>

                        <label>Monto</label>

                        <select
                            value={ordenMontoGasto}
                            onChange={(e)=> setOrdenMontoGasto(e.target.value)}
                        >

                            <option value="ninguno">Sin orden</option>
                            <option value="desc">Mayor monto</option>
                            <option value="asc">Menor monto</option>

                        </select>

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

                        const totalGastos = gastos.reduce(
                            (acc,g)=> acc + g.monto,0
                        );

                        const restante = presupuesto.monto - totalGastos;

                        return (

                            <div key={presupuesto.id}>

                                <h4>
                                    {presupuesto.categoria} - {presupuesto.descripcion}
                                </h4>

                                <p>Fecha de asignacion: {presupuesto.fechaAsignacion}</p>
                                <p>Monto asignado: {presupuesto.monto}</p>
                                <p>Total gastos: {totalGastos}</p>
                                <p>Restante: {restante}</p>
                                <p>Cantidad de gastos: {gastos.length}</p>

                                <table border="1">

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

    );

};

export default ConsultaGastos;