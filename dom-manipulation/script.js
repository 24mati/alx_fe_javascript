const quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
];

// ✅ Save quotes & selected category
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function saveSelectedCategory(category) {
  localStorage.setItem("selectedCategory", category);
}

// ✅ Populate categories dynamically
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  if (!categorySelect) return;

  categorySelect.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
  });

  // ✅ Restore last selected filter
  const lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";
  categorySelect.value = lastSelectedCategory;
}

// ✅ Show a random quote
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter")?.value || "all";
  const filteredQuotes = selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
      document.getElementById("quoteDisplay").textContent = "No quotes available for this category.";
      return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById("quoteDisplay").textContent = randomQuote.text;
  sessionStorage.setItem("lastViewedQuote", randomQuote.text);
}

// ✅ Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  saveSelectedCategory(selectedCategory); // Store the user's filter preference

  const filteredQuotes = selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = filteredQuotes.length
      ? filteredQuotes.map(q => `<p>${q.text}</p>`).join("")
      : "<p>No quotes available for this category.</p>";
}

// ✅ Add new quotes and update categories
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText && newCategory) {
      quotes.push({ text: newText, category: newCategory });
      saveQuotes();
      populateCategories();  // Update the category dropdown in real-time
      filterQuotes();        // Refresh the displayed quotes

      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      alert("Quote added successfully!");
  } else {
      alert("Please enter both a quote and a category.");
  }
}

// ✅ Ensure form exists only once
function createAddQuoteForm() {
  if (document.getElementById("addQuoteForm")) return;

  const formContainer = document.createElement("div");
  formContainer.id = "addQuoteForm";
  formContainer.innerHTML = `
      <h2>Add a New Quote</h2>
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button id="addQuoteButton">Add Quote</button>
  `;
  document.body.appendChild(formContainer);

  document.getElementById("addQuoteButton").addEventListener("click", addQuote);
}

// ✅ Import & Export JSON
function exportToJsonFile() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "quotes.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Ensure filtering & random quotes work on page load
document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm();
  populateCategories();
  filterQuotes();

  document.getElementById("newQuote")?.addEventListener("click", showRandomQuote);
  document.getElementById("categoryFilter")?.addEventListener("change", filterQuotes);
});
