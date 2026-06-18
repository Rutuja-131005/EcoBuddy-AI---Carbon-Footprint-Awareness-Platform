# Cloud Run Deployment Script for EcoBuddy - Windows PowerShell
# Usage: .\deploy-windows.ps1 -ProjectId "promtwar-challange3" -MongoDBUri "..." -Region "us-central1"

param(
    [string]$ProjectId = "promtwar-challange3",
    [string]$MongoDBUri = "mongodb+srv://username:password@cluster.mongodb.net/ecobuddy-ai",
    [string]$Region = "us-central1",
    [string]$BackendService = "ecobuddy-backend",
    [string]$FrontendService = "ecobuddy-frontend",
    [string]$ArtifactRepo = "ecobuddy"
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "EcoBuddy Cloud Run Deployment (Windows)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Project ID: $ProjectId" -ForegroundColor Yellow
Write-Host "Region: $Region" -ForegroundColor Yellow
Write-Host "MongoDB URI: $($MongoDBUri.Substring(0, 30))..." -ForegroundColor Yellow
Write-Host ""

# Set the gcloud project
Write-Host "Setting GCP project..." -ForegroundColor Green
gcloud config set project $ProjectId

# Enable required APIs
Write-Host "Enabling required GCP APIs..." -ForegroundColor Green
gcloud services enable `
  containerregistry.googleapis.com `
  artifactregistry.googleapis.com `
  run.googleapis.com `
  cloudbuild.googleapis.com

# Create Artifact Registry repository
Write-Host "Creating Artifact Registry repository..." -ForegroundColor Green
try {
    gcloud artifacts repositories create $ArtifactRepo `
      --repository-format=docker `
      --location=$Region `
      --quiet
} catch {
    Write-Host "Repository already exists" -ForegroundColor Yellow
}

# Configure Docker authentication
Write-Host "Configuring Docker authentication..." -ForegroundColor Green
gcloud auth configure-docker "$Region-docker.pkg.dev"

# Build and push backend image
Write-Host "`nBuilding and pushing backend image..." -ForegroundColor Green
$BackendImage = "$Region-docker.pkg.dev/$ProjectId/$ArtifactRepo/backend:latest"
gcloud builds submit --tag $BackendImage ./backend

# Build and push frontend image
Write-Host "`nBuilding and pushing frontend image..." -ForegroundColor Green
$FrontendImage = "$Region-docker.pkg.dev/$ProjectId/$ArtifactRepo/frontend:latest"
$BackendUrl = "https://$BackendService-$ProjectId.$Region.run.app/api"
$CloudBuildConfig = @"
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-t', '`$_IMAGE', '--build-arg', 'VITE_API_URL=`$_VITE_API_URL', '-f', 'frontend/Dockerfile', '.']
- name: 'gcr.io/cloud-builders/docker'
  args: ['push', '`$_IMAGE']
"@
$CloudBuildConfig | Out-File -FilePath "cloudbuild-tmp.yaml" -Encoding utf8
gcloud builds submit --config cloudbuild-tmp.yaml --substitutions="_IMAGE=$FrontendImage,_VITE_API_URL=$BackendUrl" .
Remove-Item "cloudbuild-tmp.yaml"

# Deploy backend to Cloud Run
Write-Host "`nDeploying backend to Cloud Run..." -ForegroundColor Green
gcloud run deploy $BackendService `
  --image=$BackendImage `
  --region=$Region `
  --platform=managed `
  --allow-unauthenticated `
  --set-env-vars="MONGODB_URI=$MongoDBUri,NODE_ENV=production,CLIENT_ORIGIN=https://$FrontendService-$ProjectId.$Region.run.app" `
  --memory=512Mi `
  --cpu=1 `
  --timeout=3600 `
  --max-instances=10

# Get backend URL
$BackendURL = (gcloud run services describe $BackendService `
  --region=$Region `
  --format='value(status.url)')

Write-Host "Backend deployed at: $BackendURL" -ForegroundColor Cyan

# Deploy frontend to Cloud Run
Write-Host "`nDeploying frontend to Cloud Run..." -ForegroundColor Green
gcloud run deploy $FrontendService `
  --image=$FrontendImage `
  --region=$Region `
  --platform=managed `
  --allow-unauthenticated `
  --memory=256Mi `
  --cpu=1 `
  --timeout=3600 `
  --max-instances=10

# Get frontend URL
$FrontendURL = (gcloud run services describe $FrontendService `
  --region=$Region `
  --format='value(status.url)')

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Backend URL:  $BackendURL" -ForegroundColor Yellow
Write-Host "Frontend URL: $FrontendURL" -ForegroundColor Yellow
Write-Host "Project ID:   $ProjectId" -ForegroundColor Yellow
Write-Host "Region:       $Region" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Ensure MongoDB connection is working" -ForegroundColor White
Write-Host "2. Test the application at: $FrontendURL" -ForegroundColor White
Write-Host "3. Monitor logs: gcloud run logs read $BackendService --region=$Region" -ForegroundColor White
Write-Host ""
