# Building Libraries — Design Document

## Overview

A charity product shop for handmade pottery. Built with Next.js + Vercel (same pattern as CertWatch and the Coffee Quiz).

---

## Tech Stack

| Layer      | Technology                        | Purpose                              |
|------------|-----------------------------------|--------------------------------------|
| Frontend + Backend | Next.js 14 (App Router, TS) | Web app and API routes           |
| Storage    | Google Sheets                     | Product catalogue (name, price, etc) |
| Images     | Google Drive                      | Product photos                       |
| Auth       | Google Service Account            | Server-to-server API access          |
| Hosting    | Vercel                            | Deployment + ISR                     |

---

## Pages

| Route    | Description                                                 |
|----------|-------------------------------------------------------------|
| `/`      | Public shop — reads products from Sheets, shows order form  |
| `/admin` | Admin GUI — upload image to Drive, write product to Sheets  |

## API Routes

| Route              | Method | Description                                    |
|--------------------|--------|------------------------------------------------|
| `/api/products`    | GET    | Reads all rows from Google Sheets              |
| `/api/upload`      | POST   | Uploads image to Drive, appends row to Sheets  |

---

## Google Sheets Schema

**Sheet name:** `Products`

| Column | Name        | Example                        |
|--------|-------------|--------------------------------|
| A      | id          | prod_1718000000000             |
| B      | name        | Hand-Thrown Mug                |
| C      | description | A cozy mug with terracotta…    |
| D      | price       | 25                             |
| E      | imageUrl    | https://drive.google.com/uc?… |
| F      | createdAt   | 2026-06-11T03:00:00.000Z       |

---

## Setup Instructions

### 1. Google Cloud Project
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable **Google Drive API** and **Google Sheets API**
4. Create a **Service Account** (IAM & Admin → Service Accounts)
5. Generate a JSON key for the service account

### 2. Google Drive Folder
1. Create a folder in Google Drive for product images
2. Share it with the service account email (Editor access)
3. Copy the folder ID from the URL

### 3. Google Sheets
1. Create a new Google Sheet
2. Rename the first sheet tab to `Products`
3. Add header row: `id | name | description | price | imageUrl | createdAt`
4. Share the sheet with the service account email (Editor access)
5. Copy the spreadsheet ID from the URL

### 4. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in the values.

For Vercel deployment, add the same variables in the Vercel dashboard under Project Settings → Environment Variables.

---

## Environment Variables

```
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
GOOGLE_DRIVE_FOLDER_ID
GOOGLE_SHEET_ID
```
