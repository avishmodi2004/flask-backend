import face_recognition
import os
import pickle

known_faces_dir = "known_faces"
encodings_file = "encodings.pkl"

known_encodings = []
known_names = []

for filename in os.listdir(known_faces_dir):
    if filename.endswith((".jpg", ".jpeg", ".png")):
        path = os.path.join(known_faces_dir, filename)
        image = face_recognition.load_image_file(path)
        encoding = face_recognition.face_encodings(image)[0]
        known_encodings.append(encoding)
        known_names.append(os.path.splitext(filename)[0])
        print(f"✅ Encoded: {filename}")

with open(encodings_file, "wb") as f:
    pickle.dump((known_encodings, known_names), f)

print("🎉 All faces encoded successfully!")
