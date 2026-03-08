host cls
conn cices/cices123
@config.sql

set trimspool on
set feedback off
set verify off
set heading off
set linesize 3000

spool ejecutar/&1..sql

------------------------------------------------------------
-- ENCABEZADO
------------------------------------------------------------
SELECT 'host cls' || chr(10) ||
       'conn cices/cices123' || chr(10)
FROM dual;

SELECT 'PROMPT ===========================================' || chr(10) ||
       'PROMPT === TRIGGERS DE BITÁCORA (OLD / NEW) =======' || chr(10) ||
       'PROMPT ===========================================' || chr(10)
FROM dual;

------------------------------------------------------------
-- 1) DROP TRIGGERS
------------------------------------------------------------
SELECT
    'DROP TRIGGER ' || REPLACE(b.table_name,'_BIT','_TRG_AIR') || ';' || chr(10) ||
    'DROP TRIGGER ' || REPLACE(b.table_name,'_BIT','_TRG_AUR') || ';' || chr(10) ||
    'DROP TRIGGER ' || REPLACE(b.table_name,'_BIT','_TRG_ADR') || ';' || chr(10)
FROM (
    SELECT table_name
    FROM dba_tables
    WHERE owner = 'CICES'
      AND table_name LIKE '%\_BIT' ESCAPE '\'
) b;

------------------------------------------------------------
-- 2) TRIGGER AFTER INSERT (solo NEW)
------------------------------------------------------------
SELECT 'PROMPT ===========================================' || chr(10) ||
       'PROMPT === TRIGGERS INSERT =======' || chr(10) ||
       'PROMPT ===========================================' || chr(10)
FROM dual;

SELECT
'CREATE OR REPLACE TRIGGER ' ||
REPLACE(b.table_name,'_BIT','_TRG_AIR') || chr(10) ||
'AFTER INSERT ON ' || REPLACE(b.table_name,'_BIT','') || chr(10) ||
'FOR EACH ROW' || chr(10) ||
'BEGIN' || chr(10) ||
'  INSERT INTO ' || b.table_name || ' (' || chr(10) ||
'    ID_BIT, FEC_BIT, ACC_BIT, USU_BIT,' || chr(10) ||
'    ' || LISTAGG(c.column_name, ', ') WITHIN GROUP (ORDER BY c.column_id) || chr(10) ||
'  ) VALUES (' || chr(10) ||
'    SEC_' || b.table_name || '.NEXTVAL,' || chr(10) ||
'    SYSDATE,' || chr(10) ||
'    ''I'',' || chr(10) ||
'    USER,' || chr(10) ||
'    ' ||
LISTAGG(
  CASE
    WHEN c.column_name LIKE '%\_OLD' ESCAPE '\' THEN
         'NULL'
    WHEN c.column_name LIKE '%\_NEW' ESCAPE '\' THEN
         ':NEW.' || REPLACE(c.column_name,'_NEW','')
    ELSE
         ':NEW.' || c.column_name
  END,
', ') WITHIN GROUP (ORDER BY c.column_id)
 || chr(10) ||
'  );' || chr(10) ||
'END;' || chr(10) ||
'/ ' || chr(10) ||
'SHOW ERRORS' || chr(10)
FROM dba_tab_columns c
JOIN (
    SELECT table_name
    FROM dba_tables
    WHERE owner = 'CICES'
      AND table_name LIKE '%\_BIT' ESCAPE '\'
) b ON b.table_name = c.table_name
WHERE c.owner = 'CICES'
AND c.column_name NOT IN ('ID_BIT','FEC_BIT','ACC_BIT','USU_BIT')
GROUP BY b.table_name;

------------------------------------------------------------
-- 3) TRIGGER AFTER UPDATE (OLD + NEW)
------------------------------------------------------------
SELECT 'PROMPT ===========================================' || chr(10) ||
       'PROMPT === TRIGGERS UPDATE =======' || chr(10) ||
       'PROMPT ===========================================' || chr(10)
FROM dual;

SELECT
'CREATE OR REPLACE TRIGGER ' ||
REPLACE(b.table_name,'_BIT','_TRG_AUR') || chr(10) ||
'AFTER UPDATE ON ' || REPLACE(b.table_name,'_BIT','') || chr(10) ||
'FOR EACH ROW' || chr(10) ||
'BEGIN' || chr(10) ||
'  INSERT INTO ' || b.table_name || ' (' || chr(10) ||
'    ID_BIT, FEC_BIT, ACC_BIT, USU_BIT,' || chr(10) ||
'    ' || LISTAGG(c.column_name, ', ') WITHIN GROUP (ORDER BY c.column_id) || chr(10) ||
'  ) VALUES (' || chr(10) ||
'    SEC_' || b.table_name || '.NEXTVAL,' || chr(10) ||
'    SYSDATE,' || chr(10) ||
'    ''U'',' || chr(10) ||
'    USER,' || chr(10) ||
'    ' ||
LISTAGG(
  CASE
    WHEN c.column_name LIKE '%\_OLD' ESCAPE '\' THEN
         'NULL'
    WHEN c.column_name LIKE '%\_NEW' ESCAPE '\' THEN
         ':NEW.' || REPLACE(c.column_name,'_NEW','')
    ELSE
         ':NEW.' || c.column_name
  END,
', ') WITHIN GROUP (ORDER BY c.column_id) || chr(10) ||
'  );' || chr(10) ||
'END;' || chr(10) ||
'/ ' || chr(10) ||
'SHOW ERRORS' || chr(10)
FROM dba_tab_columns c
JOIN (
    SELECT table_name
    FROM dba_tables
    WHERE owner = 'CICES'
      AND table_name LIKE '%\_BIT' ESCAPE '\'
) b ON b.table_name = c.table_name
WHERE c.owner = 'CICES'
AND c.column_name NOT IN ('ID_BIT','FEC_BIT','ACC_BIT','USU_BIT')
GROUP BY b.table_name;

------------------------------------------------------------
-- 4) TRIGGER AFTER DELETE (solo OLD)
------------------------------------------------------------
SELECT 'PROMPT ===========================================' || chr(10) ||
       'PROMPT === TRIGGERS DELETE =======' || chr(10) ||
       'PROMPT ===========================================' || chr(10)
FROM dual;

SELECT
'CREATE OR REPLACE TRIGGER ' ||
REPLACE(b.table_name,'_BIT','_TRG_ADR') || chr(10) ||
'AFTER DELETE ON ' || REPLACE(b.table_name,'_BIT','') || chr(10) ||
'FOR EACH ROW' || chr(10) ||
'BEGIN' || chr(10) ||
'  INSERT INTO ' || b.table_name || ' (' || chr(10) ||
'    ID_BIT, FEC_BIT, ACC_BIT, USU_BIT,' || chr(10) ||
'    ' || LISTAGG(c.column_name, ', ') WITHIN GROUP (ORDER BY c.column_id) || chr(10) ||
'  ) VALUES (' || chr(10) ||
'    SEC_' || b.table_name || '.NEXTVAL,' || chr(10) ||
'    SYSDATE,' || chr(10) ||
'    ''D'',' || chr(10) ||
'    USER,' || chr(10) ||
'    ' ||
LISTAGG(
  CASE
    WHEN c.column_name LIKE '%\_OLD' ESCAPE '\' THEN
         ':OLD.' || REPLACE(c.column_name,'_OLD','')
    WHEN c.column_name LIKE '%\_NEW' ESCAPE '\' THEN
         'NULL'
    ELSE
         ':OLD.' || c.column_name
  END,
', ') WITHIN GROUP (ORDER BY c.column_id) || chr(10) ||
'  );' || chr(10) ||
'END;' || chr(10) ||
'/ ' || chr(10) ||
'SHOW ERRORS'
FROM dba_tab_columns c
JOIN (
    SELECT table_name
    FROM dba_tables
    WHERE owner = 'CICES'
      AND table_name LIKE '%\_BIT' ESCAPE '\'
) b ON b.table_name = c.table_name
WHERE c.owner = 'CICES'
AND c.column_name NOT IN ('ID_BIT','FEC_BIT','ACC_BIT','USU_BIT')
GROUP BY b.table_name;

------------------------------------------------------------
-- FIN
------------------------------------------------------------
SELECT 'exit' FROM dual;

spool off
exit
