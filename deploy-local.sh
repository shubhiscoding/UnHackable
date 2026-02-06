#!/bin/bash

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   UnHackable - Local Kubernetes Deployment Script${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}\n"

# Configuration
NAMESPACE="demo"
APP_NAME="unhackable"
IMAGE_NAME="unhackable:local"
SERVICE_PORT=80

# Step 1: Build Docker Image
echo -e "${YELLOW}[1/7]${NC} Building Docker image..."
docker build -t $IMAGE_NAME -f dockerfile . || {
    echo -e "${RED}✗ Docker build failed!${NC}"
    exit 1
}
echo -e "${GREEN}✓ Docker image built successfully${NC}\n"

# Step 2: Create Namespace
echo -e "${YELLOW}[2/7]${NC} Creating namespace '$NAMESPACE'..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f - || {
    echo -e "${RED}✗ Failed to create namespace${NC}"
    exit 1
}
echo -e "${GREEN}✓ Namespace created${NC}\n"

# Step 3: Create Secrets
echo -e "${YELLOW}[3/7]${NC} Creating application secrets..."
kubectl create secret generic ${APP_NAME}-secrets \
  --from-literal=DATABASE_URI="mongodb://demo:demo@localhost:27017/unhackable" \
  --from-literal=NEXT_PUBLIC_RPC_URL="https://demo-rpc.example.com" \
  --from-literal=GOOGLE_CLIENT_ID="demo-client-id" \
  --from-literal=GOOGLE_CLIENT_SECRET="demo-secret" \
  --from-literal=AUTH_SECRET="demo-auth-secret-$(openssl rand -hex 16)" \
  --from-literal=NEXTAUTH_URL="http://localhost:3000" \
  -n $NAMESPACE --dry-run=client -o yaml | kubectl apply -f - || {
    echo -e "${RED}✗ Failed to create secrets${NC}"
    exit 1
}
echo -e "${GREEN}✓ Secrets created${NC}\n"

# Step 4: Prepare Deployment File
echo -e "${YELLOW}[4/7]${NC} Preparing deployment configuration..."
sed "s|IMAGE_PLACEHOLDER|$IMAGE_NAME|g" k8s/deployment.yaml > /tmp/deployment-local.yaml
echo -e "${GREEN}✓ Deployment configuration ready${NC}\n"

# Step 5: Apply Deployment
echo -e "${YELLOW}[5/7]${NC} Deploying application to Kubernetes..."
kubectl apply -f /tmp/deployment-local.yaml -n $NAMESPACE || {
    echo -e "${RED}✗ Deployment failed${NC}"
    exit 1
}
kubectl apply -f k8s/service.yaml -n $NAMESPACE || {
    echo -e "${RED}✗ Service creation failed${NC}"
    exit 1
}
echo -e "${GREEN}✓ Application deployed${NC}\n"

# Step 6: Wait for Rollout
echo -e "${YELLOW}[6/7]${NC} Waiting for deployment to be ready..."
kubectl rollout status deployment/$APP_NAME -n $NAMESPACE --timeout=300s || {
    echo -e "${RED}✗ Deployment rollout failed${NC}"
    echo -e "${YELLOW}Checking pod status...${NC}"
    kubectl get pods -n $NAMESPACE -l app=$APP_NAME
    kubectl describe pods -n $NAMESPACE -l app=$APP_NAME
    exit 1
}
echo -e "${GREEN}✓ Deployment ready${NC}\n"

# Step 7: Display Access Information
echo -e "${YELLOW}[7/7]${NC} Gathering access information...\n"

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✓ Deployment Successful!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}\n"

echo -e "${BLUE}📦 Pods:${NC}"
kubectl get pods -n $NAMESPACE -l app=$APP_NAME

echo -e "\n${BLUE}🌐 Service:${NC}"
kubectl get svc -n $NAMESPACE -l app=$APP_NAME

echo -e "\n${BLUE}🔗 Access URLs:${NC}"
echo -e "   Local: ${GREEN}http://localhost${NC}"
echo -e "   Port: ${GREEN}$SERVICE_PORT${NC}"

echo -e "\n${BLUE}📊 Useful Commands:${NC}"
echo -e "   View logs:    ${YELLOW}kubectl logs -f -n $NAMESPACE -l app=$APP_NAME${NC}"
echo -e "   Check pods:   ${YELLOW}kubectl get pods -n $NAMESPACE${NC}"
echo -e "   Check service:${YELLOW}kubectl get svc -n $NAMESPACE${NC}"
echo -e "   Port forward: ${YELLOW}kubectl port-forward -n $NAMESPACE svc/$APP_NAME 8080:80${NC}"
echo -e "   Delete demo:  ${YELLOW}kubectl delete namespace $NAMESPACE${NC}"

echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}\n"

# Optional: Open browser (uncomment if you want auto-open)
# sleep 2
# echo -e "${BLUE}Opening browser...${NC}"
# xdg-open http://localhost 2>/dev/null || open http://localhost 2>/dev/null || echo "Please open http://localhost in your browser"
