import db from "../db/database.js";
import createDeliveryTime from "../services/createDeliveryTime.js";

//Unique order ID (Math random kontrolleras )
//Order time 15 min - 45 min (Math random)

const createOrder = async (req, res) => {
  //Creates unique id for order
  const orderId = Math.floor(Math.random() * (999 - 100) + 100);
  //Makes order id into a string
  let myOrderId = orderId.toString();

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
  }

  try {
    //Adds order to object
    newOrder.orderId = orderId;
    //Adds estimated delivery to object
    newOrder.estDelivery = createDeliveryTime();

    //Inserts created data into database
    await db["order"].insert({ orderId: orderId, newOrder });
    //Returns order id for created order
    return res.status(201).json(`Your order id: ${myOrderId}`);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error adding new order" });
  }
};


// För att lägga till en produkt i ordern
const changeOrder = async (req, res) => {
  // För felhantering
  // console.log(`id: ${id}, title: ${title}, desc: ${desc}, price: ${price}`);

  // För att hämta data ifrån bodyn.
  const { id, title, desc, price } = req.body;

  // Skapa en loop som loopar igenom varje "order"/"produkt" i bodyn
  for (let order of req.body) {
    // Om någon av dessa saknas i bodyn så returneras ett felmeddelande.
    const { id, title, desc, price } = order;

    if (id == null || title == null || desc == null || price == null) {
      return res
        .status(400)
        .json({ error: "Each order must contain id, title, desc, and price" });
    }
  }

  // Om allt finns i bodyn så körs koden nedanför.
  try {
    // Hämtar data ifrån databasen och lägger in i variabeln updateData.
    const updateData = await db.order.insert(req.body);

    // Returnerar en status 200 och skickar med updateData.
    return res.status(200).json(updateData);
  } catch (error) {
    return res.status(500).send({ error: "Error updating order" });
  }
};

const getOrderStatus = async (req, res) => {
  //Receives order id as parameter from user
  const { orderId } = req.params;

  //Looks for order id in database
  try {
    const orderData = await db["order"].findOne({ orderId: orderId });
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

export { createOrder, getOrderStatus, changeOrder };
