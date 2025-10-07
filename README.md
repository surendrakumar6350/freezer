
# Freezer

Freezer is a modern Next.js app featuring:

- **Login system** with JWT authentication
- **S3 File Explorer**: Browse, preview, and download files from your AWS S3 bucket
  - Collapsible, recursive tree view (folders/files)
  - File preview modal for images, videos, PDFs, and more
  - Responsive, clean UI inspired by Google Drive/VS Code

## Features

- Login page with token-based authentication
- API endpoints for login and S3 file listing
- Advanced file explorer with collapsible folders and file metadata
- File preview modal (image, video, PDF, fallback for other types)
- Uses TailwindCSS and lucide-react icons

## Security Features

- **JWT-based Authentication**: Secure token-based authentication for all S3 operations
- **Per-IP Rate Limiting**: Individual IP addresses are rate-limited to prevent spam (20 requests per 5 seconds by default)
- **Global Rate Limiting**: Configurable global usage limit across all requests to prevent service abuse and DoS attacks
  - Default: 1000 requests per 60 seconds across all users
  - Configurable via `S3_GLOBAL_RATE_LIMIT` and `S3_GLOBAL_WINDOW_SEC` environment variables
  - Returns HTTP 503 (Service Unavailable) when global limit is exceeded
  - Logs all global rate limit violations for monitoring and analysis

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

## Usage

- Visit `/login` to sign in
- Visit `/s3-explorer` to browse your S3 bucket
  - Click folders to expand/collapse
  - Click files to preview (image, video, PDF, etc.) or download

## Tech Stack

- Next.js 14 (App Router)
- TailwindCSS
- AWS SDK
- lucide-react (icons)

## License

MIT
