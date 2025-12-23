import os
import uvicorn
import base64
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

# LangChain Imports
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Custom Services
from llm_service import llm, embeddings
from search_service import search_web
from scraper_service import scrape_article
from ocr_service import extract_text_from_image, extract_text_from_url_image

app = FastAPI(title="Factify Advanced RAG Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Vector Store: FAISS (InMemory)
# Kept for generic query endpoint support
vector_store = None
if embeddings:
    try:
        texts = ["Factify is a fake news detection app.", "It uses AI to verify news."]
        vector_store = FAISS.from_texts(texts, embeddings)
        print("Vector Store Initialized")
    except Exception as e:
        print(f"Warning: Failed to create Vector Store: {e}")

# -- Data Models --
class AnalysisRequest(BaseModel):
    type: str = "text" # "text", "url", "image"
    content: str # Raw text, URL, or Base64 string
    preprocessing: str = "none"

class AnalysisResponse(BaseModel):
    verdict: str
    confidence_score: float
    explanation: str
    sources: List[str]

class QueryRequest(BaseModel):
    question: str

# -- Helper Logic --
def process_input(request: AnalysisRequest) -> str:
    """Handles Text, URL, or Image input based on 'type' field."""
    processed_content = ""
    
    print(f"Processing Request Type: {request.type}")
    
    if request.type == "url":
        processed_content = scrape_article(request.content)
        if not processed_content:
            processed_content = extract_text_from_url_image(request.content)
            
    elif request.type == "image":
        print("Processing Base64 Image...")
        try:
            # Content should be base64 string
            image_bytes = base64.b64decode(request.content)
            processed_content = extract_text_from_image(image_bytes)
            if not processed_content:
                print("[RAG ERROR] OCR returned empty - Tesseract may not be installed or image has no text")
        except Exception as e:
            print(f"Image Decode Error: {e}")
            
    elif request.type == "text":
        processed_content = request.content
        
    else:
        raise HTTPException(status_code=400, detail=f"Invalid type: {request.type}")
    
    # Validation
    if not processed_content:
        error_msg = "Could not extract content from input."
        if request.type == "image":
            error_msg = "Could not extract text from image. Please ensure Tesseract-OCR is installed, or the image contains readable text."
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Preprocessing
    if request.preprocessing == "clean":
        processed_content = processed_content.replace("\n", " ").strip()
        
    return processed_content

@app.get("/")
def read_root():
    return {
        "status": "active", 
        "service": "Factify Advanced RAG Service", 
        "llm_status": "ready" if llm else "missing_key"
    }

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_news(request: AnalysisRequest):
    print(f"\n[RAG DEBUG] ========== NEW ANALYSIS REQUEST ==========")
    print(f"[RAG DEBUG] Request type: {request.type}")
    print(f"[RAG DEBUG] Content preview: {request.content[:100] if len(request.content) < 500 else f'{request.content[:100]}... (Base64 length: {len(request.content)})'}")
    print(f"[RAG DEBUG] Preprocessing: {request.preprocessing}")
    
    if not llm:
        print("[RAG ERROR] LLM not initialized!")
        raise HTTPException(status_code=500, detail="LLM not configured. Check keys.")

    # 1. Pipeline Step: Process Input
    print("[RAG DEBUG] Step 1: Processing input...")
    main_text = process_input(request)
    if not main_text:
        print("[RAG ERROR] No content extracted from input")
        raise HTTPException(status_code=400, detail="No content found to analyze.")
    
    print(f"[RAG DEBUG] Extracted content length: {len(main_text)} chars")
    print(f"[RAG DEBUG] Content preview: {main_text[:200]}")

    # 2. Pipeline Step: Generate Smart Search Query
    # Use LLM to extract the key claim and create a verification-focused query
    query_prompt = """Extract the main factual claim from this text and create a verification search query.
Focus on: names, dates, events, awards, winners, statistics, or any verifiable facts.
Add keywords like "who won", "winner", "official", or the actual subject to verify the claim.

Text: {text}

Return ONLY the search query, nothing else. Example: "Ballon d'Or 2023 winner official"
"""
    try:
        query_chain = ChatPromptTemplate.from_template(query_prompt) | llm | StrOutputParser()
        search_query = query_chain.invoke({"text": main_text[:500]}).strip().strip('"')
    except Exception as e:
        print(f"[RAG DEBUG] Query generation failed, using fallback: {e}")
        search_query = main_text[:200].replace("\n", " ")
    
    print(f"[RAG DEBUG] Step 2: Searching web for: {search_query}...")
    search_results = search_web(search_query, num_results=5)
    print(f"[RAG DEBUG] Search returned {len(search_results) if isinstance(search_results, list) else 0} results")
    
    # 3. Pipeline Step: Prepare RAG Context (Evidence)
    print("[RAG DEBUG] Step 3: Preparing evidence context...")
    context_text = "Search Results:\n"
    source_urls = []
    
    if isinstance(search_results, list):
        for res in search_results:
            title = res.get('title', 'Unknown Source')
            link = res.get('link', '#')
            snippet = res.get('snippet', '')
            context_text += f"- Source: {title} ({link})\n  Content: {snippet}\n\n"
            source_urls.append(link)
    else:
        context_text += str(search_results)

    # 4. Pipeline Step: Verify (LLM)
    prompt_template = """
    You are an expert Fact-Checker. Your job is to verify claims against evidence.

    CLAIM TO VERIFY:
    {news_content}

    EVIDENCE FROM WEB SEARCH:
    {evidence}

    STEP-BY-STEP VERIFICATION:
    
    Step 1: Extract the EXACT claim being made.
    - Pay attention to NEGATIONS: words like "not", "never", "isn't", "wasn't", "doesn't"
    - Example: "X is NOT the richest" means the claim is that X is NOT #1
    - Example: "X is the richest" means the claim is that X IS #1
    
    Step 2: Find the ACTUAL FACT in the evidence.
    - What do the sources say about this topic?
    - Who/what does the evidence say is the actual answer?
    
    Step 3: Compare the claim to the fact.
    - If claim says "X is Y" and evidence confirms "X is Y" → verdict is "Real"
    - If claim says "X is Y" but evidence says "X is NOT Y" or "Z is Y" → verdict is "Fake"
    - If claim says "X is NOT Y" and evidence confirms "X is NOT Y" → verdict is "Real"
    - If claim says "X is NOT Y" but evidence says "X IS Y" → verdict is "Fake"

    CONFIDENCE SCORES (use ONLY these values):
    - 95: Evidence clearly and directly proves/disproves the exact claim
    - 85: Multiple sources agree on the verdict
    - 75: Strong evidence from reliable sources
    - 65: Good evidence from one source
    - 50: Mixed or unclear evidence
    - 35: Weak evidence
    - 20: No relevant evidence

    OUTPUT (JSON only, no markdown):
    {{
        "verdict": "Real" or "Fake",
        "confidence_score": 95,
        "explanation": "The claim states [exact claim]. The evidence shows [actual fact from sources]. Therefore this is [Real/Fake]."
    }}
    """
    
    prompt = ChatPromptTemplate.from_template(prompt_template)
    chain = prompt | llm | StrOutputParser()
    
    try:
        print("[RAG DEBUG] Step 4: Invoking LLM for fact-checking...")
        # Generate Raw Response
        raw_response = chain.invoke({
            "news_content": main_text[:3000], # Truncate to fit context
            "evidence": context_text
        })
        
        print(f"[RAG DEBUG] LLM raw response: {raw_response[:200]}...")

        # Parse output (Simple heuristic parsing or JSON)
        # For robustness, we'll try to extract JSON or fallback
        import json
        import re
        
        print("[RAG DEBUG] Parsing LLM output...")
        # specific logic to find JSON in markdown block
        json_match = re.search(r'\{.*\}', raw_response, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group())
            print(f"[RAG DEBUG] Parsed verdict: {data.get('verdict')}")
            print(f"[RAG DEBUG] Parsed confidence: {data.get('confidence_score')}")
            print(f"[RAG DEBUG] ========== REQUEST COMPLETE ==========\n")
            return AnalysisResponse(
                verdict=data.get("verdict", "Unknown"),
                confidence_score=float(data.get("confidence_score", 0)),
                explanation=data.get("explanation", "No explanation provided."),
                sources=source_urls # Return the actual URLs found
            )
        else:
            # Fallback if LLM didn't output JSON
            print("[RAG WARNING] Could not parse JSON from LLM response, using fallback")
            print(f"[RAG DEBUG] ========== REQUEST COMPLETE (FALLBACK) ==========\n")
            return AnalysisResponse(
                verdict="Unknown",
                confidence_score=0.0,
                explanation=raw_response,
                sources=[]
            )

    except Exception as e:
        print(f"Verification Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def read_root():
    return {"status": "Factify Advanced RAG System Online"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3002)
