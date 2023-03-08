import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer();

var enableCors = function (req, res) {
  if (req.headers["access-control-request-method"]) {
    res.setHeader(
      "access-control-allow-methods",
      req.headers["access-control-request-method"]
    );
  }

  if (req.headers["access-control-request-headers"]) {
    res.setHeader(
      "access-control-allow-headers",
      req.headers["access-control-request-headers"]
    );
  }

  if (req.headers.origin) {
    res.setHeader("access-control-allow-origin", req.headers.origin);
    res.setHeader("access-control-allow-credentials", "true");
  }
};

proxy.on("proxyRes", function (proxyRes, req, res) {
  enableCors(req, res);
});

export default async function handler(req, res) {
  const route = atob(req.query.path);
  const url = new URL(route);
  const origin = url.origin;
  const path = url.pathname;

  req.url = path;
  return new Promise<void>((resolve, reject) => {
    enableCors(req, res);
    proxy.web(
      req,
      res,
      { target: origin, changeOrigin: true, prependPath: false },
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }
    );
  });
}

export const config = {
  api: {
    responseLimit: false,
  },
};
