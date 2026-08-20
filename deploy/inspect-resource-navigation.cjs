const path = require("path");
const { chromium } = require(path.join(process.env.TEMP, "workspace-playwright", "node_modules", "playwright"));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: path.join(__dirname, "playwright-storage.json"),
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("http://101.43.51.64/ai-agent-station/dashboard?verify=resource-nav", { waitUntil: "networkidle" });

  const before = await page.locator(".semi-nav-item, .semi-navigation-item").evaluateAll(items => items.map(item => ({
    text: item.textContent.replace(/\s+/g, " ").trim(),
    className: item.className,
    expanded: item.getAttribute("aria-expanded"),
    visible: Boolean(item.offsetWidth || item.offsetHeight || item.getClientRects().length)
  })));
  const resource = page.getByText("运行资源", { exact: true }).first();
  if (await resource.count()) await resource.click();
  await page.waitForTimeout(1000);
  const after = await page.locator(".semi-nav-item, .semi-navigation-item").evaluateAll(items => items.map(item => ({
    text: item.textContent.replace(/\s+/g, " ").trim(),
    className: item.className,
    expanded: item.getAttribute("aria-expanded"),
    visible: Boolean(item.offsetWidth || item.offsetHeight || item.getClientRects().length)
  })));
  await page.screenshot({ path: path.join(__dirname, "dashboard-resources-clicked.png"), fullPage: true });
  console.log(JSON.stringify({ before, after, errors }, null, 2));
  await browser.close();
})();
