import { Listing, SellerType } from "../models/listing";
import loadCSV from "../utils/load-csv";
import { getContacts } from "./contacts";
import { Contact } from "../models/contacts";

interface calcDistributionReturn {
  make: string;
  percentage: number;
}

interface calcAvgReturn {
  [SellerType.Private]: number;
  [SellerType.Dealer]: number;
  [SellerType.Other]: number;
}

type ListingWithContactCount = Listing & {
  ranking?: number;
  contactsPerListing?: number;
};
type ContactWithMonthYear = Contact & { monthYear?: string };

const TOP_PERCENTILE_AMOUNT = 0.3;
const TOTAL_LISTINGS_FOR_MONTH = 5;

export const getListings = async (): Promise<Array<Listing>> => {
  const data = await loadCSV("listings");
  return data.map(
    ({ id, make, price, mileage, seller_type }) =>
      <Listing>{
        listingId: Number(id),
        make: make && make.toLowerCase(), // Using toLowerCase so that any misspellings in the csv wont affect the data.
        price: Number(price),
        mileage: Number(mileage),
        sellerType: seller_type,
      }
  );
};
