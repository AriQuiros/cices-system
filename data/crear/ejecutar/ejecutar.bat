REM ejecutar.bat
@echo off
cls

set OUTDIR=%~dp0..\salida

if not exist "%OUTDIR%" mkdir "%OUTDIR%"
call "%~dp0..\nombresSQL.bat" || exit /b 1

sqlplus system/root @"%~dp0%secuencias%.sql" > "%OUTDIR%\%secuencias%.txt"
sqlplus system/root @"%~dp0%pks%.sql"  > "%OUTDIR%\%pks%.txt"

sqlplus system/root @"%~dp0crear_constraints.sql" > "%OUTDIR%\crear_constraints.txt"
sqlplus system/root @"%~dp0crear_funciones.sql" > "%OUTDIR%\crear_funciones.txt"
sqlplus system/root @"%~dp0crear_vistas.sql" > "%OUTDIR%\crear_vistas.txt"

sqlplus system/root @"%~dp0%triggers%.sql" > "%OUTDIR%\%triggers%.txt"
sqlplus system/root @"%~dp0tipos_codigos.sql" > "%OUTDIR%\tipos_codigos.txt"
sqlplus system/root @"%~dp0datos_fijos.sql" > "%OUTDIR%\datos_fijos.txt"

