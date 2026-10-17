// lib/instagram.js
const { URLSearchParams } = require('url');
const fetch = global.fetch;

const IG_API_VERSION = 'v23.0';

function getAuthorizeUrl({ clientId, redirectUri }) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'instagram_business_basic',
  });
  return `https://www.instagram.com/oauth/authorize?${params.toString()}`;
}

async function exchangeCodeForShortToken({ clientId, clientSecret, redirectUri, code }) {
  const url = 'https://api.instagram.com/oauth/access_token';
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    code,
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to get short token: ${res.status} ${text}`);
  }

  return res.json();
}

async function exchangeShortForLongToken({ clientSecret, shortLivedToken }) {
  const params = new URLSearchParams({
    grant_type: 'ig_exchange_token',
    client_secret: clientSecret,
    access_token: shortLivedToken,
  });
  const url = `https://graph.instagram.com/access_token?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to get long token: ${res.status} ${text}`);
  }
  return res.json();
}

async function refreshLongLivedToken({ accessToken }) {
  const params = new URLSearchParams({
    grant_type: 'ig_refresh_token',
    access_token: accessToken,
  });
  const url = `https://graph.instagram.com/refresh_access_token?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to refresh token: ${res.status} ${text}`);
  }
  return res.json();
}

async function fetchProfile({ accessToken }) {
  const url = `https://graph.instagram.com/${IG_API_VERSION}/me?fields=user_id,username,followers_count,media_count&access_token=${encodeURIComponent(accessToken)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch profile: ${res.status} ${text}`);
  }
  return res.json();
}

async function fetchMedia({ accessToken, limit = 10 }) {
  const fields = 'id,caption,media_type,permalink,like_count,comments_count';
  const url = `https://graph.instagram.com/${IG_API_VERSION}/me/media?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(accessToken)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch media: ${res.status} ${text}`);
  }
  return res.json();
}

module.exports = {
  getAuthorizeUrl,
  exchangeCodeForShortToken,
  exchangeShortForLongToken,
  refreshLongLivedToken,
  fetchProfile,
  fetchMedia,
};
