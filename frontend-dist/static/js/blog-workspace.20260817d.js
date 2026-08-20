(() => {
  "use strict";

  if (localStorage.getItem("isLoggedIn") !== "true" || !localStorage.getItem("token") || !localStorage.getItem("userInfo")) {
    location.replace("/ai-agent-station/login");
    return;
  }

  const state = {
    posts: [],
    workflows: [],
    selected: null,
    status: "ALL",
    search: "",
    mode: "edit",
    dirty: false,
    busy: false,
    automationBusy: false
  };

  const elements = Object.fromEntries([
    "workspaceId", "postCount", "draftList", "searchInput", "emptyState", "editorShell",
    "statusBadge", "saveState", "titleInput", "summaryInput", "tagsInput", "contentInput",
    "markdownPreview", "artifactInfo", "workflowInfo", "generateModal", "generateForm", "submitGenerateButton",
    "saveButton", "publishButton", "publishMode", "deleteButton", "exportButton",
    "automationModal", "automationForm", "automationAgentInfo", "automationStatus",
    "automationRunList", "saveAutomationButton", "localProbeButton"
  ].map(id => [id, document.getElementById(id)]));

  const apiBase = () => `/ai-agent-study/api/v1/workspace/${encodeURIComponent(elements.workspaceId.value.trim())}/blogs`;

  function readableError(value, status) {
    const message = String(value || "");
    if (status === 429 || /429|too many requests|rate.?limit/i.test(message)) return "模型服务当前请求过多，任务已记录，请稍后查看自动重试结果。";
    if (/401|unauthorized|invalid.?token|token.*(invalid|unavailable|expired)/i.test(message)) return "模型或发布凭证不可用，请在模型配置或发布连接中检查凭证。";
    if (/timeout|timed out|connect.*(refused|reset)|connection.*(failed|closed)/i.test(message)) return "上游模型、新闻源或发布服务暂时无法连接，请稍后重试。";
    if (status >= 500) return "内容自动化服务暂时不可用，请稍后重试。";
    return message || `请求失败 (${status})`;
  }

  async function request(path = "", options = {}) {
    let response;
    try {
      response = await fetch(`${apiBase()}${path}`, {
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options
      });
    } catch (error) {
      throw new Error(readableError(error.message, 0));
    }
    let payload;
    try {
      payload = await response.json();
    } catch {
      throw new Error(readableError("", response.status));
    }
    if (!response.ok || payload.code !== "0000") {
      throw new Error(readableError(payload.info, response.status));
    }
    return payload.data;
  }

  function toast(message, type = "success") {
    const item = document.createElement("div");
    item.className = `toast ${type === "error" ? "error" : ""}`;
    item.textContent = message;
    document.getElementById("toastRegion").appendChild(item);
    setTimeout(() => item.remove(), 3200);
  }

  function setBusy(busy, label) {
    state.busy = busy;
    const locked = state.selected?.status === "PUBLISHED";
    elements.saveButton.disabled = busy || locked;
    elements.publishButton.disabled = busy || locked;
    elements.publishMode.disabled = busy || locked;
    elements.deleteButton.disabled = busy || locked;
    elements.submitGenerateButton.disabled = busy;
    if (label) elements.saveState.textContent = label;
  }

  function parseTags(value) {
    return [...new Set(value.split(/[,，]/).map(tag => tag.trim()).filter(Boolean))].slice(0, 10);
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    })[char]);
  }

  function inlineMarkdown(value) {
    return escapeHtml(value)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  function renderMarkdown(markdown) {
    const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
    const output = [];
    let inCode = false;
    let codeLines = [];
    let listType = null;

    const closeList = () => {
      if (listType) output.push(`</${listType}>`);
      listType = null;
    };

    for (const line of lines) {
      if (line.startsWith("```")) {
        closeList();
        if (inCode) {
          output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
          codeLines = [];
        }
        inCode = !inCode;
        continue;
      }
      if (inCode) {
        codeLines.push(line);
        continue;
      }
      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        closeList();
        const level = heading[1].length;
        output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
        continue;
      }
      const unordered = line.match(/^\s*[-*]\s+(.+)$/);
      const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
      if (unordered || ordered) {
        const nextType = unordered ? "ul" : "ol";
        if (listType !== nextType) {
          closeList();
          output.push(`<${nextType}>`);
          listType = nextType;
        }
        output.push(`<li>${inlineMarkdown((unordered || ordered)[1])}</li>`);
        continue;
      }
      closeList();
      if (line.startsWith("> ")) {
        output.push(`<blockquote><p>${inlineMarkdown(line.slice(2))}</p></blockquote>`);
      } else if (line.trim()) {
        output.push(`<p>${inlineMarkdown(line)}</p>`);
      }
    }
    closeList();
    if (codeLines.length) output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    return output.join("\n");
  }

  function formatTime(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
      .format(new Date(value));
  }

  function filteredPosts() {
    const query = state.search.toLowerCase();
    return state.posts.filter(post => {
      if (state.status !== "ALL" && post.status !== state.status) return false;
      if (!query) return true;
      return `${post.title} ${post.summary || ""} ${(post.tags || []).join(" ")}`.toLowerCase().includes(query);
    });
  }

  function statusLabel(post) {
    if (post.status !== "PUBLISHED") return "草稿";
    if (post.publication?.target === "CSDN" && post.publication?.mode === "DRAFT") return "CSDN 草稿";
    if (post.publication?.target === "CSDN" && post.publication?.mode === "PUBLIC") return "CSDN 已发布";
    return "已归档";
  }

  function updatePublishButton() {
    if (state.selected?.status === "PUBLISHED") {
      elements.publishButton.textContent = statusLabel(state.selected);
      return;
    }
    elements.publishButton.textContent = elements.publishMode.value === "PUBLIC"
      ? "公开发布到 CSDN" : "保存到 CSDN 草稿";
  }

  function renderList() {
    const posts = filteredPosts();
    elements.postCount.textContent = `${state.posts.length} 篇`;
    elements.draftList.replaceChildren();
    if (!posts.length) {
      const empty = document.createElement("div");
      empty.className = "list-empty";
      empty.textContent = state.posts.length ? "没有匹配的博文" : "暂无博文";
      elements.draftList.appendChild(empty);
      return;
    }
    posts.forEach(post => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `draft-item ${state.selected?.id === post.id ? "active" : ""}`;
      const title = document.createElement("span");
      title.className = "draft-item-title";
      title.textContent = post.title;
      const summary = document.createElement("div");
      summary.className = "draft-item-summary";
      summary.textContent = post.summary || "暂无摘要";
      const meta = document.createElement("div");
      meta.className = "draft-item-meta";
      const status = document.createElement("span");
      status.className = `mini-status ${post.status === "PUBLISHED" ? "published" : ""}`;
      status.textContent = statusLabel(post);
      const time = document.createElement("span");
      time.textContent = formatTime(post.updatedAt);
      meta.append(status, time);
      button.append(title, summary, meta);
      button.addEventListener("click", () => selectPost(post.id));
      elements.draftList.appendChild(button);
    });
  }

  function setDirty(dirty) {
    state.dirty = dirty;
    elements.saveState.textContent = dirty ? "有未保存修改" : "已保存";
  }

  function renderEditor() {
    const post = state.selected;
    elements.emptyState.classList.toggle("hidden", Boolean(post));
    elements.editorShell.classList.toggle("hidden", !post);
    if (!post) return;

    elements.titleInput.value = post.title || "";
    elements.summaryInput.value = post.summary || "";
    elements.tagsInput.value = (post.tags || []).join(", ");
    elements.contentInput.value = post.content || "";
    elements.statusBadge.textContent = statusLabel(post);
    elements.statusBadge.classList.toggle("published", post.status === "PUBLISHED");
    elements.artifactInfo.replaceChildren();
    if (post.publication?.externalUrl) {
      const link = document.createElement("a");
      link.href = post.publication.externalUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = post.publication?.mode === "PUBLIC" ? "打开 CSDN 文章" : "打开 CSDN 草稿";
      elements.artifactInfo.appendChild(link);
    } else if (post.publishArtifact) {
      elements.artifactInfo.textContent = `归档：${post.publishArtifact}`;
    }
    elements.artifactInfo.classList.toggle("hidden", !elements.artifactInfo.childNodes.length);
    const workflow = state.workflows.find(item => item.blogId === post.id);
    elements.workflowInfo.classList.toggle("hidden", !workflow);
    elements.workflowInfo.classList.toggle("rejected", workflow?.status === "REJECTED" || workflow?.status === "FAILED");
    if (workflow) {
      const lastReview = workflow.reviews?.at(-1);
      const score = lastReview ? ` · 检查 ${lastReview.score} 分` : "";
      const labels = {
        COMPLETED: `Agent 工作流已完成${score}`,
        REJECTED: `检查未通过${score} · 已停止发布`,
        FAILED: "Agent 工作流执行失败",
        RUNNING: "Agent 工作流执行中"
      };
      elements.workflowInfo.textContent = labels[workflow.status] || workflow.status;
    }
    const locked = post.status === "PUBLISHED";
    [elements.titleInput, elements.summaryInput, elements.tagsInput, elements.contentInput]
      .forEach(input => { input.disabled = locked; });
    elements.saveButton.disabled = locked || state.busy;
    elements.publishButton.disabled = locked || state.busy;
    elements.publishMode.disabled = locked || state.busy;
    elements.deleteButton.disabled = locked || state.busy;
    updatePublishButton();
    setDirty(false);
    renderPreview();
    renderList();
  }

  function renderPreview() {
    elements.markdownPreview.innerHTML = renderMarkdown(elements.contentInput.value);
  }

  async function loadPosts(preferredId) {
    try {
      [state.posts, state.workflows] = await Promise.all([request(), request("/workflow")]);
      const selectedId = preferredId || state.selected?.id;
      state.selected = state.posts.find(post => post.id === selectedId) || null;
      renderList();
      renderEditor();
    } catch (error) {
      toast(error.message, "error");
    }
  }

  async function selectPost(id) {
    if (state.dirty && !confirm("当前修改尚未保存，确定切换吗？")) return;
    const cached = state.posts.find(post => post.id === id);
    state.selected = cached || null;
    renderEditor();
    try {
      state.selected = await request(`/${encodeURIComponent(id)}`);
      renderEditor();
    } catch (error) {
      toast(error.message, "error");
    }
  }

  function draftPayload() {
    return {
      title: elements.titleInput.value.trim(),
      summary: elements.summaryInput.value.trim(),
      content: elements.contentInput.value,
      tags: parseTags(elements.tagsInput.value)
    };
  }

  async function createDraft() {
    try {
      setBusy(true, "正在创建");
      const draft = await request("", {
        method: "POST",
        body: JSON.stringify({ title: "未命名博文", summary: "", content: "# 未命名博文\n\n", tags: [] })
      });
      await loadPosts(draft.id);
      elements.titleInput.focus();
      elements.titleInput.select();
      toast("已创建新草稿");
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function saveDraft(silent = false) {
    if (!state.selected || state.selected.status === "PUBLISHED") return state.selected;
    const payload = draftPayload();
    if (!payload.title || !payload.content.trim()) {
      throw new Error("标题和正文不能为空");
    }
    setBusy(true, "正在保存");
    try {
      const updated = await request(`/${encodeURIComponent(state.selected.id)}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      state.selected = updated;
      state.posts = state.posts.map(post => post.id === updated.id ? updated : post);
      setDirty(false);
      renderList();
      if (!silent) toast("草稿已保存");
      return updated;
    } finally {
      setBusy(false);
    }
  }

  async function publishDraft() {
    if (!state.selected || state.selected.status === "PUBLISHED") return;
    const mode = elements.publishMode.value;
    const confirmation = mode === "PUBLIC"
      ? "当前文章将立即公开发布到 CSDN，并锁定本地版本。确定公开发布吗？"
      : "将当前版本保存到 CSDN 草稿箱并锁定，同时保留本地 Markdown 归档。确定继续吗？";
    if (!confirm(confirmation)) return;
    try {
      await saveDraft(true);
      setBusy(true, "正在同步到 CSDN");
      const published = await request(`/${encodeURIComponent(state.selected.id)}/publish`, {
        method: "POST",
        body: JSON.stringify({ target: "CSDN", mode })
      });
      state.selected = published;
      state.posts = state.posts.map(post => post.id === published.id ? published : post);
      renderEditor();
      toast(mode === "PUBLIC" ? "已公开发布到 CSDN" : "已保存到 CSDN 草稿箱");
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function deleteDraft() {
    if (!state.selected || state.selected.status === "PUBLISHED") return;
    if (!confirm(`确定删除“${state.selected.title}”吗？`)) return;
    try {
      setBusy(true, "正在删除");
      await request(`/${encodeURIComponent(state.selected.id)}`, { method: "DELETE" });
      state.selected = null;
      await loadPosts();
      toast("草稿已删除");
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  function exportMarkdown() {
    if (!state.selected) return;
    const blob = new Blob([elements.contentInput.value], { type: "text/markdown;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${state.selected.slug || "blog-post"}.md`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function openGenerateModal() {
    elements.generateModal.classList.remove("hidden");
    elements.generateForm.elements.topic.focus();
  }

  function closeGenerateModal() {
    if (!state.busy) elements.generateModal.classList.add("hidden");
  }

  function automationStatusLabel(status) {
    return ({
      RUNNING: "运行中",
      RETRY_WAITING: "等待重试",
      COMPLETED: "已完成",
      FAILED: "失败"
    })[status] || status;
  }

  function renderAutomationRuns(runs) {
    elements.automationRunList.replaceChildren();
    if (!runs.length) {
      const empty = document.createElement("div");
      empty.className = "automation-run-empty";
      empty.textContent = "暂无运行记录";
      elements.automationRunList.appendChild(empty);
      return;
    }
    runs.slice(0, 5).forEach(run => {
      const row = document.createElement("div");
      row.className = "automation-run-row";
      const detail = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = run.businessDate || run.runId;
      const meta = document.createElement("span");
      const retry = run.status === "RETRY_WAITING" && run.nextAttemptAt
        ? ` · ${formatTime(run.nextAttemptAt)} 重试` : "";
      meta.textContent = `${run.events?.length || 0} 个事件 · 第 ${run.attempt}/${run.maxAttempts} 次${retry}`;
      detail.append(title, meta);
      const status = document.createElement("span");
      status.className = `automation-run-status ${String(run.status || "").toLowerCase()}`;
      status.textContent = automationStatusLabel(run.status);
      row.append(detail, status);
      elements.automationRunList.appendChild(row);
    });
  }

  function fillAutomationForm(config) {
    const form = elements.automationForm.elements;
    form.enabled.checked = config.enabled;
    form.time.value = config.time || "09:00";
    form.publishMode.value = config.publishMode || "PUBLIC";
    form.eventCount.value = config.eventCount || 5;
    form.lookbackHours.value = config.lookbackHours || 72;
    form.maxRetries.value = config.maxRetries ?? 3;
    form.retryDelayMinutes.value = config.retryDelayMinutes || 30;
    form.targetLength.value = config.targetLength || 1800;
    elements.automationAgentInfo.textContent = `Agent ${config.agentId} · 每日 ${form.time.value}`;
    elements.automationStatus.textContent = config.enabled ? "已启用" : "未启用";
    elements.automationStatus.classList.toggle("enabled", config.enabled);
  }

  async function loadAutomation() {
    const [config, runs] = await Promise.all([request("/automation"), request("/automation/runs")]);
    fillAutomationForm(config);
    renderAutomationRuns(runs);
  }

  async function openAutomationModal() {
    elements.automationModal.classList.remove("hidden");
    try {
      await loadAutomation();
    } catch (error) {
      toast(error.message, "error");
    }
  }

  function closeAutomationModal() {
    if (!state.automationBusy) elements.automationModal.classList.add("hidden");
  }

  async function saveAutomation(event) {
    event.preventDefault();
    const form = new FormData(elements.automationForm);
    const payload = {
      enabled: elements.automationForm.elements.enabled.checked,
      time: form.get("time"),
      publishMode: form.get("publishMode"),
      eventCount: Number(form.get("eventCount")),
      lookbackHours: Number(form.get("lookbackHours")),
      maxRetries: Number(form.get("maxRetries")),
      retryDelayMinutes: Number(form.get("retryDelayMinutes")),
      targetLength: Number(form.get("targetLength"))
    };
    try {
      state.automationBusy = true;
      elements.saveAutomationButton.disabled = true;
      const config = await request("/automation", { method: "PUT", body: JSON.stringify(payload) });
      fillAutomationForm(config);
      toast(config.enabled ? "每日热点任务已启用" : "每日热点任务已停用");
    } catch (error) {
      toast(error.message, "error");
    } finally {
      state.automationBusy = false;
      elements.saveAutomationButton.disabled = false;
    }
  }

  async function runAutomationProbe() {
    try {
      state.automationBusy = true;
      elements.localProbeButton.disabled = true;
      elements.localProbeButton.textContent = "Agent 运行中...";
      const run = await request("/automation/run", { method: "POST", body: JSON.stringify({ mode: "LOCAL" }) });
      await loadAutomation();
      if (run.status === "COMPLETED") {
        await loadPosts(run.blogId);
        toast("本地试运行已完成");
      } else if (run.status === "RETRY_WAITING") {
        toast("本次失败，已进入自动重试队列", "error");
      } else {
        toast(run.error || "本地试运行失败", "error");
      }
    } catch (error) {
      toast(error.message, "error");
    } finally {
      state.automationBusy = false;
      elements.localProbeButton.disabled = false;
      elements.localProbeButton.textContent = "立即试运行";
    }
  }

  async function generateDraft(event) {
    event.preventDefault();
    const form = new FormData(elements.generateForm);
    const payload = {
      topic: form.get("topic").trim(),
      audience: form.get("audience").trim(),
      tone: form.get("tone"),
      targetLength: Number(form.get("targetLength")),
      sourceQuery: form.get("sourceQuery").trim() || null,
      tags: parseTags(form.get("tags")),
      target: "CSDN",
      mode: form.get("publishMode"),
      maxRevisions: Number(form.get("maxRevisions"))
    };
    try {
      setBusy(true, "Agent 正在撰写与检查");
      elements.submitGenerateButton.textContent = "工作流执行中...";
      const result = await request("/workflow/run", { method: "POST", body: JSON.stringify(payload) });
      elements.generateModal.classList.add("hidden");
      elements.generateForm.reset();
      await loadPosts(result.post.id);
      if (result.workflow.status === "COMPLETED") {
        toast(payload.mode === "PUBLIC" ? "检查通过，已自动公开发布" : "检查通过，已保存到 CSDN 草稿");
      } else {
        toast("检查未通过，已保留草稿并停止发布", "error");
      }
    } catch (error) {
      toast(error.message, "error");
    } finally {
      elements.submitGenerateButton.textContent = "启动自动工作流";
      setBusy(false);
    }
  }

  document.getElementById("backButton")?.addEventListener("click", () => { location.href = "/ai-agent-station/dashboard"; });
  document.getElementById("newButton").addEventListener("click", createDraft);
  document.getElementById("emptyNewButton").addEventListener("click", createDraft);
  document.getElementById("refreshButton").addEventListener("click", () => loadPosts());
  document.getElementById("generateButton").addEventListener("click", openGenerateModal);
  document.getElementById("automationButton").addEventListener("click", openAutomationModal);
  document.getElementById("closeAutomationButton").addEventListener("click", closeAutomationModal);
  document.getElementById("cancelAutomationButton").addEventListener("click", closeAutomationModal);
  elements.automationModal.addEventListener("click", event => {
    if (event.target === elements.automationModal) closeAutomationModal();
  });
  elements.automationForm.addEventListener("submit", saveAutomation);
  elements.localProbeButton.addEventListener("click", runAutomationProbe);
  document.getElementById("closeGenerateButton").addEventListener("click", closeGenerateModal);
  document.getElementById("cancelGenerateButton").addEventListener("click", closeGenerateModal);
  elements.generateModal.addEventListener("click", event => { if (event.target === elements.generateModal) closeGenerateModal(); });
  elements.generateForm.addEventListener("submit", generateDraft);
  elements.saveButton.addEventListener("click", () => saveDraft().catch(error => toast(error.message, "error")));
  elements.publishButton.addEventListener("click", publishDraft);
  elements.publishMode.addEventListener("change", updatePublishButton);
  elements.deleteButton.addEventListener("click", deleteDraft);
  elements.exportButton.addEventListener("click", exportMarkdown);
  elements.searchInput.addEventListener("input", event => { state.search = event.target.value; renderList(); });
  elements.workspaceId.addEventListener("change", () => {
    localStorage.setItem("workspaceId", elements.workspaceId.value.trim() || "85374287");
    state.selected = null;
    loadPosts();
  });
  [elements.titleInput, elements.summaryInput, elements.tagsInput, elements.contentInput].forEach(input => {
    input.addEventListener("input", () => {
      setDirty(true);
      if (input === elements.contentInput && state.mode === "preview") renderPreview();
    });
  });
  document.querySelectorAll(".filter-tab").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach(tab => tab.classList.toggle("active", tab === button));
      state.status = button.dataset.status;
      renderList();
    });
  });
  document.querySelectorAll("[data-mode]").forEach(button => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      document.querySelectorAll("[data-mode]").forEach(item => item.classList.toggle("active", item === button));
      elements.contentInput.classList.toggle("hidden", state.mode !== "edit");
      elements.markdownPreview.classList.toggle("hidden", state.mode !== "preview");
      if (state.mode === "preview") renderPreview();
    });
  });
  window.addEventListener("beforeunload", event => {
    if (state.dirty) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
  window.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveDraft().catch(error => toast(error.message, "error"));
    }
  });

  elements.workspaceId.value = localStorage.getItem("workspaceId") || localStorage.getItem("blogWorkspaceId") || "85374287";
  document.documentElement.dataset.blogReady = "true";
  loadPosts();
})();
