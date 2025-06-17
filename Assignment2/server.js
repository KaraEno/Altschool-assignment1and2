const http = require("http");
const {
  initializeFile,
  readFile,
  writeFile,
  sendResponse,
  validItem,
  updateItem,
  getRequestBody,
} = require("./utils");
const handlers = require("./methodHandlers");

const PORT = 7000;

async function requestHandler(req, res) {
  await initializeFile();
  const { method, url } = req;
  const urlParts = url.split("/").filter(Boolean);

  try {
    switch (method) {
      case "POST":
        if (url === "/items") {
          await handlers.createItem(req, res);
        } else {
          sendResponse(res, 404, { error: "Route not found" });
        }
        break;

      case "GET":
        if (url === "/items") {
          await handlers.getAllItems(req, res);
        } else if (urlParts[0] === "items" && urlParts[1]) {
          await handlers.getItem(req, res, Number(urlParts[1]));
        } else {
          sendResponse(res, 404, { error: "Route not found" });
        }
        break;

      case "PUT":
        if (urlParts[0] === "items" && urlParts[1]) {
          await handlers.updateItem(req, res, Number(urlParts[1]));
        } else {
          sendResponse(res, 404, { error: "Route not found" });
        }
        break;

      case "DELETE":
        if (urlParts[0] === "items" && urlParts[1]) {
          await handlers.deleteItem(req, res, Number(urlParts[1]));
        } else {
          sendResponse(res, 404, { error: "Route not found" });
        }
        break;

      default:
        sendResponse(res, 404, { error: "Route not found" });
    }
  } catch (error) {
    sendResponse(res, 500, { error: "Internal Server Error" });
  }
}
const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
