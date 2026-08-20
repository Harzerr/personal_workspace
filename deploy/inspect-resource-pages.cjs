const path = require("path");
const { chromium } = require(path.join(process.env.TEMP, "workspace-playwright", "node_modules", "playwright"));

const root = "http://101.43.51.64/ai-agent-station";
const pages = [
  ["models", "/client-model-management"],
  ["model-apis", "/ai-client-api-management"],
  ["knowledge-bases-current", "/knowledge-bases.html"],
  ["skills-current", "/skills.html"]
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: path.join(__dirname, "playwright-storage.json"),
    viewport: { width: 1440, height: 900 }
  });
  const results = {};
  for (const [name, url] of pages) {
    const page = await context.newPage();
    const errors = [];
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(root + url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    results[name] = await page.evaluate(() => {
      const visible = element => {
        const box = element.getBoundingClientRect();
        return box.width > 0 && box.height > 0;
      };
      const box = element => {
        if (!element) return null;
        const value = element.getBoundingClientRect();
        return { x: Math.round(value.x), y: Math.round(value.y), width: Math.round(value.width), height: Math.round(value.height) };
      };
      return {
        title: document.title,
        headings: [...document.querySelectorAll("h1,h2,h3,h4")].filter(visible).slice(0, 12).map(item => item.textContent.trim()),
        sidebar: box(document.querySelector(".workspace-sidebar")),
        header: box(document.querySelector("header,.semi-layout-header")),
        main: box(document.querySelector("main,.semi-layout-content")),
        cards: document.querySelectorAll(".semi-card").length,
        tables: document.querySelectorAll(".semi-table-container").length,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      };
    });
    results[name].errors = errors;
    await page.screenshot({ path: path.join(__dirname, `${name}.png`), fullPage: true });
    await page.close();
  }
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
