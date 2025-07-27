# Sweet Shop Inventory Management System

A full-stack web application for managing sweets inventory, with role-based access control, built using **FastAPI** backend and **React** frontend. 

It supports user registration/login, sweets management, purchase flow, inventory search & restocking, and admin user management with JWT authentication and comprehensive testing.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Screenshots](#screenshots)  
- [Technologies Used](#technologies-used)  
- [Features](#features)  
- [Getting Started](#getting-started)  
  - [Backend Setup](#backend-setup)  
  - [Frontend Setup](#frontend-setup)  
- [Usage](#usage)  
- [Testing](#testing)  
  - [Backend Testing](#backend-testing)  
  - [Frontend Testing](#frontend-testing)  
- [Project Structure](#project-structure)  
- [Development Workflow & Git Commits](#development-workflow--git-commits)  
- [Future Improvements](#future-improvements)
- [AI USAGE](#ai-usage)  
- [Acknowledgements](#acknowledgements)  

---

## Project Overview

This application enables users to browse, search, purchase sweets from an inventory, and admins to manage sweets and users. It enforces role-based access with JWT-protected endpoints and offers a modern UI built with React, Material UI, and Tailwind CSS.

---
---
## Screenshots
![Register](https://github.com/zeesh8x/swt-shp-ms/blob/main/screenshots-proj/register.png)

![Login](https://github.com/zeesh8x/swt-shp-ms/blob/main/screenshots-proj/login.png)

![Dashboard](https://github.com/zeesh8x/swt-shp-ms/blob/main/screenshots-proj/dashboard.png)

![Admin Dashboard](https://github.com/zeesh8x/swt-shp-ms/blob/main/screenshots-proj/admin_dashboard.png)

![Sweets Inventory](https://github.com/zeesh8x/swt-shp-ms/blob/main/screenshots-proj/sweets_inventory.png)

![Searching Sweets](https://github.com/zeesh8x/swt-shp-ms/blob/main/screenshots-proj/searching_sweet.png)

![User List](https://github.com/zeesh8x/swt-shp-ms/blob/main/screenshots-proj/users_list.png)



---
## Technologies Used

- **Backend:** FastAPI (Python), SQLAlchemy, SQLite, JWT Authentication  
- **Frontend:** React 19, React Router v6, Material UI, Tailwind CSS, Framer Motion, Axios  
- **Testing:** Pytest (backend), Jest & React Testing Library (frontend)  
- **Others:** Git, CORS Middleware, Pydantic for validation  

---

## Features

### Backend

- User registration/login with JWT authentication
- Role-based access control (admin vs user)
- CRUD operations on sweets inventory
- Purchase sweets with stock validation and update
- Sweets inventory search by name/category/price range
- Restock sweets (admin only)
- Admin user management (list/update users, change roles/passwords)
- Swagger API documentation at `/docs`

### Frontend

- Responsive UI with Material UI & Tailwind CSS
- Inventory browsing with search and filters
- Purchase workflow with validation
- Admin UI for adding, editing, deleting, and restocking sweets
- Admin user management panel
- Authentication flows and role-based UI controls
- Dashboard landing page with navigations
- User notifications for actions and errors

### Testing

- Backend tests for authentication, sweets CRUD, purchase, search, restock, user management
- Frontend component and navigation tests with React Testing Library

---

## Getting Started

### Backend Setup

1. Create and activate a Python virtual environment:
python -m venv env
source env/bin/activate # Mac/Linux
.\env\Scripts\activate # Windows


2. Install dependencies:

pip install -r requirements.txt


3. Run the FastAPI development server:

uvicorn app.main:app --reload


4. Access API docs at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Frontend Setup

1. Navigate to the frontend directory:

cd frontend


2. Install npm dependencies:

npm install


3. Start the React development server:

npm start


4. Open the app at [http://localhost:3000](http://localhost:3000)

---

## Usage

- Register and login users with role assignment (`user` or `admin`)
- Browse sweets inventory, use search/filter controls for easy navigation
- Purchase sweets if logged in as a user
- Admins can add, edit, delete, and restock sweets
- Admins can manage users via the admin user management UI
- Use the dashboard for quick navigation and app overview
- Logout using provided UI controls

---

## Testing

### Backend Testing

- Run tests located in `backend/test/` folder with:

pytest --disable-warnings -v


- Tests cover core API endpoints and edge cases.

### Frontend Testing

- Run frontend tests with:

npm test


- Tests include component rendering and navigation flows using Jest and React Testing Library.

---

## 🗂 Project Structure

```
sweetshop/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI app and route registrations
│   │   ├── models.py          # SQLAlchemy models (User, Sweet, etc.)
│   │   ├── schemas.py         # Pydantic schemas (UserCreate, SweetCreate, etc.)
│   │   ├── crud.py            # All DB logic and helper methods
│   │   ├── auth.py            # Auth/JWT logic
│   │   ├── database.py        # DB engine/session logic
│   │   └── dependencies.py    # Common dependency functions (optional)
│   ├── test/
│   │   ├── __init__.py
│   │   └── test_main.py       # Pytest test cases for routes and logic
│   ├── sweetshop.db           # SQLite database file (auto-created)
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Sweets.js
│   │   │   ├── AddSweet.js
│   │   │   ├── EditSweet.js
│   │   │   ├── AdminPanel.js
│   │   │   ├── AdminUsers.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── components/        # Buttons, dialogs, notification bars, etc.
│   │   ├── __tests__/         # Frontend Jest/RTL tests (optional)
│   │   └── styles/            # Tailwind, Material UI theme overrides, etc.
│   ├── package.json
│   └── README.md
│
├── README.md                  # Root project documentation
├── .gitignore
├── .env                       # Environment variables (if any)
└── scripts/                   # Deployment, seed scripts, etc. (optional)
```
---

## Development Workflow & Git Commits

- Adopted TDD practices, committing logically per feature for backend APIs, frontend UI, and tests
- Commit messages indicate features like “Add search endpoint”, “Implement admin restock functionality”, etc.
- AI-assisted code usage is noted in commits and documented accordingly
- Branching strategy used for feature isolation during development

---

## Future Improvements

- Add pagination and advanced filtering on frontend
- Implement password reset workflow via email
- Add order history and purchase tracking features
- Enhance frontend e2e tests (Cypress or Playwright)
- Dockerize backend and frontend for easier deployment
- Improve UI/UX polish and accessibility compliance

---
---
## AI USAGE:

I used Perplexity AI and Chatgpt for completing this task

Perplexity AI — for architecture brainstorming, code generation, debugging, documentation, and best practice advice.

ChatGPT - Improving UI and basic fundamentals implementation.

---
## Acknowledgements

- Thanks to FastAPI, React, Material UI, Tailwind CSS, and the open-source community
- AI-assisted development powered by Perplexity AI helping streamline coding and testing

---

Feel free to open issues or contribute! For questions or support, contact the maintainer.

---


