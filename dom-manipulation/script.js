const quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function updateCategoryOptions() {
  const categorySelect = document.getElementById("categorySelect");
  if (!categorySelect) return;
  categorySelect.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
  });
}

function showRandomQuote() {
  const selectedCategory = document.getElementById("categorySelect")?.value || "all";
  const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
  if (filteredQuotes.length === 0) {
      document.getElementById("quoteDisplay").textContent = "No quotes available for this category.";
      return;
  }
  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById("quoteDisplay").textContent = randomQuote.text;
  sessionStorage.setItem("lastViewedQuote", randomQuote.text);
}

function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();
  if (newText && newCategory) {
      quotes.push({ text: newText, category: newCategory });
      saveQuotes();
      updateCategoryOptions();
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      alert("Quote added successfully!");
  } else {
      alert("Please enter both a quote and a category.");
  }
}

// ✅ Ensure this function is included and doesn't conflict
function createAddQuoteForm() {
  if (document.getElementById("addQuoteForm")) return; // Prevent duplicate forms

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

function exportToJsonFile() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const downloadAnchor = document.createElement("a");
  downloadAnchor.href = url;
  downloadAnchor.download = "quotes.json";
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  
  URL.revokeObjectURL(url);
  document.body.removeChild(downloadAnchor);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
      try {
          const importedQuotes = JSON.parse(event.target.result);
          if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON format.");
          quotes.push(...importedQuotes);
          saveQuotes();
          updateCategoryOptions();
          alert("Quotes imported successfully!");
      } catch (error) {
          alert("Error importing quotes: Invalid JSON format.");
      }
  };
  fileReader.readAsText(event.target.files[0]);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuote")?.addEventListener("click", showRandomQuote);
  document.getElementById("addQuoteButton")?.addEventListener("click", addQuote);
  document.getElementById("exportQuotes")?.addEventListener("click", exportToJsonFile);
  
  createAddQuoteForm(); // ✅ Ensure this is included
  updateCategoryOptions();
  
  const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastViewedQuote) {
      document.getElementById("quoteDisplay").textContent = lastViewedQuote;
  }
});
