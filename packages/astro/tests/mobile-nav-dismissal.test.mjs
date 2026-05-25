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

test("mobile navigation closes through outside pointer interaction without locking page scroll", () => {
  const source = readSource("src/components/sections/Header.astro");

  assert.match(
    source,
    /class="fixed inset-x-0 bottom-0 top-16 z-40 bg-black\/18 backdrop-blur-\[1px\]"/,
    "Expected the mobile nav backdrop to start below the 64px mobile header so the menu trigger stays visible",
  );

  assert.match(
    source,
    /mobileNavBackdrop\.addEventListener\("click", closeMobileNav\)/,
    "Expected the mobile nav backdrop to reuse the shared close handler when clicking outside the panel",
  );

  assert.match(
    source,
    /document\.addEventListener\("pointerdown", \(event\) => \{/,
    "Expected the mobile nav to listen for outside pointer interactions while open",
  );

  assert.match(
    source,
    /target\.closest\("\[data-mobile-nav-panel\]"\)/,
    "Expected the outside-pointer handler to ignore interactions inside the mobile nav panel",
  );

  assert.match(
    source,
    /target\.closest\("\[data-mobile-nav-trigger\]"\)/,
    "Expected the outside-pointer handler to ignore interactions on the menu trigger itself",
  );

  assert.doesNotMatch(
    source,
    /document\.documentElement\.classList\.toggle\("overflow-hidden", isOpen\)/,
    "Expected the mobile nav to avoid locking the root element scroll state when opening",
  );

  assert.doesNotMatch(
    source,
    /document\.body\.classList\.toggle\("overflow-hidden", isOpen\)/,
    "Expected the mobile nav to avoid locking the body scroll state when opening",
  );

  assert.match(
    source,
    /closeMobileNav\(\);/,
    "Expected outside-click dismissal to reuse the shared mobile menu close handler",
  );
});

test("mobile navigation manages focus and keeps keyboard users inside the open panel", () => {
  const source = readSource("src/components/sections/Header.astro");

  assert.match(
    source,
    /aria-label="Open navigation menu"/,
    "Expected the trigger to expose a specific accessible name before the menu opens",
  );

  assert.match(
    source,
    /mobileNavTrigger\.setAttribute\(\s*"aria-label",\s*isOpen \? "Close navigation menu" : "Open navigation menu",\s*\)/,
    "Expected the trigger accessible name to switch between open and close states",
  );

  assert.match(
    source,
    /const inertTargets = Array\.from\(document\.body\.children\)\.filter\(/,
    "Expected the mobile nav to identify sibling page regions that should become inert while the menu is open",
  );

  assert.match(
    source,
    /element\.inert = isInert;/,
    "Expected the mobile nav to make non-header page regions inert while the drawer is open",
  );

  assert.match(
    source,
    /window\.requestAnimationFrame\(\(\) => \{\s*const \[firstFocusable\] = getMobileNavFocusables\(\);\s*firstFocusable\?\.focus\(\);/s,
    "Expected the mobile nav to move focus into the first interactive item when it opens",
  );

  assert.match(
    source,
    /mobileNavTrigger\.focus\(\);/,
    "Expected the mobile nav to restore focus to the trigger when it closes",
  );

  assert.match(
    source,
    /if \(event\.key !== "Tab"\) return;/,
    "Expected the mobile nav keyboard handler to intercept Tab while the menu is open",
  );

  assert.match(
    source,
    /if \(event\.shiftKey && activeElement === firstFocusable\) \{\s*event\.preventDefault\(\);\s*lastFocusable\.focus\(\);/s,
    "Expected reverse tabbing to loop to the end of the menu instead of escaping the open drawer",
  );

  assert.match(
    source,
    /if \(!event\.shiftKey && activeElement === lastFocusable\) \{\s*event\.preventDefault\(\);\s*firstFocusable\.focus\(\);/s,
    "Expected forward tabbing to loop back to the start of the menu instead of reaching page content behind it",
  );
});

test("mobile navigation keeps products solutions and services neutral by default but restores accent color for active items", () => {
  const source = readSource("src/components/sections/Header.astro");
  const mobilePanelSource = source.match(/<nav\s+id="mobile-navigation"[\s\S]*?<\/nav>/)?.[0] ?? "";

  assert.match(
    mobilePanelSource,
    /activeNav === "Products" \? "text-brand-dark" : "text-ink"/,
    "Expected the products summary to stay neutral by default and switch to the darker accent color when active",
  );

  assert.match(
    mobilePanelSource,
    /activeNav === "Solutions" \? "text-brand-dark" : "text-ink"/,
    "Expected the solutions summary to stay neutral by default and switch to the darker accent color when active",
  );

  assert.match(
    mobilePanelSource,
    /activeNav === "Services" \? "text-brand-dark" : "text-ink"/,
    "Expected the services summary to stay neutral by default and switch to the darker accent color when active",
  );

  assert.match(
    mobilePanelSource,
    /isCurrentPath\(product\.href\) \? "bg-brand-soft\/80 text-brand-dark" : "text-text-main hover:bg-surface-muted"/,
    "Expected active product links to regain the higher-contrast accent treatment while keeping neutral defaults",
  );

  assert.match(
    mobilePanelSource,
    /isCurrentPath\(solution\.href\) \? "bg-brand-soft\/80 text-brand-dark" : "text-text-main hover:bg-surface-muted"/,
    "Expected active solution links to regain the higher-contrast accent treatment while keeping neutral defaults",
  );

  assert.match(
    mobilePanelSource,
    /isCurrentPath\(service\.href\) \? "bg-brand-soft\/80 text-brand-dark" : "text-text-main hover:bg-surface-muted"/,
    "Expected active service links to regain the higher-contrast accent treatment while keeping neutral defaults",
  );

  assert.match(
    mobilePanelSource,
    /activeNav === item\.label \? "bg-brand-soft\/80 text-brand-dark" : "text-ink hover:bg-surface-muted"/,
    "Expected regular top-level mobile nav links to regain the higher-contrast accent treatment when they represent the current page",
  );
});
