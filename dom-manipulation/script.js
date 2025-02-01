// Array to store quotes and categories
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from localStorage
function loadQuotes() {
  const savedQuotes = JSON.parse(localStorage.getItem('quotes'));
  if (savedQuotes) {
    quotes = savedQuotes;
  }
}

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById('quoteDisplay').innerText = `"${quote.text}" - ${quote.category}`;
}

// Function to add a new quote dynamically
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();  // Save to localStorage
    populateCategories(); // Update categories dropdown
    showRandomQuote(); // Show the newly added quote
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Function to populate the category filter dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = Array.from(new Set(quotes.map(quote => quote.category)));
  
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';  // Reset filter options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);
  displayQuotes(filteredQuotes);
  
  // Save the selected category in localStorage
  localStorage.setItem('selectedCategory', selectedCategory);
}

// Function to display filtered quotes
function displayQuotes(quotesToDisplay) {
  const quoteContainer = document.getElementById('quoteDisplay');
  quoteContainer.innerHTML = ''; // Clear current quotes
  
  quotesToDisplay.forEach(quote => {
    const quoteElement = document.createElement('p');
    quoteElement.textContent = `"${quote.text}" - ${quote.category}`;
    quoteContainer.appendChild(quoteElement);
  });
}

// Function to load the last selected category from localStorage
function loadLastSelectedCategory() {
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    document.getElementById('categoryFilter').value = savedCategory;
    filterQuotes(); // Apply saved filter
  }
}

// Function to export quotes to JSON
function exportToJson() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();  // Update categories dropdown
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Simulating server fetch and sync with local data
function fetchQuotesFromServer() {
  fetch('https://jsonplaceholder.typicode.com/posts')  // Simulate fetching quotes from a mock API
    .then(response => response.json())
    .then(data => {
      // Assuming the fetched data is an array of quote objects
      const serverQuotes = data.map(item => ({
        text: item.title,  // Using post title as quote text
        category: 'Server' // Assigning a default category "Server"
      }));
      
      // Merge server data with local data
      quotes = [...quotes, ...serverQuotes];
      saveQuotes(); // Update localStorage
      populateCategories(); // Update categories dropdown
      alert('Server quotes synced successfully!');
    })
    .catch(error => {
      console.error("Error fetching quotes from server:", error);
      alert('Failed to sync with server.');
    });
}

// Conflict resolution UI (optional)
function resolveConflict() {
  const userChoice = confirm("A conflict occurred. Do you want to keep your local data?");
  if (userChoice) {
    // Keep local data
    alert("Keeping your local data.");
  } else {
    // Use server data
    fetchQuotesFromServer();
  }
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initial Load
loadQuotes();
populateCategories();
loadLastSelectedCategory();
filterQuotes();
