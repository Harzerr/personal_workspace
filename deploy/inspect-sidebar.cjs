const path = require("path");
const { chromium } = require(path.join(process.env.TEMP, "workspace-playwright", "node_modules", "playwright"));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: path.join(__dirname, "playwright-storage.json"),
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  await page.goto("http://101.43.51.64/ai-agent-station/dashboard", { waitUntil: "networkidle" });
  await page.locator(".workspace-sidebar").waitFor();
  const state = await page.evaluate(() => {
    const sidebar = document.querySelector(".workspace-sidebar");
    return {
      sidebar: {
        className: sidebar?.className,
        width: sidebar?.getBoundingClientRect().width,
        html: sidebar?.outerHTML.slice(0, 4000)
      },
      controls: [...document.querySelectorAll("button,[role=button]")].map(control => ({
        text: control.textContent.trim(),
        title: control.getAttribute("title"),
        ariaLabel: control.getAttribute("aria-label"),
        className: control.className,
        html: control.outerHTML.slice(0, 800)
      })),
      leftIcons: [...document.querySelectorAll('[role="img"]')].map(icon => {
        const rect = icon.getBoundingClientRect();
        const parent = icon.parentElement;
        return {
          label: icon.getAttribute("aria-label"), x: Math.round(rect.x), y: Math.round(rect.y),
          parentTag: parent?.tagName, parentClass: parent?.className,
          parentTitle: parent?.getAttribute("title"), parentText: parent?.textContent.trim()
        };
      }).filter(icon => icon.x < 360)
    };
  });
  console.log(JSON.stringify(state, null, 2));
  await page.screenshot({ path: path.join(__dirname, "sidebar-expanded.png"), fullPage: true });
  await page.locator('button:has([aria-label="menu"])').click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(__dirname, "sidebar-collapsed.png"), fullPage: true });
  const collapsed = await page.evaluate(() => {
    const navigation = document.querySelector(".semi-navigation");
    const sidebar = document.querySelector(".workspace-sidebar") || navigation?.parentElement?.parentElement;
    const items = [...(navigation?.querySelectorAll(".semi-navigation-item") || [])];
    return {
      sidebarClass: sidebar?.className,
      width: sidebar?.getBoundingClientRect().width,
      logo: sidebar?.firstElementChild?.outerHTML,
      items: items.map(item => ({
        text: item.textContent.trim(), className: item.className,
        box: (({ x, y, width, height }) => ({ x, y, width, height }))(item.getBoundingClientRect()),
        iconBox: item.querySelector('[role="img"]')?.getBoundingClientRect().toJSON()
      }))
    };
  });
  console.log(JSON.stringify({ collapsed }, null, 2));
  const secondItem = page.locator(".workspace-sidebar-collapsed .semi-navigation-item").nth(1);
  await secondItem.hover();
  await page.waitForTimeout(180);
  const tooltip = await secondItem.evaluate(item => {
    const style = getComputedStyle(item, "::after");
    return { content: style.content, opacity: style.opacity };
  });
  await page.screenshot({ path: path.join(__dirname, "sidebar-collapsed-tooltip.png"), fullPage: true });
  await page.locator(".workspace-sidebar-toggle").click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(__dirname, "sidebar-restored.png"), fullPage: true });
  const restored = await page.evaluate(() => ({
    sidebarWidth: document.querySelector(".workspace-sidebar")?.getBoundingClientRect().width,
    visibleLabels: [...document.querySelectorAll(".workspace-sidebar .semi-navigation-item-text")]
      .filter(label => getComputedStyle(label).display !== "none").length,
    toggleLabel: document.querySelector(".workspace-sidebar-toggle")?.getAttribute("aria-label"),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  }));
  console.log(JSON.stringify({ tooltip, restored }, null, 2));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
