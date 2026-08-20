(() => {
  "use strict";

  const APP_ROOT = "/ai-agent-station";
  const API_ROOT = "/ai-agent-study/api/v1";
  const DEFAULT_WORKSPACE = "85374287";
  const nativeFetch = window.fetch.bind(window);
  let dashboardLoading = false;

  window.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url || "";
    const configId = new URLSearchParams(location.search).get("configId");
    if (configId && url.includes("/api/v1/admin/ai-agent-draw/save-config") && init.body) {
      try {
        const payload = JSON.parse(init.body);
        if (!payload.configId) {
          payload.configId = configId;
          init = { ...init, body: JSON.stringify(payload) };
        }
      } catch {}
    }
    if (url.includes("/api/v1/agent/auto_agent") && init.body) {
      try {
        const payload = JSON.parse(init.body);
        if (payload.aiAgentId === "85374287") {
          payload.aiAgentId = "71908750";
          init = { ...init, body: JSON.stringify(payload) };
        }
      } catch {}
    }
    return nativeFetch(input, init);
  };

  const text = node => String(node?.textContent || "").replace(/\s+/g, " ").trim();
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);

  function exactElement(value, selector = "body *") {
    return [...document.querySelectorAll(selector)]
      .filter(node => text(node) === value)
      .sort((left, right) => left.children.length - right.children.length)[0] || null;
  }

  function commonAncestor(left, right) {
    if (!left || !right) return null;
    const ancestors = new Set();
    for (let node = left; node; node = node.parentElement) ancestors.add(node);
    for (let node = right; node; node = node.parentElement) if (ancestors.has(node)) return node;
    return null;
  }

  function childUnder(node, ancestor) {
    let current = node;
    while (current?.parentElement && current.parentElement !== ancestor) current = current.parentElement;
    return current;
  }

  function hide(node) {
    if (node) node.classList.add("workspace-ui-hidden");
  }

  function replaceLeafText(from, to, selector = "body *") {
    document.querySelectorAll(selector).forEach(node => {
      if (!node.children.length && text(node) === from) node.textContent = to;
    });
  }

  function replaceTextWithin(node, replacements) {
    if (!node) return;
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let current;
    while ((current = walker.nextNode())) {
      const value = current.textContent.trim();
      if (replacements[value]) current.textContent = current.textContent.replace(value, replacements[value]);
    }
  }

  function activeWorkspaceId() {
    return localStorage.getItem("workspaceId")
      || localStorage.getItem("professionalWorkspaceId")
      || localStorage.getItem("blogWorkspaceId")
      || DEFAULT_WORKSPACE;
  }

  function cleanBranding() {
    replaceLeafText("AI Agent Station", "Personal AI Workspace");
    replaceLeafText("智能代理管理平台", "Agent 自动化与知识工作平台");
    const marketing = [...document.querySelectorAll("p,div")]
      .filter(node => !node.children.length)
      .find(node => text(node).startsWith("智能代理管理平台，为您提供专业的AI代理配置"));
    if (marketing) marketing.textContent = "知识检索、Agent 编排与自动化内容发布的一体化工作平台。";
    replaceLeafText("个人工作台登录", "Personal AI Workspace");
    replaceLeafText("请输入您的账号和密码", "使用工作台账号登录");
  }

  function cleanNavigation() {
    const navItems = [...document.querySelectorAll(".semi-nav-item, .semi-navigation-item")];
    navItems.forEach(item => item.classList.remove("workspace-ui-hidden"));
    const legacyItems = new Set(["数据分析【样例】", "系统设置【样例】"]);
    navItems.forEach(item => {
      const value = text(item);
      if (legacyItems.has(value)) hide(item);
    });

    const assistantEntry = navItems.find(item => text(item) === "个人 AI 工作台" || text(item) === "项目助手");
    const blogEntry = navItems.find(item => text(item).includes("博文工作台") || text(item).includes("内容自动化"));
    const runtimeResources = navItems.find(item => {
      const value = text(item);
      return value === "运行资源" || value === "资源管理";
    });
    if (runtimeResources?.getAttribute("aria-expanded") === "false") runtimeResources.click();
    const brand = exactElement("Personal AI Workspace") || exactElement("AI Agent Station");
    const sidebar = commonAncestor(brand, blogEntry);
    sidebar?.classList.add("workspace-sidebar");
    sidebar?.nextElementSibling?.classList.add("workspace-main-shell");

    if (blogEntry?.parentElement && !document.querySelector("[data-professional-workflows-entry]")) {
      const entry = blogEntry.cloneNode(true);
      entry.dataset.professionalWorkflowsEntry = "true";
      entry.removeAttribute("aria-selected");
      entry.classList.remove("semi-nav-item-selected");
      replaceTextWithin(entry, { "博文工作台": "工作流运行", "内容自动化": "工作流运行" });
      entry.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        location.href = `${APP_ROOT}/workflows.html`;
      });
      blogEntry.parentElement.insertBefore(entry, blogEntry);
    }

    hide(assistantEntry);
    hide(blogEntry);

    const labels = {
      "工作台": "概览",
      "代理管理": "Agent 编排",
      "代理列表": "编排方案",
      "代理配置": "编排画布",
      "资源管理": "运行资源",
      "客户端管理": "执行角色",
      "顾问管理": "Skill 管理",
      "Advisor 配置": "Skill 管理",
      "知识库配置管理": "知识库管理",
      "RAG 配置": "知识库管理",
      "模型管理": "模型配置",
      "模型API管理": "模型 API",
      "系统提示词管理": "Prompt 配置",
      "MCP工具管理": "MCP 工具"
    };
    document.querySelectorAll(".semi-nav-item, .semi-navigation-item").forEach(item => replaceTextWithin(item, labels));
    document.querySelectorAll(".semi-nav-item, .semi-navigation-item").forEach(item => {
      const routes = { "Skill 管理": "skills.html", "知识库管理": "knowledge-bases.html" };
      const page = routes[text(item)];
      if (!page || item.dataset.workspaceResourceRoute) return;
      item.dataset.workspaceResourceRoute = page;
      item.addEventListener("click", event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        location.href = `${APP_ROOT}/${page}`;
      }, true);
    });

    enhanceSidebar();

    if (location.pathname !== `${APP_ROOT}/login` && !document.getElementById("workspaceMobileNav")) {
      const mobileNav = document.createElement("nav");
      mobileNav.id = "workspaceMobileNav";
      mobileNav.className = "workspace-mobile-nav";
      mobileNav.setAttribute("aria-label", "工作台导航");
      mobileNav.innerHTML = `
        <a href="${APP_ROOT}/dashboard"><span>⌂</span>概览</a>
        <a href="${APP_ROOT}/workflows.html"><span>⌁</span>工作流</a>`;
      document.body.append(mobileNav);
    }
  }

  function enhanceSidebar() {
    const navigation = document.querySelector(".semi-navigation");
    const sidebar = navigation?.parentElement?.parentElement;
    if (!navigation || !sidebar) return;
    sidebar.classList.add("workspace-sidebar");
    sidebar.nextElementSibling?.classList.add("workspace-main-shell");

    navigation.querySelectorAll(".semi-navigation-item").forEach(item => {
      const label = text(item);
      if (label) item.dataset.workspaceNavLabel = label;
    });

    const toggle = document.querySelector('[aria-label="menu"]')?.closest("button");
    const sync = () => {
      const collapsed = sidebar.getBoundingClientRect().width <= 100;
      sidebar.classList.add("workspace-sidebar");
      sidebar.classList.toggle("workspace-sidebar-collapsed", collapsed);
      if (!toggle) return;
      toggle.classList.add("workspace-sidebar-toggle");
      toggle.classList.toggle("is-collapsed", collapsed);
      toggle.title = collapsed ? "展开侧边栏" : "收起侧边栏";
      toggle.setAttribute("aria-label", toggle.title);
      toggle.setAttribute("aria-expanded", String(!collapsed));
    };
    sync();
    if (toggle && !toggle.dataset.workspaceSidebarToggle) {
      toggle.dataset.workspaceSidebarToggle = "true";
      toggle.addEventListener("click", () => {
        setTimeout(sync);
        setTimeout(() => {
          sync();
          constrainMainContent();
        }, 240);
      });
    }
  }

  function cleanTopbar() {
    const search = document.querySelector('input[placeholder*="搜索功能"]');
    hide(search?.closest(".semi-input-wrapper")?.parentElement || search?.parentElement);
    hide(document.querySelector('button[title="切换主题"]'));
    const notification = document.querySelector('button[title="消息通知"]');
    hide(notification?.closest(".semi-badge") || notification);
    document.querySelectorAll(".semi-dropdown-item, .semi-navigation-item").forEach(item => {
      if (text(item) === "个人设置") hide(item);
    });
  }

  function alignKnowledgeAssistant() {
    if (!location.pathname.endsWith("/personal-workspace")) return;
    const input = [...document.querySelectorAll("input")].find(node => node.value === "85374287");
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      if (setter) setter.call(input, "71908750");
      else input.value = "71908750";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const projectHeading = exactElement("项目上下文", "h1,h2,h3,h4");
    const assistantHeading = exactElement("询问项目助手", "h1,h2,h3,h4");
    const assistantLayout = commonAncestor(projectHeading, assistantHeading);
    if (assistantLayout && !assistantLayout.classList.contains("workspace-assistant-focus")) {
      hide(childUnder(projectHeading, assistantLayout));
      assistantLayout.classList.add("workspace-assistant-focus");
      childUnder(assistantHeading, assistantLayout)?.classList.add("workspace-assistant-card");
    }
    replaceLeafText("个人 AI 工作台", "项目助手", "h1,h2,h3");
    replaceLeafText("上传项目资料并提问后，回答会显示在这里。", "提问后，基于 RAG 知识源生成的回答会显示在这里。");
    const oldDescription = [...document.querySelectorAll("p,span")].find(node => !node.children.length
      && text(node).startsWith("围绕项目资料进行检索、问答和代码审查"));
    if (oldDescription) oldDescription.textContent = "基于已选择知识库进行检索问答，并自动引用依据。";
  }

  function constrainMainContent() {
    document.querySelectorAll("main.semi-layout-content").forEach(main => {
      main.classList.add("workspace-content-main");
      if (innerWidth > 640) {
        const left = Math.max(0, Math.round(main.getBoundingClientRect().left));
        main.style.setProperty("--workspace-content-left", `${left}px`);
      }
    });
  }

  async function requestJson(url) {
    const response = await nativeFetch(url, { headers: { Accept: "application/json" } });
    const payload = await response.json();
    if (!response.ok || payload.code !== "0000") throw new Error(payload.info || `HTTP ${response.status}`);
    return payload.data;
  }

  function setReactInputValue(input, value) {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    if (setter) setter.call(input, value);
    else input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  async function enhanceKnowledgeBasePicker() {
    if (!location.pathname.endsWith("/personal-workspace") || document.querySelector("[data-workspace-kb-picker]")) return;
    const workspaceInput = [...document.querySelectorAll("input")].find(input =>
      text(input.closest(".semi-input-wrapper") || input.parentElement).includes("工作空间"));
    const wrapper = workspaceInput?.closest(".semi-input-wrapper") || workspaceInput?.parentElement;
    if (!workspaceInput || !wrapper?.parentElement || wrapper.dataset.knowledgePickerLoading) return;
    wrapper.dataset.knowledgePickerLoading = "true";
    try {
      const knowledgeBases = await requestJson(`${API_ROOT}/workspace/knowledge-bases`);
      if (!knowledgeBases?.length) return;
      const stored = localStorage.getItem("knowledgeWorkspaceId");
      const bound = knowledgeBases.find(item => item.status && item.agentIds?.includes("71908750"));
      const selectedId = knowledgeBases.some(item => item.knowledgeBaseId === stored)
        ? stored : bound?.knowledgeBaseId || knowledgeBases[0].knowledgeBaseId;
      const picker = document.createElement("label");
      picker.dataset.workspaceKbPicker = "true";
      picker.className = "workspace-assistant-kb-picker";
      picker.innerHTML = `<span>知识库</span><select aria-label="项目助手知识库">${knowledgeBases.filter(item => item.status).map(item =>
        `<option value="${escapeHtml(item.knowledgeBaseId)}">${escapeHtml(item.knowledgeBaseName)}</option>`).join("")}</select>`;
      picker.querySelector("select").value = selectedId;
      picker.querySelector("select").addEventListener("change", event => {
        localStorage.setItem("knowledgeWorkspaceId", event.target.value);
        setReactInputValue(workspaceInput, event.target.value);
      });
      wrapper.parentElement.insertBefore(picker, wrapper);
      hide(wrapper);
      localStorage.setItem("knowledgeWorkspaceId", selectedId);
      setReactInputValue(workspaceInput, selectedId);
    } catch {
      delete wrapper.dataset.knowledgePickerLoading;
    }
  }

  function metric(key, label) {
    const item = document.createElement("div");
    item.className = "workspace-real-metric";
    item.dataset.metric = key;
    item.innerHTML = `<span>${label}</span><strong>...</strong>`;
    return item;
  }

  function actionLink(href, eyebrow, title, statusKey) {
    const link = document.createElement("a");
    link.className = "workspace-primary-action";
    link.href = href;
    link.innerHTML = `<span class="workspace-action-eyebrow">${eyebrow}</span><strong>${title}</strong><span data-action-status="${statusKey}">加载中</span><b aria-hidden="true">→</b>`;
    return link;
  }

  function formatTime(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false
    }).format(new Date(value));
  }

  function statusLabel(status) {
    return ({
      COMPLETED: "已完成", FAILED: "失败", REJECTED: "质检未通过",
      RUNNING: "运行中", RETRY_WAITING: "等待重试"
    })[status] || status || "未知";
  }

  function workflowLabel(type) {
    return ({
      KNOWLEDGE_ORGANIZER: "知识整理", RESEARCH_REPORT: "专题调研", OPS_REPORT: "运维诊断"
    })[type] || "Agent 工作流";
  }

  function renderRecentRuns(container, workflowRuns, automationRuns) {
    const items = [
      ...(workflowRuns || []).filter(run => run.type !== "CODE_REVIEW").map(run => ({
        title: run.title || workflowLabel(run.type),
        category: workflowLabel(run.type), status: run.status,
        time: run.updatedAt || run.createdAt,
        href: `${APP_ROOT}/workflows.html?type=${encodeURIComponent(run.type || "")}`
      })),
      ...(automationRuns || []).map(run => ({
        title: `AI 行业日报 · ${run.businessDate || ""}`,
        category: "内容自动化", status: run.status,
        time: run.updatedAt || run.createdAt,
        href: `${APP_ROOT}/workflows.html`
      }))
    ].sort((left, right) => new Date(right.time || 0) - new Date(left.time || 0)).slice(0, 6);

    if (!items.length) {
      container.innerHTML = '<div class="workspace-run-empty">暂无运行记录</div>';
      return;
    }
    container.innerHTML = items.map(item => `
      <a class="workspace-run-row" href="${item.href}">
        <span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.category)} · ${formatTime(item.time)}</small></span>
        <em class="${String(item.status || "").toLowerCase()}">${statusLabel(item.status)}</em>
      </a>`).join("");
  }

  function createDashboard() {
    const dashboard = document.createElement("section");
    dashboard.id = "workspaceRealDashboard";
    dashboard.className = "workspace-real-dashboard";

    const metrics = document.createElement("div");
    metrics.className = "workspace-real-metrics";
    metrics.append(
      metric("activeAgentCount", "可用 Agent"),
      metric("clientCount", "执行角色"),
      metric("modelCount", "模型"),
      metric("knowledgeChunkCount", "知识片段")
    );

    const actions = document.createElement("section");
    actions.className = "workspace-dashboard-section";
    actions.innerHTML = '<div class="workspace-section-heading"><div><span>CORE WORKSPACES</span><h2>核心工作区</h2></div><small>真实服务入口</small></div>';
    const actionGrid = document.createElement("div");
    actionGrid.className = "workspace-primary-actions";
    actionGrid.style.gridTemplateColumns = "minmax(0, 1fr)";
    actionGrid.append(
      actionLink(`${APP_ROOT}/workflows.html`, "ASSEMBLED AGENTS", "工作流运行", "workflows")
    );
    actions.append(actionGrid);

    const lower = document.createElement("div");
    lower.className = "workspace-dashboard-columns";
    lower.innerHTML = `
      <section class="workspace-dashboard-section workspace-runs-section">
        <div class="workspace-section-heading"><div><span>EXECUTION HISTORY</span><h2>最近运行</h2></div><a href="${APP_ROOT}/workflows.html">查看全部</a></div>
        <div id="workspaceRecentRuns" class="workspace-run-list"><div class="workspace-run-empty">加载中</div></div>
      </section>
      <aside class="workspace-dashboard-section workspace-system-section">
        <div class="workspace-section-heading"><div><span>SYSTEM ASSEMBLY</span><h2>系统装配</h2></div><small>运行资源</small></div>
        <div class="workspace-system-links">
          <a href="${APP_ROOT}/agent-list"><span>编排方案</span><b data-system-count="workflowConfigCount">...</b></a>
          <a href="${APP_ROOT}/client-management"><span>执行角色</span><b data-system-count="clientCount">...</b></a>
          <a href="${APP_ROOT}/client-model-management"><span>模型配置</span><b data-system-count="modelCount">...</b></a>
          <a href="${APP_ROOT}/ai-client-api-management"><span>模型 API</span><b data-system-count="clientApiCount">...</b></a>
          <a href="${APP_ROOT}/client-system-prompt-management"><span>Prompt 模板</span><b data-system-count="systemPromptCount">...</b></a>
          <a href="${APP_ROOT}/client-tool-mcp-management"><span>MCP 工具</span><b data-system-count="mcpToolCount">...</b></a>
          <a href="${APP_ROOT}/knowledge-bases.html"><span>知识库管理</span><b data-system-count="knowledgeBaseCount">...</b></a>
          <a href="${APP_ROOT}/skills.html"><span>Skill 管理</span><b data-system-count="skillCount">...</b></a>
        </div>
        <div class="workspace-automation-state" id="workspaceAutomationState"><span>每日内容任务</span><strong>加载中</strong><small></small></div>
      </aside>`;
    dashboard.append(metrics, actions, lower);
    return dashboard;
  }

  async function loadDashboard() {
    const dashboard = document.getElementById("workspaceRealDashboard");
    if (!dashboard || dashboardLoading) return;
    dashboardLoading = true;
    const workspaceId = activeWorkspaceId();
    const endpoints = {
      stats: `${API_ROOT}/admin/data/statistics/get-data-statistics?workspaceId=${encodeURIComponent(workspaceId)}`,
      definitions: `${API_ROOT}/workspace/${encodeURIComponent(workspaceId)}/professional-workflows`,
      runs: `${API_ROOT}/workspace/${encodeURIComponent(workspaceId)}/professional-workflows/runs`,
      automation: `${API_ROOT}/workspace/${encodeURIComponent(workspaceId)}/blogs/automation`,
      automationRuns: `${API_ROOT}/workspace/${encodeURIComponent(workspaceId)}/blogs/automation/runs`,
      knowledge: `${API_ROOT}/workspace/personal-workspace/knowledge/status`,
      knowledgeBases: `${API_ROOT}/workspace/knowledge-bases`,
      skills: `${API_ROOT}/workspace/personal-workspace/skills`
    };
    const entries = await Promise.all(Object.entries(endpoints).map(async ([key, url]) => {
      try { return [key, await requestJson(url)]; } catch { return [key, null]; }
    }));
    const data = Object.fromEntries(entries);

    ["activeAgentCount", "clientCount", "modelCount", "clientApiCount", "workflowConfigCount", "scheduledTaskCount", "systemPromptCount", "mcpToolCount"].forEach(key => {
      const value = data.stats?.[key];
      const metricTarget = dashboard.querySelector(`[data-metric="${key}"] strong`);
      if (metricTarget) metricTarget.textContent = Number.isFinite(Number(value)) ? Number(value).toLocaleString("zh-CN") : "-";
      dashboard.querySelectorAll(`[data-system-count="${key}"]`).forEach(target => {
        target.textContent = Number.isFinite(Number(value)) ? value : "-";
      });
    });
    const knowledgeMetric = dashboard.querySelector('[data-metric="knowledgeChunkCount"] strong');
    if (knowledgeMetric) knowledgeMetric.textContent = data.knowledge?.chunkCount ?? "-";
    dashboard.querySelectorAll('[data-system-count="knowledgeBaseCount"]').forEach(target => {
      target.textContent = Array.isArray(data.knowledgeBases) ? data.knowledgeBases.length : "-";
    });
    dashboard.querySelectorAll('[data-system-count="skillCount"]').forEach(target => {
      target.textContent = Array.isArray(data.skills) ? data.skills.length : "-";
    });

    const workflows = dashboard.querySelector('[data-action-status="workflows"]');
    if (workflows) workflows.textContent = Number.isFinite(Number(data.stats?.workflowConfigCount))
      ? `${data.stats.workflowConfigCount} 个已启用编排` : "数据暂不可用";

    renderRecentRuns(dashboard.querySelector("#workspaceRecentRuns"), data.runs, data.automationRuns);
    const automationState = dashboard.querySelector("#workspaceAutomationState");
    if (automationState) {
      const latest = data.automationRuns?.[0];
      automationState.querySelector("strong").textContent = data.automation?.enabled ? `已启用 · ${data.automation.time}` : "未启用";
      automationState.querySelector("small").textContent = latest ? `最近运行：${statusLabel(latest.status)} · ${formatTime(latest.updatedAt)}` : "暂无运行记录";
      automationState.classList.toggle("enabled", Boolean(data.automation?.enabled));
    }
    const platformStatus = document.querySelector("[data-platform-status]");
    if (platformStatus) {
      const availableCount = Object.values(data).filter(value => value !== null).length;
      const endpointCount = Object.keys(data).length;
      platformStatus.innerHTML = `<i></i>${availableCount === endpointCount ? "服务在线" : `${availableCount}/${endpointCount} 数据源在线`}`;
      platformStatus.classList.toggle("degraded", availableCount !== endpointCount);
    }
    dashboardLoading = false;
  }

  function enhanceDashboard() {
    if (!location.pathname.endsWith("/dashboard") || document.getElementById("workspaceRealDashboard")) return;
    const welcome = [...document.querySelectorAll("h1,h2,h3")].find(node => text(node).startsWith("欢迎回来"));
    const refresh = exactElement("刷新数据", "button, button *");
    if (!welcome || !refresh) return;

    let legacyHero = commonAncestor(welcome, refresh);
    while (legacyHero?.parentElement
      && text(legacyHero.parentElement).includes("刷新数据")
      && !text(legacyHero.parentElement).includes("活跃代理")) {
      legacyHero = legacyHero.parentElement;
    }
    const header = document.createElement("section");
    header.className = "workspace-dashboard-header";
    header.innerHTML = `
      <div><span class="workspace-header-kicker">PERSONAL AI WORKSPACE</span><h1>运行中心</h1><p>知识检索、Agent 编排与内容自动化</p></div>
      <div class="workspace-header-actions"><span data-platform-status><i></i>状态检查中</span><button type="button">刷新</button></div>`;
    legacyHero?.parentElement?.insertBefore(header, legacyHero);
    hide(legacyHero);

    const activeLabel = exactElement("活跃代理");
    const runningLabel = exactElement("运行中任务");
    const legacyMetrics = commonAncestor(activeLabel, runningLabel);
    hide(legacyMetrics);
    const dashboard = createDashboard();
    if (legacyMetrics?.parentElement) legacyMetrics.parentElement.insertBefore(dashboard, legacyMetrics.nextSibling);
    else header.parentElement?.append(dashboard);

    const quick = exactElement("快速操作", "h1,h2,h3,h4,h5");
    const recent = exactElement("最近活动", "h1,h2,h3,h4,h5");
    const row = commonAncestor(quick, recent);
    if (row) {
      hide(childUnder(quick, row));
      hide(childUnder(recent, row));
      row.classList.add("workspace-empty-layout");
    }
    header.querySelector("button").addEventListener("click", loadDashboard);
    loadDashboard();
  }

  function cleanAdminPages() {
    const pageLabels = {
      "代理列表": "编排方案",
      "代理配置": "编排画布",
      "客户端管理": "执行角色",
      "MCP客户端工具管理": "MCP 工具",
      "AI客户端模型管理": "模型配置"
    };
    Object.entries(pageLabels).forEach(([from, to]) => replaceLeafText(from, to, "h1,h2,h3,h4"));

    if (location.pathname.endsWith("/agent-list")) {
      replaceLeafText("加载", "装配", "button, button *");
      replaceLeafText("新建", "新建编排", "button, button *");
    }

    if (location.pathname.endsWith("/client-management")) {
      const roleLabels = {
        "客户端名称": "角色名称",
        "客户端ID": "角色 ID",
        "客户端ID:": "角色 ID:",
        "客户端名称:": "角色名称:",
        "新增客户端": "新增执行角色",
        "编辑客户端": "编辑执行角色"
      };
      Object.entries(roleLabels).forEach(([from, to]) => replaceLeafText(from, to));
      document.querySelectorAll("input").forEach(input => {
        if (input.placeholder === "请输入客户端名称") input.placeholder = "请输入角色名称";
        if (input.placeholder === "请输入客户端ID") input.placeholder = "请输入角色 ID";
      });
    }

    if (!location.pathname.endsWith("/agent-config")) return;
    ["保存配置", "启动", "停止"].forEach(label => {
      const button = exactElement(label, "button, button *");
      hide(button?.closest("button") || button);
    });
    ["待启动", "运行中", "已停止"].forEach(label => {
      const status = exactElement(label);
      if (status && text(status.parentElement) === label) hide(status.parentElement);
    });
    const run = exactElement("Run", "button, button *");
    hide(run?.closest("button") || run);
    const save = exactElement("Save", "button, button *");
    if (save && !save.children.length) save.textContent = "保存装配";
  }

  function applyPlatform() {
    cleanBranding();
    cleanNavigation();
    cleanTopbar();
    alignKnowledgeAssistant();
    enhanceKnowledgeBasePicker();
    enhanceDashboard();
    cleanAdminPages();
    constrainMainContent();
  }

  const observer = new MutationObserver(applyPlatform);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  addEventListener("popstate", () => setTimeout(applyPlatform));
  addEventListener("resize", constrainMainContent);
  setInterval(() => {
    if (!document.hidden && document.getElementById("workspaceRealDashboard")) loadDashboard();
  }, 30000);
  applyPlatform();
})();
