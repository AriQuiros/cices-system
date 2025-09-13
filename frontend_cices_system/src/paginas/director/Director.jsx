import React from "react";
import "./Director.css";

 function Director(){
    return (
        <div className="contenedor_director">
            <div className="resumen_funcionalidades">
                <section className="resumen_personal">
                    <h3>Resumen de personal</h3>
                    <div className="label">
                    <label>Certificaciones proximas a vencer: 2</label>
                    <label>Investigadores activos: 5</label>
                    <label>Total Investigadores: 10</label>
                    <label>Personal Administrativo: 3</label>
                    </div>
                </section>

                <section className="resumen_proyectos">
                    <h3>Resumen de proyectos</h3>
                    <div className="label">
                        <label>Total proyectos: 15</label>
                        <label>Total Investigadores: 30</label>
                    </div>
                </section>
            </div>
        </div>

    );

}

export default Director;