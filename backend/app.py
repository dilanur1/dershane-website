from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
print("DATABASE_URL =", DATABASE_URL)

def get_conn():
    return psycopg2.connect(DATABASE_URL)

app = Flask(__name__)
CORS(app)

# geçici database (şimdilik RAM)
applications = []

@app.route("/")
def home():
    return jsonify({"message": "API çalışıyor"})


# BAŞVURULARI GÖR
@app.route("/applications", methods=["GET"])
def get_applications():
    return jsonify(applications)

free_trials = []

@app.route('/api/free-trial', methods=['POST'])
def free_trial():
    data = request.json
    free_trials.append(data)
    print("Yeni başvuru:", data)
    return jsonify({"message": "Başvuru alındı"}), 200

@app.route("/apply", methods=["POST"])
def basvuru():
    data = request.json

    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO applys (name, surname, phone, class)
        VALUES (%s, %s, %s, %s)
    """, (
        data["name"],
        data["surname"],
        data["phone"],
        data["class"]
    ))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Başvuru alındı"})

@app.route("/applys", methods=["GET"])
def liste():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT ad, soyad, telefon, sinif FROM basvurular")
    data = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)