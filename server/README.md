# Contact API (Node/Express + SendGrid)

This small API accepts POST requests from the portfolio site and forwards the message to your email using SendGrid.

Features
- POST `/api/contact` accepts JSON `{ name, message }` and sends an email.
- `/api/health` simple health check.

Setup (local)

1. In the `server/` folder run:

```powershell
npm install
```

2. Copy `.env.example` to `.env` and fill the values (SendGrid API key and recipient email).

3. Start the server:

```powershell
npm start
```

Deployment notes
- You can host the frontend on GitHub Pages and deploy this server separately (Render, Railway, Vercel, Fly.io, etc.).
- Set environment variables in the platform dashboard (SENDGRID_API_KEY, TO_EMAIL, FROM_EMAIL).

Using with your site (frontend on GitHub Pages)
- Add this meta tag into your `index.html` head, replacing the URL with your deployed API domain:

```html
<meta name="contact-endpoint" content="https://your-backend.example.com/api/contact">
```

- When the user submits the contact form, the site will POST to that endpoint. If the endpoint is missing or unreachable, the client falls back to opening a `mailto:` link.

Security & notes
- This implementation uses SendGrid. You can swap to another provider by replacing the sending logic in `index.js`.
- For production, enable additional protections: rate-limiting, CAPTCHA, and input sanitization as needed.
