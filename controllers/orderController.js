import db from "../db/database.js";
import menu from "../services/menu.js";
import createDeliveryTime from "../services/createDeliveryTime.js";

// To delete a product from the order
const deleteItem = async (req, res) => {
  const orderId = req.params.orderId;
  const itemId = parseInt(req.query.itemId, 10);

  try {
    // Finds the order in the database
    const orderData = await db["order"].findOne({ orderId });

    // If order is not found in database
    if (!orderData) {
      return res.status(404).json({
        order: orderId,
        error: "Order not found, please enter a valid order id",
      });
    }

    // Finds the item in the order
    const itemIndex = orderData.newOrder.findIndex(
      (item) => item.id === itemId
    );

    // If the product cant be found in the order
    if (itemIndex === -1) {
      return res.status(404).json({
        itemId,
        error: "Product not found, please enter a valid product id",
      });
    }

    //  Removes the item from the order
    const removedData = orderData.newOrder.splice(itemIndex, 1)[0];

    // Creates a new order with the removed item but with the same order id
    await db["order"].update(
      { orderId: orderId },
      { $set: { newOrder: orderData.newOrder } }
    );

    // If every item gets removed from the order, the order will be deleted
    if (orderData.newOrder.length === 0) {
      await db["order"].remove({
        orderId,
      });
    }

    // Returns the removed item and a message. If an error occurs, a status 500 will be returned instead
    return res
      .status(200)
      .json({ removedData, message: "The product is removed" });
  } catch (error) {
    console.error(
      "An error occurred while trying to remove the product:",
      error
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Unique order ID (Math random kontrolleras )
//Order time 15 min - 45 min (Math random)

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
    //Adds estimated delivery to object
    console.log("Request query:", req.query);
    const userId = req.query.userId;
    if (!userId) {
      console.log("User ID not provided");
    } else {
      // Kolla om användarID finns i databasen
      const userExists = await db["users"].findOne({ _id: userId });

      if (!userExists) {
        console.log("User ID does not exist in database");
      } else {
        console.log("User ID exists in database");
      }
    }
    //Inserts created data into database
    await db["order"].insert({
      orderId: myOrderId,
      estDelivery: createDeliveryTime(),
      newOrder,
      userId: userId,
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

// Add products to the order
const changeOrder = async (req, res) => {
  //Checks if data is an array or just an object
  // const newOrder = Array.isArray(req.body) ? req.body : [req.body];

  // To retrieve data from the body.
  const { id, title, desc, price } = req.body;

  // Create a loop that loops through each "order"/"product" in the body
  for (let order of req.body) {
    const { id, title, desc, price } = order;

    // If something is missing in the body, return a status 400 and an error message
    if (id == null || title == null || desc == null || price == null) {
      return res
        .status(400)
        .json({ error: "Each order must contain id, title, desc, and price" });
    }
  }

  // If everything that is needed in the body, The following code will run
  try {
    // Insert the data into the database.
    const updateData = await db.order.insert(req.body);

    // Returns a status 200 and the data that was inserted
    return res.status(200).json(updateData);

    // If there is an error, the following code will run
  } catch (error) {
    // Returns a status 500 and an error message
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

const orderHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    const userOrders = await db.completeOrder.find({ userId: userId });
    if (!userOrders) {
      return res
        .status(404)
        .send({ error: "Order history not found for this user" });
    }
    return res.status(200).json({
      orderHistory: userOrders,
    });
  } catch (error) {
    return res.status(500).send({ error: "Error finding order history" });
  }
};

export {
  createOrder,
  getOrderStatus,
  changeOrder,
  deleteItem,
  completeOrder,
  orderHistory,
  getOrder,
};
