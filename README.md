# TaskFlow — Frontend

A modern task management application built with React and designed to help users organize, manage, and track their tasks through a clean and responsive interface.

The frontend communicates with a dedicated backend API for authentication and task management.

## ✨ Features

* 🔐 User authentication
* ✅ Create and manage tasks
* ✏️ Edit existing tasks
* 🗑️ Delete tasks
* 📋 View and organize tasks
* 🔄 Update task status
* 🔍 Task searching and filtering
* 📱 Responsive interface
* 🧩 Reusable UI components
* 🔌 REST API integration

## 🛠️ Tech Stack

* **React** — UI development
* **TypeScript** — Type-safe development
* **Tailwind CSS** — Responsive styling
* **Lucide React** — Interface icons

## 🏗️ Architecture

The frontend is responsible for the user interface, client-side interactions, task management UI, and communication with the backend API.

```text id="j5s7pk"
TaskFlow/
├── src/
│   ├── components/
│   ├── pages/
│   ├── ...
│   └── ...
├── public/
├── package.json
└── ...
```

## 🔌 Backend Integration

TaskFlow uses a separate backend API for authentication, task operations, and persistent data.

**Backend Repository:**

https://github.com/wasem7112011/TaskFlow-Backend

## ⚙️ Getting Started

### Prerequisites

* Node.js 18+
* npm

### Installation

Clone the repository:

```bash id="7d5zqp"
git clone https://github.com/wasem7112011/TaskFlow.git
```

Navigate to the project:

```bash id="xm2c4r"
cd TaskFlow
```

Install dependencies:

```bash id="z0w5gr"
npm install
```

### Environment Variables

Create the required environment file based on the project's configuration.

Example:

```env id="q9v2ta"
VITE_API_URL=http://localhost:5000
```

Use the exact variable names required by the project.

### Run the Development Server

```bash id="a7r3nx"
npm run dev
```

The application will be available at the local development URL provided by the development server.

## 📱 Responsive Design

The interface is designed to work across desktop, tablet, and mobile screen sizes.

## 📌 Technical Highlights

* Component-based frontend architecture
* TypeScript for type safety
* REST API integration
* Responsive UI
* Reusable components
* Separation between frontend and backend

## 🔗 Related Repository

**Backend:**
https://github.com/wasem7112011/TaskFlow-Backend

## 🌐 Live Demo

[Try the live application](https://task-flow-kappa-nine-17.vercel.app/)
