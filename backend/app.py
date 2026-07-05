from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
from dotenv import load_dotenv
import jwt
import datetime
from functools import wraps
from werkzeug.security import check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

load_dotenv()



def get_conn():
    return psycopg2.connect(DATABASE_URL)

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = "8d2b8f9f-71bc-4a9f-90b6-4d85b7e5a6d3"
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
DATABASE_URL = os.environ.get("DATABASE_URL")
jwt = JWTManager(app)

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

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        token = None

        if "Authorization" in request.headers:
            bearer = request.headers["Authorization"]

            if bearer.startswith("Bearer "):
                token = bearer.split(" ")[1]

        if not token:
            return jsonify({"message": "Token gerekli"}), 401

        try:
            jwt.decode(
                token,
                app.config["SECRET_KEY"],
                algorithms=["HS256"]
            )
        except:
            return jsonify({"message": "Geçersiz token"}), 401

        return f(*args, **kwargs)

    return decorated

@app.route("/applys", methods=["GET"])
@token_required
def liste():

    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        SELECT id,name,surname,phone,class
        FROM applys
        ORDER BY id DESC
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    result = []

    for row in rows:
        result.append({
            "id": row[0],
            "name": row[1],
            "surname": row[2],
            "phone": row[3],
            "class": row[4]
        })

    return jsonify(result)

@app.route('/admin/applys', methods=['GET'])
@jwt_required()
def get_applys():
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, name, surname, phone, class FROM applys ORDER BY id DESC;")
        applys = cur.fetchall()
        return jsonify(applys), 200
    except Exception as e:
        return jsonify({"msg": "Veriler alınamadı", "error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# İlk admini oluşturmak için yardımcı route (İhtiyacın olduğunda kullanıp silebilirsin)
@app.route('/admin/register-seed', methods=['POST'])
def register_seed():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    hashed_password = generate_password_hash(password)
    
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO admins (username, password_hash) VALUES (%s, %s);", (username, hashed_password))
        conn.commit()
        return jsonify({"msg": "Admin başarıyla oluşturuldu"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"msg": "Oluşturulamadı", "error": str(e)}), 400
    finally:
        cur.close()
        conn.close()


@app.route("/admin/login", methods=["POST"])
def admin_login():

    data = request.json

    username = data.get("username")
    password = data.get("password")

    conn = get_conn()
    cur = conn.cursor()

    cur.execute(
        "SELECT password_hash FROM admins WHERE username=%s",
        (username,)
    )

    admin = cur.fetchone()

    cur.close()
    conn.close()

    if not admin:
        return jsonify({"message": "Kullanıcı bulunamadı"}), 401

    if not check_password_hash(admin[0], password):
        return jsonify({"message": "Şifre yanlış"}), 401

    token = jwt.encode(
        {
            "username": username,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=12)
        },
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({
        "token": token
    })

if __name__ == "__main__":
    app.run(debug=True)