import { Listing } from "../models/listing";
import loadCSV from "../utils/load-csv";

export const getListings = async (): Promise<Array<Listing>> => {
  const data = await loadCSV("listings");
  return data.map(
    ({ id, make, price, mileage, seller_type }) =>
      <Listing>{
        listingId: Number(id),
        make: make,
        price: Number(price),
        mileage: Number(mileage),
        sellerType: seller_type,
      }
  );
};
