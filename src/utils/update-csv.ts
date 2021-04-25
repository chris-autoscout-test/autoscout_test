import loadCSV from "./load-csv";

const updateCSV = (filename: string, data: Buffer) => {
  const existingData = loadCSV(filename);
};
