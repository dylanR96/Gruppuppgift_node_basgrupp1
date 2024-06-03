import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import db from "./db/database.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import company from "./routes/company.js";
import order from "./routes/order.js";
import users from "./routes/users.js";

const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/company", company);
app.use("/api/order", order);
app.use("/api/users", users);

app.use(notFound);

app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on PORT ${port}`));
