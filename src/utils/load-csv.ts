import fs from "fs/promises";
import parse from "csv-parse/lib/sync";

const loadCSV = async (filePath: string): Promise<Array<any>> => {
  const fileContent: Buffer = await fs.readFile(__dirname + filePath);
  return parse(fileContent, { columns: true });
};

export default loadCSV;
