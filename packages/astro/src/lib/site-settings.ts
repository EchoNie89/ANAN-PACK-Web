import { fetchSanityQuery, type SanityImageSource } from "./sanity";

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
  footerQrCode?: SanityImageSource | null;
}

export interface SiteSettings {
  contactDetails: SiteContactDetails;
  socialMedia: SiteSocialMediaLink[];
  footerQrCode?: SanityImageSource | null;
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
  footerQrCode: null,
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
    },
    "footerQrCode": footerQrCode{
      _type,
      asset,
      "dimensions": asset->metadata.dimensions
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
    footerQrCode: source?.footerQrCode?.asset?._ref ? source.footerQrCode : null,
  };
}

function fetchSiteSettings(): Promise<SiteSettings> {
  if (!import.meta.env.SANITY_PROJECT_ID) {
    return Promise.resolve(DEFAULT_SITE_SETTINGS);
  }

  return fetchSanityQuery<SiteSettingsDocument | null>(
    SITE_SETTINGS_QUERY,
    {
      documentId: "siteSettings",
    },
  )
    .then((document) => normalizeSiteSettings(document))
    .catch(() => DEFAULT_SITE_SETTINGS);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (import.meta.env.DEV) {
    return fetchSiteSettings();
  }

  if (siteSettingsPromise) {
    return siteSettingsPromise;
  }

  siteSettingsPromise = fetchSiteSettings();
  return siteSettingsPromise;
}

export async function getSiteContactDetails(): Promise<SiteContactDetails> {
  return (await getSiteSettings()).contactDetails;
}
