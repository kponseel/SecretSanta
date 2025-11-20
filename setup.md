# Deployment Guide for Render (Node.js)

This guide explains how to deploy this Secret Santa application to **Render** using a GitHub repository.

## 1. Preparation
Ensure you have the following files in your repository root:
- `server.js` (The backend server)
- `package.json` (Dependencies configuration)

### Update your `package.json`
Since Render needs to know how to build and start your app, ensure your `package.json` has these scripts and dependencies. If you don't have one, run `npm init -y` and install the packages.

**Required Commands:**
```bash
npm install express
```

**Recommended `package.json` structure:**
```json
{
  "name": "secret-santa-app",
  "version": "1.0.0",
  "type": "module", 
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
    ... (other existing deps)
  }
}
```
*Note: If using TypeScript/Vite, your build script should create a `dist` folder.*

## 2. Push to GitHub
Commit all your files (including `server.js`, `src/`, `package.json`, `tsconfig.json`, etc.) and push them to a GitHub repository.

## 3. Deploy on Render

1.  Log in to [Render.com](https://render.com).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    *   **Name**: `secret-santa-organizer`
    *   **Region**: Closest to you.
    *   **Branch**: `main` (or master).
    *   **Runtime**: **Node**
    *   **Build Command**: `npm install && npm run build`
        *   *This installs dependencies and compiles the React app into the `dist` folder.*
    *   **Start Command**: `npm start`
        *   *This runs `node server.js`, which serves the `dist` folder and the API.*
5.  Click **Create Web Service**.

## 4. Important: Data Persistence (Disks)
**Warning:** On Render's free tier, the filesystem is **ephemeral**. This means every time you deploy or the server restarts (which happens automatically), **all files in the `data/` folder will be deleted**, and your event data will be lost.

To fix this, you must use a **Disk** (paid feature) or an external database.

### How to add a Disk (Paid):
1.  Go to your Web Service settings on Render.
2.  Click **Disks**.
3.  Click **Add Disk**.
4.  **Name**: `santa-data`
5.  **Mount Path**: `/opt/render/project/src/data`
    *   *This ensures the `data` folder server.js uses is actually stored on the persistent disk.*
6.  **Size**: 1GB is plenty.

Once the disk is attached, your JSON files will survive restarts and deployments.

## 5. Local Development
To run the full stack locally:

1.  Build the frontend: `npm run build`
2.  Start the server: `node server.js`
3.  Go to `http://localhost:3000`

Alternatively, you can use Vite proxying in `vite.config.ts` to forward `/api` requests to the Express server running on a different port, but building and serving is the simplest way to verify the exact production behavior.
