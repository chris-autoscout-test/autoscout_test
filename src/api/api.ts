import express, { Application, Express, Request, Response } from "express";
import { getContacts } from "../services/contacts";

const api: Express = express();

api.get("/contacts", async (req: Request, res: Response) => {
  const data = await getContacts();

  res.send(data);
});

export default api;
