import { getListings } from "./listing";
import loadCSV from "../utils/load-csv";
import updateCSV from "../utils/update-csv";

jest.mock("../utils/load-csv");
jest.mock("../utils/update-csv");

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
      (loadCSV as jest.Mock).mockResolvedValue([]);
      (updateCSV as jest.Mock).mockImplementation(() => {});
    });
    it("should return an empty array", async () => {
      const data = await getListings();
      expect(data).toMatchObject([]);
    });
  });

  describe("when csv has data", () => {
    beforeEach(() => {
      (loadCSV as jest.Mock).mockResolvedValue(mockCSVData);
      (updateCSV as jest.Mock).mockImplementation(() => {});
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
