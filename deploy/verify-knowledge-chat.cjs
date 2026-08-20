const path = require("path");
const { chromium } = require(path.join(process.env.TEMP, "workspace-playwright", "node_modules", "playwright"));

const root = "http://101.43.51.64/ai-agent-station";

(async () => {
  const browser = await chromium.launch({ headless:true });
  const context = await browser.newContext({
    storageState:path.join(__dirname, "playwright-storage.json"),
    viewport:{ width:1440, height:900 }
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", error => errors.push(error.message));

  await page.goto(`${root}/workflows.html?verify=knowledge-chat`, { waitUntil:"networkidle" });
  await page.locator(".catalog-item", { hasText:"个人知识助手 Agent" }).click();
  await page.locator("#knowledgeChatTranscript").waitFor();
  await page.getByRole("button", { name:"新对话" }).click();
  await page.getByText("开始新的对话", { exact:true }).waitFor();

  const ask = async (question, expectedCount) => {
    await page.locator('textarea[name="question"]').fill(question);
    await page.getByRole("button", { name:"发送" }).click();
    await page.waitForFunction(count => {
      const messages = [...document.querySelectorAll(".knowledge-message.assistant")];
      return messages.length === count && !messages[count - 1].classList.contains("pending")
        && !messages[count - 1].classList.contains("failed");
    }, expectedCount, { timeout:240000 });
    return page.locator(".knowledge-message.assistant").nth(expectedCount - 1);
  };

  const first = await ask("这个知识库的混合检索使用什么融合算法？", 1);
  const firstAnswerLength = (await first.locator(".knowledge-message-content").innerText()).trim().length;
  const firstReferenceCount = await first.locator(".knowledge-message-references li").count();

  const second = await ask("它如何合并词法和语义结果？", 2);
  await page.waitForFunction(() => /^4 条短期记忆/.test(document.querySelector("#knowledgeMemoryStatus")?.textContent || ""), null, { timeout:30000 });
  const secondAnswerLength = (await second.locator(".knowledge-message-content").innerText()).trim().length;
  const secondReferenceCount = await second.locator(".knowledge-message-references li").count();
  const secondMeta = await second.locator("header span").innerText();
  const memoryStatus = await page.locator("#knowledgeMemoryStatus").innerText();
  const sessionId = await page.evaluate(() => {
    const key = Object.keys(localStorage).find(value => value.startsWith("knowledgeChatSession:71908750:"));
    return key ? localStorage.getItem(key) : "";
  });
  await page.screenshot({ path:path.join(__dirname, "workflow-runtime-knowledge-chat-live.png"), fullPage:true });
  await browser.close();

  const result = { firstAnswerLength, firstReferenceCount, secondAnswerLength, secondReferenceCount,
    secondMeta, memoryStatus, sessionId, errors };
  console.log(JSON.stringify(result, null, 2));
  if (firstAnswerLength < 20 || secondAnswerLength < 20 || firstReferenceCount < 1 || secondReferenceCount < 1
      || !secondMeta.includes("查询改写") || !/^4 条短期记忆/.test(memoryStatus) || !sessionId || errors.length) {
    process.exit(1);
  }
})().catch(error => { console.error(error); process.exit(1); });
