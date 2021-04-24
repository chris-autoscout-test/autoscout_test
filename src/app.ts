import express, { Express, Request, Response } from "express";
import compression from "compression";
import bodyParser from "body-parser";
import api from "./api/api";

const app: Express = express();
// Express configuration
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", api);

/**
 * App routes.
 */
app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

export default app;
