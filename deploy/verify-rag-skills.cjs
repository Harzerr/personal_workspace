const path = require("path");
const { chromium } = require(path.join(process.env.TEMP, "workspace-playwright", "node_modules", "playwright"));

const root = "http://101.43.51.64/ai-agent-station";
const storageState = path.join(__dirname, "playwright-storage.json");

async function inspectPage(context, viewportName) {
  console.log(`start:${viewportName}`);
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", error => errors.push(error.message));

  await page.goto(`${root}/knowledge-bases.html`, { waitUntil: "domcontentloaded" });
  await page.getByText("202", { exact: true }).first().waitFor();
  console.log(`knowledge-ready:${viewportName}`);
  const knowledgeRow = page.locator(".knowledge-table tbody tr", { hasText: "个人项目知识库" });
  await knowledgeRow.getByRole("button", { name: "装配", exact: true }).click();
  const knowledgeBindingVisible = await page.getByText("个人知识助手 Agent", { exact: true }).isVisible();
  await page.locator("#closeKnowledgeBaseDetailButton").click();
  const knowledge = {
    heading: await page.getByRole("heading", { name: "知识库管理", exact: true }).isVisible(),
    defaultBase: await knowledgeRow.locator("strong", { hasText: "个人项目知识库" }).isVisible(),
    agentBinding: knowledgeBindingVisible,
    upload: await page.getByText("选择文件夹", { exact: true }).isVisible(),
    ready: await page.getByText("索引完整", { exact: true }).isVisible(),
    sources: await page.locator(".source-item").count(),
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
  };
  await page.screenshot({ path: path.join(__dirname, `knowledge-bases-${viewportName}.png`), fullPage: true });

  await page.goto(`${root}/skills.html`, { waitUntil: "domcontentloaded" });
  console.log(`skill-page:${viewportName}`);
  const skillRow = page.locator(".skill-table tbody tr", { hasText: "证据引用与不确定性控制" });
  await skillRow.locator("strong", { hasText: "证据引用与不确定性控制" }).waitFor();
  console.log(`skill-ready:${viewportName}`);
  await skillRow.getByRole("button", { name: "装配", exact: true }).click();
  const skillBindingVisible = await page.getByText("个人知识助手 Agent", { exact: true }).isVisible();
  await page.locator("#closeSkillDetailButton").click();
  const skills = {
    skillVisible: await page.getByText("证据引用与不确定性控制", { exact: true }).first().isVisible(),
    bindingVisible: skillBindingVisible,
    heading: await page.getByRole("heading", { name: "Skill 管理", exact: true }).isVisible(),
    listHeight: Math.round((await page.locator(".management-table-wrap").boundingBox())?.height || 0),
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
  };
  await page.screenshot({ path: path.join(__dirname, `skills-${viewportName}.png`), fullPage: true });
  await page.close();
  return { knowledge, skills, errors };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const desktop = await browser.newContext({ storageState, viewport: { width: 1440, height: 900 } });
  const mobile = await browser.newContext({ storageState, viewport: { width: 390, height: 844 }, isMobile: true });
  const desktopResult = await inspectPage(desktop, "desktop");
  const mobileResult = await inspectPage(mobile, "mobile");

  const platformPage = await desktop.newPage();
  platformPage.setDefaultTimeout(15000);
  const platformErrors = [];
  platformPage.on("console", message => { if (message.type() === "error") platformErrors.push(message.text()); });
  await platformPage.goto(`${root}/dashboard`, { waitUntil: "domcontentloaded" });
  const resource = platformPage.getByText("运行资源", { exact: true }).first();
  if (await resource.count()) await resource.click();
  await platformPage.waitForTimeout(500);
  const navigation = {
    knowledge: await platformPage.getByText("知识库管理", { exact: true }).first().isVisible(),
    legacyRag: await platformPage.getByText("RAG 管理", { exact: true }).count(),
    skills: await platformPage.getByText("Skill 管理", { exact: true }).first().isVisible(),
    prompt: await platformPage.getByText("Prompt 配置", { exact: true }).first().isVisible(),
    mcp: await platformPage.getByText("MCP 工具", { exact: true }).first().isVisible()
  };
  await platformPage.screenshot({ path: path.join(__dirname, "dashboard-rag-skill-navigation.png"), fullPage: true });

  await platformPage.goto(`${root}/personal-workspace`, { waitUntil: "domcontentloaded" });
  await platformPage.getByRole("heading", { name: "询问项目助手" }).waitFor();
  const assistant = {
    title: await platformPage.getByRole("heading", { name: "项目助手", exact: true }).isVisible(),
    uploadCardVisible: await platformPage.getByRole("heading", { name: "项目上下文", exact: true }).isVisible(),
    focusedLayout: await platformPage.locator(".workspace-assistant-focus").count(),
    knowledgePicker: await platformPage.locator(".workspace-assistant-kb-picker").count(),
    knowledgePickerValue: await platformPage.locator(".workspace-assistant-kb-picker select").inputValue(),
    width: Math.round((await platformPage.locator(".workspace-assistant-card").boundingBox())?.width || 0),
    overflow: await platformPage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
  };
  await platformPage.screenshot({ path: path.join(__dirname, "project-assistant-desktop.png"), fullPage: true });
  const result = { desktopResult, mobileResult, navigation, assistant, platformErrors };
  console.log(JSON.stringify(result, null, 2));
  await Promise.race([browser.close(), new Promise(resolve => setTimeout(resolve, 5000))]);
  process.exit(0);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
