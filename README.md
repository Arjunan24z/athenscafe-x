# CafeSmart 🍽️

A modern web and mobile application for school cafeteria food ordering and smart payment system.

## 🎯 Project Overview

CafeSmart is a SaaS platform that enables schools to digitize cafeteria operations with:
- **Pre-ordering system** for parents to book meals in advance
- **Virtual wallet & cashless payments** with UPI/Card/NetBanking integration
- **QR code payment** at cafeteria counter
- **Real-time order tracking** with WebSocket updates
- **Nutrition tracking** and AI meal recommendations
- **Analytics dashboards** for parents, vendors, and admins
- **Role-based access control** for 4 user types

**Expected Scale**: 1,500-2,000 users per school

---

## 👥 User Roles

| Role | Access | Key Features |
|------|--------|--------------|
| **Parent** | Web + Mobile | Order meals, manage wallet, view history, set restrictions |
| **Student** | Mobile | QR code payment, view balance, transaction history |
| **Vendor** | Web | Menu management, inventory, orders, revenue reports |
| **Admin** | Web | User management, approvals, system configuration |

---

## 📋 Project Structure

```
cafesmart/
├── client/              # React (Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── server/              # Node.js + Express + Prisma
│   ├── src/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── tsconfig.json
├── shared/              # Shared types & utilities
│   └── types.ts
├── docker-compose.yml   # PostgreSQL + Redis
├── .gitignore
├── .env.example
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for lightning-fast builds
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack Query** for server state
- **Zustand** for client state
- **Axios** for HTTP client

### Backend
- **Node.js** with TypeScript
- **Express.js** for REST + WebSocket API
- **Prisma ORM** for database
- **PostgreSQL** for relational data
- **Redis** for caching & real-time features
- **JWT** for authentication
- **Zod** for input validation

### Infrastructure
- **Docker Compose** for local development
- **Razorpay** for payment processing
- **Firebase FCM** for push notifications
- **Cloudinary** for image storage

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Docker & Docker Compose
- Git

### Quick Start

1. **Clone and setup**
   ```bash
   cd cafesmart
   npm install       # Install root dependencies
   npm run dev       # Start both client and server
   ```

2. **Database setup**
   ```bash
   docker-compose up -d
   cd server && npx prisma migrate dev
   ```

3. **Environment configuration**
   - Copy `.env.example` to `.env.local` in both `client/` and `server/`
   - Fill in your API keys and credentials

4. **Start development**
   ```bash
   npm run dev       # Runs client + server concurrently
   ```

---

## 📅 Implementation Phases

- **Phase 0**: Project Setup & Architecture ✅
- **Phase 1**: Backend Foundation (Auth, DB, Validation)
- **Phase 2**: Auth Module (Login, JWT, Protected Routes)
- **Phase 3**: User Management (Profiles, Roles)
- **Phase 4**: Menu Management (Food items, Categories)
- **Phase 5**: Food Ordering System (Cart, Scheduling)
- **Phase 6**: Wallet & Payment System (Virtual Card, Razorpay)
- **Phase 7**: QR Code Payment (Scanning, Transaction)
- **Phase 8**: Notifications (Email, Push, In-app)
- **Phase 9**: Analytics & Dashboards
- **Phase 10**: Advanced Features (AI Recommendations, Nutrition)
- **Phase 11**: Deployment (Docker, CI/CD, Cloud)

---

## 📖 Documentation

- [Setup Instructions](./Settingup.txt)
- [Tech Stack Rationale](./techstack.txt)
- [Project Objective](./objective.txt)

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "feat: description"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📞 Support

For questions or issues, please create an issue in the GitHub repository.

---

**Built with ❤️ for schools worldwide**
# athenscafe-x
# athenscafe-x
