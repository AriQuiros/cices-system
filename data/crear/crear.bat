REM crear.bat
cls
@echo off
REM ocultar los comandos en la salida

call nombresSQL.bat

REM crear sql apartir de tablas
sqlplus system/root @crear_tablas.sql
sqlplus system/root @do_%secuencias%.sql %secuencias%
sqlplus system/root @do_%pks%.sql %pks%
sqlplus system/root @tipos_codigos.sql > tipos_codigos.txt
sqlplus system/root @do_%triggers%.sql %triggers%
sqlplus system/root @do_%eliminar%.sql %eliminar%

call ejecutar/ejecutar.bat