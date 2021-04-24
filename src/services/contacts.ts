import { Contact } from "../models/contacts";
import loadCSV from "../utils/load-csv";

export const getContacts = async (): Promise<Array<Contact>> => {
  const data = await loadCSV("contacts");

  return data.map(
    ({ listing_id, contact_date }) =>
      <Contact>{
        listingId: Number(listing_id),
        contactDate: new Date(parseInt(contact_date)), // use parse int to convert string to int
      }
  );
};
