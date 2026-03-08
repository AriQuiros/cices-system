host cls
conn cices/cices123

set trimspool on
set feedback off
set verify off
set heading off
set linesize 32767
set pagesize 0
set long 1000000
set longchunksize 1000000

spool sincronizar_secuencias.sql

SELECT 'host cls' || chr(10) ||
       'conn cices/cices123' || chr(10) ||
       'SET SERVEROUTPUT ON' || chr(10)
FROM dual;

SELECT 'PROMPT ============================' FROM dual;
SELECT 'PROMPT === SINCRONIZAR SECUENCIAS ===' FROM dual;
SELECT 'PROMPT ============================' FROM dual;

SELECT 'PROMPT Verificando secuencia SEC_' || t.table_name || chr(10) ||
  'SELECT NVL(MAX(' || c.column_name || '),0) FROM CICES.' || t.table_name || ';' || chr(10) ||
  'PROMPT Ajustando secuencia SEC_' || t.table_name || chr(10) ||
  'DECLARE' || chr(10) ||
  '  max_id   NUMBER;' || chr(10) ||
  '  curr_val NUMBER;' || chr(10) ||
  'BEGIN' || chr(10) ||
  '  SELECT NVL(MAX(' || c.column_name || '),0)' ||
  ' INTO max_id FROM CICES.' || t.table_name || ';' || chr(10) ||
  '  EXECUTE IMMEDIATE ''SELECT CICES.SEC_' || t.table_name ||
  '.NEXTVAL FROM DUAL'' INTO curr_val;' || chr(10) ||
  '  EXECUTE IMMEDIATE ''ALTER SEQUENCE CICES.SEC_' || t.table_name ||
  ' INCREMENT BY '' || (max_id + 1 - curr_val);' || chr(10) ||
  '  EXECUTE IMMEDIATE ''SELECT CICES.SEC_' || t.table_name ||
  '.NEXTVAL FROM DUAL'' INTO curr_val;' || chr(10) ||
  '  EXECUTE IMMEDIATE ''ALTER SEQUENCE CICES.SEC_' || t.table_name ||
  ' INCREMENT BY 1'';' || chr(10) ||
  '  DBMS_OUTPUT.PUT_LINE(''    → SEC_' || t.table_name ||
  ' sincronizada correctamente en: '' || curr_val);' || chr(10) ||
  'END;' || chr(10) ||
  '/' || chr(10)
FROM all_tables t
JOIN all_tab_columns c
  ON c.owner = t.owner
 AND c.table_name = t.table_name
WHERE t.owner = 'CICES'
  AND c.column_name = 'ID_' || t.table_name
ORDER BY t.table_name;

SELECT 'exit' FROM dual;

spool off
exit
