SET SERVEROUTPUT ON SIZE UNLIMITED;
SET DEFINE OFF;

PROMPT ========================================
PROMPT REPARACION GLOBAL DE CODIFICACION UTF-8
PROMPT ========================================
PROMPT
PROMPT Este script corrige mojibake en TODAS las columnas de texto
PROMPT (VARCHAR2/CHAR/NVARCHAR2/NCHAR/CLOB) del esquema actual.
PROMPT

DECLARE
    v_sql CLOB;
    v_rows NUMBER;
    v_total NUMBER := 0;

    FUNCTION expr_reemplazos(p_col VARCHAR2) RETURN CLOB IS
        v_expr CLOB;
    BEGIN
        v_expr := p_col;

        -- Caracteres en minuscula
        v_expr := 'REPLACE(' || v_expr || ', ''Ã¡'', ''á'')';
        v_expr := 'REPLACE(' || v_expr || ', ''Ã©'', ''é'')';
        v_expr := 'REPLACE(' || v_expr || ', ''Ã­'', ''í'')';
        v_expr := 'REPLACE(' || v_expr || ', ''Ã³'', ''ó'')';
        v_expr := 'REPLACE(' || v_expr || ', ''Ãº'', ''ú'')';
        v_expr := 'REPLACE(' || v_expr || ', ''Ã±'', ''ñ'')';
        v_expr := 'REPLACE(' || v_expr || ', ''Ã¼'', ''ü'')';

        -- Caracteres en mayuscula
        v_expr := 'REPLACE(' || v_expr || ', ''Ã'', ''Á'')';
        v_expr := 'REPLACE(' || v_expr || ', ''Ã‰'', ''É'')';
        v_expr := 'REPLACE(' || v_expr || ', ''Ã'', ''Í'')';
        v_expr := 'REPLACE(' || v_expr || ', ''Ã“'', ''Ó'')';
        v_expr := 'REPLACE(' || v_expr || ', ''Ãš'', ''Ú'')';
        v_expr := 'REPLACE(' || v_expr || ', ''Ã‘'', ''Ñ'')';
        v_expr := 'REPLACE(' || v_expr || ', ''Ãœ'', ''Ü'')';

        -- Simbolos frecuentes corruptos
        v_expr := 'REPLACE(' || v_expr || ', ''Â¿'', ''¿'')';
        v_expr := 'REPLACE(' || v_expr || ', ''Â¡'', ''¡'')';
        v_expr := 'REPLACE(' || v_expr || ', ''â€™'', ''’'')';
        v_expr := 'REPLACE(' || v_expr || ', ''â€œ'', ''“'')';
        v_expr := 'REPLACE(' || v_expr || ', ''â€'', ''”'')';
        v_expr := 'REPLACE(' || v_expr || ', ''â€“'', ''–'')';
        v_expr := 'REPLACE(' || v_expr || ', ''â€”'', ''—'')';
        v_expr := 'REPLACE(' || v_expr || ', ''Â'', '''')';

        RETURN v_expr;
    END;
BEGIN
    FOR c IN (
        SELECT table_name, column_name, data_type
        FROM user_tab_columns
        WHERE data_type IN ('VARCHAR2', 'CHAR', 'NVARCHAR2', 'NCHAR', 'CLOB')
        ORDER BY table_name, column_id
    ) LOOP
        v_sql := 'UPDATE "' || c.table_name || '" ' ||
                 'SET "' || c.column_name || '" = ' || expr_reemplazos('"' || c.column_name || '"') ||
                 ' WHERE "' || c.column_name || '" IS NOT NULL' ||
                 ' AND (INSTR("' || c.column_name || '", ''Ã'') > 0' ||
                 '      OR INSTR("' || c.column_name || '", ''Â'') > 0' ||
                 '      OR INSTR("' || c.column_name || '", ''â'') > 0' ||
                 '      OR INSTR("' || c.column_name || '", ''�'') > 0)';

        EXECUTE IMMEDIATE v_sql;
        v_rows := SQL%ROWCOUNT;

        IF v_rows > 0 THEN
            v_total := v_total + v_rows;
            DBMS_OUTPUT.PUT_LINE('Corregido ' || c.table_name || '.' || c.column_name || ': ' || v_rows || ' fila(s)');
        END IF;
    END LOOP;

    COMMIT;

    DBMS_OUTPUT.PUT_LINE('----------------------------------------');
    DBMS_OUTPUT.PUT_LINE('TOTAL FILAS CORREGIDAS: ' || v_total);
    DBMS_OUTPUT.PUT_LINE('----------------------------------------');
END;
/

PROMPT
PROMPT ========================================
PROMPT VERIFICACION RAPIDA (si devuelve filas, aun hay texto corrupto)
PROMPT ========================================

DECLARE
    v_count NUMBER := 0;
    v_sql   VARCHAR2(4000);
    v_tmp   NUMBER;
BEGIN
    FOR c IN (
        SELECT table_name, column_name, data_type
        FROM user_tab_columns
        WHERE data_type IN ('VARCHAR2', 'CHAR', 'NVARCHAR2', 'NCHAR', 'CLOB')
    ) LOOP
        v_sql := 'SELECT COUNT(*) FROM "' || c.table_name || '" ' ||
                 'WHERE "' || c.column_name || '" IS NOT NULL ' ||
                 'AND (INSTR("' || c.column_name || '", ''Ã'') > 0 ' ||
                 'OR INSTR("' || c.column_name || '", ''Â'') > 0 ' ||
                 'OR INSTR("' || c.column_name || '", ''â'') > 0 ' ||
                 'OR INSTR("' || c.column_name || '", ''�'') > 0)';

        EXECUTE IMMEDIATE v_sql INTO v_tmp;

        IF v_tmp > 0 THEN
            v_count := v_count + v_tmp;
            DBMS_OUTPUT.PUT_LINE('Pendientes en ' || c.table_name || '.' || c.column_name || ': ' || v_tmp);
        END IF;
    END LOOP;

    DBMS_OUTPUT.PUT_LINE('TOTAL PENDIENTES: ' || v_count);
END;
/

EXIT;
