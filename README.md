# Freezer 🧊

<div align="center">
  
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![AWS](https://img.shields.io/badge/AWS_S3-232F3E?style=for-the-badge&logo=amazon-aws)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

</div>

<p align="center">A sleek, modern S3 file explorer built with Next.js featuring JWT authentication and advanced file management capabilities.</p>

<div align="center">
  <img width="90%" alt="Freezer S3 Explorer Interface" src="https://github.com/user-attachments/assets/843db007-c123-4d18-8bb7-abba4944b4cc" />
</div>

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td width="50%">
        <h3 align="center">🔒 Secure Authentication</h3>
        <ul>
          <li>JWT-based token authentication</li>
          <li>Per-IP and global rate limiting</li>
          <li>Protection against service abuse</li>
        </ul>
      </td>
      <td width="50%">
        <h3 align="center">📁 S3 File Explorer</h3>
        <ul>
          <li>Collapsible, recursive tree view</li>
          <li>File metadata display</li>
          <li>Clean, responsive interface</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td width="50%">
        <h3 align="center">👁️ File Preview</h3>
        <ul>
          <li>Support for images, videos, PDFs</li>
          <li>Modal preview window</li>
          <li>Fallback for unsupported file types</li>
        </ul>
      </td>
      <td width="50%">
        <h3 align="center">⚡ Performance</h3>
        <ul>
          <li>Built on Next.js 14 App Router</li>
          <li>Optimized loading states</li>
          <li>Responsive design for all devices</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td width="50%">
        <img width="100%" alt="Login Screen" src="https://github.com/user-attachments/assets/a724adaf-dce0-417a-84b4-bc5a6062bd68" />
        <p align="center"><strong>Secure Login Page</strong></p>
      </td>
      <td width="50%">
        <img width="100%" alt="File Explorer" src="https://github.com/user-attachments/assets/e481f199-86fe-400b-837e-2adc2816118d" />
        <p align="center"><strong>S3 File Explorer</strong></p>
      </td>
    </tr>
  </table>
</div>

## 🛡️ Security Features

- **JWT Authentication**
  - Secure token-based access for all S3 operations
  - Configurable token expiration

- **Advanced Rate Limiting**
  - **Per-IP Protection**: 20 requests per 5 seconds (default)
  - **Global Protection**: 1000 requests per 60 seconds across all users
  - Configurable via environment variables
  - Security violation logging and monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- AWS S3 bucket and credentials
- Upstash Redis account (for rate limiting)
  

## Getting Started

1. **Install dependencies:**
	```bash
	npm install
	```
2. **Set environment variables:**
	- `JWT_SECRET`, `USER_USERNAME`, `USER_PASSWORD` (for login)
	- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET` (for S3)
	- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (for rate limiting)
	- `S3_GLOBAL_RATE_LIMIT` (optional, default: 1000) - Global request limit for S3 APIs per window
	- `S3_GLOBAL_WINDOW_SEC` (optional, default: 60) - Time window in seconds for global rate limit
3. **Run the app:**
	```bash
	npm run dev
	```

