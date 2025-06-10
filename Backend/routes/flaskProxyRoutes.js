const express = require('express');
const router = express.Router();
const { createProxyMiddleware } = require('http-proxy-middleware');
// const { checkNotAuthenticated } = require('../middleware/auth');

const proxyOptions = {
  target: 'http://localhost:5001',
  changeOrigin: true,
  logLevel: 'debug',
  pathRewrite: {
    '^/': '/candidates/' 
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
};

router.use('/', createProxyMiddleware(proxyOptions));

module.exports = router;
