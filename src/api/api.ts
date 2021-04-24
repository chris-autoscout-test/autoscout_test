import express, { Application, Express, Request, Response } from "express";
import { getContacts } from "../services/contacts";
import {
  getAveragePricePerSeller,
  getAvgPriceOfTopPercentile,
  getListings,
  getVehicleDistribution,
  topListingsPerMonth,
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

api.get("/report/top_percentile", async (req: Request, res: Response) => {
  const data = await getAvgPriceOfTopPercentile();

  res.send({ average: data });
});

api.get("/report/listings_per_month", async (req: Request, res: Response) => {
  const data = await topListingsPerMonth();

  res.send(data);
});

export default api;
