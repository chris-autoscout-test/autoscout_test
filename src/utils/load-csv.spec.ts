import fs from "fs/promises";
import loadCSV from "./load-csv";

const mockCsvString = `
"id","make","price","mileage","seller_type"
1000,"Audi",49717,6500,"private"
1001,"Mazda",22031,7000,"private"
1002,"BWM",17742,6000,"dealer"
1003,"Toyota",11768,0,"dealer"
1004,"Mazda",25219,3000,"other"
`;

const spy = jest
  .spyOn(fs, "readFile")
  .mockImplementation(async () => await Buffer.from(mockCsvString));

describe("csv-parser", () => {
  let csvArray: Array<any>;

  beforeEach(async () => {
    csvArray = await loadCSV("test-path");
  });

  it("should return the content of a csv as an array", () => {
    expect(csvArray).toBeInstanceOf(Array);
  });

  it("should have 5 elements ", () => {
    expect(csvArray).toHaveLength(5);
  });

  it("first element should match expected object ", () => {
    expect(csvArray[0]).toMatchObject({
      id: "1000",
      make: "Audi",
      price: "49717",
      mileage: "6500",
      seller_type: "private",
    });
  });
});
