Spur AI Live Chat Agent - Take-Home Assignment
This is a complete implementation of the AI support agent for a live chat widget using the MERN stack (MongoDB, Express, React, Node.js). The backend uses Node.js + Express, MongoDB (via Mongoose) for persistence, and Groq AI for LLM integration (free tier). The frontend is built with Vite + React for fast development and modern features.

Key features:

Real-time chat with AI replies.
Conversation history persistence.
Contextual responses using LLM with hardcoded FAQs.
Error handling and graceful fallbacks.
Session ID for reloading chats.
Prerequisites
Node.js v18+ (download from nodejs.org)
Git (for cloning)
MongoDB Atlas account (free tier recommended)
Groq API key (free from console.groq.com – no credit card needed)
How to Run Locally (Step by Step)
1. Clone the Repository
Bash
git clone https://github.com/YOUR-USERNAME/spur-ai-chat-agent.git
cd spur-ai-chat-agent
2. Set Up the Database (MongoDB Atlas - Recommended for Zero Local Setup)
Sign up for free at https://www.mongodb.com/cloud/atlas.
Create a new project and cluster (M0 free tier).
Add a database user (username/password).
Allow access from anywhere (IP: 0.0.0.0/0 for testing).
Get the connection string from "Connect" button:
Example: mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/spur-chat?retryWrites=true&w=majority
No migrations or seeding needed – Mongoose creates collections automatically on first run. The app persists conversations and messages on-the-fly.
Alternative (Local MongoDB):

Install MongoDB locally (mongodb.com/docs/manual/installation).
Run: mongod (default port 27017).
Use URI: mongodb://localhost:27017/spur-chat.
3. Configure Environment Variables
Create .env in backend/ folder (use .env.example as template if available):

text
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/spur-chat?retryWrites=true&w=majority  # From Atlas
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # From Groq console
For frontend (optional in frontend-vite/.env):

text
VITE_API_URL=http://localhost:5000
Important: Never commit .env to Git – add to .gitignore.

4. Install Dependencies
Backend:
Bash
cd backend
npm install
Frontend:
Bash
cd ../frontend-vite
npm install
5. Run the Application
Start backend (separate terminal):
Bash
cd backend
npm run dev  # Uses nodemon for auto-reload
Output: "MongoDB connected successfully" and "Server running on port 5000".
Start frontend (another terminal):
Bash
cd frontend-vite
npm run dev
Opens http://localhost:5173 (Vite default port).
6. Test the App
Open http://localhost:5173 in browser.
Type messages like "What's your return policy?" or "Shipping kab tak hoti hai?".
See AI replies in real-time.
Refresh page – chat history loads via sessionId from localStorage.
Check MongoDB Atlas dashboard – collections (conversations, messages) auto-created with data.
Troubleshooting:

Connection refused? Ensure backend is running and ports match.
LLM error? Verify GROQ_API_KEY in .env.
DB connection fail? Check Atlas IP whitelist (0.0.0.0/0) and URI password.
Short Architecture Overview
Backend Structure
server.js: Express app setup, middleware (CORS, JSON parser), MongoDB connection, error handler.
routes/chatRoutes.js: API endpoints – POST /api/chat/message (send + generate reply), GET /api/chat/history/:sessionId (fetch messages).
controllers/chatController.js: Core logic – session creation/validation, message saving, history fetch, LLM integration call.
models/: Mongoose schemas – Conversation (id, timestamps), Message (conversationId, sender, content, timestamps).
services/llmService.js: Isolated LLM logic – prompt building, Groq API call, error handling.
Layers: Routes → Controllers → Services/Models – clean separation for maintainability.
Interesting Design Decisions
SessionId as MongoDB _id: Simple, scalable, no UUID lib needed.
History limit (10 messages): Keeps LLM context efficient/cost-effective.
Optimistic UI in frontend: User message shows instantly, enhances perceived speed.
Groq over OpenAI: Free, fast inference – fallback-friendly errors.
No auth: Per spec – focuses on core chat flow.
LLM Notes
Provider: Groq AI (free tier with Llama-3.1-70B or similar models) – API-compatible with OpenAI, blazing fast, no quota issues for testing.
Prompting:
System Prompt: Role as e-commerce agent + hardcoded FAQs (shipping: free >₹999 India, returns: 15 days unused, etc.). Ensures policy adherence.
History Inclusion: Last 10 messages as context for conversational flow.
Parameters: Temperature 0.7 (balanced creativity), max_tokens 500 (concise replies).
Language Handling: Detects Hindi/English from user input.
Guardrails: Catches API errors, returns friendly fallback message.
Trade-offs & “If I Had More Time…”
Trade-offs
Groq (free) vs OpenAI: Faster/cheaper but potentially less nuanced on edge cases.
MongoDB (NoSQL): Flexible for chats but lacks strict schemas (vs PostgreSQL).
Vite/React: Quick setup/fast HMR but no SSR (not needed here).
No Redis: Added DB reads but minimal for demo scale.
Basic Validation: Trims messages but no deep sanitization – prioritizes speed.
