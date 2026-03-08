REM ejecutar.bat
@echo off
cls

call "%~dp0..\nombresSQL.bat" || exit /b 1

sqlplus system/root @"%~dp0%secuencias%.sql" 
sqlplus system/root @"%~dp0%pks%.sql"
sqlplus system/root @"%~dp0%crear_constraints.sql" > salidaConstraints.txt
sqlplus system/root @"%~dp0%crear_funciones.sql"
sqlplus system/root @"%~dp0%crear_vistas.sql"
sqlplus system/root @"%~dp0%crear_triggers_estados.sql"
sqlplus system/root @"%~dp0%triggers%.sql"
