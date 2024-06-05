import db from "../db/database.js";
import menu from "../services/menu.js";
import createDeliveryTime from "../services/createDeliveryTime.js";

let cart = [];

const deleteItem = async (req, res) => {
  try {
    const { productId } = req.body;

    // Check that productId is available
    if (!productId) {
      return res.status(400).json({ message: "Produkt-ID saknas" });
    }

    // Find the index of the product in the cart based on the productId
    const productIndex = cart.findIndex((product) => product.id === productId);
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Produkten finns inte i kundvagnen" });
    }

    // Remove the specific product from the basket
    cart.splice(productIndex, 1);

    res
      .status(200)
      .json({ message: "Produkten har tagits bort från kundvagnen" });
  } catch (error) {
    console.error("Fel vid bortttagning av produkt:", error);
    return res.status(500).json({ message: "Internt serverfel" });
  }
};

const createOrder = async (req, res) => {
  //Creates unique id for order
  const orderId = Math.floor(Math.random() * (999 - 100) + 100);
  //Makes order id into a string
  const myOrderId = orderId.toString();

  //Checks if data is an array or just an object
  const newOrder = Array.isArray(req.body) ? req.body : [req.body];

  //Error handling for input information from user
  for (let order of newOrder) {
    const { id, title, desc, price } = order;
    if (id == null || title == null || desc == null || price == null) {
      return res.status(400).json({
        error: "Each order must contain id, title, desc, and price",
      });
    }

    let itemFound = false;
    for (let item of menu) {
      if (
        item._id === order.id &&
        item.title === order.title &&
        item.desc === order.desc &&
        item.price === order.price
      ) {
        itemFound = true;
        break;
      }
    }

    if (!itemFound) {
      return res.status(400).json({
        error: "Items must match menu",
      });
    }
  }

  try {
    //Inserts created data into database
    await db["order"].insert({
      orderId: myOrderId,
      estDelivery: createDeliveryTime(),
      newOrder,
    });
    //Returns order id for created order
    return res.status(201).json(`Your order id: ${myOrderId}`);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error adding new order" });
  }
};

const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await db["order"].findOne({ orderId: orderId });
    //Error if there is no order with certain id.
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { estDelivery, ...removeEstDelivery } = order;
    // If no error then respond status 200.
    return res.status(200).json(removeEstDelivery);
  } catch (error) {
    console.log("Error retrieving orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// To add a product to the order
const changeOrder = async (req, res) => {
  const { orderId } = req.params;
  const updatedItems = Array.isArray(req.body) ? req.body : [req.body];

  for (let order of updatedItems) {
    const { id, title, desc, price } = order;
    if (!id || !title || !desc || !price) {
      return res.status(400).json({
        error: "Each order must contain a Id, title, desc and price",
      });
    }
    let itemFound = false;

    for (let item of menu) {
      if (
        item._id === id &&
        item.title === title &&
        item.desc === desc &&
        item.price === price
      ) {
        itemFound = true;
        break;
      }
    }

    if (!itemFound) {
      return res.status(400).json({
        error: "Items must match menu",
      });
    }
  }

  try {
    const existingOrder = await db["order"].findOne({ orderId });
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    existingOrder.newOrder = [existingOrder.newOrder, ...updatedItems];

    await db["order"].update(
      { orderId },
      { $set: { newOrder: existingOrder.newOrder } }
    );
    return res
      .status(200)
      .json({ message: "Order has been updated successfully", orderId });
  } catch (error) {
    console.error("Error updating order");
    return res.status(500).send({ error: "Error updating order" });
  }
};

const getOrderStatus = async (req, res) => {
  //Receives order id as parameter from user
  const { orderId } = req.params;
  //Looks for order id in database
  try {
    const orderData = await db["completeOrder"].findOne({ orderId: orderId });
    //Error handling for order id
    if (!orderData) {
      return res.status(404).send({ error: "Order not found" });
    }
    //returns estimated delivery time for order
    return res.status(200).json({
      message: `Your estimated delivery time is ${orderData.estDelivery}`,
    });
  } catch (error) {
    return res.status(500).send({ error: "Error finding order id" });
  }
};

const completeOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderData = await db.order.findOne({ orderId: orderId });
    if (!orderData) {
      return res.status(404).send({ error: "Order not found" });
    }
    const updateData = await db.completeOrder.insert(orderData);
    const deletedData = await db.order.remove(orderData, { multi: true });
    return res.status(200).json({
      message: `Your order is complete. Order id: ${orderId}`,
    });
  } catch (error) {
    return res.status(500).send({ error: "Error finding order id" });
  }
};

export {
  createOrder,
  getOrderStatus,
  changeOrder,
  deleteItem,
  completeOrder,
  getOrder,
};
