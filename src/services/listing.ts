import { Listing, SellerType } from "../models/listing";
import loadCSV from "../utils/load-csv";

interface calcDistributionReturn {
  [key: string]: number;
}

interface calcAvgReturn {
  [SellerType.Private]: number;
  [SellerType.Dealer]: number;
  [SellerType.Other]: number;
}

export const getListings = async (): Promise<Array<Listing>> => {
  const data = await loadCSV("listings");
  return data.map(
    ({ id, make, price, mileage, seller_type }) =>
      <Listing>{
        listingId: Number(id),
        make: make.toLowerCase(), // Using toLowerCase so that any misspellings in the csv wont affect the data.
        price: Number(price),
        mileage: Number(mileage),
        sellerType: seller_type,
      }
  );
};

const calculateAvgForListingType = (
  sellerType: SellerType,
  listings: Array<Listing>
) => {
  const filteredListings = listings.filter(
    (listing: Listing) => listing.sellerType === sellerType
  );

  // Short circuit of there are no listings to check
  if (filteredListings.length === 0) {
    return 0;
  }
  const total = filteredListings.reduce(
    (sum: number, listing: Listing) => sum + listing.price,
    0
  );
  return total / filteredListings.length;
};

export const getAveragePricePerSeller = async (): Promise<calcAvgReturn> => {
  const listings = await getListings();

  return {
    [SellerType.Private]: calculateAvgForListingType(
      SellerType.Private,
      listings
    ),
    [SellerType.Dealer]: calculateAvgForListingType(
      SellerType.Dealer,
      listings
    ),
    [SellerType.Other]: calculateAvgForListingType(SellerType.Other, listings),
  };
};

export const getVehicleDistribution = async (): Promise<calcDistributionReturn> => {
  const listings = await getListings();

  if (listings.length === 0) {
    return {};
  }

  const totals = listings.reduce(
    (result: any, { make }: Listing) =>
      Object.assign(result, { [make]: result[make] ? result[make] + 1 : 1 }),
    {}
  );

  const distribution = { ...totals };
  Object.keys(totals).forEach((key) => {
    distribution[key] /= listings.length;
  });

  return distribution;
};
