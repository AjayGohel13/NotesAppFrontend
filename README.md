# 📝 NotesApp - MERN Stack Application

A simple MERN stack project for creating, storing, and managing personal notes. Built using React (Vite) frontend and Node.js + PostgreSQL backend.

---

## 📦 Technologies Used

- React + TypeScript (Vite)
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Axios
- Tailwind CSS
- CORS

---

## ⚙️ Project Structure

notes-app/ ├── backend/ # Node + Express API ├── frontend/ # React + Vite client app └── README.md # You're reading it


---

## 🚀 Setup & Installation

### 🔧 1. Backend Setup

#### 📁 Navigate to backend folder

```bash
cd backend
npm install

PORT=8080
DATABASE_URL=your_postgres_connection_url
JWT_SECRET=your_jwt_secret_key

npm start

### 🔧 1. Frontend Setup

cd frontend
npm install
VITE_BACKEND_URL=http://localhost:8080

npm run dev

