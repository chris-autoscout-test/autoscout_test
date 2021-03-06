export enum SellerType {
  Private = "private",
  Dealer = "dealer",
  Other = "other",
}

export type Listing = {
  listingId: number;
  make: string;
  price: number;
  mileage: number;
  sellerType: SellerType;
};
