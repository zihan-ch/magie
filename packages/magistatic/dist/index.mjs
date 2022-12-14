// src/index.ts
import { cwd as processCwd } from "process";
import { resolve as pathResolve } from "path";
import { createReadStream, statSync } from "fs";
import mime from "mime";
import { createGzip } from "zlib";
var { getType } = mime;
function defaultErrHandler(req, res) {
  res.writeHead(404, "404 Not Found!");
  res.end("404 Not Found!");
}
function createStaticServer(config) {
  const {
    root = "static",
    cwd = processCwd(),
    autoIndex = true,
    errHandler = defaultErrHandler,
    gzip = true,
    cache = 3600
  } = config;
  let basePath;
  if (/dist\/?$/i.test(cwd)) {
    basePath = pathResolve(cwd, root);
  } else {
    basePath = pathResolve(cwd, "dist", root);
  }
  return (req, res) => {
    let pathUrl;
    if (autoIndex && req.url === "/") {
      pathUrl = "index.html";
    } else {
      pathUrl = `.${req.url}`;
    }
    checkPathExists: {
      let path = pathResolve(basePath, pathUrl);
      try {
        statSync(path);
      } catch (e) {
        break checkPathExists;
      }
      const tpyeOfFile = getType(pathUrl);
      let gzipNeed;
      if (gzip === true) {
        gzipNeed = true;
      } else
        gzipNeed = !!gzip.find((e) => e === tpyeOfFile);
      const headers = gzipNeed ? { "Content-Encoding": "gzip" } : {};
      if (cache)
        headers["Cache-Control"] = `max-age=${cache}`;
      res.writeHead(200, { "Content-Type": tpyeOfFile, ...headers });
      const stream = createReadStream(path);
      if (gzipNeed) {
        let gzipStream = createGzip();
        stream.pipe(gzipStream);
        gzipStream.pipe(res);
      } else {
        stream.pipe(res);
      }
      return;
    }
    errHandler(req, res);
  };
}
export {
  createStaticServer as default
};
