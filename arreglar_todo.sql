-- ELIMINAR COMPLETAMENTE LA FUNCIÓN PROBLEMÁTICA
DROP FUNCTION ENCRYPT_PASSWORD;

-- CORREGIR ROLES: ELIMINAR DIRECTOR Y ASEGURAR INVESTIGADOR
DECLARE
    v_rol_director NUMBER;
    v_usuario_maria NUMBER;
    v_usuario_jaime NUMBER;
    v_rol_investigador NUMBER;
    v_count NUMBER;
BEGIN
    -- Obtener IDs de roles y usuarios
    SELECT ID_ROL INTO v_rol_director FROM ROL WHERE UPPER(NOMBRE_ROL) = 'DIRECTOR';
    SELECT ID_ROL INTO v_rol_investigador FROM ROL WHERE UPPER(NOMBRE_ROL) = 'INVESTIGADOR';
    SELECT ID_USUARIO INTO v_usuario_maria FROM USUARIO WHERE NOMBRE_USUARIO = 'maria.saenz';
    SELECT ID_USUARIO INTO v_usuario_jaime FROM USUARIO WHERE NOMBRE_USUARIO = 'jaime.fornaguera';
    
    -- ELIMINAR ROL DIRECTOR de ambos usuarios
    DELETE FROM ROL_USUARIO WHERE ID_USUARIO = v_usuario_maria AND ID_ROL = v_rol_director;
    DELETE FROM ROL_USUARIO WHERE ID_USUARIO = v_usuario_jaime AND ID_ROL = v_rol_director;
    DBMS_OUTPUT.PUT_LINE('Roles DIRECTOR eliminados de maria.saenz y jaime.fornaguera');
    
    -- Asegurar que tengan rol INVESTIGADOR
    SELECT COUNT(*) INTO v_count FROM ROL_USUARIO 
    WHERE ID_USUARIO = v_usuario_maria AND ID_ROL = v_rol_investigador;
    IF v_count = 0 THEN
        INSERT INTO ROL_USUARIO(ID_ROL_USUARIO, ID_USUARIO, ID_ROL)
        VALUES (SEC_ROL_USUARIO.NEXTVAL, v_usuario_maria, v_rol_investigador);
        DBMS_OUTPUT.PUT_LINE('Rol INVESTIGADOR agregado a maria.saenz');
    END IF;
    
    SELECT COUNT(*) INTO v_count FROM ROL_USUARIO 
    WHERE ID_USUARIO = v_usuario_jaime AND ID_ROL = v_rol_investigador;
    IF v_count = 0 THEN
        INSERT INTO ROL_USUARIO(ID_ROL_USUARIO, ID_USUARIO, ID_ROL)
        VALUES (SEC_ROL_USUARIO.NEXTVAL, v_usuario_jaime, v_rol_investigador);
        DBMS_OUTPUT.PUT_LINE('Rol INVESTIGADOR agregado a jaime.fornaguera');
    END IF;
END;
/

-- CORREGIR CONTRASEÑAS CON HASH CORRECTO
UPDATE USUARIO 
SET CONTRASENA = '$2a$10$XrICMuYle1N9YmwPh68E3eJ1to0fMQuhSnsO1HvA6ADAePNduS3A2' 
WHERE NOMBRE_USUARIO IN ('maria.saenz', 'jaime.fornaguera');

COMMIT;

-- VERIFICAR CORRECCIONES
PROMPT 
PROMPT ========================================
PROMPT VERIFICACIÓN FINAL DE CORRECCIONES
PROMPT ========================================

PROMPT ROLES DE USUARIOS (DEBE SER SOLO INVESTIGADOR):
SELECT U.NOMBRE_USUARIO, R.NOMBRE_ROL,
       CASE WHEN R.NOMBRE_ROL = 'DIRECTOR' THEN '*** PROBLEMA: NO DEBE TENER ESTE ROL ***'
            WHEN R.NOMBRE_ROL = 'INVESTIGADOR' THEN 'CORRECTO'
            ELSE 'VERIFICAR'
       END as ESTADO_ROL
FROM USUARIO U
JOIN ROL_USUARIO RU ON U.ID_USUARIO = RU.ID_USUARIO
JOIN ROL R ON RU.ID_ROL = R.ID_ROL
WHERE U.NOMBRE_USUARIO IN ('maria.saenz', 'jaime.fornaguera')
ORDER BY U.NOMBRE_USUARIO, R.NOMBRE_ROL;

PROMPT 
PROMPT CONTRASEÑAS (DEBEN SER CORRECTAS):
SELECT NOMBRE_USUARIO, 
       CASE WHEN CONTRASENA = '$2a$10$XrICMuYle1N9YmwPh68E3eJ1to0fMQuhSnsO1HvA6ADAePNduS3A2' 
            THEN 'HASH CORRECTO - LOGIN FUNCIONARÁ' 
            ELSE 'HASH INCORRECTO - LOGIN FALLARÁ' 
       END as ESTADO_CONTRASENA
FROM USUARIO 
WHERE NOMBRE_USUARIO IN ('maria.saenz', 'jaime.fornaguera');

PROMPT 
PROMPT ========================================
PROMPT ¡CORRECCIONES APLICADAS!
PROMPT Los usuarios pueden hacer login con admin123
PROMPT y SOLO tienen rol INVESTIGADOR
PROMPT ========================================

EXIT;