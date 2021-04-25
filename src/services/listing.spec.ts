import {
  getAveragePricePerSeller,
  getAvgPriceOfTopPercentile,
  getListings,
  getVehicleDistribution,
  topListingsPerMonth,
} from "./listing";
import loadCSV from "../utils/load-csv";
import { getContacts } from "./contacts";
import { Contact } from "../models/contacts";

jest.mock("../utils/load-csv");
jest.mock("./contacts");

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
const mockContactData = [
  <Contact>{
    listingId: 3,
    contactDate: new Date(), // use parse int to convert string to int
  },
  <Contact>{
    listingId: 3,
    contactDate: new Date(), // use parse int to convert string to int
  },
  <Contact>{
    listingId: 2,
    contactDate: new Date(), // use parse int to convert string to int
  },
  <Contact>{
    listingId: 3,
    contactDate: new Date(), // use parse int to convert string to int
  },
];

describe("getListings", () => {
  describe("when csv is empty", () => {
    beforeEach(() => {
      (loadCSV as jest.Mock).mockResolvedValue([]);
    });
    it("should return an empty array", async () => {
      const data = await getListings();
      expect(data).toMatchObject([]);
    });
  });

  describe("when csv has data", () => {
    beforeEach(() => {
      (loadCSV as jest.Mock).mockResolvedValue(mockCSVData);
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
      (loadCSV as jest.Mock).mockResolvedValue([]);
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
      (loadCSV as jest.Mock).mockResolvedValue(mockCSVData);
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
      (loadCSV as jest.Mock).mockResolvedValue([
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
      (loadCSV as jest.Mock).mockResolvedValue([]);
    });
    it("should return an empty object", async () => {
      const data = await getVehicleDistribution();
      expect(data).toMatchObject({});
    });
  });

  describe("when csv has 1 vehicle make", () => {
    beforeEach(() => {
      (loadCSV as jest.Mock).mockResolvedValue([
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
      expect(data).toMatchObject([{ make: "audi", percentage: 1 }]);
    });
  });

  describe("when csv has many of each make", () => {
    beforeEach(() => {
      (loadCSV as jest.Mock).mockResolvedValue([
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
      expect(data).toMatchObject([
        { make: "audi", percentage: 0.6666666666666666 },
        { make: "bmw", percentage: 0.16666666666666666 },
        { make: "mercedes", percentage: 0.16666666666666666 },
      ]);
    });
  });
});

describe("getAvgPriceOfTopPercentile", () => {
  describe("when csv is empty", () => {
    beforeEach(() => {
      (loadCSV as jest.Mock).mockResolvedValue([]);
      (getContacts as jest.Mock).mockResolvedValue([]);
    });
    it("should return 0", async () => {
      const data = await getAvgPriceOfTopPercentile();
      expect(data).toEqual(0);
    });
  });

  describe("when csv has 1 vehicle and 1 contact", () => {
    beforeEach(() => {
      (loadCSV as jest.Mock).mockResolvedValue(mockCSVData);
      (getContacts as jest.Mock).mockResolvedValue(mockContactData);
    });
    it("should the single vehicle value", async () => {
      const data = await getAvgPriceOfTopPercentile();
      expect(data).toEqual(30);
    });
  });

  describe("when csv has multiple listings in avg", () => {
    beforeEach(() => {
      (loadCSV as jest.Mock).mockResolvedValue([
        ...mockCSVData,
        {
          id: "4",
          make: "Audi",
          price: "900",
          mileage: "100",
          seller_type: "private",
        },
      ]);
      (getContacts as jest.Mock).mockResolvedValue(mockContactData);
    });

    it("should return the correct average for all types", async () => {
      const data = await getAvgPriceOfTopPercentile();
      expect(data).toEqual(30);
    });
  });
});

describe("topListingsPerMonth", () => {
  describe("when csv is empty", () => {
    beforeEach(() => {
      (loadCSV as jest.Mock).mockResolvedValue([]);
      (getContacts as jest.Mock).mockResolvedValue([]);
    });
    it("should return an empty object", async () => {
      const data = await topListingsPerMonth();
      expect(data).toEqual({});
    });
  });

  describe("when csv has 1 month of data", () => {
    beforeEach(() => {
      (loadCSV as jest.Mock).mockResolvedValue(mockCSVData);
      (getContacts as jest.Mock).mockResolvedValue(mockContactData);
    });
    it("return all listings keyed by date", async () => {
      const data = await topListingsPerMonth();
      const expected = {
        "04.2021": [
          {
            contactsPerListing: 3,
            listingId: 3,
            make: "mercedes",
            mileage: 300,
            price: 40,
            sellerType: "other",
          },
          {
            contactsPerListing: 1,
            listingId: 2,
            make: "bmw",
            mileage: 200,
            price: 45,
            sellerType: "dealer",
          },
          {
            contactsPerListing: 0,
            listingId: 1,
            make: "audi",
            mileage: 100,
            price: 30,
            sellerType: "private",
          },
        ],
      };
      expect(data).toEqual(expected);
    });
  });
});
