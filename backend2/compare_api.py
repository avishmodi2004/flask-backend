from flask import Flask, request, jsonify
import face_recognition
import numpy as np
import pickle
import cv2
import os

app = Flask(__name__)

with open("encodings.pkl", "rb") as f:
    known_encodings, known_names = pickle.load(f)

@app.route("/compare", methods=["POST"])
def compare_face():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]
    image = face_recognition.load_image_file(file)
    unknown_encodings = face_recognition.face_encodings(image)

    if len(unknown_encodings) == 0:
        return jsonify({"error": "No face detected"}), 400

    unknown_encoding = unknown_encodings[0]
    results = face_recognition.compare_faces(known_encodings, unknown_encoding)
    distances = face_recognition.face_distance(known_encodings, unknown_encoding)

    best_match_index = np.argmin(distances)
    if results[best_match_index]:
        name = known_names[best_match_index]
        return jsonify({
            "match": True,
            "name": name,
            "distance": float(distances[best_match_index])
        })
    else:
        return jsonify({"match": False})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
