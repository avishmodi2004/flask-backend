from flask import Flask, render_template, request, send_file, url_for
import qrcode
from io import BytesIO
import os
import re  # For email validation

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/qrcodes'

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def is_valid_email(email): 
    """Simple email validation"""
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

@app.route('/', methods=['GET', 'POST'])
def index():
    qr_code = None
    message = None
    name = None
    rollnum = None
    email = None
    
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        rollnum = request.form.get('rollnum', '').strip()
        email = request.form.get('email', '').strip()

        # Validate inputs
        if not name or not rollnum:
            message = 'Name and Roll Number are required'
        elif email and not is_valid_email(email):
            message = 'Please enter a valid email address'
        else:
            # Create QR data
            qr_data = f"STUDENT INFO\nName: {name}\nRoll No: {rollnum}"
            if email:
                qr_data += f"\nEmail: {email}"
            
            # Generate QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(qr_data)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            
            # Save to file
            filename = f"qr_{name}_{rollnum}.png"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            img.save(filepath)
            
            qr_code = url_for('static', filename=f'qrcodes/{filename}')
    
    return render_template('index.html', 
                         qr_code=qr_code,
                         message=message,
                         name=name,
                         rollnum=rollnum,
                         email=email)

if __name__ == '__main__':
    app.run(debug=True)