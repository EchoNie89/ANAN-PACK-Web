import type { SiteImageSource } from '../lib/local-images';
import { getLocalImage } from '../lib/local-images';

export type SolutionIconName =
  | 'stack'
  | 'sample'
  | 'refresh'
  | 'chat'
  | 'shield'
  | 'spark'
  | 'box'
  | 'leaf';

export interface SolutionCard {
  title: string;
  description: string;
  image: SiteImageSource;
  alt: string;
}

export interface SolutionTextBlock {
  title: string;
  description: string;
}

export interface SolutionCaseSection {
  title: string;
  body?: string;
  bullets?: string[];
}

export interface SolutionPageData {
  slug: string;
  navLabel: string;
  breadcrumb: string;
  title: string;
  metaDescription: string;
  hero: {
    title: string;
    description: string;
    image: SiteImageSource;
    alt: string;
    cta: string;
  };
  challenges: {
    title: string;
    items: Array<SolutionTextBlock & { icon: SolutionIconName }>;
  };
  strips: [string, string];
  kit: {
    title: string;
    items: SolutionCard[];
  };
  why: {
    title: string;
    image: SiteImageSource;
    alt: string;
    points: SolutionTextBlock[];
  };
  eco: {
    title: string;
    columns: Array<SolutionTextBlock & { kicker: string }>;
    cta: string;
  };
  caseStudy: {
    image: SiteImageSource;
    alt: string;
    title: string;
    headline: string;
    intro: string;
    quote: string;
    attribution: string;
    sections: SolutionCaseSection[];
  };
  gallery: Array<{
    image: SiteImageSource;
    alt: string;
  }>;
  cta: {
    title: string;
    description: string;
    button: string;
    note: string;
  };
}

const base = '/images/solutions';
const solutionImage = (fileName: string) =>
  getLocalImage(`${base}/${fileName}`);

export const solutionPages: SolutionPageData[] = [
  {
    slug: 'fashion-apparel',
    navLabel: 'For Cosmetics & Beauty',
    breadcrumb: 'For Cosmetics & Beauty',
    title: 'Cosmetics & Beauty Packaging Solutions',
    metaDescription:
      'Premium branding, labels, trims, and secondary packaging for cosmetics and beauty brands.',
    hero: {
      title: 'Premium Branding & Labeling Solutions For Cosmetics & Beauty',
      description:
        'Elevate your beauty brand with high-precision labels and luxury packaging. From oil-resistant product stickers to bespoke secondary packaging, we ensure your brand looks flawless on every shelf.',
      image: solutionImage('cosmetics-hero.png'),
      alt: 'Cosmetics and beauty packaging materials arranged on textured paper',
      cta: 'Get A Solution Quote',
    },
    challenges: {
      title: 'Overcoming The Challenges Of Beauty Packaging',
      items: [
        {
          icon: 'stack',
          title: 'Shelf Proofing & Oil Resistance',
          description:
            'Labels must stay clean, legible, and premium even when oils, creams, and daily handling are involved.',
        },
        {
          icon: 'sample',
          title: 'Strict Allergen Requirements',
          description:
            'Packaging materials need verified safety, stable inks, and supplier documentation for regulated markets.',
        },
        {
          icon: 'refresh',
          title: 'Color Matching Across Batches',
          description:
            'Beauty ranges need consistent tones across stickers, boxes, wraps, pouches, and refill packs.',
        },
        {
          icon: 'chat',
          title: 'High-Spec, Premium Finishes',
          description:
            'Foil, embossing, soft-touch films, and textured stock must look polished without slowing production.',
        },
      ],
    },
    strips: [
      'Engineered Materials & Precision Finishing For The Beauty Industry.',
      'You Design The Clothes. We Handle The Rest.',
    ],
    kit: {
      title: 'Your Complete Branding Kit',
      items: [
        {
          title: 'Hang Tags & Seals',
          image: solutionImage('cosmetics-kit-1.png'),
          alt: 'Cosmetics hang tags and seals in neutral tones',
          description:
            'Premium branding starts here. We offer high-precision printing and diverse material options to ensure your brand identity is captured in every small detail.',
        },
        {
          title: 'Woven Labels',
          image: solutionImage('cosmetics-kit-2.png'),
          alt: 'Beauty packaging boxes and woven branding labels',
          description:
            'Crafted with high-density weaving techniques for a soft touch and sharp logos. Our labels stay durable, skin-friendly, and consistent across batches.',
        },
        {
          title: 'E-com Packaging',
          image: solutionImage('cosmetics-kit-3.png'),
          alt: 'Printed tissue paper for beauty e-commerce packaging',
          description:
            'From eco-friendly mailers to custom gift boxes, we consolidate your packaging needs to improve unboxing and protect every product.',
        },
      ],
    },
    why: {
      title: 'Why Sourcing Via SENYE Is Better?',
      image: solutionImage('why-better.png'),
      alt: 'Cosmetics packaging samples arranged for sourcing review',
      points: [
        {
          title: 'Resilience-Tested Materials',
          description:
            'We match labels, boxes, and pouches to product use cases, including oil contact, humidity, and retail handling.',
        },
        {
          title: 'High-End Decorative Finishes',
          description:
            'Foil stamping, embossing, debossing, tactile papers, and soft-touch films are coordinated through one workflow.',
        },
        {
          title: 'Perfect Fit & Dimensional Accuracy',
          description:
            'Custom inserts, boxes, wraps, and tags are sampled against your products before bulk production starts.',
        },
        {
          title: 'Small-Batch Luxury',
          description:
            'Flexible MOQs support boutique launches, seasonal drops, and limited editions without overbuying inventory.',
        },
      ],
    },
    eco: {
      title: 'Go Green With Your Fashion Brand',
      cta: 'Learn More About Our Eco-Materials ?',
      columns: [
        {
          title: 'PCR & Forest-Based Labeling',
          kicker: 'Recycled materials, premium clarity.',
          description:
            'We source post-consumer recycled films, FSC paper labels, and mono-material label structures that keep beauty packaging polished and responsible.',
        },
        {
          title: 'Tree-Free & High-Texture Eco-Papers',
          kicker: 'Tactile experiences that tell a natural story.',
          description:
            'Choose cotton, bamboo, sugarcane, and other alternative fiber papers for secondary packaging with a soft, crafted feel.',
        },
        {
          title: 'Clean Printing & Circular Finishes',
          kicker: 'Non-toxic vibrancy, fully recyclable results.',
          description:
            'Water-based inks, low-migration coatings, and recyclable finishes help align luxury packaging with sustainability goals.',
        },
      ],
    },
    caseStudy: {
      image: solutionImage('cosmetics-case.png'),
      alt: 'Retail display and reusable pouch packaging case study',
      title: 'Case Study',
      headline:
        'How We Engineered 100% Plastic-Free Reusable Pouches For Purcotton',
      intro:
        'For eco-conscious lifestyle brands like Purcotton, packaging has to protect the product while reinforcing a responsible brand promise. We engineered a reusable pouch system that balanced softness, durability, and a plastic-free material story.',
      quote:
        'SENYE did not just manufacture a bag; they engineered a sustainable packaging solution that matched our brand values and improved our customer experience.',
      attribution: 'Product Director, Purcotton',
      sections: [
        {
          title: 'The Challenge:',
          body: 'The brand needed packaging that felt premium, avoided disposable plastic, and remained practical for shipping, display, and repeat customer use.',
        },
        {
          title: 'Our Solution:',
          bullets: [
            'Developed a reusable cotton pouch structure with reinforced seams and soft-touch finishing.',
            'Matched drawcord, labels, and print color to the brand system across multiple SKUs.',
            'Coordinated sampling, material checks, and batch production through a single supplier workflow.',
          ],
        },
        {
          title: 'The Results:',
          bullets: [
            'A plastic-free packaging unit that customers could keep and reuse.',
            'Improved perceived value at unboxing without adding unnecessary secondary packaging.',
            'Cleaner sourcing coordination and fewer handoffs during production.',
          ],
        },
      ],
    },
    gallery: [
      {
        image: solutionImage('cosmetics-gallery-1.png'),
        alt: 'Reusable pouch packaging detail',
      },
      {
        image: solutionImage('cosmetics-gallery-2.png'),
        alt: 'Folded soft packaging pouch',
      },
      {
        image: solutionImage('cosmetics-gallery-3.png'),
        alt: 'Close-up of pouch label stitching',
      },
      {
        image: solutionImage('cosmetics-gallery-4.png'),
        alt: 'Reusable pouch closure and label detail',
      },
    ],
    cta: {
      title: 'Make Your Beauty Brand Unforgettable.',
      description:
        'From boutique startups to established beauty labels, we provide the precision your products deserve.',
      button: 'Get Your Project Started',
      note: "We'll reply within 6 hours.",
    },
  },
  {
    slug: 'cosmetics-beauty',
    navLabel: 'For Fashion & Apparel',
    breadcrumb: 'For Fashion & Apparel',
    title: 'Fashion & Apparel Packaging Solutions',
    metaDescription:
      'One-stop apparel packaging, labels, trims, seals, and sourcing coordination for fashion brands.',
    hero: {
      title: 'One-Stop Packaging Solutions For Fashion & Apparel Brands',
      description:
        'Tired of managing 5 different suppliers? We source, match,  and consolidate your Hang Tags, Labels, and Mailers.',
      image: solutionImage('fashion-hero.png'),
      alt: 'Fashion packaging boxes, bags, and tags in green tones',
      cta: 'Get A Solution Quote',
    },
    challenges: {
      title: 'Common Challenges Fashion Brands Face',
      items: [
        {
          icon: 'stack',
          title: 'MOQ Challenges',
          description:
            'New collections often need small runs before demand is proven.',
        },
        {
          icon: 'sample',
          title: 'High Sampling Cost',
          description:
            'Multiple suppliers can make every trim sample expensive and slow.',
        },
        {
          icon: 'refresh',
          title: 'Brand Consistency',
          description:
            'Tags, labels, seals, bags, and boxes need one coordinated color language.',
        },
        {
          icon: 'chat',
          title: 'Slow Responses & Missed Deadlines',
          description:
            'Production delays happen when approvals are split across too many vendors.',
        },
      ],
    },
    strips: [
      'We Solve It: Unified Color Management & Reliable Services.',
      'You Design The Clothes. We Handle The Rest.',
    ],
    kit: {
      title: 'Your Complete Branding Kit',
      items: [
        {
          title: 'Product Labels & Stickers',
          image: solutionImage('fashion-kit-1.png'),
          alt: 'Apparel product labels and stickers',
          description:
            'Wash labels, neck labels, price stickers, and branded seals produced with matching colors and finishes.',
        },
        {
          title: 'Luxury Secondary Packaging',
          image: solutionImage('fashion-kit-2.png'),
          alt: 'Luxury apparel boxes, bags, and pouches',
          description:
            'Custom boxes, shopping bags, pouches, and sleeves that give every order a retail-ready unboxing moment.',
        },
        {
          title: 'Security & Tamper-Evident Seals',
          image: solutionImage('fashion-kit-4.png'),
          alt: 'Tamper-evident label and sticker sheets',
          description:
            'Seals, warranty stickers, and anti-counterfeit details help protect your products and reinforce brand trust.',
        },
      ],
    },
    why: {
      title: 'Why Sourcing Via [Our Company Name] Is Better?',
      image: solutionImage('fashion-why.png'),
      alt: 'Pink apparel packaging gift set',
      points: [
        {
          title: 'Color Consistency',
          description:
            'We coordinate all trims and packaging against the same color targets so your brand feels unified.',
        },
        {
          title: 'Flexible MOQ For Scalability',
          description:
            'Start with test quantities, then scale the same approved materials as your collection grows.',
        },
        {
          title: 'One Point Of Contact',
          description:
            'Sampling, quotation, production, packing, and QC are coordinated through one accountable team.',
        },
        {
          title: 'Rapid Prototyping (Sampling)',
          description:
            'Fast sampling cycles help you approve trims before your production window gets tight.',
        },
      ],
    },
    eco: {
      title: 'Go Green With Your Fashion Brand',
      cta: 'Learn More About Our Eco-Materials ?',
      columns: [
        {
          title: 'Recycled Polyester Labels (GRS)',
          kicker: 'Lower impact without losing hand feel.',
          description:
            'GRS recycled yarn labels help apparel brands reduce virgin material use while keeping woven details sharp.',
        },
        {
          title: 'FSC Certified Paper Tags',
          kicker: 'Responsible paper for everyday retail.',
          description:
            'FSC hang tags, sleeves, and cards provide a clean sustainability story across the full apparel kit.',
        },
        {
          title: 'Biodegradable Poly Bags',
          kicker: 'Cleaner fulfillment packaging.',
          description:
            'Compostable and biodegradable bag options help reduce disposable plastic impact in e-commerce delivery.',
        },
      ],
    },
    caseStudy: {
      image: solutionImage('fashion-case.png'),
      alt: 'Premium foil label display for food and fashion brand case study',
      title: 'Case Study',
      headline: 'How We Engineered Premium Foil Labels For Suji & Co',
      intro:
        'Suji & Co needed a premium label system that could scale across products while keeping a handmade, high-value look. The solution required accurate foil registration, consistent color, and repeatable sourcing.',
      quote:
        'SENYE completely transformed our product presentation. The labels look premium, arrived consistently, and gave our retail display a much stronger shelf presence.',
      attribution: 'Creative Director, Suji & Co',
      sections: [
        {
          title: 'The Challenge:',
          body: 'The brand needed a cohesive label suite across product sizes without paying luxury-packaging MOQs for every small batch.',
        },
        {
          title: 'Our Solution:',
          bullets: [
            'Created a shared material and foil standard that could be reused across SKU sizes.',
            'Managed color proofing and foil tests before bulk print approval.',
            'Consolidated label production and packaging checks to reduce vendor coordination.',
          ],
        },
        {
          title: 'The Results:',
          bullets: [
            'Sharper retail presentation with stronger premium cues.',
            'Lower reorder friction across seasonal product runs.',
            'Consistent material, color, and finishing across the full label family.',
          ],
        },
      ],
    },
    gallery: [
      {
        image: solutionImage('fashion-gallery-1.png'),
        alt: 'Foil label on product jar',
      },
      {
        image: solutionImage('fashion-gallery-2.png'),
        alt: 'Printed label sheets before application',
      },
      {
        image: solutionImage('fashion-gallery-3.png'),
        alt: 'Custom printed sticker sheets',
      },
      {
        image: solutionImage('fashion-gallery-4.png'),
        alt: 'Finished product with custom label',
      },
    ],
    cta: {
      title: 'Need A Reliable Supply Chain Partner In China?',
      description:
        'Coordinate your trims, packaging, QC, and sampling through one accountable sourcing partner.',
      button: 'Get Your Project Started',
      note: "We'll reply within 6 hours.",
    },
  },
  {
    slug: 'home-lifestyle',
    navLabel: 'For Home & Lifestyle',
    breadcrumb: 'For Home & Lifestyle',
    title: 'Home & Lifestyle Packaging Solutions',
    metaDescription:
      'Durable branding, labels, packaging, and compliance-ready sourcing for home textile and lifestyle brands.',
    hero: {
      title: 'Professional Branding & Durable Packaging For Home & Lifestyle',
      description:
        'Enhance your home textile brand with high-performance wash care labels and heavy-duty, eco-friendly packaging. We specialize in solutions that withstand the test of time, ensuring your quality promise stays with the customer.',
      image: solutionImage('home-lifestyle-hero.png'),
      alt: 'Home textile packaging and labels in soft blue fabric',
      cta: 'Get A Solution Quote',
    },
    challenges: {
      title: 'Common Challenges (Home Textile Pain Points)',
      items: [
        {
          icon: 'stack',
          title: 'Fading & Wash',
          description:
            'Labels must survive repeated washing without losing legibility or softness.',
        },
        {
          icon: 'sample',
          title: 'Packaging Bulk',
          description:
            'Bulky textiles need protective packaging that still ships efficiently.',
        },
        {
          icon: 'refresh',
          title: 'SKU Sensitivity',
          description:
            'Sizes, sets, colorways, and care details must be packed with low error rates.',
        },
        {
          icon: 'chat',
          title: 'Global Compliance',
          description:
            'Care labels and packaging claims need to align with destination-market rules.',
        },
      ],
    },
    strips: [
      'High-Durability Labeling & Space-Saving Packaging Architectures.',
      'You Design The Softness. We Handle The Rest.',
    ],
    kit: {
      title: 'Your Complete Branding Kit',
      items: [
        {
          title: 'High-Intensity Woven Labels',
          image: solutionImage('home-lifestyle-kit-1.png'),
          alt: 'Durable woven labels for home textiles',
          description:
            'Strong woven labels built for home textile use, repeated washing, and clear brand recognition.',
        },
        {
          title: 'Double-Faced Satin Jacquard Printed',
          image: solutionImage('home-lifestyle-kit-2.png'),
          alt: 'Soft satin labels on textile products',
          description:
            'Soft satin and jacquard labels designed for skin contact, premium texture, and long-term readability.',
        },
        {
          title: 'Heavy-Duty & Reusable Packaging',
          image: solutionImage('home-lifestyle-kit-3.png'),
          alt: 'Reusable textile packaging bundle',
          description:
            'Storage bags, wraps, and textile-ready packaging structures that protect volume without feeling wasteful.',
        },
      ],
    },
    why: {
      title: 'Why Sourcing Via [Our Company Name] Is Better?',
      image: solutionImage('home-lifestyle-why.png'),
      alt: 'Home lifestyle packaging set with tags and boxes',
      points: [
        {
          title: 'Wash-Test Guaranteed',
          description:
            'We specify labels and prints for washing, friction, and fabric-contact requirements before production.',
        },
        {
          title: 'Compliance-Ready Law Labels',
          description:
            'Fiber content, care information, and origin labels are checked for clarity and production accuracy.',
        },
        {
          title: 'Optimized Packaging Volume',
          description:
            'Packaging structures are developed to protect textiles while reducing wasted carton and warehouse space.',
        },
        {
          title: 'Soft-Touch Engineering',
          description:
            'Material choices balance durability with a soft, premium hand feel suitable for bedding, towels, and lifestyle goods.',
        },
      ],
    },
    eco: {
      title: 'Go Green (Three Sustainable Pillars)',
      cta: 'Learn More About Our Eco-Materials ?',
      columns: [
        {
          title: 'GRS-Certified Recycled Satin & Polyester',
          kicker: 'Traceable recycled textile trims.',
          description:
            'Recycled satin and polyester options reduce virgin material use while keeping labels soft and resilient.',
        },
        {
          title: 'FSC-Certified Heavyweight Hang Tags',
          kicker: 'Responsible paper with premium weight.',
          description:
            'FSC paper tags and cards support a natural home goods story without compromising tactile quality.',
        },
        {
          title: 'Biodegradable Zipper Storage Bags',
          kicker: 'Storage packaging with a cleaner end-of-life.',
          description:
            'Biodegradable storage bags and reusable zipper systems help reduce disposable packaging impact.',
        },
      ],
    },
    caseStudy: {
      image: solutionImage('home-lifestyle-case.png'),
      alt: 'Home lifestyle case study image with warm interior',
      title: 'Case Study',
      headline:
        'How We Engineered High-Performance Custom Kraft Tape For Hyde & Hare & Achieved Zero-Failure Logistics',
      intro:
        'For premier lifestyle brands like Hyde & Hare England, the unboxing experience is a final brand touchpoint. The tape needed to feel natural, premium, secure, and sustainable.',
      quote:
        'SENYE completely transformed our shipping logistics into a true brand asset. They engineered a custom tape that matches our natural luxury aesthetic and provides unbreakable security during transit.',
      attribution: 'Operations Director, Hyde & Hare England',
      sections: [
        {
          title: 'The Challenge:',
          body: 'Glossy plastic tape felt cheap against high-end home goods, while standard eco tapes failed to adhere reliably to recycled cartons.',
        },
        {
          title: 'Our Solution:',
          bullets: [
            'Selected a heavy-duty kraft tape base that harmonized with earthy brand tones.',
            'Used a high-tack natural rubber adhesive to bond securely with paper fibers.',
            'Applied matte black ink to remove glare and keep the branding understated.',
          ],
        },
        {
          title: 'The Results:',
          bullets: [
            'Zero incidents of tape failure during international transit.',
            'Shipping cartons became more premium and brand-aligned.',
            'Customers could recycle the full shipping unit more easily.',
          ],
        },
      ],
    },
    gallery: [
      {
        image: solutionImage('home-lifestyle-gallery-1.png'),
        alt: 'Custom kraft tape roll',
      },
      {
        image: solutionImage('home-lifestyle-gallery-2.png'),
        alt: 'Kraft tape in hand',
      },
      {
        image: solutionImage('home-lifestyle-gallery-3.png'),
        alt: 'Custom kraft tape detail',
      },
      {
        image: solutionImage('home-lifestyle-gallery-4.png'),
        alt: 'Branded kraft tape rolls and strip',
      },
    ],
    cta: {
      title: 'Scale Your Home Brand With Quality That Lasts.',
      description:
        'Trust the experts in durability and compliance to build a packaging system that protects your product.',
      button: 'Get Your Project Started',
      note: "We'll reply within 6 hours.",
    },
  },
  {
    slug: 'jewelry-luxury',
    navLabel: 'For Jewelry & Luxury',
    breadcrumb: 'For Jewelry & Luxury',
    title: 'Jewelry & Luxury Packaging Solutions',
    metaDescription:
      'Bespoke luxury packaging, pouches, tags, labels, and trim sourcing for jewelry and premium brands.',
    hero: {
      title: 'Exquisite Branding & Bespoke Packaging For Jewelry & Luxury',
      description:
        'Elevate your brand’s prestige with artisanal labels and high-end display packaging. From embossed metallic tags to velvet-lined boxes, we provide the meticulous details that turn products into heirlooms.',
      image: solutionImage('jewelry-luxury-hero.png'),
      alt: 'Luxury jewelry packaging with pouch, card, ribbon, and tags',
      cta: 'Get A Solution Quote',
    },
    challenges: {
      title: 'Common Challenges (Luxury Pain Points)',
      items: [
        {
          icon: 'stack',
          title: 'Overpackaging Perception',
          description:
            'Luxury packaging needs to feel substantial without looking wasteful or overbuilt.',
        },
        {
          icon: 'sample',
          title: 'Lack Of Customization',
          description:
            'Standard boxes and pouches rarely match the exact size, texture, and tone a luxury brand needs.',
        },
        {
          icon: 'spark',
          title: 'Durability & Elegance',
          description:
            'Delicate pieces need protective inserts and soft surfaces that still look refined.',
        },
        {
          icon: 'chat',
          title: 'Quality Delicacy',
          description:
            'Small defects in foil, stitching, ribbons, or closures can undermine the full premium impression.',
        },
      ],
    },
    strips: [
      'Crafting Unforgettable First Impressions With Artisanal Precision.',
      'You Design The Collection. We Handle The Rest.',
    ],
    kit: {
      title: 'Your Complete Branding Kit',
      items: [
        {
          title: 'Embossed & Metallic Labels',
          image: solutionImage('jewelry-luxury-kit-1.png'),
          alt: 'Embossed and metallic luxury labels',
          description:
            'Foil, embossing, metallic inks, and soft-touch labels create refined details for boxes, cards, and product tags.',
        },
        {
          title: 'Artisanal Display & Gift Boxes',
          image: solutionImage('jewelry-luxury-kit-2.png'),
          alt: 'Luxury display and gift boxes',
          description:
            'Rigid boxes, inserts, trays, and sleeves are engineered around the product to protect and present each piece.',
        },
        {
          title: 'Pouches & Premium Wraps',
          image: solutionImage('jewelry-luxury-kit-3.png'),
          alt: 'Premium jewelry pouches and cards',
          description:
            'Velvet, suede, cotton, satin, and specialty wraps add tactility while keeping jewelry safe in transit.',
        },
      ],
    },
    why: {
      title: 'Why Sourcing Via SENYE Is Better (The Luxury Edge)',
      image: solutionImage('jewelry-luxury-why.png'),
      alt: 'Luxury jewelry packaging box with pouch and accessories',
      points: [
        {
          title: 'High-End Craftsmanship',
          description:
            'We coordinate fine materials, specialty finishes, and tight tolerances for a refined luxury result.',
        },
        {
          title: 'Material Selection Mastery',
          description:
            'Papers, fabrics, linings, ribbons, inserts, and hardware are selected to match the desired premium feel.',
        },
        {
          title: 'Bespoke Structural Design',
          description:
            'Custom inserts and box structures protect fragile items while delivering a precise, elegant opening experience.',
        },
        {
          title: 'Small-Batch Exclusive Runs',
          description:
            'Flexible MOQs support limited collections, boutique launches, and seasonal luxury campaigns.',
        },
      ],
    },
    eco: {
      title: 'Go Green With Your Fashion Brand',
      cta: 'Learn More About Our Eco-Materials ?',
      columns: [
        {
          title: 'FSC-Certified Premium Art Papers',
          kicker: 'Responsibly sourced, unmistakably high-end.',
          description:
            'FSC-certified papers with linen, cotton, and textured finishes deliver a crafted feel while supporting responsible sourcing.',
        },
        {
          title: 'Vegan Leather & Eco-Suede Pouches',
          kicker: 'Cruelty-free luxury for the modern era.',
          description:
            'Vegan leather and recycled microfiber suedes provide softness and durability without traditional animal skins.',
        },
        {
          title: 'Recyclable Metal & Mineral Inks',
          kicker: 'Luster that does not harm the earth.',
          description:
            'Lead-free hardware and mineral-safe inks help keep shimmer, foil, and metallic details more responsible.',
        },
      ],
    },
    caseStudy: {
      image: solutionImage('jewelry-luxury-case.png'),
      alt: 'Pink luxury jewelry gift packaging case study',
      title: 'Case Study',
      headline:
        'How We Engineered High-Performance Custom Kraft Tape For Hyde & Hare & Achieved Zero-Failure Logistics',
      intro:
        'For luxury brands, every packaging touchpoint needs to support the product story. The solution had to combine elegant materials, secure structure, and a premium unboxing flow.',
      quote:
        'SENYE translated our visual direction into packaging that felt precise, giftable, and consistent from sample to bulk order.',
      attribution: 'Brand Director, Luxury Accessories Client',
      sections: [
        {
          title: 'The Challenge:',
          body: 'The brand needed protective jewelry packaging with a delicate color palette, clean finishing, and enough structure for shipping.',
        },
        {
          title: 'Our Solution:',
          bullets: [
            'Developed coordinated boxes, pouches, ribbons, and cards using a unified material palette.',
            'Controlled color matching across paper, textile, and printed surfaces.',
            'Validated inserts and closures through sampling before bulk production.',
          ],
        },
        {
          title: 'The Results:',
          bullets: [
            'A more giftable luxury packaging system across the product range.',
            'Cleaner supplier coordination and fewer approval loops.',
            'Better protection for delicate items without sacrificing softness or detail.',
          ],
        },
      ],
    },
    gallery: [
      {
        image: solutionImage('jewelry-luxury-gallery-1.png'),
        alt: 'Pink jewelry gift box with ribbon',
      },
      {
        image: solutionImage('jewelry-luxury-gallery-2.png'),
        alt: 'Luxury jewelry box and pouch arrangement',
      },
      {
        image: solutionImage('jewelry-luxury-gallery-3.png'),
        alt: 'Pink drawstring jewelry pouch and box',
      },
      {
        image: solutionImage('jewelry-luxury-gallery-4.png'),
        alt: 'Coordinated pink jewelry packaging set',
      },
    ],
    cta: {
      title: 'Give Your Luxury Brand The Packaging It Deserves.',
      description:
        "Let's create a masterpiece together. Precision, elegance, and exclusivity are just a consultation away.",
      button: 'Get Your Project Started',
      note: "We'll reply within 6 hours.",
    },
  },
];

export const defaultSolution = solutionPages[0];

export function getSolutionBySlug(slug: string) {
  return solutionPages.find((page) => page.slug === slug);
}
