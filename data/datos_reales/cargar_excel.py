# python cargar_excel.py

import pandas as pd
import oracledb
import os

# ========= CONFIGURACIÓN =========
DATA_FOLDER = "xlsx"

DB_USER = "CICES"
DB_PASSWORD = "cices123"
DB_DSN = "localhost:1521/XE"
# =================================

def main():
    print("Iniciando carga de archivos Excel...")

    # Conexión a Oracle
    conn = oracledb.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        dsn=DB_DSN
    )
    cursor = conn.cursor()

    try:
        # Recorrer todos los archivos Excel de la carpeta
        for archivo in os.listdir(DATA_FOLDER):
            if not archivo.endswith(".xlsx"):
                continue

            ruta = os.path.join(DATA_FOLDER, archivo)
            print(f"\n📘 Procesando archivo: {archivo}")

            hojas = pd.read_excel(ruta, sheet_name=None)

            for tabla, df in hojas.items():
                print(f"  → Cargando tabla: {tabla}")

                # Convertir NaN a NULL
                df = df.where(df.notnull(), None)

                columnas = list(df.columns)
                columnas_sql = ", ".join(columnas)
                valores = ", ".join([f":{i+1}" for i in range(len(columnas))])

                sql = f"INSERT INTO {tabla} ({columnas_sql}) VALUES ({valores})"

                for index, fila in df.iterrows():
                    try:
                        cursor.execute(sql, tuple(fila))
                    except Exception as e:
                        print("\n❌ ERROR DETECTADO DURANTE LA CARGA")
                        print(f"Archivo   : {archivo}")
                        print(f"Tabla     : {tabla}")
                        print(f"Fila Excel: {index + 2}")  # +2 por encabezado
                        print("Datos de la fila:")
                        for col, val in zip(columnas, fila):
                            print(f"  {col}: {val}")
                        raise e  # vuelve a lanzar el error

        conn.commit()
        print("\n✅ Todos los archivos fueron cargados correctamente")

    except Exception as e:
        conn.rollback()
        print("\n❌ Carga cancelada por error")
        print(e)

    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()
