// src/paginas/administrador/Administrador.jsx
import "./Administrador.css";
import React from "react";

function Administrador() {
    return (
        <div className="contenedor_administrador">
            <div className="contenido_administrador">
                <section className="Busqueda">
                    <div className="buscador">
                        <form className="buscar" onSubmit={(e) => e.preventDefault()}>
                            <input type="text" name="speciality" placeholder="Proyecto/Investigador" />
                            <button type="submit">Buscar</button>
                        </form>
                    </div>
                </section>

                <section className="resultado">
                    <div className="lista_resultado">

                    </div>
                </section>
            </div>
        </div>
    );
}

export default Administrador;



