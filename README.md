# 🌍 EcoBuddy AI
### Understand your impact. Reduce your footprint. Save the planet.

EcoBuddy AI is an intelligent **Carbon Footprint Awareness Platform** that helps individuals measure, track, and reduce their environmental impact through personalized insights and actionable recommendations.

---

## 🚀 Live Demo

🔗 **Website:** https://your-live-url.com

🔗 **GitHub Repository:** https://github.com/Rutuja-131005/Carbon-Footprint-Awareness-Platform

---

## 📖 About the Project

Everyday activities like transportation, electricity consumption, food habits, and waste generation contribute to carbon emissions. However, most people are unaware of their environmental impact.

**EcoBuddy AI** transforms daily activity data into meaningful carbon emission insights (kg CO₂e), helping users:

🌱 **Track carbon emissions**
📊 **Visualize environmental impact**
🎯 **Set reduction goals**
💡 **Get AI-powered recommendations**

---

## ✨ Features

- **Activity Tracking**: Log daily activities across multiple categories (Transport, Utilities, Food, Waste).
- **Dashboard Analytics**: Visualize footprint data through interactive charts and trends.
- **Smart Recommendations**: Receive AI-driven suggestions for reducing carbon impact.
- **Goal Setting**: Set and monitor carbon reduction targets.
- **Reporting**: Generate and export detailed carbon footprint reports as PDF.
- **Responsive Design**: Mobile-first architecture ensuring accessibility across devices.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Testing**: Jest, Playwright
- **Deployment**: Google Cloud Run, Vercel

---

## 🏗️ Architecture Overview

The platform uses a modern decoupled architecture:
1. **Frontend Layer**: React application interacting with REST APIs.
2. **Service Layer**: Dedicated services for activities, emissions, goals, and reports to enforce separation of concerns.
3. **Backend API**: Express server managing business logic and database interactions.
4. **Data Layer**: MongoDB storing activities and aggregated data.

---

## 🔒 Security Features

- **Strict Validation**: All input forms parse values securely, rejecting negative or NaN values.
- **XSS Protection**: String sanitization neutralizes script injection attempts.
- **HTTP Headers**: Vercel configuration strictly implements `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy`.
- **Environment Protection**: Sensitive keys and logs are heavily guarded through robust `.gitignore` rules.

---

## 📂 Project Structure

```
EcoBuddy-AI
├── backend/          # Node.js REST API
│   ├── src/          # Controllers, Models, Routes, Services
│   └── tests/        # API tests
├── frontend/         # React Application
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/    # Custom data-fetching hooks
│   │   ├── pages/
│   │   ├── services/ # Modular API clients
│   │   └── utils/    # Calculators and formatters
│   └── tests/        # UI and E2E specs
└── ...
```

---

## 🧪 Testing Instructions

The project features a rigorous test suite combining unit tests and end-to-end automation.

```bash
# Run unit tests (Jest)
npm run test

# Run E2E tests (Playwright)
npm run test:e2e
npm run test:e2e:ui
```

---

## 💻 Installation Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rutuja-131005/Carbon-Footprint-Awareness-Platform.git
   cd Carbon-Footprint-Awareness-Platform
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root of the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Create a `.env.local` file in the root of the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Deployment Instructions

### Frontend (Vercel)
```bash
cd frontend
vercel deploy --prod
```

### Backend (Google Cloud Run)
```bash
gcloud builds submit --tag gcr.io/your-project/ecobuddy-backend
gcloud run deploy ecobuddy-backend --image gcr.io/your-project/ecobuddy-backend --platform managed
```

---

## 🔮 Future Scope

- **Integration with Smart Meters**: Automated data collection for utilities.
- **Social Leaderboards**: Gamify reduction goals with friends and community.
- **Real-time Carbon Offset**: Direct purchasing of carbon credits through the platform.

---

## 👩‍💻 Developer Information

Built with ❤️ by **Rutuja**
[GitHub Profile](https://github.com/Rutuja-131005)