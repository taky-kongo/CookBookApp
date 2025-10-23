#!/usr/bin/env bash
set -euo pipefail

# Script simple de déploiement exécuté sur le VPS
# - Tire les images depuis GHCR (docker pull)
# - Charge les images dans kind (kind load docker-image)
# - Applique les manifests k8s
# - Exécute alembic upgrade head dans le pod backend

REPO_DIR=~/project_kub_malick
cd "$REPO_DIR"

echo "Pulling images from GHCR..."
docker pull ghcr.io/taky-kongo/cookbook-app-backend:latest
docker pull ghcr.io/taky-kongo/cookbook-app-frontend:latest

echo "Loading images into kind..."
kind load docker-image ghcr.io/taky-kongo/cookbook-app-backend:latest || true
kind load docker-image ghcr.io/taky-kongo/cookbook-app-frontend:latest || true

echo "Applying k8s manifests..."
kubectl apply -f ./k8s/

# Wait for deployments
echo "Waiting for deployments to be ready..."
kubectl rollout status deployment/cookbook-backend-deployment --timeout=120s || true
kubectl rollout status deployment/cookbook-frontend-deployment --timeout=120s || true

# Run alembic migration
POD=$(kubectl get pods -l app=cookbook-backend -o jsonpath='{.items[0].metadata.name}')
if [ -n "$POD" ]; then
  echo "Running alembic on pod $POD"
  kubectl exec -it "$POD" -- alembic upgrade head || true
else
  echo "No backend pod found to run alembic"
fi

echo "Deployment script finished."