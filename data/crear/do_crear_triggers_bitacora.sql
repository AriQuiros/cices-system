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
       'PROMPT === TRIGGERS UPDATE BITÁCORA =======' || chr(10) ||
       'PROMPT ===========================================' || chr(10)
FROM dual;

------------------------------------------------------------
-- 1) TRIGGER AFTER UPDATE (solo si MONTO_ASIGNADO cambió)
------------------------------------------------------------
SELECT
'CREATE OR REPLACE TRIGGER ' || REPLACE(b.table_name,'_BIT','_TRG_AUR') || chr(10) ||
'AFTER UPDATE ON ' || REPLACE(b.table_name,'_BIT','') || chr(10) ||  -- tabla real
'FOR EACH ROW' || chr(10) ||
'BEGIN' || chr(10) ||
'  IF NVL(:OLD.MONTO_ASIGNADO,0) != NVL(:NEW.MONTO_ASIGNADO,0) THEN' || chr(10) ||
'    INSERT INTO ' || b.table_name || ' (' || chr(10) ||
'      ID_PRESUPUESTO_BIT,' || chr(10) ||
'      FEC_BIT, ACC_BIT, USU_BIT,' || chr(10) ||
'      ID_PRESUPUESTO, ID_PROYECTO,' || chr(10) ||
'      MONTO_ASIGNADO_OLD, CANTIDAD_HORAS_MES_OLD, CANTIDAD_MESES_OLD,' || chr(10) ||
'      MONTO_ASIGNADO_NEW, CANTIDAD_HORAS_MES_NEW, CANTIDAD_MESES_NEW' || chr(10) ||
'    ) VALUES (' || chr(10) ||
'      SEC_PRESUPUESTO_BIT.NEXTVAL,' || chr(10) ||
'      SYSDATE, ''U'', USER,' || chr(10) ||
'      :OLD.ID_PRESUPUESTO, :OLD.ID_PROYECTO,' || chr(10) ||
'      :OLD.MONTO_ASIGNADO, :OLD.CANTIDAD_HORAS_MES, :OLD.CANTIDAD_MESES,' || chr(10) ||
'      :NEW.MONTO_ASIGNADO, :NEW.CANTIDAD_HORAS_MES, :NEW.CANTIDAD_MESES' || chr(10) ||
'    );' || chr(10) ||
'  END IF;' || chr(10) ||
'END;' || chr(10) ||
'/ ' || chr(10) ||
'SHOW ERRORS' || chr(10)
FROM dba_tables b
WHERE b.owner = 'CICES'
  AND b.table_name LIKE '%\_BIT' ESCAPE '\';

------------------------------------------------------------
-- FIN
------------------------------------------------------------
SELECT 'exit' FROM dual;

spool off
exit