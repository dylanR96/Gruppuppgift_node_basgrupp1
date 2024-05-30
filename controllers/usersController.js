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

// Logga in
const login = (req, res) => {
  const { username, password } = req.body;
  findUser(username, (err) => {
    if (err) return res.status(401).send("Inloggning misslyckades");
    else {
      return res.status(200).send(`Inloggning lyckades. Välkommen ${username}`);
    }
  });
};

export { createUser, login };
