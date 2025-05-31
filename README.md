# Quizz - React Quiz Application
A modern quiz application built with React and Vite, featuring trivia questions from the OpenTDB API.

## Features
- User authentication
- Customizable quiz settings (category, difficulty, question count)
- Real-time progress tracking
- One question per page interface
- Timer system with auto-submit functionality
- Detailed results & performance feedback
- Resume unfinished quizzes

## Tech Stack
- React 19.1.0
- Vite
- OpenTDB API (no authentication required)

## Prerequisites
- Node.js 16.0 or higher
- npm 7.0 or higher

## Quick Start
```bash
# 1. Setup database
createdb quizz_auth

# 2. Setup & start backend
git clone https://github.com/wrdhn/Quiz-Login-Api.git
cd Quiz-Login-Api
npm install
# Setup .env file
npm run dev  # runs on port 3001

# 3. Setup & start frontend (new terminal)
git clone https://github.com/wrdhn/Quizz-App.git
cd Quizz-App  
npm install
npm run dev  # runs on port 5173
```

## Project Structure
```
├── eslint.config.js  
├── index.html 
├── package.json
├── package-lock.json
├── public
│   └── vite.svg
├── README.md
├── src
│   ├── App.jsx
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── Auth
│   │   │   ├── AuthForm.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Common
│   │   │   ├── Header.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── Quiz
│   │       ├── QuizConfig.jsx
│   │       ├── QuizQuestion.jsx
│   │       └── QuizResult.jsx
│   ├── contexts
│   │   ├── AuthContext.jsx
│   │   └── QuizContext.jsx
│   ├── main.jsx
│   ├── services
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── quizService.js
│   ├── styles
│   │   └── App.css
│   └── utils
└── vite.config.js
```
