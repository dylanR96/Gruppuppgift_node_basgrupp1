import db from "../db/database.js";

const createOrder = async (req, res) => {
  let newOrder = req.body;

  for (let order of newOrder) {
    const { id, title, desc, price } = order;
    if (id == null || title == null || desc == null || price == null) {
      return res
        .status(400)
        .json({ error: "Each order must contain id, title, desc, and price" });
    }
  }

  try {
    const insertedData = await db["order"].insert(newOrder);
    return res.status(201).json(insertedData);
  } catch (error) {
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

export { createOrder, changeOrder };
