from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# geçici database (şimdilik RAM)
applications = []

@app.route("/")
def home():
    return jsonify({"message": "API çalışıyor"})

# BAŞVURU EKLE
@app.route("/apply", methods=["POST"])
def apply():
    data = request.json

    new_application = {
        "name": data.get("name"),
        "phone": data.get("phone"),
        "class": data.get("class")
    }

    applications.append(new_application)

    return jsonify({
        "message": "Başvuru alındı",
        "data": new_application
    })

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

if __name__ == "__main__":
    app.run(debug=True)