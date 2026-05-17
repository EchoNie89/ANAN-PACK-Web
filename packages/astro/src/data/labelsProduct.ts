export interface LabelImageItem {
  title: string;
  image: string;
  alt: string;
  description?: string;
}

export interface LabelTextBlock {
  title: string;
  items: string[];
}

export interface LabelProcessStep {
  title: string;
  description: string;
  icon:
    | 'concept'
    | 'designing'
    | 'manufacturing'
    | 'testing'
    | 'packaging'
    | 'guaranteeing';
}

export interface LabelShowcaseGroup {
  title: string;
  cards: LabelImageItem[];
}

export const labelIntroText = `Custom labels are essential branding elements used in garments, accessories, and textile products. They display brand identity, product information, and care instructions while enhancing the professional appearance of clothing.
Common types of labels include woven labels, printed labels, heat transfer labels, and leather labels. Each type offers different advantages in durability, texture, and application.
For apparel brands, labels play a critical role in brand recognition and product quality perception.`;

export const labelShowcaseGroups: LabelShowcaseGroup[] = [
  {
    title: 'Woven Labels',
    cards: [
      {
        title: 'Damask Woven Labels',
        image: '/images/home/product-woven-labels.png',
        alt: 'Damask woven labels with stitched logo details',
      },
      {
        title: 'Satin Woven Labels',
        image: '/images/solutions/home-lifestyle-kit-2.png',
        alt: 'Satin woven label samples',
      },
      {
        title: 'Taffeta Woven Labels',
        image: '/images/solutions/fashion-gallery-3.png',
        alt: 'Taffeta woven label detail',
      },
      {
        title: 'High Density Woven Labels',
        image: '/images/home/menu-labels.png',
        alt: 'High density woven label samples',
      },
    ],
  },
  {
    title: 'Printed Labels',
    cards: [
      {
        title: 'Satin Printed Labels',
        image: '/images/solutions/home-lifestyle-kit-2.png',
        alt: 'Satin printed label material',
      },
      {
        title: 'Cotton Printed Labels',
        image: '/images/solutions/fashion-kit-2.png',
        alt: 'Cotton printed clothing label cards',
      },
      {
        title: 'Nylon Care Labels',
        image: '/images/solutions/home-lifestyle-gallery-2.png',
        alt: 'Nylon care label roll',
      },
      {
        title: 'Color Printed Labels',
        image: '/images/solutions/cosmetics-gallery-1.png',
        alt: 'Color printed label samples',
      },
    ],
  },
  {
    title: 'Special Labels',
    cards: [
      {
        title: 'Leather Labels',
        image: '/images/home/product-patches.png',
        alt: 'Leather label and patch samples',
      },
      {
        title: 'Rubber Labels',
        image: '/images/solutions/jewelry-luxury-kit-1.png',
        alt: 'Rubber label and accessory trim',
      },
      {
        title: 'Silicone Labels',
        image: '/images/solutions/jewelry-luxury-gallery-2.png',
        alt: 'Silicone label sample',
      },
      {
        title: 'PVC Labels',
        image: '/images/solutions/cosmetics-kit-2.png',
        alt: 'PVC label style sample',
      },
    ],
  },
  {
    title: 'Eco & Cotton Labels',
    cards: [
      {
        title: 'Recycled Labels',
        image: '/images/blog/article-fsc-popular.jpg',
        alt: 'Recycled material label reference',
      },
      {
        title: 'Organic Cotton Labels',
        image: '/images/solutions/home-lifestyle-kit-3.png',
        alt: 'Organic cotton label sample',
      },
      {
        title: 'Cotton Labels',
        image: '/images/solutions/home-lifestyle-kit-2.png',
        alt: 'Cotton fabric labels for apparel',
      },
      {
        title: 'Natural Fabric Labels',
        image: '/images/solutions/home-lifestyle-kit-1.png',
        alt: 'Natural fabric label samples',
      },
    ],
  },
  {
    title: 'Brand Label Styles',
    cards: [
      {
        title: 'Logo Labels',
        image: '/images/home/menu-labels.png',
        alt: 'Logo label samples',
      },
      {
        title: 'Patch Labels',
        image: '/images/home/menu-patches.png',
        alt: 'Patch label samples',
      },
      {
        title: 'Woven Badges',
        image: '/images/home/product-patches.png',
        alt: 'Woven badge and label samples',
      },
      {
        title: 'Main Labels',
        image: '/images/home/product-woven-labels.png',
        alt: 'Main apparel label samples',
      },
    ],
  },
  {
    title: 'Application Labels',
    cards: [
      {
        title: 'Neck Labels',
        image: '/images/solutions/fashion-why.png',
        alt: 'Neck label applied on apparel',
      },
      {
        title: 'Size Labels',
        image: '/images/solutions/home-lifestyle-gallery-1.png',
        alt: 'Small size labels for garments',
      },
      {
        title: 'Hem Labels',
        image: '/images/solutions/fashion-gallery-4.png',
        alt: 'Small hem label on garment edge',
      },
      {
        title: 'Care Labels',
        image: '/images/solutions/home-lifestyle-gallery-2.png',
        alt: 'Care instruction labels for garments',
      },
    ],
  },
  {
    title: 'Backing & Fold Options',
    cards: [
      {
        title: 'Iron-on Labels',
        image: '/images/solutions/cosmetics-gallery-4.png',
        alt: 'Iron-on label sample',
      },
      {
        title: 'Adhesive Labels',
        image: '/images/home/product-stickers.png',
        alt: 'Adhesive label and sticker sheet',
      },
      {
        title: 'Loop Labels',
        image: '/images/solutions/fashion-kit-3.png',
        alt: 'Loop fold label sample',
      },
      {
        title: 'Packaging Labels',
        image: '/images/home/product-packaging-tape.png',
        alt: 'Packaging label and tape sample',
      },
    ],
  },
];

export const labelApplicationItems: LabelImageItem[] = [
  {
    title: 'Fashion Apparel',
    description: 'T-shirts, dresses, jackets, denim, and casual wear.',
    image: '/images/solutions/fashion-gallery-1.png',
    alt: 'Fashion apparel label applied near a garment neckline',
  },
  {
    title: 'Sportswear & Activewear',
    description: 'Comfortable tagless labels and durable woven branding.',
    image: '/images/solutions/fashion-gallery-3.png',
    alt: 'Sportswear garment with woven brand label',
  },
  {
    title: 'Baby & Kids Clothing',
    description: 'Soft labels designed for sensitive skin.',
    image: '/images/solutions/home-lifestyle-kit-1.png',
    alt: 'Soft fabric labels for baby and kids clothing',
  },
  {
    title: 'Bags & Accessories',
    description: 'Brand labels for backpacks, hats, and handbags.',
    image: '/images/solutions/home-lifestyle-gallery-2.png',
    alt: 'Label applied inside a bag or accessory',
  },
  {
    title: 'Home Textiles',
    description: 'Labels for bedding, towels, cushions, and fabric products.',
    image: '/images/home/menu-labels.png',
    alt: 'Woven labels for home textile products',
  },
];

export const labelCustomizationImages: LabelImageItem[] = [
  {
    title: 'Leather and woven label materials',
    image: '/images/home/product-patches.png',
    alt: 'Leather and woven label materials on denim',
  },
  {
    title: 'Colorful printed label materials',
    image: '/images/solutions/cosmetics-gallery-1.png',
    alt: 'Colorful printed fabric label materials',
  },
  {
    title: 'Square woven label materials',
    image: '/images/home/product-woven-labels.png',
    alt: 'Square woven label materials on denim',
  },
  {
    title: 'Cartoon woven label materials',
    image: '/images/solutions/fashion-kit-2.png',
    alt: 'Cartoon woven label material samples',
  },
  {
    title: 'High density woven materials',
    image: '/images/home/menu-labels.png',
    alt: 'High density woven material labels',
  },
  {
    title: 'Cotton printed label materials',
    image: '/images/solutions/home-lifestyle-kit-2.png',
    alt: 'Cotton printed label materials',
  },
];

export const labelCustomizationBlocks: LabelTextBlock[] = [
  {
    title: '1. Woven Labels',
    items: [
      'Focus: Durability, high-end feel, intricate detail.',
      'Damask Woven Labels',
      'The industry standard: The most popular choice for high-end apparel. Using high-density polyester yarns, we achieve incredibly fine details for complex logos.',
      'Best For: Neck labels, suit branding, and luxury streetwear.',
      'Satin Woven Labels',
      'Luxury sheen: Characterized by a smooth, glossy surface and soft edges. It adds a premium, high-luster look to your garments.',
      'Best For: Bridal wear, lingerie, and boutique designer brands.',
      'Taffeta Woven Labels',
      "Durable and functional: A tighter weave with a slightly stiffer feel. It's cost-effective and highly durable for outdoor gear.",
      'Best For: Winter jackets, bags, and workwear.',
    ],
  },
  {
    title: '2. Printed Labels',
    items: [
      'Focus: Skin-friendliness, vivid colors, compliance.',
      'Cotton Printed Labels',
      "Nature's touch: Made from 100% natural cotton. These labels are breathable, hypoallergenic, and perfect for eco-conscious brands.",
      'Best For: Baby clothing, organic fashion, and home textiles.',
      'Satin & Polyester Printed Labels',
      "Silky soft: Offers a luxurious feel against the skin. We use high-grade inks that won't fade or irritate, even after 50+ washes.",
      'Best For: Underwear, sleepwear, and premium bedding.',
      'Nylon Taffeta Care Labels',
      'The information carrier: A paper-like texture that provides crisp, clear printing for small fonts and international wash symbols.',
      'Best For: Compliance labeling for all garment types.',
    ],
  },
  {
    title: '3. Specialty & Synthetic Materials',
    items: [
      'Focus: Modern aesthetics, weather resistance, uniqueness.',
      'TPU & Clear Labels',
      'Minimalist and modern: Waterproof, oil-proof, and soft. Available in clear or frosted finishes for a futuristic look.',
      'Best For: Swimwear, activewear, and raincoats.',
      'Leather & PU Labels',
      'The rugged look: Choose genuine leather for premium heritage or PU for a vegan-friendly, cost-effective alternative. Supports debossing and foil stamping.',
      'Best For: Denim, bags, hats, and footwear.',
      '3D PVC & Silicone Labels',
      'Tactile impact: Create a bold 3D effect. These labels are indestructible and stand out on heavy-duty fabrics.',
      'Best For: Sports gear, tactical apparel, and outerwear accessories.',
    ],
  },
  {
    title: '4. Heat Transfer Labels',
    items: [
      'Focus: Zero-friction, tagless comfort.',
      'Tagless Logo Transfers',
      "Maximum comfort: Eliminates the itchy feeling of traditional labels. Our 3D silicone and reflective transfers provide high-stretch durability that won't crack.",
      'Best For: T-shirts, yoga wear, and professional sportswear.',
    ],
  },
];

export const labelFoldingOptionImages: LabelImageItem[] = [
  {
    title: 'Straight cut label options',
    image: '/images/home/menu-labels.png',
    alt: 'Straight cut woven label options',
  },
  {
    title: 'Center fold label options',
    image: '/images/solutions/home-lifestyle-kit-2.png',
    alt: 'Center fold label options',
  },
  {
    title: 'End fold label options',
    image: '/images/solutions/home-lifestyle-kit-1.png',
    alt: 'End fold label options',
  },
  {
    title: 'Manhattan fold label options',
    image: '/images/solutions/fashion-kit-1.png',
    alt: 'Manhattan fold label options',
  },
  {
    title: 'Loop fold label options',
    image: '/images/solutions/fashion-kit-3.png',
    alt: 'Loop fold label options',
  },
  {
    title: 'Custom size and shape label options',
    image: '/images/solutions/fashion-gallery-4.png',
    alt: 'Custom label size and shape options',
  },
];

export const labelFoldingIntro =
  'Different garments require different label folding structures. We offer multiple folding styles to ensure your labels fit perfectly inside clothing while maintaining a clean and professional appearance.';

export const labelFoldingBlocks: LabelTextBlock[] = [
  {
    title: 'Straight Cut Labels',
    items: [
      'Features: Flat labels with clean edges that are sewn directly onto garments.',
      'Best For: Minimalist branding and small labels.',
    ],
  },
  {
    title: 'Center Fold Labels',
    items: [
      'Features: Folded in the middle so both sides can display information such as logo and size.',
      'Best For: Neck labels and main brand labels.',
    ],
  },
  {
    title: 'End Fold Labels',
    items: [
      'Features: Both sides are folded under, allowing the label to be sewn neatly into seams.',
      'Best For: Apparel labels and side seam labels.',
    ],
  },
  {
    title: 'Manhattan Fold Labels',
    items: [
      'Features: A premium folding style where both sides fold back behind the label.',
      'Best For: High-end clothing brands and fashion collections.',
    ],
  },
  {
    title: 'Loop Fold Labels',
    items: [
      'Features: Folded to create a loop, allowing additional information to be displayed inside.',
      'Best For: Care labels and multi-language garment labels.',
    ],
  },
];

export const labelSizeShapeIntro =
  'All of our custom clothing labels are fully made to order. Brands can choose the exact size and shape to match their product design and brand identity.';

export const labelSizeShapeBlocks: LabelTextBlock[] = [
  {
    title: 'Custom Sizes',
    items: [
      'Features: Labels can be produced in any width and length according to your garment requirements.',
      'Best For: Brand labels, size labels, and care labels.',
    ],
  },
  {
    title: 'Standard Shapes',
    items: [
      'Features: Classic shapes including rectangular and square labels for easy sewing and clean presentation.',
      'Best For: Most apparel and textile applications.',
    ],
  },
  {
    title: 'Die-Cut Shapes',
    items: [
      'Features: Custom die-cut labels designed in unique shapes to create a distinctive brand look.',
      "Best For: Fashion brands, children's wear, and creative packaging.",
    ],
  },
  {
    title: 'Rounded Corners',
    items: [
      'Features: Smooth rounded edges that improve comfort and reduce irritation.',
      'Best For: Neck labels and inner garment labels.',
    ],
  },
];

export const labelStyleItems: LabelImageItem[] = [
  {
    title: 'End Fold Labels',
    image: '/images/solutions/home-lifestyle-kit-1.png',
    alt: 'End fold clothing labels',
  },
  {
    title: 'Center Fold Labels',
    image: '/images/solutions/home-lifestyle-kit-2.png',
    alt: 'Center fold label samples',
  },
  {
    title: 'Miter Fold Labels',
    image: '/images/solutions/fashion-kit-1.png',
    alt: 'Miter fold apparel labels',
  },
  {
    title: 'Loop Fold Labels',
    image: '/images/solutions/fashion-kit-3.png',
    alt: 'Loop fold label samples',
  },
  {
    title: 'Straight Cut Labels',
    image: '/images/home/menu-labels.png',
    alt: 'Straight cut woven labels',
  },
  {
    title: 'Roll Labels',
    image: '/images/solutions/fashion-gallery-4.png',
    alt: 'Roll label production sample',
  },
];

export const labelStyleBlocks: LabelTextBlock[] = [
  {
    title: 'Woven Label Styles',
    items: [
      'Woven labels are durable, washable, and ideal for long-term apparel branding. They are commonly used as neck labels, main labels, size labels, hem labels, and decorative tabs.',
      'Damask woven labels are recommended when the logo has fine details. Satin woven labels create a smoother surface and a softer handfeel.',
    ],
  },
  {
    title: 'Printed Label Styles',
    items: [
      'Printed labels work well for care instructions, composition information, washing symbols, and multi-language content.',
      'Satin, cotton, polyester, and nylon printing bases can be selected according to garment category, washing requirement, and target price.',
    ],
  },
  {
    title: 'Special Label Styles',
    items: [
      'Leather labels, rubber labels, silicone labels, heat transfer labels, and embossed labels create stronger visual and tactile identity.',
      'These options are often used for denim, caps, bags, outdoor apparel, footwear, and accessory collections.',
    ],
  },
];

export const labelProcessSteps: LabelProcessStep[] = [
  {
    title: 'Concept',
    description:
      'Collaborate With Our Sourcing Experts To Define Your Brand DNA Through The Perfect Choice Of Eco-Friendly Materials And Premium Finishing Options.',
    icon: 'concept',
  },
  {
    title: 'Designing',
    description:
      'We Provide Technical Design Audits And Rapid Prototyping To Ensure Your Artwork Translates Perfectly Onto Your Custom Hang Tags And Labels.',
    icon: 'designing',
  },
  {
    title: 'Manufacturing',
    description:
      'High-Precision Production Managed Through Our Audited Factory Pool, Offering The Flexibility Of Low MOQs And Stable Lead Times For Your Collections.',
    icon: 'manufacturing',
  },
  {
    title: 'Testing',
    description:
      'Our Strict QC Team Acts As Your On-Site Representative, Verifying Color Accuracy, Material Durability, And Craftsmanship To Meet Global Premium Standards.',
    icon: 'testing',
  },
  {
    title: 'Packaging',
    description:
      'Secure, Professional Packaging With Combined Shipment Options To Consolidate All Your Branding Elements-Tags, Labels, And Bags-Into One Seamless Delivery.',
    icon: 'packaging',
  },
  {
    title: 'Guaranteeing',
    description:
      'We Offer A Comprehensive Quality Guarantee And Dedicated After-Sales Support, Standing By Our Commitment As Your Trusted Supply Chain Partner.',
    icon: 'guaranteeing',
  },
];

export const labelWhyItems: Array<LabelImageItem & { description: string }> = [
  {
    title: 'Low MOQ For Startup Brands',
    description:
      'Start with a small test order, confirm the label handfeel, then scale into bulk production when your collection is ready.',
    image: '/images/services/product-development.png',
    alt: 'Team reviewing packaging and label samples',
  },
  {
    title: 'One-stop Customization',
    description:
      'Match woven labels, care labels, size labels, hang tags, stickers, bags, and packaging trims in one managed workflow.',
    image: '/images/services/quality.png',
    alt: 'Packaging customization desk with samples',
  },
  {
    title: 'Strict Quality Control',
    description:
      'We check logo clarity, color tolerance, cutting, folding, backing, packing, and final shipment details before dispatch.',
    image: '/images/services/warehouse-assembly.png',
    alt: 'Quality control and packing workflow',
  },
];

export const labelCaseStudy = {
  title: 'How We Engineered 100% Plastic-Free Reusable Pouches For Purcotton',
  image: '/images/products/labels/image-10.png',
  alt: 'Fashion apparel brand storefront reference for custom woven label case study',
  description:
    'For eco-conscious lifestyle brands like Purcotton, packaging must reflect their core philosophy of "Nature, Safety, and Sustainability." Traditional plastic polybags were contradicting their brand image. They needed a premium, 100% natural textile solution that not only protected their garments but also served as a highly functional, reusable travel organizer for their end consumers.',
  quote:
    "SENYE didn't just manufacture a bag; they engineered a sustainable packaging solution that perfectly aligns with our brand DNA. The innovative cotton mesh window solved our retail visibility issues while completely eliminating single-use plastics from our product line.",
  quoteAuthor: 'Product Director, Purcotton',
  challenge:
    "Purcotton faced a critical packaging dilemma: how to eliminate plastic while maintaining retail visibility. Customers and warehouse staff needed to instantly identify the product's color and texture without opening the package—a feature usually requiring clear plastic. Furthermore, they wanted to upgrade their standard packaging into premium custom fabric pouches that consumers would actively keep and reuse.",
  solutionIntro:
    "As their trusted dust bag manufacturer, SENYE collaborated with Purcotton’s product team to develop a hybrid 'Eco-Smart' zippered pouch:",
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
    {
      image: '/images/products/labels/image 16.png',
      // alt: 'White damask woven label sample with GUUKA-style branding',
    },
    {
      image: '/images/products/labels/image 16-1.png',
      // alt: 'Close-up custom woven label samples with textured white base',
    },
    {
      image: '/images/products/labels/image 16-2.png',
      // alt: 'Close-up custom woven label samples with textured white base',
    },
    {
      image: '/images/products/labels/image 16-3.png',
      // alt: 'Close-up custom woven label samples with textured white base',
    },
  ],
};

export const labelFaqs = [
  {
    question: 'Q1: What types of custom labels do you offer?',
    answer:
      'We provide a wide range of custom clothing labels, including woven labels, printed labels, heat transfer labels, leather labels, and PVC labels. Each type is suitable for different garments and branding needs.',
  },
  {
    question: 'Q2: What is the minimum order quantity for custom labels?',
    answer:
      'Our minimum order quantity usually starts from 500 pieces, depending on the label type, material, and production process. Smaller trial orders may also be possible for certain label styles.',
  },
  {
    question: 'Q3: What materials are available for clothing labels?',
    answer:
      'We offer various materials such as damask, satin, cotton, polyester, nylon, leather, and PVC. The material choice depends on the garment type, durability requirements, and brand positioning.',
  },
  {
    question: 'Q4: Can you match our brand colors?',
    answer:
      'Yes. We can provide Pantone color matching to ensure your labels accurately represent your brand identity. This is especially important for woven labels and printed labels used in fashion branding.',
  },
  {
    question: 'Q5: What file format should I send for the label design?',
    answer:
      'Vector files such as AI, EPS, or PDF are preferred for the best production results. If you only have a JPG or PNG file, our design team can also help convert it into a printable format.',
  },
  {
    question: 'Q6: How long does it take to produce custom labels?',
    answer:
      'Production usually takes 7–12 working days after artwork confirmation. Sample production may take an additional few days depending on the label type.',
  },
  {
    question: 'Q7: Can I order samples before mass production?',
    answer:
      'Yes. We can produce pre-production samples so you can check the material, color, and size before starting bulk production.',
  },
  {
    question: 'Q8: What folding options are available for woven labels?',
    answer:
      'Common folding options include center fold, end fold, straight cut, loop fold, and Manhattan fold. The folding style depends on how the label will be attached to the garment.',
  },
  {
    question:
      'Q9: What is the difference between woven labels and printed labels?',
    answer:
      'Woven labels are created by weaving threads together, making them highly durable and suitable for brand logos. Printed labels are printed directly onto materials such as satin or cotton, which makes them ideal for care instructions and detailed text.',
  },
  {
    question: 'Q10: Do you ship custom labels internationally?',
    answer:
      'Yes. We regularly ship custom clothing labels worldwide to apparel brands, designers, and garment manufacturers in North America, Europe, and other global markets.',
  },
];
