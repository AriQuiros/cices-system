REM crear.bat
cls
@echo off
REM ocultar los comandos en la salida

if not exist "%~dp0salida" mkdir "%~dp0salida"
del /Q "%~dp0salida\*.txt"
call nombresSQL.bat

REM crear sql apartir de tablas
sqlplus system/root @crear_tablas.sql > "salida\crear_tablas.txt"
sqlplus system/root @do_%secuencias%.sql %secuencias%
sqlplus system/root @do_%pks%.sql %pks%
sqlplus system/root @do_%triggers%.sql %triggers%
sqlplus system/root @do_%eliminar%.sql %eliminar%

call ejecutar/ejecutar.bat