# 📂 Task & Project Management App

A full-stack web application to manage projects, tasks. Users can log in, create new projects, manage tasks within those projects.

---

## 🛠️ Tech Stack

### Frontend

* React
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

---

## 🚀 Getting Started

Follow the steps below to set up and run the project locally.

---

### 📁 Prerequisites

Make sure you have the following installed:

* **Node.js** (v20 or higher)
* **npm** (Node package manager)

---

### ⚖️ Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/MeParas325/task-manager
cd task-manager
```

#### 2. Configure Environment Variables

* A sample `.env` file is provided in the `backend` folder.
* Rename the file to `.env`.
* Replace the placeholder values with your actual configuration.

Example `.env`:

```env
PORT=your_port
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

#### 3. Install Dependencies

Install dependencies for both the backend and frontend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

#### 4. Run the Project

##### Start the Backend Server

```bash
cd backend
npm run dev
```

##### Start the Frontend Server

```bash
cd frontend
npm run dev
```

---

## 🌐 Access the Application

Once both servers are running, open your browser and go to:

```
http://localhost:3000/login
```

---

## ✨ Features

* User login & authentication
* Create, update, and delete projects
* Create and manage tasks within each project
* Track task status (e.g., pending, in progress, completed)

---

## ✅ Ready to Use!

You're now ready to use the app and manage your projects and tasks effectively.