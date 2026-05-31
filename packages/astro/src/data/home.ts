import { getLocalImage } from '../lib/local-images';

const homeImage = (fileName: string) =>
  getLocalImage(`/images/home/${fileName}`);

export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/#products' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact Us', href: '/contact-us' },
];

export const solutionMenuItems = [
  {
    title: 'For Fashion & Apparel',
    href: '/solutions/fashion-apparel',
    tone: 'tan',
  },
  {
    title: 'For Cosmetics & Beauty',
    href: '/solutions/cosmetics-beauty',
    tone: 'light',
  },
  {
    title: 'For Home & Lifestyle',
    href: '/solutions/home-lifestyle',
    tone: 'plain',
  },
  {
    title: 'For Jewelry & Luxury',
    href: '/solutions/jewelry-luxury',
    tone: 'plain',
  },
] as const;

export const serviceMenuItems = [
  {
    title: 'Services',
    href: '/services',
    tone: 'tan',
  },
  {
    title: 'Services FAQ',
    href: '/services/faq',
    tone: 'plain',
  },
] as const;

export const valueProps = [
  {
    icon: {
      src: homeImage('icons/icon-low-moq.svg'),
      alt: '',
    },
    title: 'Flexible Low MOQ',
    description:
      'Start from 100 pcs. Grow your brand without inventory pressure.',
  },
  {
    icon: {
      src: homeImage('icons/icon-rapid-sampling.svg'),
      alt: '',
    },
    title: '72h Rapid Sampling',
    description:
      'Samples in 3 days. See your design in reality faster than ever.',
  },
  {
    icon: {
      src: homeImage('icons/icon-factory-pricing.svg'),
      alt: '',
    },
    title: 'Factory-Direct Pricing',
    description:
      'No middleman. Save up to 30% with our consolidated supply chain.',
  },
  {
    icon: {
      src: homeImage('icons/icon-eco-certified.svg'),
      alt: '',
    },
    title: 'Eco-Certified Materials',
    description: 'FSC and biodegradable options for conscious brands.',
  },
] as const;

export const industries = [
  {
    title: 'Fashion & Apparel',
    image: homeImage('industry-fashion.png'),
    alt: 'Fashion models wearing apparel for brand packaging use cases',
    href: '/solutions/fashion-apparel',
  },
  {
    title: 'Home & Lifestyle',
    image: homeImage('industry-home.png'),
    alt: 'Home products arranged for packaging solutions',
    href: '/solutions/home-lifestyle',
  },
  {
    title: 'Leather & Accessories',
    image: homeImage('industry-luxury.png'),
    alt: 'Leather accessories and premium trim packaging',
    href: '/solutions/jewelry-luxury',
  },
  {
    title: 'Premium Packaging',
    image: homeImage('industry-gift.png'),
    alt: 'Green premium gift boxes and bags',
    href: '/solutions/cosmetics-beauty',
  },
];

export const products = [
  {
    title: 'Woven Labels',
    image: homeImage('product-woven-labels.png'),
    alt: 'Woven labels with stitched brand details',
    href: '/products/labels',
  },
  {
    title: 'Patches',
    image: homeImage('product-patches.png'),
    alt: 'Custom embroidered patch samples',
    href: '/products/patches',
  },
  {
    title: 'Ribbons',
    image: homeImage('product-ribbons.png'),
    alt: 'Printed ribbon rolls for packaging',
    href: '/products/ribbon',
  },
  {
    title: 'Tissue Paper',
    image: homeImage('product-tissue.png'),
    alt: 'Pink custom printed tissue paper',
    href: '/products/tissue-paper',
  },
  {
    title: 'Packaging Tape',
    image: homeImage('product-packaging-tape.png'),
    alt: 'Printed packaging tape and labels',
    href: '/products/tape',
  },
  {
    title: 'Drawstring Bags',
    image: homeImage('product-drawstring.png'),
    alt: 'Cotton drawstring bag with printed logo',
    href: '/products/bag',
  },
  {
    title: 'Hang Tags',
    image: homeImage('product-hang-tags.png'),
    alt: 'Red garment with custom hang tag',
    href: '/products/hanging-tag',
  },
  {
    title: 'Stickers',
    image: homeImage('product-stickers.png'),
    alt: 'Minimal sticker and label sheet',
    href: '/products/sticker',
  },
];

export const productMenuItems = [
  {
    title: 'Labels',
    image: homeImage('menu-labels.png'),
    alt: 'Custom woven labels',
    href: '/products/labels',
  },
  {
    title: 'Patches',
    image: homeImage('menu-patches.png'),
    alt: 'Custom embroidered patches',
    href: '/products/patches',
  },
  {
    title: 'Ribbon',
    image: homeImage('menu-ribbon.png'),
    alt: 'Printed ribbon rolls',
    href: '/products/ribbon',
  },
  {
    title: 'Tissue Paper',
    image: homeImage('menu-tissue-paper.png'),
    alt: 'Custom printed tissue paper',
    href: '/products/tissue-paper',
  },
  {
    title: 'Tape',
    image: homeImage('menu-tape.png'),
    alt: 'Custom packaging tape',
    href: '/products/tape',
  },
  {
    title: 'Bag',
    image: homeImage('menu-bag.png'),
    alt: 'Custom drawstring bag',
    href: '/products/bag',
  },
  {
    title: 'Hanging Tag',
    image: homeImage('menu-hanging-tag.png'),
    alt: 'Custom hang tag attached to apparel',
    href: '/products/hanging-tag',
  },
  {
    title: 'Sticker',
    image: homeImage('menu-sticker.png'),
    alt: 'Custom printed stickers',
    href: '/products/sticker',
  },
] as const;

export const trustReasons = [
  {
    icon: {
      src: homeImage('icons/icon-trust-qc.svg'),
      alt: '',
    },
    title: 'Boots-On-The-Ground QC',
    description:
      'Factories Make Mistakes. We Catch Them. Our Engineers Inspect Your Tags, Labels, And Bags On-Site To Ensure Zero Defects Before Shipping.',
  },
  {
    icon: {
      src: homeImage('icons/icon-trust-color-match.svg'),
      alt: '',
    },
    title: 'Perfect Color Match',
    description:
      'Nothing Is Worse Than Mismatched Colors. We Ensure Your Woven Label Blue Matches Your Hang Tag Blue Perfectly Across Different Materials.',
  },
  {
    icon: {
      src: homeImage('icons/icon-trust-kitting.svg'),
      alt: '',
    },
    title: 'Kitting & Stringing',
    description:
      'Save Your Time. We Pre-String Your Hang Tags, Pack Labels In Sets, Or Insert Items Into Biodegradable Bags For You. Retail-Ready Arrival.',
  },
] as const;

export const logos = [
  homeImage('logo-01.png'),
  homeImage('logo-03.png'),
  homeImage('logo-04.png'),
  homeImage('logo-05.png'),
  homeImage('logo-06.png'),
  homeImage('logo-07.png'),
  homeImage('logo-08.png'),
  homeImage('logo-09.png'),
  homeImage('logo-10-twelvelittle.webp'),
  homeImage('logo-11-sanrio.webp'),
];

export const certifications = [
  {
    title: 'FSC',
    image: homeImage('cert-fsc.png'),
    alt: 'FSC certification mark',
  },
  {
    title: 'OEKO-TEX Standard 100',
    image: homeImage('cert-oeko.png'),
    alt: 'OEKO-TEX Standard 100 certification mark',
  },
  {
    title: 'Global Recycled Standard',
    image: homeImage('cert-grs.png'),
    alt: 'Global Recycled Standard certification mark',
  },
  {
    title: 'ISO 9001',
    image: homeImage('cert-iso.png'),
    alt: 'ISO 9001 certification mark',
  },
];

export const testimonials = [
  {
    quote:
      'Communication is very easy. They understand my English! And the prices are clear. Very important.',
    name: 'Marco, olive oil producer (Italy)',
    date: '23-11-2025',
    usedFor: 'Hang Tags + Labels',
    icon: homeImage('icons/icon-olive-oil.svg'),
  },
  {
    quote:
      "Finally, a supplier that doesn't need things explained ten times. They just get it. Good on ya.",
    name: 'Tom, pet accessories',
    date: '23-11-2025',
    usedFor: 'Product Labels + Stickers',
    icon: homeImage('icons/icon-pet.svg'),
  },
  {
    quote:
      "They're terribly efficient. Even the time difference hasn't been a bother. Cheers for that!",
    name: 'Gemma, stationery subscription',
    date: '23-11-2025',
    usedFor: 'Packaging + Stickers',
    icon: homeImage('icons/icon-stationery.svg'),
  },
  {
    quote:
      "They're not just an order-taker. They suggested a small design tweak that cut our shipping cost by 15%. That's money right back in our pocket.",
    name: 'Devin, e-commerce apparel',
    date: '23-11-2025',
    usedFor: 'Hang Tags + Care Labels',
    icon: homeImage('icons/icon-apparel.svg'),
  },
  {
    quote:
      "The 'one-stop-shop' model is real. We used to manage 5 different suppliers; now we manage one. The efficiency gains are massive.",
    name: 'Olivia C., Operations Director,\nBeauty Brand',
    date: '23-11-2025',
    usedFor: 'Labels + Bottle Neck Tags',
    icon: homeImage('icons/icon-beauty.svg'),
  },
  {
    quote:
      "Frankly, I've taken all the time I saved on sourcing and put it back into growing the business. The process is brutally simple, and honestly, it costs the same. Makes you wonder what you were doing before.",
    name: 'Tom, Owner of a Craft Brewery',
    date: '23-11-2025',
    usedFor: 'Labels + Packaging Tape',
    icon: homeImage('icons/icon-brewery.svg'),
  },
];

export const metrics = [
  {
    value: '500+',
    label: 'Brands Served',
    icon: homeImage('icons/icon-brands-served.svg'),
  },
  {
    value: '50+',
    label: 'Countries Shipped',
    icon: homeImage('icons/icon-countries.svg'),
  },
  {
    value: '98%',
    label: 'Reorder Rate',
    icon: homeImage('icons/icon-reorder.svg'),
  },
  {
    value: 'Zero',
    label: 'Quality Claims',
    icon: homeImage('icons/icon-quality.svg'),
  },
];
