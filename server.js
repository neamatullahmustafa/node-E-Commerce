import express from "express";
import { bootstrap } from "./src/modules/bootstrap.js";
import { AppError } from "./src/utils/appError.js";
import { globalError } from "./src/middleware/globalError.js";
import { validate } from "./src/middleware/validate.js";
const app = express();
const port = 3000;

export const server = () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  bootstrap(app);
  app.use("*", (err, req, res) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  app.use(validate);
  app.use(globalError);
  app.use("uploads", express.static("uploads"));
  app.get("/", (req, res) => res.send("Hello World!"));
  app.listen(port, () =>
    console.log(`ecommerce app listening on port ${port}!`)
  );
};
