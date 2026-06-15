# Quick Start: Deploy to Cloud Run

## Prerequisites Checklist

- [ ] Google Cloud Account with billing enabled
- [ ] `gcloud` CLI installed: https://cloud.google.com/sdk/docs/install
- [ ] Docker Desktop installed
- [ ] MongoDB instance (Atlas recommended: https://www.mongodb.com/cloud/atlas)
- [ ] Authenticated with gcloud: `gcloud auth login`

---

## Quick Deploy (5 minutes)

### 1. Get Your MongoDB Connection String

If using MongoDB Atlas:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecobuddy-ai
```

### 2. Deploy Using PowerShell (Windows)

```powershell
# Open PowerShell in the project directory
cd "d:\Carbon Footprint Awareness Platform"

# Run deployment
.\deploy-windows.ps1 `
  -ProjectId "promtwar-challange3" `
  -MongoDBUri "YOUR_MONGODB_CONNECTION_STRING"
```

**Example:**
```powershell
.\deploy-windows.ps1 `
  -ProjectId "promtwar-challange3" `
  -MongoDBUri "mongodb+srv://user:pass@cluster0.abcd.mongodb.net/ecobuddy-ai"
```

### 3. Wait for Deployment

The script will:
1. ✅ Enable GCP APIs
2. ✅ Create Docker images
3. ✅ Push to Artifact Registry
4. ✅ Deploy backend service
5. ✅ Deploy frontend service

This takes **3-5 minutes**.

---

## Access Your Application

After deployment completes, you'll see:

```
Backend URL:  https://ecobuddy-backend-promtwar-challange3.us-central1.run.app
Frontend URL: https://ecobuddy-frontend-promtwar-challange3.us-central1.run.app
```

**Open the frontend URL in your browser** to use the application.

---

## Verify Deployment

```powershell
# Check service status
gcloud run services list --project=promtwar-challange3

# View backend logs
gcloud run logs read ecobuddy-backend --region=us-central1 --limit=50 --project=promtwar-challange3

# View frontend logs  
gcloud run logs read ecobuddy-frontend --region=us-central1 --limit=50 --project=promtwar-challange3
```

---

## Troubleshooting

### Services failed to start?
Check logs:
```powershell
gcloud run logs read ecobuddy-backend --region=us-central1 --project=promtwar-challange3 -f
```

### Connection timeout?
- Verify MongoDB connection string is correct
- For MongoDB Atlas, whitelist IP `0.0.0.0/0` in Network Access settings

### CORS errors?
- Ensure backend `CLIENT_ORIGIN` environment variable is set to frontend URL
- Restart backend service

---

## Common Commands

```powershell
# Update after code changes
# 1. Rebuild and push images
docker build -t us-central1-docker.pkg.dev/promtwar-challange3/ecobuddy/backend:latest ./backend
docker push us-central1-docker.pkg.dev/promtwar-challange3/ecobuddy/backend:latest

# 2. Redeploy
gcloud run deploy ecobuddy-backend `
  --image=us-central1-docker.pkg.dev/promtwar-challange3/ecobuddy/backend:latest `
  --region=us-central1 `
  --project=promtwar-challange3

# View real-time logs
gcloud run logs read ecobuddy-backend --region=us-central1 --project=promtwar-challange3 -f

# Delete services (if needed)
gcloud run services delete ecobuddy-backend --region=us-central1 --project=promtwar-challange3
gcloud run services delete ecobuddy-frontend --region=us-central1 --project=promtwar-challange3
```

---

## Architecture

```
┌─────────────────────────────────────────┐
│  https://ecobuddy-frontend.run.app      │
│  (React + Vite + Nginx)                 │
│  256 Mi RAM | 50 max instances          │
└──────────────┬──────────────────────────┘
               │ API calls
               │ (/api/...)
               ↓
┌─────────────────────────────────────────┐
│ https://ecobuddy-backend.run.app/api    │
│  (Node.js + Express)                    │
│  512 Mi RAM | 100 max instances         │
└──────────────┬──────────────────────────┘
               │ Database operations
               │
               ↓
┌─────────────────────────────────────────┐
│     MongoDB Atlas / Cloud SQL           │
│     (Your connection string)            │
└─────────────────────────────────────────┘
```

---

## Environment Variables Set Automatically

**Backend:**
- `PORT=8080` (Cloud Run requirement)
- `NODE_ENV=production`
- `MONGODB_URI=your_connection_string`
- `CLIENT_ORIGIN=https://ecobuddy-frontend-...`

**Frontend:**
- `VITE_API_URL=https://ecobuddy-backend-.../api`

---

## Support & Documentation

- Cloud Run Docs: https://cloud.google.com/run/docs
- Artifact Registry: https://cloud.google.com/artifact-registry
- Pricing: https://cloud.google.com/run/pricing

---

**Ready to deploy? Run the PowerShell script above!** 🚀
