import express, { Application, Express, Request, Response } from "express";
import { getContacts, updateContacts } from "../services/contacts";
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

api.post("/contacts", async (req: any, res: Response) => {
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

export default api;
