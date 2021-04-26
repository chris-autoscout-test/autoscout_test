import { Listing } from "../models/listing";
import loadCSV from "../utils/load-csv";
import updateCSV from "../utils/update-csv";

export const getListings = async (): Promise<Array<Listing>> => {
  const data = await loadCSV("listings");
  return data.map(
    ({ id, make, price, mileage, seller_type }) =>
      <Listing>{
        listingId: Number(id),
        make: make && make.toLowerCase(), // Using toLowerCase so that any misspellings in the csv wont affect the data.
        price: Number(price),
        mileage: Number(mileage),
        sellerType: seller_type
      }
  );
};

const validateListing = (data: any) => {
  const { id, make, price, mileage, seller_type } = data;
  if (!id || !make || !price || !mileage || !seller_type) {
    return false;
  }
  // Ensure seller type is valid
  if (["private", "other", "dealer"].indexOf(seller_type) === -1) {
    return false;
  }

  return true;
};


export const updateListings = async (updatedData: any): Promise<boolean> => {
  return await updateCSV("listings", updatedData, validateListing);
};

