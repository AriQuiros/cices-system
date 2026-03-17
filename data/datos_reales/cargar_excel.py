# cargar_excel.py

import sys
import os

# ======= VERIFICACIÓN DE MÓDULOS =======
try:
    import pandas as pd
except ModuleNotFoundError:
    print("❌ pandas no está instalado. Ejecuta: pip install pandas")
    sys.exit(1)

try:
    import oracledb
except ModuleNotFoundError:
    print("❌ oracledb no está instalado. Ejecuta: pip install oracledb")
    sys.exit(1)

# openpyxl es necesario para leer .xlsx
try:
    import openpyxl
except ModuleNotFoundError:
    print("❌ openpyxl no está instalado. Ejecuta: pip install openpyxl")
    sys.exit(1)

# ======= CONFIGURACIÓN =======
DATA_FOLDER = "xlsx"

DB_USER = "CICES"
DB_PASSWORD = "cices123"
DB_DSN = "localhost:1521/XE"

# ======= FUNCIONES =======
def normalizar_fila(fila):
    """
    Convierte valores de pandas/numpy a tipos nativos de Python.
    - NaN → None
    - numpy.int64 / float64 → int / float
    - numpy.bool_ → bool
    """
    fila_normalizada = []
    for x in fila:
        if pd.isna(x):
            fila_normalizada.append(None)
        elif hasattr(x, 'item'):  # Convierte tipos numpy a nativos
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

                # Convertir todo a object y reemplazar NaN con None
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
                        print(f"Fila Excel: {index + 2}")  # +2 por encabezado
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