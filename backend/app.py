# app.py

from flask_cors import CORS
from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
CORS(app)  # This will allow your frontend to make requests to the backend

# Initialize the SQLite database (will create the database file if it doesn't exist)
def init_db():
    with sqlite3.connect("tax_payments.db") as conn:
        cursor = conn.cursor()
        # Create table if it doesn't exist
        cursor.execute('''CREATE TABLE IF NOT EXISTS payments (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            company TEXT NOT NULL,
                            amount REAL NOT NULL,
                            payment_date TEXT NOT NULL,
                            due_date TEXT NOT NULL,
                            status TEXT DEFAULT 'paid')''')
        conn.commit()

# Helper function to get a database connection
def get_db_connection():
    conn = sqlite3.connect('tax_payments.db')
    conn.row_factory = sqlite3.Row
    return conn

# Route to view all tax payments
@app.route('/payments', methods=['GET'])
def view_payments():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM payments")
    payments = cursor.fetchall()
    conn.close()
    return jsonify([{
        'id': payment['id'],
        'company': payment['company'],
        'amount': payment['amount'],
        'payment_date': payment['payment_date'],
        'due_date': payment['due_date'],
        'status': payment['status']
    } for payment in payments])

# Route to add a tax payment
@app.route('/payments', methods=['POST'])
def add_payment():
    data = request.get_json()

    # Validate input
    if 'company' not in data or 'amount' not in data or 'payment_date' not in data or 'due_date' not in data:
        return jsonify({"message": "Missing required fields"}), 400

    company = data['company']
    amount = data['amount']
    payment_date = data['payment_date']
    due_date = data['due_date']
    status = data.get('status', 'paid')  # Default status is 'paid'

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''INSERT INTO payments (company, amount, payment_date, due_date, status)
                      VALUES (?, ?, ?, ?, ?)''', (company, amount, payment_date, due_date, status))
    conn.commit()
    conn.close()

    return jsonify({"message": "Payment added successfully!"}), 201

# Route to delete tax payment by id
@app.route('/payments/<int:id>', methods=['DELETE'])
def delete_payment(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if the record exists
    cursor.execute("SELECT * FROM payments WHERE id = ?", (id,))
    payment = cursor.fetchone()

    if payment is None:
        conn.close()
        return jsonify({"error": f"No payment found with id {id}"}), 404

    # Delete the record
    cursor.execute("DELETE FROM payments WHERE id = ?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": f"Payment with id {id} successfully deleted."}), 200

# Route to update a specific tax payment record by id
@app.route('/payments/<int:id>', methods=['PATCH'])
def update_payment(id):
    data = request.get_json()

    # Validate input
    if not data:
        return jsonify({"message": "No data provided"}), 400

    # Dynamically construct the SQL update query
    fields = []
    values = []

    # List of allowed fields to update
    allowed_fields = ['company', 'amount', 'payment_date', 'due_date', 'status']

    for field, value in data.items():
        if field in allowed_fields:
            fields.append(f"{field} = ?")
            values.append(value)

    if not fields:
        return jsonify({"message": "No valid fields provided for update"}), 400

    # Append the ID to the values list for the WHERE clause
    values.append(id)

    query = f"UPDATE payments SET {', '.join(fields)} WHERE id = ?"

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if the record exists before attempting an update
    cursor.execute("SELECT * FROM payments WHERE id = ?", (id,))
    payment = cursor.fetchone()

    if payment is None:
        conn.close()
        return jsonify({"error": f"No payment found with id {id}"}), 404

    # Execute the update query
    cursor.execute(query, values)
    conn.commit()
    conn.close()

    return jsonify({"message": f"Payment with id {id} successfully updated."}), 200


if __name__ == '__main__':
    init_db()  # Call init_db to initialize the database before starting the app
    app.run(debug=True)
