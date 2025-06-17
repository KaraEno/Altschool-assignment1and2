const http = require("http");
const fs = require("fs").promises;
const path = require("path");

const PORT = 3000;

let errorPage = path.join(__dirname, "error.html");

const requestHandler = async (req, res) => {
  try {
    let filePath = req.url.slice(1);
    if (!filePath.endsWith(".html")) {
      filePath += ".html";
    }
    const fullPath = path.join(__dirname, filePath);
    if (filePath === "index.html") {
      const data = await fs.readFile(fullPath, "utf-8");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    } else {
      const notFoundPage = await fs.readFile(errorPage, "utf-8");
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(notFoundPage);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      // File not found
      const notFoundPage = await fs.readFile(errorPage, "utf-8");
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(notFoundPage);
    } else {
      // Internal server error
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end("<h1>Internal Server Error</h1>");
    }
  }
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
