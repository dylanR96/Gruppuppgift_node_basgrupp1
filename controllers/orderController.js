import db from "../db/database.js";
import createDeliveryTime from "../services/createDeliveryTime.js";

//Unique order ID (Math random kontrolleras )
//Order time 15 min - 45 min (Math random)

const createOrder = async (req, res) => {
  const orderId = Math.floor(Math.random() * (999 - 100) + 100);
  let myOrder = orderId.toString();

  const newOrder = req.body;

  if (Array.isArray(newOrder)) {
    for (let order of newOrder) {
      const { id, title, desc, price } = order;
      if (id == null || title == null || desc == null || price == null) {
        return res.status(400).json({
          error: "Each order must contain id, title, desc, and price",
        });
      }
    }
  }

  newOrder.estDelivery = createDeliveryTime();

  try {
    db["order"].insert({ orderId: myOrder, ...newOrder });
    return res.status(201).json(`Your order id: ${myOrder}`);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error adding new order" });
  }
};

const getOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  console.log(orderId);

  try {
    const orderData = await db["order"].findOne({ orderId: orderId });
    if (!orderData) {
      return res.status(404).send({ error: "Order not found" });
    }
    return res.status(200).json({
      message: `Your estimated delivery time is ${orderData.estDelivery}`,
    });
  } catch (error) {
    return res.status(500).send({ error: "Error finding order id" });
  }
};

export { createOrder, getOrderStatus };
