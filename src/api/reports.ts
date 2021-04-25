import express, { Express, Request, Response } from "express";
import { updateContacts } from "../services/contacts";
import {
  getAveragePricePerSeller,
  getAvgPriceOfTopPercentile,
  getVehicleDistribution,
  topListingsPerMonth,
} from "../services/reports";

const reports: Express = express();

reports.get("/average_price", async (req: Request, res: Response) => {
  res.send(await getAveragePricePerSeller());
});

reports.get("/distribution", async (req: Request, res: Response) => {
  res.send(await getVehicleDistribution());
});

reports.get("/top_percentile", async (req: Request, res: Response) => {
  res.send({ average: await getAvgPriceOfTopPercentile() });
});

reports.get("/listings_per_month", async (req: Request, res: Response) => {
  res.send(await topListingsPerMonth());
});

export default reports;
