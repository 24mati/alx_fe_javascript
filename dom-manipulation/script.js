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
      updateCategoryOptions();
      alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuote")?.addEventListener("click", showRandomQuote);
  document.getElementById("addQuoteButton")?.addEventListener("click", addQuote);
  document.getElementById("exportQuotes")?.addEventListener("click", exportToJsonFile);
  
  updateCategoryOptions();
  
  const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastViewedQuote) {
      document.getElementById("quoteDisplay").textContent = lastViewedQuote;
  }
});
