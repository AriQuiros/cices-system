REM sincronizar.bat
cls
@echo off
REM ocultar los comandos en la salida
python cargar_excel.py
sqlplus system/root @sincronizar_sec.sql
sqlplus system/root @sincronizar_secuencias.sql > salida.txt