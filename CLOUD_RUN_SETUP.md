# Google Cloud Run Deployment Guide

This guide will help you deploy the EcoBuddy Carbon Footprint Platform to Google Cloud Run.

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed and authenticated
3. **Docker** installed on your machine
4. **MongoDB instance** (Cloud SQL, MongoDB Atlas, or external)
5. **Project ID**: `promtwar-challange3`

## Installation Steps

### 1. Install and Configure gcloud CLI

```bash
# Install gcloud CLI from: https://cloud.google.com/sdk/docs/install
# Then initialize it:
gcloud init
gcloud auth login
```

### 2. Prepare MongoDB Connection

You need a MongoDB connection string. Options:

**Option A: MongoDB Atlas (Recommended)**
- Go to https://www.mongodb.com/cloud/atlas
- Create a cluster and get your connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/ecobuddy-ai`

**Option B: Google Cloud SQL**
```bash
gcloud sql instances create ecobuddy-mongodb --database-version MONGO_7_0 --tier db-f1-micro
```

### 3. Deploy Using PowerShell (Windows)

```powershell
# Navigate to project directory
cd "d:\Carbon Footprint Awareness Platform"

# Run deployment script with your MongoDB URI
.\deploy-windows.ps1 `
  -ProjectId "promtwar-challange3" `
  -MongoDBUri "mongodb+srv://username:password@cluster.mongodb.net/ecobuddy-ai" `
  -Region "us-central1"
```

### 4. Deploy Using Bash (Linux/Mac)

```bash
# Navigate to project directory
cd "Carbon Footprint Awareness Platform"

# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh promtwar-challange3 "mongodb+srv://username:password@cluster.mongodb.net/ecobuddy-ai" us-central1
```

## Manual Deployment Steps

If scripts don't work, follow these manual steps:

### Step 1: Set Project and Enable APIs

```bash
gcloud config set project promtwar-challange3

gcloud services enable \
  containerregistry.googleapis.com \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com
```

### Step 2: Create Artifact Registry Repository

```bash
gcloud artifacts repositories create ecobuddy \
  --repository-format=docker \
  --location=us-central1
```

### Step 3: Configure Docker Authentication

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### Step 4: Build and Push Backend

```bash
# From project root
docker build -t us-central1-docker.pkg.dev/promtwar-challange3/ecobuddy/backend:latest ./backend
docker push us-central1-docker.pkg.dev/promtwar-challange3/ecobuddy/backend:latest
```

### Step 5: Build and Push Frontend

```bash
# Build with backend API URL
docker build \
  -t us-central1-docker.pkg.dev/promtwar-challange3/ecobuddy/frontend:latest \
  --build-arg VITE_API_URL=https://ecobuddy-backend-promtwar-challange3.us-central1.run.app/api \
  ./frontend

docker push us-central1-docker.pkg.dev/promtwar-challange3/ecobuddy/frontend:latest
```

### Step 6: Deploy Backend Service

```bash
gcloud run deploy ecobuddy-backend \
  --image=us-central1-docker.pkg.dev/promtwar-challange3/ecobuddy/backend:latest \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --set-env-vars="MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecobuddy-ai,NODE_ENV=production,PORT=8080" \
  --memory=512Mi \
  --cpu=1 \
  --timeout=3600 \
  --max-instances=100
```

### Step 7: Deploy Frontend Service

```bash
gcloud run deploy ecobuddy-frontend \
  --image=us-central1-docker.pkg.dev/promtwar-challange3/ecobuddy/frontend:latest \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=256Mi \
  --cpu=1 \
  --timeout=3600 \
  --max-instances=50
```

## Post-Deployment

### View Service URLs

```bash
# Backend
gcloud run services describe ecobuddy-backend --region=us-central1 --format='value(status.url)'

# Frontend
gcloud run services describe ecobuddy-frontend --region=us-central1 --format='value(status.url)'
```

### Monitor Logs

```bash
# Backend logs
gcloud run logs read ecobuddy-backend --region=us-central1 --limit=50

# Frontend logs
gcloud run logs read ecobuddy-frontend --region=us-central1 --limit=50

# Real-time logs
gcloud run logs read ecobuddy-backend --region=us-central1 --limit=0 -f
```

### Update Services

To update after code changes:

```bash
# Rebuild and push
docker build -t us-central1-docker.pkg.dev/promtwar-challange3/ecobuddy/backend:latest ./backend
docker push us-central1-docker.pkg.dev/promtwar-challange3/ecobuddy/backend:latest

# Redeploy (same command as initial deploy)
gcloud run deploy ecobuddy-backend \
  --image=us-central1-docker.pkg.dev/promtwar-challange3/ecobuddy/backend:latest \
  --region=us-central1 \
  --update-env-vars="MONGODB_URI=..." \
  ...
```

## Environment Variables Reference

### Backend (`ecobuddy-backend`)

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `PORT` | `8080` | Port Cloud Run listens on (usually 8080) |
| `NODE_ENV` | `production` | Environment mode |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB connection string |
| `CLIENT_ORIGIN` | `https://ecobuddy-frontend-...` | Frontend URL for CORS |

### Frontend (`ecobuddy-frontend`)

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `VITE_API_URL` | `https://ecobuddy-backend-.../api` | Backend API URL |

## Troubleshooting

### "Container failed to start"
- Check logs: `gcloud run logs read SERVICE_NAME --region=us-central1`
- Ensure PORT environment variable is set to 8080
- Verify MongoDB connection string is correct

### "Permission denied" when pushing to Artifact Registry
```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### CORS errors in frontend
- Update backend's `CLIENT_ORIGIN` environment variable with the frontend URL
- Restart the backend service

### Database connection timeouts
- Ensure MongoDB instance is accessible from Cloud Run
- For MongoDB Atlas, whitelist Cloud Run's IP (0.0.0.0/0 for testing)
- Check network connectivity: `gcloud run services update SERVICE --region=REGION --vpc-connector=...`

## Cost Optimization

- **Backend**: 512Mi memory, 1 CPU, up to 100 instances
- **Frontend**: 256Mi memory, 1 CPU, up to 50 instances
- Use **Cloud CDN** for frontend static assets
- Set **max-instances** based on expected traffic
- Monitor with **Cloud Monitoring** dashboard

## Cleanup

To delete deployed services:

```bash
gcloud run services delete ecobuddy-backend --region=us-central1
gcloud run services delete ecobuddy-frontend --region=us-central1
gcloud artifacts delete us-central1-docker.pkg.dev/promtwar-challange3/ecobuddy/backend
gcloud artifacts delete us-central1-docker.pkg.dev/promtwar-challange3/ecobuddy/frontend
```

---

For more help, visit: https://cloud.google.com/run/docs
