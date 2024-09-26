const httpServer = require("http");
const fileSystem = require("fs");
const filePath = require("path");
const requestUrl = require("url");
const PUBLIC_DIR = filePath.join(__dirname, "../public");
const SERVER_PORT = 8000;

const requestHandler = (request, response) => {
  if (request.url === "/") {
    request.url = "/index.html";
  } else if (request.url === "/cars") {
    request.url = "/rent.find.car.html";
  } else {
    request.url = request.url;
  }
  const parsedURL = requestUrl.parse(request.url);
  const pathName = `${parsedURL.pathname}`;
  const fileExtension = filePath.parse(pathName).ext;
  const absoluteFilePath = filePath.join(PUBLIC_DIR, pathName);

  const contentTypeMap = {
    ".css": "text/css",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".html": "text/html",
    ".js": "text/javascript",
  };

  fileSystem.readFile(absoluteFilePath, (error, data) => {
    if (error) {
      response.statusCode = 500;
      response.end("File not found ...");
    } else {
      response.setHeader(
        "Content-Type",
        contentTypeMap[fileExtension] || "text/plain"
      );
      response.end(data);
    }
  });
};

httpServer.createServer(requestHandler).listen(SERVER_PORT);
console.log(`Server is running ... PORT : localhost:${SERVER_PORT}`);
