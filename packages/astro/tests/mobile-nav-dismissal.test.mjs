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

test("mobile navigation keeps products solutions and services neutral by default but restores accent color for active items", () => {
  const source = readSource("src/components/sections/Header.astro");
  const mobilePanelSource = source.match(/<nav\s+id="mobile-navigation"[\s\S]*?<\/nav>/)?.[0] ?? "";

  assert.match(
    mobilePanelSource,
    /activeNav === "Products" \? "text-brand" : "text-ink"/,
    "Expected the products summary to stay neutral by default and switch to the accent color when active",
  );

  assert.match(
    mobilePanelSource,
    /activeNav === "Solutions" \? "text-brand" : "text-ink"/,
    "Expected the solutions summary to stay neutral by default and switch to the accent color when active",
  );

  assert.match(
    mobilePanelSource,
    /activeNav === "Services" \? "text-brand" : "text-ink"/,
    "Expected the services summary to stay neutral by default and switch to the accent color when active",
  );

  assert.match(
    mobilePanelSource,
    /isCurrentPath\(product\.href\) \? "bg-brand-soft\/60 text-brand" : "text-text-main hover:bg-surface-muted"/,
    "Expected active product links to regain the accent background and text color while keeping neutral defaults",
  );

  assert.match(
    mobilePanelSource,
    /isCurrentPath\(solution\.href\) \? "bg-brand-soft\/60 text-brand" : "text-text-main hover:bg-surface-muted"/,
    "Expected active solution links to regain the accent background and text color while keeping neutral defaults",
  );

  assert.match(
    mobilePanelSource,
    /isCurrentPath\(service\.href\) \? "bg-brand-soft\/60 text-brand" : "text-text-main hover:bg-surface-muted"/,
    "Expected active service links to regain the accent background and text color while keeping neutral defaults",
  );

  assert.match(
    mobilePanelSource,
    /activeNav === item\.label \? "bg-brand-soft\/60 text-brand" : "text-ink hover:bg-surface-muted"/,
    "Expected regular top-level mobile nav links to regain the accent treatment when they represent the current page",
  );
});
