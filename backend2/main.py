
from flask import Flask, render_template, request, send_file, url_for, jsonify
import qrcode
import json
import insightface
import cv2
import numpy as np
import base64
from io import BytesIO
import os
import re

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/qrcodes'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

@app.route('/generate-qr', methods=['POST'])
def generate_qr_from_node():
    data = request.get_json()

    # Get collageid from JSON payload
    collageID = data.get('collageID', '').strip()

    if not collageID:
        return jsonify({'error': 'collageid is required'}), 400

    # QR content
    qr_data = json.dumps({"collageID" : collageID})
    
    # Generate QR
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    filename = f"qr_{collageID}.png"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    img.save(filepath)

    qr_url = url_for('static', filename=f'qrcodes/{filename}', _external=True)

    return jsonify({'qr_url': qr_url})

@app.route("/face-compare",methods = ["POST"])
def compare():
    model = insightface.app.FaceAnalysis()
    model.prepare(ctx_id=0)
    data = request.json
    img1 = base64.b64decode(data["image1"])
    np_arr1 = np.frombuffer(img1, np.uint8)
    image1 = cv2.imdecode(np_arr1, cv2.IMREAD_COLOR)

    img2 = base64.b64decode(data["image2"])
    np_arr2 = np.frombuffer(img2, np.uint8)
    image2 = cv2.imdecode(np_arr2, cv2.IMREAD_COLOR)
    faces1 = model.get(image1)
    faces2 = model.get(image2)
    
    if faces1 and faces2:
        face1 = faces1[0]
        face2 = faces2[0]
        sim = model.models['recognition'].compute_sim(face1.embedding, face2.embedding)
        if sim > 0.5:
            return jsonify({"status": "success","message":"face matched"})
        return jsonify({"status":"failure","message":"faces not matching"})
    return jsonify({"status":"failure", "message":"can not detect face"})
    pass
if __name__ == '__main__':
    app.run(debug=True)
