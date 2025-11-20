# Deployment Guide for OVH (Hybrid PHP/React)

This application uses a **React frontend** and a simple **PHP backend** to store data in JSON files.

## 1. Build the React App
Open your terminal in the project folder and run:

```bash
npm install
npm run build
```

This will create a `dist` (or `build`) folder containing the static files (index.html, js, css).

## 2. Prepare Files for Upload
You need to upload the following to your OVH server (typically in `www` or `public_html`):

1.  **All contents of the `dist` folder** (index.html, assets, etc.).
2.  **The `api.php` file** (located in the root of this project).

Your server structure should look like this:
```
/www
  ├── assets/
  ├── index.html
  ├── api.php
```

## 3. Set Permissions (Important!)
For the application to save data, the PHP script needs permission to create and write to the `data` folder.

1.  Connect to your hosting via FTP (FileZilla) or OVH File Manager.
2.  If the `data` folder was not created automatically by the script, create it manually in the same directory as `api.php`.
3.  **Set Permissions (CHMOD)**:
    *   Right-click the `data` folder (or the root folder if `data` doesn't exist yet).
    *   Select **File Permissions**.
    *   Set the numeric value to **755** (or **777** if 755 doesn't work, though 755 is safer).
    *   Ensure the PHP script can write files into this directory.

## 4. Verify
1.  Open your website URL.
2.  Create a test event.
3.  If it gets stuck on "Saving..." or shows an error, check the permissions of the `data` folder again.
4.  Check if a `.json` file was created inside the `data` folder on your server.

## Troubleshooting
*   **404 Error on API**: Ensure `api.php` is in the same folder as `index.html`.
*   **500 Error**: Usually a permissions issue. Check server logs or try CHMOD 777 on the `data` folder temporarily.
