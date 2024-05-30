import joi from "joi";
import db from "../db/database.js";

// Skapa JOI-schema för att validera användarens input
const userSchema = joi.object({
  username: joi.string().min(3).max(20).required(),
  password: joi.string().min(3).max(20).required(),
});

const createUser = async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username, password } = req.body;

  try {
    // Kontrollera om användarnamnet redan finns
    const existingUser = await db.users.findOne({ username });
    if (existingUser)
      return res.status(400).send("Användarnamnet är redan taget");

    const newUser = { username, password };

    // Spara användaren i databasen
    const createdUser = await db.users.insert(newUser);
    res.status(201).json({
      message: "Användare skapad",
      user: { id: createdUser._id, username: createdUser.username },
    });
  } catch (err) {
    res.status(500).send("Kunde inte skapa användaren.");
  }
};

// Logga in controller
const login = async (req, res) => {
  // Validera användarens input
  const { error } = userSchema.validate(req.body);
  // Om valideringen misslyckas
  if (error) return res.status(400).send(error.details[0].message);

  // Hämta användarnamn och lösenord från request body
  const { username, password } = req.body;

  try {
    // Hämtar information om användaren från databasen
    const user = await db.users.findOne({ username, password });

    // Om användaren inte finns i databasen
    if (!user)
      return res.status(401).json({
        message: `Fel användarnamn eller lösenord.`,
      });

    // Om användaren finns i databasen.
    res.status(200).json({
      message: `Inloggning lyckades. Inloggad användare: ${username}`,
    });
  } catch (error) {
    // Loggar felmeddelandet i konsolen
    console.error(error);
    res.status(500).send(`Inloggning misslyckades.`);
  }
};

export { createUser, login };