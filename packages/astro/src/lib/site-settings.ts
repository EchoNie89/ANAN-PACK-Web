import { sanityClient } from "./sanity";

export interface SiteContactDetails {
  email: string;
  whatsapp: string;
  phone: string;
  address: string;
  businessHours: string;
  location: string;
}

interface SiteSettingsDocument {
  contactDetails?: Partial<SiteContactDetails> | null;
}

const DEFAULT_SITE_CONTACT_DETAILS: SiteContactDetails = {
  email: "echo@anancn.com",
  whatsapp: "+86 15072350032",
  phone: "+86 20 8673 0000",
  address: "Room 503, Nanguang Industrial Park, Guangzhou",
  businessHours: "Monday-Friday 9:00 AM - 6:00 PM (CST)",
  location: "Guangzhou, China",
};

const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings" && _id == $documentId][0]{
    contactDetails{
      email,
      whatsapp,
      phone,
      address,
      businessHours,
      location
    }
  }
`;

let siteContactDetailsPromise: Promise<SiteContactDetails> | null = null;

function normalizeSiteContactDetails(
  source?: Partial<SiteContactDetails> | null,
): SiteContactDetails {
  return {
    email: source?.email || DEFAULT_SITE_CONTACT_DETAILS.email,
    whatsapp: source?.whatsapp || DEFAULT_SITE_CONTACT_DETAILS.whatsapp,
    phone: source?.phone || DEFAULT_SITE_CONTACT_DETAILS.phone,
    address: source?.address || DEFAULT_SITE_CONTACT_DETAILS.address,
    businessHours:
      source?.businessHours || DEFAULT_SITE_CONTACT_DETAILS.businessHours,
    location: source?.location || DEFAULT_SITE_CONTACT_DETAILS.location,
  };
}

export async function getSiteContactDetails(): Promise<SiteContactDetails> {
  if (siteContactDetailsPromise) {
    return siteContactDetailsPromise;
  }

  if (!import.meta.env.SANITY_PROJECT_ID) {
    return DEFAULT_SITE_CONTACT_DETAILS;
  }

  siteContactDetailsPromise = sanityClient
    .fetch<SiteSettingsDocument | null>(SITE_SETTINGS_QUERY, {
      documentId: "siteSettings",
    })
    .then((document) => normalizeSiteContactDetails(document?.contactDetails))
    .catch(() => DEFAULT_SITE_CONTACT_DETAILS);

  return siteContactDetailsPromise;
}
