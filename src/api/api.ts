import express, { Application, Express, Request, Response } from "express";
const api: Express = express();

api.on("mount", function (parent: Application) {
  console.log("API Mounted");
});

api.get("/report", (req: Request, res: Response) => {
  res.send({
    foo: "bar",
  });
});

export default api;
