Project Structure

frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js

Prerequisites

1. Node.js and npm installed

Steps to run

1. Navigate to the frontend folder:
   cd frontend
2. Install dependencies:
   npm install
3. Create environment variables:
   Create a .env file in the frontend/ folder with:
   VITE_BACKEND_URL=http://localhost:3000
4. Start the devlopment structure:
   npm run dev
   Open your browser at: http://localhost:5173
