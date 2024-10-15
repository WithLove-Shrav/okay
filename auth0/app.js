const express = require('express');
const { auth } = require('express-openid-connect');
require('dotenv').config();

const app = express();

// Auth0 Configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`
};

// Initialize Auth0 middleware
app.use(auth(config));

// Home route
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? `Hello, ${req.oidc.user.name}` : 'Not logged in. <a href="/login">Login</a>');
});

// Profile route (protected)
app.get('/profile', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.json(req.oidc.user);
  } else {
    res.send('You need to <a href="/login">login</a> first.');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  res.oidc.logout({ returnTo: process.env.AUTH0_BASE_URL });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
