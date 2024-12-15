# populate_data.py

import requests
import json

url = "http://127.0.0.1:5000/payments"  # Replace with your API URL

# Data to populate
payments = [
    {"company": "derm", "amount": 4100, "payment_date": "2023-09-26", "status": "paid", "due_date": "2024-01-15"},
    {"company": "derm", "amount": 4100, "payment_date": "2023-10-12", "status": "paid", "due_date": "2024-01-15"},
    {"company": "tek", "amount": 15200, "payment_date": "2023-06-09", "status": "paid", "due_date": "2023-06-15"},
    {"company": "tek", "amount": 15200, "payment_date": "2023-07-12", "status": "paid", "due_date": "2023-09-15"},
    {"company": "tek", "amount": 11400, "payment_date": "2023-08-11", "status": "paid", "due_date": "2023-09-15"},
    {"company": "tek", "amount": 14440, "payment_date": "2023-09-21", "status": "paid", "due_date": "2024-01-15"},
    {"company": "tek", "amount": 15200, "payment_date": "2023-10-18", "status": "paid", "due_date": "2024-01-15"},
    {"company": "tek", "amount": 23520, "payment_date": "NA", "status": "unpaid", "due_date": "2024-01-15"},
    {"company": "tek", "amount": 16800, "payment_date": "NA", "status": "unpaid", "due_date": "2024-01-15"},
    {"company": "tek", "amount": 16800, "payment_date": "NA", "status": "unpaid", "due_date": "2024-01-15"},
    {"company": "tek", "amount": 16800, "payment_date": "NA", "status": "unpaid", "due_date": "2024-01-15"}
]

# Loop through the data and send POST requests
for payment in payments:
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, data=json.dumps(payment), headers=headers)
    print(f"Response from server: {response.text}")
