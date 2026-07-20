//script.js
document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");
    // 1. Get the new month filter element
    const filterMonth = document.getElementById("filter-month"); // NEW LINE

    let expenses = [];

    // --- HELPER FUNCTION: Populates the <select> with unique months ---
    function populateMonthFilter() {
        // Get unique 'YYYY-MM' strings from all expense dates
        const uniqueMonths = new Set(expenses.map(expense => expense.date.substring(0, 7)));
        
        // Convert YYYY-MM to readable Month Year format for display
        const monthOptions = Array.from(uniqueMonths)
            .sort() // Sort chronologically
            .map(dateStr => {
                const [year, month] = dateStr.split('-');
                const monthName = new Date(year, month - 1, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
                return { value: dateStr, text: monthName };
            });

        // Clear existing options (except 'All Months')
        filterMonth.innerHTML = '<option value="All">All Months</option>';

        // Add new unique months
        monthOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            filterMonth.appendChild(opt);
        });
    }

    // --- MAIN LOGIC FUNCTIONS ---

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;

        const expense = {
            id: Date.now(),
            name,
            amount,
            category,
            date
        };

        expenses.push(expense);
        // Call the filter function, which now handles both filtering and display
        applyFilters(); 
        updateTotalAmount();
        // Update months whenever a new expense is added
        populateMonthFilter(); // NEW LINE

        expenseForm.reset();
    });

    expenseList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = parseInt(e.target.dataset.id);
            expenses = expenses.filter(expense => expense.id !== id);
            applyFilters();
            updateTotalAmount();
            populateMonthFilter(); // NEW LINE
        }

        if (e.target.classList.contains("edit-btn")) {
            const id = parseInt(e.target.dataset.id);
            const expense = expenses.find(expense => expense.id === id);

            document.getElementById("expense-name").value = expense.name;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;

            expenses = expenses.filter(expense => expense.id !== id);
            applyFilters();
            updateTotalAmount();
            populateMonthFilter(); // NEW LINE
        }
    });

    // --- FILTER CHANGE LISTENERS ---
    
    // Use applyFilters for both change events
    filterCategory.addEventListener("change", applyFilters);
    filterMonth.addEventListener("change", applyFilters); // NEW LISTENER

    // --- MAIN FILTERING AND DISPLAY FUNCTION ---
    function applyFilters() {
        const selectedCategory = filterCategory.value;
        const selectedMonth = filterMonth.value; // Get selected month (YYYY-MM)

        let filteredExpenses = expenses;

        // 1. Filter by Category
        if (selectedCategory !== "All") {
            filteredExpenses = filteredExpenses.filter(expense => expense.category === selectedCategory);
        }

        // 2. Filter by Month
        if (selectedMonth !== "All") {
            // Check if expense date starts with the selected YYYY-MM
            filteredExpenses = filteredExpenses.filter(expense => expense.date.startsWith(selectedMonth)); 
        }

        displayExpenses(filteredExpenses);
    }
    
    // --- DISPLAY FUNCTION (Kept separate for clarity) ---

    function displayExpenses(expensesToDisplay) {
        expenseList.innerHTML = "";
        expensesToDisplay.forEach(expense => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.name}</td>
                <td>₨${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;

            expenseList.appendChild(row);
        });
    }

    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }
    
    // Initialize the month filter on load (in case data is loaded from storage)
    // You would call this after loading expenses from localStorage/server if you were doing that
    populateMonthFilter(); 
});