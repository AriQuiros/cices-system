host cls
conn cices/cices123
@config.sql

set trimspool on
set feedback off
set verify off
set heading off

spool ejecutar/&1..sql

SELECT 'host cls' || chr(10) ||
       'conn cices/cices123' || chr(10)
FROM dual;

SELECT 'PROMPT ===========================================' || chr(10) ||
		'PROMPT === ELIMINAR TODO =======' || chr(10) ||
        'PROMPT ===========================================' || chr(10)
FROM dual;


/* ===========================================================
   1. DROPEAR TODAS LAS VISTAS
   =========================================================== */
select 'PROMPT == VIEWS ==' FROM dual;
SELECT 'DROP VIEW ' || object_name || ';' || chr(10)
FROM dba_objects
WHERE owner = 'CICES'
AND OBJECT_TYPE = 'VIEW'
ORDER BY 1;


/* ===========================================================
   2. DROPEAR SECUENCIAS
   =========================================================== */
select 'PROMPT == SECUENCIAS ==' FROM dual;
SELECT 'DROP SEQUENCE ' || object_name || ';' || chr(10)
FROM dba_objects
WHERE owner = 'CICES'
AND object_type = 'SEQUENCE'
ORDER BY 1;


/* ===========================================================
   3. DROPEAR PROCEDIMIENTOS
   =========================================================== */
select 'PROMPT == PROCEDIMIENTOS ==' FROM dual;
SELECT 'DROP PROCEDURE ' || object_name || ';' || chr(10)
FROM dba_objects
WHERE owner = 'CICES'
  AND object_type = 'PROCEDURE'
ORDER BY object_name;


/* ===========================================================
   4. DROPEAR FUNCIONES
   =========================================================== */
select 'PROMPT == FUNCIONES ==' FROM dual;
SELECT 'DROP FUNCTION ' || object_name || ';' || chr(10)
FROM dba_objects
WHERE owner = 'CICES'
  AND object_type = 'FUNCTION'
ORDER BY object_name;


/* ===========================================================
   5. DROPEAR TRIGGERS
   =========================================================== */
select 'PROMPT == TRIGGERS ==' FROM dual;
SELECT 'DROP TRIGGER ' || trigger_name || ';' || chr(10)
FROM dba_triggers
WHERE owner = 'CICES'
ORDER BY trigger_name;


-- /* ===========================================================
   -- 6. DROPEAR PAQUETES
   -- =========================================================== */
-- select 'PROMPT == PACKAGES ==' FROM dual;
-- SELECT 'DROP PACKAGE ' || object_name || ';' || chr(10)
-- FROM dba_objects
-- WHERE owner = 'CICES'
  -- AND object_type = 'PACKAGE'
-- ORDER BY object_name;


-- /* ===========================================================
   -- 7. DROPEAR MATERIALIZED VIEWS
   -- =========================================================== */
-- select 'PROMPT == MATERIALIZED VIEWS ==' FROM dual;
-- SELECT 'DROP MATERIALIZED VIEW ' || mview_name || ';' || chr(10)
-- FROM dba_mviews
-- WHERE owner = 'CICES'
-- ORDER BY mview_name;


-- /* ===========================================================
   -- 8. DROPEAR SINONIMOS
   -- =========================================================== */
-- select 'PROMPT == SYNONYMS ==' FROM dual;
-- SELECT 'DROP SYNONYM ' || synonym_name || ';' || chr(10)
-- FROM dba_synonyms
-- WHERE owner = 'CICES'
-- ORDER BY synonym_name;


/* ===========================================================
   9. DROPEAR ÍNDICES
   =========================================================== */
select 'PROMPT == INDICES ==' FROM dual;
SELECT 'DROP INDEX ' || object_name || ';' || chr(10)
FROM dba_objects
WHERE owner = 'CICES'
  AND object_type = 'INDEX'
ORDER BY object_name;

-- /* ===========================================================
   -- 10. DROPEAR TIPOS
   -- =========================================================== */
-- select 'PROMPT == TYPES ==' FROM dual;
-- SELECT 'DROP TYPE ' || type_name || ' FORCE;' || chr(10)
-- FROM dba_types
-- WHERE owner = 'CICES'
-- ORDER BY type_name;


/* ===========================================================
   11. DROPEAR TABLAS
   =========================================================== */
select 'PROMPT == TABLAS ==' FROM dual;
SELECT 'DROP TABLE ' || table_name || ' CASCADE CONSTRAINTS;' || chr(10)
FROM dba_tables
WHERE owner = 'CICES'
ORDER BY table_name;

select 'exit' || chr(10) from dual;

spool off
exit
