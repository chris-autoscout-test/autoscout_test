import express, { Express, Request, Response } from "express";
import compression from "compression";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import path from "path";
import api from "./api/api";
import reports from "./api/reports";

const app: Express = express();
// Express configuration
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use("/api", api);
app.use("/api/reports", reports);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/home.html"));
});

export default app;
