// routes/dashboard.js
const express = require('express');
const router = express.Router();
const instagram = require('../lib/instagram');

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/dashboard', async (req, res) => {
  if (!req.session.ig || !req.session.ig.access_token) {
    return res.redirect('/auth/login');
  }

  try {
    const accessToken = req.session.ig.access_token;
    const profile = req.session.ig.profile || {};
    const expiresAt = req.session.ig.expires_at || 0;
    const expiresDays = Math.max(0, Math.round((expiresAt - Date.now()) / (1000 * 60 * 60 * 24)));

    let media = { data: [] };
    try {
      media = await instagram.fetchMedia({ accessToken, limit: 10 });
    } catch (err) {
      // keep going — media is optional
      media = { data: [], error: String(err) };
    }

    res.render('dashboard', {
      profile,
      media: media.data || [],
      expiresDays,
    });
  } catch (err) {
    res.status(500).render('error', { message: 'Erro ao carregar dashboard: ' + String(err) });
  }
});

module.exports = router;
