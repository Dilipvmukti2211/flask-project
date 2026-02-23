from flask import Flask, request, jsonify, send_from_directory, Response
import csv
from functools import wraps

app = Flask(__name__)
CSV_PATH = '/home/vmukti/.pro/new.csv'

USERNAME = 'admin'
PASSWORD = 'Admin@123'

# --- Basic Auth Wrapper ---
def check_auth(username, password):
    return username == USERNAME and password == PASSWORD

def authenticate():
    return Response(
        'Authentication required', 401,
        {'WWW-Authenticate': 'Basic realm="Login Required"'}
    )

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated

# --- Routes ---
@app.route('/')
@requires_auth
def index():
    return send_from_directory('.', 'index.html')

@app.route('/search-uuids')
@requires_auth
def search_uuids():
    query = request.args.get('q', '').strip().lower()
    results = []

    with open(CSV_PATH, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            uuid = row['uuid'].strip()
            if query in uuid.lower():
                results.append(uuid)

    return jsonify(results)

@app.route('/get-exam-url')
@requires_auth
def get_exam_url():
    uuid = request.args.get('uuid', '').strip()
    with open(CSV_PATH, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['uuid'].strip() == uuid:
                return jsonify({'exam_url': row['Exam_url']})
    return jsonify({'error': 'UUID not found'}), 404

# --- Main App Runner ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

