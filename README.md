# Projet DevOps : Frontend Angular & Backend Node.js sur AKS

[![Azure](https://img.shields.io/badge/Azure-AKS-blue)](https://azure.microsoft.com/services/kubernetes-service/)
[![Docker](https://img.shields.io/badge/Docker-Containers-blue)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-blue)](https://github.com/features/actions)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 1. Description

Ce projet est une **application de gestion de tâches** déployée sur **Azure Kubernetes Service (AKS)**.

Composants principaux :

-   **Frontend** : Angular, servi via **Nginx** avec reverse-proxy vers le backend.
-   **Backend** : Node.js / Express exposant une API REST.
-   **Base de données** : MySQL (StatefulSet Kubernetes).
-   **Conteneurisation** : Docker, images stockées sur **Azure Container Registry (ACR)**.
-   **Déploiement** : Kubernetes manifests (Deployments, Services, LoadBalancer, reverse proxy Nginx).
-   **Nom de domaine** : DNS configuré sur OVH, pointant vers l’IP publique du frontend.

---

## 2. Architecture

-   Le frontend est exposé au public via un **LoadBalancer** AKS.
-   Le backend est accessible en interne via un **ClusterIP**.
-   Le reverse proxy Nginx permet au frontend d’appeler le backend via `/api` pour éviter les problèmes **CORS**.
-   La base MySQL est déployée en **StatefulSet** et accessible uniquement depuis le cluster.

---

## 3. Développement

### Frontend Angular

-   Services Angular consomment l’API backend via une URL configurée (`/api/tasks`).
-   Build Angular généré dans le dossier `dist/` et servi par Nginx.
-   Reverse-proxy Nginx gère les routes Angular pour supporter le router et les requêtes `/api`.

### Backend Node.js / Express

-   API REST exposant les endpoints `/api/tasks`.
-   CORS activé pour permettre la communication interne via Nginx.
-   Conteneurisé avec Docker et déployé dans AKS.

### Base de données MySQL

-   Déployée en **StatefulSet** pour persistance.
-   Service `ClusterIP` pour l’accès interne depuis le backend.

---

## 4. Déploiement Kubernetes

-   **Namespace dédié** : `projet-devops-jordane`.
-   **Frontend** : Deployment + Service LoadBalancer + reverse-proxy Nginx.
-   **Backend** : Deployment + Service ClusterIP.
-   **MySQL** : StatefulSet + Service ClusterIP.
-   Les URLs backend pour le frontend passent par Nginx (`/api`) pour éviter les erreurs CORS.

---

## 5. Nom de domaine

-   DNS configuré sur OVH.
-   `A record` pour `@` et `www` pointant vers l’IP publique du frontend LoadBalancer.

---

## 6. CI/CD avec GitHub Actions

### Pipelines

1. **Frontend Build & Push**

    - Build l’image Docker du frontend Angular.
    - Pousse l’image sur **Azure Container Registry (ACR)**.
    - Assure que l’image est toujours à jour avec `imagePullPolicy: Always`.

2. **Backend Build & Push**
    - Build l’image Docker du backend Node.js.
    - Pousse l’image sur **ACR**.

> Remarque : Déploiement automatique sur AKS depuis la pipeline nécessite un **service principal Azure** avec droits AKS.  
> Dans notre configuration, le déploiement des pods se fait manuellement avec `kubectl apply -f <manifest.yaml>`.

---

## 7. Vérifications

-   Frontend : accéder via le nom de domaine ou l’IP publique du LoadBalancer.
-   Backend interne : tester avec `kubectl exec` et `curl` depuis un pod frontend.
-   Logs des pods :

```bash
kubectl logs -n projet-devops-jordane <pod-name>
```
