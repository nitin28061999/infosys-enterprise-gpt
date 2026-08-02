# Enterprise Knowledge Management Backend

A production-ready **FastAPI** backend for an Enterprise Knowledge Management System. The application provides secure authentication, user management, document upload, and document metadata management using **PostgreSQL**, **SQLAlchemy**, and **Supabase Storage**.

---

## 🚀 Features

- 🔐 JWT Authentication
- 👥 Role-Based Access Control (RBAC)
- 📄 Document Upload
- ☁️ Supabase Storage Integration
- 🗄️ PostgreSQL Database
- ⚡ FastAPI Framework
- 📦 SQLAlchemy ORM
- ✅ Pydantic Validation
- 🌍 Environment Variable Configuration
- 📁 Modular Project Structure
- 🛡️ Global Exception Handling

---

# Tech Stack

| Category | Technology |
|----------|------------|
| Backend | FastAPI |
| Language | Python 3.13+ |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Storage | Supabase Storage |
| Authentication | JWT |
| Validation | Pydantic |
| Server | Uvicorn |
| Environment | python-dotenv |

---

# Project Structure

```
backend/
│
├── config/
│   ├── db_config.py
│   ├── env_config.py
│   └── supabase_config.py
│
├── routes/
│   └── main_route.py
│
├── src/
│   ├── auth/
│   ├── users/
│   └── documents/
│
├── utils/
│
├── main.py
├── requirements.txt
├── .env.example
└── .gitignore