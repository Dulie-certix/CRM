# CRM Notes Module

Full-stack mini CRM Notes application built with TypeScript.

## Tech Stack

**Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, bcrypt, multer  
**Frontend:** React (Vite), TypeScript, Tailwind CSS, Axios, React Router, React Hook Form  
**Testing:** Jest + Supertest (unit/API), Cypress (E2E)

---

## Setup & Run

### Prerequisites
- Node.js >= 18
- MongoDB running locally on port 27017

---

### Backend

```bash
cd backend
npm install
cp .env.example .env   # Edit MONGO_URI and JWT_SECRET as needed
npm run dev            # Dev server on http://localhost:5000
```

**Run tests:**
```bash
npm test
```

**Build for production:**
```bash
npm run build
npm start
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev            # Dev server on http://localhost:3000
```

**Build for production:**
```bash
npm run build
npm run preview
```

**Run Cypress E2E tests:**
```bash
npm run cypress:open   # Interactive
npm run cypress:run    # Headless
```

---

## API Endpoints

### Auth — `/api/auth`
| Method | Path        | Auth | Description        |
|--------|-------------|------|--------------------|
| POST   | /register   | No   | Register user      |
| POST   | /login      | No   | Login user         |
| GET    | /profile    | Yes  | Get current user   |

### Notes — `/api/notes`
| Method | Path        | Auth | Description        |
|--------|-------------|------|--------------------|
| GET    | /stats      | Yes  | Get note stats     |
| POST   | /           | Yes  | Create note        |
| GET    | /           | Yes  | Get all notes      |
| GET    | /:id        | Yes  | Get note by ID     |
| PUT    | /:id        | Yes  | Update note        |
| DELETE | /:id        | Yes  | Delete note        |

---

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/crm_notes
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

---

## Project Structure

```
backend/
├── src/
│   ├── config/db.ts
│   ├── controllers/authController.ts
│   ├── controllers/noteController.ts
│   ├── middleware/authMiddleware.ts
│   ├── models/User.ts
│   ├── models/Note.ts
│   ├── routes/authRoutes.ts
│   ├── routes/noteRoutes.ts
│   ├── types/user.ts
│   ├── types/note.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── auth.test.ts
│   └── note.test.ts
└── uploads/

frontend/
├── src/
│   ├── api/axios.ts
│   ├── components/Button.tsx
│   ├── components/Input.tsx
│   ├── components/Modal.tsx
│   ├── components/Card.tsx
│   ├── components/Layout.tsx
│   ├── components/Navbar.tsx
│   ├── pages/Login.tsx
│   ├── pages/Register.tsx
│   ├── pages/Dashboard.tsx
│   ├── pages/Notes.tsx
│   ├── pages/AddNote.tsx
│   ├── pages/EditNote.tsx
│   ├── routes/AppRoutes.tsx
│   ├── types/user.ts
│   ├── types/note.ts
│   ├── styles/theme.ts
│   ├── App.tsx
│   └── main.tsx
└── cypress/e2e/
    ├── login.cy.ts
    ├── createNote.cy.ts
    └── editDeleteNote.cy.ts
```
"# CRM" 
