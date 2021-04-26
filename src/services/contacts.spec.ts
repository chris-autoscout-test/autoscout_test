import { getContacts } from "./contacts";
import loadCSV from "../utils/load-csv";
import updateCSV from "../utils/update-csv";

jest.mock("../utils/load-csv");
jest.mock("../utils/update-csv");

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
      (loadCSV as jest.Mock).mockResolvedValue([]);
      (updateCSV as jest.Mock).mockImplementation(() => {})
    });
    it("should return an empty array", async () => {
      const data = await getContacts();
      expect(data).toMatchObject([]);
    });
  });

  describe("when csv has data", () => {
    beforeEach(() => {
      (loadCSV as jest.Mock).mockResolvedValue(mockCSVData);
      (updateCSV as jest.Mock).mockImplementation(() => {})
    });
    it("should return the correct array ", async () => {
      const data = await getContacts();
      const expectedData = [
        {
          listingId: 1,
          contactDate: new Date(1592498493000),
        },
        {
          listingId: 2,
          contactDate: new Date(1582474057000),
        },
        {
          listingId: 3,
          contactDate: new Date(1579365755000),
        },
      ];

      expect(data).toMatchObject(expectedData);
    });
  });
});
