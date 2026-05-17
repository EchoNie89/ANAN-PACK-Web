import {
  labelApplicationItems,
  labelCaseStudy,
  labelCustomizationBlocks,
  labelCustomizationImages,
  labelFaqs,
  labelFoldingBlocks,
  labelFoldingIntro,
  labelFoldingOptionImages,
  labelIntroText,
  labelProcessSteps,
  labelShowcaseGroups,
  labelSizeShapeBlocks,
  labelSizeShapeIntro,
  labelWhyItems,
  type LabelImageItem,
} from './labelsProduct';

export interface ProductImage {
  src: string;
  alt: string;
  sanityKey: string;
}

export interface ProductCard {
  title: string;
  description?: string;
  image: ProductImage;
}

export interface ProductFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export type ProductProcessIcon =
  | 'concept'
  | 'designing'
  | 'manufacturing'
  | 'testing'
  | 'packaging'
  | 'guaranteing';

export interface ProductProcessStep {
  title: string;
  description: string;
  icon?: ProductProcessIcon;
}

export interface ProductShowcaseGroup {
  title: string;
  description?: string;
  cards: ProductCard[];
}

export interface ProductTextBlock {
  title: string;
  items: string[];
}

export interface ProductCustomizationGroup {
  title: string;
  intro?: string;
  images?: ProductImage[];
  blocks: ProductTextBlock[];
}

export interface ProductCtaData {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  note?: string;
}

export interface ProductPageData {
  slug: string;
  navLabel: string;
  title: string;
  metaDescription: string;
  subtitle: string;
  heroTone?: 'dark' | 'warm';
  heroAlign?: 'center' | 'left';
  heroOverlay?: 'default' | 'labels' | 'none';
  heroButtonPlacement?: 'default' | 'high';
  heroTitleLines?: string[];
  heroImage: ProductImage;
  introTitle?: string;
  overview: string;
  highlights: string[];
  stats: Array<{ value: string; label: string }>;
  featureBand?: ProductFeature[];
  showcaseGroups?: ProductShowcaseGroup[];
  applicationTitle?: string;
  applicationDescription?: string;
  applicationLayout?: 'grid' | 'balanced';
  categories: ProductCard[];
  materials: ProductCard[];
  applications: ProductCard[];
  customizationGroups?: ProductCustomizationGroup[];
  process: ProductProcessStep[];
  processSubtitle?: string;
  whyChooseTitle?: string;
  whyChoose?: ProductCard[];
  caseStudy: {
    title: string;
    description: string;
    image: ProductImage;
    bullets: string[];
    quote?: string;
    quoteAuthor?: string;
    challenge?: string;
    solutionIntro?: string;
    solutionPoints?: string[];
    resultPoints?: string[];
    gallery?: ProductImage[];
  };
  blogs: ProductCard[];
  faqs: ProductFaq[];
  cta?: ProductCtaData;
}

const image = (src: string, alt: string, sanityKey: string): ProductImage => ({
  src,
  alt,
  sanityKey,
});

const labelItemToCard = (
  item: LabelImageItem,
  sanityKey: string,
): ProductCard => ({
  title: item.title,
  description: item.description,
  image: image(item.image, item.alt, sanityKey),
});

const labelItemsToCards = (items: LabelImageItem[], sanityKeyPrefix: string) =>
  items.map((item, index) =>
    labelItemToCard(item, `${sanityKeyPrefix}.${index}`),
  );

const labelItemsToImages = (
  items: LabelImageItem[],
  sanityKeyPrefix: string,
): ProductImage[] =>
  items.map((item, index) =>
    image(item.image, item.alt, `${sanityKeyPrefix}.${index}`),
  );

const productShell = {
  stats: [
    { value: '100+', label: 'Low MOQ options' },
    { value: '72h', label: 'Fast sample plan' },
    { value: '6h', label: 'Quote response' },
  ],
  featureBand: [
    {
      icon: '/images/products/icons/low-moq.svg',
      title: 'Low MOQ',
      description: 'Startup Friendly',
    },
    {
      icon: '/images/products/icons/fast-sampling.svg',
      title: 'Fast Sampling',
      description: '5-7 Days Ready',
    },
    {
      icon: '/images/products/icons/audited-factories.svg',
      title: 'Audited Factories',
      description: 'Stable Quality',
    },
  ],
  highlights: [
    'Multi-category packaging sourcing',
    'Factory audit and quality control',
    'Dedicated project management',
    'Combined shipping for mixed orders',
  ],
  process: [
    {
      title: 'Send artwork or reference',
      description:
        'Share your logo, size, material preference, quantity, and target delivery date.',
      icon: 'concept',
    },
    {
      title: 'Confirm quote and mockup',
      description:
        'We align material, print method, trims, packaging details, and sampling cost before production.',
      icon: 'designing',
    },
    {
      title: 'Sample and color check',
      description:
        'Our team checks logo placement, material handfeel, color tolerance, and finishing details.',
      icon: 'manufacturing',
    },
    {
      title: 'Bulk production and QC',
      description:
        'We follow up production milestones and inspect the order before consolidated shipping.',
      icon: 'testing',
    },
    {
      title: 'Packing and consolidation',
      description:
        'Your packaging items are sorted, packed, and coordinated with related trims when needed.',
      icon: 'packaging',
    },
    {
      title: 'Shipping follow-up',
      description:
        'We confirm shipping details, tracking, and delivery status so launch timelines stay visible.',
      icon: 'guaranteing',
    },
  ],
  whyChoose: [
    {
      title: 'Low MOQ For Startup Brands',
      description:
        'Start with a small test order, confirm the finish and handfeel, then scale into bulk production when your collection is ready.',
      image: image(
        '/images/services/product-development.png',
        'Team reviewing packaging and trim samples',
        'products.common.whyChoose.lowMoq',
      ),
    },
    {
      title: 'One-stop Customization',
      description:
        'Match labels, hang tags, stickers, bags, tape, ribbons, and packaging trims in one managed workflow.',
      image: image(
        '/images/services/quality.png',
        'Packaging customization desk with samples',
        'products.common.whyChoose.customization',
      ),
    },
    {
      title: 'Strict Quality Control',
      description:
        'We check artwork, material, color tolerance, finishing, packing, and final shipment details before dispatch.',
      image: image(
        '/images/services/warehouse-assembly.png',
        'Quality control and packing workflow',
        'products.common.whyChoose.quality',
      ),
    },
  ],
} as const;

export const defaultProductWhyChoose: ProductCard[] = [
  ...productShell.whyChoose,
];

const commonBlogs = [
  {
    title: 'How to prepare artwork for faster sampling',
    description:
      'A short checklist for logo files, colors, sizes, and finish references before production starts.',
    image: image(
      '/images/blog/article-brand-identity.jpg',
      'Brand artwork and packaging identity references',
      'blog.artworkGuide',
    ),
  },
  {
    title: 'Eco packaging materials brands should compare',
    description:
      'Understand FSC paper, recycled fabric, biodegradable films, and plastic-free alternatives.',
    image: image(
      '/images/blog/article-sustainable-fashion-packaging.jpg',
      'Sustainable fashion packaging samples',
      'blog.ecoMaterials',
    ),
  },
  {
    title: 'How consolidated shipping reduces packaging cost',
    description:
      'Combine tags, labels, bags, tape, and other trims into one managed shipment.',
    image: image(
      '/images/blog/article-custom-packaging-ecommerce.jpg',
      'Ecommerce packaging prepared for shipping',
      'blog.consolidatedShipping',
    ),
  },
] satisfies ProductCard[];

const buildFaqs = (product: string, materialQuestion: string): ProductFaq[] => [
  {
    question: `Q1: What is the MOQ for custom ${product}?`,
    answer:
      'Most projects can start from low MOQ trial orders. Final MOQ depends on material, size, print method, and finishing.',
  },
  {
    question: 'Q2: Can you help if I only have a logo?',
    answer:
      'Yes. We can prepare layout suggestions, material recommendations, and production-ready files before sampling.',
  },
  {
    question: 'Q3: How long does sampling take?',
    answer:
      'Standard samples are usually arranged within 3-7 working days after artwork and material details are confirmed.',
  },
  {
    question: materialQuestion,
    answer:
      'We will recommend options based on your product, brand positioning, target price, and sustainability requirements.',
  },
  {
    question: 'Q5: Can you ship different packaging items together?',
    answer:
      'Yes. We can consolidate mixed packaging orders such as tags, labels, bags, stickers, and tape before shipment.',
  },
  {
    question: 'Q6: What file format should I send?',
    answer:
      'Vector files such as AI, PDF, EPS, or SVG are preferred. If you only have PNG or JPG files, we can review them and advise whether redrawing is needed.',
  },
  {
    question: `Q7: Can I order ${product} samples before mass production?`,
    answer:
      'Yes. Sampling is recommended when color, texture, special finishing, or exact handfeel matters to your product launch.',
  },
  {
    question: `Q8: How long does it take to produce custom ${product}?`,
    answer:
      'Lead time depends on material, finishing, and quantity. After sample approval, many standard orders can move into production within a clear scheduled window.',
  },
  {
    question: `Q9: Do you ship custom ${product} internationally?`,
    answer:
      'Yes. We support international shipping and can combine product packaging, trims, and related accessories into one managed shipment.',
  },
];

const labelsShowcaseGroups: ProductShowcaseGroup[] = labelShowcaseGroups.map(
  (group, groupIndex) => ({
    title: group.title,
    cards: labelItemsToCards(
      group.cards,
      `products.labels.showcase.${groupIndex}`,
    ),
  }),
);

const labelsCustomizationGroups: ProductCustomizationGroup[] = [
  {
    title: 'Materials',
    intro:
      'As a leading dust bag manufacturer, SENYE understands that the right fabric is crucial for both product protection and brand perception. Our sourcing experts offer a diverse range of premium textiles to perfectly match your product’s weight, shape, and luxury level.',
    images: labelItemsToImages(
      labelCustomizationImages,
      'products.labels.customization.materialImages',
    ),
    blocks: labelCustomizationBlocks,
  },
  {
    title: 'Folding Options',
    intro: labelFoldingIntro,
    images: labelItemsToImages(
      labelFoldingOptionImages,
      'products.labels.customization.foldingImages',
    ),
    blocks: labelFoldingBlocks,
  },
  {
    title: 'Size & Shape Options',
    intro: labelSizeShapeIntro,
    blocks: labelSizeShapeBlocks,
  },
];

const labelsCaseStudy = {
  title: labelCaseStudy.title,
  description: labelCaseStudy.description,
  image: image(
    labelCaseStudy.image,
    labelCaseStudy.alt,
    'products.labels.caseStudy.hero',
  ),
  bullets: labelCaseStudy.resultPoints,
  quote: labelCaseStudy.quote,
  quoteAuthor: labelCaseStudy.quoteAuthor,
  challenge: labelCaseStudy.challenge,
  solutionIntro: labelCaseStudy.solutionIntro,
  solutionPoints: labelCaseStudy.solutionPoints,
  resultPoints: labelCaseStudy.resultPoints,
  gallery: labelCaseStudy.gallery.map((item, index) =>
    image(item.image, item.alt, `products.labels.caseStudy.gallery.${index}`),
  ),
};

export const productPages: ProductPageData[] = [
  {
    slug: 'hanging-tag',
    navLabel: 'Hanging Tag',
    title: 'Custom Hang Tags for Clothing Brands',
    metaDescription:
      'Custom clothing hang tags with low MOQ, fast sampling, strict QC, and one-stop packaging production.',
    subtitle:
      'Premium custom tags with your logo. Low MOQ, Fast Sampling & trict QC. We are your one-stop packaging manufacturer.',
    heroImage: image(
      '/images/products/optimized/hero-hanging-tag.jpg',
      'Custom hang tag hero banner from Figma',
      'products.hangingTag.hero',
    ),
    overview:
      'Turn a simple garment label into a tactile brand moment. We produce hang tags in paper, kraft, cotton, recycled, and specialty finishes, then coordinate stringing, packing, and delivery with your other trims.',
    highlights: [...productShell.highlights],
    stats: [...productShell.stats],
    categories: [
      {
        title: 'Classic paper tags',
        description:
          'Reliable coated, uncoated, kraft, and recycled paper options for apparel launches.',
        image: image(
          '/images/blog/article-hangtag-paper.jpg',
          'Paper hang tag samples',
          'products.hangingTag.categories.paper',
        ),
      },
      {
        title: 'Luxury finishing',
        description:
          'Foil stamping, embossing, debossing, spot UV, die cut, and layered cards.',
        image: image(
          '/images/solutions/fashion-gallery-2.png',
          'Luxury fashion tag detail',
          'products.hangingTag.categories.finishing',
        ),
      },
      {
        title: 'Strings and attachments',
        description:
          'Cotton string, wax cord, safety pins, seals, and pre-stringing for retail readiness.',
        image: image(
          '/images/solutions/fashion-kit-1.png',
          'Hang tag with apparel trim kit',
          'products.hangingTag.categories.attachments',
        ),
      },
    ],
    materials: [
      {
        title: 'FSC paper',
        description:
          'A clean default for modern apparel brands balancing cost, quality, and sustainability.',
        image: image(
          '/images/blog/article-fsc-paper.jpg',
          'FSC paper material texture',
          'products.hangingTag.materials.fsc',
        ),
      },
      {
        title: 'Kraft paper',
        description:
          'Natural brown tone for organic, outdoor, denim, and handmade collections.',
        image: image(
          '/images/blog/article-kraft-paper.jpg',
          'Kraft paper packaging material',
          'products.hangingTag.materials.kraft',
        ),
      },
      {
        title: 'Cotton and specialty boards',
        description:
          'Soft-touch, textured, and heavier boards for premium product lines.',
        image: image(
          '/images/blog/article-luxury-paper.jpg',
          'Luxury paper packaging close up',
          'products.hangingTag.materials.luxury',
        ),
      },
    ],
    applications: [
      {
        title: 'Fashion apparel',
        description:
          'Main tags, price tags, care story cards, and seasonal campaign cards.',
        image: image(
          '/images/solutions/fashion-hero.png',
          'Fashion apparel packaging',
          'products.hangingTag.applications.fashion',
        ),
      },
      {
        title: 'Jewelry and accessories',
        description:
          'Small-format logo cards and premium attachment solutions for delicate items.',
        image: image(
          '/images/solutions/jewelry-luxury-kit-1.png',
          'Jewelry packaging with tag',
          'products.hangingTag.applications.jewelry',
        ),
      },
      {
        title: 'Gift and lifestyle',
        description:
          'Message tags, hang cards, product info tags, and limited-edition packaging.',
        image: image(
          '/images/solutions/home-lifestyle-gallery-1.png',
          'Lifestyle product packaging with cards',
          'products.hangingTag.applications.gift',
        ),
      },
    ],
    customizationGroups: [
      {
        title: 'Materials',
        intro:
          'Match material, color, size, print technique, finish, and packing method across your product line.',
        images: [
          image(
            '/images/blog/article-fsc-paper.jpg',
            'FSC paper material texture',
            'products.hangingTag.customization.fsc',
          ),
          image(
            '/images/blog/article-kraft-paper.jpg',
            'Kraft paper packaging material',
            'products.hangingTag.customization.kraft',
          ),
          image(
            '/images/blog/article-luxury-paper.jpg',
            'Luxury paper packaging close up',
            'products.hangingTag.customization.luxury',
          ),
        ],
        blocks: [
          {
            title: 'Available Custom Options',
            items: [...productShell.highlights],
          },
        ],
      },
    ],
    process: [...productShell.process],
    whyChooseTitle: 'Why Choose Us For Custom Hang Tags?',
    whyChoose: [
      {
        title: 'Low MOQ For Startup Brands',
        description:
          'Start with a small test order, confirm the finish and handfeel, then scale into bulk production when your collection is ready.',
        image: image(
          '/images/services/product-development.png',
          'Team reviewing packaging and trim samples',
          'products.hangingTag.whyChoose.lowMoq',
        ),
      },
      {
        title: 'One-stop Customization',
        description:
          'Match labels, hang tags, stickers, bags, tape, ribbons, and packaging trims in one managed workflow.',
        image: image(
          '/images/services/quality.png',
          'Packaging customization desk with samples',
          'products.hangingTag.whyChoose.customization',
        ),
      },
      {
        title: 'Strict Quality Control',
        description:
          'We check artwork, material, color tolerance, finishing, packing, and final shipment details before dispatch.',
        image: image(
          '/images/services/warehouse-assembly.png',
          'Quality control and packing workflow',
          'products.hangingTag.whyChoose.quality',
        ),
      },
    ],
    caseStudy: {
      title: 'Fashion launch with matched tags, labels, and bags',
      description:
        'A startup apparel brand needed a small first run with consistent color across hang tags, woven labels, and cotton bags. We aligned Pantone references, sampled key materials, and shipped the full kit together.',
      image: image(
        '/images/solutions/fashion-case.png',
        'Fashion packaging case study set',
        'products.hangingTag.caseStudy',
      ),
      bullets: [
        'One artwork review for all trims',
        'Color checked across paper and fabric',
        'Consolidated shipping for launch inventory',
      ],
    },
    blogs: commonBlogs,
    faqs: buildFaqs(
      'hang tags',
      'Q4: Do you offer tags made of materials other than paper?',
    ),
  },
  {
    slug: 'bag',
    navLabel: 'Bag',
    title: 'Branded Dust Bags For Fashion & Accessories',
    metaDescription:
      'Custom drawstring and dust bags for fashion, jewelry, cosmetics, and accessories with low MOQ and QC.',
    subtitle:
      'Protect your products in style with our custom drawstring bags. From custom cotton dust bags to luxury velvet, enjoy flexible low MOQ and seamless combined shipping for your boutique.',
    heroImage: image(
      '/images/products/optimized/hero-bag.jpg',
      'Custom dust bag hero banner from Figma',
      'products.bag.hero',
    ),
    introTitle: 'What Are Custom Dust Bags?',
    overview:
      'Custom dust bags are protective fabric pouches designed to shield fashion and lifestyle products from dust, scratches, moisture, and friction while giving the packaging a more premium branded finish. They are commonly used for handbags, shoes, jewelry, cosmetics, eyewear, apparel, and accessories. With custom fabric, size, drawstring, logo printing, embroidery, and hardware options, dust bags become both practical product protection and a reusable brand touchpoint.',
    highlights: [...productShell.highlights],
    stats: [...productShell.stats],
    showcaseGroups: [
      {
        title: '1. Cotton & Canvas Bags',
        cards: [
          {
            title: 'Cotton Drawstring Bags',
            image: image(
              '/images/home/menu-bag.png',
              'Cotton drawstring dust bag with printed logo',
              'products.bag.showcase.cotton.0',
            ),
          },
          {
            title: 'Canvas Shoe Dust Bags',
            image: image(
              '/images/products/optimized/hero-bag.jpg',
              'Canvas dust bags arranged for fashion packaging',
              'products.bag.showcase.cotton.1',
            ),
          },
          {
            title: 'Muslin Storage Pouches',
            image: image(
              '/images/solutions/home-lifestyle-kit-1.png',
              'Natural cotton muslin storage pouch',
              'products.bag.showcase.cotton.2',
            ),
          },
          {
            title: 'Reusable Cotton Pouches',
            image: image(
              '/images/solutions/fashion-kit-1.png',
              'Reusable cotton pouch with fashion trim set',
              'products.bag.showcase.cotton.3',
            ),
          },
        ],
      },
      {
        title: '2. Logo Printed Dust Bags',
        cards: [
          {
            title: 'Silkscreen Logo Bags',
            image: image(
              '/images/products/bag/printing1.png',
              'Silkscreen logo printing on fabric dust bag',
              'products.bag.showcase.printed.0',
            ),
          },
          {
            title: 'Bold Brand Graphics',
            image: image(
              '/images/products/bag/printing2.png',
              'Bold custom logo printed on dust bag fabric',
              'products.bag.showcase.printed.1',
            ),
          },
          {
            title: 'Embroidery Logo Pouches',
            image: image(
              '/images/products/bag/printing3.png',
              'Embroidered logo detail on custom pouch',
              'products.bag.showcase.printed.2',
            ),
          },
          {
            title: 'Premium Drawstring Details',
            image: image(
              '/images/products/bag/printing4.png',
              'Premium drawstring and logo detail for dust bags',
              'products.bag.showcase.printed.3',
            ),
          },
        ],
      },
      {
        title: '3. Velvet & Suede Pouches',
        cards: [
          {
            title: 'Velvet Jewelry Pouches',
            image: image(
              '/images/solutions/jewelry-luxury-kit-2.png',
              'Velvet jewelry pouch packaging',
              'products.bag.showcase.velvet.0',
            ),
          },
          {
            title: 'Suede Accessory Bags',
            image: image(
              '/images/solutions/jewelry-luxury-gallery-2.png',
              'Suede accessory pouch with luxury handfeel',
              'products.bag.showcase.velvet.1',
            ),
          },
          {
            title: 'Luxury Gift Pouches',
            image: image(
              '/images/solutions/jewelry-luxury-kit-3.png',
              'Luxury gift pouch for accessories',
              'products.bag.showcase.velvet.2',
            ),
          },
          {
            title: 'Soft Hardware Protection',
            image: image(
              '/images/solutions/fashion-gallery-3.png',
              'Soft pouch protecting fashion accessories',
              'products.bag.showcase.velvet.3',
            ),
          },
        ],
      },
      {
        title: '4. Satin & Specialty Bags',
        cards: [
          {
            title: 'Satin Dust Bags',
            image: image(
              '/images/solutions/cosmetics-kit-2.png',
              'Satin pouch for cosmetics and delicate products',
              'products.bag.showcase.satin.0',
            ),
          },
          {
            title: 'Non-Woven Dust Bags',
            image: image(
              '/images/products/bag/Frame4.png',
              'Non-woven dust bag material reference',
              'products.bag.showcase.satin.1',
            ),
          },
          {
            title: 'Recycled Fabric Pouches',
            image: image(
              '/images/blog/article-sustainable-fashion-packaging.jpg',
              'Recycled fabric pouch for sustainable packaging',
              'products.bag.showcase.satin.2',
            ),
          },
          {
            title: 'Custom Gift Bags',
            image: image(
              '/images/products/bag/Frame6.png',
              'Custom specialty fabric bag for gifting',
              'products.bag.showcase.satin.3',
            ),
          },
        ],
      },
    ],
    categories: [
      {
        title: 'Cotton dust bags',
        description:
          'A versatile choice for apparel, shoes, jewelry, and everyday premium packaging.',
        image: image(
          '/images/home/menu-bag.png',
          'Cotton drawstring bag',
          'products.bag.categories.cotton',
        ),
      },
      {
        title: 'Velvet and suede pouches',
        description:
          'Soft handfeel for jewelry, accessories, cosmetics, and gifting.',
        image: image(
          '/images/solutions/jewelry-luxury-kit-2.png',
          'Velvet jewelry pouch packaging',
          'products.bag.categories.velvet',
        ),
      },
      {
        title: 'Satin and specialty fabric',
        description:
          'Smooth, elegant bags for delicate products and higher-end product lines.',
        image: image(
          '/images/solutions/cosmetics-kit-2.png',
          'Satin cosmetic pouch packaging',
          'products.bag.categories.satin',
        ),
      },
    ],
    materials: [
      {
        title: 'Cotton and canvas',
        description:
          'Durable, natural, and easy to print for boutique packaging.',
        image: image(
          '/images/solutions/home-lifestyle-kit-1.png',
          'Cotton fabric pouch texture',
          'products.bag.materials.cotton',
        ),
      },
      {
        title: 'Velvet',
        description:
          'Deep color, soft texture, and strong perceived value for premium items.',
        image: image(
          '/images/solutions/jewelry-luxury-gallery-2.png',
          'Velvet packaging detail',
          'products.bag.materials.velvet',
        ),
      },
      {
        title: 'Recycled fabric',
        description:
          'Available for brands that need a more responsible packaging route.',
        image: image(
          '/images/blog/article-sustainable-fashion-packaging.jpg',
          'Sustainable fabric packaging',
          'products.bag.materials.recycled',
        ),
      },
    ],
    applications: [
      {
        title: 'Apparel & Fashion',
        description:
          'Custom dust bags for garments, shoes, denim, leather goods, and seasonal fashion collections.',
        image: image(
          '/images/solutions/fashion-hero.png',
          'Fashion apparel packaging with custom dust bags',
          'products.bag.applications.fashion',
        ),
      },
      {
        title: 'Shoes & Handbags',
        description:
          'Breathable cotton, canvas, flannel, and microfiber bags that help protect premium shoes and handbags.',
        image: image(
          '/images/solutions/fashion-gallery-3.png',
          'Shoe and handbag dust bag packaging',
          'products.bag.applications.shoesHandbags',
        ),
      },
      {
        title: 'Jewelry & Accessories',
        description:
          'Soft velvet, suede, and satin pouches for jewelry, eyewear, watches, belts, and small accessories.',
        image: image(
          '/images/solutions/jewelry-luxury-hero.png',
          'Jewelry and accessory pouch packaging',
          'products.bag.applications.jewelry',
        ),
      },
      {
        title: 'Gifts & Cosmetics',
        description:
          'Logo pouches for gift sets, beauty kits, influencer boxes, and retail-ready promotional bundles.',
        image: image(
          '/images/solutions/cosmetics-gallery-1.png',
          'Gift and cosmetics pouch packaging',
          'products.bag.applications.giftsCosmetics',
        ),
      },
    ],
    customizationGroups: [
      {
        title: 'Materials',
        intro:
          'As a leading dust bag manufacturer, SENYE understands that the right fabric is crucial for both product protection and brand perception. Our sourcing experts offer a diverse range of premium textiles to perfectly match your product’s weight, shape, and luxury level.',
        images: [
          image(
            '/images/products/bag/Frame1.png',
            'Satin ribbon packaging detail',
            'products.ribbon.customization.polyester',
          ),
          image(
            '/images/products/bag/Frame2.png',
            'Natural packaging material with ribbon',
            'products.ribbon.customization.cotton',
          ),
          image(
            '/images/products/bag/Frame3.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
          image(
            '/images/products/bag/Frame4.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
          image(
            '/images/products/bag/Frame5.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
          image(
            '/images/products/bag/Frame6.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
        ],
        blocks: [
          {
            title:
              '1. Cotton & Canvas (The Breathable Standards) Sourced for maximum durability and environmental responsibility.',
            items: [
              'Cotton: Lightweight and highly breathable, our custom cotton dust bags are perfect for protecting everyday garments and preventing moisture buildup.',
              'Heavy Canvas: Engineered for structure and strength. Canvas drawstring bags are the ultimate choice for heavy luxury footwear and large leather handbags.',
            ],
          },
          {
            title:
              '2. Velvet & Suede (The Luxury Shields) Designed for high-end, scratch-free protection. ',
            items: [
              'Our custom velvet pouches feature a dense, plush pile that provides a cushioned barrier, making them the industry standard for jewelry packaging pouches and luxury hardware.',
            ],
          },
          {
            title:
              '3. Glossy Satin (The Frictionless Finish) Offering a silky, high-end sheen, satin dust bags are specifically woven to minimize fabric friction. ',
            items: [
              'This ensures delicate items like fine lingerie, cosmetics, and hair extensions remain pristine and untangled.',
            ],
          },
          {
            title:
              '4. Non-Woven (The High-Volume Solution) Lightweight, water-resistant, and incredibly cost-effective. ',
            items: [
              'These fabrics are ideal for brands looking for reliable custom dust bags wholesale without compromising on essential dust protection.',
            ],
          },
        ],
      },
      {
        title: 'Printing',
        intro:
          'A great fabric requires flawless execution. Our strict QC team oversees every step of the customization process, ensuring your branded dust bags feature crisp logos, durable stitching, and premium drawstrings that elevate the unboxing ritual.',
        images: [
          image(
            '/images/products/bag/printing1.png',
            'Satin ribbon packaging detail',
            'products.ribbon.customization.polyester',
          ),
          image(
            '/images/products/bag/printing2.png',
            'Natural packaging material with ribbon',
            'products.ribbon.customization.cotton',
          ),
          image(
            '/images/products/bag/printing3.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
          image(
            '/images/products/bag/printing4.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
          image(
            '/images/products/bag/printing5.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
          image(
            '/images/products/bag/printing6.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
        ],
        blocks: [
          {
            title: '1. Precision Silkscreen Printing',
            items: [
              'Features: The most popular and versatile method for transferring your design onto fabric. We use eco-friendly, fade-resistant inks to ensure your custom dust bags with logo look sharp and vibrant, even on highly textured canvas.',
              'Best For: Bold logos, text-heavy designs, and high-contrast branding.',
            ],
          },
          {
            title: '2. Premium Embroidery',
            items: [
              'Features: Add a tactile, 3D dimension to your brand. Our high-density embroidery machines stitch your logo directly into the fabric, offering an unmatched level of sophistication and permanence.',
              'Best For: Luxury custom fabric pouches, high-end velvet bags, and boutique labels aiming for a heritage aesthetic.',
            ],
          },
          {
            title: '3. Drawstrings & Hardware Customization',
            items: [
              'Features: The closure is the first thing your customer touches. Choose from natural cotton ropes, elegant satin ribbons, or durable nylon cords. We can also add custom metal stoppers, tassels, or branded tags to the drawstrings.',
              'Best For: Elevating standard shoe dust bags with logo into bespoke, premium gifts.',
            ],
          },
          {
            title: '4. Low-MOQ & Flexible Production',
            items: [
              "Features: You don't need to order tens of thousands to get factory-direct quality. Our flexible production lines allow us to offer low MOQ custom pouches, making premium packaging accessible to independent designers and growing brands.",
              'Best For: Startups and creators looking for the best custom packaging bags for small business.',
            ],
          },
        ],
      },
    ],
    process: [
      {
        title: 'Concept',
        description:
          'Collaborate with our sourcing experts to define your product protection needs, fabric direction, logo method, and premium finishing options.',
        icon: 'concept',
      },
      {
        title: 'Designing',
        description:
          'We provide technical design audits and rapid prototyping to ensure your artwork translates cleanly onto custom dust bags and fabric pouches.',
        icon: 'designing',
      },
      {
        title: 'Manufacturing',
        description:
          'High-precision production is managed through our audited factory pool, offering flexible low MOQs and stable lead times for your collections.',
        icon: 'manufacturing',
      },
      {
        title: 'Testing',
        description:
          'Our strict QC team acts as your on-site representative, verifying color accuracy, material durability, stitching, drawstrings, and craftsmanship.',
        icon: 'testing',
      },
      {
        title: 'Packaging',
        description:
          'Secure, professional packing with combined shipment options to consolidate dust bags, tags, labels, tape, and other brand materials.',
        icon: 'packaging',
      },
      {
        title: 'Guaranteeing',
        description:
          'We offer a comprehensive quality guarantee and dedicated after-sales support, standing by our commitment as your trusted supply chain partner.',
        icon: 'guaranteing',
      },
    ],
    processSubtitle: 'Offered through every stage of your project',
    whyChooseTitle: 'Why choose us as your Trusted Dust Bag Supplier ?',
    whyChoose: [
      {
        title: 'Professional Sourcing Team',
        description:
          "With over 10 years of deep-rooted expertise, we act as your dedicated local sourcing partner to navigate the complexities of Chinese textile manufacturing. We go beyond simple procurement; we expertly curate fabrics-from breathable custom cotton dust bags to luxurious velvet-ensuring your packaging perfectly embodies your brand's DNA. We are the bridge that transforms your creative vision into a high-quality, market-ready reality.",
        image: image(
          '/images/products/labels/image 15.png',
          'Professional sourcing team reviewing dust bag samples',
          'products.bag.whyChoose.sourcingTeam',
        ),
      },
      {
        title: 'Strict QC Steps',
        description:
          'Leverage a decade of supply chain mastery. As a reliable dust bag manufacturer, our team eliminates the guesswork by strictly controlling every detail-from fabric thread count and stitching durability to precise logo printing. Whether you are ordering low MOQ custom pouches or large-scale wholesale batches, we ensure flawless execution and technical compatibility before anything leaves the factory.',
        image: image(
          '/images/products/labels/image 15-1.png',
          'Strict QC steps for custom dust bag production',
          'products.bag.whyChoose.qualityControl',
        ),
      },
      {
        title: 'Combined Shipment',
        description:
          "Backed by 10+ years of logistics experience, our specialists act as your eyes and ears in the Chinese market. We specialize in consolidating your entire packaging suite. By combining your custom dust bags with logo, woven labels, hang tags, and shipping tape into one seamless delivery, we drastically reduce your logistics overhead and ensure a consistent brand presentation from the factory to your customer's door.",
        image: image(
          '/images/products/labels/image 15-2.png',
          'Combined shipment desk for packaging materials',
          'products.bag.whyChoose.combinedShipment',
        ),
      },
    ],
    caseStudy: {
      title:
        'How We Engineered 100% Plastic-Free Reusable Pouches For Purcotton',
      description:
        'For eco-conscious lifestyle brands like Purcotton, packaging must reflect their core philosophy of "Nature, Safety, and Sustainability." Traditional plastic polybags were contradicting their brand image. They needed a premium, 100% natural textile solution that not only protected their garments but also served as a highly functional, reusable travel organizer for their end consumers.',
      image: image(
        '/images/products/labels/image-10.png',
        'Plastic-free reusable cotton pouch case study for Purcotton',
        'products.bag.caseStudy.hero',
      ),
      bullets: [
        'Total Plastic Elimination: Successfully replaced millions of single-use plastic bags with biodegradable textile alternatives.',
        'High Brand Retention: The functional design ensures an extremely high reuse rate as travel organizers, turning the packaging into a long-term "walking advertisement" for the brand.',
        "Operational Efficiency: The clever mesh window maintained fast picking and packing efficiency in Purcotton's warehouses.",
      ],
      quote:
        "SENYE didn't just manufacture a bag; they engineered a sustainable packaging solution that perfectly aligns with our brand DNA. The innovative cotton mesh window solved our retail visibility issues while completely eliminating single-use plastics from our product line.",
      quoteAuthor: 'Product Director, Purcotton',
      challenge:
        "Purcotton faced a critical packaging dilemma: how to eliminate plastic while maintaining retail visibility. Customers and warehouse staff needed to instantly identify the product's color and texture without opening the package-a feature usually requiring clear plastic. Furthermore, they wanted to upgrade their standard packaging into premium custom fabric pouches that consumers would actively keep and reuse.",
      solutionIntro:
        "As their trusted dust bag manufacturer, SENYE collaborated with Purcotton's product team to develop a hybrid 'Eco-Smart' zippered pouch:",
      solutionPoints: [
        'Material Engineering: We selected 100% unbleached raw greige cotton. By skipping the chemical bleaching process, we minimized the environmental impact while achieving an authentic, earthy aesthetic.',
        'Design Innovation: We integrated a high-density cotton mesh visualization window on the front panel. This brilliant detail allowed instant product identification without using a single drop of plastic.',
        'Structural Versatility: We replaced standard drawstrings with a smooth, durable zipper, transforming the custom cotton dust bags into secure travel cubes available in a standardized 3-size system.',
      ],
      resultPoints: [
        'Total Plastic Elimination: Successfully replaced millions of single-use plastic bags with biodegradable textile alternatives.',
        'High Brand Retention: The functional design ensures an extremely high reuse rate as travel organizers, turning the packaging into a long-term "walking advertisement" for the brand.',
        "Operational Efficiency: The clever mesh window maintained fast picking and packing efficiency in Purcotton's warehouses.",
      ],
      gallery: [
        image(
          '/images/products/labels/image 16.png',
          'Reusable cotton pouch with mesh window front view',
          'products.bag.caseStudy.gallery.0',
        ),
        image(
          '/images/products/labels/image 16-1.png',
          'Reusable cotton pouch folded detail',
          'products.bag.caseStudy.gallery.1',
        ),
        image(
          '/images/products/labels/image 16-2.png',
          'Cotton mesh pouch close-up detail',
          'products.bag.caseStudy.gallery.2',
        ),
        image(
          '/images/products/labels/image 16-3.png',
          'Reusable pouch zipper and label detail',
          'products.bag.caseStudy.gallery.3',
        ),
      ],
    },
    blogs: commonBlogs,
    faqs: [
      {
        question: 'Q1: What is your minimum order quantity (MOQ)?',
        answer:
          "We proudly support independent brands and startups by offering low MOQ custom pouches. You don't need large upfront commitments to get premium custom dust bags with logo.",
      },
      {
        question: 'Q2: Which fabric is best for shoes and handbags?',
        answer:
          'For standard breathability, we recommend custom cotton dust bags. For heavier luxury leather goods, canvas drawstring bags or thick flannel provide the best scratch-free protection.',
      },
      {
        question: 'Q3: Can I customize the exact size of the bags?',
        answer:
          'Absolutely. As a direct dust bag manufacturer, we cut and sew everything to your exact specifications to ensure your custom fabric pouches fit your products perfectly.',
      },
      {
        question:
          'Q4: What are the best options for jewelry and delicate items?',
        answer:
          'Our custom velvet pouches and microfiber suede bags are the industry standard. They offer a plush, premium feel, making them the perfect jewelry packaging pouches to prevent scratches.',
      },
      {
        question: 'Q5: What printing methods do you use for logos?',
        answer:
          'We offer high-definition silkscreen printing, premium embroidery, and heat transfer. We will recommend the best technique to make your branded dust bags look flawless on your chosen fabric.',
      },
      {
        question: 'Q6: Do you offer 100% eco-friendly or plastic-free options?',
        answer:
          'Yes! Our unbleached raw cotton and muslin bags are completely biodegradable. They are the ideal custom packaging bags for small business aiming to eliminate single-use plastics.',
      },
      {
        question: 'Q7: Can I customize the drawstrings and hardware?',
        answer:
          'Yes, the details matter. You can upgrade your bags with natural cotton ropes, elegant satin ribbons, or add custom metal stoppers to elevate your satin dust bags or cotton pouches.',
      },
      {
        question:
          'Q8: Can you ship my dust bags together with my hang tags and tape?',
        answer:
          'Yes, combined shipping is our specialty! We consolidate your custom dust bags wholesale orders with your tags and tape into one seamless delivery, drastically reducing your shipping costs.',
      },
      {
        question: 'Q9: What is the standard turnaround time?',
        answer:
          'Once you approve the physical or digital sample, bulk production typically takes 10-15 days. We ensure reliable lead times for your shoe dust bags with logo so you never miss a product launch.',
      },
    ],
    cta: {
      title: "Ready To Upgrade Your Brand's Packaging?",
      description: 'Send us your design, get a quote within 6 hours.',
      href: '/contact-us',
      buttonLabel: 'Request A Quote',
      note: "We'll reply within 6 hours.",
    },
  },
  {
    slug: 'labels',
    navLabel: 'Labels',
    title: 'Custom Clothing Labels For Apparel & Fashion Brands',
    metaDescription:
      'Custom woven labels, care labels, and printed labels for apparel brands with sampling and QC support.',
    subtitle: '',
    heroOverlay: 'labels',
    heroButtonPlacement: 'high',
    heroTitleLines: ['Custom Clothing Labels', 'For Apparel & Fashion Brands'],
    heroImage: image(
      '/images/products/optimized/hero-labels.jpg',
      'Custom clothing labels hero banner from Figma',
      'products.labels.hero',
    ),
    introTitle: 'What Are Custom Clothing Labels?',
    overview: labelIntroText,
    highlights: [...productShell.highlights],
    stats: [...productShell.stats],
    showcaseGroups: labelsShowcaseGroups,
    applicationTitle: 'Applications',
    applicationDescription:
      'Our Labels Are Widely Used Across Various Fashion And Textile Industries',
    applicationLayout: 'balanced',
    customizationGroups: [
      {
        title: 'Materials',
        intro:
          'As a buyer-oriented sourcing team with 10+ years of experience, we help you select the perfect substrate to ensure comfort, durability, and brand prestige.',
        images: [
          image(
            '/images/products/labels/Frame1.png',
            'Satin ribbon packaging detail',
            'products.ribbon.customization.polyester',
          ),
          image(
            '/images/products/labels/Frame2.png',
            'Natural packaging material with ribbon',
            'products.ribbon.customization.cotton',
          ),
          image(
            '/images/products/labels/Frame3.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
          image(
            '/images/products/labels/Frame4.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
          image(
            '/images/products/labels/Frame5.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
          image(
            '/images/products/labels/Frame6.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
        ],
        blocks: [
          {
            title: '1. Woven Labels',
            items: [
              'Focus: Durability, High-end feel, Intricate detail.',
              'Damask Woven Labels',
              'The Industry Standard:The most popular choice for high-end apparel. Using high-density polyester yarns, we achieve incredibly fine details for complex logos.',
              'Best For: Neck labels, suit branding, and luxury streetwear.',
              'Satin Woven Labels',
              'Luxury Sheen: Characterized by a smooth, glossy surface and soft edges. It adds a premium, high-luster look to your garments.',
              'Best For: Bridal wear, lingerie, and boutique designer brands.',
              'Taffeta Woven Labels',
              'Durable & Functional: A tighter weave with a slightly stiffer feel. It’s cost-effective and highly durable for outdoor gear.',
              'Best For: Winter jackets, bags, and workwear.',
            ],
          },
          {
            title: '2. Printed Labels',
            items: [
              'Focus: Skin-friendliness, Vivid colors, Compliance.',
              'Cotton Printed Labels',
              'Nature’s Touch: Made from 100% natural cotton. These labels are breathable, hypoallergenic, and perfect for eco-conscious brands.',
              'Best For: Baby clothing, organic fashion, and home textiles.',
              'Satin & Polyester Printed Labels',
              "Silky Soft: Offers a luxurious feel against the skin. We use high-grade inks that won't fade or irritate, even after 50+ washes.",
              'Best For: Underwear, sleepwear, and premium bedding.',
              'Nylon Taffeta Care Labels',
              'The Information Carrier: A paper-like texture that provides crisp, clear printing for small fonts and international wash symbols.',
              'Best For: Compliance labeling for all garment types.',
            ],
          },
          {
            title: '3. Specialty & Synthetic Materials',
            items: [
              'Focus: Modern aesthetics, Weather resistance, Uniqueness.',
              'TPU & Clear Labels',
              'Minimalist & Modern: Water-proof, oil-proof, and soft. Available in clear or frosted finishes for a futuristic look.',
              'Best For: Swimwear, activewear, and raincoats.',
              'Leather & PU Labels',
              'The Rugged Look: Choose from Genuine Leather for premium heritage or PU for a vegan-friendly, cost-effective alternative. Supports debossing and foil stamping.',
              'Best For: Denim, bags, hats, and footwear.',
              '3D PVC & Silicone Labels',
              'Tactile Impact: Create a bold, 3D effect. These labels are indestructible and stand out on heavy-duty fabrics.',
              'Best For: Sports gear, tactical apparel, and outerwear accessories.',
              'Heat Transfer Labels',
              'Focus: Zero-friction, Tagless comfort.',
              'Tagless Logo Transfers',
              'Maximum Comfort: Eliminates the "itchy" feeling of traditional labels. Our 3D Silicone and Reflective transfers provide high-stretch durability that won’t crack.',
              'Best For: T-shirts, yoga wear, and professional sportswear.',
            ],
          },
        ],
      },
      {
        title: 'Folding Options',
        intro:
          'Different garments require different label folding structures. We offer multiple folding styles to ensure your labels fit perfectly inside clothing while maintaining a clean and professional appearance.',
        images: [
          image(
            '/images/products/labels/printing1.png',
            'Satin ribbon packaging detail',
            'products.ribbon.customization.polyester',
          ),
          image(
            '/images/products/labels/printing2.png',
            'Natural packaging material with ribbon',
            'products.ribbon.customization.cotton',
          ),
          image(
            '/images/products/labels/printing3.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
          image(
            '/images/products/labels/printing4.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
          image(
            '/images/products/labels/printing5.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
          image(
            '/images/products/labels/printing6.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
        ],
        blocks: [
          {
            title: '• Straight Cut Labels',
            items: [
              'Features: Flat labels with clean edges that are sewn directly onto garments.',
              'Best For: Minimalist branding and small labels.',
            ],
          },
          {
            title: '• Center Fold Labels',
            items: [
              'Features: Folded in the middle so both sides can display information such as logo and size.',
              'Best For: Neck labels and main brand labels.',
            ],
          },
          {
            title: '• End Fold Labels',
            items: [
              'Features: Both sides are folded under, allowing the label to be sewn neatly into seams.',
              'Best For: Apparel labels and side seam labels.',
            ],
          },
          {
            title: '• Manhattan Fold Labels',
            items: [
              'Features: A premium folding style where both sides fold back behind the label.',
              'Best For: High-end clothing brands and fashion collections.',
            ],
          },
          {
            title: '• Loop Fold Labels',
            items: [
              'Features: Folded to create a loop, allowing additional information to be displayed inside.',
              'Best For: Care labels and multi-language garment labels.',
            ],
          },
        ],
      },
      {
        title: '',
        intro:
          'All of our custom clothing labels are fully made to order. Brands can choose the exact size and shape to match their product design and brand identity.',
        images: [],
        blocks: [
          {
            title: '• Custom Sizes',
            items: [
              'Features: Labels can be produced in any width and length according to your garment requirements.',
              'Best For: Brand labels, size labels, and care labels.',
            ],
          },
          {
            title: '• Standard Shapes',
            items: [
              'Features: Classic shapes including rectangular and square labels for easy sewing and clean presentation.',
              'Best For: Most apparel and textile applications.',
            ],
          },
          {
            title: '• Die-Cut Shapes',
            items: [
              'Features: Custom die-cut labels designed in unique shapes to create a distinctive brand look.',
              "Best For: Fashion brands, children's wear, and creative packaging.",
            ],
          },
          {
            title: '• Rounded Corners',
            items: [
              'Features: Smooth rounded edges that improve comfort and reduce irritation.',
              'Best For: Neck labels and inner garment labels.',
            ],
          },
        ],
      },
    ],
    whyChooseTitle: 'Why choose us as your Trusted Dust Bag Supplier ?',
    whyChoose: [
      {
        title: 'Professional Sourcing Team',
        description:
          "With over 10 years of deep-rooted expertise, we act as your dedicated local sourcing partner to navigate the complexities of Chinese textile manufacturing. We go beyond simple procurement; we expertly curate fabrics—from breathable custom cotton dust bags to luxurious velvet—ensuring your packaging perfectly embodies your brand's DNA. We are the bridge that transforms your creative vision into a high-quality, market-ready reality.",
        image: image(
          '/images/products/labels/image 15.png',
          'Professional Sourcing Team',
          'products.ribbon.whyChoose.lowMoq',
        ),
      },
      {
        title: 'Strict QC Steps',
        description:
          'Leverage a decade of supply chain mastery. As a reliable dust bag manufacturer, our team eliminates the guesswork by strictly controlling every detail—from fabric thread count and stitching durability to precise logo printing. Whether you are ordering low MOQ custom pouches or large-scale wholesale batches, we ensure flawless execution and technical compatibility before anything leaves the factory.',
        image: image(
          '/images/products/labels/image 15-1.png',
          'One-stop Customization',
          'products.ribbon.whyChoose.lowMoq',
        ),
      },
      {
        title: 'Combined Shipment',
        description:
          "Backed by 10+ years of logistics experience, our specialists act as your eyes and ears in the Chinese market. We specialize in consolidating your entire packaging suite. By combining your custom dust bags with logo, woven labels, hang tags, and shipping tape into one seamless delivery, we drastically reduce your logistics overhead and ensure a consistent brand presentation from the factory to your customer's door.",
        image: image(
          '/images/products/labels/image 15-2.png',
          'One-stop Customization',
          'products.ribbon.whyChoose.lowMoq',
        ),
      },
    ],
    categories: [
      {
        title: 'Woven labels',
        description:
          'Damask, satin, and taffeta labels for brand marks, size labels, and collection labels.',
        image: image(
          '/images/home/menu-labels.png',
          'Woven label close up',
          'products.labels.categories.woven',
        ),
      },
      {
        title: 'Printed care labels',
        description:
          'Soft, readable wash care and composition labels for apparel and home textiles.',
        image: image(
          '/images/solutions/fashion-kit-2.png',
          'Printed apparel label set',
          'products.labels.categories.care',
        ),
      },
      {
        title: 'Patch labels',
        description:
          'Leather, PU, rubber, and embossed labels for denim, bags, caps, and outerwear.',
        image: image(
          '/images/home/product-patches.png',
          'Patch label samples',
          'products.labels.categories.patch',
        ),
      },
    ],
    materials: [
      {
        title: 'Damask woven',
        description:
          'Fine detail and high-density logo output for premium apparel.',
        image: image(
          '/images/solutions/fashion-gallery-1.png',
          'Damask woven label detail',
          'products.labels.materials.damask',
        ),
      },
      {
        title: 'Satin printed',
        description: 'Smooth touch for care labels and inner brand labels.',
        image: image(
          '/images/solutions/home-lifestyle-kit-2.png',
          'Satin label material',
          'products.labels.materials.satin',
        ),
      },
      {
        title: 'Recycled yarn options',
        description:
          'Available for brands building a more sustainable trim program.',
        image: image(
          '/images/blog/article-fsc-popular.jpg',
          'Sustainable material certification',
          'products.labels.materials.recycled',
        ),
      },
    ],
    applications: labelItemsToCards(
      labelApplicationItems,
      'products.labels.applications',
    ),
    process: labelProcessSteps,
    processSubtitle: 'Offered through every stage of your project',
    caseStudy: {
      title:
        'Elevating Brand Identity: High-Density Damask Woven Labels with 3D Texture for GUUKA',
      description:
        'GUUKA is a trendsetting streetwear brand renowned for its bold designs and high-end positioning. As the brand evolved towards "Luxury Minimalism," they required a garment finishing partner capable of translating complex design philosophies into small, tangible brand assets. Their mission is to provide an "expensive" and "advanced" aesthetic through every detail of their apparel.',
      image: image(
        '/images/products/labels/image 10 (3).png',
        'Plastic-free reusable cotton pouch case study for Purcotton',
        'products.bag.caseStudy.hero',
      ),
      bullets: [
        'Total Plastic Elimination: Successfully replaced millions of single-use plastic bags with biodegradable textile alternatives.',
        'High Brand Retention: The functional design ensures an extremely high reuse rate as travel organizers, turning the packaging into a long-term "walking advertisement" for the brand.',
        "Operational Efficiency: The clever mesh window maintained fast picking and packing efficiency in Purcotton's warehouses.",
      ],
      quote:
        "We didn't want a label that just shouted a name; we wanted a label that whispered quality. SENYE understood that in luxury streetwear, texture is the new color. They turned our minimalist vision into a tactile reality that our customers can truly feel.",
      quoteAuthor: 'Design Director, GUUKA',
      challenge:
        "The core pain point was a 'Perception Gap.' GUUKA's existing neck labels used standard 100D yarns, resulting in a grainy, flat texture that felt 'cheap' compared to their premium garments. The client demanded a 'White-on-White' aesthetic—the most difficult execution in label manufacturing. In traditional production, a white logo on a white base becomes invisible. GUUKA needed a solution where the branding was defined by woven label texture and light reflection rather than contrasting ink.",
      solutionIntro:
        "As a specialized woven label manufacturer, SENYE engineered a 'Silent Luxury' solution by manipulating advanced fabric structures:",
      solutionPoints: [
        'High-Density 50-Denier Yarns: We utilized ultra-fine 50D yarns, doubling the standard thread count. This creates a damask woven label with a silk-like surface, ensuring an itch-free experience for the end-wearer.',
        'Dual-Weave Structural Innovation: To make the logo "pop" without color, we combined a 45° Diagonal Twill base (for architectural depth) with a High-Tension Plain weave for the logo.',
        '3D Embossed Effect: By manipulating light reflection across these different structures, we created natural shadows that allow the branding to emerge with a sophisticated 3D texture.',
      ],
      resultPoints: [
        '50D Micro-Yarn: Achieved an ultra-high density weave that eliminated all graininess, delivering a true luxury finish.',
        '3D Structural Branding: Successfully executed the "White-on-White" logo, visible through light-play without using a single drop of ink.',
        "100% Silky Touch: Guaranteed maximum skin comfort, aligning the label's feel with the brand’s high-end quality promise.",
      ],
      gallery: [
        image(
          '/images/products/labels/image 16 2.png',
          'Reusable cotton pouch with mesh window front view',
          'products.bag.caseStudy.gallery.0',
        ),
        image(
          '/images/products/labels/image 16-1 2.png',
          'Reusable cotton pouch folded detail',
          'products.bag.caseStudy.gallery.1',
        ),
      ],
    },
    blogs: commonBlogs,
    faqs: labelFaqs,
    cta: {
      title: "Ready to Upgrade Your Brand's Packaging?",
      description: 'Send us your design, get a quote within 6 hours.',
      href: '/contact-us',
      buttonLabel: 'Request A Quote',
      note: "We'll reply within 6 hours.",
    },
  },
  {
    slug: 'ribbon',
    navLabel: 'Ribbon',
    title: 'Custom Printed Ribbon For Packaging & Gift Branding',
    metaDescription:
      'Custom satin, grosgrain, cotton, and recycled ribbons for retail packaging and gifting.',
    subtitle:
      'Premium custom ribbon with logo printing for product packaging, gift wrapping, and retail branding',
    heroImage: image(
      '/images/products/optimized/hero-ribbon.jpg',
      'Custom printed ribbon hero banner from Figma',
      'products.ribbon.hero',
    ),
    overview: `
    Custom ribbon is more than just a decorative accessory. It is an important packaging element that helps brands present their products in a more professional and memorable way.
    Widely used in gift packaging, apparel packaging, and luxury product packaging, custom ribbons can be printed with logos, patterns, or brand colors to strengthen brand identity.
    At SENYE, we provide custom printed ribbon solutions for fashion brands, retail packaging, and e-commerce businesses. From elegant satin ribbon to durable grosgrain ribbon, our ribbons help elevate the overall packaging experience and enhance the perceived value of your products.
    `,
    highlights: [...productShell.highlights],
    stats: [...productShell.stats],
    categories: [
      {
        title: 'Satin ribbon',
        description:
          'Smooth shine and sharp logo printing for premium retail packaging.',
        image: image(
          '/images/home/menu-ribbon.png',
          'Satin ribbon roll',
          'products.ribbon.categories.satin',
        ),
      },
      {
        title: 'Grosgrain ribbon',
        description: 'Textured ribs for stronger handfeel and structured bows.',
        image: image(
          '/images/solutions/jewelry-luxury-gallery-3.png',
          'Grosgrain ribbon on luxury packaging',
          'products.ribbon.categories.grosgrain',
        ),
      },
      {
        title: 'Cotton ribbon',
        description:
          'Natural matte finish for organic, handmade, and lifestyle products.',
        image: image(
          '/images/solutions/home-lifestyle-gallery-3.png',
          'Cotton ribbon packaging',
          'products.ribbon.categories.cotton',
        ),
      },
    ],
    materials: [
      {
        title: 'Polyester satin',
        description:
          'Cost-effective, consistent, and suitable for high-volume gift packaging.',
        image: image(
          '/images/solutions/cosmetics-gallery-2.png',
          'Satin ribbon packaging detail',
          'products.ribbon.materials.polyester',
        ),
      },
      {
        title: 'Cotton and recycled fibers',
        description:
          'Lower-sheen ribbon for brands with a natural packaging language.',
        image: image(
          '/images/blog/article-biodegradable-packaging.jpg',
          'Natural packaging material with ribbon',
          'products.ribbon.materials.cotton',
        ),
      },
      {
        title: 'Metallic print finishes',
        description:
          'Foil-like logo effects for festive, beauty, and luxury collections.',
        image: image(
          '/images/solutions/cosmetics-kit-3.png',
          'Metallic packaging ribbon detail',
          'products.ribbon.materials.metallic',
        ),
      },
    ],
    applications: [
      {
        title: 'Gift boxes',
        description:
          'Ribbon wraps and bows for launch kits, holiday campaigns, and retail gifting.',
        image: image(
          '/images/solutions/jewelry-luxury-gallery-1.png',
          'Gift box with ribbon',
          'products.ribbon.applications.gift',
        ),
      },
      {
        title: 'Garment packaging',
        description:
          'Bundle garments, tissue paper, and hang tags into a cohesive set.',
        image: image(
          '/images/solutions/fashion-kit-3.png',
          'Garment packaging ribbon kit',
          'products.ribbon.applications.garment',
        ),
      },
      {
        title: 'Beauty kits',
        description:
          'Add tactile brand detail to cosmetics, skincare, and influencer boxes.',
        image: image(
          '/images/solutions/cosmetics-case.png',
          'Cosmetics kit with packaging details',
          'products.ribbon.applications.beauty',
        ),
      },
    ],
    customizationGroups: [
      {
        title: 'Materials',
        intro:
          'Match material, color, size, print technique, finish, and packing method across your product line.',
        images: [
          image(
            '/images/solutions/cosmetics-gallery-2.png',
            'Satin ribbon packaging detail',
            'products.ribbon.customization.polyester',
          ),
          image(
            '/images/blog/article-biodegradable-packaging.jpg',
            'Natural packaging material with ribbon',
            'products.ribbon.customization.cotton',
          ),
          image(
            '/images/solutions/cosmetics-kit-3.png',
            'Metallic packaging ribbon detail',
            'products.ribbon.customization.metallic',
          ),
        ],
        blocks: [
          {
            title: 'Available Custom Options',
            items: [...productShell.highlights],
          },
        ],
      },
    ],
    process: [...productShell.process],
    whyChooseTitle: 'Why Choose Us For Custom Printed Ribbon?',
    whyChoose: [
      {
        title: 'Low MOQ For Startup Brands',
        description:
          'Start with a small test order, confirm the finish and handfeel, then scale into bulk production when your collection is ready.',
        image: image(
          '/images/services/product-development.png',
          'Team reviewing packaging and trim samples',
          'products.ribbon.whyChoose.lowMoq',
        ),
      },
      {
        title: 'One-stop Customization',
        description:
          'Match labels, hang tags, stickers, bags, tape, ribbons, and packaging trims in one managed workflow.',
        image: image(
          '/images/services/quality.png',
          'Packaging customization desk with samples',
          'products.ribbon.whyChoose.customization',
        ),
      },
      {
        title: 'Strict Quality Control',
        description:
          'We check artwork, material, color tolerance, finishing, packing, and final shipment details before dispatch.',
        image: image(
          '/images/services/warehouse-assembly.png',
          'Quality control and packing workflow',
          'products.ribbon.whyChoose.quality',
        ),
      },
    ],
    caseStudy: {
      title:
        'Capturing Italian Elegance: Custom 10mm Tone-on-Tone Luxury Ribbons for Coscia',
      description:
        'Coscia is a prestigious Italian multi-brand luxury retailer with a deep heritage in high fashion. Renowned for its impeccable taste, the brand requires packaging that reflects the earthy tones of classic Italian leather and architecture. For Coscia, every gift box is an ambassador of their heritage, demanding a ribbon that serves as the perfect finishing touch to their premium unboxing experience.',
      image: image(
        '/images/products/ribbon/image 10.png',
        'Lifestyle packaging case with ribbon',
        'products.ribbon.caseStudy',
      ),
      bullets: [
        'Logo repeat mocked before sampling',
        'Ribbon width matched to box sizes',
        'Color checked with tissue and stickers',
      ],
      quote:
        "In the luxury sector, the difference between 'good' and 'exceptional' lies in the details. We needed a ribbon that didn't just carry our logo, but whispered our brand's history through its texture and color. SENYE delivered a level of precision in tone-on-tone printing that we hadn't found elsewhere.",
      quoteAuthor: 'Product Director, Purcotton',
      challenge: `
      The design brief was deceptively simple: a 10mm (1cm) wide ribbon in a specific "Warm Amber" shade, featuring a "Deep Espresso" logo. However, executing this presented two critical technical hurdles:
The Tone-on-Tone Visibility Issue: Printing dark brown ink on a brownish-yellow background is extremely risky. If the ink opacity is too low, the logo becomes muddy and illegible, failing to meet luxury standards.
Narrow-Width Precision: At only 1cm wide, there is zero margin for error. Previous suppliers struggled with off-center printing and ink smearing, which ruined the delicate aesthetic of the Custom Luxury Ribbon.
      `,
      solutionIntro:
        'As a leading Ribbon Manufacturer, SENYE implemented a high-precision production strategy to meet Coscia’s rigorous standards:',
      solutionPoints: [
        'High-Opacity Screen Printing: We utilized a specialized high-density ink that sits on top of the fabric fibers rather than soaking in. This ensured sharp logo edges and high legibility despite the subtle color contrast.',
        'Custom Dye-to-Match Service: To achieve the "Golden Amber" base that mimics vintage Italian leather, we performed multiple lab-dip trials to ensure a 100% color match with Coscia’s signature brand palette.',
        'Micro-Alignment Technology: Using high-precision narrow-web machinery, we maintained strict structural control. This ensured the logo remained perfectly centered on the 10mm width throughout the entire production run with zero deviation.',
      ],
      resultPoints: [
        'Elevated Brand Perception: The heavy-weight grosgrain texture combined with the subtle tone-on-tone branding achieved the "Expensive Look" required for the Italian market.',
        '100% Color Accuracy: The custom-dyed 10mm Satin Ribbon perfectly integrated with Coscia’s minimalist white gift boxes, creating a cohesive brand identity.',
        'Zero-Defect Manufacturing: By delivering high-precision narrow ribbons with consistent centering, SENYE proved its capability as a top-tier partner for the global luxury sector.',
      ],
      gallery: [
        image(
          '/images/products/ribbon/Group 1272636800.png',
          'Reusable cotton pouch with mesh window front view',
          'products.bag.caseStudy.gallery.0',
        ),
        image(
          '/images/products/ribbon/Frame 40.png',
          'Reusable cotton pouch folded detail',
          'products.bag.caseStudy.gallery.1',
        ),
        image(
          '/images/products/ribbon/Group 1272636801.png',
          'Reusable cotton pouch folded detail',
          'products.bag.caseStudy.gallery.3',
        ),
        image(
          '/images/products/ribbon/Group 1272636749.png',
          'Reusable cotton pouch folded detail',
          'products.bag.caseStudy.gallery.4',
        ),
      ],
    },
    blogs: commonBlogs,
    faqs: buildFaqs(
      'ribbons',
      'Q4: Which ribbon material works best for premium gift boxes?',
    ),
  },
  {
    slug: 'tape',
    navLabel: 'Tape',
    title: 'Eco-Friendly Packaging Tape For Modern Brands',
    metaDescription:
      'Custom packaging tape for ecommerce boxes, retail shipments, and brand packaging systems.',
    subtitle:
      'Upgrade your unboxing experience with our custom tape with logo. Sustainable materials, strict QC & low MOQ. We engineer the perfect supply chain for your growth.',
    heroTone: 'warm',
    heroAlign: 'left',
    heroImage: image(
      '/images/products/optimized/hero-tape.jpg',
      'Custom packaging tape hero banner from Figma',
      'products.tape.hero',
    ),
    overview:
      'Printed packaging tape helps your cartons look professional before the box is opened. We support logo repeat setup, kraft or white base choices, adhesive options, and mixed packaging consolidation.',
    highlights: [...productShell.highlights],
    stats: [...productShell.stats],
    categories: [
      {
        title: 'Kraft paper tape',
        description:
          'Natural look for eco-conscious shipping and paper-based packaging.',
        image: image(
          '/images/home/menu-tape.png',
          'Kraft custom packaging tape',
          'products.tape.categories.kraft',
        ),
      },
      {
        title: 'BOPP tape',
        description:
          'Durable standard for ecommerce cartons and daily warehouse packing.',
        image: image(
          '/images/blog/article-custom-packaging-ecommerce.jpg',
          'Ecommerce package with branded tape',
          'products.tape.categories.bopp',
        ),
      },
      {
        title: 'Water-activated tape',
        description:
          'Secure seal and premium unboxing feel for heavier shipments.',
        image: image(
          '/images/services/delivery-bg.png',
          'Packed cartons ready for delivery',
          'products.tape.categories.waterActivated',
        ),
      },
    ],
    materials: [
      {
        title: 'White base',
        description:
          'Clean contrast for simple logos and colorful brand marks.',
        image: image(
          '/images/solutions/cosmetics-gallery-4.png',
          'White packaging detail',
          'products.tape.materials.white',
        ),
      },
      {
        title: 'Kraft base',
        description:
          'Warm natural texture that pairs well with paper mailers and kraft boxes.',
        image: image(
          '/images/blog/article-kraft-paper.jpg',
          'Kraft paper packaging texture',
          'products.tape.materials.kraft',
        ),
      },
      {
        title: 'Clear base',
        description:
          'Useful when the carton or packaging color should remain visible.',
        image: image(
          '/images/solutions/home-lifestyle-gallery-4.png',
          'Clear packaging tape detail',
          'products.tape.materials.clear',
        ),
      },
    ],
    applications: [
      {
        title: 'Ecommerce cartons',
        description:
          'Branded outer shipping experience for direct-to-consumer orders.',
        image: image(
          '/images/services/warehouse-assembly.png',
          'Ecommerce carton assembly',
          'products.tape.applications.ecommerce',
        ),
      },
      {
        title: 'Retail replenishment',
        description:
          'Consistent carton branding for wholesale and store deliveries.',
        image: image(
          '/images/services/warehouse-consolidation.png',
          'Retail packaging consolidation',
          'products.tape.applications.retail',
        ),
      },
      {
        title: 'Launch kits',
        description:
          'Coordinate tape with tags, stickers, tissue paper, and thank-you cards.',
        image: image(
          '/images/solutions/fashion-gallery-4.png',
          'Launch kit packaging details',
          'products.tape.applications.kits',
        ),
      },
    ],
    customizationGroups: [
      {
        title: 'Materials',
        intro:
          'Match material, color, size, print technique, finish, and packing method across your product line.',
        images: [
          image(
            '/images/solutions/cosmetics-gallery-4.png',
            'White packaging detail',
            'products.tape.customization.white',
          ),
          image(
            '/images/blog/article-kraft-paper.jpg',
            'Kraft paper packaging texture',
            'products.tape.customization.kraft',
          ),
          image(
            '/images/solutions/home-lifestyle-gallery-4.png',
            'Clear packaging tape detail',
            'products.tape.customization.clear',
          ),
        ],
        blocks: [
          {
            title: 'Available Custom Options',
            items: [...productShell.highlights],
          },
        ],
      },
    ],
    process: [...productShell.process],
    whyChooseTitle: 'Why Choose Us For Custom Packaging Tape?',
    whyChoose: [
      {
        title: 'Low MOQ For Startup Brands',
        description:
          'Start with a small test order, confirm the finish and handfeel, then scale into bulk production when your collection is ready.',
        image: image(
          '/images/services/product-development.png',
          'Team reviewing packaging and trim samples',
          'products.tape.whyChoose.lowMoq',
        ),
      },
      {
        title: 'One-stop Customization',
        description:
          'Match labels, hang tags, stickers, bags, tape, ribbons, and packaging trims in one managed workflow.',
        image: image(
          '/images/services/quality.png',
          'Packaging customization desk with samples',
          'products.tape.whyChoose.customization',
        ),
      },
      {
        title: 'Strict Quality Control',
        description:
          'We check artwork, material, color tolerance, finishing, packing, and final shipment details before dispatch.',
        image: image(
          '/images/services/warehouse-assembly.png',
          'Quality control and packing workflow',
          'products.tape.whyChoose.quality',
        ),
      },
    ],
    caseStudy: {
      title: 'Ecommerce tape and sticker refresh',
      description:
        'A DTC brand needed a low-MOQ refresh for cartons and mailers. We prepared logo repeat layouts, sampled kraft tape, and shipped it with matching stickers.',
      image: image(
        '/images/solutions/cosmetics-case.png',
        'Ecommerce packaging refresh case',
        'products.tape.caseStudy',
      ),
      bullets: [
        'Repeat pattern prepared from logo',
        'Adhesive choice matched to carton weight',
        'Tape and stickers shipped together',
      ],
    },
    blogs: commonBlogs,
    faqs: buildFaqs(
      'packaging tape',
      'Q4: Which tape is best for ecommerce cartons?',
    ),
  },
  {
    slug: 'sticker',
    navLabel: 'Sticker',
    title: 'Premium Custom Sticker Printing & Labels',
    metaDescription:
      'Custom stickers, seals, label sheets, and packaging decals for retail and ecommerce brands.',
    subtitle:
      'Elevate your brand with our high-quality custom sticker labels. From clothing stickers to waterproof custom vinyl stickers, we are your reliable sticker manufacturer offering low MOQ and strict QC.',
    heroImage: image(
      '/images/products/optimized/hero-sticker.jpg',
      'Custom sticker hero banner from Figma',
      'products.sticker.hero',
    ),
    overview:
      'Stickers are a fast way to brand boxes, tissue, bags, jars, mailers, and campaign inserts. We support shape, finish, adhesive, roll or sheet packing, and color consistency.',
    highlights: [...productShell.highlights],
    stats: [...productShell.stats],
    categories: [
      {
        title: 'Logo stickers',
        description:
          'Round, square, die-cut, and custom shape stickers for everyday packaging.',
        image: image(
          '/images/home/menu-sticker.png',
          'Custom logo sticker sheet',
          'products.sticker.categories.logo',
        ),
      },
      {
        title: 'Sealing labels',
        description:
          'Tissue paper seals, box seals, mailer seals, and tamper-evident options.',
        image: image(
          '/images/solutions/cosmetics-kit-1.png',
          'Packaging seal sticker',
          'products.sticker.categories.seal',
        ),
      },
      {
        title: 'Product decals',
        description:
          'Waterproof and durable stickers for jars, bottles, accessories, and retail products.',
        image: image(
          '/images/solutions/cosmetics-gallery-3.png',
          'Product decal on cosmetic packaging',
          'products.sticker.categories.decal',
        ),
      },
    ],
    materials: [
      {
        title: 'Coated paper',
        description:
          'Cost-effective and clean for boxes, bags, cards, and tissue seals.',
        image: image(
          '/images/blog/article-eco-paper-boxes.jpg',
          'Paper sticker packaging material',
          'products.sticker.materials.paper',
        ),
      },
      {
        title: 'Waterproof film',
        description:
          'Better durability for bottles, jars, outdoor use, and moisture exposure.',
        image: image(
          '/images/solutions/cosmetics-hero.png',
          'Waterproof cosmetic label application',
          'products.sticker.materials.film',
        ),
      },
      {
        title: 'Special finishes',
        description:
          'Matte, gloss, holographic, kraft, transparent, and metallic effects.',
        image: image(
          '/images/solutions/jewelry-luxury-gallery-4.png',
          'Special finish packaging label',
          'products.sticker.materials.finish',
        ),
      },
    ],
    applications: [
      {
        title: 'Tissue and box seals',
        description:
          'Finish the unboxing experience with low-cost branded closure points.',
        image: image(
          '/images/home/product-tissue.png',
          'Tissue paper with seal',
          'products.sticker.applications.tissue',
        ),
      },
      {
        title: 'Beauty and skincare',
        description:
          'Labels and seals for jars, bottles, tubes, and promotional sets.',
        image: image(
          '/images/solutions/cosmetics-gallery-2.png',
          'Beauty product stickers',
          'products.sticker.applications.beauty',
        ),
      },
      {
        title: 'Campaign inserts',
        description:
          'Sticker sheets for launches, loyalty gifts, and influencer packaging.',
        image: image(
          '/images/blog/article-brand-identity.jpg',
          'Brand campaign stickers',
          'products.sticker.applications.campaign',
        ),
      },
    ],
    customizationGroups: [
      {
        title: 'Materials',
        intro:
          'Match material, color, size, print technique, finish, and packing method across your product line.',
        images: [
          image(
            '/images/blog/article-eco-paper-boxes.jpg',
            'Paper sticker packaging material',
            'products.sticker.customization.paper',
          ),
          image(
            '/images/solutions/cosmetics-hero.png',
            'Waterproof cosmetic label application',
            'products.sticker.customization.film',
          ),
          image(
            '/images/solutions/jewelry-luxury-gallery-4.png',
            'Special finish packaging label',
            'products.sticker.customization.finish',
          ),
        ],
        blocks: [
          {
            title: 'Available Custom Options',
            items: [...productShell.highlights],
          },
        ],
      },
    ],
    process: [...productShell.process],
    whyChooseTitle: 'Why Choose Us For Custom Stickers?',
    whyChoose: [
      {
        title: 'Low MOQ For Startup Brands',
        description:
          'Start with a small test order, confirm the finish and handfeel, then scale into bulk production when your collection is ready.',
        image: image(
          '/images/services/product-development.png',
          'Team reviewing packaging and trim samples',
          'products.sticker.whyChoose.lowMoq',
        ),
      },
      {
        title: 'One-stop Customization',
        description:
          'Match labels, hang tags, stickers, bags, tape, ribbons, and packaging trims in one managed workflow.',
        image: image(
          '/images/services/quality.png',
          'Packaging customization desk with samples',
          'products.sticker.whyChoose.customization',
        ),
      },
      {
        title: 'Strict Quality Control',
        description:
          'We check artwork, material, color tolerance, finishing, packing, and final shipment details before dispatch.',
        image: image(
          '/images/services/warehouse-assembly.png',
          'Quality control and packing workflow',
          'products.sticker.whyChoose.quality',
        ),
      },
    ],
    caseStudy: {
      title: 'Sticker system for a beauty launch',
      description:
        'A beauty brand needed box seals, jar labels, and campaign stickers. We matched finishes, checked adhesive, and arranged compact sheet packing.',
      image: image(
        '/images/solutions/cosmetics-case.png',
        'Beauty packaging sticker case',
        'products.sticker.caseStudy',
      ),
      bullets: [
        'Multiple sticker shapes in one brief',
        'Finish and adhesive sampled',
        'Packed as sheets for easy fulfillment',
      ],
    },
    blogs: commonBlogs,
    faqs: buildFaqs(
      'stickers',
      'Q4: Which sticker material is best for bottles or jars?',
    ),
  },
  {
    slug: 'patches',
    navLabel: 'Patches',
    title: 'Custom Patches for Clothing, Hats & Apparel Brands',
    metaDescription:
      'Custom embroidered, woven, leather, rubber, and chenille patches for apparel and accessories.',
    subtitle:
      'We are a professional custom patch manufacturer providing high-quality patches for clothing brands, fashion designers, and apparel manufacturers.',
    heroImage: image(
      '/images/products/optimized/hero-patches.jpg',
      'Custom patches hero banner from Figma',
      'products.patches.hero',
    ),
    overview: `Custom patches are decorative and branding elements attached to garments, hats, bags, and accessories. They are widely used by fashion brands, sports teams, and apparel manufacturers to display logos, artwork, or brand identity.
Compared with printed logos, custom patches offer stronger texture, higher durability, and a more premium appearance. This makes them a popular choice for jackets, uniforms, hats, streetwear, and outdoor gear.
Common patch styles include embroidered patches, woven patches, chenille patches, leather patches, and PVC patches, each offering different visual effects and performance.`,
    highlights: [...productShell.highlights],
    stats: [...productShell.stats],
    categories: [
      {
        title: 'Embroidered patches',
        description:
          'Raised thread texture for caps, jackets, uniforms, and casualwear.',
        image: image(
          '/images/home/menu-patches.png',
          'Embroidered patch samples',
          'products.patches.categories.embroidered',
        ),
      },
      {
        title: 'Woven patches',
        description:
          'Finer logo detail when artwork has small typography or complex linework.',
        image: image(
          '/images/home/product-woven-labels.png',
          'Woven patch label detail',
          'products.patches.categories.woven',
        ),
      },
      {
        title: 'Leather and rubber patches',
        description:
          'Dimensional branding for denim, bags, outerwear, and sportswear.',
        image: image(
          '/images/solutions/fashion-gallery-1.png',
          'Leather patch on fashion product',
          'products.patches.categories.leather',
        ),
      },
    ],
    materials: [
      {
        title: 'Thread embroidery',
        description:
          'Classic textured look with multiple border and backing options.',
        image: image(
          '/images/solutions/fashion-kit-2.png',
          'Thread embroidery material',
          'products.patches.materials.thread',
        ),
      },
      {
        title: 'PU and genuine leather',
        description:
          'Premium brand patches for denim, bags, hats, and accessories.',
        image: image(
          '/images/solutions/fashion-gallery-3.png',
          'Leather accessory patch',
          'products.patches.materials.leather',
        ),
      },
      {
        title: 'Rubber and silicone',
        description:
          'Durable, dimensional, and modern for outdoor or sports categories.',
        image: image(
          '/images/solutions/home-lifestyle-gallery-2.png',
          'Rubber patch application',
          'products.patches.materials.rubber',
        ),
      },
    ],
    applications: [
      {
        title: 'Caps and outerwear',
        description:
          'Visible front-facing brand detail with durable attachment.',
        image: image(
          '/images/solutions/fashion-why.png',
          'Outerwear patch application',
          'products.patches.applications.outerwear',
        ),
      },
      {
        title: 'Denim and bags',
        description:
          'Leather and woven patches for waistbands, pockets, totes, and handbags.',
        image: image(
          '/images/solutions/fashion-case.png',
          'Denim and bag patch branding',
          'products.patches.applications.denim',
        ),
      },
      {
        title: 'Merch and uniforms',
        description:
          'Embroidered patches for clubs, events, teams, and brand merchandise.',
        image: image(
          '/images/solutions/home-lifestyle-kit-3.png',
          'Merch patch application',
          'products.patches.applications.merch',
        ),
      },
    ],
    customizationGroups: [
      {
        title: 'Materials',
        intro:
          'Match material, color, size, print technique, finish, and packing method across your product line.',
        images: [
          image(
            '/images/solutions/fashion-kit-2.png',
            'Thread embroidery material',
            'products.patches.customization.thread',
          ),
          image(
            '/images/solutions/fashion-gallery-3.png',
            'Leather accessory patch',
            'products.patches.customization.leather',
          ),
          image(
            '/images/solutions/home-lifestyle-gallery-2.png',
            'Rubber patch application',
            'products.patches.customization.rubber',
          ),
        ],
        blocks: [
          {
            title: 'Available Custom Options',
            items: [...productShell.highlights],
          },
        ],
      },
    ],
    process: [...productShell.process],
    whyChooseTitle: 'Why choose us as your Trusted Dust Bag Supplier ?',
    whyChoose: [
      {
        title: 'Professional Sourcing Team',
        description:
          "With over 10 years of deep-rooted expertise, we act as your dedicated local sourcing partner to navigate the complexities of Chinese textile manufacturing. We go beyond simple procurement; we expertly curate fabrics—from breathable custom cotton dust bags to luxurious velvet—ensuring your packaging perfectly embodies your brand's DNA. We are the bridge that transforms your creative vision into a high-quality, market-ready reality.",
        image: image(
          '/images/products/patches/image 15.png',
          'Team reviewing packaging and trim samples',
          'products.patches.whyChoose.lowMoq',
        ),
      },
      {
        title: 'Strict QC Steps',
        description:
          'Leverage a decade of supply chain mastery. As a reliable dust bag manufacturer, our team eliminates the guesswork by strictly controlling every detail—from fabric thread count and stitching durability to precise logo printing. Whether you are ordering low MOQ custom pouches or large-scale wholesale batches, we ensure flawless execution and technical compatibility before anything leaves the factory.',
        image: image(
          '/images/products/patches/Frame 41.png',
          'Packaging customization desk with samples',
          'products.patches.whyChoose.customization',
        ),
      },
      {
        title: 'Combined Shipment',
        description:
          "Backed by 10+ years of logistics experience, our specialists act as your eyes and ears in the Chinese market. We specialize in consolidating your entire packaging suite. By combining your custom dust bags with logo, woven labels, hang tags, and shipping tape into one seamless delivery, we drastically reduce your logistics overhead and ensure a consistent brand presentation from the factory to your customer's door.",
        image: image(
          '/images/products/patches/Frame 41-1.png',
          'Quality control and packing workflow',
          'products.patches.whyChoose.quality',
        ),
      },
    ],
    caseStudy: {
      title:
        'Iconic Joy in 3D: Crafting Multi-Layered Custom PVC Patches for SmileyWorld',
      description:
        "SmileyWorld is a global cultural phenomenon and a symbol of positivity in the streetwear industry. Known for their high-profile collaborations and 'Space & Mystery' themed collections, they demand accessories that translate their playful designs into tangible, high-quality street culture assets. For SmileyWorld, a patch is not just a label; it is a 3D centerpiece that defines the garment's character.",
      image: image(
        '/images/products/patches/caseStudy.png',
        'Streetwear patch case study',
        'products.patches.caseStudy',
      ),
      bullets: [
        'Total Plastic Elimination: Successfully replaced millions of single-use plastic bags with biodegradable textile alternatives.',
        'High Brand Retention: The functional design ensures an extremely high reuse rate as travel organizers, turning the packaging into a long-term "walking advertisement" for the brand.',
        "Operational Efficiency: The clever mesh window maintained fast picking and packing efficiency in Purcotton's warehouses.",
      ],
      quote:
        "Our 'Space & Mystery' collection required a level of technical precision that most suppliers couldn't reach. SENYE didn't just match our iconic 'Smiley Yellow'; they engineered a multi-layered 3D UFO scene that brought our vision to life. The sharp detailing on the 'CAUTION UFO' text is a testament to their master-grade injection technology.",
      quoteAuthor: 'Creative Director, SmileyWorld Collaboration',
      challenge: `The project for the UFO abduction capsule collection presented three critical technical hurdles that standard PVC label printing could not solve:
Color Integrity (The Iconic Yellow): Any slight deviation in the pigment mix would undermine one of the most recognizable brand colors in the world.
Complex 3D Layering: The design involved four distinct levels of depth (Orange base, Green UFO, Yellow Smiley, and raised Black text). Standard molding often results in "color bleeding" at the borders between these levels.
Micro-Detailing: The "CAUTION UFO" text required razor-sharp edges within a tiny surface area. Typical PVC rubber label injection often leads to blurred or "smudged" letters.`,
      solutionIntro:
        'As a specialized PVC Label Manufacturer, SENYE utilized advanced multi-stage micro-injection technology to achieve industrial-grade precision:',
      solutionPoints: [
        'Custom Pigment Matching: Our lab performed a 100% Pantone match for "Smiley Yellow" using UV-resistant liquid PVC to ensure the colors remain vivid without fading or yellowing over time.',
        'Precision CNC Mold Making: We engineered high-precision aluminum molds with varying depths. This allowed the UFO to physically "float" above the orange background, creating a premium 3D Rubber Label effect.',
        'Sequential Color Injection: To prevent bleeding, we used a sequential cooling process. Each color was injected and partially cured before the next layer was added, resulting in the crisp, sharp borders seen on the micro-text.',
        'Eco-Friendly Soft PVC: We ensured all materials passed REACH and RoHS certifications, making the Custom PVC Patches safe for global distribution and soft enough for sewing without cracking.',
      ],
      resultPoints: [
        'Tactile Brand Engagement: The 3D sculptural quality turned a simple logo into a tactile experience that resonates deeply with the Gen-Z streetwear market.',
        '100% Precision: The "Caution UFO" text remained perfectly legible, and the iconic yellow Smiley remained identical across all production batches.',
        'Extreme Durability: The patches passed over 50 wash cycles with zero signs of peeling, fading, or warping—proving SENYE’s capability in high-wear streetwear brand accessories.',
      ],
      gallery: [
        image(
          '/images/products/patches/Group 1272636800.png',
          'Reusable cotton pouch with mesh window front view',
          'products.bag.caseStudy.gallery.0',
        ),
        image(
          '/images/products/patches/Frame 40.png',
          'Reusable cotton pouch folded detail',
          'products.bag.caseStudy.gallery.1',
        ),
        image(
          '/images/products/patches/Group 1272636801.png',
          'Reusable cotton pouch folded detail',
          'products.bag.caseStudy.gallery.1',
        ),
        image(
          '/images/products/patches/Group 1272636749.png',
          'Reusable cotton pouch folded detail',
          'products.bag.caseStudy.gallery.1',
        ),
      ],
    },
    blogs: commonBlogs,
    faqs: [
      {
        question: 'Q1: What types of custom patches do you offer?',
        answer:
          'We offer a wide range of custom patches for clothing and accessories, including embroidered patches, woven patches, chenille patches, leather patches, and PVC patches. Each type provides different textures, durability levels, and visual effects depending on the design and application.',
      },
      {
        question: 'Q2: What is the minimum order quantity for custom patches?',
        answer:
          'Our minimum order quantity usually starts from 100-500 pieces, depending on the patch type, material, and size. For large production orders, we can also provide more competitive pricing.',
      },
      {
        question:
          'Q3: What is the difference between embroidered patches and woven patches?',
        answer:
          'Embroidered patches use stitched threads to create a raised and textured logo, giving a classic look. Woven patches use finer threads woven together, allowing more detailed artwork and small text. Woven patches are better for detailed designs, while embroidered patches are ideal for bold logos.',
      },
      {
        question: 'Q4: Can patches be made in custom shapes?',
        answer:
          'Yes. Custom patches can be produced in many shapes, including circle, rectangle, oval, and custom die-cut shapes based on your logo design. Custom shapes help brands create more distinctive and recognizable patches.',
      },
      {
        question: 'Q5: What backing options are available for custom patches?',
        answer:
          'We offer several backing options to suit different applications: sew-on backing, iron-on backing, velcro backing, adhesive backing, and heat transfer backing. Sew-on patches provide the strongest durability for clothing.',
      },
      {
        question: 'Q6: Are iron-on patches durable?',
        answer:
          'Iron-on patches are convenient and easy to apply. However, for garments that require long-term durability or frequent washing, sewing the patch after ironing is recommended.',
      },
      {
        question: 'Q7: What file format should I send for patch artwork?',
        answer:
          'Vector files such as AI, PDF, or EPS are preferred because they provide the best quality for production. If you only have a JPG or PNG file, our team can assist in converting it into a suitable format.',
      },
      {
        question: 'Q8: How long does it take to produce custom patches?',
        answer:
          'Production usually takes 7-12 working days after artwork confirmation. If samples are required, sample production may take an additional few days.',
      },
      {
        question: 'Q9: Where are custom patches commonly used?',
        answer:
          'Custom patches are widely used on clothing and fashion apparel, hats and caps, sports uniforms, jackets and denim products, and bags and backpacks. They are a popular way for brands to display logos and create unique product designs.',
      },
    ],
  },
  {
    slug: 'tissue-paper',
    navLabel: 'Tissue Paper',
    title: 'Custom Tissue Paper for Packaging & Branding',
    metaDescription:
      'Custom printed tissue paper for apparel, jewelry, beauty, gifting, and ecommerce packaging.',
    subtitle:
      'High-quality custom tissue paper with logo printing for clothing packaging, retail packaging, and gift presentation.',
    heroImage: image(
      '/images/products/optimized/hero-tissue-paper.jpg',
      'Custom tissue paper hero banner from Figma',
      'products.tissuePaper.hero',
    ),
    overview:
      'Printed tissue paper adds softness, protection, and a memorable reveal moment. We coordinate paper weight, logo repeat, ink coverage, folding, packing, stickers, and matched ribbon.',
    highlights: [...productShell.highlights],
    stats: [...productShell.stats],
    categories: [
      {
        title: 'Logo repeat tissue',
        description:
          'All-over pattern tissue for ecommerce orders and gift-ready packaging.',
        image: image(
          '/images/home/menu-tissue-paper.png',
          'Logo repeat tissue paper',
          'products.tissuePaper.categories.repeat',
        ),
      },
      {
        title: 'Solid color tissue',
        description:
          'Brand color matching with simple seals or ribbon for premium presentation.',
        image: image(
          '/images/solutions/cosmetics-gallery-1.png',
          'Solid color tissue in beauty packaging',
          'products.tissuePaper.categories.solid',
        ),
      },
      {
        title: 'Eco tissue paper',
        description:
          'Recycled and FSC options for brands reducing plastic and excess packaging.',
        image: image(
          '/images/blog/article-biodegradable-packaging.jpg',
          'Eco tissue paper packaging',
          'products.tissuePaper.categories.eco',
        ),
      },
    ],
    materials: [
      {
        title: '17-22gsm tissue',
        description:
          'Lightweight wrapping for apparel, accessories, and cosmetics.',
        image: image(
          '/images/solutions/home-lifestyle-gallery-4.png',
          'Lightweight tissue paper material',
          'products.tissuePaper.materials.lightweight',
        ),
      },
      {
        title: 'Recycled tissue',
        description:
          'A practical sustainability upgrade for everyday unboxing.',
        image: image(
          '/images/blog/article-fsc-paper.jpg',
          'Recycled paper texture',
          'products.tissuePaper.materials.recycled',
        ),
      },
      {
        title: 'Metallic and white ink',
        description:
          'Special print treatments for dark paper or seasonal campaigns.',
        image: image(
          '/images/solutions/jewelry-luxury-gallery-1.png',
          'Premium tissue paper detail',
          'products.tissuePaper.materials.specialPrint',
        ),
      },
    ],
    applications: [
      {
        title: 'Apparel wrapping',
        description:
          'Protect garments and create a cleaner first impression inside mailers or boxes.',
        image: image(
          '/images/solutions/fashion-gallery-4.png',
          'Apparel tissue paper wrapping',
          'products.tissuePaper.applications.apparel',
        ),
      },
      {
        title: 'Beauty and gifting',
        description:
          'Pair tissue with stickers and ribbon for campaign kits and retail gifting.',
        image: image(
          '/images/solutions/cosmetics-case.png',
          'Beauty gift tissue packaging',
          'products.tissuePaper.applications.beauty',
        ),
      },
      {
        title: 'Jewelry packaging',
        description:
          'Soft inner wrapping for boxes, pouches, and delicate accessories.',
        image: image(
          '/images/solutions/jewelry-luxury-kit-3.png',
          'Jewelry packaging with tissue',
          'products.tissuePaper.applications.jewelry',
        ),
      },
    ],
    customizationGroups: [
      {
        title: 'Materials',
        intro:
          'Match material, color, size, print technique, finish, and packing method across your product line.',
        images: [
          image(
            '/images/solutions/home-lifestyle-gallery-4.png',
            'Lightweight tissue paper material',
            'products.tissuePaper.customization.lightweight',
          ),
          image(
            '/images/blog/article-fsc-paper.jpg',
            'Recycled paper texture',
            'products.tissuePaper.customization.recycled',
          ),
          image(
            '/images/solutions/jewelry-luxury-gallery-1.png',
            'Premium tissue paper detail',
            'products.tissuePaper.customization.specialPrint',
          ),
        ],
        blocks: [
          {
            title: 'Available Custom Options',
            items: [...productShell.highlights],
          },
        ],
      },
    ],
    process: [...productShell.process],
    whyChooseTitle: 'Why Choose Us For Custom Tissue Paper?',
    whyChoose: [
      {
        title: 'Low MOQ For Startup Brands',
        description:
          'Start with a small test order, confirm the finish and handfeel, then scale into bulk production when your collection is ready.',
        image: image(
          '/images/services/product-development.png',
          'Team reviewing packaging and trim samples',
          'products.tissuePaper.whyChoose.lowMoq',
        ),
      },
      {
        title: 'One-stop Customization',
        description:
          'Match labels, hang tags, stickers, bags, tape, ribbons, and packaging trims in one managed workflow.',
        image: image(
          '/images/services/quality.png',
          'Packaging customization desk with samples',
          'products.tissuePaper.whyChoose.customization',
        ),
      },
      {
        title: 'Strict Quality Control',
        description:
          'We check artwork, material, color tolerance, finishing, packing, and final shipment details before dispatch.',
        image: image(
          '/images/services/warehouse-assembly.png',
          'Quality control and packing workflow',
          'products.tissuePaper.whyChoose.quality',
        ),
      },
    ],
    caseStudy: {
      title: 'Tissue, sticker, and ribbon set for a gift launch',
      description:
        'A home lifestyle brand needed a soft unboxing set. We aligned tissue color, sticker finish, and ribbon width so the packaging felt cohesive.',
      image: image(
        '/images/solutions/home-lifestyle-case.png',
        'Gift launch tissue paper case',
        'products.tissuePaper.caseStudy',
      ),
      bullets: [
        'Repeat pattern checked before print',
        'Sticker finish matched to tissue color',
        'Tissue and ribbon packed for fulfillment',
      ],
    },
    blogs: commonBlogs,
    faqs: buildFaqs(
      'tissue paper',
      'Q4: Can tissue paper be printed with metallic or white ink?',
    ),
  },
];

export const getProductBySlug = (slug: string) =>
  productPages.find((product) => product.slug === slug);
