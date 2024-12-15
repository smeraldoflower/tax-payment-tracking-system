# **Tax Payment Tracker API**

## **Base URL**  
```
http://127.0.0.1:5000
```

---

## **1. Get All Payments**

**Endpoint:**  
`GET /payments`

**Description:**  
Retrieves all tax payment records.

**Response:**  
- **200 OK**  
- JSON array containing all payment records.

**Example Response:**
```json
[
    {
        "id": 1,
        "company": "Company A",
        "amount": 1000.00,
        "payment_date": "2024-01-01",
        "due_date": "2024-01-15",
        "status": "paid"
    },
    {
        "id": 2,
        "company": "Company B",
        "amount": 2000.00,
        "payment_date": "2024-02-01",
        "due_date": "2024-02-15",
        "status": "unpaid"
    }
]
```

---

## **2. Add a New Payment**

**Endpoint:**  
`POST /payments`

**Description:**  
Adds a new tax payment record.

**Request Body (JSON):**

| Field          | Type     | Required | Description                    |
|-----------------|----------|----------|--------------------------------|
| `company`      | String   | Yes      | Name of the company            |
| `amount`       | Float    | Yes      | Payment amount                 |
| `payment_date` | String   | Yes      | Payment date (YYYY-MM-DD)      |
| `due_date`     | String   | Yes      | Due date for the payment       |
| `status`       | String   | No       | Payment status (default: "paid")|

**Example Request:**
```json
{
    "company": "Company Name",
    "amount": 1500.50,
    "payment_date": "2024-01-10",
    "due_date": "2024-01-15",
    "status": "paid"
}
```

**Response:**
- **201 Created**

**Example Response:**
```json
{
    "message": "Payment added successfully!"
}
```

---

## **3. Delete a Payment**

**Endpoint:**  
`DELETE /payments/<int:id>`

**Description:**  
Deletes a specific payment record by its ID.

**URL Parameter:**

| Parameter  | Type     | Required | Description                  |
|------------|----------|----------|------------------------------|
| `id`       | Integer  | Yes      | The ID of the payment record |

**Responses:**
- **200 OK**: Payment successfully deleted.  
- **404 Not Found**: No payment with the specified ID exists.

**Example Response:**
```json
{
    "message": "Payment with id 3 successfully deleted."
}
```

**Example Error Response:**
```json
{
    "error": "No payment found with id 3"
}
```

---

## **4. Update a Payment**

**Endpoint:**  
`PATCH /payments/<int:id>`

**Description:**  
Updates one or more fields of a specific payment record.

**URL Parameter:**

| Parameter  | Type     | Required | Description                  |
|------------|----------|----------|------------------------------|
| `id`       | Integer  | Yes      | The ID of the payment record |

**Allowed Fields for Update:**  
- `company` (string)  
- `amount` (float)  
- `payment_date` (string, YYYY-MM-DD)  
- `due_date` (string, YYYY-MM-DD)  
- `status` (string)

**Example Request:**
```json
{
    "amount": 2500.75,
    "status": "unpaid"
}
```

**Responses:**
- **200 OK**: Payment successfully updated.  
- **400 Bad Request**: No valid fields provided.  
- **404 Not Found**: Payment with the specified ID does not exist.

**Example Response:**
```json
{
    "message": "Payment with id 3 successfully updated."
}
```

**Example Error Response:**
```json
{
    "error": "No payment found with id 3"
}
```

---

## **Database Table Structure**

The database stores records in the following table:

| **Field**       | **Type**      | **Required** | **Description**                 |
|------------------|---------------|--------------|---------------------------------|
| `id`            | INTEGER       | Auto         | Auto-incremented primary key    |
| `company`       | TEXT          | Yes          | Name of the company             |
| `amount`        | REAL          | Yes          | Payment amount                  |
| `payment_date`  | TEXT (Date)   | Yes          | Date of payment (YYYY-MM-DD)    |
| `due_date`      | TEXT (Date)   | Yes          | Due date for the payment        |
| `status`        | TEXT          | No           | Payment status ("paid"/"unpaid")|

---

## **General Notes**

1. **CORS**: Enabled to allow frontend-to-backend communication.  
2. **Input Validation**:  
   - Adding a new record requires `company`, `amount`, `payment_date`, and `due_date`.  
   - Update requests validate for valid fields.  
3. **Database**: The database file is **SQLite** (`tax_payments.db`), which is automatically initialized if it doesn’t exist.
4. This project contains source code that has been partially developed using generative AI (chatGPT)

---
