import type { SiteImageSource } from '../lib/local-images';
import { getLocalImage } from '../lib/local-images';

const base = '/images/services';
const serviceImage = (fileName: string) => getLocalImage(`${base}/${fileName}`);

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceSection {
  kicker: string;
  title: string;
  description: string;
  image: SiteImageSource;
  alt: string;
  imageSide: 'left' | 'right';
  features: ServiceFeature[];
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const serviceHero = {
  title: 'End-to-End Packaging Supply Chain Management',
  description:
    "We go beyond manufacturing. From sourcing the right materials to consolidating your shipment, we handle the complexities so you don't have to.",
  image: serviceImage('hero-logistics-figma-layer.png'),
  alt: 'Cargo ship, train, ferry, containers, and airplane in a logistics scene',
  cta: 'Talk To A Specialist',
};

export const sourcingComparison = {
  title: 'How We Simplify Your Sourcing',
  traditional: {
    title: 'Traditional Services Mode',
    tag: 'Fragmented & Time-Consuming',
    summary: 'More suppliers, more communication, more uncertainty.',
    points: [
      'Multiple suppliers for different items',
      'No unified quality control standard',
      'Separate payments and logistics handling',
      'Variable lead times and coordination issues',
      'Higher risk in production and delivery',
    ],
  },
  managed: {
    title: 'Our Services Mode',
    tag: 'Integrated & Fully Managed',
    label: 'Recommended Model',
    summary: 'One team manages the complexity behind your supply chain.',
    points: [
      'One goal of contact for all categories',
      'Verified factory network with unified standards',
      'Consolidated shipment and faster delivery',
      'Clear communication and less response',
      'Stable quality control and reliable timelines',
    ],
  },
  note: 'One Point of Contact. Complete Supply Chain Control.',
};

export const serviceSections: ServiceSection[] = [
  {
    kicker: 'SERVICE 01',
    title: 'Strategic Sourcing & Design',
    description:
      'We help brands build the right packaging direction from the start by aligning materials, suppliers, and design thinking with brand goals.',
    image: serviceImage('sourcing.png'),
    alt: 'Hands reviewing custom packaging materials and garment trims',
    imageSide: 'left',
    features: [
      {
        title: 'Multi-Material Capabilities:',
        description:
          'We identify suitable materials and sourcing options based on your product, positioning, and budget.',
      },
      {
        title: 'Cost & Sustainability Balance:',
        description:
          'We help balance visual impact, cost targets, and sustainability requirements from the early stage.',
      },
      {
        title: 'Design-Led Planning:',
        description:
          'We support your team with practical design input that connects creative ideas with real production possibilities.',
      },
    ],
    body: 'At the beginning of any packaging project, the right sourcing strategy can save time, reduce risk, and improve consistency. We help brands evaluate materials, supplier options, and packaging directions based on their brand image, cost structure, and sustainability priorities. By combining sourcing knowledge with design understanding, we create a clearer starting point for development and help you move forward with greater confidence.',
  },
  {
    kicker: 'SERVICE 02',
    title: 'Structural Design',
    description:
      'We create packaging structures that are visually refined, technically sound, and ready for manufacturing.',
    image: serviceImage('structural.png'),
    alt: 'Custom hang tag dieline engineering on a work table',
    imageSide: 'right',
    features: [
      {
        title: 'Dieline Engineering:',
        description:
          'We develop precise dielines and packaging structures tailored to your product requirements.',
      },
      {
        title: 'Function & Protection:',
        description:
          'We design structures that improve usability, protection, and overall packaging performance.',
      },
      {
        title: 'Production Feasibility:',
        description:
          'We review construction details to ensure the design can be produced efficiently and consistently.',
      },
    ],
    body: 'Good structural design is where creativity meets function. We refine packaging formats, folding systems, insert solutions, and assembly details to ensure each design works in both presentation and production. By considering functionality, material behavior, and manufacturing constraints early in the process, we help reduce revisions and improve execution quality at scale.',
  },
  {
    kicker: 'SERVICE 03',
    title: 'Product Development',
    description:
      'From concept to final sample, we manage the development process to keep your project moving clearly and efficiently.',
    image: serviceImage('product-development.png'),
    alt: 'Packaging samples and material swatches during product development',
    imageSide: 'left',
    features: [
      {
        title: 'Specification Development:',
        description:
          'We translate concepts into clear product specifications for materials, trims, colors, and finishes.',
      },
      {
        title: 'Cross-Factory Coordination:',
        description:
          'We coordinate across suppliers and production partners to keep development aligned and on schedule.',
      },
      {
        title: 'Rapid Prototyping:',
        description: 'Samples ready in 3-5 days for faster development cycles.',
      },
      {
        title: 'Iterative Sampling:',
        description:
          'We manage sampling rounds efficiently so you can review, refine, and approve with less delay.',
      },
    ],
    body: 'Product development is about turning ideas into production-ready results. We support the full process from concept definition and technical development to sample execution and refinement. By coordinating suppliers, clarifying requirements, and managing timelines closely, we help reduce complexity and shorten lead times while improving overall consistency before bulk production begins.',
  },
  {
    kicker: 'SERVICE 04',
    title: 'Risk-Free Quality Assurance',
    description:
      'We build quality control into every stage of the process to reduce defects, improve consistency, and protect every shipment.',
    image: serviceImage('quality.png'),
    alt: 'Factory quality control inspection for custom hang tags',
    imageSide: 'right',
    features: [
      {
        title: 'In-Line Quality Control:',
        description:
          'We monitor production during key stages to identify issues before they become larger problems.',
      },
      {
        title: 'AQL Final Inspection:',
        description:
          'We conduct inspections based on recognized AQL standards to verify quality before shipment.',
      },
      {
        title: 'Corrective Action Follow-Up:',
        description:
          'We help track and communicate quality issues quickly so corrective actions can be implemented efficiently.',
      },
    ],
    body: 'Reliable quality assurance is essential for protecting both product standards and brand reputation. Our quality control process covers in-line monitoring, final inspection, and issue follow-up to reduce avoidable errors and shipment risk. By maintaining clear inspection criteria and responding quickly when problems arise, we help ensure more stable quality outcomes across suppliers and production batches.',
  },
];

export const warehousing = {
  title: 'Warehousing - Kitting & Assembly',
  cards: [
    {
      title: 'Consolidation',
      image: serviceImage('warehouse-consolidation.png'),
      alt: 'Warehouse consolidation with palletized cartons',
      description:
        'We consolidate products and packaging components from multiple suppliers into one centralized location, reducing fragmentation across your supply chain. By coordinating inbound shipments, verifying quantities, and organizing goods efficiently, we help you avoid delays, misalignment, and unnecessary logistics costs. This ensures your materials are ready, complete, and aligned before moving to the next stage of production or shipment.',
    },
    {
      title: 'Assembly',
      image: serviceImage('warehouse-assembly.png'),
      alt: 'Packaging team assembling ready-to-use sets',
      description:
        "We provide kitting and assembly services to combine different packaging components into ready-to-use sets based on your requirements. Whether it's attaching tags, inserting packaging materials, or preparing complete product kits, our team ensures consistency and accuracy across every unit. This reduces your internal workload and ensures your products are fully prepared before reaching your warehouse or end customer.",
    },
    {
      title: 'Inventory',
      image: serviceImage('warehouse-inventory.png'),
      alt: 'Inventory management dashboard beside warehouse shelving',
      description:
        'We offer flexible inventory management solutions to help you store, track, and manage packaging materials and components efficiently. With clear stock visibility and organized storage systems, you can better plan production, avoid shortages, and reduce overstock risks. Our system supports ongoing projects and repeat orders, making your supply chain more predictable and easier to manage.',
    },
  ],
};

export const delivery = {
  title: 'Door-To-Door Delivery',
  subtitle:
    'Flexible Shipping Solutions - From DDP (Duty Paid) To FOB, Fully Managed Based On Your Needs',
  paragraphs: [
    'We provide flexible shipping solutions tailored to your business model, whether you prefer fully managed delivery or work with your own forwarder. From factory pickup to final destination, we coordinate every step to ensure your goods move efficiently and securely.',
    'For DDP (Delivered Duty Paid) shipments, we handle the entire process - including export, customs clearance, duties, and last-mile delivery - so your goods arrive directly at your door without additional coordination on your side.',
    'For FOB shipments, we prepare and deliver goods to your designated forwarder with complete documentation and clear handover, ensuring a smooth transition and minimizing delays.',
    'By integrating logistics into our supply chain service, we help you reduce communication gaps, avoid unexpected costs, and maintain better control over timelines - making your overall sourcing process more predictable and efficient.',
    'Trusted by global brands, supported by reliable logistics partners worldwide.',
  ],
  partners: [
    { name: 'DHL', image: serviceImage('logo-dhl.png') },
    { name: 'FedEx', image: serviceImage('logo-fedex.png') },
    { name: 'UPS', image: serviceImage('logo-ups.png') },
    { name: 'Maersk Line', image: serviceImage('logo-maersk.png') },
    { name: 'SF Express', image: serviceImage('logo-sf.png') },
    { name: 'EMS', image: serviceImage('logo-ems.png') },
  ],
};

export const serviceCta = {
  title: 'Need A Reliable Supply Chain Partner In China?',
  button: 'Get Your Project Started ->',
  note: "We'll reply within 6 hours.",
};

export const faqHero = {
  title: 'Got Questions? We Have Answers',
  description:
    'Everything You Need To Know About Sourcing Custom Packaging & Garment Trims-From Low MOQ To Global Shipping.',
  image: serviceImage('faq-hero.png'),
  alt: 'Hands reviewing garment trim samples and packaging notes',
};

export const faqGroups: FaqGroup[] = [
  {
    title: 'Stage 1: Inquiry & Consultation',
    items: [
      {
        question:
          'Q1: Do you work with small startups or only established brands?',
        answer:
          'We love startups! We specialize in helping emerging fashion brands grow from zero to one. We offer flexible solutions that scale with you.',
      },
      {
        question: 'Q2: What is your Minimum Order Quantity (MOQ)?',
        answer:
          'It depends on the item, but we are very flexible. Generally: Hang Tags/Cards: 500 pcs; Woven Labels: 500 pcs; Biodegradable Bags: 100-500 pcs. Contact us for specific needs.',
      },
      {
        question:
          "Q3: I'm new to packaging. Can you suggest materials for my brand?",
        answer:
          'Absolutely. Our experts will recommend the best materials based on your brand positioning (Luxury, Streetwear, Eco-friendly) and budget.',
      },
      {
        question: 'Q4: Do you charge for a consultation or quote?',
        answer:
          'Never. All inquiries, consultations, and quotes are 100% free and no-obligation.',
      },
      {
        question:
          'Q5: Can I get a catalog or physical samples of your past work?',
        answer:
          'Yes! We offer a Sample Kit containing various textures, paper stocks, and label qualities so you can feel the quality before ordering.',
      },
      {
        question: 'Q6: Are you a trading company or a factory?',
        answer:
          'We are not a traditional trading company. We work as a packaging and trims supply chain partner for apparel and lifestyle brands — combining sourcing, supplier coordination, quality control, and production management into one streamlined service. For our clients, this means fewer suppliers to manage, faster communication, and more consistent results.',
      },
      {
        question:
          'Q7: What information do you need to give me an accurate quote?',
        answer:
          "Ideally: Quantity, Size, Material preference, and your Logo/Artwork (if available). If you don't know the specs, just send us a reference photo!",
      },
      {
        question: 'Q8: Do you offer eco-friendly or sustainable options?',
        answer:
          'Yes, sustainability is our priority. We offer FSC-certified paper, recycled polyester (GRS), organic cotton, and fully biodegradable poly mailers.',
      },
      {
        question:
          'Q9: Can you source items that are not listed on your website?',
        answer:
          'Yes. As your supply chain partner, we can source special trims, ribbons, or unique packaging accessories through our extensive network.',
      },
      {
        question: 'Q10: How long does it take to get a quote?',
        answer:
          'We are fast. You will receive a detailed quote within 24 hours (usually sooner during business hours).',
      },
    ],
  },
  {
    title: 'Stage 2: Design & Development',
    items: [
      {
        question:
          "Q1: I don't have a designer. Can you help me with the artwork?",
        answer:
          'Yes, we offer free design assistance. Send us your high-res logo, and we will create a production-ready dieline (mockup) for you.',
      },
      {
        question: 'Q2: What file formats do you accept?',
        answer:
          'For the best print quality, we prefer vector files: AI, PDF, EPS, or SVG. High-resolution PNG/JPG (300dpi) is acceptable for some items.',
      },
      {
        question: 'Q3: Can you match a specific color?',
        answer:
          'Yes. We use the Pantone Matching System (PMS). Please provide TPX, TCX, or C codes. If you only have a physical fabric swatch, mail it to us, and we will match it.',
      },
      {
        question: 'Q4: Will the colors on my screen match the final product?',
        answer:
          "Screens (RGB) and print (CMYK) differ. That's why we always recommend a physical pre-production sample for critical color matching.",
      },
      {
        question: 'Q5: How much does sampling cost?',
        answer: 'It varies by product, but typically ranges from $30-$100.',
      },
      {
        question: 'Q6: Is the sample fee refundable?',
        answer:
          'Yes! The sample fee is fully credited back to you when you place a bulk order (meeting the refund threshold).',
      },
      {
        question: 'Q7: How long does sampling take?',
        answer:
          'Paper items: 3-5 days. Woven/Fabric labels: 3-5 days. Plastic bags: 5-7 days.',
      },
      {
        question: 'Q8: Can you copy a sample if I send you a photo?',
        answer:
          'A physical sample is best for accuracy (texture/weight), but we can replicate closely from high-quality photos and detailed specs.',
      },
      {
        question: 'Q9: Do you provide 3D digital mockups?',
        answer:
          'Yes, we provide 2D or 3D proofs for approval before we start any metal mold or printing plate production.',
      },
      {
        question:
          'Q10: What if I need to change the design after seeing the sample?',
        answer:
          "That's what samples are for! We can revise the design. Note that if new molds/plates are needed, a small setup fee may apply.",
      },
    ],
  },
  {
    title: 'Stage 3: Production & Quality Control',
    items: [
      {
        question:
          'Q1: What is your standard turnaround time for bulk production?',
        answer:
          'After sample approval: 7-10 days for labels/tags; 10-14 days for bags.',
      },
      {
        question: 'Q2: Can you accept Rush Orders?',
        answer:
          'Yes. If you have a tight launch date, let us know. We can often expedite production to 5-7 days for an extra fee.',
      },
      {
        question: 'Q3: How do you ensure quality during production?',
        answer:
          'We have a "Boots-on-the-Ground" QC team. We inspect raw materials, print quality, and cutting accuracy at every stage.',
      },
      {
        question: 'Q4: Can I see the products before you ship them?',
        answer:
          'Absolutely. We send detailed photos and videos of the finished bulk order for your final approval before dispatch.',
      },
      {
        question: 'Q5: Do you offer Kitting or Assembly services?',
        answer:
          "Yes! We can pre-string tags, cut and fold labels, or pack items into sets. We do the tedious manual work so you don't have to.",
      },
      {
        question: 'Q6: Can you apply stickers or barcodes to my packaging?',
        answer:
          'Yes, we can print and apply SKU labels, barcodes, or size stickers directly onto your bags or boxes.',
      },
      {
        question: 'Q7: What happens if there is a production delay?',
        answer:
          'Delays are rare, but if they happen (e.g., material shortage), we will notify you immediately and propose a solution (like split shipping) to minimize impact.',
      },
      {
        question: 'Q8: How do you handle waste during production?',
        answer:
          'We aim for minimal waste. For eco-friendly lines, our production scraps are often recycled or disposed of responsibly.',
      },
      {
        question:
          'Q9: Can you produce different variations (SKUs) in one order?',
        answer:
          'Yes. For example, you can order 10,000 hang tags split into 4 different size/color versions (Small set-up fees may apply per version).',
      },
      {
        question: 'Q10: Is your production ethical?',
        answer:
          'Yes. We strictly adhere to labor laws and safety standards. We only work with facilities that treat workers fairly.',
      },
    ],
  },
  {
    title: 'Stage 4: Logistics & Delivery',
    items: [
      {
        question: 'Q1: Do you ship internationally?',
        answer:
          'Yes, we ship globally every day. Our main markets are USA, Canada, UK, Australia, and Europe.',
      },
      {
        question: 'Q2: What shipping methods do you offer?',
        answer:
          'Express (DHL/FedEx/UPS): 3-5 days. Air Freight: 7-12 days. Sea Freight: 25-35 days (best for heavy/bulky orders).',
      },
      {
        question: 'Q3: Can you handle customs and taxes for me? (DDP)',
        answer:
          'Yes! We offer DDP (Delivered Duty Paid) service. We handle all customs paperwork and tax payments. You just receive the goods at your door.',
      },
      {
        question: 'Q4: Can you consolidate products from other suppliers?',
        answer:
          'Yes. If you have other goods made in China, you can send them to our warehouse. We will consolidate everything into one shipment to save you shipping costs.',
      },
      {
        question: 'Q5: How are the products packed for safety?',
        answer:
          'We use reinforced corrugated cartons, waterproof inner bags, and corner protectors to ensure your goods arrive in perfect condition.',
      },
      {
        question: 'Q6: Can you split the shipment to different addresses?',
        answer:
          'Yes. We can send part of the order to your office and the rest directly to your garment factory in China or Vietnam.',
      },
      {
        question: 'Q7: Do you offer Blind Shipping (Drop Shipping)?',
        answer:
          'Yes. We can ship directly to your customer or factory without our company name on the paperwork, protecting your business privacy.',
      },
      {
        question: 'Q8: How do I track my order?',
        answer:
          'Once shipped, we will provide a tracking number immediately so you can monitor the status online.',
      },
      {
        question: 'Q9: How is shipping cost calculated?',
        answer:
          'It is based on the greater of Actual Weight or Volumetric Weight. We optimize packaging to keep volume low.',
      },
      {
        question: 'Q10: What incoterms do you support?',
        answer: 'We support EXW, FOB, CIF, and DDP.',
      },
    ],
  },
  {
    title: 'Stage 5: After-Sales & Support',
    items: [
      {
        question: 'Q1: What is your return/refund policy for defective items?',
        answer:
          'If the error is ours (e.g., wrong color, typo, poor quality), we will reproduce the order for free or offer a full refund.',
      },
      {
        question: 'Q2: How do I report a quality issue?',
        answer:
          'Please contact us within 7 days of receiving the goods with photos/videos. We will investigate and resolve it immediately.',
      },
      {
        question: 'Q3: Do you keep my molds/plates for reorders?',
        answer:
          'Yes. We keep molds and screens on file for 2 years. Reordering is fast and cheaper (no new setup fees).',
      },
      {
        question:
          'Q4: Can you ensure color consistency for reorders next year?',
        answer:
          'Yes. We keep a "Master Sample" of your first order in our archive to ensure the next batch matches perfectly.',
      },
      {
        question: 'Q5: Will you sell my design to other customers?',
        answer:
          'Never. We respect your intellectual property. We are happy to sign an NDA (Non-Disclosure Agreement) upon request.',
      },
      {
        question: 'Q6: Do you offer payment terms for long-term clients?',
        answer:
          'For first-time clients, we require upfront payment. For regular partners with a good track record, we can discuss flexible payment terms.',
      },
      {
        question: 'Q7: What payment methods do you accept?',
        answer:
          'T/T (Bank Transfer), PayPal (for samples/small orders), Western Union, and Alibaba Trade Assurance.',
      },
      {
        question: 'Q8: Can I get a discount for large bulk orders?',
        answer:
          'Yes. We offer tiered pricing. The more you order, the lower the unit price.',
      },
      {
        question: 'Q9: Do you have a referral program?',
        answer:
          'Yes! If you refer a friend who places an order, we offer a discount or credit on your next order.',
      },
      {
        question: 'Q10: How can I leave feedback?',
        answer:
          'We value your feedback. You can email your account manager directly or leave a review on our website/social media.',
      },
    ],
  },
];

export const faqCta = {
  title: 'Transform Your Brand With Stunning Packaging Solutions',
  button: 'Contact An Agent Now ->',
  note: "We'll reply within 6 hours.",
};
