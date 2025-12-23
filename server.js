const express = require('express');
const cors = require('cors');
// Email sending migrated to Pabbly Webhook (frontend-based)
// Backend email logic kept for rollback/reference
// const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Email sending migrated to Pabbly Webhook (frontend-based)
// Backend email logic kept for rollback/reference
// Read-only email identity configuration for UI display
const EMAIL_FROM = process.env.EMAIL_FROM || null;
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || null;

// For local development reflect the requesting Origin so frontend dev servers
// running on different ports (3000, 5001, etc.) can reach this API.
const corsOptions = {
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g. curl, mobile apps)
    if (!origin) return cb(null, true);
    // Allow all localhost origins for dev convenience
    if (/^https?:\/\/localhost(?::\d+)?$/.test(origin)) return cb(null, true);
    // In production you should validate origin explicitly
    return cb(null, false);
  },
  credentials: false,
};
app.use(cors(corsOptions));

// Small logger and CORS helper for debugging preflight/network issues
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  console.log(`${new Date().toISOString()} => ${req.method} ${req.url} - origin: ${origin}`);
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'false');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Serve the React build (so client-side routes like /checking work)
const clientBuildPath = path.join(__dirname, 'build');
const clientIndexHtml = path.join(clientBuildPath, 'index.html');
const hasClientBuild = fs.existsSync(clientIndexHtml);

if (hasClientBuild) {
  app.use(express.static(clientBuildPath));
}

// Multer for handling multipart/form-data (attachments)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
});

/*
// Email sending migrated to Pabbly Webhook (frontend-based)
// Backend email logic kept for rollback/reference

// Validate environment variables
const EMAIL_USER = process.env.EMAIL_USER; // your Gmail address
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD; // Gmail App Password
const DEFAULT_REPLY_TO_EMAIL = process.env.DEFAULT_REPLY_TO_EMAIL || null;

const IS_EMAIL_CONFIGURED = Boolean(EMAIL_USER && EMAIL_APP_PASSWORD);

if (!IS_EMAIL_CONFIGURED) {
  console.warn(
    'Email is NOT configured. The server will run, but email sending is disabled.'
  );
}

// Initialize transporter (supports Gmail with App Password, or Ethereal for dev)
let transporter;
const useEthereal = process.env.USE_ETHEREAL === 'true';
let SENDER_EMAIL = EMAIL_USER || null;

const initTransporter = async () => {
  if (!IS_EMAIL_CONFIGURED && !useEthereal) {
    console.warn('Skipping transporter initialization because email is not configured.');
    return;
  }
  if (useEthereal) {
    console.log('Using Ethereal test account for email (development)');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    SENDER_EMAIL = testAccount.user;
  } else {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_APP_PASSWORD,
      },
    });
  }

  try {
    await transporter.verify();
    console.log('Nodemailer transporter is ready to send messages');
  } catch (err) {
    console.error('Nodemailer transporter verification failed:', err);
  }
};
*/

app.get('/', (req, res) => {
  if (hasClientBuild) {
    return res.sendFile(clientIndexHtml);
  }
  return res.json({ status: 'ok', message: 'Bulk email server running' });
});

// Read-only config endpoint for frontend display.
// Email sending migrated to Pabbly Webhook (frontend-based)
// Backend email logic kept for rollback/reference
app.get('/email-config', (req, res) => {
  return res.json({
    emailFrom: EMAIL_FROM,
    emailReplyTo: EMAIL_REPLY_TO,
    // Backward-compatible keys (older frontend expected these)
    senderEmail: EMAIL_FROM,
    replyToEmail: EMAIL_REPLY_TO,
  });
});

// Expose server-configured sender email for UI display only.
// Clients cannot override the From address.
/*
// Email sending migrated to Pabbly Webhook (frontend-based)
// Backend email logic kept for rollback/reference
app.get('/email-config', (req, res) => {
  return res.json({
    senderEmail: SENDER_EMAIL || EMAIL_USER || null,
    defaultReplyToEmail: DEFAULT_REPLY_TO_EMAIL,
    isConfigured: IS_EMAIL_CONFIGURED || useEthereal,
  });
});
*/

// POST /send-bulk-email
// JSON: { emails: [...], subject: '...', message: '<html>...</html>' }
// or multipart/form-data with fields: subject, message, emails(JSON string), attachments (files)
/*
// Email sending migrated to Pabbly Webhook (frontend-based)
// Backend email logic kept for rollback/reference
app.post('/send-bulk-email', upload.array('attachments'), async (req, res) => {
  if (!IS_EMAIL_CONFIGURED && !useEthereal) {
  return res.status(503).json({
    error: 'Email service is not configured on the server',
  });
}
if (!transporter) {
  return res.status(503).json({
    error: 'Email transporter is not initialized',
  });
}

  try {
    const body = req.body || {};
    let { emails, subject, message, replyTo } = body;

    const normalizeReplyTo = (value) => {
      if (value === null || value === undefined) return null;
      const str = String(value).trim();
      if (!str) return null;

      const parts = str
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);

      if (parts.length === 0) return null;

      // Basic email validation (kept intentionally lightweight)
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalid = parts.filter((p) => !emailRe.test(p));
      if (invalid.length > 0) {
        return { error: `Invalid replyTo email(s): ${invalid.join(', ')}` };
      }

      // Deduplicate case-insensitively
      const seen = new Set();
      const unique = [];
      for (const p of parts) {
        const key = p.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(p);
      }

      return unique.join(', ');
    };

    // If emails was sent as JSON string in multipart/form-data, parse it
    if (typeof emails === 'string') {
      try {
        emails = JSON.parse(emails);
      } catch (e) {
        return res.status(400).json({ error: 'emails must be valid JSON when sent as string' });
      }
    }

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'emails must be a non-empty array' });
    }
    if (!subject || !message) {
      return res.status(400).json({ error: 'subject and message are required' });
    }

    const normalizedReplyTo = normalizeReplyTo(replyTo);
    if (normalizedReplyTo && typeof normalizedReplyTo === 'object' && normalizedReplyTo.error) {
      return res.status(400).json({ error: normalizedReplyTo.error });
    }

    // Normalize recipients: accept array of strings or objects { email, name }
    const recipients = emails.map(e => {
      if (typeof e === 'string') return { email: e, name: null };
      return { email: (e.email || e.to || e.address || '').toString(), name: (e.name || e.fullName || null) };
    }).filter(r => r.email);

    if (recipients.length === 0) {
      return res.status(400).json({ error: 'no valid recipient emails' });
    }

    // Build attachments for Nodemailer (if any were uploaded)
    let attachments = [];
    if (Array.isArray(req.files) && req.files.length > 0) {
      attachments = req.files.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype,
      }));
    }

    // Send concurrently and personalize message by replacing {{name}} placeholder
    const sendPromises = recipients.map(async (rcpt) => {
      const personalHtml = (rcpt.name && typeof message === 'string')
        ? message.replace(/{{\s*name\s*}}/gi, rcpt.name)
        : message;

      const mailOptions = {
        from: SENDER_EMAIL || EMAIL_USER || 'no-reply@example.com',
        to: rcpt.email,
        subject: subject,
        ...(normalizedReplyTo ? { replyTo: normalizedReplyTo } : {}),
        html: personalHtml,
        attachments,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        const previewUrl = nodemailer.getTestMessageUrl(info) || null;
        return { to: rcpt.email, success: true, messageId: info.messageId, previewUrl };
      } catch (sendErr) {
        console.error(`Failed to send to ${rcpt.email}:`, sendErr);
        return { to: rcpt.email, success: false, error: sendErr.message };
      }
    });

    const settled = await Promise.allSettled(sendPromises);
    const results = settled.map(s => s.status === 'fulfilled' ? s.value : { success: false, error: 'send promise rejected' });

    const allOk = results.every(r => r.success === true);
    return res.json({ success: allOk, results });
  } catch (err) {
    console.error('Failed to send bulk email:', err);
    return res.status(500).json({ error: 'Failed to send emails', details: err.message });
  }
});
*/

// SPA fallback: send index.html for any GET route not handled above
// This enables refresh/deep-links like /checking to work.
if (hasClientBuild) {
  // Express 5 + path-to-regexp v6 doesn't accept '*' as a path string.
  // Use a RegExp catch-all instead for SPA routing (e.g., /checking).
  app.get(/.*/, (req, res) => {
    res.sendFile(clientIndexHtml);
  });
}

// Email sending migrated to Pabbly Webhook (frontend-based)
// Backend email logic kept for rollback/reference
// Start server normally (no Nodemailer init at runtime)
app.listen(PORT, () => {
  console.log(`Bulk email server listening on port ${PORT}`);
});
