host cls
conn cices/cices123
@config.sql

spool ejecutar/&1..sql
select 'host cls' ||chr(10)||
 'conn cices/cices123' from dual;

select 'PROMPT ============================' ||chr(10)||
		'PROMPT ====== DROPEO DE PKs =======' ||chr(10)||
		'PROMPT ============================' from dual;

-- Genera DROP CONSTRAINT de cada PK
SELECT 
    'ALTER TABLE ' || table_name ||
    ' DROP CONSTRAINT PK_' || table_name || ';' || chr(10)
FROM dba_tables
WHERE owner = 'CICES'
ORDER BY table_name;

select 'PROMPT ============================' ||chr(10)||
		'PROMPT ===== CREACIÓN DE PKs ======' ||chr(10)||
		'PROMPT ============================' from dual;

-- Genera CREATE de las PK (ID_<TABLA>)
SELECT
    'ALTER TABLE ' || table_name ||
    ' ADD CONSTRAINT PK_' || table_name ||
    ' PRIMARY KEY (ID_' || table_name || ');' || chr(10)
FROM dba_tables
WHERE owner = 'CICES'
ORDER BY table_name;

select 'exit' ||chr(10) from dual;

spool off
exit

