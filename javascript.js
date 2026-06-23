let expenses = [];
let currentSalary = 0;
const cashFlowForm = document.getElementById("cashFlowForm");

const salaryInput = document.getElementById("salary");
const expenseNameInput = document.getElementById("expenseName");
const expenseAmountInput = document.getElementById("expenseAmount");
const totalSalary = document.getElementById("totalSalary");
const totalExpenses = document.getElementById("totalExpenses");
const remainingBalance = document.getElementById("remainingBalance");
const errorMessage = document.getElementById("errorMessage");
const expenseList = document.getElementById("expenseList");
let totalExpenseAmount = 0;
function renderExpenses() {
    expenseList.innerHTML = "";

    expenses.forEach(exp => {
        const li = document.createElement("li");

        li.innerHTML = `
            ${exp.name} - ₹${exp.amount}
            <button onclick="deleteExpense(${exp.id})">🗑</button>
        `;

        expenseList.appendChild(li);
    });
     totalExpenseAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    totalExpenses.textContent = `₹${totalExpenseAmount}`;
    remainingBalance.textContent = `₹${currentSalary - totalExpenseAmount}`;
    updateChart();
}
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
window.addEventListener("load", function () {

    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const savedSalary = JSON.parse(localStorage.getItem("salary")) || 0;

    expenses = savedExpenses;
    currentSalary = savedSalary;

    totalSalary.textContent = `₹${currentSalary}`;

renderExpenses();
});
   function deleteExpense(id) {

    
    expenses = expenses.filter(exp => exp.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));



renderExpenses();
}
let expenseChart;
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