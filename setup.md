# Deployment Guide for Render

## 1. Commit Updates
Ensure the updated `package.json` (with dependencies fixed) and `tsconfig.json` are committed to your repository.

## 2. Create the Service on Render
1.  Log in to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
    *   **IMPORTANT:** Do **NOT** select "Static Site". This app uses a Node.js backend to save data, so it must be a Web Service.
3.  Connect your GitHub repository.

## 3. Configure Settings
Fill in the fields exactly as follows:

| Field | Value |
| :--- | :--- |
| **Name** | `secret-santa` (or your choice) |
| **Runtime** | **Node** |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

Click **Create Web Service**.

## 4. Data Persistence (Crucial)
**Warning:** On Render's free tier, the file system is ephemeral. This means if the server restarts (which happens often on free tier), **all saved Secret Santa events will be deleted.**

To prevent this, you must add a **Persistent Disk** (Paid feature, ~$7/mo):
1.  Go to your Web Service dashboard.
2.  Click **Disks** > **Add Disk**.
3.  **Name:** `santa-data`
4.  **Mount Path:** `/opt/render/project/src/data`
5.  **Size:** 1 GB

*If you do not add a disk, the app will work, but events will disappear after restarts.*