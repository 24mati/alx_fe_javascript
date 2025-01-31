const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
  ];
  
  function updateCategoryOptions() {
    const categorySelect = document.getElementById("categorySelect");
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
    const selectedCategory = document.getElementById("categorySelect").value;
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
    if (filteredQuotes.length === 0) {
      document.getElementById("quoteDisplay").textContent = "No quotes available for this category.";
      return;
    }
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    document.getElementById("quoteDisplay").textContent = randomQuote.text;
  }
  
  function addQuote() {
    const newText = document.getElementById("newQuoteText").value.trim();
    const newCategory = document.getElementById("newQuoteCategory").value.trim();
    if (newText && newCategory) {
      quotes.push({ text: newText, category: newCategory });
      updateCategoryOptions();
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      alert("Quote added successfully!");
    } else {
      alert("Please enter both a quote and a category.");
    }
  }
  
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.querySelector("button[onclick='addQuote()']").addEventListener("click", addQuote);
  updateCategoryOptions();
  