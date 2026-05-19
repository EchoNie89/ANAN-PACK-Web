import type { SiteImageSource } from "../lib/local-images";
import { getLocalImage } from "../lib/local-images";

const base = "/images/services";
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
  imageSide: "left" | "right";
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
  title: "End-to-End Packaging Supply Chain Management",
  description:
    "We go beyond manufacturing. From sourcing the right materials to consolidating your shipment, we handle the complexities so you don't have to.",
  image: serviceImage("hero-logistics-figma-layer.png"),
  alt: "Cargo ship, train, ferry, containers, and airplane in a logistics scene",
  cta: "Talk To A Specialist",
};

export const sourcingComparison = {
  title: "How We Simplify Your Sourcing",
  traditional: {
    title: "Traditional Services Mode",
    tag: "Fragmented & Time-Consuming",
    summary: "More suppliers, more communication, more uncertainty.",
    points: [
      "Multiple suppliers for different items",
      "No unified quality control standard",
      "Separate payments and logistics handling",
      "Variable lead times and coordination issues",
      "Higher risk in production and delivery",
    ],
  },
  managed: {
    title: "Our Services Mode",
    tag: "Integrated & Fully Managed",
    label: "Recommended Model",
    summary: "One team manages the complexity behind your supply chain.",
    points: [
      "One goal of contact for all categories",
      "Verified factory network with unified standards",
      "Consolidated shipment and faster delivery",
      "Clear communication and less response",
      "Stable quality control and reliable timelines",
    ],
  },
  note: "One Point of Contact. Complete Supply Chain Control.",
};

export const serviceSections: ServiceSection[] = [
  {
    kicker: "SERVICE 01",
    title: "Strategic Sourcing & Design",
    description:
      "We help brands build the right packaging direction from the start by aligning materials, suppliers, and design thinking with brand goals.",
    image: serviceImage("sourcing.png"),
    alt: "Hands reviewing custom packaging materials and garment trims",
    imageSide: "left",
    features: [
      {
        title: "Multi-Material Capabilities:",
        description:
          "We identify suitable materials and sourcing options based on your product, positioning, and budget.",
      },
      {
        title: "Cost & Sustainability Balance:",
        description:
          "We help balance visual impact, cost targets, and sustainability requirements from the early stage.",
      },
      {
        title: "Design-Led Planning:",
        description:
          "We support your team with practical design input that connects creative ideas with real production possibilities.",
      },
    ],
    body:
      "At the beginning of any packaging project, the right sourcing strategy can save time, reduce risk, and improve consistency. We help brands evaluate materials, supplier options, and packaging directions based on their brand image, cost structure, and sustainability priorities. By combining sourcing knowledge with design understanding, we create a clearer starting point for development and help you move forward with greater confidence.",
  },
  {
    kicker: "SERVICE 02",
    title: "Structural Design",
    description:
      "We create packaging structures that are visually refined, technically sound, and ready for manufacturing.",
    image: serviceImage("structural.png"),
    alt: "Custom hang tag dieline engineering on a work table",
    imageSide: "right",
    features: [
      {
        title: "Dieline Engineering:",
        description:
          "We develop precise dielines and packaging structures tailored to your product requirements.",
      },
      {
        title: "Function & Protection:",
        description:
          "We design structures that improve usability, protection, and overall packaging performance.",
      },
      {
        title: "Production Feasibility:",
        description:
          "We review construction details to ensure the design can be produced efficiently and consistently.",
      },
    ],
    body:
      "Good structural design is where creativity meets function. We refine packaging formats, folding systems, insert solutions, and assembly details to ensure each design works in both presentation and production. By considering functionality, material behavior, and manufacturing constraints early in the process, we help reduce revisions and improve execution quality at scale.",
  },
  {
    kicker: "SERVICE 03",
    title: "Product Development",
    description:
      "From concept to final sample, we manage the development process to keep your project moving clearly and efficiently.",
    image: serviceImage("product-development.png"),
    alt: "Packaging samples and material swatches during product development",
    imageSide: "left",
    features: [
      {
        title: "Specification Development:",
        description:
          "We translate concepts into clear product specifications for materials, trims, colors, and finishes.",
      },
      {
        title: "Cross-Factory Coordination:",
        description:
          "We coordinate across suppliers and production partners to keep development aligned and on schedule.",
      },
      {
        title: "Rapid Prototyping:",
        description: "Samples ready in 3-5 days for faster development cycles.",
      },
      {
        title: "Iterative Sampling:",
        description:
          "We manage sampling rounds efficiently so you can review, refine, and approve with less delay.",
      },
    ],
    body:
      "Product development is about turning ideas into production-ready results. We support the full process from concept definition and technical development to sample execution and refinement. By coordinating suppliers, clarifying requirements, and managing timelines closely, we help reduce complexity and shorten lead times while improving overall consistency before bulk production begins.",
  },
  {
    kicker: "SERVICE 04",
    title: "Risk-Free Quality Assurance",
    description:
      "We build quality control into every stage of the process to reduce defects, improve consistency, and protect every shipment.",
    image: serviceImage("quality.png"),
    alt: "Factory quality control inspection for custom hang tags",
    imageSide: "right",
    features: [
      {
        title: "In-Line Quality Control:",
        description:
          "We monitor production during key stages to identify issues before they become larger problems.",
      },
      {
        title: "AQL Final Inspection:",
        description:
          "We conduct inspections based on recognized AQL standards to verify quality before shipment.",
      },
      {
        title: "Corrective Action Follow-Up:",
        description:
          "We help track and communicate quality issues quickly so corrective actions can be implemented efficiently.",
      },
    ],
    body:
      "Reliable quality assurance is essential for protecting both product standards and brand reputation. Our quality control process covers in-line monitoring, final inspection, and issue follow-up to reduce avoidable errors and shipment risk. By maintaining clear inspection criteria and responding quickly when problems arise, we help ensure more stable quality outcomes across suppliers and production batches.",
  },
];

export const warehousing = {
  title: "Warehousing - Kitting & Assembly",
  cards: [
    {
      title: "Consolidation",
      image: serviceImage("warehouse-consolidation.png"),
      alt: "Warehouse consolidation with palletized cartons",
      description:
        "We consolidate products and packaging components from multiple suppliers into one centralized location, reducing fragmentation across your supply chain. By coordinating inbound shipments, verifying quantities, and organizing goods efficiently, we help you avoid delays, misalignment, and unnecessary logistics costs. This ensures your materials are ready, complete, and aligned before moving to the next stage of production or shipment.",
    },
    {
      title: "Assembly",
      image: serviceImage("warehouse-assembly.png"),
      alt: "Packaging team assembling ready-to-use sets",
      description:
        "We provide kitting and assembly services to combine different packaging components into ready-to-use sets based on your requirements. Whether it's attaching tags, inserting packaging materials, or preparing complete product kits, our team ensures consistency and accuracy across every unit. This reduces your internal workload and ensures your products are fully prepared before reaching your warehouse or end customer.",
    },
    {
      title: "Inventory",
      image: serviceImage("warehouse-inventory.png"),
      alt: "Inventory management dashboard beside warehouse shelving",
      description:
        "We offer flexible inventory management solutions to help you store, track, and manage packaging materials and components efficiently. With clear stock visibility and organized storage systems, you can better plan production, avoid shortages, and reduce overstock risks. Our system supports ongoing projects and repeat orders, making your supply chain more predictable and easier to manage.",
    },
  ],
};

export const delivery = {
  title: "Door-To-Door Delivery",
  subtitle:
    "Flexible Shipping Solutions - From DDP (Duty Paid) To FOB, Fully Managed Based On Your Needs",
  paragraphs: [
    "We provide flexible shipping solutions tailored to your business model, whether you prefer fully managed delivery or work with your own forwarder. From factory pickup to final destination, we coordinate every step to ensure your goods move efficiently and securely.",
    "For DDP (Delivered Duty Paid) shipments, we handle the entire process - including export, customs clearance, duties, and last-mile delivery - so your goods arrive directly at your door without additional coordination on your side.",
    "For FOB shipments, we prepare and deliver goods to your designated forwarder with complete documentation and clear handover, ensuring a smooth transition and minimizing delays.",
    "By integrating logistics into our supply chain service, we help you reduce communication gaps, avoid unexpected costs, and maintain better control over timelines - making your overall sourcing process more predictable and efficient.",
    "Trusted by global brands, supported by reliable logistics partners worldwide.",
  ],
  partners: [
    { name: "DHL", image: serviceImage("logo-dhl.png") },
    { name: "FedEx", image: serviceImage("logo-fedex.png") },
    { name: "UPS", image: serviceImage("logo-ups.png") },
    { name: "Maersk Line", image: serviceImage("logo-maersk.png") },
    { name: "SF Express", image: serviceImage("logo-sf.png") },
    { name: "EMS", image: serviceImage("logo-ems.png") },
  ],
};

export const serviceCta = {
  title: "Need A Reliable Supply Chain Partner In China?",
  button: "Get Your Project Started ->",
  note: "We'll reply within 6 hours.",
};

export const faqHero = {
  title: "Got Questions? We Have Answers",
  description:
    "Everything You Need To Know About Sourcing Custom Packaging & Garment Trims-From Low MOQ To Global Shipping.",
  image: serviceImage("faq-hero.png"),
  alt: "Hands reviewing garment trim samples and packaging notes",
};

export const faqGroups: FaqGroup[] = [
  {
    title: "Stage 1: Inquiry & Consultation:",
    items: [
      {
        question: "Q1: Do you work with small startups or only established brands?",
        answer:
          "We love startups! We specialize in helping emerging fashion brands grow from zero to one. We offer flexible solutions that scale with you.",
      },
      {
        question: "Q2: What is your Minimum Order Quantity (MOQ)?",
        answer:
          "MOQ depends on the product and material. Many labels, tags, stickers, and trims can start from small pilot quantities, and we will recommend the most efficient option for your brief.",
      },
      {
        question: "Q3: I'm new to packaging. Can you suggest materials for my brand?",
        answer:
          "Yes. Share your product type, target price, brand tone, and sustainability needs, and we will suggest materials, finishes, and construction options that fit.",
      },
      {
        question: "Q4: Do you charge for a consultation or quote?",
        answer:
          "No. Initial consultation and quotation are free. If your project requires paid sampling or tooling, we will confirm costs before production starts.",
      },
      {
        question: "Q5: Can I get a catalog or physical samples of your past work?",
        answer:
          "Yes. We can share reference catalogs and arrange sample kits so you can compare materials, print effects, and finishing quality before deciding.",
      },
      {
        question: "Q6: Are you a trading company or a factory?",
        answer:
          "We operate as a sourcing and production management partner with a verified factory network, helping you coordinate categories, QC, sampling, and logistics through one team.",
      },
    ],
  },
  {
    title: "Stage 2: Design & Development:",
    items: [
      {
        question: "Q1: I don't have a designer. Can you help me with the artwork?",
        answer:
          "Yes, we offer free design assistance. Send us your high-res logo, and we will create a production-ready dieline (mockup) for you.",
      },
      {
        question: "Q2: What file formats do you accept?",
        answer:
          "Vector files such as AI, PDF, SVG, or EPS are preferred. High-resolution PSD, PNG, or JPG can also be reviewed when vector files are not available.",
      },
      {
        question: "Q3: Can you match a specific color?",
        answer:
          "Yes. We can match Pantone references, physical samples, or approved production samples, then confirm the result during sampling.",
      },
      {
        question: "Q4: Will the colors on my screen match the final product?",
        answer:
          "Screen color is only a reference. We recommend Pantone numbers or physical samples for accurate color approval before bulk production.",
      },
      {
        question: "Q5: How much does sampling cost?",
        answer:
          "Sampling cost varies by product, material, and finish. We quote it clearly after reviewing your artwork and specifications.",
      },
      {
        question: "Q6: Is the sample fee refundable?",
        answer:
          "For many projects, sample fees can be credited against the bulk order. The exact policy depends on product type and order value.",
      },
    ],
  },
  {
    title: "Stage 3: Production & Quality Control:",
    items: [
      {
        question: "Q1: What is your standard turnaround time for bulk production?",
        answer: "After sample approval: 7-10 days for labels/tags; 10-14 days for bags.",
      },
      {
        question: "Q2: Can you accept Rush Orders?",
        answer:
          "Yes, depending on material availability and factory capacity. Share your required delivery date and we will confirm the fastest workable schedule.",
      },
      {
        question: "Q3: How do you ensure quality during production?",
        answer:
          "We use clear specifications, in-line checks, final inspection, and photo/video reporting to reduce errors before shipment.",
      },
      {
        question: "Q4: Can I see the products before you ship them?",
        answer:
          "Yes. We can provide production photos, inspection reports, and final packing photos before goods are released.",
      },
      {
        question: "Q5: Do you offer Kitting or Assembly services?",
        answer:
          "Yes. We can attach hang tags, prepare packaging kits, group items by SKU, and organize products for warehouse-ready delivery.",
      },
      {
        question: "Q6: Can you apply stickers or barcodes to my packaging?",
        answer:
          "Yes. We can apply stickers, barcode labels, care labels, tags, and other packaging components according to your packing instructions.",
      },
    ],
  },
  {
    title: "Stage 4: Logistics & Delivery:",
    items: [
      {
        question: "Q1: Do you ship internationally?",
        answer:
          "Yes, we ship globally every day. Our main markets are USA, Canada, UK, Australia, and Europe.",
      },
      {
        question: "Q2: What shipping methods do you offer?",
        answer:
          "We support express courier, air freight, sea freight, DDP, FOB handover, and consolidated shipping based on your timeline and budget.",
      },
      {
        question: "Q3: Can you handle customs and taxes for me? (DDP)",
        answer:
          "Yes. For DDP shipments, we can coordinate export, customs clearance, duties, taxes, and last-mile delivery to your address.",
      },
      {
        question: "Q4: Can you consolidate products from other suppliers?",
        answer:
          "Yes. We can receive goods from other suppliers, verify quantities, consolidate shipments, and prepare final export documentation.",
      },
    ],
  },
  {
    title: "Stage 5: After-Sales & Support:",
    items: [
      {
        question: "Q1: What is your return/refund policy for defective items?",
        answer:
          "If the error is ours (e.g., wrong color, typo, poor quality), we will reproduce the order for free or offer a full refund.",
      },
      {
        question: "Q2: How do I report a quality issue?",
        answer:
          "Send photos, videos, order details, and quantity affected. Our team will review the issue and respond with next steps quickly.",
      },
      {
        question: "Q3: Do you keep my molds/plates for reorders?",
        answer:
          "Yes, when the production process uses molds, plates, or dies, we can keep them for repeat orders when storage is available.",
      },
      {
        question: "Q4: Can you ensure color consistency for reorders next year?",
        answer:
          "We keep approved samples and specifications as references, then use them to control repeat order color and material consistency.",
      },
      {
        question: "Q5: Will you sell my design to other customers?",
        answer:
          "No. Customer artwork and custom specifications are treated as confidential and are not sold or shared with other customers.",
      },
    ],
  },
];

export const faqCta = {
  title: "Transform Your Brand With Stunning Packaging Solutions",
  button: "Contact An Agent Now ->",
  note: "We'll reply within 6 hours.",
};
