# Body Fat Tracker - AI Coding Instructions

## Project Overview
This is a mobile-friendly web application for tracking body composition metrics.
- **Frontend:** Next.js (React)
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL

## Architecture & Structure
- **Frontend (`/frontend`):** 
  - Use Next.js App Router (`app/` directory).
  - Prioritize mobile-first responsive design using Tailwind CSS.
  - Use **Shadcn UI** for components and **Lucide React** for icons.
  - Implement Internationalization (i18n) for multi-language support.
  - Use strict TypeScript for all components and utilities.
- **Backend (`/backend`):**
  - FastAPI application structure.
  - Use `uv` for Python package and environment management.
  - Use Pydantic models for data validation and schemas.
  - Use SQLAlchemy (async) or SQLModel for ORM interactions with PostgreSQL.
  - Implement JWT authentication for user management.

## Coding Conventions
### Frontend (Next.js)
- **Components:** Functional components with named exports. Keep components small and focused on a single responsibility. Break down complex UIs into smaller sub-components.
- **State Management:** Use React Context or Zustand for global state (e.g., user session).
- **Data Fetching:** Use React Query (TanStack Query) or SWR for client-side fetching; Server Actions for mutations where appropriate.
- **Styling:** Tailwind CSS utility classes. Avoid custom CSS files unless necessary.

### Backend (FastAPI)
- **Type Hinting:** strict Python type hints are required.
- **Endpoints:** RESTful API design. Group routes using `APIRouter`.
- **Database:** Use asynchronous database sessions (`async def`).
- **Validation:** All request/response bodies must be defined as Pydantic models.

## Workflows
- **Development:**
  - Frontend: `npm run dev` (Port 3000)
  - Backend: `uv run uvicorn main:app --reload` (Port 8000)
- **Database:** Use Alembic for database migrations.

## Key Features to Implement
- User Authentication (Login/Register).
- CRUD operations for body metrics (Weight, Body Fat %, etc.).
- Unit conversion logic (Metric/Imperial) handled on frontend or backend (consistency required).
