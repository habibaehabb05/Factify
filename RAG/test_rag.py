import requests
import json

def test_analyze_endpoint():
    url = "http://localhost:3002/analyze"
    
    # Test Case 1: Text Input
    payload = {
        "text": "The earth is flat and the government is hiding the truth.",
        "preprocessing": "clean"
    }
    
    print(f"Testing RAG Service at {url}...")
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        print("\n--- Analysis Result ---")
        print(f"Verdict: {data.get('verdict')}")
        print(f"Confidence: {data.get('confidence_score')}%")
        print(f"Explanation: {data.get('explanation')}")
        print(f"Sources: {data.get('sources')}")
        
        assert "verdict" in data
        assert "confidence_score" in data
        assert "explanation" in data
        print("\nTest Passed Successfully!")
        
    except requests.exceptions.ConnectionError:
        print("\nError: Could not connect to RAG Service. Is it running on port 3002?")
    except Exception as e:
        print(f"\nTest Failed: {e}")

if __name__ == "__main__":
    test_analyze_endpoint()
