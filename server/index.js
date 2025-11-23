require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 3000;

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const TO_EMAIL = process.env.TO_EMAIL || '';
const FROM_EMAIL = process.env.FROM_EMAIL || TO_EMAIL;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('Warning: SENDGRID_API_KEY is not set. Emails will not be sent until configured.');
}

app.use(cors());
app.use(express.json({ limit: '50kb' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/contact', async (req, res) => {
  const { name, message } = req.body || {};
  if (!name || !message) return res.status(400).json({ ok: false, error: 'Missing name or message' });

  const text = `Nom: ${name}\n\nMessage:\n${message}`;
  const html = `<p><strong>Nom:</strong> ${escapeHtml(name)}</p><p><strong>Message:</strong></p><pre>${escapeHtml(message)}</pre>`;

  if (!SENDGRID_API_KEY || !TO_EMAIL) {
    console.error('SendGrid API key or TO_EMAIL not configured.');
    return res.status(500).json({ ok: false, error: 'Server not configured to send emails.' });
  }

  const msg = {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject: `Contact via portfolio — ${name}`,
    text,
    html
  };

  try {
    await sgMail.send(msg);
    return res.json({ ok: true });
  } catch (err) {
    console.error('SendGrid error:', err && err.response ? err.response.body : err);
    return res.status(500).json({ ok: false, error: 'Failed to send message.' });
  }
});

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

app.listen(PORT, () => console.log(`Contact API listening on port ${PORT}`));
