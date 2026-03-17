# python cargar_excel.py

import pandas as pd
import oracledb
import os

# ========= CONFIGURACIÓN =========
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FOLDER = os.path.join(BASE_DIR, "xlsx")

DB_USER = "CICES"
DB_PASSWORD = "cices123"
DB_DSN = "localhost:1521/XE"
# =================================


def normalizar_valor(valor):
    """Convierte valores de pandas/numpy a tipos nativos compatibles con oracledb."""
    if pd.isna(valor):
        return None

    if hasattr(valor, "item"):
        try:
            valor = valor.item()
        except Exception:
            pass

    if isinstance(valor, float) and valor.is_integer():
        return int(valor)

    if isinstance(valor, str):
        texto = valor.strip()
        return texto if texto else None

    return valor

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
                        valores_fila = tuple(normalizar_valor(v) for v in fila.tolist())
                        cursor.execute(sql, valores_fila)
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
