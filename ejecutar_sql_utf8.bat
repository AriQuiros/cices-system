@echo off
setlocal

REM Forzar cliente Oracle/SQL*Plus a UTF-8
set NLS_LANG=AMERICAN_AMERICA.AL32UTF8
chcp 65001 > nul

if "%~1"=="" (
    echo Uso: ejecutar_sql_utf8.bat archivo.sql [usuario/password]
    exit /b 1
)

set "SCRIPT=%~1"
set "CONN=%~2"
if "%CONN%"=="" set "CONN=cices/cices123"

if not exist "%SCRIPT%" (
    echo No existe el script: %SCRIPT%
    exit /b 1
)

sqlplus "%CONN%" "@%SCRIPT%"
exit /b %errorlevel%
