import { sanityClient } from "./sanity";

export interface SiteContactDetails {
  email: string;
  whatsapp: string;
  phone: string;
  address: string;
  businessHours: string;
  location: string;
}

export type SiteSocialMediaPlatform =
  | "linkedin"
  | "youtube"
  | "instagram";

export interface SiteSocialMediaLink {
  platform: SiteSocialMediaPlatform;
  url: string;
}

interface SiteSettingsDocument {
  contactDetails?: Partial<SiteContactDetails> | null;
  socialMedia?: Array<Partial<SiteSocialMediaLink> | null> | null;
}

export interface SiteSettings {
  contactDetails: SiteContactDetails;
  socialMedia: SiteSocialMediaLink[];
}

const DEFAULT_SITE_CONTACT_DETAILS: SiteContactDetails = {
  email: "echo@anancn.com",
  whatsapp: "+86 15072350032",
  phone: "+86 20 8673 0000",
  address: "Room 503, Nanguang Industrial Park, Guangzhou",
  businessHours: "Monday-Friday 9:00 AM - 6:00 PM (CST)",
  location: "Guangzhou, China",
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  contactDetails: DEFAULT_SITE_CONTACT_DETAILS,
  socialMedia: [],
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
    },
    socialMedia[]{
      platform,
      url
    }
  }
`;

let siteSettingsPromise: Promise<SiteSettings> | null = null;

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

function normalizeSiteSocialMedia(
  source?: Array<Partial<SiteSocialMediaLink> | null> | null,
): SiteSocialMediaLink[] {
  const validPlatforms = new Set<SiteSocialMediaPlatform>([
    "linkedin",
    "youtube",
    "instagram",
  ]);

  return (source ?? []).flatMap((item) => {
    const platform = item?.platform;
    const url = item?.url?.trim();

    if (!platform || !validPlatforms.has(platform) || !url) {
      return [];
    }

    return [{ platform, url }];
  });
}

function normalizeSiteSettings(source?: SiteSettingsDocument | null): SiteSettings {
  return {
    contactDetails: normalizeSiteContactDetails(source?.contactDetails),
    socialMedia: normalizeSiteSocialMedia(source?.socialMedia),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (siteSettingsPromise) {
    return siteSettingsPromise;
  }

  if (!import.meta.env.SANITY_PROJECT_ID) {
    return DEFAULT_SITE_SETTINGS;
  }

  siteSettingsPromise = sanityClient
    .fetch<SiteSettingsDocument | null>(SITE_SETTINGS_QUERY, {
      documentId: "siteSettings",
    })
    .then((document) => normalizeSiteSettings(document))
    .catch(() => DEFAULT_SITE_SETTINGS);

  return siteSettingsPromise;
}

export async function getSiteContactDetails(): Promise<SiteContactDetails> {
  return (await getSiteSettings()).contactDetails;
}
