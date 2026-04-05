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

prompt === USUARIO OBJETIVO ===
select id_usuario, nombre_usuario
from usuario
where lower(nombre_usuario)=lower('pruebaf@ucr.ac.cr');

prompt === TIPOS RELACIONADOS ===
select id_tipo, nombre
from tipo
where nombre in ('INFORME','ACREDITACION','PERMISO_COORDINADOR','TIPO_CERTIFICACION','TIPO_INFORME','ESTADO_INFORME')
order by id_tipo;

prompt === CODIGOS DISPONIBLES PARA CATEGORIA/PRIORIDAD (MUESTRA RAPIDA) ===
select c.id_codigo, t.nombre as tipo, c.despliegue, c.valor
from codigo c
join tipo t on t.id_tipo=c.id_tipo
where t.nombre in ('INFORME','ACREDITACION','PERMISO_COORDINADOR','TIPO_CERTIFICACION','TIPO_INFORME')
order by c.id_codigo;

prompt === SECUENCIAS ===
select sequence_name
from user_sequences
where sequence_name in ('SEC_NOTIFICACION','SEC_NOTIFICACION_USUARIO');

DECLARE
  v_tipo_prioridad NUMBER;
  v_tipo_informe NUMBER;
  v_tipo_acreditacion NUMBER;
  v_tipo_permiso NUMBER;
  v_user_id NUMBER;

  v_cat_informe NUMBER;
  v_cat_acreditacion NUMBER;
  v_cat_permiso NUMBER;

  v_pri_alta NUMBER;
  v_pri_media NUMBER;
  v_pri_baja NUMBER;

  v_notif_id NUMBER;

  PROCEDURE ins_notif(p_cat NUMBER, p_pri NUMBER, p_asunto VARCHAR2, p_mensaje VARCHAR2, p_fecha DATE) IS
  BEGIN
    SELECT SEC_NOTIFICACION.NEXTVAL INTO v_notif_id FROM dual;

    INSERT INTO NOTIFICACION(
      ID_NOTIFICACION,
      ID_CODIGO_TIPO_CATEGORIA,
      ID_CODIGO_TIPO_PRIORIDAD,
      ASUNTO,
      MENSAJE,
      FECHA_CREACION
    ) VALUES (
      v_notif_id,
      p_cat,
      p_pri,
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
  SELECT id_usuario INTO v_user_id FROM USUARIO WHERE lower(NOMBRE_USUARIO) = lower('pruebaf@ucr.ac.cr');

  SELECT id_tipo INTO v_tipo_informe FROM TIPO WHERE NOMBRE = 'INFORME';
  SELECT id_tipo INTO v_tipo_acreditacion FROM TIPO WHERE NOMBRE = 'ACREDITACION';
  SELECT id_tipo INTO v_tipo_permiso FROM TIPO WHERE NOMBRE = 'PERMISO_COORDINADOR';

  BEGIN
    SELECT id_tipo INTO v_tipo_prioridad FROM TIPO WHERE NOMBRE = 'PRIORIDAD_NOTIFICACION';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      SELECT SEC_TIPO.NEXTVAL INTO v_tipo_prioridad FROM dual;
      INSERT INTO TIPO(ID_TIPO, NOMBRE) VALUES (v_tipo_prioridad, 'PRIORIDAD_NOTIFICACION');
  END;

  INSERT INTO CODIGO(ID_CODIGO, ID_TIPO, DESPLIEGUE, TIPO_VALOR, VALOR)
  SELECT SEC_CODIGO.NEXTVAL, v_tipo_informe, 'Informe', 'V', 'INFORME' FROM dual
  WHERE NOT EXISTS (SELECT 1 FROM CODIGO WHERE ID_TIPO = v_tipo_informe AND VALOR = 'INFORME');

  INSERT INTO CODIGO(ID_CODIGO, ID_TIPO, DESPLIEGUE, TIPO_VALOR, VALOR)
  SELECT SEC_CODIGO.NEXTVAL, v_tipo_acreditacion, 'Acreditacion', 'V', 'ACREDITACION' FROM dual
  WHERE NOT EXISTS (SELECT 1 FROM CODIGO WHERE ID_TIPO = v_tipo_acreditacion AND VALOR = 'ACREDITACION');

  INSERT INTO CODIGO(ID_CODIGO, ID_TIPO, DESPLIEGUE, TIPO_VALOR, VALOR)
  SELECT SEC_CODIGO.NEXTVAL, v_tipo_permiso, 'Permiso Coordinador', 'V', 'PERMISO_COORDINADOR' FROM dual
  WHERE NOT EXISTS (SELECT 1 FROM CODIGO WHERE ID_TIPO = v_tipo_permiso AND VALOR = 'PERMISO_COORDINADOR');

  INSERT INTO CODIGO(ID_CODIGO, ID_TIPO, DESPLIEGUE, TIPO_VALOR, VALOR)
  SELECT SEC_CODIGO.NEXTVAL, v_tipo_prioridad, 'Alta', 'V', 'ALTA' FROM dual
  WHERE NOT EXISTS (SELECT 1 FROM CODIGO WHERE ID_TIPO = v_tipo_prioridad AND VALOR = 'ALTA');

  INSERT INTO CODIGO(ID_CODIGO, ID_TIPO, DESPLIEGUE, TIPO_VALOR, VALOR)
  SELECT SEC_CODIGO.NEXTVAL, v_tipo_prioridad, 'Media', 'V', 'MEDIA' FROM dual
  WHERE NOT EXISTS (SELECT 1 FROM CODIGO WHERE ID_TIPO = v_tipo_prioridad AND VALOR = 'MEDIA');

  INSERT INTO CODIGO(ID_CODIGO, ID_TIPO, DESPLIEGUE, TIPO_VALOR, VALOR)
  SELECT SEC_CODIGO.NEXTVAL, v_tipo_prioridad, 'Baja', 'V', 'BAJA' FROM dual
  WHERE NOT EXISTS (SELECT 1 FROM CODIGO WHERE ID_TIPO = v_tipo_prioridad AND VALOR = 'BAJA');

  SELECT ID_CODIGO INTO v_cat_informe FROM CODIGO WHERE ID_TIPO = v_tipo_informe AND VALOR = 'INFORME';
  SELECT ID_CODIGO INTO v_cat_acreditacion FROM CODIGO WHERE ID_TIPO = v_tipo_acreditacion AND VALOR = 'ACREDITACION';
  SELECT ID_CODIGO INTO v_cat_permiso FROM CODIGO WHERE ID_TIPO = v_tipo_permiso AND VALOR = 'PERMISO_COORDINADOR';

  SELECT ID_CODIGO INTO v_pri_alta FROM CODIGO WHERE ID_TIPO = v_tipo_prioridad AND VALOR = 'ALTA';
  SELECT ID_CODIGO INTO v_pri_media FROM CODIGO WHERE ID_TIPO = v_tipo_prioridad AND VALOR = 'MEDIA';
  SELECT ID_CODIGO INTO v_pri_baja FROM CODIGO WHERE ID_TIPO = v_tipo_prioridad AND VALOR = 'BAJA';

  ins_notif(
    v_cat_informe,
    v_pri_alta,
    'Informe proximo - Codigo de proyecto: C1766',
    'Numero de informe: 1; Fecha de presentacion: 10-04-2026',
    TRUNC(SYSDATE)
  );

  ins_notif(
    v_cat_informe,
    v_pri_media,
    'Informe final - Codigo de proyecto: C2001',
    'Numero de informe: 2; Fecha de presentacion: 18-04-2026',
    TRUNC(SYSDATE)-1
  );

  ins_notif(
    v_cat_acreditacion,
    v_pri_alta,
    'Acreditacion o licencia por vencer',
    'Nombre de la acreditacion o licencia: Licencia Profesional; Fecha de expiracion: 08-04-2026; Nombre del investigador: Prueba F',
    TRUNC(SYSDATE)
  );

  ins_notif(
    v_cat_acreditacion,
    v_pri_media,
    'Acreditacion renovada',
    'Nombre de la acreditacion o licencia: Acreditacion; Fecha de expiracion: 25-04-2026; Nombre del investigador: Prueba F',
    TRUNC(SYSDATE)-2
  );

  ins_notif(
    v_cat_permiso,
    v_pri_alta,
    'Permiso coordinador activo',
    'Codigo de proyecto: C1766; Fecha de inicio: 06-04-2026; Fecha fin: 20-04-2026',
    TRUNC(SYSDATE)
  );

  ins_notif(
    v_cat_permiso,
    v_pri_baja,
    'Permiso coordinador proximo',
    'Codigo de proyecto: C3009; Fecha de inicio: 15-04-2026; Fecha fin: 30-04-2026',
    TRUNC(SYSDATE)-3
  );

  COMMIT;

  DBMS_OUTPUT.PUT_LINE('Notificaciones insertadas para usuario ID=' || v_user_id);
  DBMS_OUTPUT.PUT_LINE('Categoria Informe ID_CODIGO=' || v_cat_informe);
  DBMS_OUTPUT.PUT_LINE('Categoria Acreditacion ID_CODIGO=' || v_cat_acreditacion);
  DBMS_OUTPUT.PUT_LINE('Categoria Permiso ID_CODIGO=' || v_cat_permiso);
  DBMS_OUTPUT.PUT_LINE('Prioridades ALTA/MEDIA/BAJA=' || v_pri_alta || '/' || v_pri_media || '/' || v_pri_baja);
END;
/

prompt === ULTIMAS NOTIFICACIONES DEL USUARIO ===
col asunto format a45
col categoria format a24
col prioridad format a18
col mensaje format a90
select * from (
  select id_notificacion_usuario, nombre_usuario, categoria, prioridad, leido, eliminado, asunto, mensaje, fecha_creacion
  from rep_notificaciones_usuario
  where lower(nombre_usuario)=lower('pruebaf@ucr.ac.cr')
  order by id_notificacion_usuario desc
) where rownum <= 12;

exit
