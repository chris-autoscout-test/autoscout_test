import { Contact } from "../models/contacts";
import loadCSV from "../utils/load-csv";
import updateCSV from "../utils/update-csv";

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

const validateContact = (data: any): boolean => {
  if (!data.listing_id) {
    return false;
  }

  const date = new Date(parseInt(data?.contact_date));

  if (!data.contact_date && date instanceof Date && !isNaN(date.valueOf())) {
    return false;
  }

  return true;
};

export const updateContacts = (updatedData: any): Promise<boolean> => {
  return updateCSV("contacts", updatedData, validateContact);
};
