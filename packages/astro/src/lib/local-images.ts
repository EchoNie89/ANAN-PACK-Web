import type { ImageMetadata } from "astro";

export type SiteImageSource = string | ImageMetadata;

const localImageModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/**/*.{png,jpg,jpeg,webp,avif,svg}",
  { eager: true },
);

const localImages = new Map<string, ImageMetadata>();

for (const [modulePath, moduleValue] of Object.entries(localImageModules)) {
  const basePrefix = "../assets/";
  const baseIndex = modulePath.indexOf(basePrefix);
  const relativePath = baseIndex >= 0
    ? modulePath.slice(baseIndex + basePrefix.length)
    : modulePath.split("/").slice(-2).join("/");

  if (!relativePath) continue;

  localImages.set(`/images/${relativePath}`, moduleValue.default);
}

export function getLocalImage(path: string): ImageMetadata {
  const image = localImages.get(path);

  if (!image) {
    throw new Error(`Missing migrated local image for path: ${path}`);
  }

  return image;
}

export function resolveLocalImageSource(path: string): SiteImageSource {
  return localImages.get(path) ?? path;
}
