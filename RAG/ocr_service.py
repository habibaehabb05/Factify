import pytesseract
from PIL import Image
import io
import requests

# NOTE: Tesseract must be installed on the system for this to work.
# If not found, we might need a fallback or clear error message.
# Windows typical path: C:\Program Files\Tesseract-OCR\tesseract.exe
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_image(image_data: bytes) -> str:
    """
    Extracts text from raw image bytes using OCR.
    """
    try:
        image = Image.open(io.BytesIO(image_data))
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        print(f"OCR Error: {e}")
        return ""

def extract_text_from_url_image(url: str) -> str:
    """
    Downloads image from URL and extracts text.
    """
    try:
        response = requests.get(url, timeout=10)
        return extract_text_from_image(response.content)
    except Exception as e:
        print(f"Image Download Error: {e}")
        return ""

if __name__ == "__main__":
    print("--- Testing OCR Service ---")
    
    # Test with a sample image URL (news screenshot)
    test_url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgmcXq7JG8y4Rk3GPqOSxlgR6R7S--gJogkQ&s"
    
    print(f"\nTest 1: OCR from URL")
    print(f"URL: {test_url}")
    print("Extracting text...")
    
    text = extract_text_from_url_image(test_url)
    
    if text:
        print(f"\nExtracted Text:\n{text}")
    else:
        print("\nNo text extracted or extraction failed.")
        print("\nNote: Tesseract-OCR must be installed on your system.")
        print("Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki")
        print("After installation, add Tesseract to PATH or uncomment the path in this file.")

