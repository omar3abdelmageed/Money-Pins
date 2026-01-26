import { categoryCardTemplate, expenseTemplate, deleteExpenseBtnTemplate, CardButtonsTemplate, summaryTemplate } from "./templates.js";

const AddCategoryBtn = document.getElementById("add-category-btn");

const CategoriesContainer = document.getElementById("categories-container");

const GenerateSummaryBtn = document.getElementById("generate-summary-btn");

// Click Event Listeners

AddCategoryBtn.addEventListener("click", add_Category);

CategoriesContainer.addEventListener("click", Check_DeleteCategoryBtn);

CategoriesContainer.addEventListener("click", Check_AddExpenseBtn);

CategoriesContainer.addEventListener("click", Check_DeleteExpenseBtn); 

CategoriesContainer.addEventListener('input', Check_ExpenseInputChange);

CategoriesContainer.addEventListener('change', Check_ExpenseInputChange);

GenerateSummaryBtn.addEventListener("click", generateSummary);

// Load data from localStorage on page load
window.addEventListener('DOMContentLoaded', loadFromLocalStorage);

// Check Action functions

function Check_DeleteCategoryBtn(e){
    if (e.target && e.target.classList.contains("delete-category-btn")) {
        remove_Category(e);
    }
}

function Check_AddExpenseBtn(e) {
    if (e.target && e.target.classList.contains("add-expense-btn")) {
        add_Expense(e);
    }
}

function Check_DeleteExpenseBtn(e){
    if (e.target && e.target.classList.contains("delete-expense-btn")) {
        remove_Expense(e);
    }
}

function Check_ExpenseInputChange(e){
    if (e.target.classList.contains('expense-amount') || 
        e.target.classList.contains('expense-frequency-frame') || 
        e.target.classList.contains('expense-frequency')) {
        const expense = e.target.closest('.expense');
        const categoryCard = expense.closest('.category-card');
        calcMonthlyImpact(categoryCard);
        saveToLocalStorage();
    }
}

// Hover Event Listeners

CategoriesContainer.addEventListener('mouseenter', add_CardButtons, true);

CategoriesContainer.addEventListener('mouseleave', remove_CardButtons, true);

CategoriesContainer.addEventListener('mouseenter', add_DeleteExpenseBtn, true);

CategoriesContainer.addEventListener('mouseleave', remove_DeleteExpenseBtn, true);



// Click Handler Functions

function add_Category(){
    let newCategory = document.createElement("div");
    CategoriesContainer.appendChild(newCategory);
    newCategory.outerHTML = categoryCardTemplate;
    saveToLocalStorage();
}

function remove_Category(e){
    const clickedButton = e.target;
    const card = clickedButton.closest('.category-card');
    if (card) {
      card.remove();
      saveToLocalStorage();
    }
}

function add_Expense(e){
    const clickedButton = e.target;
    const parentCard = clickedButton.closest('.category-card');
    const expenseList = parentCard.querySelector('.expense-list');
    const newExpense = document.createElement("div");
    expenseList.appendChild(newExpense);
    newExpense.outerHTML = expenseTemplate;
    
    // Calculate impact after adding
    calcMonthlyImpact(parentCard);
    saveToLocalStorage();
}

function remove_Expense(e){
    const clickedButton = e.target;
    const expense = clickedButton.closest('.expense');
    const parentCard = expense.closest('.category-card');
    if (expense) {
      expense.remove();
      // Recalculate after removing
      calcMonthlyImpact(parentCard);
      saveToLocalStorage();
    }
}

// Hover Handler functions

function add_CardButtons(e){
  if (e.target.classList.contains('category-card')) {
    if (!e.target.querySelector('.card-buttons')) {
      let CardButtons = document.createElement("div");
      e.target.appendChild(CardButtons);
      CardButtons.outerHTML = CardButtonsTemplate;
    }
  }
}

function remove_CardButtons(e){
  if (e.target.classList.contains('category-card')) {
    let buttons = e.target.querySelector('.card-buttons');
    if (buttons) {
      buttons.remove();
    }
  }
}


function add_DeleteExpenseBtn(e){
    if (e.target.classList.contains('expense')) {
    let deleteExpenseBtn = document.createElement("button");
    e.target.appendChild(deleteExpenseBtn);
    deleteExpenseBtn.outerHTML = deleteExpenseBtnTemplate;
  }
}

function remove_DeleteExpenseBtn(e) {
  if (e.target.classList.contains('expense')) {
    let button = e.target.querySelector('.delete-expense-btn');
    if (button) {
      button.remove();
    }
  }
};

// Expense Evaluation Functions

function calcMonthlyImpact(categoryCard){
  // Get all expenses in this category
  const expenseList = categoryCard.querySelector('.expense-list');
  const expenses = expenseList.querySelectorAll('.expense');
  
  let totalMonthlyImpact = 0;
  
  expenses.forEach(expense => {
    // Get expense values
    const amountInput = expense.querySelector('.expense-amount');
    const frequencyFrameSelect = expense.querySelector('.expense-frequency-frame');
    const frequencyNumberInput = expense.querySelector('.expense-frequency');
    
    // Parse values
    const amount = parseFloat(amountInput.value) || 0;
    const frequencyFrame = frequencyFrameSelect.value;
    const frequencyNumber = parseInt(frequencyNumberInput.value) || 1;
    
    // Calculate monthly equivalent based on frequency frame
    let monthlyAmount = 0;
    
    switch(frequencyFrame) {
      case 'days':
        monthlyAmount = (amount * 365) / (12 * frequencyNumber);
        break;
      case 'weeks':
        monthlyAmount = (amount * 52) / (12 * frequencyNumber);
        break;
      case 'months':
        monthlyAmount = amount / frequencyNumber;
        break;
      case 'years':
        monthlyAmount = amount / (12 * frequencyNumber);
        break;
    }
    
    totalMonthlyImpact += monthlyAmount;
  });
  
  // Update the impact amount display
  const impactAmount = categoryCard.querySelector('.impact-amount');
  impactAmount.textContent = totalMonthlyImpact.toFixed(2);
}

// LocalStorage Functions

function saveToLocalStorage(){
    const categoryCards = document.querySelectorAll('.category-card');
    const allData = [];
    
    categoryCards.forEach(card => {
        const categoryName = card.querySelector('.category-name').value;
        const expenses = [];
        
        card.querySelectorAll('.expense').forEach(expense => {
            expenses.push({
                name: expense.querySelector('.expense-name').value,
                amount: expense.querySelector('.expense-amount').value,
                frequencyFrame: expense.querySelector('.expense-frequency-frame').value,
                frequency: expense.querySelector('.expense-frequency').value
            });
        });
        
        allData.push({
            categoryName: categoryName,
            expenses: expenses
        });
    });
    
    localStorage.setItem('moneyPinsData', JSON.stringify(allData));
}

function loadFromLocalStorage(){
    const savedData = localStorage.getItem('moneyPinsData');
    
    if (savedData) {
        try {
            const allData = JSON.parse(savedData);
            
            allData.forEach(categoryData => {
                // Add category
                let newCategory = document.createElement("div");
                CategoriesContainer.appendChild(newCategory);
                newCategory.outerHTML = categoryCardTemplate;
                
                // Get the newly created card
                const newCard = CategoriesContainer.lastElementChild;
                
                // Set category name
                newCard.querySelector('.category-name').value = categoryData.categoryName;
                
                // Add expenses
                categoryData.expenses.forEach(expenseData => {
                    const expenseList = newCard.querySelector('.expense-list');
                    const newExpense = document.createElement("div");
                    expenseList.appendChild(newExpense);
                    newExpense.outerHTML = expenseTemplate;
                    
                    // Set expense values
                    const expense = expenseList.lastElementChild;
                    expense.querySelector('.expense-name').value = expenseData.name;
                    expense.querySelector('.expense-amount').value = expenseData.amount;
                    expense.querySelector('.expense-frequency-frame').value = expenseData.frequencyFrame;
                    expense.querySelector('.expense-frequency').value = expenseData.frequency;
                });
                
                // Calculate monthly impact for the card
                calcMonthlyImpact(newCard);
            });
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
        }
    }
}

// Summary Functions

function generateSummary(){
    // Get all category cards
    const categoryCards = document.querySelectorAll('.category-card');
    
    // Create summary data
    let totalMonthlyImpact = 0;
    const summaryData = [];
    
    categoryCards.forEach(card => {
        const categoryName = card.querySelector('.category-name').value || 'Unnamed Category';
        const impactAmount = parseFloat(card.querySelector('.impact-amount').textContent);
        
        summaryData.push({
            name: categoryName,
            amount: impactAmount
        });
        
        totalMonthlyImpact += impactAmount;
    });
    
    // Check if summary already exists, if so remove it
    const existingSummary = document.querySelector('#summary');
    if (existingSummary) {
        existingSummary.remove();
    }
    
    // Create summary section
    let summarySection = document.createElement("section");
    document.body.appendChild(summarySection);
    summarySection.outerHTML = summaryTemplate;
    
    // Populate summary items
    const summaryItemsContainer = document.querySelector('.summary-items');
    summaryData.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'summary-item';
        itemDiv.innerHTML = `
            <span class="summary-item-name">${item.name}</span>
            <span class="summary-item-amount">$${item.amount.toFixed(2)}</span>
        `;
        summaryItemsContainer.appendChild(itemDiv);
    });
    
    // Update total amount
    const summaryAmount = document.querySelector('.summary-amount');
    summaryAmount.textContent = `$${totalMonthlyImpact.toFixed(2)}`;
    
    // Load Google Charts and create chart
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(() => drawChart(summaryData));
    
    // Scroll to summary section
    setTimeout(() => {
        document.getElementById('summary').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

function drawChart(summaryData) {
    // Prepare data for Google Charts
    const data = google.visualization.arrayToDataTable([
        ['Category', 'Monthly Impact'],
        ...summaryData.map(item => [item.name, item.amount])
    ]);
    
    const options = {
        title: 'Monthly Spending by Category',
        pieHole: 0.4,
        colors: ['#61C9A8', '#4C3B4D', '#A53860', '#FFEEDB', '#00008B', '#FFA500', '#FF6347', '#32CD32'],
        legend: { position: 'bottom' }
    };
    
    const chart = new google.visualization.PieChart(document.querySelector('.summary-chart'));
    chart.draw(data, options);
}




