@echo off
echo ========================================
echo EJECUTANDO SCRIPTS CICES
echo ========================================
echo.
echo Conectando a la base de datos CICES...
echo Usuario: cices
echo.

echo ========================================
echo 1. EJECUTANDO insertar_datos_reales_sprint2.sql
echo ========================================
sqlplus "cices/cices123" "@insertar_datos_reales_sprint2.sql"

if %errorlevel% neq 0 (
    echo ERROR: Fallo al ejecutar insertar_datos_reales_sprint2.sql
    pause
    exit /b 1
)

echo.
echo ========================================
echo 2. EJECUTANDO arreglar_todo.sql (correcciones)
echo ========================================
sqlplus "cices/cices123" "@arreglar_todo.sql"

if %errorlevel% neq 0 (
    echo ERROR: Fallo al ejecutar arreglar_todo.sql
    pause
    exit /b 1
)

echo.
echo ========================================
echo SCRIPTS EJECUTADOS EXITOSAMENTE
echo ========================================
echo Los proyectos C1766 y C0236 estan listos
echo Usuarios maria.saenz y jaime.fornaguera pueden hacer login con admin123
echo SOLO tienen rol INVESTIGADOR (sin DIRECTOR)
echo.
echo Presiona cualquier tecla para salir...
pause > nul