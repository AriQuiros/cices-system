# cargar_excel.py 

import sys
import os
import subprocess

# ======= FUNCIÓN PARA INSTALAR MÓDULOS =======
def instalar_modulo(modulo):
    try:
        print(f"⚙️ Instalando {modulo}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", modulo])
        print(f"✅ {modulo} instalado correctamente\n")
    except Exception as e:
        print(f"❌ No se pudo instalar {modulo}: {e}")
        sys.exit(1)

# ======= VERIFICACIÓN DE MÓDULOS =======
try:
    import pandas as pd
except ModuleNotFoundError:
    instalar_modulo("pandas")
    import pandas as pd

try:
    import oracledb
except ModuleNotFoundError:
    instalar_modulo("oracledb")
    import oracledb

# openpyxl es necesario para leer .xlsx
try:
    import openpyxl
except ModuleNotFoundError:
    instalar_modulo("openpyxl")
    import openpyxl


# ======= CONFIGURACIÓN =======
DATA_FOLDER = "xlsx"

DB_USER = "CICES"
DB_PASSWORD = "cices123"
DB_DSN = "localhost:1521/XE"


# ======= FUNCIONES =======
def normalizar_fila(fila):
    fila_normalizada = []
    for x in fila:
        if pd.isna(x):
            fila_normalizada.append(None)
        elif hasattr(x, 'item'):
            fila_normalizada.append(x.item())
        else:
            fila_normalizada.append(x)
    return tuple(fila_normalizada)


# ======= MAIN =======
def main():
    print("🚀 Iniciando carga de archivos Excel...")

    try:
        conn = oracledb.connect(
            user=DB_USER,
            password=DB_PASSWORD,
            dsn=DB_DSN
        )
        cursor = conn.cursor()
    except Exception as e:
        print("❌ No se pudo conectar a Oracle:")
        print(e)
        sys.exit(1)

    try:
        for archivo in os.listdir(DATA_FOLDER):
            if not archivo.endswith(".xlsx"):
                continue

            ruta = os.path.join(DATA_FOLDER, archivo)
            print(f"\n📘 Procesando archivo: {archivo}")

            hojas = pd.read_excel(ruta, sheet_name=None)

            for tabla, df in hojas.items():
                print(f"  → Cargando tabla: {tabla}")

                df = df.astype(object)

                columnas = list(df.columns)
                columnas_sql = ", ".join(columnas)
                valores = ", ".join([f":{i+1}" for i in range(len(columnas))])
                sql = f"INSERT INTO {tabla} ({columnas_sql}) VALUES ({valores})"

                for index, fila in df.iterrows():
                    try:
                        cursor.execute(sql, normalizar_fila(fila))
                    except Exception as e:
                        print("\n❌ ERROR DETECTADO DURANTE LA CARGA")
                        print(f"Archivo   : {archivo}")
                        print(f"Tabla     : {tabla}")
                        print(f"Fila Excel: {index + 2}")
                        print("Datos de la fila:")
                        for col, val in zip(columnas, fila):
                            print(f"  {col}: {val}")
                        raise e

        conn.commit()
        print("\n✅ Todos los archivos fueron cargados correctamente")

    except Exception as e:
        conn.rollback()
        print("\n❌ Carga cancelada por error")
        print(e)

    finally:
        try:
            if cursor:
                cursor.close()
        except Exception as e:
            print("Error al cerrar el cursor:", e)
        try:
            if conn:
                conn.close()
        except Exception as e:
            print("Error al cerrar la conexión:", e)


if __name__ == "__main__":
    main()