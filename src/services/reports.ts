import { Listing, SellerType } from "../models/listing";
import { getContacts } from "./contacts";
import { Contact } from "../models/contacts";
import { getListings } from "./listing";

const TOP_PERCENTILE_AMOUNT = 0.3;
const TOTAL_LISTINGS_FOR_MONTH = 5;

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

export const getVehicleDistribution = async (): Promise<
  Array<calcDistributionReturn>
> => {
  const listings = await getListings();

  if (listings.length === 0) {
    return [];
  }

  const totals = listings.reduce(
    (result: any, { make }: Listing) =>
      Object.assign(result, { [make]: result[make] ? result[make] + 1 : 1 }),
    {}
  );

  let distribution: any = [];
  Object.keys(totals).forEach((key) => {
    distribution.push({
      make: key,
      percentage: totals[key] / listings.length,
    });
  });
  // Convert object to array so that it can be sorter
  return distribution.sort(
    (a: calcDistributionReturn, b: calcDistributionReturn) =>
      b.percentage - a.percentage
  );
};

export const getAvgPriceOfTopPercentile = async (): Promise<number> => {
  const contacts = await getContacts();
  const listings = await getListings();
  if (contacts.length === 0 || listings.length === 0) {
    return 0;
  }

  const results: any = listings.map((listing: Listing) => {
    const listingsWithContactCount: ListingWithContactCount = { ...listing };
    listingsWithContactCount.contactsPerListing = contacts.filter(
      (contact: Contact) => contact.listingId === listing.listingId
    ).length;
    return listingsWithContactCount;
  });

  results.sort(
    (a: ListingWithContactCount, b: ListingWithContactCount) =>
      a.contactsPerListing > b.contactsPerListing
  );
  const topPercentileLength = Math.round(
    results.length * TOP_PERCENTILE_AMOUNT
  );

  return (
    results
      .slice(0, topPercentileLength)
      .reduce((val: number, listing: ListingWithContactCount) => {
        return val + listing.price;
      }, 0) / topPercentileLength
  );
};

const getTopListingsForMonth = (
  monthYear: string,
  listings: Array<Listing>,
  contacts: Array<ContactWithMonthYear>,
  total: number = TOTAL_LISTINGS_FOR_MONTH
): Array<ListingWithContactCount> => {
  const contactsForThisMonth: Array<ContactWithMonthYear> = contacts.filter(
    (contact: ContactWithMonthYear) => contact.monthYear === monthYear
  );

  return listings
    .map((listing: Listing) => {
      const listingsWithContactCount: ListingWithContactCount = { ...listing };
      listingsWithContactCount.contactsPerListing = contactsForThisMonth.filter(
        (contact: Contact) => contact.listingId === listing.listingId
      ).length;
      return listingsWithContactCount;
    })
    .sort(
      (a: ListingWithContactCount, b: ListingWithContactCount) =>
        b.contactsPerListing - a.contactsPerListing
    )
    .slice(0, total);
};

export const topListingsPerMonth = async (): Promise<any> => {
  const contacts = await getContacts();
  const listings = await getListings();

  // Convert contacts date to a month year format
  const formattedContacts: any = contacts.map((contact: Contact) => {
    const { contactDate, listingId } = contact;
    // Format date as month.year with a left padding on month e.g. 02.2021
    const monthYear = `${String(contactDate.getMonth() + 1).padStart(
      2,
      "0"
    )}.${contactDate.getFullYear()}`;

    return { listingId, contactDate, monthYear };
  });

  // Get distinct months that exist in formatted contacts.
  const distinctMonths: Array<string> = formattedContacts
    .reduce((arr: Array<string>, contact: any) => {
      if (arr.indexOf(contact.monthYear) === -1) {
        arr.push(contact.monthYear);
      }
      return arr;
    }, [])
    .sort()
    .reverse();

  let result: any = {};

  distinctMonths.forEach((value: string) => {
    result[value] = getTopListingsForMonth(value, listings, formattedContacts);
  });

  return result;
};
