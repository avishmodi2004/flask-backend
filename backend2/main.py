
from flask import Flask, render_template, request, send_file, url_for, jsonify
import qrcode
import json
import insightface
import cv2
import numpy as np
import base64
from io import BytesIO
import re

app = Flask(__name__)
model = insightface.app.FaceAnalysis()
model.prepare(ctx_id=0)

@app.route("/face-compare",methods = ["POST"])
def compare():
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
            return jsonify({"result": "success","message":"face matched"})
        return jsonify({"result":"failure","message":"faces not matching"})
    return jsonify({"result":"failure", "message":"can not detect face"})
if __name__ == '__main__':
    app.run(debug=True)
