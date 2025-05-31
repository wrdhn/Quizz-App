# Quizz

Quizz adalah aplikasi kuis dengan soal yang di ambil dari OpenTDB API dan memungkin kan user untuk mengerjakan soal yang sesuai dengan soal yang diinginka user

## Project Structure
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

## Instalation & setup

```bash
#Clone Quizz Repositories
git clone https://github.com/wrdhn/Quizz-App.git

#Install dependencies
npm install

#Run project in development environment
npm run dev

#CLone Quizz Auth API
git clone
```
