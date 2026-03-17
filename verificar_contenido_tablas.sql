host cls
conn cices/cices123

set trimspool on
set feedback off
set verify off
set heading on
set linesize 220
set pagesize 200
set serveroutput on

spool reporte_contenido_tablas.txt

prompt ================================================
prompt REPORTE DE CONTENIDO DE TABLAS - ESQUEMA CICES
prompt ================================================

column TABLA format a35
column TOTAL_REGISTROS format 999999999

select 'CERTIFICACION' as TABLA, count(*) as TOTAL_REGISTROS from CICES.CERTIFICACION;
select 'CODIGO' as TABLA, count(*) as TOTAL_REGISTROS from CICES.CODIGO;
select 'DOCUMENTO' as TABLA, count(*) as TOTAL_REGISTROS from CICES.DOCUMENTO;
select 'EMPLEADO' as TABLA, count(*) as TOTAL_REGISTROS from CICES.EMPLEADO;
select 'ENTIDAD' as TABLA, count(*) as TOTAL_REGISTROS from CICES.ENTIDAD;
select 'ENTIDAD_PROYECTO' as TABLA, count(*) as TOTAL_REGISTROS from CICES.ENTIDAD_PROYECTO;
select 'GASTO' as TABLA, count(*) as TOTAL_REGISTROS from CICES.GASTO;
select 'HORAS_ASIGNADAS' as TABLA, count(*) as TOTAL_REGISTROS from CICES.HORAS_ASIGNADAS;
select 'INDICADOR' as TABLA, count(*) as TOTAL_REGISTROS from CICES.INDICADOR;
select 'INVESTIGADOR' as TABLA, count(*) as TOTAL_REGISTROS from CICES.INVESTIGADOR;
select 'INVESTIGADOR_PROYECTO' as TABLA, count(*) as TOTAL_REGISTROS from CICES.INVESTIGADOR_PROYECTO;
select 'META' as TABLA, count(*) as TOTAL_REGISTROS from CICES.META;
select 'NOTIFICACION' as TABLA, count(*) as TOTAL_REGISTROS from CICES.NOTIFICACION;
select 'NOTIFICACION_USUARIO' as TABLA, count(*) as TOTAL_REGISTROS from CICES.NOTIFICACION_USUARIO;
select 'OBJETIVO_ESPECIFICO' as TABLA, count(*) as TOTAL_REGISTROS from CICES.OBJETIVO_ESPECIFICO;
select 'PRESENTACION_INFORME' as TABLA, count(*) as TOTAL_REGISTROS from CICES.PRESENTACION_INFORME;
select 'PRESUPUESTO' as TABLA, count(*) as TOTAL_REGISTROS from CICES.PRESUPUESTO;
select 'PRESUPUESTO_BIT' as TABLA, count(*) as TOTAL_REGISTROS from CICES.PRESUPUESTO_BIT;
select 'PROYECTO' as TABLA, count(*) as TOTAL_REGISTROS from CICES.PROYECTO;
select 'ROL' as TABLA, count(*) as TOTAL_REGISTROS from CICES.ROL;
select 'ROL_PROYECTO' as TABLA, count(*) as TOTAL_REGISTROS from CICES.ROL_PROYECTO;
select 'ROL_USUARIO' as TABLA, count(*) as TOTAL_REGISTROS from CICES.ROL_USUARIO;
select 'TIPO' as TABLA, count(*) as TOTAL_REGISTROS from CICES.TIPO;
select 'TITULO' as TABLA, count(*) as TOTAL_REGISTROS from CICES.TITULO;
select 'USUARIO' as TABLA, count(*) as TOTAL_REGISTROS from CICES.USUARIO;

prompt
prompt ================================================
prompt MUESTRA RAPIDA (primeras 10 filas)
prompt ================================================

prompt --- USUARIO ---
select * from CICES.USUARIO where rownum <= 10;

prompt --- EMPLEADO ---
select * from CICES.EMPLEADO where rownum <= 10;

prompt --- INVESTIGADOR ---
select * from CICES.INVESTIGADOR where rownum <= 10;

prompt --- PROYECTO ---
select * from CICES.PROYECTO where rownum <= 10;

spool off
exit
