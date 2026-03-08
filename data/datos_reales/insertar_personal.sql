
/* =====================================================
   DIRECTOR: Derby Muñoz Rojas (303620532)
   ===================================================== */
DECLARE
    v_id_empleado  EMPLEADO.ID_EMPLEADO%TYPE;
    v_id_usuario   USUARIO.ID_USUARIO%TYPE;
    v_id_tipo_id   NUMBER;
    v_id_grado     NUMBER;
    v_id_rol       NUMBER;
BEGIN
    -- Tipo de identificación
    SELECT ID
    INTO v_id_tipo_id
    FROM REP_IDENTIFICACION
    WHERE UPPER(NOMBRE) = 'NACIONAL';

    -- Grado académico: DOCTORADO
    SELECT ID
    INTO v_id_grado
    FROM REP_GRADO_ACADEMICO
    WHERE UPPER(NOMBRE) = 'DOCTORADO';

    -- EMPLEADO
    BEGIN
        SELECT ID_EMPLEADO
        INTO v_id_empleado
        FROM EMPLEADO
        WHERE IDENTIFICACION = '303620532';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            PRC_INS_EMPLEADO(
                'Derby Muñoz Rojas',
                'Costarricense',
                v_id_tipo_id,
                '303620532',
                'derby.munoz@ucr.ac.cr',
                v_id_grado,
                '88744842'
            );

            SELECT ID_EMPLEADO
            INTO v_id_empleado
            FROM EMPLEADO
            WHERE IDENTIFICACION = '303620532';
    END;

    -- USUARIO
    BEGIN
        SELECT ID_USUARIO
        INTO v_id_usuario
        FROM USUARIO
        WHERE ID_EMPLEADO = v_id_empleado;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            PRC_INS_USUARIO(
                v_id_empleado,
                'derby.munoz@ucr.ac.cr',
                '$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',
                1
            );

            SELECT ID_USUARIO
            INTO v_id_usuario
            FROM USUARIO
            WHERE ID_EMPLEADO = v_id_empleado;
    END;

    -- ROL DIRECTOR
    SELECT ID
    INTO v_id_rol
    FROM REP_ROL
    WHERE UPPER(NOMBRE) = 'DIRECTOR';

    BEGIN
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
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
            NULL;
    END;
END;
/

COMMIT;

/* =====================================================
   ADMINISTRADORA: Jennifer Leticia Gutierrez Rivera (113410210)
   ===================================================== */
DECLARE
    v_id_empleado  EMPLEADO.ID_EMPLEADO%TYPE;
    v_id_usuario   USUARIO.ID_USUARIO%TYPE;
    v_id_tipo_id   NUMBER;
    v_id_grado     NUMBER;
    v_id_rol       NUMBER;
BEGIN
    -- Tipo de identificación
    SELECT ID
    INTO v_id_tipo_id
    FROM REP_IDENTIFICACION
    WHERE UPPER(NOMBRE) = 'NACIONAL';

    -- Grado académico: LICENCIATURA
    SELECT ID
    INTO v_id_grado
    FROM REP_GRADO_ACADEMICO
    WHERE UPPER(NOMBRE) = 'LICENCIATURA';

    -- EMPLEADO
    BEGIN
        SELECT ID_EMPLEADO
        INTO v_id_empleado
        FROM EMPLEADO
        WHERE IDENTIFICACION = '113410210';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            PRC_INS_EMPLEADO(
                'Jennifer Leticia Gutierrez Rivera',
                'Costarricense',
                v_id_tipo_id,
                '113410210',
                'jennifer.gutierrez@ucr.ac.cr',
                v_id_grado,
                '87243161'
            );

            SELECT ID_EMPLEADO
            INTO v_id_empleado
            FROM EMPLEADO
            WHERE IDENTIFICACION = '113410210';
    END;

    -- USUARIO
    BEGIN
        SELECT ID_USUARIO
        INTO v_id_usuario
        FROM USUARIO
        WHERE ID_EMPLEADO = v_id_empleado;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            PRC_INS_USUARIO(
                v_id_empleado,
                'jennifer.gutierrez@ucr.ac.cr',
                '$2a$10$kWDYd0ioPAF98lxQHAxGaewL3jBNgGqTFwn95532pPwCAKETwTKae',
                1
            );

            SELECT ID_USUARIO
            INTO v_id_usuario
            FROM USUARIO
            WHERE ID_EMPLEADO = v_id_empleado;
    END;

    -- ROL ADMINISTRADOR
    SELECT ID
    INTO v_id_rol
    FROM REP_ROL
    WHERE UPPER(NOMBRE) = 'ADMINISTRADOR';

    BEGIN
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
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
            NULL;
    END;
END;
/
COMMIT;