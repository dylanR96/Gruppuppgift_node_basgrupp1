import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import company from "./routes/company.js";
import order from "./routes/order.js";
import users from "./routes/users.js";

const port = 8000;
const app = express();

global.currentUser = null;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/company", company);
app.use("/api/order", order);
app.use("/api/users", users);

// Middlewares
app.use(notFound);

app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on PORT: ${port}`));
