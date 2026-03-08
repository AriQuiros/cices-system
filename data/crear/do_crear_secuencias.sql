
host cls
conn cices/cices123
@config.sql
set trimspool on
set feedback off
set verify off
set heading off

spool ejecutar/&1..sql
select 'host cls' ||chr(10)||
 'conn cices/cices123' from dual;

select 'PROMPT ============================' ||chr(10)||
		'PROMPT === DROPEO DE SECUENCIAS ===' ||chr(10)||
		'PROMPT ============================' from dual;

-- Generar DROP SEQUENCE por cada tabla
SELECT 'DROP SEQUENCE SEC_' || object_name || ';' || chr(10)
FROM dba_objects
WHERE owner = 'CICES'
  AND object_type = 'TABLE'
ORDER BY object_name;

select 'PROMPT ============================' ||chr(10)||
		'PROMPT == CREACION DE SECUENCIAS ==' ||chr(10)||
		'PROMPT ============================' from dual;

-- Generar CREATE SEQUENCE START WITH 1
SELECT 'CREATE SEQUENCE SEC_' || object_name || ' START WITH 1;' || chr(10)
FROM dba_objects
WHERE owner = 'CICES'
  AND object_type = 'TABLE'
ORDER BY object_name;

select 'PROMPT ============================' ||chr(10)||
		'PROMPT ===== ALTER SECUENCIAS =====' ||chr(10)||
		'PROMPT ============================' from dual;

-- Generar ALTER SEQUENCE INCREMENT BY 1
SELECT 'ALTER SEQUENCE SEC_' || object_name || ' INCREMENT BY 1;' || chr(10)
FROM dba_objects
WHERE owner = 'CICES'
  AND object_type = 'TABLE'
ORDER BY object_name;

select 'exit' ||chr(10)from dual;

spool off
exit
