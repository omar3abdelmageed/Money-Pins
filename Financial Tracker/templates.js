export const categoryCardTemplate = 

`<div class="category-card">

    <div class="card-header">

        <input type="text" class="category-name" placeholder="New Card">

        <span class="impact">

            <h3 class="impact-text">Monthly Impact:</h3>

            <h3 class="impact-amount">0.00</h3>

        </span>

    </div>

    <div class="expense-container">

        <ul class="expense-list">
            <!-- Expenses will be added here -->
        </ul>

    </div>

</div>`;

export const CardButtonsTemplate =

`<div class= "card-buttons">

    <button class="add-expense-btn">Add Expense</button>

    <button class="delete-category-btn">Delete Category</button>

</div>`;

export const expenseTemplate =

`<li class="expense">

    <div class="row-one">
        <input type="text" class="expense-name" placeholder="Expense">

        <input type="number" class="expense-amount" placeholder="0.00" min="0">
    </div>

    <div class="row-two">

        <select class="expense-frequency-frame" name="frame">

            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months" selected="selected">Months</option>
            <option value="years">Years</option>

        </select>

        <input type="number" class="expense-frequency" min="1" value="1">

    </div>

</li>`;


export const deleteExpenseBtnTemplate =

`<button class="delete-expense-btn">Remove</button>`;


export const summaryTemplate =

`<section id="summary">
    
    <div id="summary-title">
        <h2>Summary</h2>
    </div>

    <div id="summary-details">

        <div class="summary-card">

            <h3>Total Monthly Impact:</h3>

            <div class="summary-items">

            </div>

            <h3 class="summary-amount">0.00</h3>

        </div>

        <div class="summary-chart">

        </div>

    </div>

</section>`