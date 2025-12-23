import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings

load_dotenv()

def get_llm():
    try:
        # Temperature=0 for deterministic, consistent outputs
        llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0)
        print("LLM Initialized: Groq (Llama 3.3) with temperature=0")
        return llm
    except Exception as e:
        print(f"Warning: LLM not initialized. Check GROQ_API_KEY. Error: {e}")
        return None

def get_embeddings():
    try:
        embeddings = HuggingFaceInferenceAPIEmbeddings(
            api_key=os.getenv("HUGGINGFACEHUB_API_TOKEN"),
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        print("Embeddings Initialized: HuggingFace Inference API")
        return embeddings
    except Exception as e:
        print(f"Warning: Embeddings not initialized. Check HUGGINGFACEHUB_API_TOKEN. Error: {e}")
        return None

# Initialize Singletons
llm = get_llm()
embeddings = get_embeddings()
