import requests
from bs4 import BeautifulSoup

def scrape_article(url: str) -> str:
    """
    Fetches the main text content from a news article URL.
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Basic heuristic: get all paragraph text
        # In a real system, use something like newspaper3k for better extraction
        paragraphs = soup.find_all('p')
        text = ' '.join([p.get_text() for p in paragraphs])
        
        return text.strip()[:10000] # Limit length to avoid token limits
    except Exception as e:
        print(f"Scraping Error: {e}")
        return ""
