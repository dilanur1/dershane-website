from werkzeug.security import generate_password_hash
import psycopg2
import os
from dotenv import load_dotenv



username = "admin"
password = "123456"

password_hash = generate_password_hash(password)
load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
def get_conn():
    return psycopg2.connect(DATABASE_URL)

conn = get_conn()
cur = conn.cursor()

cur.execute(
    "INSERT INTO admins (username, password_hash) VALUES (%s,%s)",
    (username, password_hash)
)

conn.commit()
cur.close()
conn.close()

print("Admin oluşturuldu.")