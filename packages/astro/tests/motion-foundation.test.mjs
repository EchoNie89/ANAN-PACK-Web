import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const testsDir = dirname(fileURLToPath(import.meta.url));
const astroDir = join(testsDir, "..");

function readSource(relativePath) {
  return readFileSync(join(astroDir, relativePath), "utf8");
}

test("global motion foundation keeps the low-cost animation primitives wired in", () => {
  const layoutSource = readSource("src/layouts/Layout.astro");
  const globalStyles = readSource("src/styles/global.css");

  assert.match(globalStyles, /@keyframes motion-fade-up/);
  assert.match(globalStyles, /\[data-reveal\]\.is-visible/);
  assert.match(globalStyles, /motion-hover-card/);

  assert.match(layoutSource, /document\.documentElement\.dataset\.js = "true"/);
  assert.match(layoutSource, /IntersectionObserver/);
  assert.match(layoutSource, /\[data-reveal\]/);
});

test("home and solution pages opt into the approved motion hooks", () => {
  const heroSource = readSource("src/components/sections/Hero.astro");
  const solutionHeroSource = readSource("src/components/sections/solutions/SolutionHero.astro");
  const valuePropsSource = readSource("src/components/sections/ValueProps.astro");
  const testimonialsSource = readSource("src/components/sections/Testimonials.astro");
  const solutionChallengesSource = readSource("src/components/sections/solutions/SolutionChallenges.astro");
  const testimonialCardSource = readSource("src/components/ui/TestimonialCard.astro");

  assert.match(heroSource, /motion-enter/);
  assert.match(heroSource, /--motion-delay:/);

  assert.match(solutionHeroSource, /motion-enter/);
  assert.match(solutionHeroSource, /--motion-delay:/);
  assert.match(solutionHeroSource, /md:h-\[474px\]/);

  assert.match(valuePropsSource, /data-reveal/);
  assert.match(testimonialsSource, /data-reveal/);
  assert.match(solutionChallengesSource, /data-reveal/);
  assert.match(testimonialCardSource, /motion-hover-card/);
});

test("about and services pages opt into the same motion system", () => {
  const aboutHeroSource = readSource("src/components/sections/about/AboutHero.astro");
  const aboutReasonsSource = readSource("src/components/sections/about/AboutReasons.astro");
  const aboutStorySource = readSource("src/components/sections/about/AboutStory.astro");
  const servicesHeroSource = readSource("src/components/sections/services/ServicesHero.astro");
  const faqHeroSource = readSource("src/components/sections/services/FAQHero.astro");
  const sourcingComparisonSource = readSource("src/components/sections/services/SourcingComparison.astro");
  const serviceProcessSource = readSource("src/components/sections/services/ServiceProcess.astro");
  const warehousingSource = readSource("src/components/sections/services/WarehousingSection.astro");
  const deliverySource = readSource("src/components/sections/services/DeliverySection.astro");
  const faqGroupsSource = readSource("src/components/sections/services/FAQGroups.astro");

  assert.match(aboutHeroSource, /motion-enter/);
  assert.match(aboutHeroSource, /--motion-delay:/);
  assert.match(aboutReasonsSource, /motion-hover-card/);
  assert.match(aboutStorySource, /data-reveal/);

  assert.match(servicesHeroSource, /motion-enter/);
  assert.match(servicesHeroSource, /lg:h-\[calc\(100dvh-88px\)\]/);
  assert.match(faqHeroSource, /motion-enter/);
  assert.match(faqHeroSource, /lg:h-\[calc\(100dvh-88px\)\]/);
  assert.match(sourcingComparisonSource, /motion-hover-card/);
  assert.match(serviceProcessSource, /data-reveal/);
  assert.match(warehousingSource, /motion-hover-card/);
  assert.match(deliverySource, /data-reveal/);
  assert.match(faqGroupsSource, /data-reveal/);
});

test("product pages opt into the same motion system", () => {
  const productHeroSource = readSource("src/components/sections/products/ProductHero.astro");
  const productProcessSource = readSource("src/components/sections/products/ProductProcess.astro");
  const productApplicationsSource = readSource("src/components/sections/products/ProductApplications.astro");
  const productCaseStudySource = readSource("src/components/sections/products/ProductCaseStudy.astro");

  assert.match(productHeroSource, /motion-enter/);
  assert.match(productHeroSource, /--motion-delay:/);
  assert.match(productHeroSource, /md:h-\[474px\]/);

  assert.match(productProcessSource, /data-reveal/);
  assert.match(productProcessSource, /motion-hover-card/);
  assert.match(productApplicationsSource, /data-reveal/);
  assert.match(productApplicationsSource, /motion-hover-card/);
  assert.match(productCaseStudySource, /data-reveal/);
});
