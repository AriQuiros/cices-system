

--------------------------------------------------------------------------------
-- 1. CREAR PROYECTO
--------------------------------------------------------------------------------

PROMPT ==================================
PROMPT ==== 1. CREANDO PROYECTO C1766 ===
PROMPT ==================================

DECLARE
    v_codigo_estado NUMBER;
    v_codigo_tipo NUMBER;
BEGIN
    SELECT ID INTO v_codigo_estado FROM REP_ESTADO_PROYECTO WHERE UPPER(NOMBRE) = 'ACTIVO';
    SELECT ID INTO v_codigo_tipo FROM REP_TIPO_PROYECTO WHERE UPPER(NOMBRE) = 'ACTIVIDADES';

    PRC_INS_PROYECTO(
        SEC_PROYECTO.NEXTVAL,
        'LA RED DE LAS AMÉRICAS PARA LA EQUIDAD EN SALUD',
        'C1766',
        TO_DATE('01-07-2021','DD-MM-YYYY'),
        v_codigo_estado,
        'CONSOLIDAR LA SECRETARÍA TÉCNICA DE LA RED DE LAS AMÉRICAS PARA LA EQUIDAD EN SALUD (RAES) EN LA UNIVERSIDAD DE COSTA RICA.',
        'Salud',
        v_codigo_tipo,
        TO_DATE('31-12-2025','DD-MM-YYYY')
    );
END;
/

--------------------------------------------------------------------------------
-- 2. INSERTAR OBJETIVOS ESPECÍFICOS
--------------------------------------------------------------------------------
PROMPT ==================================
PROMPT ==== 2. INSERTANDO OBJETIVOS =====
PROMPT ==================================

DECLARE
    v_proyecto_id NUMBER;
BEGIN
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C1766';

    INSERT INTO OBJETIVO_ESPECIFICO(ID_OBJETIVO, ID_PROYECTO, TIPO, DESCRIPCION)
    VALUES (SEC_OBJETIVO_ESPECIFICO.NEXTVAL, v_proyecto_id, 'Organizacional', 'Fortalecer la estructura organizacional de la Secretaría Técnica de RAES en la UCR');

    INSERT INTO OBJETIVO_ESPECIFICO(ID_OBJETIVO, ID_PROYECTO, TIPO, DESCRIPCION)
    VALUES (SEC_OBJETIVO_ESPECIFICO.NEXTVAL, v_proyecto_id, 'Capacidades', 'Desarrollar las capacidades técnicas y operativas del equipo de la Secretaría Técnica');

    INSERT INTO OBJETIVO_ESPECIFICO(ID_OBJETIVO, ID_PROYECTO, TIPO, DESCRIPCION)
    VALUES (SEC_OBJETIVO_ESPECIFICO.NEXTVAL, v_proyecto_id, 'Coordinación', 'Establecer mecanismos efectivos de coordinación con los países miembros de RAES');
END;
/

--------------------------------------------------------------------------------
-- 3. INSERTAR METAS
--------------------------------------------------------------------------------
PROMPT ==================================
PROMPT ====== 3. INSERTANDO METAS =======
PROMPT ==================================

DECLARE
    v_proyecto_id NUMBER;
    v_objetivo1 NUMBER;
    v_objetivo2 NUMBER;
    v_objetivo3 NUMBER;
    v_tipo_cuantitativa NUMBER;
    v_tipo_cualitativa NUMBER;
BEGIN
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO='C1766';
    SELECT ID INTO v_tipo_cuantitativa FROM REP_TIPO_META WHERE UPPER(NOMBRE)='CUANTITATIVA';
    SELECT ID INTO v_tipo_cualitativa FROM REP_TIPO_META WHERE UPPER(NOMBRE)='CUALITATIVA';

    SELECT MIN(ID_OBJETIVO) INTO v_objetivo1 FROM OBJETIVO_ESPECIFICO WHERE ID_PROYECTO=v_proyecto_id;
    SELECT ID_OBJETIVO INTO v_objetivo2 FROM OBJETIVO_ESPECIFICO WHERE ID_PROYECTO=v_proyecto_id AND TIPO='Capacidades';
    SELECT ID_OBJETIVO INTO v_objetivo3 FROM OBJETIVO_ESPECIFICO WHERE ID_PROYECTO=v_proyecto_id AND TIPO='Coordinación';

    INSERT INTO META(ID_META, ID_OBJETIVO, ID_CODIGO_TIPO, DESCRIPCION, CANTIDAD)
    VALUES (SEC_META.NEXTVAL, v_objetivo1, v_tipo_cualitativa, 'Establecimiento completo de la estructura organizacional', 1);

    INSERT INTO META(ID_META, ID_OBJETIVO, ID_CODIGO_TIPO, DESCRIPCION, CANTIDAD)
    VALUES (SEC_META.NEXTVAL, v_objetivo2, v_tipo_cuantitativa, 'Número de capacitaciones realizadas al equipo técnico', 1);

    INSERT INTO META(ID_META, ID_OBJETIVO, ID_CODIGO_TIPO, DESCRIPCION, CANTIDAD)
    VALUES (SEC_META.NEXTVAL, v_objetivo3, v_tipo_cuantitativa, 'Número de reuniones de coordinación con países miembros', 1);
END;
/

--------------------------------------------------------------------------------
-- 4. INSERTAR INDICADORES PARA METAS
--------------------------------------------------------------------------------
PROMPT ==================================
PROMPT === 4. INSERTANDO INDICADORES ====
PROMPT ==================================
DECLARE
    v_proyecto_id NUMBER;
    v_meta1 NUMBER;
    v_meta2 NUMBER;
    v_meta3 NUMBER;
BEGIN
    -- Obtener ID del proyecto
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C1766';

    -- Obtener IDs de metas
    SELECT MIN(ID_META) INTO v_meta1 FROM META WHERE ID_OBJETIVO = (SELECT MIN(ID_OBJETIVO) FROM OBJETIVO_ESPECIFICO WHERE ID_PROYECTO = v_proyecto_id);
    SELECT ID_META INTO v_meta2 FROM META WHERE ID_OBJETIVO = (SELECT ID_OBJETIVO FROM OBJETIVO_ESPECIFICO WHERE ID_PROYECTO = v_proyecto_id AND TIPO='Capacidades');
    SELECT ID_META INTO v_meta3 FROM META WHERE ID_OBJETIVO = (SELECT ID_OBJETIVO FROM OBJETIVO_ESPECIFICO WHERE ID_PROYECTO = v_proyecto_id AND TIPO='Coordinación');

    -- Insertar indicadores para Meta 1 (Objetivo Organizacional)
    INSERT INTO INDICADOR(ID_INDICADOR, ID_META, DESCRIPCION)
    VALUES (SEC_INDICADOR.NEXTVAL, v_meta1, 'Estructura organizacional completamente documentada y validada por el equipo');

    -- Insertar indicadores para Meta 2 (Objetivo Capacidades)
    INSERT INTO INDICADOR(ID_INDICADOR, ID_META, DESCRIPCION)
    VALUES (SEC_INDICADOR.NEXTVAL, v_meta2, 'Número de capacitaciones completadas por cada miembro del equipo técnico');

    -- Insertar indicadores para Meta 3 (Objetivo Coordinación)
    INSERT INTO INDICADOR(ID_INDICADOR, ID_META, DESCRIPCION)
    VALUES (SEC_INDICADOR.NEXTVAL, v_meta3, 'Número de reuniones realizadas con representantes de países miembros y reportadas formalmente');
END;
/

--------------------------------------------------------------------------------
-- 5. PRESUPUESTO FINANCIERO GENERAL Y POR CATEGORÍAS
--------------------------------------------------------------------------------
PROMPT ==================================
PROMPT == 5. INSERTANDO PRESUPUESTO F ===
PROMPT ==================================
DECLARE
    v_proyecto_id NUMBER;
    v_codigo_tipo_presupuesto NUMBER;
    v_codigo_fuente_financiamiento NUMBER;
BEGIN
    -- Obtener ID del proyecto
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C1766';

    -- Obtener códigos para tipo de presupuesto y fuente de financiamiento
    SELECT ID_CODIGO INTO v_codigo_tipo_presupuesto FROM CODIGO WHERE ID_TIPO = 10 AND VALOR = 'ORDINARIO';
    SELECT ID_CODIGO INTO v_codigo_fuente_financiamiento FROM CODIGO WHERE ID_TIPO = 11 AND VALOR = 'FINANCIERO';

    -- Presupuesto financiero general
    PRC_INS_PRESUPUESTO(
        SEC_PRESUPUESTO.NEXTVAL,
        v_proyecto_id,
        'Presupuesto financiero general para consolidación de RAES',
        TO_DATE('01-07-2021','DD-MM-YYYY'),
        v_codigo_tipo_presupuesto,
        250000.00, 
        0,
        0, 
        v_codigo_fuente_financiamiento
    );

    -- Presupuestos desglosados
    PRC_INS_PRESUPUESTO(
        SEC_PRESUPUESTO.NEXTVAL,
        v_proyecto_id,
        'Alimentación',
        TO_DATE('01-07-2021','DD-MM-YYYY'),
        v_codigo_tipo_presupuesto,
        50000.00,
        0,
        0,
        v_codigo_fuente_financiamiento
    );

    PRC_INS_PRESUPUESTO(
        SEC_PRESUPUESTO.NEXTVAL,
        v_proyecto_id,
        'Materiales y suministros (biáticos)',
        TO_DATE('01-07-2021','DD-MM-YYYY'),
        v_codigo_tipo_presupuesto,
        70000.00,
        0,
        0,
        v_codigo_fuente_financiamiento
    );

    PRC_INS_PRESUPUESTO(
        SEC_PRESUPUESTO.NEXTVAL,
        v_proyecto_id,
        'Transporte y movilidad',
        TO_DATE('01-07-2021','DD-MM-YYYY'),
        v_codigo_tipo_presupuesto,
        40000.00,
        0,
        0,
        v_codigo_fuente_financiamiento
    );

    PRC_INS_PRESUPUESTO(
        SEC_PRESUPUESTO.NEXTVAL,
        v_proyecto_id,
        'Otros gastos operativos',
        TO_DATE('01-07-2021','DD-MM-YYYY'),
        v_codigo_tipo_presupuesto,
        40000.00,
        0,
        0,
        v_codigo_fuente_financiamiento
    );
END;
/


--------------------------------------------------------------------------------
-- 6. PRESUPUESTO EN HORAS (CARGA ACADEMICA)
--------------------------------------------------------------------------------
PROMPT ==================================
PROMPT == 6. INSERTANDO PRESUPUESTO H ===
PROMPT ==================================
DECLARE
    v_proyecto_id NUMBER;
    v_codigo_tipo_presupuesto NUMBER;
BEGIN
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C1766';
    SELECT ID_CODIGO INTO v_codigo_tipo_presupuesto FROM CODIGO WHERE ID_TIPO = 10 AND VALOR = 'HORAS';

    -- Presupuesto de horas
    PRC_INS_PRESUPUESTO(
        SEC_PRESUPUESTO.NEXTVAL,
        v_proyecto_id,
        'Presupuesto de horas investigadores',
        TO_DATE('01-01-2024','DD-MM-YYYY'),
        v_codigo_tipo_presupuesto,
        0,  
        180, 
        24,
        NULL 
    );
END;
/

--------------------------------------------------------------------------------
-- 7. ASIGNAR INVESTIGADORES AL PROYECTO
--------------------------------------------------------------------------------
PROMPT ==================================
PROMPT == 7. ASIGNANDO INVESTIGADORES ===
PROMPT ==================================
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
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C1766';

    SELECT ID_EMPLEADO INTO v_empleado_maria FROM EMPLEADO WHERE IDENTIFICACION = '208880001';
    SELECT ID_EMPLEADO INTO v_empleado_ingrid FROM EMPLEADO WHERE IDENTIFICACION = '208880002';
    SELECT ID_EMPLEADO INTO v_empleado_karol FROM EMPLEADO WHERE IDENTIFICACION = '208880003';

    SELECT ID_INVESTIGADOR INTO v_investigador_maria FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_maria;
    SELECT ID_INVESTIGADOR INTO v_investigador_ingrid FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_ingrid;
    SELECT ID_INVESTIGADOR INTO v_investigador_karol FROM INVESTIGADOR WHERE ID_EMPLEADO = v_empleado_karol;

    SELECT ID INTO v_rol_principal FROM REP_ROL_PROYECTO WHERE UPPER(NOMBRE) = 'INVESTIGADOR_PRINCIPAL';
    SELECT ID INTO v_rol_asociado FROM REP_ROL_PROYECTO WHERE UPPER(NOMBRE) = 'COLABORADOR';

    PRC_INS_INVESTIGADOR_PROYECTO(SEC_INVESTIGADOR_PROYECTO.NEXTVAL, v_investigador_maria, v_rol_principal, v_proyecto_id, 'Investigador principal responsable de consolidar la Secretaría Técnica de RAES', TO_DATE('01-01-2024','DD-MM-YYYY'), TO_DATE('31-12-2025','DD-MM-YYYY'));
    PRC_INS_INVESTIGADOR_PROYECTO(SEC_INVESTIGADOR_PROYECTO.NEXTVAL, v_investigador_ingrid, v_rol_asociado, v_proyecto_id, 'Investigador asociado en actividades de la red de equidad en salud', TO_DATE('01-01-2024','DD-MM-YYYY'), TO_DATE('31-12-2025','DD-MM-YYYY'));
    PRC_INS_INVESTIGADOR_PROYECTO(SEC_INVESTIGADOR_PROYECTO.NEXTVAL, v_investigador_karol, v_rol_asociado, v_proyecto_id, 'Investigador asociado en coordinación de actividades de la red', TO_DATE('02-07-2022','DD-MM-YYYY'), TO_DATE('30-11-2023','DD-MM-YYYY'));
END;
/

--------------------------------------------------------------------------------
-- 8. ASIGNAR HORAS
--------------------------------------------------------------------------------
PROMPT ==================================
PROMPT ======= 8. ASIGNANDO HORAS =======
PROMPT ==================================
DECLARE
    v_proyecto_id NUMBER;
    v_presupuesto_horas_id NUMBER;

    v_modalidad_apoyo NUMBER;
    v_modalidad_regimen NUMBER;

    v_tipo_tiempo_completo NUMBER;
    v_tipo_medio_tiempo NUMBER;
    v_tipo_cuarto_tiempo NUMBER;

    v_investigador_maria NUMBER;
    v_investigador_ingrid NUMBER;
    v_investigador_karol NUMBER;

    v_horas_max NUMBER;
BEGIN
    -- Proyecto y presupuesto de horas
    SELECT ID_PROYECTO INTO v_proyecto_id FROM PROYECTO WHERE CODIGO_PROYECTO = 'C1766';

    SELECT MAX(ID_PRESUPUESTO) INTO v_presupuesto_horas_id
    FROM PRESUPUESTO
    WHERE ID_PROYECTO = v_proyecto_id AND DESCRIPCION LIKE '%horas%';

    -- Modalidades horarias desde la vista
    SELECT ID INTO v_modalidad_apoyo FROM REP_MODALIDAD_HORARIA WHERE NOMBRE = 'APOYO ESTUDIANTIL';
    SELECT ID INTO v_modalidad_regimen FROM REP_MODALIDAD_HORARIA WHERE NOMBRE = 'REGIMEN POR TIEMPO';

    -- IDs de investigadores
    SELECT ID_INVESTIGADOR INTO v_investigador_maria FROM INVESTIGADOR WHERE ID_EMPLEADO = '208880001';
    SELECT ID_INVESTIGADOR INTO v_investigador_ingrid FROM INVESTIGADOR WHERE ID_EMPLEADO = '208880002';
    SELECT ID_INVESTIGADOR INTO v_investigador_karol FROM INVESTIGADOR WHERE ID_EMPLEADO = '208880003';

    -- María: REGIMEN POR TIEMPO, tiempo completo → 40h
    v_horas_max := 40;
    PRC_INS_HORAS_ASIGNADAS(
        SEC_HORAS_ASIGNADAS.NEXTVAL,
        v_investigador_maria,
        v_presupuesto_horas_id,
        v_horas_max,
        24,
        v_modalidad_regimen  -- solo aplica para REGIMEN POR TIEMPO
    );

    -- Ingrid: REGIMEN POR TIEMPO, medio tiempo → 20h
    v_horas_max := 20;
    PRC_INS_HORAS_ASIGNADAS(
        SEC_HORAS_ASIGNADAS.NEXTVAL,
        v_investigador_ingrid,
        v_presupuesto_horas_id,
        v_horas_max,
        24,
        v_modalidad_regimen
    );

    -- Karol: APOYO ESTUDIANTIL, máximo 20h, tipo de horas no aplica
    v_horas_max := 20;
    PRC_INS_HORAS_ASIGNADAS(
        SEC_HORAS_ASIGNADAS.NEXTVAL,
        v_investigador_karol,
        v_presupuesto_horas_id,
        v_horas_max,
        17,
        v_modalidad_apoyo
    );

END;
/

--------------------------------------------------------------------------------
-- 9. INSERTAR ENTIDADES
--------------------------------------------------------------------------------
PROMPT ==================================
PROMPT ==== 9. INSERTANDO ENTIDADES =====
PROMPT ==================================
DECLARE
    v_id_tipo_sitio NUMBER;
    v_id_tipo_institucion NUMBER;
    v_id_tipo_unidad NUMBER;

    -- IDs para las entidades que vamos a crear
    v_san_jose NUMBER;
    v_heredia NUMBER;
    v_ucr NUMBER;
    v_universidad_nacional NUMBER;
    v_esc_enfermeria NUMBER;
    v_esc_educacion_fisica NUMBER;
    v_esc_informatica NUMBER;
BEGIN
    -- Obtener IDs de tipos de entidad desde la vista
    SELECT ID INTO v_id_tipo_sitio FROM REP_TIPO_ENTIDAD WHERE NOMBRE = 'SITIO';
    SELECT ID INTO v_id_tipo_institucion FROM REP_TIPO_ENTIDAD WHERE NOMBRE = 'INSTITUCION';
    SELECT ID INTO v_id_tipo_unidad FROM REP_TIPO_ENTIDAD WHERE NOMBRE = 'UNIDAD';

    -- Insertar SITIOS
    INSERT INTO ENTIDAD(ID_ENTIDAD, NOMBRE, ID_CODIGO_TIPO_)
    VALUES (SEC_ENTIDAD.NEXTVAL, 'San Jose', v_id_tipo_sitio)
    RETURNING ID_ENTIDAD INTO v_san_jose;

    INSERT INTO ENTIDAD(ID_ENTIDAD, NOMBRE, ID_CODIGO_TIPO_)
    VALUES (SEC_ENTIDAD.NEXTVAL, 'Heredia', v_id_tipo_sitio)
    RETURNING ID_ENTIDAD INTO v_heredia;

    -- Insertar INSTITUCIONES
    INSERT INTO ENTIDAD(ID_ENTIDAD, NOMBRE, ID_CODIGO_TIPO_)
    VALUES (SEC_ENTIDAD.NEXTVAL, 'Universidad de Costa Rica', v_id_tipo_institucion)
    RETURNING ID_ENTIDAD INTO v_ucr;

    INSERT INTO ENTIDAD(ID_ENTIDAD, NOMBRE, ID_CODIGO_TIPO_)
    VALUES (SEC_ENTIDAD.NEXTVAL, 'Universidad Nacional', v_id_tipo_institucion)
    RETURNING ID_ENTIDAD INTO v_universidad_nacional;

    -- Insertar UNIDADES
    INSERT INTO ENTIDAD(ID_ENTIDAD, NOMBRE, ID_CODIGO_TIPO_)
    VALUES (SEC_ENTIDAD.NEXTVAL, 'Escuela de Enfermeria', v_id_tipo_unidad)
    RETURNING ID_ENTIDAD INTO v_esc_enfermeria;

    INSERT INTO ENTIDAD(ID_ENTIDAD, NOMBRE, ID_CODIGO_TIPO_)
    VALUES (SEC_ENTIDAD.NEXTVAL, 'Escuela de Educacion Fisica y Deportes', v_id_tipo_unidad)
    RETURNING ID_ENTIDAD INTO v_esc_educacion_fisica;

    INSERT INTO ENTIDAD(ID_ENTIDAD, NOMBRE, ID_CODIGO_TIPO_)
    VALUES (SEC_ENTIDAD.NEXTVAL, 'Escuela de Informatica', v_id_tipo_unidad)
    RETURNING ID_ENTIDAD INTO v_esc_informatica;

    COMMIT;
END;
/

--------------------------------------------------------------------------------
-- 10. ASIGNAR ENTIDADES
--------------------------------------------------------------------------------
PROMPT ==================================
PROMPT ==== 10. ASIGNANDO ENTIDADES =====
PROMPT ==================================
DECLARE
    v_proyecto_id NUMBER;
BEGIN
    -- Obtener ID del proyecto
    SELECT ID_PROYECTO INTO v_proyecto_id
    FROM PROYECTO
    WHERE CODIGO_PROYECTO = 'C1766';

    -- Enlazar SITIOS
	-- San Jose
    INSERT INTO ENTIDAD_PROYECTO(ID_ENTIDAD_PROYECTO, ID_ENTIDAD, ID_PROYECTO)
    VALUES (SEC_ENTIDAD_PROYECTO.NEXTVAL, 1, v_proyecto_id);4
		-- INSTITUCIONES
		-- Universidad de Costa Rica
		INSERT INTO ENTIDAD_PROYECTO(ID_ENTIDAD_PROYECTO, ID_ENTIDAD, ID_PROYECTO)
		VALUES (SEC_ENTIDAD_PROYECTO.NEXTVAL, 3, v_proyecto_id);
			-- UNIDADES
			-- Escuela de Enfermeria
			INSERT INTO ENTIDAD_PROYECTO(ID_ENTIDAD_PROYECTO, ID_ENTIDAD, ID_PROYECTO)
			VALUES (SEC_ENTIDAD_PROYECTO.NEXTVAL, 5, v_proyecto_id); 
			-- Escuela de Educacion Fisica y Deportes
			INSERT INTO ENTIDAD_PROYECTO(ID_ENTIDAD_PROYECTO, ID_ENTIDAD, ID_PROYECTO)
			VALUES (SEC_ENTIDAD_PROYECTO.NEXTVAL, 6, v_proyecto_id);

	-- Heredia
    INSERT INTO ENTIDAD_PROYECTO(ID_ENTIDAD_PROYECTO, ID_ENTIDAD, ID_PROYECTO)
    VALUES (SEC_ENTIDAD_PROYECTO.NEXTVAL, 2, v_proyecto_id);
		-- INSTITUCIONES
		-- Universidad Nacional
		INSERT INTO ENTIDAD_PROYECTO(ID_ENTIDAD_PROYECTO, ID_ENTIDAD, ID_PROYECTO)
		VALUES (SEC_ENTIDAD_PROYECTO.NEXTVAL, 4, v_proyecto_id);
			-- UNIDADES
			-- Escuela de Informatica
			INSERT INTO ENTIDAD_PROYECTO(ID_ENTIDAD_PROYECTO, ID_ENTIDAD, ID_PROYECTO)
			VALUES (SEC_ENTIDAD_PROYECTO.NEXTVAL, 7, v_proyecto_id); 

    COMMIT;
END;
/
