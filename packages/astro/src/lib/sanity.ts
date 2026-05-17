import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || '',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function sanityImageUrl(source: any) {
  return builder.image(source);
}

// --- Types ---

export interface ApplicationCard {
  title: string;
  image: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
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
  title: string;
  image: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
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

export interface CustomizationBlock {
  title: string;
  items: string[];
}

export interface CustomizationImage {
  image: {
    asset: {
      _ref: string;
    };
  };
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
        image,
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
        image,
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
          image,
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
          image,
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
        image,
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
            asset
          },
          alt
        },
        blocks[]{
          title,
          items
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
            asset
          },
          alt
        },
        blocks[]{
          title,
          items
        }
      }
    }
  )
`;

export async function getProductApplications(slug: string): Promise<ProductApplications | null> {
  return sanityClient.fetch(PRODUCT_APPLICATIONS_QUERY, {
    slug,
    documentId: `product-${slug}`,
  });
}

export async function getProductShowcase(slug: string): Promise<ProductShowcase | null> {
  return sanityClient.fetch(PRODUCT_SHOWCASE_QUERY, {
    slug,
    documentId: `product-${slug}`,
  });
}

export async function getAllProductShowcases(): Promise<ProductShowcase[]> {
  return sanityClient.fetch(ALL_PRODUCT_SHOWCASES_QUERY);
}

export async function getProductCustomization(slug: string): Promise<ProductCustomization | null> {
  return sanityClient.fetch(PRODUCT_CUSTOMIZATION_QUERY, {
    slug,
    documentId: `product-${slug}`,
  });
}
