import { getContacts } from "./contacts";
import loadCSV from "../utils/load-csv";

jest.mock("../utils/load-csv");

const mockCSVData = [
  {
    listing_id: "1",
    contact_date: "1592498493000",
  },
  {
    listing_id: "2",
    contact_date: "1582474057000",
  },
  {
    listing_id: "3",
    contact_date: "1579365755000",
  },
];

describe("getContacts", () => {
  describe("when csv is empty", () => {
    beforeEach(() => {
      (loadCSV as any).mockResolvedValue([]);
    });
    it("should return an empty array", async () => {
      const data = await getContacts();
      expect(data).toMatchObject([]);
    });
  });

  describe("when csv has data", () => {
    beforeEach(() => {
      (loadCSV as any).mockResolvedValue(mockCSVData);
    });
    it("should return the correct array ", async () => {
      const data = await getContacts();
      const expectedData = [
        {
          listingId: mockCSVData[0].listing_id,
          contactDate: new Date(1592498493000),
        },
        {
          listingId: mockCSVData[1].listing_id,
          contactDate: new Date(1582474057000),
        },
        {
          listingId: mockCSVData[2].listing_id,
          contactDate: new Date(1579365755000),
        },
      ];

      expect(data).toMatchObject(expectedData);
    });
  });
});
