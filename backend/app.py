from flask import Flask, request, jsonify
from hair_attributes import analyze_hair_attributes
import io
from PIL import Image

app = Flask(__name__)

@app.route('/analyze_hair', methods=['POST'])
def analyze_hair():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        try:
            image_bytes = file.read()
            image = Image.open(io.BytesIO(image_bytes))
            attributes = analyze_hair_attributes(image)
            return jsonify(attributes)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)