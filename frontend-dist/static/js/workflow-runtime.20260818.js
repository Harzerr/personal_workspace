(() => {
  "use strict";

  if (localStorage.getItem("isLoggedIn") !== "true" || !localStorage.getItem("token") || !localStorage.getItem("userInfo")) {
    location.replace("/ai-agent-station/login");
    return;
  }

  const APP_ROOT = "/ai-agent-station";
  const API_ROOT = "/ai-agent-study/api/v1";
  const DEFAULT_WORKSPACE_ID = "85374287";
  const WORKFLOW_WORKSPACE_STORAGE_KEY = "workflowWorkspaceId";
  const statusLabels = {
    RUNNING: "运行中", COMPLETED: "已完成", REJECTED: "质检未通过", FAILED: "执行失败",
    RETRY_WAITING: "等待重试"
  };
  const adapterLabels = {
    professional: "专业工作流", knowledge: "知识工作流", content: "内容工作流", generic: "通用工作流"
  };
  const retiredWorkflowConfigs = new Set(["workspace_code_review_v1"]);
  const retiredWorkflowAgents = new Set(["71908710"]);
  const state = {
    workflows: [], definitions: [], models: new Map(), selected: null, runs: [], busy: false,
    query: "", transientRuns: new Map(), currentReport: "",
    knowledgeChat: { knowledgeBaseId:"", sessionId:"", memory:null }
  };
  const $ = id => document.getElementById(id);
  const workspaceInput = $("workspaceId");
  workspaceInput.value = localStorage.getItem(WORKFLOW_WORKSPACE_STORAGE_KEY) || DEFAULT_WORKSPACE_ID;

  function workspaceId() {
    return workspaceInput.value.trim() || DEFAULT_WORKSPACE_ID;
  }

  function readableError(value, status = 0) {
    const message = String(value || "");
    if (status === 429 || /429|too many requests|rate.?limit|insufficient_quota/i.test(message)) return "模型服务当前请求过多或额度不足，请检查模型 API 后重试。";
    if (/401|unauthorized|invalid.?token|token.*(invalid|unavailable|expired)/i.test(message)) return "模型连接凭证不可用，请检查模型 API 凭证。";
    if (/timeout|timed out|connect.*(refused|reset)|connection.*(failed|closed)/i.test(message)) return "上游模型或数据服务暂时无法连接，请稍后重试。";
    if (status >= 500) return message || "工作流服务暂时不可用，请稍后重试。";
    return message || `请求失败 (${status || "网络错误"})`;
  }

  async function api(path, options = {}) {
    let response;
    try {
      const headers = { Accept: "application/json", ...(options.headers || {}) };
      if (options.body && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
      response = await fetch(`${API_ROOT}${path}`, { ...options, headers });
    } catch (error) {
      throw new Error(readableError(error.message));
    }
    let payload;
    try { payload = await response.json(); }
    catch { throw new Error(readableError("", response.status)); }
    if (!response.ok || payload.code !== "0000") throw new Error(readableError(payload.info, response.status));
    return payload.data;
  }

  function toast(message, kind = "success") {
    const item = document.createElement("div");
    item.className = `toast ${kind}`;
    item.textContent = message;
    $("toastRegion").append(item);
    setTimeout(() => item.remove(), 3600);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;" })[char]);
  }

  function inlineMarkdown(value) {
    const links = [];
    let text = escapeHtml(value).replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => {
      links.push(`<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`);
      return `@@LINK_${links.length - 1}@@`;
    });
    text = text.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/&lt;br\s*\/?&gt;/gi, "<br>");
    return text.replace(/@@LINK_(\d+)@@/g, (_, index) => links[Number(index)]);
  }

  function tableCells(line) {
    let source = String(line || "").trim();
    if (!source.includes("|")) return null;
    if (source.startsWith("|")) source = source.slice(1);
    if (source.endsWith("|")) source = source.slice(0, -1);
    const cells = [];
    let cell = "";
    let escaped = false;
    let code = false;
    for (const char of source) {
      if (escaped) { cell += char; escaped = false; continue; }
      if (char === "\\") { escaped = true; cell += char; continue; }
      if (char === "`") { code = !code; cell += char; continue; }
      if (char === "|" && !code) { cells.push(cell.trim()); cell = ""; continue; }
      cell += char;
    }
    cells.push(cell.trim());
    return cells.length > 1 ? cells : null;
  }

  function tableDelimiter(cells) {
    return Boolean(cells?.length && cells.every(cell => /^:?-{3,}:?$/.test(cell.replace(/\s/g, ""))));
  }

  function normalizeMarkdownTables(markdown) {
    const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
    const output = [];
    for (let index = 0; index < lines.length;) {
      const header = tableCells(lines[index]);
      let delimiterIndex = index + 1;
      while (delimiterIndex < lines.length && !lines[delimiterIndex].trim()) delimiterIndex += 1;
      const delimiter = tableCells(lines[delimiterIndex]);
      if (!header || !tableDelimiter(delimiter)) { output.push(lines[index]); index += 1; continue; }

      output.push(lines[index], lines[delimiterIndex]);
      index = delimiterIndex + 1;
      while (index < lines.length) {
        if (lines[index].trim()) {
          if (!tableCells(lines[index])) break;
          output.push(lines[index]);
          index += 1;
          continue;
        }
        let next = index + 1;
        while (next < lines.length && !lines[next].trim()) next += 1;
        if (next >= lines.length || !tableCells(lines[next])) break;
        index = next;
      }
    }
    return output.join("\n");
  }

  function tableAlignment(delimiter) {
    return delimiter.map(cell => {
      const marker = cell.replace(/\s/g, "");
      if (marker.startsWith(":") && marker.endsWith(":")) return "center";
      if (marker.endsWith(":")) return "right";
      return "left";
    });
  }

  function renderTableCell(tag, value, alignment) {
    const scope = tag === "th" ? ' scope="col"' : "";
    return `<${tag}${scope} class="align-${alignment || "left"}">${inlineMarkdown(value || "")}</${tag}>`;
  }

  function renderMarkdown(markdown) {
    const lines = normalizeMarkdownTables(markdown).split("\n");
    const output = [];
    let code = false;
    let buffer = [];
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (line.startsWith("```")) {
        if (code) { output.push(`<pre><code>${escapeHtml(buffer.join("\n"))}</code></pre>`); buffer = []; }
        code = !code;
        continue;
      }
      if (code) { buffer.push(line); continue; }
      const header = tableCells(line);
      const delimiter = tableCells(lines[index + 1]);
      if (header && tableDelimiter(delimiter)) {
        const rows = [];
        index += 2;
        while (index < lines.length) {
          const cells = tableCells(lines[index]);
          if (!cells) { index -= 1; break; }
          rows.push(cells);
          index += 1;
        }
        const columnCount = Math.max(header.length, delimiter.length, ...rows.map(row => row.length));
        const alignments = tableAlignment(delimiter);
        const rowHtml = rows.map(row => `<tr>${Array.from({ length:columnCount }, (_, column) => renderTableCell("td", row[column], alignments[column])).join("")}</tr>`).join("");
        const headerHtml = Array.from({ length:columnCount }, (_, column) => renderTableCell("th", header[column], alignments[column])).join("");
        output.push(`<div class="markdown-table-wrap" role="region" aria-label="Report table" tabindex="0"><table><thead><tr>${headerHtml}</tr></thead><tbody>${rowHtml}</tbody></table></div>`);
        continue;
      }
      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) { output.push(`<h${heading[1].length}>${inlineMarkdown(heading[2])}</h${heading[1].length}>`); continue; }
      const item = line.match(/^[-*]\s+(.+)$/);
      if (item) { output.push(`<p>• ${inlineMarkdown(item[1])}</p>`); continue; }
      output.push(line.trim() ? `<p>${inlineMarkdown(line)}</p>` : "");
    }
    if (buffer.length) output.push(`<pre><code>${escapeHtml(buffer.join("\n"))}</code></pre>`);
    return output.join("");
  }

  function formatTime(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("zh-CN", { month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false }).format(new Date(value));
  }

  function scalar(value) {
    if (Array.isArray(value)) return value.map(item => item?.value?.content ?? item?.value ?? "").filter(Boolean).join(" ");
    return value?.content ?? value ?? "";
  }

  function parseWorkflow(config, definitions) {
    let graph = { nodes: [], edges: [] };
    try { graph = JSON.parse(config.configData || "{}"); } catch { /* invalid graphs stay visible */ }
    const agentNode = (graph.nodes || []).find(node => node.type === "agent");
    const clients = (graph.nodes || []).filter(node => node.type === "client").map(node => {
      const values = node.data?.inputsValues || {};
      const sequence = Number(Array.isArray(values.sequence) ? values.sequence[0]?.value : values.sequence) || 999;
      return { id: values.clientId || node.id, nodeId:node.id, name: scalar(values.clientName) || node.data?.title || "执行角色", sequence };
    }).sort((left, right) => left.sequence - right.sequence);
    const models = (graph.nodes || []).filter(node => node.type === "model").map(node => ({
      nodeId:node.id, title:node.data?.title || "模型", modelId:scalar(node.data?.inputsValues?.modelName)
    }));
    const tools = (graph.nodes || []).filter(node => node.type === "tool_mcp").map(node => ({
      nodeId:node.id, title:node.data?.title || "MCP", mcpId:scalar(node.data?.inputsValues?.toolMcpName)
    }));
    const modelId = models[0]?.modelId;
    const channel = scalar(agentNode?.data?.inputsValues?.channel) || "agent-runtime";
    const professional = definitions.find(item => item.agentId === config.agentId) || null;
    const adapter = professional ? "professional"
      : channel === "workspace-knowledge" ? "knowledge"
        : channel === "workspace-blog" ? "content" : "generic";
    return {
      configId: config.configId, agentId: config.agentId, name: config.configName || scalar(agentNode?.data?.inputsValues?.agentName) || "未命名工作流",
      description: config.description || scalar(agentNode?.data?.inputsValues?.description) || "由 Agent 编排自动生成的运行交互。",
      channel, strategy: scalar(agentNode?.data?.inputsValues?.strategy), status: config.status,
      version: config.version, clients, models, tools, modelId, adapter, professional, graph
    };
  }

  async function loadCatalog(preserveSelection = true) {
    const previousId = preserveSelection ? state.selected?.configId : null;
    const [configs, definitions, models] = await Promise.all([
      api("/admin/ai-agent-draw/query-list", { method:"POST", body:JSON.stringify({ status:1, pageNum:1, pageSize:100 }) }),
      api(`/workspace/${encodeURIComponent(workspaceId())}/professional-workflows`).catch(() => []),
      api("/admin/ai-client-model/query-enabled").catch(() => [])
    ]);
    state.definitions = (definitions || []).filter(item => item.type !== "CODE_REVIEW");
    state.models = new Map((models || []).map(model => [model.modelId, model.modelName]));
    state.workflows = (configs || [])
      .filter(config => !retiredWorkflowConfigs.has(config.configId) && !retiredWorkflowAgents.has(config.agentId))
      .map(config => parseWorkflow(config, state.definitions));
    const params = new URLSearchParams(location.search);
    const requestedConfig = params.get("configId");
    const requestedType = params.get("type");
    state.selected = state.workflows.find(item => item.configId === previousId)
      || state.workflows.find(item => item.configId === requestedConfig)
      || state.workflows.find(item => item.professional?.type === requestedType)
      || state.workflows[0] || null;
    renderCatalog();
    await selectWorkflow(state.selected, false);
  }

  function workflowSearchText(item) {
    return `${item.name} ${item.description} ${item.channel} ${item.clients.map(client => client.name).join(" ")}`.toLowerCase();
  }

  function renderCatalog() {
    const query = state.query.trim().toLowerCase();
    const workflows = state.workflows.filter(item => !query || workflowSearchText(item).includes(query));
    $("workflowCount").textContent = `${state.workflows.length} 个可运行编排`;
    const host = $("workflowCatalog");
    host.replaceChildren();
    if (!workflows.length) {
      const empty = document.createElement("div"); empty.className = "catalog-empty"; empty.textContent = "没有匹配的工作流"; host.append(empty); return;
    }
    workflows.forEach(item => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `catalog-item ${item.configId === state.selected?.configId ? "active" : ""}`;
      const mark = document.createElement("span"); mark.className = `catalog-mark ${item.adapter}`;
      mark.textContent = ({ professional:"WF", knowledge:"KB", content:"CM", generic:"AG" })[item.adapter];
      const copy = document.createElement("span"); copy.className = "catalog-copy";
      const title = document.createElement("strong"); title.textContent = item.name;
      const meta = document.createElement("span"); meta.textContent = `${adapterLabels[item.adapter]} · ${item.clients.length} 个角色`;
      copy.append(title, meta); button.append(mark, copy);
      button.addEventListener("click", () => selectWorkflow(item));
      host.append(button);
    });
  }

  async function selectWorkflow(item, updateUrl = true) {
    if (!item) return;
    state.selected = item;
    state.runs = [];
    if (updateUrl) {
      const url = new URL(location.href); url.searchParams.set("configId", item.configId); url.searchParams.delete("type"); history.replaceState(null, "", url);
    }
    renderCatalog();
    renderSummary();
    renderChain();
    renderInteraction();
    clearResult();
    await loadRuns();
  }

  function renderSummary() {
    const item = state.selected;
    $("workflowKind").textContent = `${adapterLabels[item.adapter]} · ${item.channel}`;
    $("workflowName").textContent = item.name;
    $("workflowDescription").textContent = item.professional?.description || item.description;
    $("agentId").textContent = `Agent ${item.agentId}`;
    const ready = item.status === 1 && item.clients.length > 0 && Boolean(item.modelId)
      && (!item.professional || item.professional.ready !== false);
    $("readinessBadge").textContent = ready ? "已配置" : "配置不完整";
    $("readinessBadge").classList.toggle("pending", !ready);
    $("modelName").textContent = item.models.length > 1
      ? `已装配 ${item.models.length} 个模型`
      : item.modelId ? `模型 ${state.models.get(item.modelId) || item.modelId}` : "未连接模型";
  }

  function renderChain() {
    const item = state.selected;
    const edges = item.graph.edges || [];
    const steps = [{ name:"触发", detail:"用户或任务" }];
    item.tools.forEach(tool => steps.push({ name:"只读 MCP", detail:tool.title }));
    item.clients.forEach(client => {
      const modelEdge = edges.find(edge => edge.sourceNodeID === client.nodeId
        && item.models.some(model => model.nodeId === edge.targetNodeID));
      const model = item.models.find(value => value.nodeId === modelEdge?.targetNodeID);
      const modelName = model ? state.models.get(model.modelId) || model.modelId : "模型未配置";
      steps.push({ name:client.name, detail:`顺序 ${client.sequence} · ${modelName}` });
    });
    steps.push({ name:"报告归档", detail:"质检通过后保存" });
    $("executionChain").replaceChildren(...steps.map((step, index) => {
      const node = document.createElement("li");
      node.innerHTML = `<span>${index + 1}</span><strong>${escapeHtml(step.name)}</strong><small>${escapeHtml(step.detail)}</small>`;
      return node;
    }));
  }

  function storageKey(field) {
    return `workflowRuntime:${state.selected.configId}:${field.name}`;
  }

  function createControl(field) {
    let control;
    if (field.type === "TEXTAREA") { control = document.createElement("textarea"); control.rows = field.rows || 5; }
    else if (field.type === "SELECT" || field.type === "MULTISELECT") {
      control = document.createElement("select");
      control.multiple = field.type === "MULTISELECT";
      if (control.multiple) control.size = Math.min(Math.max((field.options || []).length, 3), 6);
      (field.options || []).forEach(option => { const item = document.createElement("option"); item.value = option.value; item.textContent = option.label; control.append(item); });
    } else {
      control = document.createElement("input");
      control.type = field.type === "NUMBER" ? "number" : field.type === "URL" ? "url" : field.type === "TOGGLE" ? "checkbox" : "text";
    }
    control.name = field.name; control.required = Boolean(field.required);
    if (field.placeholder) control.placeholder = field.placeholder;
    if (field.min !== null && field.min !== undefined) control.min = field.min;
    if (field.max !== null && field.max !== undefined) control.max = field.max;
    if (field.maxLength !== null && field.maxLength !== undefined) control.maxLength = field.maxLength;
    const remembered = field.remember ? localStorage.getItem(storageKey(field)) : null;
    if (field.type === "MULTISELECT") {
      let selected = [field.defaultValue ?? ""];
      if (remembered !== null) {
        try { selected = JSON.parse(remembered); }
        catch (_) { selected = [remembered]; }
      }
      const selectedValues = new Set(Array.isArray(selected) ? selected : [selected]);
      [...control.options].forEach(option => { option.selected = selectedValues.has(option.value); });
    } else if (field.type === "TOGGLE") {
      control.checked = remembered !== null ? remembered === "true" : String(field.defaultValue).toLowerCase() === "true";
    } else control.value = remembered !== null ? remembered : (field.defaultValue ?? "");
    return control;
  }

  function setContextLink(label, href) {
    const link = $("contextLink");
    link.classList.toggle("hidden", !label);
    link.textContent = label || "";
    link.href = href || "#";
  }

  function renderInteraction() {
    const host = $("workflowFormHost"); host.replaceChildren();
    setContextLink();
    if (state.selected.adapter === "professional") renderProfessionalForm(host);
    else if (state.selected.adapter === "knowledge") renderKnowledgeForm(host);
    else if (state.selected.adapter === "content") renderContentForm(host);
    else renderGenericForm(host);
  }

  function formShell(submit) {
    const form = document.createElement("form"); form.className = "workflow-form"; form.addEventListener("submit", submit); return form;
  }

  function appendField(form, labelText, control, full = false, help = "") {
    const label = document.createElement("label"); if (full) label.className = "full";
    const title = document.createElement("span"); title.textContent = labelText; label.append(title, control);
    if (help) { const note = document.createElement("small"); note.className = "field-help"; note.textContent = help; label.append(note); }
    form.append(label); return control;
  }

  function submitButton(label) {
    const actions = document.createElement("div"); actions.className = "form-actions";
    const button = document.createElement("button"); button.type = "submit"; button.className = "button primary run-button"; button.textContent = label;
    actions.append(button); return actions;
  }

  function renderProfessionalForm(host) {
    const definition = state.selected.professional;
    const available = definition.ready !== false;
    $("runHint").textContent = available
      ? (definition.notice || "字段由工作流运行定义自动生成。")
      : (definition.readiness || definition.notice || "工作流配置不完整。");
    const form = formShell(runProfessional);
    if (definition.notice) { const note = document.createElement("div"); note.className = "connector-note full"; note.textContent = definition.notice; form.append(note); }
    (definition.inputs || []).forEach(field => appendField(form, field.label, createControl(field), field.fullWidth));
    const targetSelect = form.elements.targetId;
    const projectSelect = form.elements.projectIds;
    if (targetSelect && projectSelect?.multiple) {
      const syncProjects = () => {
        [...projectSelect.options].forEach(option => {
          const availableForTarget = option.value === "*" || option.value.startsWith(`${targetSelect.value}::`);
          option.hidden = !availableForTarget;
          option.disabled = !availableForTarget;
          if (!availableForTarget) option.selected = false;
        });
        if (![...projectSelect.selectedOptions].some(option => !option.disabled)) projectSelect.value = "*";
      };
      targetSelect.addEventListener("change", syncProjects);
      syncProjects();
    }
    const actions = submitButton(definition.actionLabel || "运行工作流");
    const runButton = actions.querySelector("button");
    runButton.disabled = !available;
    runButton.dataset.unavailable = String(!available);
    form.append(actions); host.append(form);
  }

  function knowledgeSessionStorageKey(knowledgeBaseId) {
    return `knowledgeChatSession:${state.selected.agentId}:${knowledgeBaseId}`;
  }

  function newKnowledgeSessionId() {
    const random = globalThis.crypto?.randomUUID?.().replaceAll("-", "").slice(0, 12)
      || Math.random().toString(36).slice(2, 14);
    return `chat-${Date.now().toString(36)}-${random}`;
  }

  function knowledgeSessionId(knowledgeBaseId, renew = false) {
    const key = knowledgeSessionStorageKey(knowledgeBaseId);
    let sessionId = renew ? "" : localStorage.getItem(key);
    if (!sessionId) {
      sessionId = newKnowledgeSessionId();
      localStorage.setItem(key, sessionId);
    }
    return sessionId;
  }

  function knowledgeMemoryLabel(memory) {
    if (!memory?.available) return "记忆服务暂不可用";
    const recent = memory.recentMessages?.length ?? memory.recentMessageCount ?? 0;
    const facts = memory.longTermFacts?.length ?? memory.longTermFactCount ?? 0;
    return `${recent} 条短期记忆 · ${facts} 条长期记忆${memory.summary || memory.hasSummary ? " · 已生成摘要" : ""}`;
  }

  function setKnowledgeMemoryStatus(memory) {
    state.knowledgeChat.memory = memory;
    const status = $("knowledgeMemoryStatus");
    if (!status) return;
    status.textContent = knowledgeMemoryLabel(memory);
    status.classList.toggle("unavailable", !memory?.available);
  }

  function appendKnowledgeMessage(role, content, options = {}) {
    const transcript = $("knowledgeChatTranscript");
    if (!transcript) return null;
    transcript.querySelector(".knowledge-chat-empty")?.remove();
    const message = document.createElement("article");
    message.className = `knowledge-message ${role}${options.pending ? " pending" : ""}`;
    const header = document.createElement("header");
    const identity = document.createElement("strong");
    identity.textContent = role === "user" ? "你" : role === "system" ? "系统记忆" : "个人知识助手";
    const meta = document.createElement("span");
    meta.textContent = options.meta || "";
    header.append(identity, meta);
    const body = document.createElement("div");
    body.className = `knowledge-message-content${role === "user" ? "" : " markdown-report"}`;
    if (options.pending && !content) body.innerHTML = '<div class="stream-state"><i></i><span>正在理解问题</span></div>';
    else if (role === "user") body.textContent = content;
    else body.innerHTML = renderMarkdown(content);
    message.append(header, body);
    transcript.append(message);
    transcript.scrollTop = transcript.scrollHeight;
    return { message, body, meta };
  }

  function updateKnowledgeMessage(target, content, meta = "") {
    if (!target) return;
    target.message.classList.remove("pending", "failed");
    target.body.innerHTML = renderMarkdown(content);
    target.meta.textContent = meta;
    const transcript = $("knowledgeChatTranscript");
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
  }

  function attachKnowledgeReferences(target, references) {
    if (!target || !references?.length) return;
    const details = document.createElement("details");
    details.className = "knowledge-message-references";
    const summary = document.createElement("summary");
    summary.textContent = `${references.length} 条检索依据`;
    const list = document.createElement("ol");
    references.forEach((item, index) => {
      const row = document.createElement("li");
      const source = document.createElement("strong");
      source.textContent = `[${index + 1}] ${item.sourcePath}:${item.startLine}-${item.endLine}`;
      const rank = document.createElement("span");
      rank.textContent = [item.lexicalRank ? `词法 #${item.lexicalRank}` : "", item.semanticRank ? `语义 #${item.semanticRank}` : ""].filter(Boolean).join(" · ");
      row.append(source, rank); list.append(row);
    });
    details.append(summary, list); target.message.append(details);
  }

  function renderKnowledgeMemory(memory) {
    const transcript = $("knowledgeChatTranscript");
    if (!transcript) return;
    transcript.replaceChildren();
    const messages = memory?.recentMessages || [];
    messages.filter(message => ["user", "assistant", "system"].includes(message.role))
      .forEach(message => appendKnowledgeMessage(message.role, message.content));
    if (!messages.length) {
      const empty = document.createElement("div");
      empty.className = "knowledge-chat-empty";
      empty.innerHTML = "<strong>开始新的对话</strong><span>当前会话还没有消息</span>";
      transcript.append(empty);
    }
    setKnowledgeMemoryStatus(memory || { available:false });
  }

  async function loadKnowledgeConversation(knowledgeBaseId, renew = false) {
    if (!knowledgeBaseId) return;
    const sessionId = knowledgeSessionId(knowledgeBaseId, renew);
    state.knowledgeChat.knowledgeBaseId = knowledgeBaseId;
    state.knowledgeChat.sessionId = sessionId;
    const transcript = $("knowledgeChatTranscript");
    if (transcript) transcript.innerHTML = '<div class="knowledge-chat-empty"><span>正在读取会话...</span></div>';
    try {
      const memory = await api(`/workspace/${encodeURIComponent(knowledgeBaseId)}/memory/${encodeURIComponent(sessionId)}`);
      if (state.knowledgeChat.sessionId === sessionId) renderKnowledgeMemory(memory);
    } catch (error) {
      if (state.knowledgeChat.sessionId === sessionId) renderKnowledgeMemory({ available:false, recentMessages:[], longTermFacts:[] });
      toast(error.message, "error");
    }
  }

  function renderKnowledgeForm(host) {
    $("runHint").textContent = "连续对话会结合短期消息、会话摘要、长期事实和混合检索依据。";
    setContextLink("管理知识库", `${APP_ROOT}/knowledge-bases.html`);

    const shell = document.createElement("section"); shell.className = "knowledge-chat";
    const toolbar = document.createElement("div"); toolbar.className = "knowledge-chat-toolbar";
    const picker = document.createElement("label");
    const pickerLabel = document.createElement("span"); pickerLabel.textContent = "知识库";
    const select = document.createElement("select"); select.id = "knowledgeChatBase"; select.name = "knowledgeBaseId"; select.required = true;
    select.innerHTML = '<option value="">读取知识库...</option>';
    picker.append(pickerLabel, select);
    const conversation = document.createElement("div"); conversation.className = "knowledge-conversation-tools";
    const status = document.createElement("span"); status.id = "knowledgeMemoryStatus"; status.textContent = "读取记忆中";
    const newChat = document.createElement("button"); newChat.type = "button"; newChat.className = "button secondary"; newChat.textContent = "新对话";
    newChat.title = "创建新的知识问答会话";
    newChat.addEventListener("click", () => {
      if (!select.value) return;
      clearResult();
      loadKnowledgeConversation(select.value, true).then(() => toast("已开始新对话"));
    });
    conversation.append(status, newChat); toolbar.append(picker, conversation);

    const transcript = document.createElement("div"); transcript.id = "knowledgeChatTranscript"; transcript.className = "knowledge-chat-transcript"; transcript.setAttribute("aria-live", "polite");
    transcript.innerHTML = '<div class="knowledge-chat-empty"><span>正在读取知识库...</span></div>';

    const form = document.createElement("form"); form.className = "knowledge-composer"; form.addEventListener("submit", runKnowledge);
    const question = document.createElement("textarea"); question.name = "question"; question.required = true; question.rows = 3; question.maxLength = 4000; question.placeholder = "继续询问实现逻辑、配置来源或项目约束";
    question.addEventListener("keydown", event => {
      if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
        event.preventDefault(); form.requestSubmit();
      }
    });
    const send = document.createElement("button"); send.type = "submit"; send.className = "button primary"; send.textContent = "发送";
    form.append(question, send); shell.append(toolbar, transcript, form); host.append(shell);

    select.addEventListener("change", () => {
      if (!select.value) return;
      localStorage.setItem("knowledgeWorkspaceId", select.value);
      clearResult(); loadKnowledgeConversation(select.value);
    });
    api("/workspace/knowledge-bases").then(items => {
      select.replaceChildren();
      (items || []).filter(item => item.status).forEach(item => {
        const option = document.createElement("option"); option.value = item.knowledgeBaseId; option.textContent = item.knowledgeBaseName; select.append(option);
      });
      if (!select.options.length) {
        select.innerHTML = '<option value="">没有可用知识库</option>'; select.disabled = true; send.disabled = true; return;
      }
      const stored = localStorage.getItem("knowledgeWorkspaceId");
      if ([...select.options].some(option => option.value === stored)) select.value = stored;
      loadKnowledgeConversation(select.value);
    }).catch(error => { select.innerHTML = '<option value="">知识库不可用</option>'; select.disabled = true; send.disabled = true; toast(error.message, "error"); });
  }

  function renderContentForm(host) {
    $("runHint").textContent = "由内容 Agent 完成撰写、独立质检和返工；公开发布必须显式选择。";
    setContextLink("草稿与定时任务", `${APP_ROOT}/blog.html`);
    const form = formShell(runContent);
    const topic = document.createElement("input"); topic.name = "topic"; topic.required = true; topic.placeholder = "文章主题";
    appendField(form, "主题", topic, true);
    const audience = document.createElement("input"); audience.name = "audience"; audience.value = "软件开发者";
    appendField(form, "目标读者", audience);
    const tone = document.createElement("select"); tone.name = "tone"; tone.innerHTML = '<option value="Practical and technical">技术实践</option><option value="Analytical and concise">分析简报</option><option value="Tutorial and explanatory">教程说明</option>';
    appendField(form, "写作风格", tone);
    const source = document.createElement("input"); source.name = "sourceQuery"; source.placeholder = "可选：知识库检索条件";
    appendField(form, "证据检索", source, true);
    const length = document.createElement("input"); length.name = "targetLength"; length.type = "number"; length.min = "600"; length.max = "6000"; length.value = "1800";
    appendField(form, "目标字数", length);
    const mode = document.createElement("select"); mode.name = "mode"; mode.innerHTML = '<option value="DRAFT">通过后保存为 CSDN 草稿</option><option value="PUBLIC">通过后公开发布</option>';
    appendField(form, "通过后动作", mode, false, "公开发布会产生外部状态变更");
    form.append(submitButton("启动内容工作流")); host.append(form);
  }

  function renderGenericForm(host) {
    $("runHint").textContent = "该编排尚未声明专用交互，已自动生成通用对话入口。";
    const form = formShell(runGeneric);
    const message = document.createElement("textarea"); message.name = "message"; message.required = true; message.rows = 6; message.placeholder = "输入希望 Agent 完成的任务";
    appendField(form, "任务", message, true);
    const maxStep = document.createElement("input"); maxStep.name = "maxStep"; maxStep.type = "number"; maxStep.min = "1"; maxStep.max = "8"; maxStep.value = "4";
    appendField(form, "最大步骤", maxStep);
    form.append(submitButton("运行 Agent")); host.append(form);
  }

  function formValues(form) {
    const values = {};
    new FormData(form).forEach((value, key) => { values[key] = value; });
    form.querySelectorAll("input[type=number]").forEach(input => { values[input.name] = input.value === "" ? null : Number(input.value); });
    form.querySelectorAll("select[multiple]").forEach(select => { values[select.name] = [...select.selectedOptions].map(option => option.value); });
    form.querySelectorAll("input[type=checkbox]").forEach(input => { values[input.name] = input.checked; });
    return values;
  }

  function setBusy(busy, label = "运行中") {
    state.busy = busy;
    document.querySelectorAll("#workflowFormHost button,#workflowFormHost input,#workflowFormHost textarea,#workflowFormHost select").forEach(control => {
      control.disabled = busy || control.dataset.unavailable === "true";
    });
    const button = document.querySelector("#workflowFormHost button[type=submit]");
    if (button) { if (!button.dataset.label) button.dataset.label = button.textContent; button.textContent = busy ? label : button.dataset.label; }
  }

  async function runProfessional(event) {
    event.preventDefault();
    const inputs = formValues(event.currentTarget);
    (state.selected.professional.inputs || []).forEach(field => {
      if (field.remember && inputs[field.name] !== undefined) {
        localStorage.setItem(storageKey(field), Array.isArray(inputs[field.name]) ? JSON.stringify(inputs[field.name]) : String(inputs[field.name]));
      }
    });
    try {
      setBusy(true, "工作流执行中...");
      const run = await api(`/workspace/${encodeURIComponent(workspaceId())}/professional-workflows/run`, { method:"POST", body:JSON.stringify({ type:state.selected.professional.type, inputs }) });
      showProfessionalRun(run); await loadRuns(); toast(run.status === "COMPLETED" ? "工作流已完成" : "工作流未通过", run.status === "COMPLETED" ? "success" : "error");
    } catch (error) { toast(error.message, "error"); }
    finally { setBusy(false); }
  }

  async function runKnowledge(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = formValues(form);
    const knowledgeBaseId = $("knowledgeChatBase")?.value;
    const question = String(values.question || "").trim();
    if (!knowledgeBaseId || !question) return;
    const sessionId = knowledgeSessionId(knowledgeBaseId);
    localStorage.setItem("knowledgeWorkspaceId", knowledgeBaseId);
    clearResult();
    appendKnowledgeMessage("user", question);
    const assistant = appendKnowledgeMessage("assistant", "", { pending:true, meta:"准备检索" });
    form.elements.question.value = "";
    try {
      setBusy(true, "回答中...");
      const preparation = await api(`/workspace/${encodeURIComponent(knowledgeBaseId)}/knowledge/chat/prepare`, {
        method:"POST", body:JSON.stringify({ agentId:state.selected.agentId, sessionId, question, limit:8 })
      });
      setKnowledgeMemoryStatus({
        available:preparation.memoryAvailable,
        recentMessageCount:preparation.recentMessageCount + 1,
        longTermFactCount:preparation.longTermFactCount,
        hasSummary:preparation.hasSummary
      });
      assistant.meta.textContent = preparation.rewrittenQuery === question
        ? `检索到 ${preparation.references.length} 条依据`
        : `已改写查询 · ${preparation.references.length} 条依据`;
      const content = await streamAgent(preparation.agentMessage, 4, {
        sessionId,
        renderResult:false,
        onEvent:event => {
          const labels = { analysis:"分析问题", execution:"组织答案", supervision:"质量检查", summary:"生成回答", complete:"回答完成" };
          assistant.meta.textContent = labels[event.type] || assistant.meta.textContent;
          if (event.type === "summary" && event.content) {
            assistant.body.innerHTML = renderMarkdown(event.content);
            $("knowledgeChatTranscript").scrollTop = $("knowledgeChatTranscript").scrollHeight;
          }
        }
      });
      updateKnowledgeMessage(assistant, content, preparation.rewrittenQuery === question ? "回答完成" : "回答完成 · 已使用查询改写");
      attachKnowledgeReferences(assistant, preparation.references);
      try {
        const memory = await api(`/workspace/${encodeURIComponent(knowledgeBaseId)}/memory/${encodeURIComponent(sessionId)}/messages`, {
          method:"POST", body:JSON.stringify({ role:"assistant", content:content.slice(0, 4000) })
        });
        setKnowledgeMemoryStatus(memory);
      } catch (_) {
        setKnowledgeMemoryStatus({ available:false });
      }
      const references = preparation.references.map(item => ({ title:item.sourcePath, sourcePath:item.sourcePath, startLine:item.startLine, endLine:item.endLine }));
      const run = transientRun(question, content, references, {
        knowledgeBase:knowledgeBaseId, sessionId, rewrittenQuery:preparation.rewrittenQuery,
        evidenceCount:preparation.references.length, memoryMessages:preparation.recentMessageCount + 2
      });
      rememberTransient(run); state.currentReport = content; toast("回答已完成");
    } catch (error) {
      assistant.message.classList.remove("pending"); assistant.message.classList.add("failed");
      assistant.body.textContent = error.message; assistant.meta.textContent = "回答失败"; toast(error.message, "error");
    } finally {
      setBusy(false);
      form.elements.question?.focus();
    }
  }

  async function runGeneric(event) {
    event.preventDefault();
    const values = formValues(event.currentTarget);
    try {
      setBusy(true, "Agent 执行中...");
      const content = await streamAgent(values.message, values.maxStep || 4);
      const run = transientRun(values.message, content, [], { maxStep:values.maxStep || 4 });
      rememberTransient(run); showNormalizedRun(run); toast("Agent 已完成执行");
    } catch (error) { showFailure(error.message); toast(error.message, "error"); }
    finally { setBusy(false); }
  }

  async function runContent(event) {
    event.preventDefault();
    const values = formValues(event.currentTarget);
    if (values.mode === "PUBLIC" && !confirm("质检通过后将公开发布到 CSDN。确定继续吗？")) return;
    const payload = { ...values, tags:[], target:"CSDN", maxRevisions:1 };
    try {
      setBusy(true, "撰写与质检中...");
      const result = await api(`/workspace/${encodeURIComponent(workspaceId())}/blogs/workflow/run`, { method:"POST", body:JSON.stringify(payload) });
      showContentResult(result.workflow, result.post); await loadRuns();
      toast(result.workflow.status === "COMPLETED" ? "内容工作流已完成" : "内容质检未通过", result.workflow.status === "COMPLETED" ? "success" : "error");
    } catch (error) { showFailure(error.message); toast(error.message, "error"); }
    finally { setBusy(false); }
  }

  async function streamAgent(message, maxStep, options = {}) {
    const sessionId = options.sessionId || `workflow-${state.selected.agentId}-${Date.now()}`;
    const renderResult = options.renderResult !== false;
    const response = await fetch(`${API_ROOT}/agent/auto_agent`, {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ aiAgentId:state.selected.agentId, message, sessionId, maxStep })
    });
    if (!response.ok || !response.body) throw new Error(readableError(await response.text(), response.status));
    if (renderResult) {
      clearResult();
      $("resultBand").classList.remove("hidden");
      $("resultStatus").textContent = "运行中";
      $("resultStatus").className = "";
      $("reportViewer").innerHTML = '<div class="stream-state"><i></i><span>Agent 正在执行编排步骤</span></div>';
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let pending = "";
    let finalContent = "";
    let lastContent = "";
    const consume = block => {
      const line = block.split(/\r?\n/).find(item => item.startsWith("data:"));
      if (!line) return;
      try {
        const event = JSON.parse(line.slice(5).trim());
        if (event.type === "error") throw new Error(event.content || "Agent 执行失败");
        if (event.content && event.type !== "complete") lastContent = event.content;
        if (event.type === "summary" && event.content) finalContent = event.content;
        if (renderResult) $("resultStatus").textContent = ({ analysis:"分析中", execution:"执行中", supervision:"质检中", summary:"总结中", complete:"已完成" })[event.type] || "运行中";
        options.onEvent?.(event);
      } catch (error) {
        if (error instanceof SyntaxError) return;
        throw error;
      }
    };
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      pending += decoder.decode(value, { stream:true });
      const blocks = pending.split(/\r?\n\r?\n/); pending = blocks.pop() || ""; blocks.forEach(consume);
    }
    pending += decoder.decode(); if (pending.trim()) consume(pending);
    const content = finalContent || lastContent;
    if (!content.trim()) throw new Error("Agent 已完成执行，但没有返回可展示内容。");
    return content;
  }

  function transientRun(title, report, references, metadata) {
    const now = new Date().toISOString();
    return { runId:`local-${Date.now()}`, title, status:"COMPLETED", report, references, metadata, reviews:[], createdAt:now, updatedAt:now };
  }

  function rememberTransient(run) {
    const key = state.selected.configId;
    const runs = state.transientRuns.get(key) || [];
    state.transientRuns.set(key, [run, ...runs].slice(0, 10));
    state.runs = state.transientRuns.get(key); renderRuns();
  }

  async function loadRuns() {
    const item = state.selected;
    try {
      if (item.adapter === "professional") {
        const all = await api(`/workspace/${encodeURIComponent(workspaceId())}/professional-workflows/runs?type=${encodeURIComponent(item.professional.type)}`);
        state.runs = (all || []).map(run => ({ ...run, source:"professional" }));
      } else if (item.adapter === "content") {
        const [workflows, automation] = await Promise.all([
          api(`/workspace/${encodeURIComponent(workspaceId())}/blogs/workflow`).catch(() => []),
          api(`/workspace/${encodeURIComponent(workspaceId())}/blogs/automation/runs`).catch(() => [])
        ]);
        state.runs = [
          ...(workflows || []).map(run => ({ ...run, title:"内容生成与质检", source:"content" })),
          ...(automation || []).map(run => ({ ...run, title:`每日内容任务 · ${run.businessDate || ""}`, source:"automation" }))
        ].sort((left, right) => new Date(right.updatedAt || 0) - new Date(left.updatedAt || 0));
      } else state.runs = state.transientRuns.get(item.configId) || [];
    } catch (error) {
      state.runs = [];
      toast(error.message, "error");
    }
    renderRuns();
  }

  function renderRuns() {
    $("runCount").textContent = `${state.runs.length} 条`;
    const host = $("runList"); host.replaceChildren();
    if (!state.runs.length) {
      const empty = document.createElement("div"); empty.className = "run-empty"; empty.textContent = "暂无运行记录"; host.append(empty); return;
    }
    state.runs.slice(0, 30).forEach(run => {
      const button = document.createElement("button"); button.type = "button"; button.className = "run-item";
      button.innerHTML = `<strong>${escapeHtml(run.title || run.businessDate || "工作流运行")}</strong><span class="run-status ${String(run.status || "").toLowerCase()}">${escapeHtml(statusLabels[run.status] || run.status || "已完成")}</span><time>${formatTime(run.updatedAt || run.createdAt)}</time>`;
      button.addEventListener("click", () => openRun(run)); host.append(button);
    });
  }

  async function openRun(run) {
    try {
      if (run.source === "professional") showProfessionalRun(run);
      else if (run.source === "content" || run.source === "automation") {
        const post = run.blogId ? await api(`/workspace/${encodeURIComponent(workspaceId())}/blogs/${encodeURIComponent(run.blogId)}`) : null;
        showContentResult(run, post);
      } else showNormalizedRun(run);
    } catch (error) { toast(error.message, "error"); }
  }

  function clearResult() {
    state.currentReport = "";
    $("resultBand").classList.add("hidden");
    $("reportViewer").replaceChildren(); $("resultMeta").replaceChildren(); $("reviewStrip").replaceChildren(); $("references").replaceChildren();
    $("errorPanel").classList.add("hidden"); $("errorPanel").textContent = "";
  }

  function showProfessionalRun(run) {
    showNormalizedRun({ ...run, report:run.report || "", title:run.title || state.selected.name });
  }

  function showContentResult(workflow, post) {
    showNormalizedRun({
      ...workflow, title:post?.title || workflow.title || "内容工作流",
      report:post?.content || "", metadata:{ target:workflow.target, mode:workflow.mode, blogId:workflow.blogId }, references:post?.sources || []
    });
  }

  function showNormalizedRun(run) {
    state.currentReport = normalizeMarkdownTables(run.report || "");
    $("resultBand").classList.remove("hidden");
    $("resultStatus").textContent = statusLabels[run.status] || run.status || "已完成";
    $("resultStatus").className = String(run.status || "completed").toLowerCase();
    $("resultTime").textContent = formatTime(run.updatedAt || run.createdAt);
    $("resultTitle").textContent = run.title || "运行结果";
    $("reportViewer").innerHTML = renderMarkdown(state.currentReport);
    renderMeta(run.metadata || {}); renderReviews(run.reviews || []); renderReferences(run.references || []);
    const error = run.error;
    $("errorPanel").classList.toggle("hidden", !error); $("errorPanel").textContent = error || "";
    $("resultBand").scrollIntoView({ behavior:"smooth", block:"start" });
  }

  function showFailure(message) {
    showNormalizedRun({ title:"执行失败", status:"FAILED", report:"", error:message, createdAt:new Date().toISOString(), metadata:{ agentId:state.selected.agentId } });
  }

  function renderMeta(metadata) {
    $("resultMeta").replaceChildren(...Object.entries(metadata).filter(([, value]) => value !== null && value !== undefined && value !== "").map(([key, value]) => {
      const item = document.createElement("span"); item.className = "meta-item"; item.textContent = `${key}: ${typeof value === "object" ? JSON.stringify(value) : value}`; return item;
    }));
  }

  function renderReviews(reviews) {
    $("reviewStrip").replaceChildren(...reviews.map(review => {
      const item = document.createElement("div"); item.className = `review-item ${review.approved ? "" : "rejected"}`;
      const issues = review.issues?.length ? ` · ${review.issues.join("；")}` : "";
      item.textContent = `第 ${review.attempt} 次质检 · ${review.score} 分 · ${review.approved ? "通过" : "未通过"}${issues}`; return item;
    }));
  }

  function renderReferences(references) {
    const host = $("references"); host.replaceChildren(); if (!references.length) return;
    const title = document.createElement("h3"); title.textContent = "证据来源"; host.append(title);
    references.forEach((reference, index) => {
      const row = document.createElement("div"); row.className = "reference-item";
      const label = `[${index + 1}] ${reference.title || reference.sourcePath || "来源"}`;
      if (reference.sourceUrl || reference.originalUrl) { const link = document.createElement("a"); link.href = reference.sourceUrl || reference.originalUrl; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = label; row.append(link); }
      else row.textContent = `${label}${reference.startLine ? `:${reference.startLine}-${reference.endLine}` : ""}`;
      host.append(row);
    });
  }

  function currentReport() {
    return state.currentReport.trim();
  }

  async function copyText(content) {
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(content); return; } catch { /* use the HTTP fallback */ }
    }
    const input = document.createElement("textarea");
    input.value = content;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.focus(); input.select();
    const copied = document.execCommand("copy");
    input.remove();
    if (!copied) throw new Error("浏览器未允许访问剪贴板");
  }

  $("copyButton").addEventListener("click", async () => {
    const content = currentReport(); if (!content) return toast("没有可复制的结果", "error");
    try { await copyText(content); toast("结果已复制"); }
    catch (error) { toast(error.message, "error"); }
  });
  $("downloadButton").addEventListener("click", () => {
    const content = currentReport(); if (!content) return toast("没有可导出的结果", "error");
    const blob = new Blob([content], { type:"text/markdown;charset=utf-8" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `${state.selected.configId}-${Date.now()}.md`; link.click(); URL.revokeObjectURL(link.href);
  });
  $("workflowSearch").addEventListener("input", event => { state.query = event.target.value; renderCatalog(); });
  $("refreshButton").addEventListener("click", () => loadCatalog().then(() => toast("编排与运行记录已刷新")).catch(error => toast(error.message, "error")));
  workspaceInput.addEventListener("change", () => {
    localStorage.setItem(WORKFLOW_WORKSPACE_STORAGE_KEY, workspaceId());
    loadCatalog().catch(error => toast(error.message, "error"));
  });

  loadCatalog(false).catch(error => {
    $("workflowCatalog").innerHTML = `<div class="catalog-empty">${escapeHtml(error.message)}</div>`;
    toast(error.message, "error");
  });
})();
