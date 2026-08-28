interface Expense {
  id: string;
  name: string;
  amount: number;
  createdAt: number;
}
class ExpenseTracker {
  private expenses: Expense[] = [];
  addExpense(name: string, amount: number): Expense {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error("Expense name likhna zaroori hai.");
    }
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Sahi amount likhen (0 se zyada).");
    }
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      name: trimmedName,
      amount,
      createdAt: Date.now(),
    };
    this.expenses.unshift(newExpense);
    return newExpense;
  }
  deleteExpense(id: string): boolean {
    const lengthBefore = this.expenses.length;
    this.expenses = this.expenses.filter((exp) => exp.id !== id);
    return this.expenses.length < lengthBefore;
  }
  getTotal(): number {
    return this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }
  getExpenses(): Expense[] {
    return [...this.expenses];
  }
  getCount(): number {
    return this.expenses.length;
  }
}
const form = document.getElementById("expense-form") as HTMLFormElement;
const nameInput = document.getElementById("expense-name") as HTMLInputElement;
const amountInput = document.getElementById("expense-amount") as HTMLInputElement;
const errorMsg = document.getElementById("error-msg") as HTMLParagraphElement;
const listEl = document.getElementById("expense-list") as HTMLUListElement;
const totalEl = document.getElementById("total-amount") as HTMLSpanElement;
const countEl = document.getElementById("entry-count") as HTMLParagraphElement;

const tracker = new ExpenseTracker();
function formatCurrency(value: number): string {
  return `Rs ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
function render(): void {
  const expenses = tracker.getExpenses();
  totalEl.textContent = formatCurrency(tracker.getTotal());
  countEl.textContent = `${tracker.getCount()} ${
    tracker.getCount() === 1 ? "entry" : "entries"
  }`;
  listEl.innerHTML = "";
  if (expenses.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = "Abhi koi expense add nahi hua.";
    listEl.appendChild(emptyState);
    return;
  }
  expenses.forEach((exp) => {
    const li = document.createElement("li");
    li.className = "expense-item";
    const info = document.createElement("div");
    const nameEl = document.createElement("p");
    nameEl.className = "expense-name";
    nameEl.textContent = exp.name;

    const dateEl = document.createElement("p");
    dateEl.className = "expense-date";
    dateEl.textContent = new Date(exp.createdAt).toLocaleDateString();
    info.appendChild(nameEl);
    info.appendChild(dateEl);
    const right = document.createElement("div");
    right.className = "expense-right";
    const amountEl = document.createElement("span");
    amountEl.className = "expense-amount";
    amountEl.textContent = formatCurrency(exp.amount);
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.setAttribute("aria-label", `Delete ${exp.name}`);
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", () => {
      tracker.deleteExpense(exp.id);
      render();
    });
    right.appendChild(amountEl);
    right.appendChild(deleteBtn);
    li.appendChild(info);
    li.appendChild(right);
    listEl.appendChild(li);
  });
}
form.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  errorMsg.textContent = "";
  const name = nameInput.value;
  const amount = parseFloat(amountInput.value);
  try {
    tracker.addExpense(name, amount);
    nameInput.value = "";
    amountInput.value = "";
    nameInput.focus();
    render();
  } catch (err) {
    errorMsg.textContent = err instanceof Error ? err.message : "Kuch ghalat hua.";
  }
});
render();
