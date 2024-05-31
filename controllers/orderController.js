import db from "../db/database.js";
import menu from "../services/menu.js";

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

export { deleteItem };
