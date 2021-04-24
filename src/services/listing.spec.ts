import {
  getAveragePricePerSeller,
  getListings,
  getVehicleDistribution,
} from "./listing";
import loadCSV from "../utils/load-csv";

jest.mock("../utils/load-csv");

const mockCSVData = [
  {
    id: "1",
    make: "Audi",
    price: "30",
    mileage: "100",
    seller_type: "private",
  },
  {
    id: "2",
    make: "BMW",
    price: "45",
    mileage: "200",
    seller_type: "dealer",
  },
  {
    id: "3",
    make: "Mercedes",
    price: "40",
    mileage: "300",
    seller_type: "other",
  },
];

describe("getListings", () => {
  describe("when csv is empty", () => {
    beforeEach(() => {
      (loadCSV as any).mockResolvedValue([]);
    });
    it("should return an empty array", async () => {
      const data = await getListings();
      expect(data).toMatchObject([]);
    });
  });

  describe("when csv has data", () => {
    beforeEach(() => {
      (loadCSV as any).mockResolvedValue(mockCSVData);
    });
    it("should return the correct array ", async () => {
      const data = await getListings();
      const expectedData = [
        {
          listingId: 1,
          make: "audi",
          price: 30,
          mileage: 100,
          sellerType: "private",
        },
        {
          listingId: 2,
          make: "bmw",
          price: 45,
          mileage: 200,
          sellerType: "dealer",
        },
        {
          listingId: 3,
          make: "mercedes",
          price: 40,
          mileage: 300,
          sellerType: "other",
        },
      ];

      expect(data).toMatchObject(expectedData);
    });
  });
});

describe("getAveragePricePerSeller", () => {
  describe("when csv is empty", () => {
    beforeEach(() => {
      (loadCSV as any).mockResolvedValue([]);
    });
    it("should return 0 for all types", async () => {
      const data = await getAveragePricePerSeller();
      expect(data).toMatchObject({
        private: 0,
        dealer: 0,
        other: 0,
      });
    });
  });

  describe("when csv only has 1 of each type", () => {
    beforeEach(() => {
      (loadCSV as any).mockResolvedValue(mockCSVData);
    });
    it("should return the correct average for all types", async () => {
      const data = await getAveragePricePerSeller();
      expect(data).toMatchObject({
        private: 30,
        dealer: 45,
        other: 40,
      });
    });
  });

  describe("when csv has many of each type", () => {
    beforeEach(() => {
      (loadCSV as any).mockResolvedValue([
        ...mockCSVData,
        {
          id: "1",
          make: "Audi",
          price: "90",
          mileage: "100",
          seller_type: "private",
        },
        {
          id: "2",
          make: "Audi",
          price: "100",
          mileage: "100",
          seller_type: "private",
        },
        {
          id: "3",
          make: "Audi",
          price: "500",
          mileage: "100",
          seller_type: "private",
        },
      ]);
    });

    it("should return the correct average for all types", async () => {
      const data = await getAveragePricePerSeller();
      expect(data).toMatchObject({
        private: 180,
        dealer: 45,
        other: 40,
      });
    });
  });
});

describe("getVehicleDistribution", () => {
  describe("when csv is empty", () => {
    beforeEach(() => {
      (loadCSV as any).mockResolvedValue([]);
    });
    it("should return an empty object", async () => {
      const data = await getVehicleDistribution();
      expect(data).toMatchObject({});
    });
  });

  describe("when csv has 1 vehicle make", () => {
    beforeEach(() => {
      (loadCSV as any).mockResolvedValue([
        {
          id: "1",
          make: "Audi",
          price: "30",
          mileage: "100",
          seller_type: "private",
        },
        {
          id: "2",
          make: "Audi",
          price: "30",
          mileage: "100",
          seller_type: "private",
        },
      ]);
    });
    it("should return 100% for the single type", async () => {
      const data = await getVehicleDistribution();
      expect(data).toMatchObject({
        audi: 1,
      });
    });
  });

  describe("when csv has many of each make", () => {
    beforeEach(() => {
      (loadCSV as any).mockResolvedValue([
        ...mockCSVData,
        {
          id: "1",
          make: "Audi",
          price: "90",
          mileage: "100",
          seller_type: "private",
        },
        {
          id: "2",
          make: "Audi",
          price: "100",
          mileage: "100",
          seller_type: "private",
        },
        {
          id: "3",
          make: "Audi",
          price: "500",
          mileage: "100",
          seller_type: "private",
        },
      ]);
    });

    it("should return the correct average for all types", async () => {
      const data = await getVehicleDistribution();
      expect(data).toMatchObject({
        audi: 0.6666666666666666,
        bmw: 0.16666666666666666,
        mercedes: 0.16666666666666666,
      });
    });
  });
});
