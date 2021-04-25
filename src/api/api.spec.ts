import request from "supertest";
import api from "./api";
import loadCSV from "../utils/load-csv";

import testListingData from "../../test-data/test-listing-data";
import testContactData from "../../test-data/test-contacts-data";
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
});
