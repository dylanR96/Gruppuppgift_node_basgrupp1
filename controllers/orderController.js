import db from "../db/database.js";
import menu from "../services/menu.js";
import createDeliveryTime from "../services/createDeliveryTime.js";

let cart = [];

// vi får eventuellt byta ut productId senare beroende vad id:t från ordern heter
const deleteItem = async (req, res) => {
  try {
    const { productId } = req.body;

    // Kontrollera att productId är tillgängligt
    if (!productId) {
      return res.status(400).json({ message: "Produkt-ID saknas" });
    }

    // Hitta indexet för produkten i korgen baserat på productId
    const productIndex = cart.findIndex((product) => product.id === productId);
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Produkten finns inte i kundvagnen" });
    }

    // Ta bort den specifika produkten från korgen
    cart.splice(productIndex, 1);

    res
      .status(200)
      .json({ message: "Produkten har tagits bort från kundvagnen" });
  } catch (error) {
    console.error("Fel vid bortttagning av produkt:", error);
    return res.status(500).json({ message: "Internt serverfel" });
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

export { createOrder, getOrderStatus, changeOrder, deleteItem };
