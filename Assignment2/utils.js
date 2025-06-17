const fs = require("fs");
const path = require("path");

const INVENTORY_FILE = path.join(__dirname, "inventory.json");
async function initializeFile() {
  try {
    await fs.promises.access(INVENTORY_FILE);
  } catch (error) {
    await fs.promises.writeFile(INVENTORY_FILE, JSON.stringify([]));
  }
}
async function readFile() {
  try {
    const data = await fs.promises.readFile(INVENTORY_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Error reading inventory file");
  }
}
async function writeFile(data) {
  try {
    await fs.promises.writeFile(INVENTORY_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error("Error writing to inventory file");
  }
}
async function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}
function validItem(item) {
  return item.name && item.price && ["s", "m", "l", "xl"].includes(item.size);
}

function updateItemJson(item) {
  return (
    (item.name || item.price || item.size) &&
    (!item.size || ["s", "m", "l", "xl"].includes(item.size))
  );
}

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}
function getNextId(items) {
  return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}
module.exports = {
  initializeFile,
  readFile,
  writeFile,
  sendResponse,
  validItem,
  updateItemJson,
  getRequestBody,
  getNextId,
};
