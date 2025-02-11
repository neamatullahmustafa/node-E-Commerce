import express from "express";
import { dbConnection } from "./database/connection.js";
import { bootstrap } from "./src/modules/bootstrap.js";
const app = express();
const port = 3000;
app.use(express.json());
dbConnection();

bootstrap(app);
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`ecommerce app listening on port ${port}!`));
