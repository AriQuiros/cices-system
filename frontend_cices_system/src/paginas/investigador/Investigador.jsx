import React from "react";
import "./Investigador.css";

function Investigador(){
    return (
        <div className="contenedor_investigador">
            <div className="contenido_investigador">
                <section className="Busqueda">
                    <div className="buscador">
                        <form className="buscar">
                            <input type="text" name="speciality" placeholder="Mis Proyectos"/>
                            <button>
                                Buscar
                            </button>
                        </form>
                    </div>
                </section>

                <section className="resultado">
                    <div className="resultado">
                        <p> esto es una lista <br/>
                            esto es una lista <br/>
                            esto es una lista <br/>
                            esto es una lista <br/>
                            esto es una lista <br/>
                            esto es una lista <br/>
                            esto es una lista <br/>
                            esto es una lista <br/>
                            esto es una lista <br/>
                            esto es una lista <br/>
                            esto es una lista <br/>
                            esto es una lista <br/>
                            esto es una lista <br/>
                            esto es una lista <br/>
                            esto es una lista <br/>
                            esto es una lista <br/>
                            esto es una lista. </p>
                    </div>
                </section>
            </div>
        </div>
    );

}

export default Investigador;