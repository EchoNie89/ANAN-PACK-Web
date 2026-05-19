import type { ImageMetadata } from "astro";

export type SiteImageSource = string | ImageMetadata;

const homeImageModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/home/**/*.{png,jpg,jpeg,webp,avif,svg}",
  { eager: true },
);

const solutionImageModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/solutions/*.{png,jpg,jpeg,webp,avif,svg}",
  { eager: true },
);

const localImages = new Map<string, ImageMetadata>();

function registerImages(
  modules: Record<string, { default: ImageMetadata }>,
  directory: "home" | "solutions",
) {
  for (const [modulePath, moduleValue] of Object.entries(modules)) {
    // Strip the base directory prefix to get the relative path within assets
    const basePrefix = `../assets/${directory}/`;
    const baseIndex = modulePath.indexOf(basePrefix);
    const relativePath = baseIndex >= 0
      ? modulePath.slice(baseIndex + basePrefix.length)
      : modulePath.split("/").pop();

    if (!relativePath) continue;

    localImages.set(`/images/${directory}/${relativePath}`, moduleValue.default);
  }
}

registerImages(homeImageModules, "home");
registerImages(solutionImageModules, "solutions");

export function getLocalImage(path: string): ImageMetadata {
  const image = localImages.get(path);

  if (!image) {
    throw new Error(`Missing migrated local image for path: ${path}`);
  }

  return image;
}
