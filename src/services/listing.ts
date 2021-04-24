import { Listing, SellerType } from "../models/listing";
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

  console.log(total);
  return total / filteredListings.length;
};

export const getAveragePricePerSeller = async (): Promise<any> => {
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
