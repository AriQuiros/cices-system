-- ============================================================
-- SCRIPT DE PRUEBA PARA NOTIFICACIONES
-- Usuario: pruebaf@ucr.ac.cr
-- Contraseña: Prueba2025!
-- ============================================================

conn cices/cices123

set serveroutput on
set pagesize 300
set linesize 220
set heading on

col nombre format a35
col nombre_usuario format a35

var v_user_id number

prompt === USUARIO OBJETIVO ===
select id_usuario, nombre_usuario
from usuario
where lower(nombre_usuario)=lower('pruebaf@ucr.ac.cr');

prompt === TIPOS RELACIONADOS ===
select id_tipo, nombre
from tipo
where nombre in ('CATEGORIA_NOTIFICACION','TIPO_CERTIFICACION','TIPO_INFORME','ESTADO_INFORME')
order by id_tipo;

prompt === CODIGOS DISPONIBLES PARA CATEGORIA (MUESTRA RAPIDA) ===
select c.id_codigo, t.nombre as tipo, c.despliegue, c.valor
from codigo c
join tipo t on t.id_tipo=c.id_tipo
where t.nombre in ('CATEGORIA_NOTIFICACION','TIPO_CERTIFICACION','TIPO_INFORME')
order by c.id_codigo;

prompt === SECUENCIAS ===
select sequence_name
from user_sequences
where sequence_name in ('SEC_NOTIFICACION','SEC_NOTIFICACION_USUARIO');

DECLARE
  v_username CONSTANT VARCHAR2(254) := 'pruebaf@ucr.ac.cr';
  v_password CONSTANT VARCHAR2(254) := 'Prueba2025!';

  v_tipo_categoria NUMBER;
  v_user_id NUMBER;
  v_empleado_id NUMBER;
  v_investigador_id NUMBER;
  v_codigo_tipo_id NUMBER;
  v_codigo_grado NUMBER;
  v_entidad_institucion NUMBER;
  v_entidad_unidad NUMBER;
  v_rol_direccion NUMBER;
  v_rol_investigador NUMBER;

  v_cat_informe NUMBER;
  v_cat_certificacion NUMBER;
  v_cat_permiso NUMBER;

  v_notif_id NUMBER;
  v_clave VARCHAR2(100);

  PROCEDURE ins_notif(p_ref NUMBER, p_cat NUMBER, p_asunto VARCHAR2, p_mensaje VARCHAR2, p_fecha DATE) IS
  BEGIN
    SELECT SEC_NOTIFICACION.NEXTVAL INTO v_notif_id FROM dual;
    v_clave := 'PRUEBA_' || p_cat || '_' || p_ref || '_' || TO_CHAR(SYSTIMESTAMP,'YYYYMMDDHH24MISSFF3');

    INSERT INTO NOTIFICACION(
      ID_NOTIFICACION,
      ID_REFERENCIA,
      CLAVE,
      ID_CODIGO_TIPO_CATEGORIA,
      ASUNTO,
      MENSAJE,
      FECHA_CREACION
    ) VALUES (
      v_notif_id,
      p_ref,
      v_clave,
      p_cat,
      p_asunto,
      p_mensaje,
      p_fecha
    );

    INSERT INTO NOTIFICACION_USUARIO(
      ID_NOTIFICACION_USUARIO,
      ID_NOTIFICACION,
      ID_USUARIO,
      LEIDO,
      ELIMINADO,
      FECHA_LEIDO
    ) VALUES (
      SEC_NOTIFICACION_USUARIO.NEXTVAL,
      v_notif_id,
      v_user_id,
      0,
      0,
      NULL
    );
  END;
BEGIN
  BEGIN
    SELECT id_usuario INTO v_user_id FROM usuario WHERE lower(nombre_usuario) = lower(v_username);
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      SELECT SEC_USUARIO.NEXTVAL INTO v_user_id FROM dual;

      INSERT INTO usuario (id_usuario, nombre_usuario, contrasena, activo)
      VALUES (v_user_id, v_username, v_password, 1);

      DBMS_OUTPUT.PUT_LINE('Usuario creado: ' || v_username || ' (ID=' || v_user_id || ')');
  END;

  BEGIN
    SELECT id_codigo
    INTO v_codigo_tipo_id
    FROM codigo c
    JOIN tipo t ON t.id_tipo = c.id_tipo
    WHERE t.nombre = 'TIPO_IDENTIFICACION' AND c.valor = 'NACIONAL';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      SELECT c.id_codigo
      INTO v_codigo_tipo_id
      FROM codigo c
      JOIN tipo t ON t.id_tipo = c.id_tipo
      WHERE t.nombre = 'TIPO_IDENTIFICACION' AND ROWNUM = 1;
  END;

  BEGIN
    SELECT id_codigo
    INTO v_codigo_grado
    FROM codigo c
    JOIN tipo t ON t.id_tipo = c.id_tipo
    WHERE t.nombre = 'GRADO_ACADEMICO' AND c.valor = 'LICENCIATURA';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      SELECT c.id_codigo
      INTO v_codigo_grado
      FROM codigo c
      JOIN tipo t ON t.id_tipo = c.id_tipo
      WHERE t.nombre = 'GRADO_ACADEMICO' AND ROWNUM = 1;
  END;

  BEGIN
    SELECT id_entidad INTO v_entidad_institucion
    FROM entidad
    WHERE UPPER(nombre) = 'UNIVERSIDAD DE COSTA RICA';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      BEGIN
        SELECT id_entidad INTO v_entidad_institucion FROM (
          SELECT id_entidad FROM entidad ORDER BY id_entidad
        ) WHERE ROWNUM = 1;
      EXCEPTION
        WHEN NO_DATA_FOUND THEN
          SELECT SEC_ENTIDAD.NEXTVAL INTO v_entidad_institucion FROM dual;
          INSERT INTO entidad (id_entidad, nombre, id_codigo_tipo_entidad)
          VALUES (v_entidad_institucion, 'Universidad de Costa Rica', NULL);
      END;
  END;

  BEGIN
    SELECT id_entidad INTO v_entidad_unidad
    FROM entidad
    WHERE UPPER(nombre) = 'CICES';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      v_entidad_unidad := v_entidad_institucion;
  END;

  BEGIN
    SELECT id_empleado INTO v_empleado_id FROM empleado WHERE id_usuario = v_user_id;
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      SELECT SEC_EMPLEADO.NEXTVAL INTO v_empleado_id FROM dual;

      INSERT INTO empleado (
        id_empleado,
        id_usuario,
        nombre_completo,
        identificacion,
        id_codigo_tipo_id,
        pais,
        correo,
        numero_telefono,
        id_codigo_tipo_grado_academico
      ) VALUES (
        v_empleado_id,
        v_user_id,
        'Usuario de Prueba F',
        'PF' || LPAD(v_user_id, 8, '0'),
        v_codigo_tipo_id,
        'CRI',
        v_username,
        '88888888',
        v_codigo_grado
      );
  END;

  BEGIN
    SELECT id_investigador INTO v_investigador_id FROM investigador WHERE id_empleado = v_empleado_id;
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      SELECT SEC_INVESTIGADOR.NEXTVAL INTO v_investigador_id FROM dual;

      INSERT INTO investigador (
        id_investigador,
        id_empleado,
        id_institucion_origen,
        id_unidad_academica,
        tema_interes
      ) VALUES (
        v_investigador_id,
        v_empleado_id,
        v_entidad_institucion,
        v_entidad_unidad,
        'Notificaciones de prueba'
      );
  END;

  BEGIN
    SELECT id_rol INTO v_rol_direccion FROM rol WHERE UPPER(nombre_rol) = 'DIRECCION';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      SELECT SEC_ROL.NEXTVAL INTO v_rol_direccion FROM dual;
      INSERT INTO rol (id_rol, nombre_rol) VALUES (v_rol_direccion, 'DIRECCION');
  END;

  BEGIN
    SELECT id_rol INTO v_rol_investigador FROM rol WHERE UPPER(nombre_rol) = 'INVESTIGADOR';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      SELECT SEC_ROL.NEXTVAL INTO v_rol_investigador FROM dual;
      INSERT INTO rol (id_rol, nombre_rol) VALUES (v_rol_investigador, 'INVESTIGADOR');
  END;

  INSERT INTO rol_usuario (id_rol_usuario, id_usuario, id_rol)
  SELECT SEC_ROL_USUARIO.NEXTVAL, v_user_id, v_rol_direccion
  FROM dual
  WHERE NOT EXISTS (
    SELECT 1 FROM rol_usuario WHERE id_usuario = v_user_id AND id_rol = v_rol_direccion
  );

  INSERT INTO rol_usuario (id_rol_usuario, id_usuario, id_rol)
  SELECT SEC_ROL_USUARIO.NEXTVAL, v_user_id, v_rol_investigador
  FROM dual
  WHERE NOT EXISTS (
    SELECT 1 FROM rol_usuario WHERE id_usuario = v_user_id AND id_rol = v_rol_investigador
  );

  DBMS_OUTPUT.PUT_LINE('Usuario objetivo ID=' || v_user_id || ', empleado ID=' || v_empleado_id || ', investigador ID=' || v_investigador_id);

  SELECT id_tipo INTO v_tipo_categoria FROM tipo WHERE nombre = 'CATEGORIA_NOTIFICACION';

  SELECT id_codigo INTO v_cat_informe
  FROM codigo
  WHERE id_tipo = v_tipo_categoria AND valor = 'INFORME';

  SELECT id_codigo INTO v_cat_certificacion
  FROM codigo
  WHERE id_tipo = v_tipo_categoria AND valor = 'CERTIFICACION';

  SELECT id_codigo INTO v_cat_permiso
  FROM codigo
  WHERE id_tipo = v_tipo_categoria AND valor = 'PERMISO_COORDINADOR';

  ins_notif(
    1766,
    v_cat_informe,
    'Informe proximo - Codigo de proyecto: C1766',
    'Numero de informe: 1; Fecha de presentacion: 10-04-2026',
    TRUNC(SYSDATE)
  );

  ins_notif(
    2001,
    v_cat_informe,
    'Informe final - Codigo de proyecto: C2001',
    'Numero de informe: 2; Fecha de presentacion: 18-04-2026',
    TRUNC(SYSDATE)-1
  );

  ins_notif(
    3001,
    v_cat_certificacion,
    'Acreditacion o licencia por vencer',
    'Nombre de la acreditacion o licencia: Licencia Profesional; Fecha de expiracion: 08-04-2026; Nombre del investigador: Prueba F',
    TRUNC(SYSDATE)
  );

  ins_notif(
    3002,
    v_cat_certificacion,
    'Acreditacion renovada',
    'Nombre de la acreditacion o licencia: Acreditacion; Fecha de expiracion: 25-04-2026; Nombre del investigador: Prueba F',
    TRUNC(SYSDATE)-2
  );

  ins_notif(
    1766,
    v_cat_permiso,
    'Permiso coordinador activo',
    'Codigo de proyecto: C1766; Fecha de inicio: 06-04-2026; Fecha fin: 20-04-2026',
    TRUNC(SYSDATE)
  );

  ins_notif(
    3009,
    v_cat_permiso,
    'Permiso coordinador proximo',
    'Codigo de proyecto: C3009; Fecha de inicio: 15-04-2026; Fecha fin: 30-04-2026',
    TRUNC(SYSDATE)-3
  );

  COMMIT;

  :v_user_id := v_user_id;

  DBMS_OUTPUT.PUT_LINE('Notificaciones insertadas para usuario ID=' || v_user_id);
  DBMS_OUTPUT.PUT_LINE('Categoria Informe ID_CODIGO=' || v_cat_informe);
  DBMS_OUTPUT.PUT_LINE('Categoria Certificacion ID_CODIGO=' || v_cat_certificacion);
  DBMS_OUTPUT.PUT_LINE('Categoria Permiso ID_CODIGO=' || v_cat_permiso);
END;
/

prompt === ULTIMAS NOTIFICACIONES DEL USUARIO ===
col asunto format a45
col categoria format a24
col mensaje format a90
select * from (
  select id_notificacion_usuario, nombre_usuario, categoria, leido, eliminado, asunto, mensaje, fecha_creacion
  from rep_notificaciones_usuario
  where id_usuario = :v_user_id
  order by id_notificacion_usuario desc
) where rownum <= 12;

exit
