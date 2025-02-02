// Array to store quotes and categories
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById('quoteDisplay').innerText = `"${quote.text}" - ${quote.category}`;
}

// Function to create and display the Add Quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// Function to add a new quote dynamically
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    showRandomQuote();
    
    // Send new quote to server
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newQuote),
    })
    .then(response => response.json())
    .then(data => console.log('Quote saved to server:', data))
    .catch(error => console.error('Error saving quote:', error));
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Function to populate category filter dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = Array.from(new Set(quotes.map(quote => quote.category)));
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
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
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  displayQuotes(filteredQuotes);
  localStorage.setItem('selectedCategory', selectedCategory);
}

// Function to display filtered quotes
function displayQuotes(quotesToDisplay) {
  const quoteContainer = document.getElementById('quoteDisplay');
  quoteContainer.innerHTML = '';
  quotesToDisplay.forEach(quote => {
    const quoteElement = document.createElement('p');
    quoteElement.textContent = `"${quote.text}" - ${quote.category}`;
    quoteContainer.appendChild(quoteElement);
  });
}

// Function to fetch quotes from a mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    const serverQuotes = data.map(item => ({ text: item.title, category: 'Server' }));
    quotes = [...quotes, ...serverQuotes];
    saveQuotes();
    populateCategories();
    alert('Server quotes synced successfully!');
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    alert('Failed to sync with server.');
  }
}

// Function to export quotes as JSON
function exportQuotesAsJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to sync quotes with server periodically
async function syncQuotes() {
  await fetchQuotesFromServer();
  console.log("Quotes synced with server!");
  alert("Quotes synced with server!");
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

document.addEventListener('DOMContentLoaded', () => {
  createAddQuoteForm();
  populateCategories();
  showRandomQuote();
  filterQuotes();
  fetchQuotesFromServer();
  setInterval(syncQuotes, 60000); // Sync quotes every 60 seconds
});
