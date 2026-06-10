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
    slug: 'cosmetics-beauty',
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
      title: 'Why Sourcing Via ANAN PACK Is Better?',
      image: solutionImage('why-better.png'),
      alt: 'Cosmetics packaging samples arranged for sourcing review',
      points: [
        {
          title: 'Resilience-Tested Materials',
          description: `• We provide materials specifically tested for the beauty industry—guaranteed to resist oils, chemicals, and water without fading or peeling.`,
        },
        {
          title: 'High-End Decorative Finishes',
          description: `• Access luxury techniques usually reserved for large volumes: 3D UV, hot foil stamping, and micro-embossing, even for your limited edition launches.`,
        },
        {
          title: 'Perfect Fit & Dimensional Accuracy',
          description: `• Using high-precision die-cutting technology, we ensure every label and box fits your specific container dimensions with 100% accuracy.`,
        },
        {
          title: 'Small-Batch Luxury',
          description: `• Launch your boutique skincare or makeup line without the burden of massive inventory. We support Flexible MOQs for premium-finish packaging.`,
        },
      ],
    },
    eco: {
      title: 'Go Green With Your Fashion Brand',
      cta: 'Learn More About Our Eco-Materials ?',
      columns: [
        {
          title: 'PCR & Forest-Based Labeling',
          kicker: '"Recycled materials, premium clarity."',
          description:
            'Maintain your brand’s aesthetic while reducing plastic waste. We offer PCR (Post-Consumer Recycled) films and Forest Film—a wood-based plastic alternative. These materials provide the crystal-clear "no-label look" beauty brands crave while remaining 100% waterproof and oil-resistant for peak performance in bathrooms and vanities.',
        },
        {
          title: 'Tree-Free & High-Texture Eco-Papers',
          kicker: '"Tactile experiences that tell a natural story."',
          description:
            'Elevate your secondary packaging with specialty stocks made from Stone, Hemp, or Citrus Waste. These tree-free alternatives offer unique textures and organic tones that resonate with eco-conscious consumers. Perfect for luxury outer boxes and perfume sleeves, they turn your packaging into a statement of environmental stewardship.',
        },
        {
          title: 'Clean Printing & Circular Finishes',
          kicker: '"Non-toxic vibrancy, fully recyclable results."',
          description:
            'Our sustainability commitment extends to every drop of ink. We use Soy-based Inks for vibrant, low-VOC printing and recommend Water-based Coatings instead of plastic lamination. This ensures your folding cartons and gift boxes remain 100% recyclable, helping your brand meet the strict green standards of global retailers like Sephora and Ulta.',
        },
      ],
    },
    caseStudy: {
      image: solutionImage('cosmetics-case.png'),
      alt: 'Retail display and reusable pouch packaging case study',
      title: 'Case Study',
      headline:
        'How We Engineered 100% Plastic-Free Reusable Pouches For Purcotton',
      intro: `For eco-conscious lifestyle brands like Purcotton, packaging must reflect their core philosophy of "Nature, Safety, and Sustainability." Traditional plastic polybags were contradicting their brand image. They needed a premium, 100% natural textile solution that not only protected their garments but also served as a highly functional, reusable travel organizer for their end consumers.`,
      quote: `ANAN PACK didn't just manufacture a bag; they engineered a sustainable packaging solution that perfectly aligns with our brand DNA. The innovative cotton mesh window solved our retail visibility issues while completely eliminating single-use plastics from our product line.`,
      attribution: 'Product Director, Purcotton',
      sections: [
        {
          title: 'The Challenge:',
          body: `Purcotton faced a critical packaging dilemma: how to eliminate plastic while maintaining retail visibility. Customers and warehouse staff needed to instantly identify the product's color and texture without opening the package—a feature usually requiring clear plastic. Furthermore, they wanted to upgrade their standard packaging into premium custom fabric pouches that consumers would actively keep and reuse.`,
        },
        {
          title: 'Our Solution:',
          bullets: [
            'As their trusted dust bag manufacturer, ANAN PACK collaborated with Purcotton’s product team to develop a hybrid "Eco-Smart" zippered pouch:',
            'Material Engineering: We selected 100% unbleached raw greige cotton. By skipping the chemical bleaching process, we minimized the environmental impact while achieving an authentic, earthy aesthetic.',
            'Design Innovation: We integrated a high-density cotton mesh visualization window on the front panel. This brilliant detail allowed instant product identification without using a single drop of plastic.',
            'Structural Versatility: We replaced standard drawstrings with a smooth, durable zipper, transforming the custom cotton dust bags into secure travel cubes available in a standardized 3-size system.',
          ],
        },
        {
          title: 'The Results:',
          bullets: [
            'Total Plastic Elimination: Successfully replaced millions of single-use plastic bags with biodegradable textile alternatives.',
            'High Brand Retention: The functional design ensures an extremely high reuse rate as travel organizers, turning the packaging into a long-term "walking advertisement" for the brand.',
            `Operational Efficiency: The clever mesh window maintained fast picking and packing efficiency in Purcotton's warehouses.`,
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
    slug: 'fashion-apparel',
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
      title: 'Why Sourcing Via ANAN PACK Is Better?',
      image: solutionImage('fashion-why.png'),
      alt: 'Pink apparel packaging gift set',
      points: [
        {
          title: 'Color Consistency',
          description: `• Factories only know their own materials. We ensure your Pantone color stays consistent across paper, fabric, plastic, and metal components. Unified brand identity, zero deviation.`,
        },
        {
          title: 'Flexible MOQ For Scalability',
          description: `• Traditional factories demand high MOQs. We aggregate orders to offer you flexible starting quantities, allowing you to test the market and scale up fast without inventory pressure.`,
        },
        {
          title: 'One Point Of Contact',
          description: `• Stop juggling 5 different factories with 5 different time zones. We manage the entire supply chain—from hang tags to mailer boxes—so you only deal with one dedicated project manager.`,
        },
        {
          title: 'Rapid Prototyping (Sampling)',
          description: `• Don't let slow sampling kill your launch date. While factories prioritize big orders, our dedicated sampling lines deliver production-quality prototypes in as little as 3-5 days. Test fast, iterate faster.`,
        },
      ],
    },
    eco: {
      title: 'Go Green With Your Fashion Brand',
      cta: 'Learn More About Our Eco-Materials ?',
      columns: [
        {
          title: 'Recycled Polyester Labels (GRS)',
          kicker: '',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
        },
        {
          title: 'FSC Certified Paper Tags',
          kicker: '',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
        },
        {
          title: 'Biodegradable Poly Bags',
          kicker: '',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
        },
      ],
    },
    caseStudy: {
      image: solutionImage('fashion-case.png'),
      alt: 'Premium foil label display for food and fashion brand case study',
      title: 'Case Study',
      headline: 'How We Engineered Premium Foil Labels For Suji & Co',
      intro: `For premium artisanal brands like Suji & Co, the packaging must communicate "natural," "pure," and "hand-made" at a single glance. They needed a sophisticated sticker packaging solution that could bridge the gap between rustic watercolor charm and modern luxury, all while surviving the demanding environments of kitchens and refrigerators.`,
      quote: `ANAN PACK completely transformed our product presentation. Their precision with gold foil and moisture-resistant materials proved exactly why they are a top-tier sticker manufacturer. The labels adhere perfectly and look like pieces of art on our jars.`,
      attribution: 'Creative Director, Suji & Co',
      sections: [
        {
          title: 'The Challenge:',
          body: `Artisanal jars and tubes present unique packaging hurdles. The brand required customized sticker labels that could adhere perfectly to small-diameter curved glass without the edges lifting (winging) over time. Furthermore, because the products are often refrigerated and handled frequently, the labels had to be oil and moisture-resistant while accurately reproducing delicate watercolor illustrations.`,
        },
        {
          title: 'Our Solution:',
          bullets: [
            'As experts in custom sticker printing, our engineering team developed a hybrid labeling solution tailored for premium retail:',
            `Advanced Material & Adhesive: We utilized a specialized permanent acrylic adhesive designed specifically for glass and plastic. Paired with a matte finish, it acts as a reliable custom waterproof sticker that won't smudge or peel in damp environments.`,
            `High-Definition Digital CMYK: To capture the artistic nuance of the fruit illustrations, we used high-resolution digital presses. This allowed us to replicate the soft watercolor textures with photographic clarity.`,
            `Luxury Foil Accents: To elevate the custom sticker labels to a luxury tier, we applied precision Gold Hot Stamping. The metallic gold creates a high-contrast "pop," instantly signaling a premium price point to the consumer.`,
          ],
        },
        {
          title: 'The Results:',
          bullets: [
            'Shelf-Ready Sophistication: The color consistency and gold foil quality remained perfectly identical across all SKUs and container sizes.',
            'Tactile Quality: The specialized matte finish gives the packaging a refined "boutique" feel, easily distinguishing it from mass-market glossy labels.',
            `Proven Durability: The labels maintain their structural integrity and strong adhesion from the retail shelf to the customer's table, ensuring lasting brand impact.`,
          ],
        },
      ],
    },
    gallery: [
      {
        image: solutionImage('fashion-gallery-2.png'),
        alt: 'Printed label sheets before application',
      },
      {
        image: solutionImage('fashion-gallery-1.png'),
        alt: 'Foil label on product jar',
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
          description: `Ultra-soft, high-definition woven labels designed for contact with skin. Certified OEKO-TEX® Standard 100, ensuring they are free from harmful substances and perfectly safe for bedding and towels.`,
        },
        {
          title: 'Double-Faced Satin Jacquard Printed',
          image: solutionImage('home-lifestyle-kit-2.png'),
          alt: 'Soft satin labels on textile products',
          description: `Using specialized inks and premium nylon or satin ribbons, our care labels are tested to remain crisp and legible through 50+ industrial or home washes.`,
        },
        {
          title: 'Heavy-Duty & Reusable Packaging',
          image: solutionImage('home-lifestyle-kit-3.png'),
          alt: 'Reusable textile packaging bundle',
          description: `From large-format PVC-free zipper bags to reinforced eco-friendly mailers. Designed to protect bulky home goods during transit while providing a reusable storage option for the end user.`,
        },
      ],
    },
    why: {
      title: 'Why Sourcing Via ANAN PACK Is Better?',
      image: solutionImage('home-lifestyle-why.png'),
      alt: 'Folded home textile packaging set with branded ribbons and zipper pouch',
      points: [
        {
          title: 'Wash-Test Guaranteed',
          description: `• We don't just print; we simulate. Our home textile labels undergo rigorous wash-cycle testing to ensure zero ink migration and no fraying, even at high temperatures.`,
        },
        {
          title: 'Compliance-Ready Law Labels',
          description: `• Navigating international textile regulations is hard. We help you design and produce "Law Labels" that meet US, EU, and Australian standards for material disclosure.`,
        },
        {
          title: 'Optimized Packaging Volume',
          description: `• We help you re-engineer your packaging to reduce "dead air." By switching to specialized vacuum-ready or flat-pack designs, we’ve helped clients reduce shipping volumes by up to 20%.`,
        },
        {
          title: 'Soft-Touch Engineering',
          description: `• For products that touch the skin, "feel" is everything. We use ultrasonic cutting for label edges to ensure they are 100% scratch-free, enhancing the user’s sleep experience.`,
        },
      ],
    },
    eco: {
      title: 'Go Green (Three Sustainable Pillars)',
      cta: 'Learn More About Our Eco-Materials ?',
      columns: [
        {
          title: 'GRS-Certified Recycled Satin & Polyester',
          kicker: '"From plastic bottles to premium ribbons."',
          description:
            'Shift to 100% recycled content for your care labels and ribbons. Our GRS-certified recycled satin offers the same silky-smooth texture as traditional materials but with a significantly lower carbon footprint, perfect for eco-luxury bedding collections.',
        },
        {
          title: 'FSC-Certified Heavyweight Hang Tags',
          kicker: '"Sustainable strength for larger products."',
          description:
            'Home goods often require larger, more durable tags. We provide high-GSM, FSC-certified cardstock that provides the structural rigidity needed for heavy drapes or rugs while proving your commitment to responsible forestry.',
        },
        {
          title: 'Biodegradable Zipper Storage Bags',
          kicker: '"Zero-waste protection for bulky items."',
          description:
            'Replace traditional vinyl bags with our compostable and biodegradable alternatives. These bags are tear-resistant and waterproof, protecting your linens from dust and moisture during the "last mile" while being fully earth-friendly.',
        },
      ],
    },
    caseStudy: {
      image: solutionImage('home-lifestyle-case.png'),
      alt: 'Home lifestyle case study image with warm interior',
      title: 'Case Study',
      headline:
        'How We Engineered High-Performance Custom Kraft Tape For Hyde & Hare & Achieved Zero-Failure Logistics',
      intro: `For premier lifestyle brands like Hyde & Hare England, the "unboxing experience" is the final and most crucial touchpoint with their global clientele. In the competitive luxury market, tape is not just a utility to seal a box; it must reflect the brand’s commitment to natural beauty, premium craftsmanship, and frictionless sustainability.`,
      quote: `ANAN PACK completely transformed our shipping logistics into a true brand asset. They engineered a custom tape that not only perfectly matches our natural luxury aesthetic but also provides unbreakable security during transit. It's the ultimate sustainable solution.`,
      attribution: 'Operations Director, Hyde & Hare England',
      sections: [
        {
          title: 'The Challenge:',
          body: `Hyde & Hare faced a significant "Brand Consistency Gap." Sealing high-end leather goods with glossy plastic tape felt cheap and compromised their eco-friendly ethos. Furthermore, standard eco-friendly tapes failed to adhere properly to their high-fiber recycled cartons, leading to peeling during international transit and risking the security of their luxury accessories.`,
        },
        {
          title: 'Our Solution:',
          bullets: [
            'ANAN PACK collaborated with the brand to engineer a 100% recyclable, premium custom printed kraft paper tape that balanced industrial-grade strength with an "Old Money" aesthetic:',
            'Material Engineering: Selected a 70gsm heavy-duty custom kraft tape base that perfectly harmonizes with their earthy brand tones while resisting tears and punctures.',
            'Chemical Innovation: Utilized a high-tack natural rubber adhesive that bonds aggressively with paper fibers, ensuring ultimate tamper-evident security in any climate.',
            'Aesthetic Precision: Applied high-definition matte black ink to eliminate traditional glare, integrating their signature branding seamlessly into the paper surface.',
          ],
        },
        {
          title: 'The Results:',
          bullets: [
            '100% Brand Alignment, turning standard shipping boxes into curated, premium gifts.',
            'Zero incidents of tape failure or compromised parcels during international transit.',
            '100% Recyclable shipping units, allowing customers to recycle the entire box effortlessly.',
            'Significant boost in "Green" customer satisfaction ratings.',
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
          title: 'Cheapening the Brand',
          description:
            'Does your current packaging fail to reflect the high value of the jewelry inside?',
        },
        {
          icon: 'sample',
          title: 'Lack Of Customization',
          description: `Tired of generic boxes that don't fit your unique design aesthetic?`,
        },
        {
          icon: 'spark',
          title: 'Durability & Elegance',
          description: `Do your luxury tags fray or lose their luster during handling and display?`,
        },
        {
          icon: 'chat',
          title: 'Counterfeit Risks',
          description: `Are you looking for subtle, high-end security features to protect your brand integrity?`,
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
          description: `Premium zinc alloy tags or heavy-duty foil-stamped labels. We offer diverse finishes—from brushed antique gold to polished chrome—to complement your jewelry’s metal tones.`,
        },
        {
          title: 'Artisanal Display & Gift Boxes',
          image: solutionImage('jewelry-luxury-kit-2.png'),
          alt: 'Luxury display and gift boxes',
          description: `Crafted from extra-thick, specialty art papers with letterpress, debossing, or silk-screen printing. These tags are designed to hold weight and add a tactile layer of luxury.`,
        },
        {
          title: 'Pouches & Premium Wraps',
          image: solutionImage('jewelry-luxury-kit-3.png'),
          alt: 'Premium jewelry pouches and cards',
          description: `Bespoke microfiber, velvet, or silk pouches and rigid gift boxes. Featuring custom-molded inserts and magnetic closures to ensure a secure and world-class unboxing ceremony.`,
        },
      ],
    },
    why: {
      title: 'Why Sourcing Via ANAN PACK Is Better (The Luxury Edge)',
      image: solutionImage('jewelry-luxury-why.png'),
      alt: 'Luxury jewelry packaging box with pouch and accessories',
      points: [
        {
          title: 'High-End Craftsmanship',
          description: `• We utilize rare techniques like multi-level embossing, micro-printing, and hand-finished assembly to ensure every piece meets "High Jewelry" standards.`,
        },
        {
          title: 'Material Selection Mastery',
          description: `• Access a library of global specialty papers, eco-certified vegan leathers, and tarnish-resistant fabrics specifically curated for the luxury market.`,
        },
        {
          title: 'Bespoke Structural Design',
          description: `• Our engineers create custom inserts and structural prototypes that protect fragile items while ensuring a perfect, "click-to-close" fit every time.`,
        },
        {
          title: 'Small-Batch Exclusive Runs',
          description: `• Luxury shouldn't require mass-production. We offer Flexible MOQs for limited-edition collections and boutique designers, allowing for true exclusivity.`,
        },
      ],
    },
    eco: {
      title: 'Go Green With Your Fashion Brand',
      cta: 'Learn More About Our Eco-Materials ?',
      columns: [
        {
          title: 'FSC-Certified Premium Art Papers',
          kicker: '"Responsibly sourced, unmistakably high-end."',
          description:
            "Choose from a wide array of FSC-certified papers with unique textures—from linen-pressed to cotton-based stocks. These materials provide a sophisticated, tactile feel while proving your brand’s commitment to preserving the world's forests.",
        },
        {
          title: 'Vegan Leather & Eco-Suede Pouches',
          kicker: '"Cruelty-free luxury for the modern era."',
          description:
            'Replace traditional animal skins with our high-performance vegan leathers and recycled microfiber suedes. These materials offer the same buttery softness and durability as premium hide but are 100% cruelty-free and more environmentally sustainable.',
        },
        {
          title: 'Recyclable Metal & Mineral Inks',
          kicker: `"Luster that doesn't harm the earth."`,
          description:
            'We utilize lead-free metallic alloys for our hardware and soy-based, mineral-safe inks for our printing. This ensures that even your most shimmering gold-foil packaging remains non-toxic and compliant with international environmental standards.',
        },
      ],
    },
    caseStudy: {
      image: solutionImage('jewelry-luxury-case.png'),
      alt: 'Pink luxury jewelry gift packaging case study',
      title: 'Case Study',
      headline:
        'How We Engineered High-Performance Custom Kraft Tape For Hyde & Hare & Achieved Zero-Failure Logistics',
      intro: `For premier lifestyle brands like Hyde & Hare England, the "unboxing experience" is the final and most crucial touchpoint with their global clientele. In the competitive luxury market, tape is not just a utility to seal a box; it must reflect the brand’s commitment to natural beauty, premium craftsmanship, and frictionless sustainability.`,
      quote: `ANAN PACK completely transformed our shipping logistics into a true brand asset. They engineered a custom tape that not only perfectly matches our natural luxury aesthetic but also provides unbreakable security during transit. It's the ultimate sustainable solution.`,
      attribution: 'Operations Director, Hyde & Hare England',
      sections: [
        {
          title: 'The Challenge:',
          body: `Hyde & Hare faced a significant "Brand Consistency Gap." Sealing high-end leather goods with glossy plastic tape felt cheap and compromised their eco-friendly ethos. Furthermore, standard eco-friendly tapes failed to adhere properly to their high-fiber recycled cartons, leading to peeling during international transit and risking the security of their luxury accessories.`,
        },
        {
          title: 'Our Solution:',
          bullets: [
            'ANAN PACK collaborated with the brand to engineer a 100% recyclable, premium custom printed kraft paper tape that balanced industrial-grade strength with an "Old Money" aesthetic:',
            'Material Engineering: Selected a 70gsm heavy-duty custom kraft tape base that perfectly harmonizes with their earthy brand tones while resisting tears and punctures.',
            'Chemical Innovation: Utilized a high-tack natural rubber adhesive that bonds aggressively with paper fibers, ensuring ultimate tamper-evident security in any climate.',
            'Aesthetic Precision: Applied high-definition matte black ink to eliminate traditional glare, integrating their signature branding seamlessly into the paper surface.',
          ],
        },
        {
          title: 'The Results:',
          bullets: [
            '100% Brand Alignment, turning standard shipping boxes into curated, premium gifts.',
            'Zero incidents of tape failure or compromised parcels during international transit.',
            '100% Recyclable shipping units, allowing customers to recycle the entire box effortlessly.',
            'Significant boost in "Green" customer satisfaction ratings.',
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
