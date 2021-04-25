import express, { Express, Request, Response } from "express";
import compression from "compression";
import bodyParser from "body-parser";
import path from "path";
import api from "./api/api";

const app: Express = express();
// Express configuration
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", api);

/**
 * App routes.
 */
// app.get("/", (req: Request, res: Response) => {
//   res.sendStatus(200);
// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/home.html"));
});

export default app;
