// server.js

const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// 証明書ファイルのパス確認
const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, "cert/key.pem")),
  cert: fs.readFileSync(path.resolve(__dirname, "cert/cert.pem")),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`✅ HTTPS server started at https://localhost:${port}`);
  });
});
