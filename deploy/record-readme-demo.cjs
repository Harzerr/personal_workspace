const fs = require("fs");
const os = require("os");
const path = require("path");
const { chromium } = require(path.join(process.env.TEMP, "workspace-playwright", "node_modules", "playwright"));

const root = "http://101.43.51.64/ai-agent-station";
const storageState = path.join(__dirname, "playwright-storage.json");
const outputDir = path.join(__dirname, "..", "docs", "demo");
const rawVideoDir = fs.mkdtempSync(path.join(os.tmpdir(), "personal-workspace-video-"));
const warmedState = path.join(rawVideoDir, "demo-storage.json");
const outputWebm = path.join(outputDir, "personal-workspace-demo.webm");

const pause = (page, milliseconds) => page.waitForTimeout(milliseconds);

async function configureContext(context) {
  await context.addInitScript(() => {
    localStorage.setItem("workspaceId", "personal-workspace");
    localStorage.setItem("workflowWorkspaceId", "85374287");
    localStorage.setItem("knowledgeWorkspaceId", "personal-workspace");
  });
}

async function warmKnowledgeConversation(browser) {
  const context = await browser.newContext({ storageState, viewport: { width: 1440, height: 900 } });
  await configureContext(context);
  const page = await context.newPage();
  await page.goto(`${root}/workflows.html?demo=warmup`, { waitUntil: "networkidle" });
  await page.locator(".catalog-item", { hasText: "个人知识助手 Agent" }).click();
  await page.locator("#knowledgeChatTranscript").waitFor();
  await page.getByRole("button", { name: "新对话" }).click();
  await page.getByText("开始新的对话", { exact: true }).waitFor();
  await page.locator('textarea[name="question"]').fill("这个项目的混合检索使用什么融合算法？");
  await page.getByRole("button", { name: "发送" }).click();
  await page.waitForFunction(() => {
    const answer = document.querySelector(".knowledge-message.assistant");
    return answer && !answer.classList.contains("pending") && !answer.classList.contains("failed");
  }, null, { timeout: 240000 });
  await page.locator(".knowledge-message-references summary").waitFor({ timeout: 30000 });
  await context.storageState({ path: warmedState });
  const answerLength = (await page.locator(".knowledge-message.assistant .knowledge-message-content").innerText()).trim().length;
  const referenceCount = await page.locator(".knowledge-message-references li").count();
  await context.close();
  return { answerLength, referenceCount };
}

async function showCaption(page, eyebrow, title) {
  await page.evaluate(({ eyebrow, title }) => {
    let caption = document.getElementById("readme-demo-caption");
    if (!caption) {
      caption = document.createElement("div");
      caption.id = "readme-demo-caption";
      caption.innerHTML = "<span></span><strong></strong>";
      document.body.append(caption);
      const style = document.createElement("style");
      style.textContent = `
        #readme-demo-caption {
          position: fixed; left: 304px; bottom: 24px; z-index: 2147483647;
          min-width: 310px; max-width: 620px; padding: 12px 16px;
          color: #f8fafc; background: rgba(15, 23, 42, .94);
          border-left: 4px solid #22c55e; border-radius: 6px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, .22);
          font-family: Inter, "Microsoft YaHei", sans-serif; pointer-events: none;
        }
        #readme-demo-caption span { display:block; color:#86efac; font-size:11px; font-weight:700; text-transform:uppercase; }
        #readme-demo-caption strong { display:block; margin-top:3px; font-size:18px; line-height:1.45; letter-spacing:0; }
      `;
      document.head.append(style);
    }
    caption.querySelector("span").textContent = eyebrow;
    caption.querySelector("strong").textContent = title;
    caption.animate([
      { opacity: 0, transform: "translateY(10px)" },
      { opacity: 1, transform: "translateY(0)" }
    ], { duration: 260, easing: "ease-out", fill: "forwards" });
  }, { eyebrow, title });
}

async function highlightedClick(page, locator) {
  await locator.scrollIntoViewIfNeeded();
  await locator.hover();
  await locator.evaluate(element => {
    element.style.transition = "box-shadow 160ms ease";
    element.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, .34)";
  });
  await pause(page, 500);
  await locator.click();
  await pause(page, 900);
}

async function recordDemo(browser) {
  fs.mkdirSync(outputDir, { recursive: true });
  const context = await browser.newContext({
    storageState: warmedState,
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: rawVideoDir, size: { width: 1280, height: 720 } }
  });
  await configureContext(context);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });

  await page.goto(`${root}/dashboard?demo=readme`, { waitUntil: "networkidle" });
  await page.locator("#workspaceRealDashboard").waitFor();
  await showCaption(page, "Personal AI Workspace", "运行中心聚合 Agent、模型、知识与执行历史");
  await pause(page, 3200);

  const workflowEntry = page.locator(".workspace-primary-action").first();
  await highlightedClick(page, workflowEntry);
  await page.locator(".catalog-item").first().waitFor();
  await showCaption(page, "01 · Workflow Runtime", "启用的 Agent 编排自动生成工作流交互界面");
  await pause(page, 3000);

  await highlightedClick(page, page.locator(".catalog-item", { hasText: "个人知识助手 Agent" }));
  await page.locator(".knowledge-message.assistant").waitFor({ timeout: 30000 });
  await showCaption(page, "02 · Knowledge Agent", "混合检索、引用溯源与长短期记忆协同问答");
  const references = page.locator(".knowledge-message-references summary").last();
  if (await references.count()) await highlightedClick(page, references);
  await pause(page, 4200);

  await highlightedClick(page, page.locator(".catalog-item", { hasText: "专题调研 Agent" }));
  await page.locator('input[name="topic"]').fill("可编排 Agent 工作流平台的工程实践");
  await showCaption(page, "03 · Professional Workflow", "通用专题输入驱动策展、执行、质检与归档链路");
  await pause(page, 3600);

  await highlightedClick(page, page.locator(".catalog-item", { hasText: "服务器项目运维报告 Agent" }));
  await page.locator('select[name="projectIds"]').waitFor();
  await showCaption(page, "04 · Operations Workflow", "只读 MCP 采集服务器项目状态并生成可审计报告");
  await pause(page, 3200);
  const existingRun = page.locator(".run-item").first();
  if (await existingRun.count()) {
    await highlightedClick(page, existingRun);
    await page.locator("#resultBand:not(.hidden)").waitFor();
    await showCaption(page, "Structured Output", "运行结果支持 Markdown 表格、证据来源、复制与导出");
    await pause(page, 4500);
  }

  await highlightedClick(page, page.locator(".catalog-item", { hasText: "CSDN 博文自动发布工作流" }));
  await page.locator('input[name="topic"]').fill("可编排 Agent 工作流的工程实践");
  const tags = page.locator('input[name="tags"]');
  if (await tags.count()) await tags.fill("Agent, RAG, 工作流");
  await showCaption(page, "05 · Content Automation", "取材、撰写、独立质检、返工与发布由编排配置驱动");
  await pause(page, 3500);

  await page.goto(`${root}/agent-list?demo=readme`, { waitUntil: "networkidle" });
  await showCaption(page, "06 · System Assembly", "Agent、执行角色、模型 API 与 MCP 独立装配");
  await pause(page, 3300);

  await page.goto(`${root}/client-management?demo=readme`, { waitUntil: "networkidle" });
  await showCaption(page, "Role-based Clients", "每个工作流角色可绑定独立 Prompt、模型与工具");
  await pause(page, 3200);

  await page.goto(`${root}/client-model-management?demo=readme`, { waitUntil: "networkidle" });
  await showCaption(page, "Model Routing", "模型作为运行资源复用，无需写死在具体 Agent 中");
  await pause(page, 3600);

  await page.goto(`${root}/workflows.html?demo=complete`, { waitUntil: "networkidle" });
  await page.locator(".catalog-item").first().waitFor();
  await showCaption(page, "Personal AI Workspace", "从资源装配到工作流运行，形成可观测的 Agent 自动化闭环");
  await pause(page, 3600);

  const video = page.video();
  await page.close();
  await context.close();
  await video.saveAs(outputWebm);
  return { outputWebm, errors };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const warmup = await warmKnowledgeConversation(browser);
    const recording = await recordDemo(browser);
    console.log(JSON.stringify({ warmup, recording }, null, 2));
    if (warmup.answerLength < 20 || warmup.referenceCount < 1 || recording.errors.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
