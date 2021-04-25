import express, { Application, Express, Request, Response } from "express";
import { getContacts, updateContacts } from "../services/contacts";
import { getListings } from "../services/listing";
import reports from "./reports";

const api: Express = express();

api.get("/contacts", async (req: Request, res: Response) => {
  const data = await getContacts();
  res.send(data);
});

reports.post("/contacts", async (req: any, res: Response) => {
  if (req.files && req.files.csv) {
    const newFile = req.files.csv;

    if (newFile.mimetype !== "text/csv") {
      res.status(400);
      res.send("File must be a csv");
      return;
    }

    await updateContacts(newFile);

    res.status(200);
  } else {
    res.status(400);
    res.send("Missing CSV");
    return;
  }
});

api.get("/listings", async (req: Request, res: Response) => {
  const data = await getListings();
  res.send(data);
});
export default api;
