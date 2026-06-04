import type { ProductImportManifest } from "./types";

const manifest: ProductImportManifest = {
  slug: "patches",
  title: "Patches",
  figmaSelectionUrl:
    "https://www.figma.com/design/SzOlgqIXHy4MBI2QXLE08L/%E7%8B%AC%E7%AB%8B%E7%AB%99%E8%AE%BE%E8%AE%A1-%E5%90%8A%E7%89%8C%E7%BD%91%E7%AB%99--Copy-?node-id=21443-1968&t=wllXfbMu5Hfh6Jfh-4",
  sections: ["applications", "customizationGroups"],
  applicationTitle: "Applications",
  applications: [
    {
      sourceKey: "patches-app-bags-luggage",
      title: "Bags & Luggage",
      description:
        "Curate a memorable unboxing for delicate items. From perfumes to fine rings, our luxurious jewelry packaging pouches and small custom fabric pouches add an opulent, premium finishing touch to your beauty lines.",
      imagePath:
        "import-assets/products/patches/bags-luggage-application.png",
      alt: "Bags & Luggage",
      figmaNodeId: "21440:2601",
    },
    {
      sourceKey: "patches-app-home-linen",
      title: "Home & Linen",
      description:
        "The ultimate safeguard for fine leather goods. Our custom dust bags for handbags prevent scratches and dust accumulation, ensuring your premium bags, belts, and wallets reach your customers in flawless condition.",
      imagePath:
        "import-assets/products/patches/home-linen-application.png",
      alt: "Home & Linen",
      figmaNodeId: "21440:2605",
    },
    {
      sourceKey: "patches-app-apparel-clothing",
      title: "Apparel & Clothing",
      description:
        "Instantly convey elegance with a silky, frictionless surface. Satin dust bags offer a luxurious unboxing feel, ideal for delicate lingerie, cosmetics, and premium hair extensions.",
      imagePath:
        "import-assets/products/patches/apparel-clothing-application.png",
      alt: "Apparel & Clothing",
      figmaNodeId: "21440:2610",
    },
  ],
  customizationGroups: [
    {
      sourceKey: "patches-customization-materials",
      title: "Materials",
      intro:
        "Choose the right patch material for your brand. The material is one of the most important factors when creating custom patches for clothing, hats, and accessories. Different patch materials offer different textures, durability levels, and visual effects. As an experienced custom patch manufacturer, we provide a wide range of materials to meet the needs of fashion brands, sports teams, and apparel manufacturers.",
      figmaNodeId: "19741:7490",
      images: [
        {
          sourceKey: "patches-cust-materials-img-1",
          title: "Shaped logo patch sample",
          imagePath:
            "import-assets/products/patches/customization-materials-shaped-logo-patch-01.png",
          alt: "Shaped logo patch sample with woven texture",
          figmaNodeId: "19741:7491",
        },
        {
          sourceKey: "patches-cust-materials-img-2",
          title: "Round logo patch sample",
          imagePath:
            "import-assets/products/patches/customization-materials-round-logo-patch-02.png",
          alt: "Round woven logo patch sample",
          figmaNodeId: "19741:7495",
        },
        {
          sourceKey: "patches-cust-materials-img-3",
          title: "Rubber keychain patch sample",
          imagePath:
            "import-assets/products/patches/customization-materials-rubber-keychain-patch-03.png",
          alt: "Rubber patch keychain sample",
          figmaNodeId: "19741:7499",
        },
        {
          sourceKey: "patches-cust-materials-img-4",
          title: "Embroidered badge patch sample",
          imagePath:
            "import-assets/products/patches/customization-materials-embroidered-badge-patch-04.png",
          alt: "Embroidered badge patch sample",
          figmaNodeId: "19741:7493",
        },
        {
          sourceKey: "patches-cust-materials-img-5",
          title: "Molded rubber patch sample",
          imagePath:
            "import-assets/products/patches/customization-materials-molded-rubber-patch-05.png",
          alt: "Molded rubber patch sample",
          figmaNodeId: "19741:7497",
        },
        {
          sourceKey: "patches-cust-materials-img-6",
          title: "Chenille character patch sample",
          imagePath:
            "import-assets/products/patches/customization-materials-chenille-character-patch-06.png",
          alt: "Chenille character patch sample",
          figmaNodeId: "19741:7501",
        },
      ],
      blocks: [
        {
          _type: "listBlock",
          markerStyle: "bullet",
          title: "Embroidered Patch Material",
          items: [
            "Embroidered patches are made by stitching colored threads onto a fabric base to create a raised, textured logo or design. This traditional technique gives patches a classic and premium appearance.",
            "Features: Strong texture and dimensional look; durable stitching structure; suitable for bold logos and simple designs.",
            "Best For: Jackets and uniforms; hats and caps; fashion garments; corporate branding patches.",
            "Embroidered patches are one of the most popular patches for clothing brands because of their durability and timeless appearance.",
          ],
        },
        {
          _type: "listBlock",
          markerStyle: "bullet",
          title: "Woven Patch Material",
          items: [
            "Woven patches are produced using fine threads woven together to create detailed artwork. Compared with embroidered patches, woven patches can display smaller text and more intricate designs.",
            "Features: Smooth surface and fine detail; high clarity for small lettering; lightweight and flexible.",
            "Best For: Clothing brand logos; detailed artwork patches; fashion apparel; labels or small patches.",
            "Woven patches are ideal when designs require precision and clean lines.",
          ],
        },
        {
          _type: "listBlock",
          markerStyle: "bullet",
          title: "Chenille Patch Material",
          items: [
            "Chenille patches are made using looped yarn that creates a soft, fluffy texture. They are commonly associated with varsity jackets and sportswear.",
            "Features: Thick and soft texture; bold visual appearance; high visibility branding.",
            "Best For: Varsity jackets; sports teams; streetwear brands; college apparel.",
            "Chenille patches are widely used when brands want a retro or athletic style.",
          ],
        },
        {
          _type: "listBlock",
          markerStyle: "bullet",
          title: "Leather Patch Material",
          items: [
            "Leather patches are crafted from genuine leather or PU leather and often feature embossed or debossed logos. They offer a premium and sophisticated appearance.",
            "Features: Natural and premium texture; durable material; elegant embossed logo effects.",
            "Best For: Denim brands; jackets and outerwear; hats and caps; bags and accessories.",
            "Leather patches are commonly used by fashion brands seeking a high-end look.",
          ],
        },
        {
          _type: "listBlock",
          markerStyle: "bullet",
          title: "PVC & Rubber Patch Material",
          items: [
            "PVC patches are made from soft rubber materials that create a flexible and waterproof patch. These patches often feature 3D layered designs.",
            "Features: Waterproof and weather resistant; flexible and durable; strong 3D visual effect.",
            "Best For: Outdoor gear; sportswear brands; backpacks and bags; tactical uniforms.",
            "PVC patches are ideal for products exposed to harsh environments or heavy use.",
          ],
        },
        {
          _type: "listBlock",
          markerStyle: "bullet",
          title: "Choosing the Right Patch Material",
          items: [
            "Selecting the right material depends on several factors: design complexity, product type, brand style, durability requirements, and budget.",
            "For example: embroidered patches are ideal for classic logos and uniforms; woven patches are better for detailed artwork; chenille patches create bold and retro branding; leather patches offer a premium fashion look; PVC patches provide durability for outdoor products.",
            "Our team can recommend the best patch material for your custom design based on your product and branding needs.",
          ],
        },
        {
          _type: "listBlock",
          markerStyle: "bullet",
          title: "Need Help Choosing Patch Materials?",
          items: [
            "If you're not sure which patch material is right for your product, our team can provide professional suggestions based on your logo design and application.",
            "Simply send us your design and project details, and we will help you create the most suitable custom patches for your brand.",
          ],
        },
      ],
    },
    {
      sourceKey: "patches-customization-border-options",
      title: "Border Options",
      intro:
        "The border finish is an important detail in the production of custom patches for clothing and accessories. It affects not only the appearance of the patch but also its durability and the types of shapes that can be created. Different border styles are suitable for different patch materials and designs.",
      figmaNodeId: "21440:2614",
      images: [
        {
          sourceKey: "patches-cust-border-img-1",
          title: "Shaped patch border examples",
          imagePath:
            "import-assets/products/patches/customization-border-shaped-patches-01.png",
          alt: "Shaped patch border examples on denim",
          figmaNodeId: "21440:2615",
        },
        {
          sourceKey: "patches-cust-border-img-2",
          title: "Hook and loop disc example",
          imagePath:
            "import-assets/products/patches/customization-border-hook-loop-discs-02.png",
          alt: "Hook and loop disc example",
          figmaNodeId: "21440:2618",
        },
        {
          sourceKey: "patches-cust-border-img-3",
          title: "Pin back badge example",
          imagePath:
            "import-assets/products/patches/customization-border-pin-back-badge-03.png",
          alt: "Pin back badge example",
          figmaNodeId: "21440:2620",
        },
      ],
      blocks: [
        {
          _type: "entryListBlock",
          markerStyle: "plain",
          entries: [
            {
              title: "Merrow Border",
              paragraphs: [
                "A merrow border is created using a special overlock stitching machine that wraps thick thread around the edge of the patch. This stitching forms a rounded and raised edge that protects the patch from fraying.",
              ],
              detailGroups: [
                {
                  label: "Advantages",
                  markerStyle: "bullet",
                  items: [
                    "Strong and durable edge protection",
                    "Classic stitched appearance",
                    "Suitable for long-term garment use",
                  ],
                },
                {
                  label: "Limitations",
                  markerStyle: "bullet",
                  items: [
                    "Merrow borders require the patch shape to be relatively simple, usually round, oval, or rectangular.",
                  ],
                },
                {
                  label: "Best Applications",
                  markerStyle: "bullet",
                  items: [
                    "embroidered patches",
                    "uniform patches",
                    "hat patches",
                    "traditional logo patches",
                  ],
                  note: "Merrow borders are one of the most common finishes used in embroidered patches for clothing.",
                },
              ],
            },
            {
              title: "Heat Cut Border",
              paragraphs: [
                "Heat cutting uses a heated blade to cut the patch fabric and seal the edge at the same time. The heat melts the fibers slightly, preventing fraying.",
              ],
              detailGroups: [
                {
                  label: "Advantages",
                  markerStyle: "bullet",
                  items: [
                    "Clean and flat edges",
                    "Suitable for detailed shapes",
                    "Works well with woven patches",
                  ],
                },
                {
                  label: "Limitations",
                  markerStyle: "bullet",
                  items: [
                    "The edge is thinner than a merrow border and may be less decorative.",
                  ],
                },
                {
                  label: "Best Applications",
                  markerStyle: "bullet",
                  items: [
                    "woven patches",
                    "detailed logo patches",
                    "fashion brand patches",
                  ],
                  note: "Heat cut borders are commonly used when the design includes sharp corners or detailed outlines.",
                },
              ],
            },
            {
              title: "Laser Cut Border",
              paragraphs: [
                "Laser cutting uses a precision laser beam to cut the patch material along the exact outline of the design.",
              ],
              detailGroups: [
                {
                  label: "Advantages",
                  markerStyle: "bullet",
                  items: [
                    "Extremely precise edges",
                    "Ideal for complex shapes",
                    "Smooth and clean finish",
                  ],
                },
                {
                  label: "Limitations",
                  markerStyle: "bullet",
                  items: [
                    "Edges may require reinforcement depending on the material.",
                  ],
                },
                {
                  label: "Best Applications",
                  markerStyle: "bullet",
                  items: [
                    "custom shaped patches",
                    "modern fashion patches",
                    "detailed logo patches",
                  ],
                  note: "Laser cut patches are often used by fashion brands seeking unique patch shapes.",
                },
              ],
            },
            {
              title: "Die-Cut Border",
              paragraphs: [
                "Die-cutting uses a custom metal mold to stamp the patch into a specific shape.",
              ],
              detailGroups: [
                {
                  label: "Advantages",
                  markerStyle: "bullet",
                  items: [
                    "Perfectly consistent shapes",
                    "Ideal for mass production",
                    "Suitable for many materials",
                  ],
                },
                {
                  label: "Limitations",
                  markerStyle: "bullet",
                  items: [
                    "Requires a mold to be created, which may involve tooling costs.",
                  ],
                },
                {
                  label: "Best Applications",
                  markerStyle: "bullet",
                  items: [
                    "custom logo patches",
                    "brand patches",
                    "unique shaped patches",
                  ],
                  note: "Die-cut patches are ideal for brands that want distinctive patch designs with consistent shapes.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      sourceKey: "patches-customization-backing-options",
      title: "Backing Options",
      intro:
        "The backing type determines how the patch will be attached to garments or products. Choosing the correct backing option ensures the patch stays secure while meeting the needs of different production methods.",
      figmaNodeId: "19744:340",
      images: [
        {
          sourceKey: "patches-cust-backing-img-1",
          title: "Embroidered patch backing sample",
          imagePath:
            "import-assets/products/patches/customization-backing-embroidered-patch-samples-01.png",
          alt: "Embroidered patch backing sample on denim",
          figmaNodeId: "19744:341",
        },
        {
          sourceKey: "patches-cust-backing-img-2",
          title: "Hook and loop backing discs",
          imagePath:
            "import-assets/products/patches/customization-backing-hook-loop-discs-02.png",
          alt: "Hook and loop backing discs",
          figmaNodeId: "19744:346",
        },
        {
          sourceKey: "patches-cust-backing-img-3",
          title: "Pin back badge backing",
          imagePath:
            "import-assets/products/patches/customization-backing-pin-back-badge-03.png",
          alt: "Pin back badge backing",
          figmaNodeId: "19744:350",
        },
      ],
      blocks: [
        {
          _type: "entryListBlock",
          markerStyle: "plain",
          entries: [
            {
              title: "Sew-On Backing",
              paragraphs: [
                "Sew-on patches are stitched directly onto garments using a sewing machine or hand stitching.",
                "Sew-on patches are considered the most reliable option for patches for clothing.",
              ],
              detailGroups: [
                {
                  label: "Advantages",
                  markerStyle: "bullet",
                  items: [
                    "Strongest and most durable attachment",
                    "Suitable for repeated washing",
                    "Works on almost all fabrics",
                  ],
                },
                {
                  label: "Limitations",
                  markerStyle: "bullet",
                  items: [
                    "Requires sewing during garment production.",
                  ],
                },
                {
                  label: "Best Applications",
                  markerStyle: "bullet",
                  items: [
                    "jackets",
                    "uniforms",
                    "workwear",
                    "denim products",
                  ],
                },
              ],
            },
            {
              title: "Iron-On Backing",
              paragraphs: [
                "Iron-on patches have a heat-activated adhesive layer on the back. When heat and pressure are applied, the adhesive melts and bonds the patch to the fabric.",
                "Iron-on patches are one of the most popular types of custom patches for clothing brands.",
              ],
              detailGroups: [
                {
                  label: "Advantages",
                  markerStyle: "bullet",
                  items: [
                    "quick application",
                    "no sewing required",
                    "suitable for DIY or small runs",
                  ],
                },
                {
                  label: "Limitations",
                  markerStyle: "bullet",
                  items: [
                    "Adhesive strength may weaken after repeated washing if not reinforced with stitching.",
                  ],
                },
                {
                  label: "Best Applications",
                  markerStyle: "bullet",
                  items: [
                    "fashion apparel",
                    "casual clothing",
                    "promotional garments",
                  ],
                },
              ],
            },
            {
              title: "Velcro Backing",
              paragraphs: [
                "Velcro backing uses a hook-and-loop fastening system that allows patches to be attached and removed easily.",
                "Velcro patches are widely used in tactical and utility apparel.",
              ],
              detailGroups: [
                {
                  label: "Advantages",
                  markerStyle: "bullet",
                  items: [
                    "removable and reusable",
                    "easy replacement of patches",
                    "flexible use across garments",
                  ],
                },
                {
                  label: "Limitations",
                  markerStyle: "bullet",
                  items: [
                    "Requires a Velcro base to be sewn onto the garment first.",
                  ],
                },
                {
                  label: "Best Applications",
                  markerStyle: "bullet",
                  items: [
                    "military patches",
                    "tactical gear",
                    "uniforms",
                    "outdoor equipment",
                  ],
                },
              ],
            },
            {
              title: "Adhesive Backing",
              paragraphs: [
                "Adhesive backing uses a peel-and-stick layer on the back of the patch.",
              ],
              detailGroups: [
                {
                  label: "Advantages",
                  markerStyle: "bullet",
                  items: [
                    "quick temporary application",
                    "no sewing or heating required",
                  ],
                },
                {
                  label: "Limitations",
                  markerStyle: "bullet",
                  items: [
                    "Not recommended for long-term garment use.",
                  ],
                },
                {
                  label: "Best Applications",
                  markerStyle: "bullet",
                  items: [
                    "promotional patches",
                    "product packaging",
                    "temporary labeling.",
                  ],
                },
              ],
            },
            {
              title: "Heat Transfer Backing",
              paragraphs: [
                "Heat transfer patches are applied using a heat press that bonds the patch directly to the garment surface.",
              ],
              detailGroups: [
                {
                  label: "Advantages",
                  markerStyle: "bullet",
                  items: [
                    "smooth and lightweight finish",
                    "suitable for modern apparel",
                  ],
                },
                {
                  label: "Limitations",
                  markerStyle: "bullet",
                  items: [
                    "Requires heat press equipment.",
                  ],
                },
                {
                  label: "Best Applications",
                  markerStyle: "bullet",
                  items: [
                    "sportswear",
                    "activewear",
                    "lightweight garments",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      sourceKey: "patches-customization-size-shape",
      title: "Patch Size & Shape",
      intro:
        "The size and shape of a patch play an important role in how it appears on garments, hats, bags, and other products. Different patch sizes can affect visibility, design detail, and overall branding impact. As a professional custom patch manufacturer, we provide flexible size and shape options to meet the needs of different clothing brands and product designs.",
      figmaNodeId: "19744:361",
      images: [
        {
          sourceKey: "patches-cust-size-img-1",
          title: "Route 66 patch assortment",
          imagePath:
            "import-assets/products/patches/customization-size-route-66-patches-01.png",
          alt: "Route 66 patch assortment in multiple shapes",
          figmaNodeId: "19744:362",
        },
        {
          sourceKey: "patches-cust-size-img-2",
          title: "Leather patch grid",
          imagePath:
            "import-assets/products/patches/customization-size-leather-patch-grid-02.png",
          alt: "Leather patch grid in multiple sizes and shapes",
          figmaNodeId: "19744:365",
        },
        {
          sourceKey: "patches-cust-size-img-3",
          title: "Outdoor shaped patch set",
          imagePath:
            "import-assets/products/patches/customization-size-outdoor-shaped-patches-03.png",
          alt: "Outdoor themed shaped patch set",
          figmaNodeId: "19744:367",
        },
        {
          sourceKey: "patches-cust-size-img-4",
          title: "Soft rubber label set",
          imagePath:
            "import-assets/products/patches/customization-size-soft-rubber-labels-04.png",
          alt: "Soft rubber label set in multiple shapes",
          figmaNodeId: "19744:369",
        },
        {
          sourceKey: "patches-cust-size-img-5",
          title: "Badge outline label assortment",
          imagePath:
            "import-assets/products/patches/customization-size-badge-outline-labels-05.png",
          alt: "Badge outline label assortment in multiple shapes",
          figmaNodeId: "19744:371",
        },
        {
          sourceKey: "patches-cust-size-img-6",
          title: "Metallic rubber badge set",
          imagePath:
            "import-assets/products/patches/customization-size-metallic-rubber-badges-06.png",
          alt: "Metallic rubber badge set in multiple shapes",
          figmaNodeId: "19744:373",
        },
      ],
      blocks: [
        {
          _type: "entryListBlock",
          title: "Custom Patch Sizes",
          markerStyle: "plain",
          entries: [
            {
              paragraphs: [
                "Patches can be produced in a wide range of sizes depending on the product and logo design.",
                "Choosing the right size ensures that the patch remains visible while maintaining a balanced look on the garment.",
              ],
              detailGroups: [
                {
                  label: "Common Patch Sizes",
                  markerStyle: "bullet",
                  items: [
                    "Small patches (2–5 cm)",
                    "Medium patches (5–8 cm)",
                    "Large patches (8–12 cm or larger)",
                  ],
                },
                {
                  label: "Best Applications",
                  markerStyle: "bullet",
                  items: [
                    "Small patches — hats, caps, labels",
                    "Medium patches — sleeves, chest logos",
                    "Large patches — jacket backs and statement designs",
                  ],
                },
              ],
            },
          ],
        },
        {
          _type: "listBlock",
          markerStyle: "bullet",
          title: "Standard Patch Shapes",
          items: [
            "Many brands choose standard shapes because they provide a clean and timeless appearance.",
            "Common Shapes: rectangle patches; square patches; circle patches; oval patches.",
            "These shapes are widely used for uniform patches, brand logos, and clothing labels.",
          ],
        },
        {
          _type: "entryListBlock",
          title: "Custom Die-Cut Shapes",
          markerStyle: "plain",
          entries: [
            {
              paragraphs: [
                "Custom die-cut patches allow brands to create shapes that follow the outline of their logo or artwork.",
                "Die-cut patches are often used when brands want custom patches that stand out from standard designs.",
              ],
              detailGroups: [
                {
                  label: "Features",
                  markerStyle: "bullet",
                  items: [
                    "unique and creative patch shapes",
                    "stronger brand recognition",
                    "more distinctive product appearance",
                  ],
                },
                {
                  label: "Best Applications",
                  markerStyle: "bullet",
                  items: [
                    "fashion brands",
                    "streetwear labels",
                    "promotional patches",
                    "creative apparel designs",
                  ],
                },
              ],
            },
          ],
        },
        {
          _type: "entryListBlock",
          title: "Rounded Corners & Edge Finishing",
          markerStyle: "plain",
          entries: [
            {
              paragraphs: [
                "Rounded corners and smooth edges can improve the comfort and durability of patches.",
                "This option is often recommended for patches that will be used on garments and hats.",
              ],
              detailGroups: [
                {
                  label: "Advantages",
                  markerStyle: "bullet",
                  items: [
                    "reduces sharp edges",
                    "improves sewing durability",
                    "provides a cleaner visual appearance",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default manifest;
