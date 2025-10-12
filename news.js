const container = document.getElementById("news-container");

// ✅ Using your NewsAPI key
const API_KEY = "886c98cf66ee4ad8a577cffdcd20c24e";
const API_URL = `https://newsapi.org/v2/everything?q=finance%20OR%20investment%20OR%20stock%20market&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`;

async function fetchFinancialNews() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network issue");

    const data = await response.json();
    container.innerHTML = "";

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = `<p style="text-align:center;">No financial news available at the moment.</p>`;
      return;
    }

    data.articles.forEach(article => {
      const card = document.createElement("div");
      card.classList.add("news-card");

      const image = article.urlToImage || "https://via.placeholder.com/320x180?text=Finance+News";
      const title = article.title || "Untitled Article";
      const description = article.description
        ? article.description.slice(0, 120) + "..."
        : "Read the full article for details.";
      const source = article.source?.name || "Unknown Source";
      const date = article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString()
        : "N/A";

      card.innerHTML = `
        <img src="${image}" alt="News Image" />
        <div class="news-content">
          <h3>${title}</h3>
          <p>${description}</p>
          <div class="news-meta">
            <span>${source}</span>
            <span>${date}</span>
          </div>
          <a href="${article.url}" target="_blank" class="read-more">Read More</a>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching financial news:", error);
    container.innerHTML = `<p style="color:red;text-align:center;">Failed to load news. Please try again later.</p>`;
  }
}

fetchFinancialNews();
