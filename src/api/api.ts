import express, { Application, Express, Request, Response } from "express";
import { getContacts, updateContacts } from "../services/contacts";
import { getListings, updateListings } from "../services/listing";

const api: Express = express();

api.get("/contacts", async (req: Request, res: Response) => {
  const data = await getContacts();
  res.send(data);
});

api.post("/contacts", async (req: any, res: Response) => {
  if (req.files && req.files.csv) {
    const newFile = req.files.csv;

    if (newFile.mimetype !== "text/csv") {
      res.status(400);
      res.send("File must be a csv");
      return;
    }

    try {
      await updateContacts(newFile.data);
      res.status(200);
      res.send();
    } catch {
      res.status(500);
      res.send('Something went wrong! Please try again.')
    }

    res.status(200);
    res.send();
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

api.post("/listings", async (req: any, res: Response) => {
  if (req.files && req.files.csv) {
    const newFile = req.files.csv;

    if (newFile.mimetype !== "text/csv") {
      res.status(400);
      res.send("File must be a csv");
      return;
    }
    try {
      await updateListings(newFile.data);

      res.status(200);
      res.send();
    } catch {
      res.status(500);
      res.send('Something went wrong! Please try again.')
    }
  } else {
    res.status(400);
    res.send("Missing CSV");
    return;
  }
});

export default api;
