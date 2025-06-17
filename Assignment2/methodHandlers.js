const {
  readFile,
  writeFile,
  sendResponse,
  validItem,
  updateItemJson,
  getRequestBody,
  getNextId,
} = require("./utils");

async function createItem(req, res) {
  try {
    const items = await readFile();
    const newItem = await getRequestBody(req);

    if (!validItem(newItem)) {
      return sendResponse(res, 400, { error: "Invalid item data" });
    }

    newItem.id = getNextId(items);
    items.push(newItem);
    await writeFile(items);
    sendResponse(res, 201, { success: true, item: newItem });
  } catch (error) {
    sendResponse(res, 500, { error: "Internal Server Error" });
  }
}
async function getAllItems(req, res) {
  try {
    const items = await readFile();
    sendResponse(res, 200, { success: true, item: items });
  } catch (error) {
    sendResponse(res, 500, { error: "Internal Server Error" });
  }
}
async function getItem(req, res, id) {
  try {
    const items = await readFile();
    const item = items.find((item) => item.id === id);

    if (!item) {
      return sendResponse(res, 404, { error: "Item not found" });
    }

    sendResponse(res, 200, { success: true, data: item });
  } catch (error) {
    sendResponse(res, 500, { error: "Internal Server Error" });
  }
}
async function updateItem(req, res, id) {
  try {
    const items = await readFile();
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return sendResponse(res, 404, { error: "Item not found" });
    }

    const updatedData = await getRequestBody(req);

    if (!updateItemJson(updatedData)) {
      return sendResponse(res, 400, { error: "Invalid item data" });
    }

    const updatedItem = { ...items[itemIndex], ...updatedData };
    items[itemIndex] = updatedItem;
    await writeFile(items);
    sendResponse(res, 200, { success: true, data: updatedItem });
  } catch (error) {
    sendResponse(res, 500, { error: "Internal Server Error" });
  }
}

async function deleteItem(req, res, id) {
  try {
    const items = await readFile();
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return sendResponse(res, 404, { error: "Item not found" });
    }

    items.splice(itemIndex, 1);
    await writeFile(items);
    sendResponse(res, 200, {
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    sendResponse(res, 500, { error: "Internal Server Error" });
  }
}
module.exports = {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  deleteItem,
};
