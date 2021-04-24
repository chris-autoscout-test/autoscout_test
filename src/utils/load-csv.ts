import fs from "fs/promises";
import parse from "csv-parse/lib/sync";

// Not the nicest way to get root
const root = process.env.PWD;

const loadCSV = async (filename: string): Promise<Array<any>> => {
  const fileContent: Buffer = await fs.readFile(
    `${root}/src/static/${filename}.csv`
  );
  return parse(fileContent, { columns: true });
};

export default loadCSV;
