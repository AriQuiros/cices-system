-- sqlplus system/root @insertar_usuarios.sql
--requiere ejecutar antes sqlplus system/root @CICESBD.sql

conn cices/cices123
SET DEFINE OFF
WHENEVER SQLERROR CONTINUE

/* =====================================================
   INVESTIGADOR 1: Vivian Vilchez Barboza (110270978)
   ===================================================== */
DECLARE
  v_id_empleado NUMBER; v_id_empleado_exist NUMBER;
  v_id_invest NUMBER; v_id_invest_exist NUMBER;
  v_id_usuario NUMBER; v_id_usuario_exist NUMBER;
  v_id_tipo_id NUMBER; v_id_grado NUMBER;
  v_id_cert_tipo NUMBER; v_id_cert_estado NUMBER;
  v_id_rol NUMBER;
BEGIN
  SELECT ID_CODIGO INTO v_id_tipo_id FROM CODIGO
    WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='IDENTIFICACION')
      AND UPPER(DESPLIEGUE)='NACIONAL';
  SELECT ID_CODIGO INTO v_id_grado FROM CODIGO
    WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='GRADO ACADEMICO')
      AND UPPER(DESPLIEGUE)='DOCTORADO';
  SELECT ID_CODIGO INTO v_id_cert_tipo FROM CODIGO
    WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='TIPO CERTIFICACION')
      AND UPPER(DESPLIEGUE)='LICENCIA PROFESIONAL';
  SELECT ID_CODIGO INTO v_id_cert_estado FROM CODIGO
    WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='ESTADO CERTIFICACION')
      AND UPPER(DESPLIEGUE)='VIGENTE';

  BEGIN
    SELECT ID_EMPLEADO INTO v_id_empleado_exist FROM EMPLEADO WHERE IDENTIFICACION='110270978';
    v_id_empleado := v_id_empleado_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_EMPLEADO.NEXTVAL INTO v_id_empleado FROM DUAL;
    PRC_INS_EMPLEADO(v_id_empleado,'Vivian Vilchez Barboza','Costarricense',v_id_tipo_id,'110270978','vivian.vilchez@ucr.ac.cr','88881002');
  END;

  BEGIN
    SELECT ID_INVESTIGADOR INTO v_id_invest_exist FROM INVESTIGADOR WHERE ID_EMPLEADO=v_id_empleado;
    v_id_invest := v_id_invest_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_INVESTIGADOR.NEXTVAL INTO v_id_invest FROM DUAL;
    PRC_INS_INVESTIGADOR(v_id_invest,v_id_empleado,'Facultad de Ciencias Sociales','Universidad de Costa Rica',v_id_grado);
  END;

  BEGIN
    SELECT ID_USUARIO INTO v_id_usuario_exist FROM USUARIO WHERE ID_EMPLEADO=v_id_empleado;
    v_id_usuario := v_id_usuario_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_USUARIO.NEXTVAL INTO v_id_usuario FROM DUAL;
    INSERT INTO USUARIO(ID_USUARIO,ID_EMPLEADO,NOMBRE_USUARIO,CONTRASENA,ACTIVO)
    VALUES(v_id_usuario,v_id_empleado,'vivian.vilchez','$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',1);
  END;

  SELECT ID_ROL INTO v_id_rol FROM ROL WHERE UPPER(NOMBRE_ROL)='INVESTIGADOR';
  BEGIN
    DECLARE v_tmp NUMBER; BEGIN
      SELECT 1 INTO v_tmp FROM ROL_USUARIO WHERE ID_USUARIO=v_id_usuario AND ID_ROL=v_id_rol;
    EXCEPTION WHEN NO_DATA_FOUND THEN
      INSERT INTO ROL_USUARIO(ID_ROL_USUARIO,ID_USUARIO,ID_ROL) VALUES(SEC_ROL_USUARIO.NEXTVAL,v_id_usuario,v_id_rol);
    END;
  END;

  PRC_INS_CERTIFICACION(SEC_CERTIFICACION.NEXTVAL,v_id_invest,'Buenas prácticas de laboratorio',v_id_cert_tipo,TO_DATE('2027-06-15','YYYY-MM-DD'),v_id_cert_estado);
END;
/
 
/* =====================================================
   INVESTIGADOR 2: Yamileth Chacón Araya (105540538)
   ===================================================== */
DECLARE
  v_id_empleado NUMBER; v_id_empleado_exist NUMBER;
  v_id_invest NUMBER; v_id_invest_exist NUMBER;
  v_id_usuario NUMBER; v_id_usuario_exist NUMBER;
  v_id_tipo_id NUMBER; v_id_grado NUMBER;
  v_id_cert_tipo NUMBER; v_id_cert_estado NUMBER;
  v_id_rol NUMBER;
BEGIN
  SELECT ID_CODIGO INTO v_id_tipo_id FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='IDENTIFICACION') AND UPPER(DESPLIEGUE)='NACIONAL';
  SELECT ID_CODIGO INTO v_id_grado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='GRADO ACADEMICO') AND UPPER(DESPLIEGUE)='DOCTORADO';
  SELECT ID_CODIGO INTO v_id_cert_tipo FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='TIPO CERTIFICACION') AND UPPER(DESPLIEGUE)='LICENCIA PROFESIONAL';
  SELECT ID_CODIGO INTO v_id_cert_estado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='ESTADO CERTIFICACION') AND UPPER(DESPLIEGUE)='VIGENTE';

  BEGIN
    SELECT ID_EMPLEADO INTO v_id_empleado_exist FROM EMPLEADO WHERE IDENTIFICACION='105540538';
    v_id_empleado := v_id_empleado_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_EMPLEADO.NEXTVAL INTO v_id_empleado FROM DUAL;
    PRC_INS_EMPLEADO(v_id_empleado,'Yamileth Chacón Araya','Costarricense',v_id_tipo_id,'105540538','yamileth.chacon@ucr.ac.cr','88881003');
  END;

  BEGIN
    SELECT ID_INVESTIGADOR INTO v_id_invest_exist FROM INVESTIGADOR WHERE ID_EMPLEADO=v_id_empleado;
    v_id_invest := v_id_invest_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_INVESTIGADOR.NEXTVAL INTO v_id_invest FROM DUAL;
    PRC_INS_INVESTIGADOR(v_id_invest,v_id_empleado,'Facultad de Educación','Universidad de Costa Rica',v_id_grado);
  END;

  BEGIN
    SELECT ID_USUARIO INTO v_id_usuario_exist FROM USUARIO WHERE ID_EMPLEADO=v_id_empleado;
    v_id_usuario := v_id_usuario_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_USUARIO.NEXTVAL INTO v_id_usuario FROM DUAL;
    INSERT INTO USUARIO(ID_USUARIO,ID_EMPLEADO,NOMBRE_USUARIO,CONTRASENA,ACTIVO)
    VALUES(v_id_usuario,v_id_empleado,'yamileth.chacon','$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',1);
  END;

  SELECT ID_ROL INTO v_id_rol FROM ROL WHERE UPPER(NOMBRE_ROL)='INVESTIGADOR';
  BEGIN
    DECLARE v_tmp NUMBER; BEGIN
      SELECT 1 INTO v_tmp FROM ROL_USUARIO WHERE ID_USUARIO=v_id_usuario AND ID_ROL=v_id_rol;
    EXCEPTION WHEN NO_DATA_FOUND THEN
      INSERT INTO ROL_USUARIO(ID_ROL_USUARIO,ID_USUARIO,ID_ROL) VALUES(SEC_ROL_USUARIO.NEXTVAL,v_id_usuario,v_id_rol);
    END;
  END;

  PRC_INS_CERTIFICACION(SEC_CERTIFICACION.NEXTVAL,v_id_invest,'Investigación cualitativa avanzada',v_id_cert_tipo,TO_DATE('2025-10-10','YYYY-MM-DD'),v_id_cert_estado);
END;
/
 
/* =====================================================
   INVESTIGADOR 3: Cynthia Córdoba López (303910277)
   ===================================================== */
DECLARE
  v_id_empleado NUMBER; v_id_empleado_exist NUMBER;
  v_id_invest NUMBER; v_id_invest_exist NUMBER;
  v_id_usuario NUMBER; v_id_usuario_exist NUMBER;
  v_id_tipo_id NUMBER; v_id_grado NUMBER;
  v_id_cert_tipo NUMBER; v_id_cert_estado NUMBER;
  v_id_rol NUMBER;
BEGIN
  SELECT ID_CODIGO INTO v_id_tipo_id FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='IDENTIFICACION') AND UPPER(DESPLIEGUE)='NACIONAL';
  SELECT ID_CODIGO INTO v_id_grado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='GRADO ACADEMICO') AND UPPER(DESPLIEGUE)='LICENCIATURA';
  SELECT ID_CODIGO INTO v_id_cert_tipo FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='TIPO CERTIFICACION') AND UPPER(DESPLIEGUE)='LICENCIA PROFESIONAL';
  SELECT ID_CODIGO INTO v_id_cert_estado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='ESTADO CERTIFICACION') AND UPPER(DESPLIEGUE)='VIGENTE';

  BEGIN
    SELECT ID_EMPLEADO INTO v_id_empleado_exist FROM EMPLEADO WHERE IDENTIFICACION='303910277';
    v_id_empleado := v_id_empleado_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_EMPLEADO.NEXTVAL INTO v_id_empleado FROM DUAL;
    PRC_INS_EMPLEADO(v_id_empleado,'Cynthia Córdoba López','Costarricense',v_id_tipo_id,'303910277','cynthia.cordoba@ucr.ac.cr','88881004');
  END;

  BEGIN
    SELECT ID_INVESTIGADOR INTO v_id_invest_exist FROM INVESTIGADOR WHERE ID_EMPLEADO=v_id_empleado;
    v_id_invest := v_id_invest_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_INVESTIGADOR.NEXTVAL INTO v_id_invest FROM DUAL;
    PRC_INS_INVESTIGADOR(v_id_invest,v_id_empleado,'Escuela de Psicología','Universidad de Costa Rica',v_id_grado);
  END;

  BEGIN
    SELECT ID_USUARIO INTO v_id_usuario_exist FROM USUARIO WHERE ID_EMPLEADO=v_id_empleado;
    v_id_usuario := v_id_usuario_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_USUARIO.NEXTVAL INTO v_id_usuario FROM DUAL;
    INSERT INTO USUARIO(ID_USUARIO,ID_EMPLEADO,NOMBRE_USUARIO,CONTRASENA,ACTIVO)
    VALUES(v_id_usuario,v_id_empleado,'cynthia.cordoba','$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',1);
  END;

  SELECT ID_ROL INTO v_id_rol FROM ROL WHERE UPPER(NOMBRE_ROL)='INVESTIGADOR';
  BEGIN
    DECLARE v_tmp NUMBER; BEGIN
      SELECT 1 INTO v_tmp FROM ROL_USUARIO WHERE ID_USUARIO=v_id_usuario AND ID_ROL=v_id_rol;
    EXCEPTION WHEN NO_DATA_FOUND THEN
      INSERT INTO ROL_USUARIO(ID_ROL_USUARIO,ID_USUARIO,ID_ROL) VALUES(SEC_ROL_USUARIO.NEXTVAL,v_id_usuario,v_id_rol);
    END;
  END;

  PRC_INS_CERTIFICACION(SEC_CERTIFICACION.NEXTVAL,v_id_invest,'Ética y consentimiento informado',v_id_cert_tipo,TO_DATE('2027-03-05','YYYY-MM-DD'),v_id_cert_estado);
END;
/
 
/* =====================================================
   INVESTIGADOR 4: Ana Laura Solano López (304050852)
   ===================================================== */
DECLARE
  v_id_empleado NUMBER; v_id_empleado_exist NUMBER;
  v_id_invest NUMBER; v_id_invest_exist NUMBER;
  v_id_usuario NUMBER; v_id_usuario_exist NUMBER;
  v_id_tipo_id NUMBER; v_id_grado NUMBER;
  v_id_cert_tipo NUMBER; v_id_cert_estado NUMBER;
  v_id_rol NUMBER;
BEGIN
  SELECT ID_CODIGO INTO v_id_tipo_id FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='IDENTIFICACION') AND UPPER(DESPLIEGUE)='NACIONAL';
  SELECT ID_CODIGO INTO v_id_grado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='GRADO ACADEMICO') AND UPPER(DESPLIEGUE)='DOCTORADO';
  SELECT ID_CODIGO INTO v_id_cert_tipo FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='TIPO CERTIFICACION') AND UPPER(DESPLIEGUE)='LICENCIA PROFESIONAL';
  SELECT ID_CODIGO INTO v_id_cert_estado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='ESTADO CERTIFICACION') AND UPPER(DESPLIEGUE)='VIGENTE';

  BEGIN
    SELECT ID_EMPLEADO INTO v_id_empleado_exist FROM EMPLEADO WHERE IDENTIFICACION='304050852';
    v_id_empleado := v_id_empleado_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_EMPLEADO.NEXTVAL INTO v_id_empleado FROM DUAL;
    PRC_INS_EMPLEADO(v_id_empleado,'Ana Laura Solano López','Costarricense',v_id_tipo_id,'304050852','ana.solano@ucr.ac.cr','88881005');
  END;

  BEGIN
    SELECT ID_INVESTIGADOR INTO v_id_invest_exist FROM INVESTIGADOR WHERE ID_EMPLEADO=v_id_empleado;
    v_id_invest := v_id_invest_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_INVESTIGADOR.NEXTVAL INTO v_id_invest FROM DUAL;
    PRC_INS_INVESTIGADOR(v_id_invest,v_id_empleado,'Facultad de Ciencias Sociales','Universidad de Costa Rica',v_id_grado);
  END;

  BEGIN
    SELECT ID_USUARIO INTO v_id_usuario_exist FROM USUARIO WHERE ID_EMPLEADO=v_id_empleado;
    v_id_usuario := v_id_usuario_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_USUARIO.NEXTVAL INTO v_id_usuario FROM DUAL;
    INSERT INTO USUARIO(ID_USUARIO,ID_EMPLEADO,NOMBRE_USUARIO,CONTRASENA,ACTIVO)
    VALUES(v_id_usuario,v_id_empleado,'ana.solano','$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',1);
  END;

  SELECT ID_ROL INTO v_id_rol FROM ROL WHERE UPPER(NOMBRE_ROL)='INVESTIGADOR';
  BEGIN
    DECLARE v_tmp NUMBER; BEGIN
      SELECT 1 INTO v_tmp FROM ROL_USUARIO WHERE ID_USUARIO=v_id_usuario AND ID_ROL=v_id_rol;
    EXCEPTION WHEN NO_DATA_FOUND THEN
      INSERT INTO ROL_USUARIO(ID_ROL_USUARIO,ID_USUARIO,ID_ROL) VALUES(SEC_ROL_USUARIO.NEXTVAL,v_id_usuario,v_id_rol);
    END;
  END;

  PRC_INS_CERTIFICACION(SEC_CERTIFICACION.NEXTVAL,v_id_invest,'Bioestadística aplicada',v_id_cert_tipo,TO_DATE('2026-09-01','YYYY-MM-DD'),v_id_cert_estado);
END;
/
 
/* =====================================================
   INVESTIGADOR 5: Sedali Solís Agüero (109770013)
   ===================================================== */
DECLARE
  v_id_empleado NUMBER; v_id_empleado_exist NUMBER;
  v_id_invest NUMBER; v_id_invest_exist NUMBER;
  v_id_usuario NUMBER; v_id_usuario_exist NUMBER;
  v_id_tipo_id NUMBER; v_id_grado NUMBER;
  v_id_cert_tipo NUMBER; v_id_cert_estado NUMBER;
  v_id_rol NUMBER;
BEGIN
  SELECT ID_CODIGO INTO v_id_tipo_id FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='IDENTIFICACION') AND UPPER(DESPLIEGUE)='NACIONAL';
  SELECT ID_CODIGO INTO v_id_grado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='GRADO ACADEMICO') AND UPPER(DESPLIEGUE)='MAESTRIA';
  SELECT ID_CODIGO INTO v_id_cert_tipo FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='TIPO CERTIFICACION') AND UPPER(DESPLIEGUE)='LICENCIA PROFESIONAL';
  SELECT ID_CODIGO INTO v_id_cert_estado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='ESTADO CERTIFICACION') AND UPPER(DESPLIEGUE)='VIGENTE';

  BEGIN
    SELECT ID_EMPLEADO INTO v_id_empleado_exist FROM EMPLEADO WHERE IDENTIFICACION='109770013';
    v_id_empleado := v_id_empleado_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_EMPLEADO.NEXTVAL INTO v_id_empleado FROM DUAL;
    PRC_INS_EMPLEADO(v_id_empleado,'Sedali Solís Agüero','Costarricense',v_id_tipo_id,'109770013','sedali.solis@ucr.ac.cr','88881006');
  END;

  BEGIN
    SELECT ID_INVESTIGADOR INTO v_id_invest_exist FROM INVESTIGADOR WHERE ID_EMPLEADO=v_id_empleado;
    v_id_invest := v_id_invest_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_INVESTIGADOR.NEXTVAL INTO v_id_invest FROM DUAL;
    PRC_INS_INVESTIGADOR(v_id_invest,v_id_empleado,'Facultad de Ciencias Económicas','Universidad de Costa Rica',v_id_grado);
  END;

  BEGIN
    SELECT ID_USUARIO INTO v_id_usuario_exist FROM USUARIO WHERE ID_EMPLEADO=v_id_empleado;
    v_id_usuario := v_id_usuario_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_USUARIO.NEXTVAL INTO v_id_usuario FROM DUAL;
    INSERT INTO USUARIO(ID_USUARIO,ID_EMPLEADO,NOMBRE_USUARIO,CONTRASENA,ACTIVO)
    VALUES(v_id_usuario,v_id_empleado,'sedali.solis','$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',1);
  END;

  SELECT ID_ROL INTO v_id_rol FROM ROL WHERE UPPER(NOMBRE_ROL)='INVESTIGADOR';
  BEGIN
    DECLARE v_tmp NUMBER; BEGIN
      SELECT 1 INTO v_tmp FROM ROL_USUARIO WHERE ID_USUARIO=v_id_usuario AND ID_ROL=v_id_rol;
    EXCEPTION WHEN NO_DATA_FOUND THEN
      INSERT INTO ROL_USUARIO(ID_ROL_USUARIO,ID_USUARIO,ID_ROL) VALUES(SEC_ROL_USUARIO.NEXTVAL,v_id_usuario,v_id_rol);
    END;
  END;

  PRC_INS_CERTIFICACION(SEC_CERTIFICACION.NEXTVAL,v_id_invest,'Gestión de proyectos de investigación',v_id_cert_tipo,TO_DATE('2026-05-20','YYYY-MM-DD'),v_id_cert_estado);
END;
/
 
/* =====================================================
   INVESTIGADOR 6: Ingrid Gómez Duarte (108660046)
   ===================================================== */
DECLARE
  v_id_empleado NUMBER; v_id_empleado_exist NUMBER;
  v_id_invest NUMBER; v_id_invest_exist NUMBER;
  v_id_usuario NUMBER; v_id_usuario_exist NUMBER;
  v_id_tipo_id NUMBER; v_id_grado NUMBER;
  v_id_cert_tipo NUMBER; v_id_cert_estado NUMBER;
  v_id_rol NUMBER;
BEGIN
  SELECT ID_CODIGO INTO v_id_tipo_id FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='IDENTIFICACION') AND UPPER(DESPLIEGUE)='NACIONAL';
  SELECT ID_CODIGO INTO v_id_grado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='GRADO ACADEMICO') AND UPPER(DESPLIEGUE)='DOCTORADO';
  SELECT ID_CODIGO INTO v_id_cert_tipo FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='TIPO CERTIFICACION') AND UPPER(DESPLIEGUE)='LICENCIA PROFESIONAL';
  SELECT ID_CODIGO INTO v_id_cert_estado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='ESTADO CERTIFICACION') AND UPPER(DESPLIEGUE)='VIGENTE';

  BEGIN
    SELECT ID_EMPLEADO INTO v_id_empleado_exist FROM EMPLEADO WHERE IDENTIFICACION='108660046';
    v_id_empleado := v_id_empleado_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_EMPLEADO.NEXTVAL INTO v_id_empleado FROM DUAL;
    PRC_INS_EMPLEADO(v_id_empleado,'Ingrid Gómez Duarte','Costarricense',v_id_tipo_id,'108660046','ingrid.gomez@ucr.ac.cr','88881007');
  END;

  BEGIN
    SELECT ID_INVESTIGADOR INTO v_id_invest_exist FROM INVESTIGADOR WHERE ID_EMPLEADO=v_id_empleado;
    v_id_invest := v_id_invest_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_INVESTIGADOR.NEXTVAL INTO v_id_invest FROM DUAL;
    PRC_INS_INVESTIGADOR(v_id_invest,v_id_empleado,'Escuela de Medicina','Universidad de Costa Rica',v_id_grado);
  END;

  BEGIN
    SELECT ID_USUARIO INTO v_id_usuario_exist FROM USUARIO WHERE ID_EMPLEADO=v_id_empleado;
    v_id_usuario := v_id_usuario_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_USUARIO.NEXTVAL INTO v_id_usuario FROM DUAL;
    INSERT INTO USUARIO(ID_USUARIO,ID_EMPLEADO,NOMBRE_USUARIO,CONTRASENA,ACTIVO)
    VALUES(v_id_usuario,v_id_empleado,'ingrid.gomez','$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',1);
  END;

  SELECT ID_ROL INTO v_id_rol FROM ROL WHERE UPPER(NOMBRE_ROL)='INVESTIGADOR';
  BEGIN
    DECLARE v_tmp NUMBER; BEGIN
      SELECT 1 INTO v_tmp FROM ROL_USUARIO WHERE ID_USUARIO=v_id_usuario AND ID_ROL=v_id_rol;
    EXCEPTION WHEN NO_DATA_FOUND THEN
      INSERT INTO ROL_USUARIO(ID_ROL_USUARIO,ID_USUARIO,ID_ROL) VALUES(SEC_ROL_USUARIO.NEXTVAL,v_id_usuario,v_id_rol);
    END;
  END;

  PRC_INS_CERTIFICACION(SEC_CERTIFICACION.NEXTVAL,v_id_invest,'Ensayos clínicos',v_id_cert_tipo,TO_DATE('2026-11-12','YYYY-MM-DD'),v_id_cert_estado);
END;
/
 
/* =====================================================
   INVESTIGADOR 7: Eiliana Montero Rojas (105910052)
   ===================================================== */
DECLARE
  v_id_empleado NUMBER; v_id_empleado_exist NUMBER;
  v_id_invest NUMBER; v_id_invest_exist NUMBER;
  v_id_usuario NUMBER; v_id_usuario_exist NUMBER;
  v_id_tipo_id NUMBER; v_id_grado NUMBER;
  v_id_cert_tipo NUMBER; v_id_cert_estado NUMBER;
  v_id_rol NUMBER;
BEGIN
  SELECT ID_CODIGO INTO v_id_tipo_id FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='IDENTIFICACION') AND UPPER(DESPLIEGUE)='NACIONAL';
  SELECT ID_CODIGO INTO v_id_grado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='GRADO ACADEMICO') AND UPPER(DESPLIEGUE)='DOCTORADO';
  SELECT ID_CODIGO INTO v_id_cert_tipo FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='TIPO CERTIFICACION') AND UPPER(DESPLIEGUE)='LICENCIA PROFESIONAL';
  SELECT ID_CODIGO INTO v_id_cert_estado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='ESTADO CERTIFICACION') AND UPPER(DESPLIEGUE)='VIGENTE';

  BEGIN
    SELECT ID_EMPLEADO INTO v_id_empleado_exist FROM EMPLEADO WHERE IDENTIFICACION='105910052';
    v_id_empleado := v_id_empleado_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_EMPLEADO.NEXTVAL INTO v_id_empleado FROM DUAL;
    PRC_INS_EMPLEADO(v_id_empleado,'Eiliana Montero Rojas','Costarricense',v_id_tipo_id,'105910052','eiliana.montero@ucr.ac.cr','88881008');
  END;

  BEGIN
    SELECT ID_INVESTIGADOR INTO v_id_invest_exist FROM INVESTIGADOR WHERE ID_EMPLEADO=v_id_empleado;
    v_id_invest := v_id_invest_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_INVESTIGADOR.NEXTVAL INTO v_id_invest FROM DUAL;
    PRC_INS_INVESTIGADOR(v_id_invest,v_id_empleado,'Facultad de Ciencias','Universidad de Costa Rica',v_id_grado);
  END;

  BEGIN
    SELECT ID_USUARIO INTO v_id_usuario_exist FROM USUARIO WHERE ID_EMPLEADO=v_id_empleado;
    v_id_usuario := v_id_usuario_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_USUARIO.NEXTVAL INTO v_id_usuario FROM DUAL;
    INSERT INTO USUARIO(ID_USUARIO,ID_EMPLEADO,NOMBRE_USUARIO,CONTRASENA,ACTIVO)
    VALUES(v_id_usuario,v_id_empleado,'eiliana.montero','$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',1);
  END;

  SELECT ID_ROL INTO v_id_rol FROM ROL WHERE UPPER(NOMBRE_ROL)='INVESTIGADOR';
  BEGIN
    DECLARE v_tmp NUMBER; BEGIN
      SELECT 1 INTO v_tmp FROM ROL_USUARIO WHERE ID_USUARIO=v_id_usuario AND ID_ROL=v_id_rol;
    EXCEPTION WHEN NO_DATA_FOUND THEN
      INSERT INTO ROL_USUARIO(ID_ROL_USUARIO,ID_USUARIO,ID_ROL) VALUES(SEC_ROL_USUARIO.NEXTVAL,v_id_usuario,v_id_rol);
    END;
  END;

  PRC_INS_CERTIFICACION(SEC_CERTIFICACION.NEXTVAL,v_id_invest,'Investigación cuantitativa',v_id_cert_tipo,TO_DATE('2026-12-31','YYYY-MM-DD'),v_id_cert_estado);
END;
/
 
/* =====================================================
   INVESTIGADOR 8: Benjamín Reyes Fernández (110500964)
   ===================================================== */
DECLARE
  v_id_empleado NUMBER; v_id_empleado_exist NUMBER;
  v_id_invest NUMBER; v_id_invest_exist NUMBER;
  v_id_usuario NUMBER; v_id_usuario_exist NUMBER;
  v_id_tipo_id NUMBER; v_id_grado NUMBER;
  v_id_cert_tipo NUMBER; v_id_cert_estado NUMBER;
  v_id_rol NUMBER;
BEGIN
  SELECT ID_CODIGO INTO v_id_tipo_id FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='IDENTIFICACION') AND UPPER(DESPLIEGUE)='NACIONAL';
  SELECT ID_CODIGO INTO v_id_grado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='GRADO ACADEMICO') AND UPPER(DESPLIEGUE)='DOCTORADO';
  SELECT ID_CODIGO INTO v_id_cert_tipo FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='TIPO CERTIFICACION') AND UPPER(DESPLIEGUE)='LICENCIA PROFESIONAL';
  SELECT ID_CODIGO INTO v_id_cert_estado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='ESTADO CERTIFICACION') AND UPPER(DESPLIEGUE)='VIGENTE';

  BEGIN
    SELECT ID_EMPLEADO INTO v_id_empleado_exist FROM EMPLEADO WHERE IDENTIFICACION='110500964';
    v_id_empleado := v_id_empleado_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_EMPLEADO.NEXTVAL INTO v_id_empleado FROM DUAL;
    PRC_INS_EMPLEADO(v_id_empleado,'Benjamín Reyes Fernández','Costarricense',v_id_tipo_id,'110500964','benjamin.reyes@ucr.ac.cr','88881009');
  END;

  BEGIN
    SELECT ID_INVESTIGADOR INTO v_id_invest_exist FROM INVESTIGADOR WHERE ID_EMPLEADO=v_id_empleado;
    v_id_invest := v_id_invest_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_INVESTIGADOR.NEXTVAL INTO v_id_invest FROM DUAL;
    PRC_INS_INVESTIGADOR(v_id_invest,v_id_empleado,'Facultad de Ciencias','Universidad de Costa Rica',v_id_grado);
  END;

  BEGIN
    SELECT ID_USUARIO INTO v_id_usuario_exist FROM USUARIO WHERE ID_EMPLEADO=v_id_empleado;
    v_id_usuario := v_id_usuario_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_USUARIO.NEXTVAL INTO v_id_usuario FROM DUAL;
    INSERT INTO USUARIO(ID_USUARIO,ID_EMPLEADO,NOMBRE_USUARIO,CONTRASENA,ACTIVO)
    VALUES(v_id_usuario,v_id_empleado,'benjamin.reyes','$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',1);
  END;

  SELECT ID_ROL INTO v_id_rol FROM ROL WHERE UPPER(NOMBRE_ROL)='INVESTIGADOR';
  BEGIN
    DECLARE v_tmp NUMBER; BEGIN
      SELECT 1 INTO v_tmp FROM ROL_USUARIO WHERE ID_USUARIO=v_id_usuario AND ID_ROL=v_id_rol;
    EXCEPTION WHEN NO_DATA_FOUND THEN
      INSERT INTO ROL_USUARIO(ID_ROL_USUARIO,ID_USUARIO,ID_ROL) VALUES(SEC_ROL_USUARIO.NEXTVAL,v_id_usuario,v_id_rol);
    END;
  END;

  PRC_INS_CERTIFICACION(SEC_CERTIFICACION.NEXTVAL,v_id_invest,'Gestión de datos de investigación',v_id_cert_tipo,TO_DATE('2026-08-30','YYYY-MM-DD'),v_id_cert_estado);
END;
/
 
/* =====================================================
   INVESTIGADOR 9: José Moncada Jiménez (107660515)
   ===================================================== */
DECLARE
  v_id_empleado NUMBER; v_id_empleado_exist NUMBER;
  v_id_invest NUMBER; v_id_invest_exist NUMBER;
  v_id_usuario NUMBER; v_id_usuario_exist NUMBER;
  v_id_tipo_id NUMBER; v_id_grado NUMBER;
  v_id_cert_tipo NUMBER; v_id_cert_estado NUMBER;
  v_id_rol NUMBER;
BEGIN
  SELECT ID_CODIGO INTO v_id_tipo_id FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='IDENTIFICACION') AND UPPER(DESPLIEGUE)='NACIONAL';
  SELECT ID_CODIGO INTO v_id_grado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='GRADO ACADEMICO') AND UPPER(DESPLIEGUE)='DOCTORADO';
  SELECT ID_CODIGO INTO v_id_cert_tipo FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='TIPO CERTIFICACION') AND UPPER(DESPLIEGUE)='LICENCIA PROFESIONAL';
  SELECT ID_CODIGO INTO v_id_cert_estado FROM CODIGO WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='ESTADO CERTIFICACION') AND UPPER(DESPLIEGUE)='VIGENTE';

  BEGIN
    SELECT ID_EMPLEADO INTO v_id_empleado_exist FROM EMPLEADO WHERE IDENTIFICACION='107660515';
    v_id_empleado := v_id_empleado_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_EMPLEADO.NEXTVAL INTO v_id_empleado FROM DUAL;
    PRC_INS_EMPLEADO(v_id_empleado,'José Moncada Jiménez','Costarricense',v_id_tipo_id,'107660515','jose.moncada@ucr.ac.cr','88881010');
  END;

  BEGIN
    SELECT ID_INVESTIGADOR INTO v_id_invest_exist FROM INVESTIGADOR WHERE ID_EMPLEADO=v_id_empleado;
    v_id_invest := v_id_invest_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_INVESTIGADOR.NEXTVAL INTO v_id_invest FROM DUAL;
    PRC_INS_INVESTIGADOR(v_id_invest,v_id_empleado,'Escuela de Educación Física','Universidad de Costa Rica',v_id_grado);
  END;

  BEGIN
    SELECT ID_USUARIO INTO v_id_usuario_exist FROM USUARIO WHERE ID_EMPLEADO=v_id_empleado;
    v_id_usuario := v_id_usuario_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_USUARIO.NEXTVAL INTO v_id_usuario FROM DUAL;
    INSERT INTO USUARIO(ID_USUARIO,ID_EMPLEADO,NOMBRE_USUARIO,CONTRASENA,ACTIVO)
    VALUES(v_id_usuario,v_id_empleado,'jose.moncada','$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',1);
  END;

  SELECT ID_ROL INTO v_id_rol FROM ROL WHERE UPPER(NOMBRE_ROL)='INVESTIGADOR';
  BEGIN
    DECLARE v_tmp NUMBER; BEGIN
      SELECT 1 INTO v_tmp FROM ROL_USUARIO WHERE ID_USUARIO=v_id_usuario AND ID_ROL=v_id_rol;
    EXCEPTION WHEN NO_DATA_FOUND THEN
      INSERT INTO ROL_USUARIO(ID_ROL_USUARIO,ID_USUARIO,ID_ROL) VALUES(SEC_ROL_USUARIO.NEXTVAL,v_id_usuario,v_id_rol);
    END;
  END;

  PRC_INS_CERTIFICACION(SEC_CERTIFICACION.NEXTVAL,v_id_invest,'Actividad física y salud pública',v_id_cert_tipo,TO_DATE('2027-12-31','YYYY-MM-DD'),v_id_cert_estado);
END;
/
 
/* =====================================================
   DIRECTOR: Derby Muñoz Rojas (303620532)
   ===================================================== */
DECLARE
  v_id_empleado NUMBER; v_id_empleado_exist NUMBER;
  v_id_usuario NUMBER; v_id_usuario_exist NUMBER;
  v_id_tipo_id NUMBER; v_id_rol NUMBER;
BEGIN
  SELECT ID_CODIGO INTO v_id_tipo_id FROM CODIGO
    WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='IDENTIFICACION') AND UPPER(DESPLIEGUE)='NACIONAL';

  BEGIN
    SELECT ID_EMPLEADO INTO v_id_empleado_exist FROM EMPLEADO WHERE IDENTIFICACION='303620532';
    v_id_empleado := v_id_empleado_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_EMPLEADO.NEXTVAL INTO v_id_empleado FROM DUAL;
    PRC_INS_EMPLEADO(v_id_empleado,'Derby Muñoz Rojas','Costarricense',v_id_tipo_id,'303620532','derby.munoz@ucr.ac.cr','88744842');
  END;

  BEGIN
    SELECT ID_USUARIO INTO v_id_usuario_exist FROM USUARIO WHERE ID_EMPLEADO=v_id_empleado;
    v_id_usuario := v_id_usuario_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_USUARIO.NEXTVAL INTO v_id_usuario FROM DUAL;
    INSERT INTO USUARIO(ID_USUARIO,ID_EMPLEADO,NOMBRE_USUARIO,CONTRASENA,ACTIVO)
    VALUES(v_id_usuario,v_id_empleado,'derby.munoz','$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',1);
  END;

  SELECT ID_ROL INTO v_id_rol FROM ROL WHERE UPPER(NOMBRE_ROL)='DIRECTOR';
  BEGIN
    DECLARE v_tmp NUMBER; BEGIN
      SELECT 1 INTO v_tmp FROM ROL_USUARIO WHERE ID_USUARIO=v_id_usuario AND ID_ROL=v_id_rol;
    EXCEPTION WHEN NO_DATA_FOUND THEN
      INSERT INTO ROL_USUARIO(ID_ROL_USUARIO,ID_USUARIO,ID_ROL) VALUES(SEC_ROL_USUARIO.NEXTVAL,v_id_usuario,v_id_rol);
    END;
  END;
END;
/
 
/* =====================================================
   ADMINISTRADORA: Jennifer Leticia Gutierrez Rivera (113410210)
   ===================================================== */
DECLARE
  v_id_empleado NUMBER; v_id_empleado_exist NUMBER;
  v_id_usuario NUMBER; v_id_usuario_exist NUMBER;
  v_id_tipo_id NUMBER; v_id_rol NUMBER;
BEGIN
  SELECT ID_CODIGO INTO v_id_tipo_id FROM CODIGO
    WHERE ID_TIPO=(SELECT ID_TIPO FROM TIPO WHERE NOMBRE='IDENTIFICACION') AND UPPER(DESPLIEGUE)='NACIONAL';

  BEGIN
    SELECT ID_EMPLEADO INTO v_id_empleado_exist FROM EMPLEADO WHERE IDENTIFICACION='113410210';
    v_id_empleado := v_id_empleado_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_EMPLEADO.NEXTVAL INTO v_id_empleado FROM DUAL;
    PRC_INS_EMPLEADO(v_id_empleado,'Jennifer Leticia Gutierrez Rivera','Costarricense',v_id_tipo_id,'113410210','jennifer.gutierrez@ucr.ac.cr','87243161');
  END;

  BEGIN
    SELECT ID_USUARIO INTO v_id_usuario_exist FROM USUARIO WHERE ID_EMPLEADO=v_id_empleado;
    v_id_usuario := v_id_usuario_exist;
  EXCEPTION WHEN NO_DATA_FOUND THEN
    SELECT SEC_USUARIO.NEXTVAL INTO v_id_usuario FROM DUAL;
    INSERT INTO USUARIO(ID_USUARIO,ID_EMPLEADO,NOMBRE_USUARIO,CONTRASENA,ACTIVO)
    VALUES(v_id_usuario,v_id_empleado,'jennifer.gutierrez','$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',1);
  END;

  SELECT ID_ROL INTO v_id_rol FROM ROL WHERE UPPER(NOMBRE_ROL)='ADMINISTRADOR';
  BEGIN
    DECLARE v_tmp NUMBER; BEGIN
      SELECT 1 INTO v_tmp FROM ROL_USUARIO WHERE ID_USUARIO=v_id_usuario AND ID_ROL=v_id_rol;
    EXCEPTION WHEN NO_DATA_FOUND THEN
      INSERT INTO ROL_USUARIO(ID_ROL_USUARIO,ID_USUARIO,ID_ROL) VALUES(SEC_ROL_USUARIO.NEXTVAL,v_id_usuario,v_id_rol);
    END;
  END;
END;
/

PROMPT Listo.
COMMIT;
EXIT
