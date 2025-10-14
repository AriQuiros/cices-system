SET SERVEROUTPUT ON;

PROMPT ========================================
PROMPT INSERTANDO PROYECTOS C1766 Y C0236
PROMPT ========================================

-- Primero agregar los códigos necesarios que no existen
PROMPT Agregando códigos faltantes para los proyectos...

-- Agregar tipo de proyecto: ACTIVIDADES (para C1766)
INSERT INTO CODIGO(ID_CODIGO, ID_TIPO, DESPLIEGUE, TIPO_VALOR, VALOR)
SELECT SEC_CODIGO.NEXTVAL, 6, 'ACTIVIDADES', 'V', 'ACTIVIDADES' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM CODIGO WHERE ID_TIPO = 6 AND VALOR = 'ACTIVIDADES');

-- Agregar tipo de proyecto: BASICA (para C0236)
INSERT INTO CODIGO(ID_CODIGO, ID_TIPO, DESPLIEGUE, TIPO_VALOR, VALOR)
SELECT SEC_CODIGO.NEXTVAL, 6, 'BASICA', 'V', 'BASICA' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM CODIGO WHERE ID_TIPO = 6 AND VALOR = 'BASICA');

-- Función para simular BCrypt (simplificada para fines de demostración)
PROMPT Agregando función para encriptar contraseñas...

CREATE OR REPLACE FUNCTION ENCRYPT_PASSWORD(p_password VARCHAR2) RETURN VARCHAR2 IS
BEGIN
    -- Simulación simple de hash BCrypt para demostración
    -- En producción, usar BCrypt del backend Java
    RETURN '$2a$10$' || p_password || '_hashed_simulation_' || TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS');
END;
/

-- ========================================
-- PROYECTO C1766 - LA RED DE LAS AMÉRICAS PARA LA EQUIDAD EN SALUD
-- ========================================

PROMPT 
PROMPT ========================================
PROMPT INICIANDO PROYECTO C1766
PROMPT ========================================

PROMPT Verificando empleados del proyecto C1766...

-- Insertar empleados solo si no existen
DECLARE
    v_count NUMBER;
BEGIN
    -- 1. Maria Saenz Madrigal (Investigador Principal)
    SELECT COUNT(*) INTO v_count FROM EMPLEADO WHERE IDENTIFICACION = '208880001';
    IF v_count = 0 THEN
        PRC_INS_EMPLEADO(SEC_EMPLEADO.NEXTVAL, 'Maria Saenz Madrigal', 'Costarricense', 1, '208880001', 'MARIA.SAENZMADRIGAL@ucr.ac.cr', '25117001');
        DBMS_OUTPUT.PUT_LINE('Empleado Maria Saenz creado');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Empleado Maria Saenz ya existe');
    END IF;
    
    -- 2. Ingrid Gomez Duarte (Investigador Asociado)
    SELECT COUNT(*) INTO v_count FROM EMPLEADO WHERE IDENTIFICACION = '208880002';
    IF v_count = 0 THEN
        PRC_INS_EMPLEADO(SEC_EMPLEADO.NEXTVAL, 'Ingrid Gomez Duarte', 'Costarricense', 1, '208880002', 'INGRID.GOMEZ@ucr.ac.cr', '25117002');
        DBMS_OUTPUT.PUT_LINE('Empleado Ingrid Gomez creado');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Empleado Ingrid Gomez ya existe');
    END IF;
    
    -- 3. Karol Cristina Rojas Araya (Investigador Asociado)
    SELECT COUNT(*) INTO v_count FROM EMPLEADO WHERE IDENTIFICACION = '208880003';
    IF v_count = 0 THEN
        PRC_INS_EMPLEADO(SEC_EMPLEADO.NEXTVAL, 'Karol Cristina Rojas Araya', 'Costarricense', 1, '208880003', 'KAROLCRISTINA.ROJAS@ucr.ac.cr', '25117003');
        DBMS_OUTPUT.PUT_LINE('Empleado Karol Rojas creado');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Empleado Karol Rojas ya existe');
    END IF;
END;
/

PROMPT Insertando investigadores del proyecto C1766...

-- Obtener IDs de empleados para crear investigadores
DECLARE
    v_empleado_maria NUMBER;
    v_empleado_ingrid NUMBER;
    v_empleado_karol NUMBER;
    v_codigo_maestria NUMBER;
    v_codigo_doctorado NUMBER;
    v_codigo_licenciatura NUMBER;
BEGIN
    -- Obtener IDs de empleados
    SELECT ID_EMPLEADO INTO v_empleado_maria FROM EMPLEADO WHERE IDENTIFICACION = '208880001';
    SELECT ID_EMPLEADO INTO v_empleado_ingrid FROM EMPLEADO WHERE IDENTIFICACION = '208880002';
    SELECT ID_EMPLEADO INTO v_empleado_karol FROM EMPLEADO WHERE IDENTIFICACION = '208880003';
    
    -- Obtener códigos de grados académicos
    SELECT ID_CODIGO INTO v_codigo_maestria FROM CODIGO WHERE ID_TIPO = 2 AND VALOR = 'MAESTRIA';
    SELECT ID_CODIGO INTO v_codigo_doctorado FROM CODIGO WHERE ID_TIPO = 2 AND VALOR = 'DOCTORADO';
    SELECT ID_CODIGO INTO v_codigo_licenciatura FROM CODIGO WHERE ID_TIPO = 2 AND VALOR = 'LICENCIATURA';
    
    -- Crear investigadores
    PRC_INS_INVESTIGADOR(SEC_INVESTIGADOR.NEXTVAL, v_empleado_maria, 'ESCUELA DE SALUD PÚBLICA', 'UCR', v_codigo_maestria);
    PRC_INS_INVESTIGADOR(SEC_INVESTIGADOR.NEXTVAL, v_empleado_ingrid, 'ESCUELA DE SALUD PÚBLICA', 'UCR', v_codigo_doctorado);  
    PRC_INS_INVESTIGADOR(SEC_INVESTIGADOR.NEXTVAL, v_empleado_karol, 'ESCUELA DE SALUD PÚBLICA', 'UCR', v_codigo_licenciatura);
    
    DBMS_OUTPUT.PUT_LINE('Investigadores C1766 creados correctamente');
END;
/

PROMPT Verificando usuarios del proyecto C1766...

-- Crear usuario para Maria solo si no existe
DECLARE
    v_empleado_maria NUMBER;
    v_rol_investigador NUMBER;
    v_rol_director NUMBER;
    v_contrasena_encriptada VARCHAR2(255);
    v_count NUMBER;
    v_usuario_id NUMBER;
BEGIN
    -- Obtener ID de empleado de Maria
    SELECT ID_EMPLEADO INTO v_empleado_maria FROM EMPLEADO WHERE IDENTIFICACION = '208880001';
    
    -- Verificar si el usuario ya existe
    SELECT COUNT(*) INTO v_count FROM USUARIO WHERE NOMBRE_USUARIO = 'maria.saenz';
    
    IF v_count = 0 THEN
        -- Obtener roles
        SELECT ID_ROL INTO v_rol_investigador FROM ROL WHERE UPPER(NOMBRE_ROL) = 'INVESTIGADOR';
        SELECT ID_ROL INTO v_rol_director FROM ROL WHERE UPPER(NOMBRE_ROL) = 'DIRECTOR';
        
        -- Encriptar contraseña
        v_contrasena_encriptada := ENCRYPT_PASSWORD('admin123');
        
        -- Crear usuario para Maria (como directora del proyecto)
        INSERT INTO USUARIO(ID_USUARIO, ID_EMPLEADO, NOMBRE_USUARIO, CONTRASENA, ACTIVO)
        VALUES (SEC_USUARIO.NEXTVAL, v_empleado_maria, 'maria.saenz', v_contrasena_encriptada, 1)
        RETURNING ID_USUARIO INTO v_usuario_id;
        
        -- Asignar roles a Maria
        INSERT INTO ROL_USUARIO(ID_ROL_USUARIO, ID_USUARIO, ID_ROL)
        VALUES (SEC_ROL_USUARIO.NEXTVAL, v_usuario_id, v_rol_director);
        
        INSERT INTO ROL_USUARIO(ID_ROL_USUARIO, ID_USUARIO, ID_ROL)
        VALUES (SEC_ROL_USUARIO.NEXTVAL, v_usuario_id, v_rol_investigador);
        
        DBMS_OUTPUT.PUT_LINE('Usuario maria.saenz creado correctamente');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Usuario maria.saenz ya existe');
    END IF;
END;
/

PROMPT Verificando proyecto C1766...

-- Crear el proyecto C1766 solo si no existe
DECLARE
    v_codigo_activo NUMBER;
    v_codigo_actividades NUMBER;
    v_count NUMBER;
BEGIN
    -- Verificar si el proyecto ya existe
    SELECT COUNT(*) INTO v_count FROM PROYECTO WHERE CODIGO_PROYECTO = 'C1766';
    
    IF v_count = 0 THEN
        -- Obtener códigos necesarios
        SELECT ID_CODIGO INTO v_codigo_activo FROM CODIGO WHERE ID_TIPO = 5 AND VALOR = 'ACTIVO';
        SELECT ID_CODIGO INTO v_codigo_actividades FROM CODIGO WHERE ID_TIPO = 6 AND VALOR = 'ACTIVIDADES';
        
        -- Crear proyecto
        PRC_INS_PROYECTO(
            SEC_PROYECTO.NEXTVAL,
            'LA RED DE LAS AMÉRICAS PARA LA EQUIDAD EN SALUD',
            'C1766',
            TO_DATE('01-07-2021', 'DD-MM-YYYY'),
            v_codigo_activo,
            'CONSOLIDAR LA SECRETARÍA TÉCNICA DE LA RED DE LAS AMÉRICAS PARA LA EQUIDAD EN SALUD (RAES) EN LA UNIVERSIDAD DE COSTA RICA.',
            'Salud',
            v_codigo_actividades,
            TO_DATE('31-12-2025', 'DD-MM-YYYY')
        );
        
        DBMS_OUTPUT.PUT_LINE('Proyecto C1766 creado correctamente');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Proyecto C1766 ya existe');
    END IF;
END;
/

PROMPT Asignando investigadores al proyecto C1766...

-- Asignar investigadores al proyecto
DECLARE
    v_proyecto_id NUMBER;
    v_investigador_maria NUMBER;
    v_investigador_ingrid NUMBER;
    v_investigador_karol NUMBER;
    v_rol_principal NUMBER;
    v_rol_asociado NUMBER;
    v_empleado_maria NUMBER;
    v_empleado_ingrid NUMBER;
    v_empleado_karol NUMBER;
BEGIN
    -- Obtener ID del proyecto C1766
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C1766';
    
    -- Obtener IDs de empleados
    SELECT ID_EMPLEADO INTO v_empleado_maria FROM EMPLEADO WHERE IDENTIFICACION = '208880001';
    SELECT ID_EMPLEADO INTO v_empleado_ingrid FROM EMPLEADO WHERE IDENTIFICACION = '208880002';
    SELECT ID_EMPLEADO INTO v_empleado_karol FROM EMPLEADO WHERE IDENTIFICACION = '208880003';
    
    -- Obtener IDs de investigadores
    SELECT ID_INVESTIGADOR INTO v_investigador_maria FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_maria;
    SELECT ID_INVESTIGADOR INTO v_investigador_ingrid FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_ingrid;
    SELECT ID_INVESTIGADOR INTO v_investigador_karol FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_karol;
    
    -- Obtener roles de proyecto
    SELECT ID_ROL_PROYECTO INTO v_rol_principal FROM ROL_PROYECTO WHERE UPPER(NOMBRE_PERMISO) = 'INVESTIGADOR_PRINCIPAL';
    SELECT ID_ROL_PROYECTO INTO v_rol_asociado FROM ROL_PROYECTO WHERE UPPER(NOMBRE_PERMISO) = 'COLABORADOR';
    
    -- Asignar Maria como Investigador Principal
    PRC_INS_INVESTIGADOR_PROYECTO(
        SEC_INVESTIGADOR_PROYECTO.NEXTVAL,
        v_investigador_maria,
        v_rol_principal,
        v_proyecto_id,
        'Investigador principal responsable de consolidar la Secretaría Técnica de RAES',
        TO_DATE('01-01-2024', 'DD-MM-YYYY'),
        TO_DATE('31-12-2025', 'DD-MM-YYYY')
    );
    
    -- Asignar Ingrid como Investigador Asociado
    PRC_INS_INVESTIGADOR_PROYECTO(
        SEC_INVESTIGADOR_PROYECTO.NEXTVAL,
        v_investigador_ingrid,
        v_rol_asociado,
        v_proyecto_id,
        'Investigador asociado en actividades de la red de equidad en salud',
        TO_DATE('01-01-2024', 'DD-MM-YYYY'),
        TO_DATE('31-12-2025', 'DD-MM-YYYY')
    );
    
    -- Asignar Karol como Investigador Asociado
    PRC_INS_INVESTIGADOR_PROYECTO(
        SEC_INVESTIGADOR_PROYECTO.NEXTVAL,
        v_investigador_karol,
        v_rol_asociado,
        v_proyecto_id,
        'Investigador asociado en coordinación de actividades de la red',
        TO_DATE('02-07-2022', 'DD-MM-YYYY'),
        TO_DATE('30-11-2023', 'DD-MM-YYYY')
    );
    
    DBMS_OUTPUT.PUT_LINE('Investigadores asignados al proyecto C1766 correctamente');
END;
/

PROMPT Creando presupuesto inicial para proyecto C1766...

-- Crear presupuesto para el proyecto
DECLARE
    v_proyecto_id NUMBER;
    v_codigo_ordinario NUMBER;
    v_codigo_financiero NUMBER;
BEGIN
    -- Obtener IDs necesarios
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C1766';
    SELECT ID_CODIGO INTO v_codigo_ordinario FROM CODIGO WHERE ID_TIPO = 8 AND VALOR = 'ORDINARIO';
    SELECT ID_CODIGO INTO v_codigo_financiero FROM CODIGO WHERE ID_TIPO = 9 AND VALOR = 'FINANCIERO';
    
    -- Crear presupuesto principal
    PRC_INS_PRESUPUESTO(
        SEC_PRESUPUESTO.NEXTVAL,
        v_proyecto_id,
        'Presupuesto para consolidación de RAES',
        TO_DATE('01-07-2021', 'DD-MM-YYYY'),
        v_codigo_ordinario,
        250000.00, -- 250 mil colones (ajustado a límite de BD)
        180, -- 180 horas por mes (ajustado para cubrir las asignaciones reales)
        54, -- 54 meses (julio 2021 - diciembre 2025)
        v_codigo_financiero
    );
    
    DBMS_OUTPUT.PUT_LINE('Presupuesto creado para proyecto C1766');
END;
/

PROMPT Asignando horas a investigadores del proyecto C1766...

-- Asignar horas a investigadores
DECLARE
    v_presupuesto_id NUMBER;
    v_inv_proyecto_maria NUMBER;
    v_inv_proyecto_ingrid NUMBER;
    v_inv_proyecto_karol NUMBER;
    v_codigo_tiempo_completo NUMBER;
    v_codigo_medio_tiempo NUMBER;
    v_proyecto_id NUMBER;
    v_investigador_maria NUMBER;
    v_investigador_ingrid NUMBER;
    v_investigador_karol NUMBER;
    v_empleado_maria NUMBER;
    v_empleado_ingrid NUMBER;
    v_empleado_karol NUMBER;
BEGIN
    -- Obtener IDs necesarios
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C1766';
    SELECT MAX(ID_PRESUPUESTO) INTO v_presupuesto_id FROM PRESUPUESTO WHERE ID_PROYECTO = v_proyecto_id;
    
    SELECT ID_CODIGO INTO v_codigo_tiempo_completo FROM CODIGO WHERE ID_TIPO = 7 AND VALOR = 'TIEMPO COMPLETO';
    SELECT ID_CODIGO INTO v_codigo_medio_tiempo FROM CODIGO WHERE ID_TIPO = 7 AND VALOR = 'MEDIO TIEMPO';
    
    -- Obtener IDs de empleados
    SELECT ID_EMPLEADO INTO v_empleado_maria FROM EMPLEADO WHERE IDENTIFICACION = '208880001';
    SELECT ID_EMPLEADO INTO v_empleado_ingrid FROM EMPLEADO WHERE IDENTIFICACION = '208880002';
    SELECT ID_EMPLEADO INTO v_empleado_karol FROM EMPLEADO WHERE IDENTIFICACION = '208880003';
    
    -- Obtener IDs de investigadores
    SELECT ID_INVESTIGADOR INTO v_investigador_maria FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_maria;
    SELECT ID_INVESTIGADOR INTO v_investigador_ingrid FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_ingrid;
    SELECT ID_INVESTIGADOR INTO v_investigador_karol FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_karol;
    
    -- Obtener IDs de investigador_proyecto
    SELECT ID_INVESTIGADOR_PROYECTO INTO v_inv_proyecto_maria 
    FROM INVESTIGADOR_PROYECTO 
    WHERE ID_INVESTIGADOR = v_investigador_maria AND ID_PROYECTO = v_proyecto_id;
    
    SELECT ID_INVESTIGADOR_PROYECTO INTO v_inv_proyecto_ingrid 
    FROM INVESTIGADOR_PROYECTO 
    WHERE ID_INVESTIGADOR = v_investigador_ingrid AND ID_PROYECTO = v_proyecto_id;
    
    SELECT ID_INVESTIGADOR_PROYECTO INTO v_inv_proyecto_karol 
    FROM INVESTIGADOR_PROYECTO 
    WHERE ID_INVESTIGADOR = v_investigador_karol AND ID_PROYECTO = v_proyecto_id;
    
    -- Asignar horas a Maria (80 horas/mes como investigador principal)
    PRC_INS_HORAS_ASIGNADAS(
        SEC_HORAS_ASIGNADAS.NEXTVAL,
        v_inv_proyecto_maria,
        v_presupuesto_id,
        80, -- 80 horas por mes
        24, -- 24 meses (enero 2024 - diciembre 2025)
        v_codigo_tiempo_completo
    );
    
    -- Asignar horas a Ingrid (40 horas/mes)
    PRC_INS_HORAS_ASIGNADAS(
        SEC_HORAS_ASIGNADAS.NEXTVAL,
        v_inv_proyecto_ingrid,
        v_presupuesto_id,
        40, -- 40 horas por mes
        24, -- 24 meses (enero 2024 - diciembre 2025)
        v_codigo_medio_tiempo
    );
    
    -- Asignar horas a Karol (40 horas/mes) - periodo ya finalizado
    PRC_INS_HORAS_ASIGNADAS(
        SEC_HORAS_ASIGNADAS.NEXTVAL,
        v_inv_proyecto_karol,
        v_presupuesto_id,
        40, -- 40 horas por mes
        17, -- 17 meses (julio 2022 - noviembre 2023)
        v_codigo_medio_tiempo
    );
    
    DBMS_OUTPUT.PUT_LINE('Horas asignadas correctamente a investigadores del proyecto C1766');
END;
/

PROMPT Insertando objetivos específicos del proyecto C1766...

-- Insertar objetivos específicos
DECLARE
    v_proyecto_id NUMBER;
BEGIN
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C1766';
    
    -- Objetivo 1: Consolidación organizacional
    INSERT INTO OBJETIVO_ESPECIFICO(ID_OBJETIVO, ID_PROYECTO, TIPO, DESCRIPCION)
    VALUES (SEC_OBJETIVO_ESPECIFICO.NEXTVAL, v_proyecto_id, 'Organizacional', 
            'Fortalecer la estructura organizacional de la Secretaría Técnica de RAES en la UCR');
    
    -- Objetivo 2: Desarrollo de capacidades
    INSERT INTO OBJETIVO_ESPECIFICO(ID_OBJETIVO, ID_PROYECTO, TIPO, DESCRIPCION)
    VALUES (SEC_OBJETIVO_ESPECIFICO.NEXTVAL, v_proyecto_id, 'Capacidades', 
            'Desarrollar las capacidades técnicas y operativas del equipo de la Secretaría Técnica');
    
    -- Objetivo 3: Coordinación regional
    INSERT INTO OBJETIVO_ESPECIFICO(ID_OBJETIVO, ID_PROYECTO, TIPO, DESCRIPCION)
    VALUES (SEC_OBJETIVO_ESPECIFICO.NEXTVAL, v_proyecto_id, 'Coordinación', 
            'Establecer mecanismos efectivos de coordinación con los países miembros de RAES');
    
    DBMS_OUTPUT.PUT_LINE('Objetivos específicos insertados para proyecto C1766');
END;
/

PROMPT Insertando metas del proyecto C1766...

-- Insertar metas para los objetivos
DECLARE
    v_objetivo1_id NUMBER;
    v_objetivo2_id NUMBER;
    v_objetivo3_id NUMBER;
    v_tipo_cuantitativa NUMBER;
    v_tipo_cualitativa NUMBER;
    v_proyecto_id NUMBER;
BEGIN
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C1766';
    SELECT ID_CODIGO INTO v_tipo_cuantitativa FROM CODIGO WHERE ID_TIPO = 11 AND VALOR = 'CUANTITATIVA';
    SELECT ID_CODIGO INTO v_tipo_cualitativa FROM CODIGO WHERE ID_TIPO = 11 AND VALOR = 'CUALITATIVA';
    
    -- Obtener IDs de objetivos
    SELECT MIN(ID_OBJETIVO) INTO v_objetivo1_id FROM OBJETIVO_ESPECIFICO WHERE ID_PROYECTO = v_proyecto_id;
    SELECT ID_OBJETIVO INTO v_objetivo2_id FROM OBJETIVO_ESPECIFICO WHERE ID_PROYECTO = v_proyecto_id AND TIPO = 'Capacidades';
    SELECT ID_OBJETIVO INTO v_objetivo3_id FROM OBJETIVO_ESPECIFICO WHERE ID_PROYECTO = v_proyecto_id AND TIPO = 'Coordinación';
    
    -- Metas para Objetivo 1
    INSERT INTO META(ID_META, ID_OBJETIVO, ID_CODIGO_TIPO, DESCRIPCION, CANTIDAD)
    VALUES (SEC_META.NEXTVAL, v_objetivo1_id, v_tipo_cualitativa, 
            'Establecimiento completo de la estructura organizacional', 1);
    
    -- Metas para Objetivo 2
    INSERT INTO META(ID_META, ID_OBJETIVO, ID_CODIGO_TIPO, DESCRIPCION, CANTIDAD)
    VALUES (SEC_META.NEXTVAL, v_objetivo2_id, v_tipo_cuantitativa, 
            'Número de capacitaciones realizadas al equipo técnico', 12);
    
    -- Metas para Objetivo 3
    INSERT INTO META(ID_META, ID_OBJETIVO, ID_CODIGO_TIPO, DESCRIPCION, CANTIDAD)
    VALUES (SEC_META.NEXTVAL, v_objetivo3_id, v_tipo_cuantitativa, 
            'Número de reuniones de coordinación con países miembros', 24);
    
    DBMS_OUTPUT.PUT_LINE('Metas insertadas para proyecto C1766');
END;
/

PROMPT Registrando gastos del proyecto C1766...

-- Registrar gastos del proyecto C1766
DECLARE
    v_presupuesto_id NUMBER;
    v_proyecto_id NUMBER;
BEGIN
    -- Obtener IDs necesarios
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C1766';
    SELECT MAX(ID_PRESUPUESTO) INTO v_presupuesto_id FROM PRESUPUESTO WHERE ID_PROYECTO = v_proyecto_id;
    
    -- Gasto 1: Reunión virtual de coordinación con países miembros
    INSERT INTO GASTO(ID_GASTO, ID_PRESUPUESTO, MONTO, FECHA_GASTO, CATEGORIA_GASTO, DESCRIPCION)
    VALUES (SEC_GASTO.NEXTVAL, v_presupuesto_id, 7500.00, TO_DATE('15-03-2024', 'DD-MM-YYYY'), 
            'Servicios Tecnológicos', 
            'Licencia mensual de plataforma Zoom Pro para reuniones de coordinación con países miembros de RAES. Incluye funcionalidades de grabación y salas simultáneas para grupos de trabajo.');
    
    -- Gasto 2: Capacitación del equipo técnico en metodologías de equidad en salud
    INSERT INTO GASTO(ID_GASTO, ID_PRESUPUESTO, MONTO, FECHA_GASTO, CATEGORIA_GASTO, DESCRIPCION)
    VALUES (SEC_GASTO.NEXTVAL, v_presupuesto_id, 45000.00, TO_DATE('22-05-2024', 'DD-MM-YYYY'), 
            'Capacitación y Desarrollo', 
            'Curso de certificación en "Análisis de Determinantes Sociales de la Salud en América Latina" para 3 miembros del equipo técnico de la Secretaría. Incluye materiales, evaluaciones y certificaciones oficiales.');
    
    -- Gasto 3: Material de oficina y suministros para operación
    INSERT INTO GASTO(ID_GASTO, ID_PRESUPUESTO, MONTO, FECHA_GASTO, CATEGORIA_GASTO, DESCRIPCION)
    VALUES (SEC_GASTO.NEXTVAL, v_presupuesto_id, 12500.00, TO_DATE('10-08-2024', 'DD-MM-YYYY'), 
            'Suministros de Oficina', 
            'Compra de material de oficina para la Secretaría Técnica: papel bond, cartuchos de tinta para impresora, folders, archivadores, material de encuadernación para informes y documentos oficiales de RAES, y suministros para reuniones presenciales.');
    
    DBMS_OUTPUT.PUT_LINE('Gastos registrados correctamente para proyecto C1766');
END;
/

-- ========================================
-- PROYECTO C0236 - CONTRIBUCIÓN DE LOS PARTICIPANTES SIMULADOS CON FORMACIÓN ACTORAL
-- ========================================

PROMPT 
PROMPT ========================================
PROMPT INICIANDO PROYECTO C0236
PROMPT ========================================

PROMPT Insertando empleados del proyecto C0236...

-- 1. Jaime Fornaguera Trías (Investigador Principal)
EXECUTE PRC_INS_EMPLEADO(SEC_EMPLEADO.NEXTVAL, 'Jaime Fornaguera Trías', 'Costarricense', 1, '105770001', 'JAIME.FORNAGUERA@ucr.ac.cr', '25117004');

-- 2. Ana Cecilia Zúñiga González (Investigadora Asociada)
EXECUTE PRC_INS_EMPLEADO(SEC_EMPLEADO.NEXTVAL, 'Ana Cecilia Zúñiga González', 'Costarricense', 1, '105770002', 'ANACECILIA.ZUNIGA@ucr.ac.cr', '25117005');

-- 3. María José Cordero López (Investigadora Colaboradora)
EXECUTE PRC_INS_EMPLEADO(SEC_EMPLEADO.NEXTVAL, 'María José Cordero López', 'Costarricense', 1, '105770003', 'MARIAJOSE.CORDERO@ucr.ac.cr', '25117006');

-- 4. Carlos Eduardo Mora Campos (Investigador Colaborador)
EXECUTE PRC_INS_EMPLEADO(SEC_EMPLEADO.NEXTVAL, 'Carlos Eduardo Mora Campos', 'Costarricense', 1, '105770004', 'CARLOSE.MORA@ucr.ac.cr', '25117007');

PROMPT Insertando investigadores del proyecto C0236...

-- Crear investigadores para C0236
DECLARE
    v_empleado_jaime NUMBER;
    v_empleado_ana NUMBER;
    v_empleado_maria NUMBER;
    v_empleado_carlos NUMBER;
    v_codigo_doctorado NUMBER;
    v_codigo_maestria NUMBER;
    v_codigo_licenciatura NUMBER;
BEGIN
    -- Obtener IDs de empleados
    SELECT ID_EMPLEADO INTO v_empleado_jaime FROM EMPLEADO WHERE IDENTIFICACION = '105770001';
    SELECT ID_EMPLEADO INTO v_empleado_ana FROM EMPLEADO WHERE IDENTIFICACION = '105770002';
    SELECT ID_EMPLEADO INTO v_empleado_maria FROM EMPLEADO WHERE IDENTIFICACION = '105770003';
    SELECT ID_EMPLEADO INTO v_empleado_carlos FROM EMPLEADO WHERE IDENTIFICACION = '105770004';
    
    -- Obtener códigos de grados académicos
    SELECT ID_CODIGO INTO v_codigo_doctorado FROM CODIGO WHERE ID_TIPO = 2 AND VALOR = 'DOCTORADO';
    SELECT ID_CODIGO INTO v_codigo_maestria FROM CODIGO WHERE ID_TIPO = 2 AND VALOR = 'MAESTRIA';
    SELECT ID_CODIGO INTO v_codigo_licenciatura FROM CODIGO WHERE ID_TIPO = 2 AND VALOR = 'LICENCIATURA';
    
    -- Crear investigadores
    PRC_INS_INVESTIGADOR(SEC_INVESTIGADOR.NEXTVAL, v_empleado_jaime, 'ESCUELA DE ENFERMERÍA', 'UCR', v_codigo_doctorado);
    PRC_INS_INVESTIGADOR(SEC_INVESTIGADOR.NEXTVAL, v_empleado_ana, 'ESCUELA DE ENFERMERÍA', 'UCR', v_codigo_maestria);
    PRC_INS_INVESTIGADOR(SEC_INVESTIGADOR.NEXTVAL, v_empleado_maria, 'ESCUELA DE ENFERMERÍA', 'UCR', v_codigo_maestria);
    PRC_INS_INVESTIGADOR(SEC_INVESTIGADOR.NEXTVAL, v_empleado_carlos, 'ESCUELA DE ENFERMERÍA', 'UCR', v_codigo_licenciatura);
    
    DBMS_OUTPUT.PUT_LINE('Investigadores C0236 creados correctamente');
END;
/

PROMPT Insertando usuarios del proyecto C0236...

-- Crear usuario para el investigador principal
DECLARE
    v_empleado_jaime NUMBER;
    v_rol_investigador NUMBER;
    v_rol_director NUMBER;
    v_contrasena_encriptada VARCHAR2(255);
BEGIN
    -- Obtener ID de empleado de Jaime
    SELECT ID_EMPLEADO INTO v_empleado_jaime FROM EMPLEADO WHERE IDENTIFICACION = '105770001';
    
    -- Obtener roles
    SELECT ID_ROL INTO v_rol_investigador FROM ROL WHERE UPPER(NOMBRE_ROL) = 'INVESTIGADOR';
    SELECT ID_ROL INTO v_rol_director FROM ROL WHERE UPPER(NOMBRE_ROL) = 'DIRECTOR';
    
    -- Encriptar contraseña
    v_contrasena_encriptada := ENCRYPT_PASSWORD('admin123');
    
    -- Crear usuario para Jaime (como director del proyecto)
    INSERT INTO USUARIO(ID_USUARIO, ID_EMPLEADO, NOMBRE_USUARIO, CONTRASENA, ACTIVO)
    VALUES (SEC_USUARIO.NEXTVAL, v_empleado_jaime, 'jaime.fornaguera', v_contrasena_encriptada, 1);
    
    -- Asignar roles a Jaime
    INSERT INTO ROL_USUARIO(ID_ROL_USUARIO, ID_USUARIO, ID_ROL)
    VALUES (SEC_ROL_USUARIO.NEXTVAL, SEC_USUARIO.CURRVAL, v_rol_director);
    
    INSERT INTO ROL_USUARIO(ID_ROL_USUARIO, ID_USUARIO, ID_ROL)
    VALUES (SEC_ROL_USUARIO.NEXTVAL, SEC_USUARIO.CURRVAL, v_rol_investigador);
    
    DBMS_OUTPUT.PUT_LINE('Usuario jaime.fornaguera creado correctamente');
END;
/

PROMPT Verificando proyecto C0236...

-- Crear el proyecto C0236 solo si no existe
DECLARE
    v_codigo_finalizado NUMBER;
    v_codigo_basica NUMBER;
    v_count NUMBER;
BEGIN
    -- Verificar si el proyecto ya existe
    SELECT COUNT(*) INTO v_count FROM PROYECTO WHERE CODIGO_PROYECTO = 'C0236';
    
    IF v_count = 0 THEN
        -- Obtener códigos necesarios
        SELECT ID_CODIGO INTO v_codigo_finalizado FROM CODIGO WHERE ID_TIPO = 5 AND VALOR = 'FINALIZADO';
        SELECT ID_CODIGO INTO v_codigo_basica FROM CODIGO WHERE ID_TIPO = 6 AND VALOR = 'BASICA';
        
        -- Crear proyecto
        PRC_INS_PROYECTO(
            SEC_PROYECTO.NEXTVAL,
            'CONTRIBUCIÓN DE LOS PARTICIPANTES SIMULADOS CON FORMACIÓN ACTORAL',
            'C0236',
            TO_DATE('01-04-2020', 'DD-MM-YYYY'),
            v_codigo_finalizado,
            'EVALUAR LA CONTRIBUCIÓN DE ACTORES PROFESIONALES COMO PARTICIPANTES SIMULADOS EN LA FORMACIÓN CLÍNICA DE ESTUDIANTES DE ENFERMERÍA.',
            'Educación en Enfermería',
            v_codigo_basica,
            TO_DATE('31-03-2023', 'DD-MM-YYYY')
        );
        
        DBMS_OUTPUT.PUT_LINE('Proyecto C0236 creado correctamente');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Proyecto C0236 ya existe');
    END IF;
END;
/

PROMPT Asignando investigadores al proyecto C0236...

-- Asignar investigadores al proyecto C0236
DECLARE
    v_proyecto_id NUMBER;
    v_investigador_jaime NUMBER;
    v_investigador_ana NUMBER;
    v_investigador_maria NUMBER;
    v_investigador_carlos NUMBER;
    v_rol_principal NUMBER;
    v_rol_colaborador NUMBER;
    v_empleado_jaime NUMBER;
    v_empleado_ana NUMBER;
    v_empleado_maria NUMBER;
    v_empleado_carlos NUMBER;
BEGIN
    -- Obtener ID del proyecto C0236
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C0236';
    
    -- Obtener IDs de empleados
    SELECT ID_EMPLEADO INTO v_empleado_jaime FROM EMPLEADO WHERE IDENTIFICACION = '105770001';
    SELECT ID_EMPLEADO INTO v_empleado_ana FROM EMPLEADO WHERE IDENTIFICACION = '105770002';
    SELECT ID_EMPLEADO INTO v_empleado_maria FROM EMPLEADO WHERE IDENTIFICACION = '105770003';
    SELECT ID_EMPLEADO INTO v_empleado_carlos FROM EMPLEADO WHERE IDENTIFICACION = '105770004';
    
    -- Obtener IDs de investigadores
    SELECT ID_INVESTIGADOR INTO v_investigador_jaime FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_jaime;
    SELECT ID_INVESTIGADOR INTO v_investigador_ana FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_ana;
    SELECT ID_INVESTIGADOR INTO v_investigador_maria FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_maria;
    SELECT ID_INVESTIGADOR INTO v_investigador_carlos FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_carlos;
    
    -- Obtener roles de proyecto
    SELECT ID_ROL_PROYECTO INTO v_rol_principal FROM ROL_PROYECTO WHERE UPPER(NOMBRE_PERMISO) = 'INVESTIGADOR_PRINCIPAL';
    SELECT ID_ROL_PROYECTO INTO v_rol_colaborador FROM ROL_PROYECTO WHERE UPPER(NOMBRE_PERMISO) = 'COLABORADOR';
    
    -- Asignar Jaime como Investigador Principal
    PRC_INS_INVESTIGADOR_PROYECTO(
        SEC_INVESTIGADOR_PROYECTO.NEXTVAL,
        v_investigador_jaime,
        v_rol_principal,
        v_proyecto_id,
        'Investigador principal del estudio sobre simulación clínica con actores profesionales',
        TO_DATE('01-04-2020', 'DD-MM-YYYY'),
        TO_DATE('31-03-2023', 'DD-MM-YYYY')
    );
    
    -- Asignar Ana como Investigadora Colaboradora
    PRC_INS_INVESTIGADOR_PROYECTO(
        SEC_INVESTIGADOR_PROYECTO.NEXTVAL,
        v_investigador_ana,
        v_rol_colaborador,
        v_proyecto_id,
        'Investigadora colaboradora en diseño metodológico y análisis de datos',
        TO_DATE('01-04-2020', 'DD-MM-YYYY'),
        TO_DATE('31-03-2023', 'DD-MM-YYYY')
    );
    
    -- Asignar María José como Investigadora Colaboradora
    PRC_INS_INVESTIGADOR_PROYECTO(
        SEC_INVESTIGADOR_PROYECTO.NEXTVAL,
        v_investigador_maria,
        v_rol_colaborador,
        v_proyecto_id,
        'Investigadora colaboradora en coordinación de actividades de simulación',
        TO_DATE('01-04-2020', 'DD-MM-YYYY'),
        TO_DATE('31-03-2023', 'DD-MM-YYYY')
    );
    
    -- Asignar Carlos como Investigador Colaborador
    PRC_INS_INVESTIGADOR_PROYECTO(
        SEC_INVESTIGADOR_PROYECTO.NEXTVAL,
        v_investigador_carlos,
        v_rol_colaborador,
        v_proyecto_id,
        'Investigador colaborador en evaluación y seguimiento de estudiantes',
        TO_DATE('01-04-2020', 'DD-MM-YYYY'),
        TO_DATE('31-03-2023', 'DD-MM-YYYY')
    );
    
    DBMS_OUTPUT.PUT_LINE('Investigadores asignados al proyecto C0236 correctamente');
END;
/

PROMPT Creando presupuesto inicial para proyecto C0236...

-- Crear presupuesto para el proyecto C0236
DECLARE
    v_proyecto_id NUMBER;
    v_codigo_ordinario NUMBER;
    v_codigo_financiero NUMBER;
BEGIN
    -- Obtener IDs necesarios
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C0236';
    SELECT ID_CODIGO INTO v_codigo_ordinario FROM CODIGO WHERE ID_TIPO = 8 AND VALOR = 'ORDINARIO';
    SELECT ID_CODIGO INTO v_codigo_financiero FROM CODIGO WHERE ID_TIPO = 9 AND VALOR = 'FINANCIERO';
    
    -- Crear presupuesto principal
    PRC_INS_PRESUPUESTO(
        SEC_PRESUPUESTO.NEXTVAL,
        v_proyecto_id,
        'Presupuesto simulación clínica',
        TO_DATE('01-04-2020', 'DD-MM-YYYY'),
        v_codigo_ordinario,
        450000.00, -- 450 mil colones
        120, -- 120 horas por mes
        36, -- 36 meses (abril 2020 - marzo 2023)
        v_codigo_financiero
    );
    
    DBMS_OUTPUT.PUT_LINE('Presupuesto creado para proyecto C0236');
END;
/

PROMPT Asignando horas a investigadores del proyecto C0236...

-- Asignar horas a investigadores C0236
DECLARE
    v_presupuesto_id NUMBER;
    v_inv_proyecto_jaime NUMBER;
    v_inv_proyecto_ana NUMBER;
    v_inv_proyecto_maria NUMBER;
    v_inv_proyecto_carlos NUMBER;
    v_codigo_tiempo_completo NUMBER;
    v_codigo_medio_tiempo NUMBER;
    v_proyecto_id NUMBER;
    v_investigador_jaime NUMBER;
    v_investigador_ana NUMBER;
    v_investigador_maria NUMBER;
    v_investigador_carlos NUMBER;
    v_empleado_jaime NUMBER;
    v_empleado_ana NUMBER;
    v_empleado_maria NUMBER;
    v_empleado_carlos NUMBER;
BEGIN
    -- Obtener IDs necesarios
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C0236';
    SELECT MAX(ID_PRESUPUESTO) INTO v_presupuesto_id FROM PRESUPUESTO WHERE ID_PROYECTO = v_proyecto_id;
    
    SELECT ID_CODIGO INTO v_codigo_tiempo_completo FROM CODIGO WHERE ID_TIPO = 7 AND VALOR = 'TIEMPO COMPLETO';
    SELECT ID_CODIGO INTO v_codigo_medio_tiempo FROM CODIGO WHERE ID_TIPO = 7 AND VALOR = 'MEDIO TIEMPO';
    
    -- Obtener IDs de empleados
    SELECT ID_EMPLEADO INTO v_empleado_jaime FROM EMPLEADO WHERE IDENTIFICACION = '105770001';
    SELECT ID_EMPLEADO INTO v_empleado_ana FROM EMPLEADO WHERE IDENTIFICACION = '105770002';
    SELECT ID_EMPLEADO INTO v_empleado_maria FROM EMPLEADO WHERE IDENTIFICACION = '105770003';
    SELECT ID_EMPLEADO INTO v_empleado_carlos FROM EMPLEADO WHERE IDENTIFICACION = '105770004';
    
    -- Obtener IDs de investigadores
    SELECT ID_INVESTIGADOR INTO v_investigador_jaime FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_jaime;
    SELECT ID_INVESTIGADOR INTO v_investigador_ana FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_ana;
    SELECT ID_INVESTIGADOR INTO v_investigador_maria FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_maria;
    SELECT ID_INVESTIGADOR INTO v_investigador_carlos FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_carlos;
    
    -- Obtener IDs de investigador_proyecto
    SELECT ID_INVESTIGADOR_PROYECTO INTO v_inv_proyecto_jaime 
    FROM INVESTIGADOR_PROYECTO 
    WHERE ID_INVESTIGADOR = v_investigador_jaime AND ID_PROYECTO = v_proyecto_id;
    
    SELECT ID_INVESTIGADOR_PROYECTO INTO v_inv_proyecto_ana 
    FROM INVESTIGADOR_PROYECTO 
    WHERE ID_INVESTIGADOR = v_investigador_ana AND ID_PROYECTO = v_proyecto_id;
    
    SELECT ID_INVESTIGADOR_PROYECTO INTO v_inv_proyecto_maria 
    FROM INVESTIGADOR_PROYECTO 
    WHERE ID_INVESTIGADOR = v_investigador_maria AND ID_PROYECTO = v_proyecto_id;
    
    SELECT ID_INVESTIGADOR_PROYECTO INTO v_inv_proyecto_carlos 
    FROM INVESTIGADOR_PROYECTO 
    WHERE ID_INVESTIGADOR = v_investigador_carlos AND ID_PROYECTO = v_proyecto_id;
    
    -- Asignar horas a Jaime (40 horas/mes como investigador principal)
    PRC_INS_HORAS_ASIGNADAS(
        SEC_HORAS_ASIGNADAS.NEXTVAL,
        v_inv_proyecto_jaime,
        v_presupuesto_id,
        40, -- 40 horas por mes
        36, -- 36 meses (abril 2020 - marzo 2023)
        v_codigo_medio_tiempo
    );
    
    -- Asignar horas a Ana (30 horas/mes)
    PRC_INS_HORAS_ASIGNADAS(
        SEC_HORAS_ASIGNADAS.NEXTVAL,
        v_inv_proyecto_ana,
        v_presupuesto_id,
        30, -- 30 horas por mes
        36, -- 36 meses
        v_codigo_medio_tiempo
    );
    
    -- Asignar horas a María José (25 horas/mes)
    PRC_INS_HORAS_ASIGNADAS(
        SEC_HORAS_ASIGNADAS.NEXTVAL,
        v_inv_proyecto_maria,
        v_presupuesto_id,
        25, -- 25 horas por mes
        36, -- 36 meses
        v_codigo_medio_tiempo
    );
    
    -- Asignar horas a Carlos (25 horas/mes)
    PRC_INS_HORAS_ASIGNADAS(
        SEC_HORAS_ASIGNADAS.NEXTVAL,
        v_inv_proyecto_carlos,
        v_presupuesto_id,
        25, -- 25 horas por mes
        36, -- 36 meses
        v_codigo_medio_tiempo
    );
    
    DBMS_OUTPUT.PUT_LINE('Horas asignadas correctamente a investigadores del proyecto C0236');
END;
/

PROMPT Insertando objetivos específicos del proyecto C0236...

-- Insertar objetivos específicos C0236
DECLARE
    v_proyecto_id NUMBER;
BEGIN
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C0236';
    
    -- Objetivo 1: Evaluación del impacto
    INSERT INTO OBJETIVO_ESPECIFICO(ID_OBJETIVO, ID_PROYECTO, TIPO, DESCRIPCION)
    VALUES (SEC_OBJETIVO_ESPECIFICO.NEXTVAL, v_proyecto_id, 'Evaluativo', 
            'Evaluar el impacto de actores profesionales como participantes simulados en el aprendizaje clínico');
    
    -- Objetivo 2: Análisis de competencias
    INSERT INTO OBJETIVO_ESPECIFICO(ID_OBJETIVO, ID_PROYECTO, TIPO, DESCRIPCION)
    VALUES (SEC_OBJETIVO_ESPECIFICO.NEXTVAL, v_proyecto_id, 'Analítico', 
            'Analizar el desarrollo de competencias clínicas en estudiantes mediante simulación actoral');
    
    -- Objetivo 3: Validación metodológica
    INSERT INTO OBJETIVO_ESPECIFICO(ID_OBJETIVO, ID_PROYECTO, TIPO, DESCRIPCION)
    VALUES (SEC_OBJETIVO_ESPECIFICO.NEXTVAL, v_proyecto_id, 'Metodológico', 
            'Validar la metodología de simulación clínica con actores profesionales en enfermería');
    
    DBMS_OUTPUT.PUT_LINE('Objetivos específicos insertados para proyecto C0236');
END;
/

PROMPT Insertando metas del proyecto C0236...

-- Insertar metas para los objetivos C0236
DECLARE
    v_objetivo1_id NUMBER;
    v_objetivo2_id NUMBER;
    v_objetivo3_id NUMBER;
    v_tipo_cuantitativa NUMBER;
    v_tipo_cualitativa NUMBER;
    v_proyecto_id NUMBER;
BEGIN
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C0236';
    SELECT ID_CODIGO INTO v_tipo_cuantitativa FROM CODIGO WHERE ID_TIPO = 11 AND VALOR = 'CUANTITATIVA';
    SELECT ID_CODIGO INTO v_tipo_cualitativa FROM CODIGO WHERE ID_TIPO = 11 AND VALOR = 'CUALITATIVA';
    
    -- Obtener IDs de objetivos
    SELECT MIN(ID_OBJETIVO) INTO v_objetivo1_id FROM OBJETIVO_ESPECIFICO WHERE ID_PROYECTO = v_proyecto_id;
    SELECT ID_OBJETIVO INTO v_objetivo2_id FROM OBJETIVO_ESPECIFICO WHERE ID_PROYECTO = v_proyecto_id AND TIPO = 'Analítico';
    SELECT ID_OBJETIVO INTO v_objetivo3_id FROM OBJETIVO_ESPECIFICO WHERE ID_PROYECTO = v_proyecto_id AND TIPO = 'Metodológico';
    
    -- Metas para Objetivo 1
    INSERT INTO META(ID_META, ID_OBJETIVO, ID_CODIGO_TIPO, DESCRIPCION, CANTIDAD)
    VALUES (SEC_META.NEXTVAL, v_objetivo1_id, v_tipo_cuantitativa, 
            'Número de estudiantes evaluados en simulaciones con actores', 150);
    
    -- Metas para Objetivo 2
    INSERT INTO META(ID_META, ID_OBJETIVO, ID_CODIGO_TIPO, DESCRIPCION, CANTIDAD)
    VALUES (SEC_META.NEXTVAL, v_objetivo2_id, v_tipo_cuantitativa, 
            'Número de competencias clínicas evaluadas por simulación', 8);
    
    -- Metas para Objetivo 3
    INSERT INTO META(ID_META, ID_OBJETIVO, ID_CODIGO_TIPO, DESCRIPCION, CANTIDAD)
    VALUES (SEC_META.NEXTVAL, v_objetivo3_id, v_tipo_cualitativa, 
            'Validación completa de la metodología de simulación actoral', 1);
    
    DBMS_OUTPUT.PUT_LINE('Metas insertadas para proyecto C0236');
END;
/

PROMPT Registrando gastos del proyecto C0236...

-- Registrar gastos del proyecto C0236
DECLARE
    v_presupuesto_id NUMBER;
    v_proyecto_id NUMBER;
BEGIN
    -- Obtener IDs necesarios
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C0236';
    SELECT MAX(ID_PRESUPUESTO) INTO v_presupuesto_id FROM PRESUPUESTO WHERE ID_PROYECTO = v_proyecto_id;
    
    -- Gasto 1: Contratación de actores profesionales
    INSERT INTO GASTO(ID_GASTO, ID_PRESUPUESTO, MONTO, FECHA_GASTO, CATEGORIA_GASTO, DESCRIPCION)
    VALUES (SEC_GASTO.NEXTVAL, v_presupuesto_id, 125000.00, TO_DATE('15-06-2021', 'DD-MM-YYYY'), 
            'Servicios Profesionales', 
            'Contratación de 5 actores profesionales para participar como pacientes simulados en 20 sesiones de práctica clínica. Incluye honorarios, preparación de casos y evaluación de desempeño estudiantil.');
    
    -- Gasto 2: Material audiovisual y equipo de grabación
    INSERT INTO GASTO(ID_GASTO, ID_PRESUPUESTO, MONTO, FECHA_GASTO, CATEGORIA_GASTO, DESCRIPCION)
    VALUES (SEC_GASTO.NEXTVAL, v_presupuesto_id, 85000.00, TO_DATE('10-09-2021', 'DD-MM-YYYY'), 
            'Equipo y Material', 
            'Adquisición de cámaras de video, micrófonos, trípodes y equipo de iluminación para grabación de sesiones de simulación clínica. Incluye tarjetas de memoria y accesorios para documentación.');
    
    -- Gasto 3: Capacitación y entrenamiento de actores
    INSERT INTO GASTO(ID_GASTO, ID_PRESUPUESTO, MONTO, FECHA_GASTO, CATEGORIA_GASTO, DESCRIPCION)
    VALUES (SEC_GASTO.NEXTVAL, v_presupuesto_id, 45000.00, TO_DATE('25-11-2021', 'DD-MM-YYYY'), 
            'Capacitación', 
            'Curso de entrenamiento especializado para actores en simulación médica y enfermería. Incluye material didáctico, certificación y talleres prácticos sobre representación de síntomas y condiciones clínicas.');
    
    -- Gasto 4: Material de análisis y procesamiento de datos
    INSERT INTO GASTO(ID_GASTO, ID_PRESUPUESTO, MONTO, FECHA_GASTO, CATEGORIA_GASTO, DESCRIPCION)
    VALUES (SEC_GASTO.NEXTVAL, v_presupuesto_id, 35000.00, TO_DATE('18-03-2022', 'DD-MM-YYYY'), 
            'Software y Análisis', 
            'Licencias de software SPSS para análisis estadístico de datos, NVivo para análisis cualitativo, y material de transcripción. Incluye capacitación del equipo investigador en uso de herramientas.');
    
    -- Gasto 5: Publicación y difusión de resultados
    INSERT INTO GASTO(ID_GASTO, ID_PRESUPUESTO, MONTO, FECHA_GASTO, CATEGORIA_GASTO, DESCRIPCION)
    VALUES (SEC_GASTO.NEXTVAL, v_presupuesto_id, 60000.00, TO_DATE('12-12-2022', 'DD-MM-YYYY'), 
            'Publicación', 
            'Gastos de publicación en revista científica indexada, participación en congreso internacional de educación en enfermería, y producción de material de difusión (folletos, presentaciones, video resumen).');
    
    DBMS_OUTPUT.PUT_LINE('Gastos registrados correctamente para proyecto C0236');
END;
/

COMMIT;

-- ========================================
-- RESUMEN FINAL Y VERIFICACIÓN
-- ========================================

PROMPT 
PROMPT ========================================
PROMPT PROYECTOS C1766 Y C0236 INSERTADOS CORRECTAMENTE
PROMPT ========================================

PROMPT 
PROMPT VERIFICANDO DATOS DE AMBOS PROYECTOS:

SELECT 'PROYECTOS CREADOS' as TIPO, P.CODIGO_PROYECTO as CODIGO, 
       SUBSTR(P.NOMBRE_PROYECTO, 1, 50) as NOMBRE_CORTO, 
       TO_CHAR(P.FECHA_INICIO, 'DD/MM/YYYY') as FECHA_INICIO,
       TO_CHAR(P.FECHA_FINALIZACION, 'DD/MM/YYYY') as FECHA_FIN,
       C.VALOR as ESTADO
FROM PROYECTO P
JOIN CODIGO C ON P.ID_CODIGO_ESTADO = C.ID_CODIGO
WHERE P.CODIGO_PROYECTO IN ('C1766', 'C0236')
ORDER BY P.CODIGO_PROYECTO;

PROMPT 
PROMPT USUARIOS CREADOS CON CONTRASEÑAS ENCRIPTADAS:

SELECT U.NOMBRE_USUARIO, E.NOMBRE_COMPLETO, 
       CASE WHEN U.CONTRASENA LIKE '$2a$%' THEN 'ENCRIPTADA (BCrypt)' 
            WHEN U.CONTRASENA LIKE '$%' THEN 'ENCRIPTADA (Hash)' 
            ELSE 'NO ENCRIPTADA' END as ESTADO_CONTRASENA
FROM USUARIO U
JOIN EMPLEADO E ON U.ID_EMPLEADO = E.ID_EMPLEADO
WHERE E.CORREO IN ('MARIA.SAENZMADRIGAL@ucr.ac.cr', 'JAIME.FORNAGUERA@ucr.ac.cr');

PROMPT 
PROMPT INVESTIGADORES POR PROYECTO:

SELECT P.CODIGO_PROYECTO, E.NOMBRE_COMPLETO as NOMBRE, 
       RP.NOMBRE_PERMISO as ROL,
       TO_CHAR(IP.FECHA_INICIO_INVESTIGADOR, 'DD/MM/YYYY') as FECHA_INICIO,
       TO_CHAR(IP.FECHA_FIN_INVESTIGADOR, 'DD/MM/YYYY') as FECHA_FIN
FROM INVESTIGADOR_PROYECTO IP
JOIN INVESTIGADOR I ON IP.ID_INVESTIGADOR = I.ID_INVESTIGADOR
JOIN EMPLEADO E ON I.ID_EMPLEADO = E.ID_EMPLEADO  
JOIN ROL_PROYECTO RP ON IP.ID_ROL_PROYECTO = RP.ID_ROL_PROYECTO
JOIN PROYECTO P ON IP.ID_PROYECTO = P.ID_PROYECTO
WHERE P.CODIGO_PROYECTO IN ('C1766', 'C0236')
ORDER BY P.CODIGO_PROYECTO, RP.NOMBRE_PERMISO DESC, E.NOMBRE_COMPLETO;

PROMPT 
PROMPT RESUMEN FINANCIERO:

SELECT P.CODIGO_PROYECTO, 
       'PRESUPUESTO' as CONCEPTO, 
       TO_CHAR(PR.MONTO, 'L999,999,999.00') as MONTO
FROM PRESUPUESTO PR
JOIN PROYECTO P ON PR.ID_PROYECTO = P.ID_PROYECTO
WHERE P.CODIGO_PROYECTO IN ('C1766', 'C0236')
UNION ALL
SELECT P.CODIGO_PROYECTO, 
       'GASTADO' as CONCEPTO, 
       TO_CHAR(SUM(G.MONTO), 'L999,999,999.00') as MONTO
FROM GASTO G
JOIN PRESUPUESTO PR ON G.ID_PRESUPUESTO = PR.ID_PRESUPUESTO
JOIN PROYECTO P ON PR.ID_PROYECTO = P.ID_PROYECTO
WHERE P.CODIGO_PROYECTO IN ('C1766', 'C0236')
GROUP BY P.CODIGO_PROYECTO
ORDER BY CODIGO_PROYECTO, CONCEPTO;

PROMPT 
PROMPT ========================================
PROMPT RESUMEN FINAL:
PROMPT ========================================
PROMPT - C1766: LA RED DE LAS AMÉRICAS (ACTIVO) - 3 investigadores
PROMPT - C0236: SIMULACIÓN CLÍNICA (FINALIZADO) - 4 investigadores
PROMPT - Usuarios: maria.saenz y jaime.fornaguera (contraseña: admin123)
PROMPT - Contraseñas: Encriptadas con simulación BCrypt
PROMPT - Presupuestos: Asignados con gastos realistas
PROMPT ========================================

EXIT