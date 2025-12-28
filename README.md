Markdown# Spur AI Live Chat Agent - Take-Home Assignment

This is a complete implementation of the AI support agent for a live chat widget using the MERN stack (MongoDB, Express, React, Node.js).  
Backend: Node.js + Express  
Frontend: Vite + React  
Database: MongoDB Atlas (cloud)  
LLM: Groq AI (free tier – fast and cost-free inference)

### Live Demo
**Deployed Frontend:**  
https://spur-ai-chat-agent-1.onrender.com/

(Backend is running behind it on Render. First load may take 30–60 seconds due to free tier hibernation.)

## Features
- Real-time AI-powered chat support
- Conversation history persistence (reload page → chat continues)
- Contextual multi-turn replies
- Hindi + English support
- Graceful error handling
- Session management via localStorage + MongoDB

## Prerequisites
- Node.js v18+
- Git
- MongoDB Atlas free account
- Groq API key (free: https://console.groq.com)

## How to Run Locally (Step by Step)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR-USERNAME/spur-ai-chat-agent.git
cd spur-ai-chat-agent
2. Database Setup (MongoDB Atlas – Recommended)

Create free account at https://www.mongodb.com/cloud/atlas
New cluster (M0 free tier)
Create database user
Allow access from anywhere (IP: 0.0.0.0/0)
Copy connection string:textmongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/spur-chat?retryWrites=true&w=majority→ No migrations or seeding required – collections created automatically

3. Environment Variables
Create .env file in backend/ folder:
envPORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/spur-chat?retryWrites=true&w=majority
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
(Optional) In frontend-vite/.env:
envVITE_API_URL=http://localhost:5000
4. Install Dependencies
Backend:
Bashcd backend
npm install
Frontend:
Bashcd ../frontend
npm install
5. Run the Application
Backend (separate terminal):
Bashcd backend
npm run dev
Frontend (another terminal):
Bashcd frontend
npm run dev
Open → http://localhost:5173
Project Structure
textspur-ai-chat-agent/
├── backend/                    # Node.js + Express API
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── .env.example
│   └── package.json
├── frontend/              # Vite + React chat UI
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
├── README.md
└── .gitignore
Architecture Overview
Backend

server.js: Express setup, CORS, MongoDB connection, global error handling
routes/ → API endpoints
controllers/ → Business logic (session, message handling, LLM call)
models/ → Mongoose schemas
services/ → Isolated LLM integration (easy to swap provider)

Frontend

Vite + React
LocalStorage for session persistence
Optimistic UI updates
Auto-scroll + loading indicator

LLM Integration

Provider: Groq AI (free tier)
Model: llama-3.1-70b-versatile (or similar)
System Prompt: Role as e-commerce support agent + hardcoded store policies (shipping, returns, etc.)
Context: Last 10 messages included
Guardrails: Error fallback message, temperature 0.7, max_tokens 500

Deployment on Render.com

Backend: Deployed as Node Web Service
Root directory: /backend
Build: npm install
Start: npm run start
Env vars: MONGO_URI, GROQ_API_KEY
Frontend: Deployed as Static Site
Root directory: /frontend
Build: npm install && npm run build
Publish dir: dist
Env var: VITE_API_URL=https://your-backend.onrender.com

Trade-offs & Future Improvements
Trade-offs

Groq (free/fast) instead of OpenAI → lower cost, but slightly different response style
No Redis caching → simple, but more DB reads
Minimal validation → focused on core functionality

If more time

Socket.io for live typing indicators
Authentication
Vector store for dynamic knowledge base
Dark mode + better mobile UX
Automated tests (Jest/Playwright)
Multi-LLM fallback system


Created for Spur Founding Full-Stack Engineer take-home assignment
December 2025
text**Important:**  
Replace `YOUR-USERNAME` with your actual GitHub username in the clone command.  
If your actual deployed frontend URL is different from `https://spur-ai-chat-agent-1.onrender.com/`, update it in the README.

Copy-paste this entire content into your `README.md` file at the root of the repository, commit & push:

```bash
git add README.md
git commit -m "Update README with deployed URL and final instructions"
git push origin main
