# 🌞 ETERNAL ENERGY — Solar Platform SaaS

A full-stack solar energy business management platform built with **Node.js + Express + SQLite** (backend) and **React + Vite + Tailwind CSS** (frontend).

## 🚀 Quick Start

```bash
# Backend
cd backend
npm install
npm run dev          # → http://localhost:8000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev          # → http://localhost:5173
```

> **No MongoDB or external database required** — uses SQLite (zero-config, file-based).

## 📁 Project Structure

```
├── backend/
│   ├── config/          # Database (SQLite + Sequelize)
│   ├── controllers/     # 9 controllers (auth, leads, customers, invoices, installations, dashboard, pdf, export, email, weather, notification, system)
│   ├── middleware/       # Auth (JWT), rate limiter, validation, error handler, cache
│   ├── models/          # 6 Sequelize models
│   ├── routes/          # 12 route modules
│   ├── utils/           # Logger, email service
│   └── server.js        # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI (Card, Button, Modal, Skeleton, StatCard)
│   │   ├── context/     # Auth + Theme context providers
│   │   ├── pages/       # 12 page components
│   │   ├── api/         # Axios instance with interceptors
│   │   └── App.jsx      # Router with lazy loading
│   └── index.html
└── README.md
```

## ✨ Features

### Core Business
- **Lead Management** — Pipeline tracking (new → contacted → quoted → won/lost)
- **Customer CRM** — CRUD with search, city filtering, inline editing
- **Invoice System** — Dynamic line items, GST, discounts, payment status tracking
- **Installation Tracking** — Project pipeline (planning → procurement → completed)
- **Quotation Wizard** — 3-step form with live price calculation

### Solar-Specific
- **Solar Calculator** — ROI/payback with environmental impact (CO₂, trees)
- **Panel Comparison** — 6 Indian panels with radar chart, spec table, AI recommendations
- **Weather Forecast** — 7-day solar efficiency forecast via Open-Meteo API
- **Maintenance Schedule** — 6 tasks with priority, frequency, and cost estimates
- **Battery Storage** — 6 battery recommendations with suitability scoring

### Data & Reports
- **Dashboard** — Revenue charts, lead pipeline, city analytics, recent activity
- **PDF Invoice Export** — Branded PDF with header, items table, totals
- **CSV Export** — Download leads, customers, invoices, installations
- **Email (Mock)** — Invoice/lead/maintenance email templates with log viewer

### System
- **Authentication** — JWT with role-based access (Admin/Employee/Customer)
- **Dark/Light Theme** — System-wide toggle with CSS variables
- **Backup & Restore** — SQLite database backup/restore (admin only)
- **File Upload** — Base64 upload with type validation (5MB limit)
- **Notifications** — In-app notification system
- **Settings** — Profile editing, password change, data export

## 🛡️ API Endpoints

| Module | Endpoints |
|--------|-----------|
| **Auth** | `POST /register`, `POST /login`, `GET /me`, `PUT /me`, `PUT /password` |
| **Leads** | `GET /`, `POST /`, `GET /:id`, `PUT /:id`, `DELETE /:id` |
| **Customers** | `GET /`, `POST /`, `GET /:id`, `PUT /:id`, `DELETE /:id` |
| **Invoices** | `GET /`, `POST /`, `GET /:id`, `PUT /:id`, `DELETE /:id` |
| **Installations** | `GET /`, `POST /`, `GET /:id`, `PUT /:id`, `DELETE /:id` |
| **Dashboard** | `GET /stats` |
| **Export** | `GET /leads`, `GET /customers`, `GET /invoices`, `GET /installations`, `GET /invoice/:id/pdf` |
| **Email** | `POST /invoice/:id`, `POST /lead/:id`, `POST /maintenance/:id`, `GET /logs` |
| **Weather** | `GET /solar?lat=&lon=`, `GET /cities` |
| **Notifications** | `GET /`, `PUT /:id/read`, `PUT /read-all` |
| **System** | `GET /health`, `GET /backup`, `GET /backups`, `POST /restore/:filename` |
| **Upload** | `POST /`, `GET /`, `GET /files/:filename`, `DELETE /:filename` |

All API routes prefixed with `/api/`. Auth required for all except register/login.

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, Framer Motion, Recharts, Axios |
| **Backend** | Node.js, Express 4, Sequelize 6, SQLite3 |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **PDF** | pdfkit |
| **Security** | Helmet, CORS, express-rate-limit, express-validator |

## 🐳 Docker

```bash
docker build -t eternal-energy .
docker run -p 8000:8000 -p 5173:5173 eternal-energy
```

## 📝 Environment Variables

Create `backend/.env`:
```
PORT=8000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
```

## 📄 License

MIT
