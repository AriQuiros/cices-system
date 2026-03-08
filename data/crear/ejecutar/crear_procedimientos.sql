host cls
conn cices/cices123

PROMPT ================================
PROMPT === DROPEO DE PROCEDIMIENTOS ===
PROMPT ================================

PROMPT == DROPEO PROCEDIMIENTOS USUARIOS ==
DROP PROCEDURE PRC_INS_EMPLEADO;
DROP PROCEDURE PRC_INS_INVESTIGADOR;
DROP PROCEDURE PRC_INS_USUARIO;

PROMPT == DROPEO PROCEDIMIENTOS EDUCACION ==
DROP PROCEDURE PRC_INS_CERTIFICACION;

PROMPT == DROPEO PROCEDIMIENTOS PROYECTOS ==
DROP PROCEDURE PRC_INS_PROYECTO;
DROP PROCEDURE PRC_INS_INVESTIGADOR_PROYECTO;

PROMPT == DROPEO PROCEDIMIENTOS FINANCIAMIENTO ==
DROP PROCEDURE PRC_INS_PRESUPUESTO;
DROP PROCEDURE PRC_INS_HORAS_ASIGNADAS;

PROMPT == DROPEO PROCEDIMIENTOS ADICIONALES ==
-- DROP PROCEDURE PRC_INS_TITULO;
-- DROP PROCEDURE PRC_INS_NOTIFICACION;

PROMPT == DROPEO PROCEDIMIENTO GENERAL ==
DROP PROCEDURE PRC_REGISTRAR_INVESTIGADOR;


PROMPT ============================
PROMPT  CREACION DE PROCEDIMIENTOS
PROMPT ============================

PROMPT = PROCEDIMIENTOS USUARIOS =
PROMPT ============================
CREATE OR REPLACE PROCEDURE PRC_INS_EMPLEADO(
    Pnombre_empleado     IN EMPLEADO.NOMBRE_COMPLETO%TYPE,
    Pnacionalidad        IN EMPLEADO.NACIONALIDAD%TYPE,
    Pid_tipo_id          IN EMPLEADO.ID_CODIGO_TIPO_ID%TYPE,
    Pidentificacion      IN EMPLEADO.IDENTIFICACION%TYPE,
    Pcorreo              IN EMPLEADO.CORREO%TYPE,
    Pid_grado_academico  IN EMPLEADO.ID_CODIGO_TIPO_GRADO_ACADEMICO%TYPE,
    Ptelefono            IN EMPLEADO.NUMERO_TELEFONO%TYPE
)
IS
BEGIN
    INSERT INTO EMPLEADO (
        ID_EMPLEADO,
        NOMBRE_COMPLETO,
        NACIONALIDAD,
        ID_CODIGO_TIPO_ID,
        IDENTIFICACION,
        CORREO,
        ID_CODIGO_TIPO_GRADO_ACADEMICO,
        NUMERO_TELEFONO
    )
    VALUES (
        SEC_EMPLEADO.NEXTVAL,
        Pnombre_empleado,
        Pnacionalidad,
        Pid_tipo_id,
        Pidentificacion,
        Pcorreo,
        Pid_grado_academico,
        Ptelefono
    );
END;
/
show error

CREATE OR REPLACE PROCEDURE PRC_INS_INVESTIGADOR(
    Pid_empleado        IN INVESTIGADOR.ID_EMPLEADO%TYPE,
    Pinstitucion_origen IN INVESTIGADOR.INSTITUCION_ORIGEN%TYPE,
    Punidad_academica   IN INVESTIGADOR.UNIDAD_ACADEMICA%TYPE,
    Ptema_tesis         IN INVESTIGADOR.TEMA_TESIS%TYPE
)
IS
BEGIN
    INSERT INTO INVESTIGADOR (
        ID_INVESTIGADOR,
        ID_EMPLEADO,
        INSTITUCION_ORIGEN,
        UNIDAD_ACADEMICA,
        TEMA_TESIS
    )
    VALUES (
        SEC_INVESTIGADOR.NEXTVAL,
        Pid_empleado,
        Pinstitucion_origen,
        Punidad_academica,
        Ptema_tesis
    );
END;
/
show error

CREATE OR REPLACE PROCEDURE PRC_INS_USUARIO(
    Pid_empleado    IN USUARIO.ID_EMPLEADO%TYPE,
    Pnombre_usuario IN USUARIO.NOMBRE_USUARIO%TYPE,
    Pcontrasena     IN USUARIO.CONTRASENA%TYPE,
    Pactivo         IN USUARIO.ACTIVO%TYPE
)
IS
BEGIN
    INSERT INTO USUARIO (
        ID_USUARIO,
        ID_EMPLEADO,
        NOMBRE_USUARIO,
        CONTRASENA,
        ACTIVO
    )
    VALUES (
        SEC_USUARIO.NEXTVAL,
        Pid_empleado,
        Pnombre_usuario,
        Pcontrasena,
        Pactivo
    );
END;
/
show error

PROMPT = PROCEDIMIENTOS EDUCACION =
PROMPT ============================
CREATE OR REPLACE PROCEDURE PRC_INS_CERTIFICACION(
    Pid_investigador IN CERTIFICACION.ID_INVESTIGADOR%TYPE,
    Pid_entidad      IN CERTIFICACION.ID_ENTIDAD%TYPE,
    Pnombre_cert     IN CERTIFICACION.NOMBRE_CERTIFICACION%TYPE,
    Ptipo_cert       IN CERTIFICACION.ID_CODIGO_TIPO_CERTIFICACION%TYPE,
    Pfecha_exp       IN CERTIFICACION.FECHA_EXPIRACION%TYPE,
    Pestado_cert     IN CERTIFICACION.ID_CODIGO_TIPO_ESTADO%TYPE
)
IS
BEGIN
    INSERT INTO CERTIFICACION (
        ID_CERTIFICACION,
        ID_INVESTIGADOR,
        ID_ENTIDAD,
        NOMBRE_CERTIFICACION,
        ID_CODIGO_TIPO_CERTIFICACION,
        FECHA_EXPIRACION,
        ID_CODIGO_TIPO_ESTADO
    )
    VALUES (
        SEC_CERTIFICACION.NEXTVAL,
        Pid_investigador,
        Pid_entidad,
        Pnombre_cert,
        Ptipo_cert,
        Pfecha_exp,
        Pestado_cert
    );
END;
/
show error

PROMPT = PROCEDIMIENTOS PROYECTOS =
PROMPT ============================
CREATE OR REPLACE PROCEDURE PRC_INS_PROYECTO(
    Pcodigo_proyecto     IN PROYECTO.CODIGO_PROYECTO%TYPE,
    Pnombre_proyecto     IN PROYECTO.NOMBRE_PROYECTO%TYPE,
    Pdescripcion         IN PROYECTO.DESCRIPCION_PROYECTO%TYPE,
    Pobjetivo_general    IN PROYECTO.OBJETIVO_GENERAL%TYPE,
    Pid_estado           IN PROYECTO.ID_CODIGO_TIPO_ESTADO%TYPE,
    Plinea_investigacion IN PROYECTO.LINEA_INVESTIGACION%TYPE,
    Pid_tipo_proyecto    IN PROYECTO.ID_CODIGO_TIPO_PROYECTO%TYPE,
    Pfecha_inicio        IN PROYECTO.FECHA_INICIO%TYPE,
    Pfecha_fin           IN PROYECTO.FECHA_FINALIZACION%TYPE,
    Pdetalles            IN PROYECTO.DETALLES_PROYECTOS%TYPE
)
IS
BEGIN
    INSERT INTO PROYECTO (
        ID_PROYECTO,
        CODIGO_PROYECTO,
        NOMBRE_PROYECTO,
        DESCRIPCION_PROYECTO,
        OBJETIVO_GENERAL,
        ID_CODIGO_TIPO_ESTADO,
        LINEA_INVESTIGACION,
        ID_CODIGO_TIPO_PROYECTO,
        FECHA_INICIO,
        FECHA_FINALIZACION,
        DETALLES_PROYECTOS
    )
    VALUES (
        SEC_PROYECTO.NEXTVAL,
        Pcodigo_proyecto,
        Pnombre_proyecto,
        Pdescripcion,
        Pobjetivo_general,
        Pid_estado,
        Plinea_investigacion,
        Pid_tipo_proyecto,
        Pfecha_inicio,
        Pfecha_fin,
        Pdetalles
    );
END;
/
show error

CREATE OR REPLACE PROCEDURE PRC_INS_INVESTIGADOR_PROYECTO(
    Pid_investigador    IN INVESTIGADOR_PROYECTO.ID_INVESTIGADOR%TYPE,
    Pid_rol_proyecto    IN INVESTIGADOR_PROYECTO.ID_ROL_PROYECTO%TYPE,
    Pid_proyecto        IN INVESTIGADOR_PROYECTO.ID_PROYECTO%TYPE,
    Pactividad          IN INVESTIGADOR_PROYECTO.ACTIVIDAD_PROYECTO%TYPE,
    Pfecha_inicio       IN INVESTIGADOR_PROYECTO.FECHA_INICIO_INVESTIGADOR%TYPE,
    Pfecha_fin          IN INVESTIGADOR_PROYECTO.FECHA_FIN_INVESTIGADOR%TYPE
)
IS
BEGIN
    INSERT INTO INVESTIGADOR_PROYECTO (
        ID_INVESTIGADOR_PROYECTO,
        ID_INVESTIGADOR,
        ID_ROL_PROYECTO,
        ID_PROYECTO,
        ACTIVIDAD_PROYECTO,
        FECHA_INICIO_INVESTIGADOR,
        FECHA_FIN_INVESTIGADOR
    )
    VALUES (
        SEC_INVESTIGADOR_PROYECTO.NEXTVAL,
        Pid_investigador,
        Pid_rol_proyecto,
        Pid_proyecto,
        Pactividad,
        Pfecha_inicio,
        Pfecha_fin
    );
END;
/
show error

PROMPT PROCEDIMIENTOS FINANCIAMIENTO
PROMPT ============================
CREATE OR REPLACE PROCEDURE PRC_INS_PRESUPUESTO(
    Pid_proyecto        IN PRESUPUESTO.ID_PROYECTO%TYPE,
    Pid_categoria       IN PRESUPUESTO.ID_TIPO_CATEGORIA%TYPE,
    Pfecha_asignacion   IN PRESUPUESTO.FECHA_ASIGNACION%TYPE,
    Pid_fuente_fin      IN PRESUPUESTO.ID_CODIGO_TIPO_FUENTE_FINANCIAMIENTO%TYPE,
    Pmonto              IN PRESUPUESTO.MONTO%TYPE,
    Phoras_mes          IN PRESUPUESTO.CANTIDAD_HORAS_MES%TYPE,
    Pcantidad_meses     IN PRESUPUESTO.CANTIDAD_MESES%TYPE,
    Pid_tipo_presup     IN PRESUPUESTO.ID_CODIGO_TIPO_PRESUPUESTO%TYPE
)
IS
BEGIN
    INSERT INTO PRESUPUESTO (
        ID_PRESUPUESTO,
        ID_PROYECTO,
        ID_TIPO_CATEGORIA,
        FECHA_ASIGNACION,
        ID_CODIGO_TIPO_FUENTE_FINANCIAMIENTO,
        MONTO,
        CANTIDAD_HORAS_MES,
        CANTIDAD_MESES,
        PRESUPUESTO_ACTUAL,
        ID_CODIGO_TIPO_PRESUPUESTO
    )
    VALUES (
        SEC_PRESUPUESTO.NEXTVAL,
        Pid_proyecto,
        Pid_categoria,
        Pfecha_asignacion,
        Pid_fuente_fin,
        Pmonto,
        Phoras_mes,
        Pcantidad_meses,
        Pmonto,
        Pid_tipo_presup
    );
END;
/
show error

CREATE OR REPLACE PROCEDURE PRC_INS_HORAS_ASIGNADAS(
    Pid_investigador_proy IN HORAS_ASIGNADAS.ID_INVESTIGADOR_PROYECTO%TYPE,
    Pid_presupuesto       IN HORAS_ASIGNADAS.ID_PRESUPUESTO%TYPE,
    Phoras_mes            IN HORAS_ASIGNADAS.CANTIDAD_HORAS_MES%TYPE,
    Pcantidad_meses       IN HORAS_ASIGNADAS.CANTIDAD_MESES%TYPE,
    Pid_modalidad         IN HORAS_ASIGNADAS.ID_CODIGO_TIPO_MODALIDAD%TYPE
)
IS
BEGIN
    INSERT INTO HORAS_ASIGNADAS (
        ID_HORAS_ASIGNADAS,
        ID_INVESTIGADOR_PROYECTO,
        ID_PRESUPUESTO,
        CANTIDAD_HORAS_MES,
        CANTIDAD_MESES,
        ID_CODIGO_TIPO_MODALIDAD
    )
    VALUES (
        SEC_HORAS_ASIGNADAS.NEXTVAL,
        Pid_investigador_proy,
        Pid_presupuesto,
        Phoras_mes,
        Pcantidad_meses,
        Pid_modalidad
    );
END;
/
show error

PROMPT ============================
PROMPT == PROCEDIMIENTO GENERAL ==
PROMPT ============================

CREATE OR REPLACE PROCEDURE PRC_REGISTRAR_INVESTIGADOR(
    Pnombre_completo   IN EMPLEADO.NOMBRE_COMPLETO%TYPE,
    Pnacionalidad      IN EMPLEADO.NACIONALIDAD%TYPE,
    Pid_tipo_id        IN EMPLEADO.ID_CODIGO_TIPO_ID%TYPE,
    Pidentificacion    IN EMPLEADO.IDENTIFICACION%TYPE,
    Pcorreo            IN EMPLEADO.CORREO%TYPE,
    Pid_grado_acad     IN EMPLEADO.ID_CODIGO_TIPO_GRADO_ACADEMICO%TYPE,
    Ptelefono          IN EMPLEADO.NUMERO_TELEFONO%TYPE,

    Pinstitucion       IN INVESTIGADOR.INSTITUCION_ORIGEN%TYPE,
    Punidad_academica  IN INVESTIGADOR.UNIDAD_ACADEMICA%TYPE,
    Ptema_tesis        IN INVESTIGADOR.TEMA_TESIS%TYPE,

    Pnombre_usuario    IN USUARIO.NOMBRE_USUARIO%TYPE,
    Pcontrasena        IN USUARIO.CONTRASENA%TYPE,
    Pactivo            IN USUARIO.ACTIVO%TYPE,

    Pid_entidad_cert   IN CERTIFICACION.ID_ENTIDAD%TYPE,
    Pnombre_cert       IN CERTIFICACION.NOMBRE_CERTIFICACION%TYPE,
    Ptipo_cert         IN CERTIFICACION.ID_CODIGO_TIPO_CERTIFICACION%TYPE,
    Pfecha_exp_cert    IN CERTIFICACION.FECHA_EXPIRACION%TYPE,
    Pestado_cert       IN CERTIFICACION.ID_CODIGO_TIPO_ESTADO%TYPE
)
IS
    v_id_empleado     EMPLEADO.ID_EMPLEADO%TYPE;
    v_id_investigador INVESTIGADOR.ID_INVESTIGADOR%TYPE;
    v_id_usuario      USUARIO.ID_USUARIO%TYPE;
    v_id_rol          ROL.ID_ROL%TYPE;
BEGIN
    PRC_INS_EMPLEADO(
        Pnombre_completo,
        Pnacionalidad,
        Pid_tipo_id,
        Pidentificacion,
        Pcorreo,
        Pid_grado_acad,
        Ptelefono,
        v_id_empleado
    );

    PRC_INS_INVESTIGADOR(
        v_id_empleado,
        Pinstitucion,
        Punidad_academica,
        Ptema_tesis,
        v_id_investigador
    );

    PRC_INS_USUARIO(
        v_id_empleado,
        Pnombre_usuario,
        Pcontrasena,
        Pactivo,
        v_id_usuario
    );

    SELECT ID_ROL
    INTO v_id_rol
    FROM ROL
    WHERE UPPER(NOMBRE_ROL) = 'INVESTIGADOR';

    INSERT INTO ROL_USUARIO (
        ID_ROL_USUARIO,
        ID_USUARIO,
        ID_ROL
    )
    VALUES (
        SEC_ROL_USUARIO.NEXTVAL,
        v_id_usuario,
        v_id_rol
    );

    PRC_INS_CERTIFICACION(
        v_id_investigador,
        Pid_entidad_cert,
        Pnombre_cert,
        Ptipo_cert,
        Pfecha_exp_cert,
        Pestado_cert
    );

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
/

exit