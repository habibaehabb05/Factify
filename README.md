# Factify: AI-Powered Fake News Detection System

![Factify Logo](client/public/logo.png)

## 📖 Description
**Factify** is a comprehensive full-stack application designed to combat misinformation using advanced AI agents. It leverages a **RAG (Retrieval-Augmented Generation)** architecture to analyze news from multiple sources (Text, Image/OCR, URL) and determine its veracity with high confidence.

The system integrates **Groq (Llama 3.3)** for reasoning, **DuckDuckGo** for real-time web verification, and **Tesseract OCR** for image analysis, all wrapped in a modern, responsive React frontend and a robust Node.js/Express backend.

## 🚀 Live Demo
- **Frontend**: [Link to your Railway Client App]
- **API**: [Link to your Railway Server App]

## ✨ Key Features
- **Multi-Modal Analysis**: Verify news via direct text input, URL scraping, or image upload (OCR).
- **Advanced RAG Pipeline**: Combines LLM reasoning with real-time web search evidence.
- **Dynamic Scoring**: Returns a "Real", "Fake", or "Inconclusive" verdict with a confidence score and explanation.
- **User System**: Secure JWT authentication with Role-Based Access Control (Admin vs. User).
- **History Tracking**: Users can save and review their analysis history.
- **Admin Dashboard**: View system statistics and manage users/analyses.
- **Responsive Design**: Fully responsive UI with a dynamic mobile menu and dark mode aesthetics.

## 🛠️ Tech Stack
| Component | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, CSS Modules, Lucide React, Recharts |
| **Backend** | Node.js, Express, MongoDB (Mongoose), JWT, Multer |
| **AI / RAG** | Python (FastAPI), LangChain, Groq (Llama 3), Tesseract OCR, BeautifulSoup |
| **DevOps** | Docker, Nginx, Railway, Vitest/Jest (Testing) |

## 🏗️ Architecture
The project follows a **Microservices-based MVC** architecture:
1.  **Client**: React SPA handling UI and user interactions.
2.  **Server**: Node.js API Gateway handling Auth, User Management, and Request Proxying.
3.  **RAG Service**: Python microservice dedicated to AI processing and Web Scraping.

## 🚀 Deployment (Docker & Railway)
This project is fully containerized.

### Prerequisites
- Docker & Docker Compose
- Environment Variables (see `.env.example`)

### Running Locally
```bash
# Clone the repo
git clone https://github.com/habibaehabb05/Factify.git

# Install dependencies (Root script available)
./start-all.ps1
```

## ✅ Project Status
- [x] **Automated Unit Tests**: Implemented for Frontend (Register) and Backend (Auth).
- [x] **Data Validation**: Strong password policies and input sanitization.
- [x] **Dynamic Menu**: Responsive navigation with active state highlighting.
- [x] **Design Patterns**: Implemented Strategy, Observer, and Factory patterns.

## 👥 Authors
- **Habiba** - *Initial Work*
-**yasmen yaser**
-**mostafa ayman**
-**omar fawzy**
-**tarek essam**

---
*Built with ❤️ for Truth.*
