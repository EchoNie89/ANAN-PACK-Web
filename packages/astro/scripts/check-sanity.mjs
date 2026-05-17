import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "44m142o0",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

// 查询所有 product 文档
const products = await client.fetch(`*[_type == "product"]{slug, title}`);
console.log("All products:", JSON.stringify(products, null, 2));

// 查询 labels product
const labels = await client.fetch(`*[_type == "product" && slug == "labels"][0]{slug, title, showcaseGroups}`);
console.log("Labels product:", JSON.stringify(labels, null, 2));
