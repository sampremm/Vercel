require('dotenv').config();
const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const PORT = process.env.PORT || 8000;
// const BASE_PATH = process.env.BASE_PATH || 'https://vercel-project-clone.s3.ap-south-1.amazonaws.com/__outputs/';

const proxy = httpProxy.createProxy();

app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];

    if (!subdomain) {
        return res.status(400).json({ error: 'Invalid subdomain' });
    }

    const resolvesTo = `${BASE_PATH}/${subdomain}`;

    proxy.web(req, res, { target: resolvesTo, changeOrigin: true }, (err) => {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Failed to proxy the request' });
    });
});

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if (url === '/') {
        proxyReq.path += 'index.html';
    }
});

app.listen(PORT, () => console.log(`Reverse Proxy Running on port ${PORT}`));
