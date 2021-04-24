import express, { Application, Express, Request, Response } from "express";
import { getContacts } from "../services/contacts";
import {
  getAveragePricePerSeller,
  getListings,
  getVehicleDistribution,
} from "../services/listing";

const api: Express = express();

api.get("/contacts", async (req: Request, res: Response) => {
  const data = await getContacts();
  res.send(data);
});

api.get("/listings", async (req: Request, res: Response) => {
  const data = await getListings();
  res.send(data);
});

api.get("/report/average_price", async (req: Request, res: Response) => {
  const data = await getAveragePricePerSeller();

  res.send(data);
});

api.get("/report/distribution", async (req: Request, res: Response) => {
  const data = await getVehicleDistribution();

  res.send(data);
});

export default api;
