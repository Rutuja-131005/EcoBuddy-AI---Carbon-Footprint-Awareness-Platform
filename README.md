# EcoBuddy AI - Carbon Footprint Awareness Platform

Tagline: **Understand your impact. Reduce your footprint. Save the planet.**

EcoBuddy AI is a single-user full-stack web application for logging daily activities, calculating carbon emissions, viewing dashboard trends, generating recommendations, setting reduction goals, and downloading PDF reports.

## Tech Stack

- Frontend: React.js, Tailwind CSS, Chart.js, React Router
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Architecture: MVC with service layer
- Reports: PDFKit
- Containers: Docker and Docker Compose

## Project Structure

```text
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── seed
│   │   ├── services
│   │   └── utils
│   └── Dockerfile
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── utils
│   └── Dockerfile
└── docker-compose.yml
```

## Core Features

- Landing page with hero, overview, features, benefits, and dashboard CTA
- Activity CRUD for transport, electricity, food, water, shopping, and waste
- Carbon calculator using `Emission = Quantity x Emission Factor`
- Stored activity emissions and synchronized carbon records
- Dashboard with total footprint, weekly/monthly trends, category emissions, carbon score, recent activities, and goal progress
- Dynamic recommendations based on recent high-emission categories
- Reduction goals with target date, progress tracking, and completion
- Weekly, monthly, category-wise, and custom reports
- Downloadable PDF reports
- Seed data for emission factors, activities, goals, and recommendations

## API Overview

Base URL: `http://localhost:5000/api`

```text
GET    /health
GET    /activities
POST   /activities
GET    /activities/:id
PUT    /activities/:id
DELETE /activities/:id
GET    /emission-factors
GET    /dashboard
GET    /recommendations
GET    /goals
POST   /goals
GET    /goals/:id
PUT    /goals/:id
PATCH  /goals/:id/complete
DELETE /goals/:id
GET    /reports
GET    /reports/download/pdf
```

## Local Setup

Requirements:

- Node.js 20+
- MongoDB running locally, or Docker

1. Install dependencies:

```bash
npm install
npm run install:all
```

2. Configure environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Seed sample data:

```bash
npm run seed
```

4. Start both apps:

```bash
npm run dev
```

5. Open the app:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000/api/health
```

## Docker Setup

Run the full stack with MongoDB, backend, and frontend:

```bash
docker compose up --build
```

Then open:

```text
http://localhost:3000
```

The backend container runs the seed script on startup. The seed script is idempotent for emission factors and only creates sample activities/goals when the database is empty.

## Emission Factors

Sample factors include:

- Car: `0.21`
- Bus: `0.08`
- Train: `0.04`
- Flight: `0.25`
- Electricity: `0.82`

Additional seeded factors cover bike, food, water, shopping, and waste categories. Factors are stored in MongoDB through the `EmissionFactor` collection.

## Deployment Notes

- Build the frontend with `npm run build --prefix frontend`.
- Run the backend with `npm start --prefix backend`.
- Set production environment variables:
  - `PORT`
  - `MONGODB_URI`
  - `CLIENT_ORIGIN`
  - `NODE_ENV=production`
- Use the provided Dockerfiles for container deployment.
- In production, serve the frontend through Nginx and proxy `/api` to the backend, as shown in `frontend/nginx.conf`.

## Generated Asset

The landing page hero image was generated for this project and saved at:

```text
frontend/public/ecobuddy-hero.png
```
