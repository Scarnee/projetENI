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
-   **CI/CD** : GitHub Actions pour build, push et déploiement automatique.
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
-   Reverse-proxy Nginx gère les routes Angular et les appels `/api`.
-   L’image Docker est construite et publiée à chaque commit, et la stratégie `imagePullPolicy: Always` garantit la récupération de la dernière version.

### Backend Node.js / Express

-   API REST exposant les endpoints `/api/tasks`.
-   CORS activé pour permettre la communication via Nginx.
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
-   Les URLs backend pour le frontend passent par Nginx (`/api`).

---

## 5. Nom de domaine

-   DNS configuré sur OVH.
-   `A record` pour `@` et `www` pointant vers l’IP publique du LoadBalancer frontend.

---

## 6. CI/CD avec GitHub Actions

### Pipelines configurés

1. **Frontend Build, Push & Deploy**

    - Build de l’image Docker du frontend Angular.
    - Push de l’image vers **Azure Container Registry (ACR)**.
    - Mise à jour automatique du déploiement AKS via `kubectl` (connexion avec un `kubeconfig` stocké dans GitHub Secrets).
    - `imagePullPolicy: Always` pour forcer l’utilisation de la dernière image.

2. **Backend Build, Push & Deploy**

    - Build de l’image Docker du backend Node.js.
    - Push de l’image vers **ACR**.
    - Déploiement automatique sur AKS avec `kubectl`.

---

## 7. Secrets GitHub utilisés

-   `ACR_LOGIN_SERVER` : serveur ACR (`xxx.azurecr.io`)
-   `ACR_USERNAME` : utilisateur de connexion ACR
-   `ACR_PASSWORD` : mot de passe ACR
-   `KUBECONFIG` : contenu du fichier kubeconfig pour accéder au cluster AKS

---

## 8. Vérifications

-   **Frontend** : accéder via le nom de domaine ou l’IP publique du LoadBalancer.
-   **Backend interne** : tester avec `kubectl exec` + `curl` depuis un pod frontend.
-   **Logs** :

```bash
kubectl logs -n projet-devops-jordane <pod-name>
```
