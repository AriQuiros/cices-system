import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";
import "./RegistrarGastosFinancieros.css";

const RegistrarGastosFinancieros = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [presupuesto, setPresupuesto] = useState(null);
    const [montoError, setMontoError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState(''); // 'exito' o 'error'
    const [enviando, setEnviando] = useState(false);
    const [gastoRegistrado, setGastoRegistrado] = useState(null);
    const [mostrarDetalleGasto, setMostrarDetalleGasto] = useState(false);
    const [esGastoReciente, setEsGastoReciente] = useState(false); // Para distinguir entre gasto recién registrado o último gasto consultado
    const [hayGastosAnteriores, setHayGastosAnteriores] = useState(false); // Para controlar la visibilidad del botón
    const [fechaMaxima, setFechaMaxima] = useState(''); // Fecha máxima permitida del servidor
    const [mostrarMensajeFinal, setMostrarMensajeFinal] = useState(false); // Para mostrar mensaje final de confirmación
    const [nombreProyectoFinal, setNombreProyectoFinal] = useState(''); // Para almacenar el nombre del proyecto para el mensaje final
    const [mostrarCategoriaPersonalizada, setMostrarCategoriaPersonalizada] = useState(false); // Para mostrar campo de texto personalizado
    const [categoriaPersonalizada, setCategoriaPersonalizada] = useState(''); // Para almacenar la categoría personalizada

    // Función para obtener la fecha actual del servidor
    const obtenerFechaServidor = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/investigador/fecha-actual', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Esperamos que el servidor devuelva la fecha en formato YYYY-MM-DD
                setFechaMaxima(data.fecha || data.fechaActual || data);
                console.log('Fecha máxima del servidor:', data);
            } else {
                console.error('Error al obtener fecha del servidor, usando fecha local');
                // Fallback a fecha local si hay error
                setFechaMaxima(new Date().toISOString().split('T')[0]);
            }
        } catch (error) {
            console.error('Error al conectar con el servidor para obtener fecha:', error);
            // Fallback a fecha local en caso de error de conexión
            setFechaMaxima(new Date().toISOString().split('T')[0]);
        }
    };

    // Función para verificar si hay gastos anteriores guardados
    const verificarGastosAnteriores = () => {
        try {
            // Usar el ID del usuario para crear una clave única
            const claveUsuario = `ultimoGastoRegistrado_${user?.id || 'anonimo'}`;
            const ultimoGastoGuardado = localStorage.getItem(claveUsuario);
            const hayGastos = ultimoGastoGuardado !== null && ultimoGastoGuardado !== '';
            setHayGastosAnteriores(hayGastos);
            return hayGastos;
        } catch (error) {
            console.error('Error al verificar gastos anteriores:', error);
            setHayGastosAnteriores(false);
            return false;
        }
    };

    // Función para cargar el último gasto del localStorage
    const cargarUltimoGasto = () => {
        try {
            // Usar el ID del usuario para crear una clave única
            const claveUsuario = `ultimoGastoRegistrado_${user?.id || 'anonimo'}`;
            const ultimoGastoGuardado = localStorage.getItem(claveUsuario);
            if (ultimoGastoGuardado) {
                const gasto = JSON.parse(ultimoGastoGuardado);
                setGastoRegistrado(gasto);
                setEsGastoReciente(false); // Marcar que es una consulta del último gasto
                setMostrarDetalleGasto(true);
            } else {
                setMensaje('No hay ningún gasto registrado anteriormente');
                setTipoMensaje('error');
                setTimeout(() => {
                    setMensaje('');
                    setTipoMensaje('');
                }, 3000);
            }
        } catch (error) {
            console.error('Error al cargar el último gasto:', error);
            setMensaje('Error al cargar el gasto anterior');
            setTipoMensaje('error');
            setTimeout(() => {
                setMensaje('');
                setTipoMensaje('');
            }, 3000);
        }
    };

    // useEffect para verificar gastos anteriores y obtener fecha del servidor al cargar el componente
    useEffect(() => {
        verificarGastosAnteriores();
        if (token && user) {
            obtenerFechaServidor();
        }
    }, [token, user]);

    useEffect(() => {
        const cargarProyectosInvestigadorPrincipal = async () => {
            // Verificar si hay token y usuario antes de hacer la petición
            if (!token || !user) {
                setLoading(false);
                setMensaje('Debe iniciar sesión para acceder a esta página');
                setTipoMensaje('error');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/investigador/proyectos-principal', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Proyectos cargados:', data);
                    setProyectos(data);
                } else if (response.status === 401) {
                    console.error('Usuario no autenticado. Token inválido.');
                    setMensaje('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
                    setTipoMensaje('error');
                } else {
                    console.error('Error al cargar proyectos. Status:', response.status);
                    setMensaje('Error al cargar los proyectos. Intente nuevamente.');
                    setTipoMensaje('error');
                }
            } catch (error) {
                console.error('Error:', error);
                setMensaje('Error de conexión. Verifique su conexión a internet.');
                setTipoMensaje('error');
            } finally {
                setLoading(false);
            }
        };

        cargarProyectosInvestigadorPrincipal();
    }, [token, user]);

    const cargarPresupuesto = async (idProyecto) => {
        try {
            const response = await fetch(`http://localhost:8080/api/investigador/presupuesto/${idProyecto}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPresupuesto(data);
                console.log('Presupuesto cargado:', data);
            } else {
                console.error('Error al cargar presupuesto');
                setPresupuesto(null);
            }
        } catch (error) {
            console.error('Error:', error);
            setPresupuesto(null);
        }
    };

    const validarMonto = async (idProyecto, monto) => {
        if (!monto || monto <= 0) {
            setMontoError('');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/investigador/validar-gasto', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idProyecto: parseInt(idProyecto),
                    monto: parseFloat(monto)
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (!data.valido) {
                    setMontoError(`El monto excede el presupuesto disponible. Disponible: ₡${data.montoDisponible.toFixed(2)}`);
                } else {
                    setMontoError('');
                }
                console.log('Validación:', data);
            } else {
                console.error('Error al validar monto');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para manejar el cambio en el select de categoría
    const manejarCambioCategoria = (e) => {
        const valor = e.target.value;
        if (valor === 'otros') {
            setMostrarCategoriaPersonalizada(true);
        } else {
            setMostrarCategoriaPersonalizada(false);
            setCategoriaPersonalizada('');
        }
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setMensaje('');
        setTipoMensaje('');

        try {
            const formData = new FormData(e.target);
            const categoriaSeleccionada = formData.get('categoria');
            const categoriaFinal = categoriaSeleccionada === 'otros' ? categoriaPersonalizada : categoriaSeleccionada;

            const gastoData = {
                idProyecto: parseInt(formData.get('proyecto')),
                monto: parseFloat(formData.get('monto')),
                fechaGasto: formData.get('fecha'),
                categoriaGasto: categoriaFinal,
                descripcion: formData.get('descripcion')
            };

            // Validar que todos los campos estén completos
            if (!gastoData.idProyecto || !gastoData.monto || !gastoData.fechaGasto ||
                !gastoData.categoriaGasto || !gastoData.descripcion) {
                setMensaje('Por favor complete todos los campos');
                setTipoMensaje('error');
                return;
            }

            // Validar categoría personalizada si se seleccionó "otros"
            if (formData.get('categoria') === 'otros' && !categoriaPersonalizada.trim()) {
                setMensaje('Por favor ingrese la categoría personalizada');
                setTipoMensaje('error');
                return;
            }

            // Validar que no haya errores de monto
            if (montoError) {
                setMensaje('Corrija el error de monto antes de continuar');
                setTipoMensaje('error');
                return;
            }

            const response = await fetch('http://localhost:8080/api/investigador/registrar-gasto', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gastoData)
            });

            const result = await response.json();
            console.log('Response status:', response.status);
            console.log('Response result:', result);

            if (response.ok && result.exito) {
                // Obtener el nombre del proyecto seleccionado
                const proyectoSeleccionado = proyectos.find(p => p.idProyecto === gastoData.idProyecto);

                console.log('Proyecto seleccionado:', proyectoSeleccionado);
                console.log('Datos del gasto:', gastoData);

                // Guardar los detalles del gasto registrado
                const detallesGasto = {
                    nombreProyecto: proyectoSeleccionado?.nombre || 'Proyecto desconocido',
                    monto: gastoData.monto,
                    categoria: gastoData.categoriaGasto,
                    fecha: gastoData.fechaGasto,
                    descripcion: gastoData.descripcion
                };

                console.log('Detalles del gasto a guardar:', detallesGasto);
                setGastoRegistrado(detallesGasto);
                setEsGastoReciente(true); // Marcar que es un gasto recién registrado

                // Guardar el gasto en localStorage para poder verlo después
                try {
                    // Usar el ID del usuario para crear una clave única
                    const claveUsuario = `ultimoGastoRegistrado_${user?.id || 'anonimo'}`;
                    localStorage.setItem(claveUsuario, JSON.stringify(detallesGasto));
                    console.log('Gasto guardado en localStorage para consulta posterior del usuario:', user?.id);
                    // Actualizar el estado para mostrar el botón de "Ver Último Gasto"
                    setHayGastosAnteriores(true);
                } catch (error) {
                    console.error('Error al guardar el gasto en localStorage:', error);
                }

                // Mostrar el detalle del gasto inmediatamente
                console.log('Mostrando popup de detalle del gasto');
                setMostrarDetalleGasto(true);

                // Limpiar el formulario completamente
                e.target.reset();
                setPresupuesto(null);
                setMontoError('');
                setMostrarCategoriaPersonalizada(false);
                setCategoriaPersonalizada('');

                // Asegurar que el select también se resetee visualmente
                const proyectoSelect = document.getElementById('proyecto');
                if (proyectoSelect) {
                    proyectoSelect.value = '';
                }
            } else {
                setMensaje(result.mensaje || 'No se pudo registrar el gasto');
                setTipoMensaje('error');
            }
        } catch (error) {
            console.error('Error al registrar gasto:', error);
            setMensaje('Error de conexión. Verifique su conexión a internet.');
            setTipoMensaje('error');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="registrar-gastos-container">
            <div className="content">
                <h1>Registrar Gastos Financieros</h1>

                {/* Botón para ver el último gasto registrado - solo se muestra si hay gastos anteriores */}
                {hayGastosAnteriores && (
                    <button
                        onClick={cargarUltimoGasto}
                        className="btn-ultimo-gasto"
                    >
                        📋 Ver Último Gasto Registrado
                    </button>
                )}

                {/* Popup de error visual */}
                {mensaje && tipoMensaje === 'error' && (
                    <div className="popup-error-overlay">
                        <div className="popup-error">
                            <button
                                onClick={() => {
                                    setMensaje('');
                                    setTipoMensaje('');
                                }}
                                className="btn-cerrar"
                                aria-label="Cerrar"
                            >&#10005;</button>
                            <div className="titulo">
                                Error al registrar el gasto
                            </div>
                            <div className="mensaje">
                                {mensaje}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mini pop-up con detalles del gasto registrado */}
                {mostrarDetalleGasto && gastoRegistrado && (
                    console.log('Renderizando popup - mostrarDetalleGasto:', mostrarDetalleGasto, 'gastoRegistrado:', gastoRegistrado) ||
                    <div className="popup-detalle-overlay">
                        <div className={`popup-detalle ${esGastoReciente ? 'reciente' : 'anterior'}`}>
                            <button
                                onClick={() => {
                                    setMostrarDetalleGasto(false);
                                    setGastoRegistrado(null);
                                    setEsGastoReciente(false);
                                }}
                                className="btn-cerrar"
                                aria-label="Cerrar"
                            >×</button>

                            <div className={`titulo ${esGastoReciente ? 'reciente' : 'anterior'}`}>
                                {esGastoReciente ? "✅ Nuevo Gasto Registrado" : "📋 Último Gasto Registrado"}
                            </div>

                            <div className="contenido">
                                <div className="campo">
                                    <strong>Proyecto:</strong> {gastoRegistrado.nombreProyecto}
                                </div>

                                <div className="campo">
                                    <strong>Monto:</strong> ₡{gastoRegistrado?.monto?.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>

                                <div className="campo">
                                    <strong>Categoría del gasto:</strong> {gastoRegistrado.categoria}
                                </div>

                                <div className="campo">
                                    <strong>Fecha:</strong> {new Date(gastoRegistrado.fecha).toLocaleDateString('es-CR')}
                                </div>

                                <div className="campo">
                                    <strong>Descripción:</strong>
                                    <div className="descripcion-contenido">
                                        {gastoRegistrado.descripcion}
                                    </div>
                                </div>
                            </div>

                            <div className="acciones">
                                <button
                                    onClick={() => {
                                        // Si es un gasto recién registrado, mostrar mensaje final
                                        if (esGastoReciente && gastoRegistrado) {
                                            setNombreProyectoFinal(gastoRegistrado.nombreProyecto);
                                            setMostrarMensajeFinal(true);
                                            // Auto-cerrar el mensaje después de 4 segundos
                                            setTimeout(() => {
                                                setMostrarMensajeFinal(false);
                                                setNombreProyectoFinal('');
                                            }, 4000);
                                        }

                                        setMostrarDetalleGasto(false);
                                        setGastoRegistrado(null);
                                        setEsGastoReciente(false);
                                    }}
                                    className="btn-continuar"
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mensaje final de confirmación del gasto registrado */}
                {mostrarMensajeFinal && (
                    <div className="mensaje-final-confirmacion">
                        <div className="mensaje-final-texto">
                            El gasto se registró correctamente al Proyecto: {nombreProyectoFinal}
                        </div>
                    </div>
                )}

                <div className="form-container">
                    <form className="gastos-form" onSubmit={manejarEnvio}>
                        <div className="form-group">
                            <label htmlFor="proyecto">Proyecto asociado:</label>
                            <select
                                id="proyecto"
                                name="proyecto"
                                required
                                disabled={loading}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        cargarPresupuesto(e.target.value);
                                    } else {
                                        setPresupuesto(null);
                                    }
                                    setMontoError('');
                                }}
                            >
                                <option value="">
                                    {loading ? 'Cargando proyectos...' : 'Seleccione un proyecto'}
                                </option>
                                {proyectos.map((proyecto) => (
                                    <option key={proyecto.idProyecto} value={proyecto.idProyecto}>
                                        {proyecto.nombre}
                                    </option>
                                ))}
                            </select>
                            {proyectos.length === 0 && !loading && (
                                <small className="validation-error">
                                    No tiene proyectos asignados como investigador principal.
                                </small>
                            )}
                            {presupuesto && (
                                <small className="validation-success">
                                    Presupuesto disponible: ₡{presupuesto.montoDisponible?.toFixed(2) || '0.00'}
                                </small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="monto">Monto (₡):</label>
                            <input
                                type="number"
                                id="monto"
                                name="monto"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                required
                                onChange={(e) => {
                                    const proyectoSelect = document.getElementById('proyecto');
                                    if (proyectoSelect.value && e.target.value) {
                                        validarMonto(proyectoSelect.value, e.target.value);
                                    }
                                }}
                            />
                            {montoError && (
                                <small className="validation-error">
                                    {montoError}
                                </small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="categoria">Categoría del gasto:</label>
                            <select id="categoria" name="categoria" required onChange={manejarCambioCategoria}>
                                <option value="">Seleccione una categoría</option>
                                <option value="materiales">Materiales</option>
                                <option value="transporte">Transporte</option>
                                <option value="equipo">Equipo</option>
                                <option value="servicios">Servicios</option>
                                <option value="personal">Personal</option>
                                <option value="otros">Otros</option>
                            </select>
                        </div>

                        {mostrarCategoriaPersonalizada && (
                            <div className="form-group categoria-personalizada-container">
                                <label htmlFor="categoriaPersonalizada">Especifique la categoría:</label>
                                <input
                                    type="text"
                                    id="categoriaPersonalizada"
                                    value={categoriaPersonalizada}
                                    onChange={(e) => setCategoriaPersonalizada(e.target.value)}
                                    placeholder="Ingrese la categoría del gasto"
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="fecha">Fecha:</label>
                            <input
                                type="date"
                                id="fecha"
                                name="fecha"
                                max={fechaMaxima || new Date().toISOString().split('T')[0]} // Limitar a la fecha del servidor o local como fallback
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción:</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                rows="4"
                                placeholder="Describa detalladamente el gasto realizado"
                                required
                            ></textarea>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-cancelar">
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn-registrar"
                                disabled={enviando || !!montoError}
                            >
                                {enviando ? 'Registrando...' : 'Registrar Gasto'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrarGastosFinancieros;