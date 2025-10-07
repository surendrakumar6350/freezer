# Freezer 🧊

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![AWS](https://img.shields.io/badge/AWS_S3-232F3E?style=for-the-badge&logo=amazon-aws)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
[![Stargazers](https://img.shields.io/github/stars/surendrakumar6350/freezer?style=for-the-badge&logo=github)](https://github.com/surendrakumar6350/freezer/stargazers)

</div>

<p align="center">🔥 <b>Freezer</b> is a sleek, modern S3 file explorer that transforms how you manage your cloud storage. Built with Next.js 14 and featuring JWT authentication, it offers enterprise-grade security with a beautiful, intuitive interface.</p>

<div align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#%EF%B8%8F-security-features">Security</a> •
  <a href="#-tech-stack">Tech Stack</a>
</div>

<br />

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

## ✨ Why Freezer?

<div align="center">
  <table>
    <tr>
      <td width="33%">
        <h3 align="center">🚀 Blazing Fast</h3>
        <p align="center">Built on Next.js 14's App Router for optimal performance and streaming server components.</p>
      </td>
      <td width="33%">
        <h3 align="center">🛡️ Enterprise-Ready</h3>
        <p align="center">JWT authentication, rate limiting, and security controls make it suitable for business use.</p>
      </td>
      <td width="33%">
        <h3 align="center">📱 Fully Responsive</h3>
        <p align="center">Beautiful interface that works perfectly on desktop, tablet, and mobile devices.</p>
      </td>
    </tr>
    <tr>
      <td width="33%">
        <h3 align="center">🔌 Easy Setup</h3>
        <p align="center">Quick and simple configuration with environment variables and multiple deployment options.</p>
      </td>
      <td width="33%">
        <h3 align="center">🌙 Dark Mode</h3>
        <p align="center">Light and dark themes with persistent preferences and auto-detection.</p>
      </td>
      <td width="33%">
        <h3 align="center">🔍 File Preview</h3>
        <p align="center">Preview images, videos, PDFs and other file types directly in your browser.</p>
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
  
## 🛠️ Tech Stack

<div align="center">
  <table>
    <tr>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
        <br>Next.js
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=typescript" width="48" height="48" alt="TypeScript" />
        <br>TypeScript
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
        <br>Tailwind
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=aws" width="48" height="48" alt="AWS" />
        <br>AWS S3
      </td>
      <td align="center" width="96">
        <img src="https://skillicons.dev/icons?i=redis" width="48" height="48" alt="Redis" />
        <br>Upstash Redis
      </td>
    </tr>
  </table>
</div>

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- AWS S3 bucket and credentials
- Upstash Redis account (for rate limiting)

### Installation Options

<details>
<summary><b>Option 1: Local Development</b> (click to expand)</summary>

1. **Clone the repository:**
   ```bash
   git clone https://github.com/surendrakumar6350/freezer.git
   cd freezer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables:**
   
   Edit `.env.local` and add your values:
   
   ```env
   # Authentication
   JWT_SECRET=your-secure-jwt-secret
   USER_USERNAME=admin
   USER_PASSWORD=your-secure-password
   
   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-bucket-name
   
   # Rate Limiting (Upstash Redis)
   UPSTASH_REDIS_REST_URL=https://your-upstash-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-upstash-token
   
   # Optional: Rate Limiting Configuration
   S3_GLOBAL_RATE_LIMIT=1000
   S3_GLOBAL_WINDOW_SEC=60
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   
   Visit [http://localhost:3000](http://localhost:3000)
</details>

<details>
<summary><b>Option 2: Deploy to Vercel</b> (click to expand)</summary>

1. Fork this repository
2. Create a new project in Vercel	
3. Connect your forked repository
4. Configure the environment variables in Vercel project settings
5. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsurendrakumar6350%2Ffreezer)
</details>

## 👥 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

<details>
<summary><b>How to contribute</b> (click to expand)</summary>

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Don't forget to give the project a star ⭐ if you found it useful!
</details>

## 📄 License

Freezer is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<div align="center">
  <br />
  <p>
    <i>Built with ❄️ by <a href="https://github.com/surendrakumar6350">Surendra Kumar</a></i>
  </p>
  <p>
    <a href="https://github.com/surendrakumar6350/freezer/issues">Report Bug</a> •
    <a href="https://github.com/surendrakumar6350/freezer/issues">Request Feature</a>
  </p>
</div>

