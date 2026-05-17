export const footerQuickLinks = [
  { label: "Products", href: "/home#products" },
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/home#case-study" },
  { label: "Why Us", href: "/about-us#why-choose-us" },
  { label: "FAQs", href: "/services/faq" },
  { label: "About Us", href: "/about-us" },
] as const;

export const contactDetails = {
  location: "Room 503, Nanguang Industrial Park, Guangzhou",
  whatsapp: "+86 15072350032",
  phone: "+86 20 8673 0000",
  email: "echo@anancn.com",
  hours: ["Monday-Friday", "9:00 AM - 6:00 PM (CST)"],
  qrNote: "Scan to contact us on WhatsApp for samples, project details, and quotation support.",
} as const;

export const footerHighlights = [
  { icon: "box", title: "Multi-category Sourcing" },
  { icon: "shield", title: "Factory Audit & Quality Control" },
  { icon: "users", title: "Dedicated Project Management" },
  { icon: "clock", title: "On-Time Delivery You Can Count On" },
] as const;

export const aboutReasons = [
  {
    icon: "box",
    title: "Integrated Sourcing System",
    description:
      "From trims to packaging and accessories, we coordinate the right factories and keep each category aligned under one process.",
  },
  {
    icon: "shield",
    title: "Audited Factory Network",
    description:
      "We work with selected factories that meet our standards for quality, communication, and delivery.",
  },
  {
    icon: "users",
    title: "Dedicated Project Management",
    description:
      "Each project is followed by a responsible team member to ensure clear communication and on-time progress.",
  },
  {
    icon: "clock",
    title: "Quality & Delivery Control",
    description:
      "We follow up on key production stages to help ensure stable quality and predictable delivery.",
  },
] as const;

export const aboutTeam = [
  {
    name: "Sourcing Lead",
    description: "Responsible for factory matching, cost comparison, and supplier coordination.",
    imageClass: "",
  },
  {
    name: "Product Development Specialist",
    description:
      "Supports material selection, artwork review, sampling, and production-ready specifications.",
    imageClass: "scale-x-[-1] saturate-75",
  },
  {
    name: "Quality Control Coordinator",
    description: "Follows up on production standards, inspection details, and shipment readiness.",
    imageClass: "sepia-[0.18] hue-rotate-[8deg]",
  },
  {
    name: "Project Manager",
    description: "Keeps communication clear, timelines aligned, and responsibilities accountable.",
    imageClass: "brightness-95 contrast-105",
  },
] as const;

export const aboutSustainability = [
  {
    title: "FSC Certified Paper Options",
    description:
      "For paper-based packaging, we can help source FSC-certified paper options for brands with responsible sourcing requirements.",
    image: "/images/home/cert-fsc.png",
    alt: "FSC certified paper mark",
  },
  {
    title: "GRS Recycled Material Options",
    description:
      "For recycled materials, we coordinate with suppliers that support GRS-certified options when applicable.",
    image: "/images/home/cert-grs.png",
    alt: "Global Recycled Standard mark",
  },
  {
    title: "Textile Safety & Compliance",
    description:
      "For textile-related trims and labels, we help match materials that meet relevant safety and textile standards.",
    image: "/images/home/cert-oeko.png",
    alt: "OEKO-TEX Standard 100 mark",
  },
] as const;

export const aboutValues = [
  {
    title: "Transparency",
    description:
      "We share timelines, constraints, and sourcing realities early so your team can make better decisions.",
  },
  {
    title: "Accountability",
    description:
      "Each stage has a responsible owner, from sample follow-up to production checks and delivery coordination.",
  },
  {
    title: "Flexibility",
    description:
      "We support sampling, small-to-medium orders, and multi-category packaging needs without forcing rigid workflows.",
  },
  {
    title: "Reliability",
    description:
      "We focus on stable quality, consistent delivery, and long-term cooperation for growing international brands.",
  },
] as const;

export const contactTrustItems = [
  { icon: "box", title: "Low MOQ", description: "Starting Friendly" },
  { icon: "bolt", title: "Fast Sampling", description: "5 - 7 Days Ready" },
  { icon: "shield", title: "Verified Factories", description: "Stable Quality" },
  { icon: "globe", title: "Global Shipping", description: "On-time Delivery" },
] as const;

export const contactNextSteps = [
  "We check your project details",
  "Our team reviews your requirements",
  "We suggest materials and solutions",
  "You receive quotation and sample plan",
] as const;
