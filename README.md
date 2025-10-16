# 🍲 CookBook App - Application de Gestion de Recettes

Bienvenue dans l'application CookBook ! [cite_start]Ce projet est une application fullstack moderne et performante [cite: 2] développée avec :
* **Frontend** : React, TypeScript, Vite, Tailwind CSS, shadcn/ui.
* **Backend** : FastAPI (Python), PostgreSQL, SQLModel.
* **DevOps** : Docker, Docker Compose, Kubernetes (Kind).

## 🚀 Démarrage Rapide

*Instructions complètes (incluant Docker Compose et Kubernetes) à venir à l'Étape 7.*

## 📂 Structure du Projet

.
├── backend/            # API FastAPI et configuration Python
│   └── app/            # Code source modulaire
├── frontend/           # Application cliente React/Vite/TS
│   └── src/

├── k8s/                # Manifestes Kubernetes (Kind)
├── docker-compose.yml  # Déploiement de développement local (Compose)
└── README.md

## 🛠️ Instructions de Démarrage

### Mode 1 : Développement Local Simplifié (Docker Compose)

Ce mode est idéal pour le développement rapide et le rechargement automatique (Hot Reload).

1.  **Installation des dépendances (Frontend/Backend) :**
    ```bash
    # Backend (dans cookbook-app/backend)
    cd backend
    python3.11 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    
    # Frontend (dans cookbook-app/frontend)
    cd ../frontend
    npm install
    ```
2.  **Lancement des Conteneurs :**
    Exécutez cette commande depuis le répertoire racine `cookbook-app` :
    ```bash
    docker compose up --build
    ```
3.  **Accès :**
    * **Frontend (App) :** `http://localhost:3000`
    * **Backend (API Docs) :** `http://localhost:8000/docs`

### Mode 2 : Déploiement Local sur Kubernetes (Kind)

Ce mode simule un environnement de production et nécessite un cluster Kind fonctionnel.

1.  **Préparation du Cluster :**
    ```bash
    kind create cluster --name cookbook-dev
    docker compose build # S'assurer que les images sont à jour
    kind load docker-image cookbook-app-backend cookbook-app-frontend --name cookbook-dev
    ```
2.  **Déploiement des Manifestes :**
    ```bash
    kubectl apply -f k8s/config.yaml
    kubectl apply -f k8s/db.yaml
    kubectl apply -f k8s/backend.yaml
    kubectl apply -f k8s/frontend.yaml
    
    kubectl get all # Vérifier que tous les Pods sont "Running" (1/1)
    ```
3.  **Application des Migrations (Une fois les Pods Backend démarrés) :**
    ```bash
    BACKEND_POD=$(kubectl get pods -l app=cookbook-backend -o jsonpath='{.items[0].metadata.name}')
    kubectl exec -it $BACKEND_POD -- /bin/bash -c "alembic upgrade head"
    ```
4.  **Accès :**
    * **Frontend (App) :** `http://localhost:30080` (Le port NodePort)

## 🥳 Conclusion

L'application CookBook est complète, de la base de données PostgreSQL à l'interface utilisateur React/shadcn/ui, et est entièrement orchestrée par Docker et Kubernetes (Kind).

**Ceci conclut le plan d'action séquentiel de la CookBook App. Le projet est prêt à être utilisé et développé.**