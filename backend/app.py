from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
from dotenv import load_dotenv
import jwt
import datetime
from functools import wraps
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")


def get_conn():
    return psycopg2.connect(DATABASE_URL)


app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = "8d2b8f9f-71bc-4a9f-90b6-4d85b7e5a6d3"
app.config["JWT_SECRET_KEY"] = app.config["SECRET_KEY"]
app.config["JWT_TOKEN_LOCATION"] = ["headers"]

jwt_manager = JWTManager(app)

# geçici database (şimdilik RAM)
applications = []
free_trials = []


@app.route("/")
def home():
    return jsonify({"message": "API çalışıyor"})


@app.route("/applications", methods=["GET"])
def get_applications():
    return jsonify(applications)


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


# -------------------------------------------------------------------
# ADMIN LOGIN
# -------------------------------------------------------------------
@app.route('/admin/register-seed', methods=['POST'])
def register_seed():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    hashed_password = generate_password_hash(password)

    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO admins (username, password_hash) VALUES (%s, %s);",
            (username, hashed_password)
        )
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

    token = create_access_token(
        identity=username,
        expires_delta=datetime.timedelta(hours=12)
    )

    return jsonify({
        "token": token
    })


# -------------------------------------------------------------------
# BAŞVURULAR (APPLYS)
# -------------------------------------------------------------------
@app.route('/admin/applys', methods=['GET'])
@jwt_required()
def get_applys():
    # ?status=pending  -> sadece bekleyen başvurular
    # ?status=approved -> öğrenciye çevrilmiş başvurular
    # (parametre yoksa)  -> hepsi
    status_filter = request.args.get('status')

    conn = get_conn()
    cur = conn.cursor()
    try:
        if status_filter:
            cur.execute(
                """
                SELECT id, name, surname, phone, class, status
                FROM applys
                WHERE status=%s
                ORDER BY id DESC;
                """,
                (status_filter,)
            )
        else:
            cur.execute(
                """
                SELECT id, name, surname, phone, class, status
                FROM applys
                ORDER BY id DESC;
                """
            )

        rows = cur.fetchall()
        result = [
            {
                "id": r[0],
                "name": r[1],
                "surname": r[2],
                "phone": r[3],
                "class": r[4],
                "status": r[5]
            }
            for r in rows
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"msg": "Veriler alınamadı", "error": str(e)}), 500
    finally:
        cur.close()
        conn.close()


# -------------------------------------------------------------------
# ÖĞRENCİLER (STUDENTS)
# -------------------------------------------------------------------
@app.route('/admin/students', methods=['POST'])
@jwt_required()
def create_student_from_application():
    """
    Bir başvuruyu öğrenciye çevirir.
    Body: { application_id, parent_name, parent_phone, fee }
    """
    data = request.get_json() or {}
    application_id = data.get('application_id')
    parent_name = data.get('parent_name')
    parent_phone = data.get('parent_phone')
    fee = data.get('fee')

    if not application_id:
        return jsonify({"msg": "application_id gerekli"}), 400

    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT name, surname, phone, class, status FROM applys WHERE id=%s",
            (application_id,)
        )
        application = cur.fetchone()

        if not application:
            return jsonify({"msg": "Başvuru bulunamadı"}), 404

        name, surname, phone, class_, status = application

        if status == 'approved':
            return jsonify({"msg": "Bu başvuru zaten öğrenciye çevrilmiş"}), 409

        cur.execute(
            """
            INSERT INTO students
                (application_id, name, surname, phone, class, parent_name, parent_phone, fee)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, created_at
            """,
            (application_id, name, surname, phone, class_, parent_name, parent_phone, fee)
        )
        student_id, created_at = cur.fetchone()

        cur.execute(
            "UPDATE applys SET status='approved' WHERE id=%s",
            (application_id,)
        )

        conn.commit()

        return jsonify({
            "msg": "Öğrenci kaydı oluşturuldu",
            "student": {
                "id": student_id,
                "application_id": application_id,
                "name": name,
                "surname": surname,
                "phone": phone,
                "class": class_,
                "parent_name": parent_name,
                "parent_phone": parent_phone,
                "fee": fee,
                "created_at": created_at.isoformat() if created_at else None
            }
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"msg": "Öğrenci oluşturulamadı", "error": str(e)}), 500
    finally:
        cur.close()
        conn.close()


@app.route('/admin/students', methods=['GET'])
@jwt_required()
def get_students():
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            SELECT id, application_id, name, surname, phone, class,
                   parent_name, parent_phone, fee, created_at
            FROM students
            ORDER BY id DESC;
            """
        )
        rows = cur.fetchall()
        result = [
            {
                "id": r[0],
                "application_id": r[1],
                "name": r[2],
                "surname": r[3],
                "phone": r[4],
                "class": r[5],
                "parent_name": r[6],
                "parent_phone": r[7],
                "fee": float(r[8]) if r[8] is not None else None,
                "created_at": r[9].isoformat() if r[9] else None
            }
            for r in rows
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"msg": "Veriler alınamadı", "error": str(e)}), 500
    finally:
        cur.close()
        conn.close()


@app.route('/admin/students/<int:student_id>', methods=['DELETE'])
@jwt_required()
def delete_student(student_id):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM students WHERE id=%s", (student_id,))
        conn.commit()
        return jsonify({"msg": "Öğrenci silindi"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"msg": "Silinemedi", "error": str(e)}), 500
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    app.run(debug=True)