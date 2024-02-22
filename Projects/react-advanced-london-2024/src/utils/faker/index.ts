import { FakerStructure } from "@/types";

export const fakerStructure = {
  id: "uuid",
  firstName: "firstName",
  lastName: "lastName",
  dateOfBirth: "date",
  // Auxiliary data
  // profilePicture: "image",
  // phone: "phone",
  // email: "email",
  // address: "streetAddress",
  // city: "city",
  // country: "country",
  // latitude: "latitude",
  // longitude: "longitude",
  // company: "word",
  // jobTitle: "word",
  // bio: "longText",
};

export const objectToQueryString = (obj: Record<string, string>) =>
  Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
