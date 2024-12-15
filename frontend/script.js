// Fetch payments data from the Flask backend
function fetchPayments() {
    fetch("http://127.0.0.1:5000/payments")
        .then((response) => response.json())
        .then((payments) => {
            const paymentsList = document.getElementById("paymentsList");
            paymentsList.innerHTML = ""; // Clear any existing rows

            payments.forEach((payment) => {
                // Create a new row for each payment
                const row = document.createElement("tr");
                row.setAttribute("data-id", payment.id);

                row.innerHTML = `
                    <td class="id">${payment.id}</td>
                    <td class="company">${payment.company}</td>
                    <td class="amount">${payment.amount}</td>
                    <td class="payment-date">${payment.payment_date}</td>
                    <td class="due-date">${payment.due_date}</td>
                    <td class="status">${payment.status}</td>
                    <td>
                        <!-- Buttons for Update and Delete actions -->
                        <button onclick="showUpdateModal(${payment.id})">Update</button>
                        <button onclick="deletePayment(${payment.id})">Delete</button>
                    </td>
                `;
                paymentsList.appendChild(row);
            });

            // Refresh the Tax Table (in case changes indirectly affect it)
            filterByDueDate();
        })
        .catch((error) => {
            console.error("Error fetching payments:", error);
        });
}

// Delete a payment record
function deletePayment(id) {
    if (confirm(`Are you sure you want to delete payment with ID ${id}?`)) {
        fetch(`http://127.0.0.1:5000/payments/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert(`Payment with ID ${id} deleted successfully.`);
                fetchPayments(); // Refresh the table after deletion
                filterByDueDate(); // Refresh the Tax Table
            } else {
                alert(`Failed to delete payment with ID ${id}.`);
            }
        })
        .catch(error => {
            console.error(`Error deleting payment with ID ${id}:`, error);
        });
    }
}

// Get form and input references
const addPaymentForm = document.getElementById('addPaymentForm');

// Handle form submission to add a new payment
addPaymentForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Collect input values
    const company = document.getElementById('newCompany').value;
    const amount = document.getElementById('newAmount').value;
    const payment_date = document.getElementById('newPaymentDate').value || null;
    const due_date = document.getElementById('newDueDate').value || null;
    const status = document.getElementById('newStatus').value;

    // Create a payment object
    const newPayment = { company, amount, payment_date, due_date, status };

    // Send a POST request to the backend
    fetch('http://127.0.0.1:5000/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment),
    })
        .then((response) => {
            if (response.ok) {
                // Clear the form
                addPaymentForm.reset();

                // Collapse the form
                addPaymentSection.style.display = 'none';
                toggleFormButton.textContent = 'Add New Payment';

                // Refresh the table
                fetchPayments();
            } else {
                console.error('Failed to add payment:', response.statusText);
            }
        })
        .catch((error) => {
            console.error('Error adding payment:', error);
        });
});

// Toggle the collapsible form section
const toggleFormButton = document.getElementById('toggleFormButton');
const addPaymentSection = document.getElementById('addPaymentSection');

toggleFormButton.addEventListener('click', () => {
    if (addPaymentSection.style.display === 'none' || !addPaymentSection.style.display) {
        // Expand the section
        addPaymentSection.style.display = 'block';
        toggleFormButton.textContent = 'Hide Add New Payment';
    } else {
        // Collapse the section
        addPaymentSection.style.display = 'none';
        toggleFormButton.textContent = 'Add New Payment';
    }
});

// Function to set quick due date for Add Payment Form
function setQuickDueDateForAddForm(month, day) {
    const today = new Date();
    const currentYear = today.getFullYear();

    // Determine if the chosen date has passed in the current year
    const selectedDate = new Date(currentYear, month - 1, day); // month is zero-based
    if (today > selectedDate) {
        selectedDate.setFullYear(currentYear + 1); // Move to next year
    }

    // Format date as YYYY-MM-DD for input[type="date"]
    const formattedDate = selectedDate.toISOString().split('T')[0];

    // Set the value in the Add Payment form's date picker
    document.getElementById("newDueDate").value = formattedDate;
}

// Update Modal //

let currentUpdateId = null;

function showUpdateModal(id) {
    currentUpdateId = id;

    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) {
        console.error(`Row with ID ${id} not found.`);
        return;
    }

    // Populate the modal fields
    document.getElementById("editCompany").value = row.querySelector(".company").textContent.trim();
    document.getElementById("editAmount").value = row.querySelector(".amount").textContent.trim();
    document.getElementById("editPaymentDate").value = row.querySelector(".payment-date").textContent.trim();
    document.getElementById("editDueDate").value = row.querySelector(".due-date").textContent.trim();
    document.getElementById("editStatus").value = row.querySelector(".status").textContent.trim();

    // Show the modal
    document.getElementById("updateModal").style.display = "block";
}

// Close the update modal
document.getElementById("closeUpdateModal").addEventListener("click", () => {
    document.getElementById("updateModal").style.display = "none";
});

// Handle update form submission
document.getElementById("updatePaymentForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const updatedPayment = {
        company: document.getElementById("editCompany").value,
        amount: parseFloat(document.getElementById("editAmount").value),
        payment_date: document.getElementById("editPaymentDate").value,
        due_date: document.getElementById("editDueDate").value,
        status: document.getElementById("editStatus").value,
    };

    fetch(`http://127.0.0.1:5000/payments/${currentUpdateId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPayment),
    })
        .then((response) => response.json())
        .then(() => {
            // Refresh table and close modal
            fetchPayments();
            filterByDueDate(); // Refresh the Tax Table
            document.getElementById("updateModal").style.display = "none";
        })
        .catch((error) => console.error("Error updating payment:", error));
});

// Function to set quick due date
function setQuickDueDate(month, day) {
    const today = new Date();
    const currentYear = today.getFullYear();

    // Determine if the chosen date has passed in the current year
    const selectedDate = new Date(currentYear, month - 1, day); // month is zero-based
    if (today > selectedDate) {
        selectedDate.setFullYear(currentYear + 1); // Move to next year
    }

    // Format date as YYYY-MM-DD for input[type="date"]
    const formattedDate = selectedDate.toISOString().split('T')[0];

    // Set the value in the date picker
    document.getElementById("editDueDate").value = formattedDate;
}


//========== TAX TABLE ==========//

// DOM Elements
const dueDateFilter = document.getElementById("dueDateFilter");
const taxTableBody = document.getElementById("taxTable").querySelector("tbody");
const taxRateInput = document.getElementById("taxRate");
const totalAmountSpan = document.getElementById("totalAmount");
const taxDueSpan = document.getElementById("taxDue");

// Helper function to format numbers as currency
function formatCurrency(amount) {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Function to filter records by due date and display in the Tax Table
function filterByDueDate() {
    const selectedDate = dueDateFilter.value; // Get the selected date in YYYY-MM-DD format

    fetch('http://127.0.0.1:5000/payments')
        .then(response => response.json())
        .then(payments => {
            // Filter records
            const filteredRecords = payments.filter(p => p.due_date === selectedDate);

            // Update Tax Table
            taxTableBody.innerHTML = ""; // Clear previous rows
            if (filteredRecords.length > 0) {
                // Populate table with filtered records
                filteredRecords.forEach(record => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${record.id}</td>
                        <td>${record.company}</td>
                        <td>${formatCurrency(record.amount)}</td>
                        <td>${record.payment_date}</td>
                        <td>${record.status}</td>
                        <td>${record.due_date}</td>
                    `;
                    taxTableBody.appendChild(row);
                });
            } else {
                // If no records match, leave the table empty but with headers
                const emptyRow = document.createElement("tr");
                emptyRow.innerHTML = `<td colspan="6" style="text-align: center;">No records found for the selected due date.</td>`;
                taxTableBody.appendChild(emptyRow);
            }

            // Calculate Total Amount and Tax Due
            const totalAmount = filteredRecords.reduce((sum, record) => sum + record.amount, 0);
            totalAmountSpan.textContent = formatCurrency(totalAmount);
            calculateTaxDue(totalAmount);
        })
        .catch(error => console.error("Error filtering records:", error));
}

// Function to calculate and display Tax Due
function calculateTaxDue(totalAmount) {
    const taxRate = parseFloat(taxRateInput.value) || 0;
    const taxDue = (totalAmount * taxRate) / 100;
    taxDueSpan.textContent = formatCurrency(taxDue);
}

// Event Listeners
dueDateFilter.addEventListener("change", filterByDueDate);
taxRateInput.addEventListener("input", () => {
    // Remove $ and commas before parsing
    const totalAmount = parseFloat(totalAmountSpan.textContent.replace(/[$,]/g, '')) || 0;
    calculateTaxDue(totalAmount);
});

// Call fetchPayments when the page
// Fetch and display payments when the page loads
window.onload = () => {
    fetchPayments();
    addPaymentSection.style.display = 'none';
    toggleFormButton.textContent = 'Add New Payment';
}
