// routes/auth.js
const express = require('express');
const router = express.Router();
const instagram = require('../lib/instagram');

const IG_APP_ID = process.env.IG_APP_ID;
const IG_APP_SECRET = process.env.IG_APP_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

if (!IG_APP_ID || !IG_APP_SECRET || !REDIRECT_URI) {
  console.warn('IG_APP_ID, IG_APP_SECRET or REDIRECT_URI not set. Auth routes will fail until configured.');
}

router.get('/auth/login', (req, res) => {
  try {
    const url = instagram.getAuthorizeUrl({ clientId: IG_APP_ID, redirectUri: REDIRECT_URI });
    res.redirect(url);
  } catch (err) {
    res.status(500).render('error', { message: 'Erro ao iniciar login: ' + String(err) });
  }
});

router.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).render('error', { message: 'Código de autorização ausente.' });
  }

  try {
    const shortTokenResp = await instagram.exchangeCodeForShortToken({
      clientId: IG_APP_ID,
      clientSecret: IG_APP_SECRET,
      redirectUri: REDIRECT_URI,
      code,
    });

    const shortLivedToken = shortTokenResp.access_token;
    if (!shortLivedToken) {
      throw new Error('Resposta não contém access_token. Verifique o tipo de conta e permissões.');
    }

    const longResp = await instagram.exchangeShortForLongToken({
      clientSecret: IG_APP_SECRET,
      shortLivedToken,
    });

    const accessToken = longResp.access_token;
    const expiresIn = longResp.expires_in; // seconds

    if (!accessToken) {
      throw new Error('Falha ao obter token de longa duração.');
    }

    const expiresAt = Date.now() + Number(expiresIn) * 1000;

    const profile = await instagram.fetchProfile({ accessToken });

    if (!profile || profile.error) {
      throw new Error('Falha ao recuperar perfil. Talvez a conta não seja profissional ou faltam permissões.');
    }

    req.session.ig = {
      access_token: accessToken,
      expires_at: expiresAt,
      profile,
    };

    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).render('error', { message: 'Erro durante autenticação: ' + String(err) });
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

router.get('/auth/refresh', async (req, res) => {
  if (!req.session.ig || !req.session.ig.access_token) {
    return res.redirect('/auth/login');
  }

  try {
    const resp = await instagram.refreshLongLivedToken({ accessToken: req.session.ig.access_token });
    if (!resp || resp.error) {
      throw new Error(JSON.stringify(resp));
    }
    const accessToken = resp.access_token || req.session.ig.access_token;
    const expiresIn = resp.expires_in || 0;
    const expiresAt = expiresIn ? Date.now() + Number(expiresIn) * 1000 : req.session.ig.expires_at;

    req.session.ig.access_token = accessToken;
    req.session.ig.expires_at = expiresAt;

    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).render('error', { message: 'Erro ao atualizar token: ' + String(err) });
  }
});

module.exports = router;
