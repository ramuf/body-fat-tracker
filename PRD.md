# Product Requirements Document (PRD): Body Fat Tracker App

## 1. Introduction
### 1.1 Purpose
The purpose of this application is to allow users to track their body composition metrics over time.

### 1.2 Scope
The application will be a **mobile-friendly web application**. It will support multiple users, allowing them to manually log their data and visualize their progress.

## 2. Functional Requirements
### 2.1 Metrics Tracking
The app must allow users to input and store the following metrics:
- **Weight** (kg/lbs)
- **Body Fat Percentage** (%)
- **Body Moisture** (Water %)
- **Muscle Mass** (kg/lbs or %)
- **Bone Proportion** (kg/lbs or %)

### 2.2 Data Visualization
- Users should be able to view their progress over time (charts/graphs).
- Users should be able to see a history log of their entries.

### 2.3 Data Management
- Add new entries manually.
- Edit existing entries.
- Delete entries.

### 2.4 User Management
- User Registration and Login.
- Support for multiple distinct user profiles.
- Secure password handling.

### 2.5 Settings
- Toggle between Metric (kg) and Imperial (lbs) units.
- Language selection (Multi-language support).

## 3. Non-Functional Requirements
- **Frontend:** Next.js (React) - Mobile-first responsive design.
- **UI Framework:** Shadcn UI with Lucide Icons.
- **Backend:** FastAPI (Python). Use `uv` for package management.
- **Code Structure:** Prioritize small files and component-based architecture.
- **Database:** PostgreSQL.
- **Performance:** Fast API response times and optimized database queries.
- **Security:** Secure storage of user credentials and personal health data.

## 4. Future Considerations
- Integration with health APIs (Apple Health, Google Fit).
- Data export features (CSV/PDF).
