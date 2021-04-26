import express, { Express, Request, Response } from "express";
import {
  getAveragePricePerSeller,
  getAvgPriceOfTopPercentile,
  getVehicleDistribution,
  topListingsPerMonth,
} from "../services/reports";

const reports: Express = express();

reports.get("/", async (req: Request, res: Response) => {
  const data = {
    average_price: await getAveragePricePerSeller(),
    distribution: await getVehicleDistribution(),
    top_percentile: await getAvgPriceOfTopPercentile(),
    listings_per_month: await topListingsPerMonth(),
  };

  res.send(data);
});

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
