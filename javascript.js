// state variables
let expenses = [];
let currentSalary = 0;
let totalExpenseAmount = 0;
let expenseChart;

// DOM Selection
const cashFlowForm = document.getElementById("cashFlowForm");
const salaryInput = document.getElementById("salary");
const expenseNameInput = document.getElementById("expenseName");
const expenseAmountInput = document.getElementById("expenseAmount");
const errorMessage = document.getElementById("errorMessage");
const totalSalary = document.getElementById("totalSalary");
const totalExpenses = document.getElementById("totalExpenses");
const remainingBalance = document.getElementById("remainingBalance");
const expenseList = document.getElementById("expenseList");
const downloadBtn = document.getElementById("downloadReport");

// renderExpenses function
function renderExpenses() {
    expenseList.innerHTML = "";

    expenses.forEach(exp => {
        const li = document.createElement("li");

        li.innerHTML = `${exp.name} - ₹${exp.amount}
            <button  id="del-btn" onclick="deleteExpense(${exp.id})">🗑</button>`;

        expenseList.appendChild(li);
    });
     totalExpenseAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    totalExpenses.textContent = `₹${totalExpenseAmount}`;
    remainingBalance.textContent = `₹${currentSalary - totalExpenseAmount}`;
    updateChart();
}

// deleteExpense function
function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
renderExpenses();
}

// updateChart function
function updateChart() {
    const ctx = document.getElementById("expenseChart");

    const expenseValue = totalExpenseAmount;
    const remainingValue = currentSalary - totalExpenseAmount;

    if (expenseChart) {
        expenseChart.destroy();
    }

   expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: ["Expenses", "Remaining"],
        datasets: [{
            data: [expenseValue, remainingValue],
            backgroundColor: ["#EF4444", "#22C55E"]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});
}

//pdf creator function
function generatePDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Expense Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Salary: Rs.${currentSalary}`, 20, 40);

    let totalExpenses = expenses.reduce(
        (total, expense) => total + expense.amount,
        0
    );

    let balance = currentSalary - totalExpenses;

    doc.text(`Total Expenses: Rs.${totalExpenses}`, 20, 50);
    doc.text(`Remaining Balance: Rs.${balance}`, 20, 60);

    doc.text("Expense History:", 20, 80);

    let y = 90;

    expenses.forEach((expense) => {

        doc.text(
            `${expense.name} - Rs.${expense.amount}`,
            20,
            y
        );
doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    20,
    30
);
        y += 10;
    });

    doc.save("Expense_Report.pdf");
}

// Form submit event listener
cashFlowForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const salary = Number(salaryInput.value);
    const expenseName = expenseNameInput.value.trim();
    const expenseAmount = Number(expenseAmountInput.value);
    if (
    salary <= 0 ||
    expenseAmount <= 0 ||
    expenseName === ""
) {
    errorMessage.textContent =
        "All fields are required and amounts must be positive.";

    return;
}
errorMessage.textContent = "";
currentSalary = salary;

expenses.push({
    id: Date.now(),
    name: expenseName,
    amount: expenseAmount
});
localStorage.setItem(
    "expenses",
    JSON.stringify(expenses)
);
localStorage.setItem(
    "salary",
    JSON.stringify(currentSalary)
);
totalSalary.textContent = `₹${salary}`;
renderExpenses();
});

// Window load event listener
window.addEventListener("load", function () {

    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const savedSalary = JSON.parse(localStorage.getItem("salary")) || 0;

    expenses = savedExpenses;
    currentSalary = savedSalary;

    totalSalary.textContent = `₹${currentSalary}`;

renderExpenses();
});
 
//pdf generator button event listener
downloadBtn.addEventListener(
    "click",
    generatePDF
);

