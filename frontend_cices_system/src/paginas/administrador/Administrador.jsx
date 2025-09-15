import React from "react";
import "./Administrador.css";

function Administrador(){
    return (
        <div className="contenedor_administrador">
            <div className="contenido_administrador">
                <section className="Busqueda">
                    <div className="buscador">
                        <form className="buscar">
                            <input type="text" name="speciality" placeholder="Proyecto/Investigador"/>
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

export default Administrador;