import fs from "fs/promises";
import parse from "csv-parse/lib/sync";
import { Parser as Converter } from "json2csv";

// Not the nicest way to get root
const root = process.env.PWD;

const updateCSV = async (
  filename: string,
  data: Buffer,
  dataValidator: (data: any, existingData: any) => boolean
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    const filePath = `${root}/src/static/${filename}.csv`;

    const fileContent: Buffer = await fs.readFile(filePath);
    const existingData = await parse(fileContent, { columns: true });
    const newData = await parse(data, { columns: true });

    // Remove any invalid pieces of data
    const validData = newData.filter((data: any) =>
      dataValidator(data, existingData)
    );

    if (
      !validData ||
      validData.length === 0 ||
      !existingData ||
      (validData.length === 0 && existingData.length === 0)
    ) {
      reject('no_data_to_update')
      return;
    }

    const columns = Object.keys(validData[0]);
    try {
      const converter = new Converter({ fields: columns });

      const newCSV: any = converter.parse(existingData.concat(validData));

      await fs.writeFile(filePath, newCSV);

      resolve(newData);
    } catch (err) {
      reject(err);
    }
  });
};

export default updateCSV;
