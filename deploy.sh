#!/bin/bash

# Cloud Run Deployment Script for EcoBuddy Carbon Footprint Platform
# Usage: ./deploy.sh <PROJECT_ID> [MONGODB_URI] [REGION]

PROJECT_ID="${1:-promtwar-challange3}"
MONGODB_URI="${2:-mongodb+srv://username:password@cluster.mongodb.net/ecobuddy-ai}"
REGION="${3:-us-central1}"
BACKEND_SERVICE="ecobuddy-backend"
FRONTEND_SERVICE="ecobuddy-frontend"
ARTIFACT_REPO="ecobuddy"

echo "=========================================="
echo "EcoBuddy Cloud Run Deployment"
echo "=========================================="
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "MongoDB URI: ${MONGODB_URI:0:30}..."
echo ""

# Set the gcloud project
echo "Setting GCP project..."
gcloud config set project "$PROJECT_ID"

# Enable required APIs
echo "Enabling required GCP APIs..."
gcloud services enable \
  containerregistry.googleapis.com \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com

# Create Artifact Registry repository if it doesn't exist
echo "Creating Artifact Registry repository..."
gcloud artifacts repositories create "$ARTIFACT_REPO" \
  --repository-format=docker \
  --location="$REGION" \
  --quiet 2>/dev/null || echo "Repository already exists"

# Configure Docker authentication
echo "Configuring Docker authentication..."
gcloud auth configure-docker "$REGION-docker.pkg.dev"

# Build and push backend image
echo ""
echo "Building and pushing backend image..."
BACKEND_IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPO/backend:latest"
docker build -t "$BACKEND_IMAGE" ./backend
docker push "$BACKEND_IMAGE"

# Build and push frontend image
echo ""
echo "Building and pushing frontend image..."
FRONTEND_IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$ARTIFACT_REPO/frontend:latest"
docker build \
  -t "$FRONTEND_IMAGE" \
  --build-arg "VITE_API_URL=https://$BACKEND_SERVICE-$PROJECT_ID.$REGION.run.app/api" \
  ./frontend
docker push "$FRONTEND_IMAGE"

# Deploy backend to Cloud Run
echo ""
echo "Deploying backend to Cloud Run..."
gcloud run deploy "$BACKEND_SERVICE" \
  --image="$BACKEND_IMAGE" \
  --region="$REGION" \
  --platform=managed \
  --allow-unauthenticated \
  --set-env-vars="MONGODB_URI=$MONGODB_URI,NODE_ENV=production,PORT=8080,CLIENT_ORIGIN=https://$FRONTEND_SERVICE-$PROJECT_ID.$REGION.run.app" \
  --memory=512Mi \
  --cpu=1 \
  --timeout=3600 \
  --max-instances=100

# Get backend URL
BACKEND_URL=$(gcloud run services describe "$BACKEND_SERVICE" \
  --region="$REGION" \
  --format='value(status.url)')

echo "Backend deployed at: $BACKEND_URL"

# Deploy frontend to Cloud Run
echo ""
echo "Deploying frontend to Cloud Run..."
gcloud run deploy "$FRONTEND_SERVICE" \
  --image="$FRONTEND_IMAGE" \
  --region="$REGION" \
  --platform=managed \
  --allow-unauthenticated \
  --memory=256Mi \
  --cpu=1 \
  --timeout=3600 \
  --max-instances=50

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe "$FRONTEND_SERVICE" \
  --region="$REGION" \
  --format='value(status.url)')

echo "Frontend deployed at: $FRONTEND_URL"

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo ""
echo "Next steps:"
echo "1. Ensure MongoDB connection is working"
echo "2. Test the application at: $FRONTEND_URL"
echo "3. Monitor logs: gcloud run logs read $BACKEND_SERVICE --region=$REGION"
echo ""
