from langchain_community.tools import DuckDuckGoSearchRun
from langchain_community.utilities import DuckDuckGoSearchAPIWrapper

def search_web(query: str, num_results: int = 5) -> list:
    """
    Performs a web search using DuckDuckGo and returns list of dicts:
    [{'title': ..., 'link': ..., 'snippet': ...}]
    """
    try:
        wrapper = DuckDuckGoSearchAPIWrapper(max_results=num_results)
        # Using the wrapper directly gives structured data
        results = wrapper.results(query, max_results=num_results)
        return results 
    except Exception as e:
        print(f"Search Error: {e}")
        return []

if __name__ == "__main__":
    print("--- Testing Search Service ---")
    test_query = "Latest AI Technology"
    print(f"Query: {test_query}")
    
    results = search_web(test_query)
    
    if results:
        print(f"\nFound {len(results)} results:")
        for i, res in enumerate(results, 1):
            print(f"\n[{i}] {res.get('title', 'No Title')}")
            print(f"    Link: {res.get('link', 'No Link')}")
            print(f"    Snippet: {res.get('snippet', 'No Snippet')[:100]}...")
    else:
        print("\nNo results found or search failed.")
