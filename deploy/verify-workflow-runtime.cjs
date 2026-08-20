const fs = require("fs");
const path = require("path");
const { chromium } = require(path.join(process.env.TEMP, "workspace-playwright", "node_modules", "playwright"));

const root = "http://101.43.51.64/ai-agent-station";
const dist = path.join(__dirname, "..", "frontend-dist");
const live = process.env.LIVE === "1";

async function verify(viewport, name) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: path.join(__dirname, "playwright-storage.json"),
    viewport
  });
  await context.addInitScript(() => localStorage.setItem("workspaceId", "personal-workspace"));
  const page = await context.newPage();
  const errors = [];
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", error => errors.push(error.message));
  if (!live) {
    await page.route(`${root}/workflows.html*`, route => route.fulfill({
      contentType: "text/html; charset=utf-8",
      body: fs.readFileSync(path.join(dist, "workflows.html"))
    }));
    await page.route(`${root}/static/css/workflow-runtime.20260818.css*`, route => route.fulfill({
      contentType: "text/css; charset=utf-8",
      body: fs.readFileSync(path.join(dist, "static", "css", "workflow-runtime.20260818.css"))
    }));
    await page.route(`${root}/static/js/workflow-runtime.20260818.js*`, route => route.fulfill({
      contentType: "application/javascript; charset=utf-8",
      body: fs.readFileSync(path.join(dist, "static", "js", "workflow-runtime.20260818.js"))
    }));
  }

  await page.goto(`${root}/workflows.html`, { waitUntil: "networkidle" });
  await page.locator(".catalog-item").first().waitFor();
  const catalogCount = await page.locator(".catalog-item").count();
  const catalogNames = await page.locator(".catalog-copy strong").allTextContents();
  const hasCodeReview = catalogNames.some(name => name.includes("代码审查"));

  await page.locator(".catalog-item", { hasText: "个人知识助手 Agent" }).click();
  await page.locator('select[name="knowledgeBaseId"]').waitFor();
  await page.waitForFunction(() => document.querySelectorAll('select[name="knowledgeBaseId"] option').length > 0);
  const knowledgeForm = await page.locator('textarea[name="question"]').isVisible();
  const knowledgeChat = await page.locator("#knowledgeChatTranscript").isVisible();
  const knowledgeNewChat = await page.getByRole("button", { name:"新对话" }).isVisible();
  await page.waitForFunction(() => /短期记忆|记忆服务暂不可用/.test(document.querySelector("#knowledgeMemoryStatus")?.textContent || ""));
  const knowledgeSessionStored = await page.evaluate(() => Object.keys(localStorage).some(key => key.startsWith("knowledgeChatSession:")));
  await page.screenshot({ path:path.join(__dirname, `workflow-runtime-knowledge-${name}.png`), fullPage:true });

  await page.locator(".catalog-item", { hasText: "CSDN 博文自动发布工作流" }).click();
  const contentForm = await page.locator('input[name="topic"]').isVisible();
  await page.screenshot({ path:path.join(__dirname, `workflow-runtime-content-${name}.png`), fullPage:true });

  await page.locator(".catalog-item", { hasText: "专题调研 Agent" }).click();
  const researchForm = await page.locator('input[name="topic"]').isVisible();
  const chain = await page.locator("#executionChain li strong").allTextContents();

  await page.locator(".catalog-item", { hasText: "服务器项目运维报告 Agent" }).click();
  await page.locator('select[name="targetId"]').waitFor();
  const opsForm = await page.locator('select[name="projectIds"][multiple]').isVisible();
  const opsTargetCount = await page.locator('select[name="targetId"] option').count();
  const opsProjectCount = await page.locator('select[name="projectIds"] option:not([disabled])').count();
  const opsLogsEnabled = await page.locator('input[name="includeLogs"]').isChecked();
  const opsRunEnabled = await page.locator('button[type="submit"]').isEnabled();
  const opsChain = await page.locator("#executionChain li strong").allTextContents();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  await page.screenshot({ path:path.join(__dirname, `workflow-runtime-ops-${name}.png`), fullPage:true });
  await page.locator(".run-item").first().click();
  await page.locator("#resultBand:not(.hidden)").waitFor();
  const reportVisible = (await page.locator("#reportViewer").innerText()).trim().length > 100;
  const reportTableCount = await page.locator("#reportViewer table").count();
  const tableLayout = await page.locator("#reportViewer").evaluate(host => {
    const wrapper = host.querySelector(".markdown-table-wrap");
    const rawTableParagraph = [...host.querySelectorAll("p")].some(item => /^\s*\|.*\|\s*$/.test(item.textContent));
    return {
      wrapperVisible:Boolean(wrapper && wrapper.getBoundingClientRect().height > 0),
      overflowX:wrapper ? getComputedStyle(wrapper).overflowX : "",
      rawTableParagraph
    };
  });
  await page.screenshot({ path:path.join(__dirname, `workflow-runtime-result-${name}.png`), fullPage:true });
  await page.locator("#copyButton").click();
  await page.getByText("结果已复制", { exact:true }).waitFor();
  const copySucceeded = true;
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#downloadButton").click()
  ]);
  const downloadSucceeded = download.suggestedFilename().endsWith(".md");
  const workspaceStorage = await page.evaluate(() => {
    const input = document.getElementById("workspaceId");
    input.dispatchEvent(new Event("change", { bubbles:true }));
    return {
      value:input.value,
      workflow:localStorage.getItem("workflowWorkspaceId"),
      shared:localStorage.getItem("workspaceId")
    };
  });
  await browser.close();
  return { name, catalogCount, catalogNames, hasCodeReview, knowledgeForm, knowledgeChat, knowledgeNewChat, knowledgeSessionStored, contentForm, researchForm,
    opsForm, opsTargetCount, opsProjectCount, opsLogsEnabled, opsRunEnabled, opsChain,
    chain, reportVisible, reportTableCount, tableLayout, copySucceeded, downloadSucceeded, workspaceStorage, overflow, errors };
}

async function verifyDashboard() {
  const browser = await chromium.launch({ headless:true });
  const context = await browser.newContext({ storageState:path.join(__dirname, "playwright-storage.json"), viewport:{ width:1440, height:900 } });
  const page = await context.newPage();
  const errors = [];
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", error => errors.push(error.message));
  if (!live) {
    await page.route(`${root}/static/js/index.workspace-platform.20260818.js*`, route => route.fulfill({
      contentType:"application/javascript; charset=utf-8",
      body:fs.readFileSync(path.join(dist, "static", "js", "index.workspace-platform.20260818.js"))
    }));
  }
  await page.goto(`${root}/dashboard`, { waitUntil:"networkidle" });
  await page.locator("#workspaceRealDashboard").waitFor();
  const actions = await page.locator(".workspace-primary-action strong").allTextContents();
  const sidebarText = await page.locator(".workspace-sidebar").innerText();
  const result = {
    name:"dashboard", actions,
    hasWorkflowEntry:sidebarText.includes("工作流运行"),
    hasAssistantEntry:sidebarText.includes("项目助手"),
    hasContentEntry:sidebarText.includes("内容自动化"),
    errors
  };
  await page.screenshot({ path:path.join(__dirname, "workflow-runtime-dashboard.png"), fullPage:true });
  await browser.close();
  return result;
}

(async () => {
  const results = [];
  results.push(await verify({ width:1440, height:900 }, "desktop"));
  results.push(await verify({ width:390, height:844 }, "mobile"));
  results.push(await verifyDashboard());
  console.log(JSON.stringify(results, null, 2));
  const runtimeFailed = results.slice(0, 2).some(result => result.catalogCount !== 5 || result.hasCodeReview
    || !result.knowledgeForm || !result.knowledgeChat || !result.knowledgeNewChat || !result.knowledgeSessionStored
    || !result.contentForm || !result.researchForm || !result.opsForm
    || result.opsTargetCount < 1 || result.opsProjectCount !== 4 || !result.opsLogsEnabled || !result.opsRunEnabled
    || !result.opsChain.includes("只读 MCP") || !result.opsChain.includes("报告归档")
    || result.workspaceStorage.value !== "85374287" || result.workspaceStorage.workflow !== "85374287"
    || result.workspaceStorage.shared !== "personal-workspace"
    || !result.reportVisible || result.reportTableCount < 1 || !result.tableLayout.wrapperVisible
    || result.tableLayout.overflowX !== "auto" || result.tableLayout.rawTableParagraph
    || !result.copySucceeded || !result.downloadSucceeded || result.overflow || result.errors.length);
  const dashboard = results[2];
  if (runtimeFailed || dashboard.actions.length !== 1 || dashboard.actions[0] !== "工作流运行" || !dashboard.hasWorkflowEntry || dashboard.hasAssistantEntry || dashboard.hasContentEntry || dashboard.errors.length) process.exit(1);
})().catch(error => { console.error(error); process.exit(1); });
