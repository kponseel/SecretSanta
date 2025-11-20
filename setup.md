# Deployment Guide for Render

This guide explains how to deploy this Secret Santa application to **Render** using your GitHub repository.

## 1. Commit files to GitHub
Ensure the new `package.json`, `vite.config.ts`, and updated `server.js` are committed and pushed to your GitHub repository.

## 2. Create the Service on Render

1.  Log in to your [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
    *   *Do **NOT** select "Static Site". This app requires a server to save data.*
3.  Connect your GitHub repository.

## 3. Configure Settings
Fill in the fields exactly as follows:

| Field | Value | Note |
| :--- | :--- | :--- |
| **Name** | `secret-santa` | Or any name you like |
| **Region** | (Choose closest) | e.g., Frankfurt or Oregon |
| **Branch** | `main` | |
| **Runtime** | **Node** | **Important!** |
| **Build Command** | `npm install && npm run build` | Installs deps and builds React |
| **Start Command** | `npm start` | Starts the Express server |
| **Instance Type** | Free | |

Click **Create Web Service**.

## 4. IMPORTANT: Data Persistence
**By default on Render (Free Tier), all data files are deleted when the app restarts.**

Because this app saves events to JSON files in the `data/` folder, you will lose your events if you redeploy or if the server sleeps and wakes up.

To prevent data loss, you must add a **Persistent Disk** (Paid Feature ~$7/mo) OR accept that data is temporary.

**To add a Persistent Disk:**
1.  Go to your Web Service dashboard.
2.  Click on the **Disks** tab on the left.
3.  Click **Add Disk**.
4.  **Name**: `santa-data`
5.  **Mount Path**: `/opt/render/project/src/data`
    *   *This is critical. It tells Render to save the `data` folder to the disk.*
6.  **Size**: 1 GB (Minimum)

Once the disk is added, your Secret Santa events will be safe permanently!