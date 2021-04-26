import express, { Application, Express, Request, Response } from "express";
import { getContacts, updateContacts } from "../services/contacts";
import { getListings, updateListings } from "../services/listing";
import { UploadedFile } from "express-fileupload";

const api: Express = express();

api.get("/contacts", async (req: Request, res: Response) => {
  const data = await getContacts();
  res.send(data);
});

const handleCSVUpload = async (req: Request, res: Response, type: string) => {
  if (req.files && req.files.csv) {
    const newFile: any = req.files.csv;

    if (newFile.mimetype !== "text/csv") {
      res.status(400);
      res.send("File must be a csv");
      return;
    }

    try {
      if (type === "contacts") {
        await updateContacts(newFile.data);
      } else if (type === "listings") {
        await updateListings(newFile.data);
      }
      res.status(200);
      res.send();
    } catch (err) {
      if (err === "no_data_to_update") {
        res.status(409);
        res.send("Uploaded CSV is invalid. Please check again");
      } else {
        res.status(500);
        res.send("Something went wrong! Please try again.");
      }
    }

    res.status(200);
    res.send();
  } else {
    res.status(400);
    res.send("Missing CSV");
    return;
  }
};

api.post("/contacts", async (req: any, res: Response) => {
  handleCSVUpload(req, res, "contacts");
});

api.get("/listings", async (req: Request, res: Response) => {
  const data = await getListings();
  res.send(data);
});

api.post("/listings", async (req: any, res: Response) => {
  handleCSVUpload(req, res, "listings");
});

export default api;
