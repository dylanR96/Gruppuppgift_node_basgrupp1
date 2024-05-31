import db from "../db/database.js";

//Unique order ID (Math random kontrolleras )
//Order time 15 min - 45 min (Math random)

const createOrder = async (req, res) => {
  let newOrder = req.body;

  function generateId() {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * (999 - 100) + 100);
  }
  const orderId = generateId();

  for (let order of newOrder) {
    const { id, title, desc, price } = order;
    if (id == null || title == null || desc == null || price == null) {
      return res
        .status(400)
        .json({ error: "Each order must contain id, title, desc, and price" });
    }
  }

  try {
    db["order"].insert(newOrder);
    return res.status(201).json(`Your order id: ${orderId}`);
  } catch (error) {
    return res.status(500).send({ error: "Error adding new order" });
  }
};

const getOrderStatus = async (req, res) => {
  const orderId = req.params.orderId;

  const orderTime = Math.floor(Math.random() * (45 - 25 + 1) + 25);
  const currentDate = new Date();
  const hour = currentDate.getHours();
  const min = currentDate.getMinutes();

  let deliveryHour = hour;
  let deliveryMin = min + orderTime;

  if (deliveryMin >= 60) {
    deliveryHour += Math.floor(deliveryMin / 60);
    deliveryMin %= 60;
  }

  const deliveryTime = `${deliveryHour}:${
    deliveryMin < 10 ? "0" + deliveryMin : deliveryMin
  }`;

  console.log(deliveryTime);

  try {
    const orderData = await db["order"].findOne({ order: orderId });
  } catch (error) {
    return res.status(500).send({ error: "Error finding order id" });
  }
};

export { createOrder, getOrderStatus };
