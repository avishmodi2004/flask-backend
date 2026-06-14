from flask import Flask, request, jsonify
import insightface
import cv2
import numpy as np
import base64

app = Flask(__name__)

model = insightface.app.FaceAnalysis()
model.prepare(ctx_id=0)


def base64_to_image(base64_string):
    img_bytes = base64.b64decode(base64_string)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return image


def get_face(image):
    faces = model.get(image)
    if not faces:
        return None
    return faces[0]


def get_face_position(face):
    if face.kps is None or len(face.kps) < 5:
        return None

    left_eye = face.kps[0]
    right_eye = face.kps[1]
    nose = face.kps[2]
    left_mouth = face.kps[3]
    right_mouth = face.kps[4]

    eye_center_x = (left_eye[0] + right_eye[0]) / 2
    eye_center_y = (left_eye[1] + right_eye[1]) / 2
    mouth_center_y = (left_mouth[1] + right_mouth[1]) / 2

    eye_distance = abs(right_eye[0] - left_eye[0])
    face_height = abs(mouth_center_y - eye_center_y)

    if eye_distance == 0 or face_height == 0:
        return None

    nose_x = (nose[0] - eye_center_x) / eye_distance
    nose_y = (nose[1] - eye_center_y) / face_height

    return {
        "x": float(nose_x),
        "y": float(nose_y)
    }


def face_similarity(face1, face2):
    return model.models["recognition"].compute_sim(
        face1.embedding,
        face2.embedding
    )


def verify_challenge(challenge, position):
    x = position["x"]
    y = position["y"]

    if challenge == "Look UP":
        return y < 0.48

    if challenge == "Look DOWN":
        return y > 0.58

    if challenge == "Move Face LEFT":
        return x < -0.06

    if challenge == "Move Face RIGHT":
        return x > 0.06

    return False


@app.route("/face-compare", methods=["POST"])
def face_compare():
    try:
        data = request.json

        registered_image = data.get("image1")
        live_image = data.get("image2")
        challenge = data.get("challenge")

        if not registered_image or not live_image or not challenge:
            return jsonify({
                "result": "failure",
                "message": "Image ya challenge missing hai"
            })

        reg_img = base64_to_image(registered_image)
        live_img = base64_to_image(live_image)

        reg_face = get_face(reg_img)
        live_face = get_face(live_img)

        if reg_face is None:
            return jsonify({
                "result": "failure",
                "message": "Registered photo me face detect nahi hua"
            })

        if live_face is None:
            return jsonify({
                "result": "failure",
                "message": "Live photo me face detect nahi hua"
            })

        sim = face_similarity(reg_face, live_face)

        print("Challenge:", challenge)
        print("Face Similarity:", sim)

        if sim < 0.25:
            return jsonify({
                "result": "failure",
                "message": "Face match nahi hua",
                "similarity": float(sim)
            })

        position = get_face_position(live_face)

        if position is None:
            return jsonify({
                "result": "failure",
                "message": "Face landmarks detect nahi hue"
            })

        challenge_ok = verify_challenge(challenge, position)

        print("Position:", position)
        print("Challenge OK:", challenge_ok)

        if not challenge_ok:
            return jsonify({
                "result": "failure",
                "message": f"{challenge} properly nahi hua",
                "position": position,
                "similarity": float(sim)
            })

        return jsonify({
            "result": "success",
            "message": "Face matched and challenge passed",
            "challenge": challenge,
            "similarity": float(sim),
            "position": position
        })

    except Exception as e:
        print("Flask Error:", str(e))
        return jsonify({
            "result": "failure",
            "message": "Flask server error",
            "debug": str(e)
        })

@app.route("/verify-pose", methods=["POST"])
def verify_pose():
    try:
        data = request.json
        live_image = data.get("image")
        challenge = data.get("challenge")

        if not live_image or not challenge:
            return jsonify({
                "result": "failure",
                "message": "Image ya challenge missing"
            })

        img = base64_to_image(live_image)
        face = get_face(img)

        if face is None:
            return jsonify({
                "result": "failure",
                "message": "Face detect nahi hua"
            })

        position = get_face_position(face)

        if position is None:
            return jsonify({
                "result": "failure",
                "message": "Face landmarks detect nahi hue"
            })

        ok = verify_challenge(challenge, position)

        print("Pose Verify Challenge:", challenge)
        print("Position:", position)
        print("Pose OK:", ok)

        if not ok:
            return jsonify({
                "result": "failure",
                "message": f"{challenge} properly karo",
                "position": position
            })

        return jsonify({
            "result": "success",
            "message": "Pose challenge passed",
            "position": position
        })

    except Exception as e:
        return jsonify({
            "result": "failure",
            "message": "Pose verify error",
            "debug": str(e)
        })
    
if __name__ == "__main__":
    app.run(debug=True)