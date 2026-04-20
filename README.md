# GL Journal Frontend

A Vue 3 frontend for the GL Journal accounting system.

## Tech Stack

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- Bootstrap 5

## Requirements

- Node v18+
- npm v9+

> Tested with Node v22.21.0 and npm 10.9.4

---

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:Restyle5/accounting-module-frontend.git
cd accounting-module-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment setup

Create a `.env` file in the project root using .env.example:

```env
cp .env.example .env
```

### 4. Start the dev server

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

### 5. Backend Server

 - Make sure you have accounting_module (Backend APIs) instance running.
 - Backend Repo: https://github.com/Restyle5/accounting-module

## Default Credentials (Through php seeder)

Email:    user1@gmail.com
Password: password