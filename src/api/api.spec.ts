import request from "supertest";
import api from "./api";
import loadCSV from "../utils/load-csv";

import testListingData from "../../test-data/test-listing-data";
import testContactData from "../../test-data/test-contacts-data";
import { Contact } from "../models/contacts";
import { Listing } from "../models/listing";
/**
 * These tests are essentially integration tests. Hence the lack of mocking
 */

jest.mock("../utils/load-csv");

describe("api.ts integration tests", () => {
  beforeEach(() => {
    (loadCSV as jest.Mock).mockImplementation((filename: string) => {
      return new Promise((resolve) => {
        if (filename === "contacts") {
          resolve(testContactData);
        } else if (filename === "listings") {
          resolve(testListingData);
        }
      });
    });
  });

  it("should return 200 and the list of contacts", async () => {
    const res = await request(api).get("/contacts").send();

    const convertContacts = [...testContactData].map(
      ({ listing_id, contact_date }) => ({
        listingId: Number(listing_id),
        contactDate: new Date(contact_date).toISOString(), // use parse int to convert string to int
      })
    );

    expect(res.status).toEqual(200);
    expect(res.body).toMatchObject(convertContacts);
  });

  it("should return 200 and the list of listings", async () => {
    const res = await request(api).get("/listings").send();

    const convertListings = [...testListingData].map(
      ({ id, make, price, mileage, seller_type }) =>
        <Listing>{
          listingId: Number(id),
          make: make && make.toLowerCase(), // Using toLowerCase so that any misspellings in the csv wont affect the data.
          price: Number(price),
          mileage: Number(mileage),
          sellerType: seller_type,
        }
    );
    expect(res.status).toEqual(200);
    expect(res.body).toMatchObject(convertListings);
  });

  it("should return 200 and the average_price for each type", async () => {
    const res = await request(api).get("/report/average_price").send();
    expect(res.status).toEqual(200);
    expect(res.body).toMatchObject({
      dealer: 498.6190476190476,
      other: 455.1333333333333,
      private: 344.57142857142856,
    });
  });

  it("should return 200 and the distribution of makes in listings", async () => {
    const res = await request(api).get("/report/distribution").send();

    const expectedDistribution = [
      { make: "volkswagen", percentage: 0.24 },
      { make: "mercedes", percentage: 0.24 },
      { make: "porsche", percentage: 0.22 },
      { make: "bmw", percentage: 0.18 },
      { make: "audi", percentage: 0.12 },
    ];

    expect(res.status).toEqual(200);
    expect(res.body).toMatchObject(expectedDistribution);

    //Check that values in distribution equal 100
    const totalPercent = expectedDistribution.reduce(
      (res, { percentage }) => (res += percentage * 100),
      0
    );
    expect(totalPercent).toEqual(100);
  });

  it("should return 200 and the average_price for top 30 %", async () => {
    const res = await request(api).get("/report/top_percentile").send();

    expect(res.status).toEqual(200);
    expect(res.body).toMatchObject({ average: 443.6666666666667 });
  });

  it("should return 200 and an array of all dates and the top listings in those dates", async () => {
    const res = await request(api).get("/report/listings_per_month").send();

    const expectedListingDates: any = [
      "12.2020",
      "11.2020",
      "10.2020",
      "09.2020",
      "08.2020",
      "07.2021",
      "07.2020",
      "06.2021",
      "06.2020",
      "05.2021",
      "05.2020",
      "04.2021",
      "04.2020",
      "03.2021",
      "03.2020",
      "02.2021",
      "02.2020",
      "01.2021",
      "01.2020",
    ];

    const body = res.body;

    expect(res.status).toEqual(200);
    expect(Object.keys(body)).toMatchObject(expectedListingDates);

    //Check that all dates have 5 listings
    expectedListingDates.forEach((listingDate: string) => {
      expect(body[listingDate]).toHaveLength(5);
    });
  });
});
