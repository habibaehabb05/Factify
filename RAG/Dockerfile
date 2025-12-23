# Base Image
FROM python:3.9-slim

# Install System Dependencies (Tesseract OCR)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

# Set Working Directory
WORKDIR /app

# Copy Requirements
COPY requirements.txt .

# Install Python Dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy Application Code
COPY . .

# Expose Port
EXPOSE 8000

# Start Command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
