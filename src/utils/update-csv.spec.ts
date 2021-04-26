import fs from "fs/promises";
import updateCSV from "./update-csv";
import parse from "csv-parse";

const mockExistingCsvString: string = `
"id","make","price","mileage","seller_type"
1000,"Audi",49717,6500,"private"
1001,"Mazda",22031,7000,"private"
1002,"BWM",17742,6000,"dealer"
1003,"Toyota",11768,0,"dealer"
1004,"Mazda",25219,3000,"other"
`;

const mockNewCSVString: string = `
"id","make","price","mileage","seller_type"
1000,"Audi",49717,6500,"private"
1001,"Mazda",22031,123,"foo"
1002,"BWM",17742,6000,""
1003,"Toyota",11768,0,"dealer"
1004,"Mazda",25219,3000,"other"
`;

const spy = jest
  .spyOn(fs, "readFile")
  .mockImplementation(async () => await Buffer.from(mockExistingCsvString));

describe("update-csv", () => {
  let csvArray: Array<any>;
  const mockValidate = jest.fn().mockReturnValue(true)
  beforeEach(async () => {
    await updateCSV("test-path", await Buffer.from(mockNewCSVString), mockValidate);
  });

  it("should call fs with the correct path", () => {
    const expectedPath = `${process.env.PWD}/src/static/test-path.csv`;
    expect(spy).toBeCalledWith(expectedPath);
  });


  it("should call validate with the correct parameters", () => {
    const expectedPath = `${process.env.PWD}/src/static/test-path.csv`;
    expect(mockValidate).toBeCalled();
  });
});
