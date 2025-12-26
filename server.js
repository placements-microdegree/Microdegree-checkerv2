/**
 * Optional backend server.
 *
 * Email sending is frontend-only via Pabbly Webhook and MUST NOT depend on this server.
 * This server is kept only to optionally serve the built React app for local/self-hosting.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve the React build (so client-side routes like /checking work)
const clientBuildPath = path.join(__dirname, 'build');
const clientIndexHtml = path.join(clientBuildPath, 'index.html');
const hasClientBuild = fs.existsSync(clientIndexHtml);

if (hasClientBuild) {
  app.use(express.static(clientBuildPath));
}

app.get('/', (req, res) => {
  if (hasClientBuild) {
    return res.sendFile(clientIndexHtml);
  }
  return res.json({ status: 'ok', message: 'Optional static server running' });
});

// SPA fallback: send index.html for any GET route not handled above
// This enables refresh/deep-links like /checking to work.
if (hasClientBuild) {
  // Express 5 + path-to-regexp v6 doesn't accept '*' as a path string.
  // Use a RegExp catch-all instead for SPA routing (e.g., /checking).
  app.get(/.*/, (req, res) => {
    res.sendFile(clientIndexHtml);
  });
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Optional static server listening on port ${PORT}`);
  });
}

module.exports = app;
