import dotenv from "dotenv";
import express, { Request, Response } from "express";
import compression from "compression";
import bodyParser from "body-parser";

// Use dotEnv for config
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * App routes.
 */
app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`I am a server on port ${port}`);
});
