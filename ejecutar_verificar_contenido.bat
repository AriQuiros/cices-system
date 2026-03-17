@echo off
cls
echo ================================================
echo Verificando contenido de tablas del esquema CICES
echo ================================================

sqlplus cices/cices123 @verificar_contenido_tablas.sql

echo.
echo Reporte generado en: reporte_contenido_tablas.txt
pause
