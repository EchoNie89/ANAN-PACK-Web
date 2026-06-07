import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const sanityConfig = {
  projectId: import.meta.env.SANITY_PROJECT_ID || '',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
};

export const sanityClient = createClient({
  ...sanityConfig,
  useCdn: false,
});

export const sanityCdnClient = createClient({
  ...sanityConfig,
  useCdn: true,
});

const SANITY_FETCH_TIMEOUT_MS = 2500;

function withSanityTimeout<T>(operation: Promise<T>, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error(message)), SANITY_FETCH_TIMEOUT_MS);

    operation
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

export async function fetchSanityQuery<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  try {
    return await withSanityTimeout(
      sanityClient.fetch<T>(query, params),
      'Timed out fetching Sanity data from live API',
    );
  } catch {
    return sanityCdnClient.fetch<T>(query, params);
  }
}

const builder = createImageUrlBuilder(sanityClient);

export interface SanityImageDimensions {
  width: number;
  height: number;
  aspectRatio?: number;
}

export interface SanityImageSource {
  _type?: 'image';
  asset: {
    _ref?: string;
    _type?: 'reference';
  };
  dimensions?: SanityImageDimensions;
}

export function sanityImageUrl(source: SanityImageSource) {
  return builder.image(source);
}

// --- Types ---

export interface ApplicationCard {
  title: string;
  image: SanityImageSource;
  alt?: string;
  description?: string;
}

export interface ProductApplications {
  _id: string;
  slug: string;
  applicationTitle?: string;
  applicationDescription?: string;
  applications: ApplicationCard[];
}

export interface ShowcaseCard {
  title?: string;
  image: SanityImageSource;
  alt?: string;
  description?: string;
}

export interface ShowcaseGroup {
  title: string;
  description?: string;
  cards: ShowcaseCard[];
}

export interface ProductShowcase {
  _id: string;
  slug: string;
  title: string;
  showcaseGroups: ShowcaseGroup[];
}

export type CustomizationBlock =
  | {
      _type: 'paragraphBlock';
      text: string;
    }
  | {
      _type: 'listBlock';
      title?: string;
      intro?: string;
      markerStyle: 'bullet' | 'number' | 'plain';
      items?: string[];
      note?: string;
    };

export interface CustomizationImage {
  image: SanityImageSource;
  alt?: string;
}

export interface CustomizationGroup {
  title: string;
  intro?: string;
  images?: CustomizationImage[];
  blocks: CustomizationBlock[];
}

export interface ProductCustomization {
  _id: string;
  slug: string;
  customizationGroups: CustomizationGroup[];
}

// --- Queries ---

const PRODUCT_APPLICATIONS_QUERY = `
  coalesce(
    *[_type == "product" && _id == $documentId][0]{
      _id,
      slug,
      applicationTitle,
      applicationDescription,
      applications[]{
        title,
        "image": image{
          _type,
          asset,
          "dimensions": asset->metadata.dimensions
        },
        alt,
        description
      }
    },
    *[_type == "product" && slug == $slug] | order(_updatedAt desc)[0]{
      _id,
      slug,
      applicationTitle,
      applicationDescription,
      applications[]{
        title,
        "image": image{
          _type,
          asset,
          "dimensions": asset->metadata.dimensions
        },
        alt,
        description
      }
    }
  )
`;

const PRODUCT_SHOWCASE_QUERY = `
  coalesce(
    *[_type == "product" && _id == $documentId][0]{
      _id,
      slug,
      title,
      showcaseGroups[]{
        title,
        description,
        cards[]{
          title,
          "image": image{
            _type,
            asset,
            "dimensions": asset->metadata.dimensions
          },
          alt,
          description
        }
      }
    },
    *[_type == "product" && slug == $slug] | order(_updatedAt desc)[0]{
      _id,
      slug,
      title,
      showcaseGroups[]{
        title,
        description,
        cards[]{
          title,
          "image": image{
            _type,
            asset,
            "dimensions": asset->metadata.dimensions
          },
          alt,
          description
        }
      }
    }
  )
`;

const ALL_PRODUCT_SHOWCASES_QUERY = `
  *[_type == "product"]{
    _id,
    slug,
    title,
    showcaseGroups[]{
      title,
      description,
      cards[]{
        title,
        "image": image{
          _type,
          asset,
          "dimensions": asset->metadata.dimensions
        },
        alt,
        description
      }
    }
  }
`;

const PRODUCT_CUSTOMIZATION_QUERY = `
  coalesce(
    *[_type == "product" && _id == $documentId][0]{
      _id,
      slug,
      customizationGroups[]{
        title,
        intro,
        images[]{
          image{
            _type,
            asset,
            "dimensions": asset->metadata.dimensions
          },
          alt
        },
        blocks[]{
          _type,
          title,
          text,
          intro,
          markerStyle,
          items,
          note
        }
      }
    },
    *[_type == "product" && slug == $slug] | order(_updatedAt desc)[0]{
      _id,
      slug,
      customizationGroups[]{
        title,
        intro,
        images[]{
          image{
            _type,
            asset,
            "dimensions": asset->metadata.dimensions
          },
          alt
        },
        blocks[]{
          _type,
          title,
          text,
          intro,
          markerStyle,
          items,
          note
        }
      }
    }
  )
`;

export async function getProductApplications(slug: string): Promise<ProductApplications | null> {
  return fetchSanityQuery(PRODUCT_APPLICATIONS_QUERY, {
    slug,
    documentId: `product-${slug}`,
  });
}

export async function getProductShowcase(slug: string): Promise<ProductShowcase | null> {
  return fetchSanityQuery(PRODUCT_SHOWCASE_QUERY, {
    slug,
    documentId: `product-${slug}`,
  });
}

export async function getAllProductShowcases(): Promise<ProductShowcase[]> {
  return fetchSanityQuery(ALL_PRODUCT_SHOWCASES_QUERY);
}

export async function getProductCustomization(slug: string): Promise<ProductCustomization | null> {
  return fetchSanityQuery(PRODUCT_CUSTOMIZATION_QUERY, {
    slug,
    documentId: `product-${slug}`,
  });
}
