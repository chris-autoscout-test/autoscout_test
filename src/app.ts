import express, { Express, Request, Response } from "express";
import compression from "compression";
import bodyParser from "body-parser";
import api from "./api/api";

// port is now available to the Node.js runtime
// as if it were an environment variable
const port: string | number = process.env.SERVER_PORT;

// Create Express server
const app: Express = express();

// Express configuration
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * App routes.
 */
app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});
app.use("/api", api);

export default app;
