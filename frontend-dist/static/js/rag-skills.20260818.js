(() => {
  "use strict";
  if (localStorage.getItem("isLoggedIn") !== "true" || !localStorage.getItem("token") || !localStorage.getItem("userInfo")) {
    location.replace("/ai-agent-station/login");
    return;
  }

  const $ = id => document.getElementById(id);
  const state = {
    tab: new URLSearchParams(location.search).get("tab") === "skills" ? "skills" : "rag",
    skills: [], agents: [], selectedId: null, sourceFiles: [], sources: [], knowledgeBases: []
  };
  const workspaceId = $("workspaceId");
  const preferredKnowledgeBaseId = localStorage.getItem("knowledgeWorkspaceId") || "personal-workspace";
  if (workspaceId.tagName !== "SELECT") workspaceId.value = preferredKnowledgeBaseId;
  const apiBase = () => `/ai-agent-study/api/v1/workspace/${encodeURIComponent(workspaceId.value.trim() || "personal-workspace")}`;
  const knowledgeBaseApi = "/ai-agent-study/api/v1/workspace/knowledge-bases";
  const supportedExtensions = new Set([
    "java", "md", "markdown", "txt", "py", "js", "jsx", "ts", "tsx", "vue", "go", "rs",
    "c", "h", "cpp", "hpp", "cs", "kt", "kts", "scala", "sql", "html", "htm", "css",
    "scss", "less", "xml", "json", "yaml", "yml", "toml", "properties", "gradle", "sh",
    "ps1", "bat"
  ]);

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[character]);
  }

  async function request(path, options = {}) {
    const response = await fetch(`${apiBase()}${path}`, { headers: { "Content-Type":"application/json", ...(options.headers || {}) }, ...options });
    let payload;
    try { payload = await response.json(); } catch { throw new Error(`请求失败 (${response.status})`); }
    if (!response.ok || payload.code !== "0000") throw new Error(payload.info || `请求失败 (${response.status})`);
    return payload.data;
  }

  async function catalogRequest(path = "", options = {}) {
    const response = await fetch(`${knowledgeBaseApi}${path}`, {
      headers: { "Content-Type":"application/json", ...(options.headers || {}) }, ...options
    });
    let payload;
    try { payload = await response.json(); } catch { throw new Error(`请求失败 (${response.status})`); }
    if (!response.ok || payload.code !== "0000") throw new Error(payload.info || `请求失败 (${response.status})`);
    return payload.data;
  }

  function toast(message, kind = "success") {
    const item = document.createElement("div"); item.className = `toast ${kind}`; item.textContent = message;
    $("toastRegion").append(item); setTimeout(() => item.remove(), 3600);
  }

  function initResourceShell() {
    const sidebar = $("workspaceShellSidebar");
    const toggle = $("standaloneSidebarToggle");
    if (!sidebar || !toggle) return;

    let user = {};
    try { user = JSON.parse(localStorage.getItem("userInfo") || "{}"); } catch { user = {}; }
    const username = user.username || user.userName || "工作台用户";
    const initial = username.slice(0, 1).toUpperCase() || "U";
    ["shellUsername", "shellTopbarUsername"].forEach(id => { if ($(id)) $(id).textContent = username; });
    ["shellUserInitial", "shellTopbarInitial"].forEach(id => { if ($(id)) $(id).textContent = initial; });

    const apply = collapsed => {
      document.body.classList.toggle("workspace-shell-collapsed", collapsed);
      toggle.querySelector("span").textContent = collapsed ? "›" : "‹";
      toggle.title = collapsed ? "展开侧边栏" : "收起侧边栏";
      toggle.setAttribute("aria-label", toggle.title);
      toggle.setAttribute("aria-expanded", String(!collapsed));
    };
    apply(localStorage.getItem("workspaceSidebarCollapsed") === "true");
    toggle.onclick = () => {
      const collapsed = !document.body.classList.contains("workspace-shell-collapsed");
      localStorage.setItem("workspaceSidebarCollapsed", String(collapsed));
      apply(collapsed);
    };
  }

  function switchTab(tab, updateUrl = true) {
    if (!$("ragTab") || !$("skillsTab") || !$("ragPanel") || !$("skillsPanel")) return;
    state.tab = tab;
    $("ragTab").classList.toggle("active", tab === "rag");
    $("skillsTab").classList.toggle("active", tab === "skills");
    $("ragTab").setAttribute("aria-selected", String(tab === "rag"));
    $("skillsTab").setAttribute("aria-selected", String(tab === "skills"));
    $("ragPanel").classList.toggle("hidden", tab !== "rag");
    $("skillsPanel").classList.toggle("hidden", tab !== "skills");
    if (updateUrl) history.replaceState(null, "", `?tab=${tab}`);
  }

  function selectedKnowledgeBase() {
    return state.knowledgeBases.find(item => item.knowledgeBaseId === workspaceId.value) || null;
  }

  function knowledgeAgentById(agentId) {
    return state.agents.find(agent => agent.agentId === agentId);
  }

  async function loadKnowledgeBases(preserveSelection = true) {
    const selectedId = preserveSelection ? (workspaceId.value || preferredKnowledgeBaseId) : workspaceId.value;
    [state.knowledgeBases, state.agents] = await Promise.all([
      catalogRequest(), catalogRequest("/agents")
    ]);
    const activeSelection = state.knowledgeBases.some(item => item.knowledgeBaseId === selectedId)
      ? selectedId
      : state.knowledgeBases[0]?.knowledgeBaseId || "";
    workspaceId.innerHTML = state.knowledgeBases.map(item =>
      `<option value="${escapeHtml(item.knowledgeBaseId)}">${escapeHtml(item.knowledgeBaseName)}</option>`).join("");
    workspaceId.value = activeSelection;
    if (activeSelection) localStorage.setItem("knowledgeWorkspaceId", activeSelection);
    renderKnowledgeBases();
  }

  function renderKnowledgeBases() {
    const selected = selectedKnowledgeBase();
    const search = $("knowledgeBaseSearch");
    const query = search ? search.value.trim().toLowerCase() : "";
    const knowledgeBases = state.knowledgeBases.filter(item => !query || `${item.knowledgeBaseName} ${item.knowledgeBaseId} ${item.description || ""}`.toLowerCase().includes(query));
    $("knowledgeBaseCount").textContent = state.knowledgeBases.length;
    $("knowledgeBaseList").innerHTML = knowledgeBases.length ? knowledgeBases.map(item => `
      <tr class="${item.knowledgeBaseId === workspaceId.value ? "active" : ""}">
        <td><button class="table-name-button" type="button" data-knowledge-base-select="${escapeHtml(item.knowledgeBaseId)}"><strong>${escapeHtml(item.knowledgeBaseName)}</strong><small>${escapeHtml(item.description || "暂无描述")}</small></button></td>
        <td><code>${escapeHtml(item.knowledgeBaseId)}</code></td>
        <td><em class="pill ${item.status ? "enabled" : "disabled"}">${item.status ? "启用" : "停用"}</em></td>
        <td>${escapeHtml(item.sourceCount)}</td>
        <td>${escapeHtml(item.chunkCount)}</td>
        <td>${escapeHtml(item.agentIds.length)}</td>
        <td><div class="table-actions"><button type="button" data-knowledge-base-select="${escapeHtml(item.knowledgeBaseId)}">内容</button><button type="button" data-configure-knowledge-base="${escapeHtml(item.knowledgeBaseId)}">装配</button><button type="button" data-edit-knowledge-base="${escapeHtml(item.knowledgeBaseId)}">编辑</button><button class="danger" type="button" data-delete-knowledge-base="${escapeHtml(item.knowledgeBaseId)}">删除</button></div></td>
      </tr>`).join("") : `<tr><td class="table-empty" colspan="7">${state.knowledgeBases.length ? "没有匹配的知识库" : "还没有知识库，请先新建"}</td></tr>`;
    $("knowledgeBaseList").querySelectorAll("[data-knowledge-base-select]").forEach(button => {
      button.onclick = async () => {
        workspaceId.value = button.dataset.knowledgeBaseSelect;
        localStorage.setItem("knowledgeWorkspaceId", workspaceId.value);
        clearSourceQueue();
        renderKnowledgeBases();
        try {
          await loadRag();
          $("ragPanel").scrollIntoView({ behavior:"smooth", block:"start" });
        } catch (error) { toast(error.message, "error"); }
      };
    });
    $("knowledgeBaseList").querySelectorAll("[data-configure-knowledge-base]").forEach(button => {
      button.onclick = () => {
        const item = state.knowledgeBases.find(entry => entry.knowledgeBaseId === button.dataset.configureKnowledgeBase);
        renderKnowledgeBaseDetail(item);
        $("knowledgeBaseDetailDialog").showModal();
      };
    });
    $("knowledgeBaseList").querySelectorAll("[data-edit-knowledge-base]").forEach(button => {
      button.onclick = () => openKnowledgeBaseDialog(state.knowledgeBases.find(item => item.knowledgeBaseId === button.dataset.editKnowledgeBase));
    });
    $("knowledgeBaseList").querySelectorAll("[data-delete-knowledge-base]").forEach(button => {
      button.onclick = () => deleteKnowledgeBase(state.knowledgeBases.find(item => item.knowledgeBaseId === button.dataset.deleteKnowledgeBase));
    });
    renderKnowledgeBaseDetail(selected);
  }

  function renderKnowledgeBaseDetail(knowledgeBase) {
    if (!knowledgeBase) {
      $("knowledgeBaseDetail").innerHTML = '<div class="empty-state compact">选择一个知识库</div>';
      return;
    }
    const available = state.agents.filter(agent => !knowledgeBase.agentIds.includes(agent.agentId));
    const bindings = knowledgeBase.agentIds.map(agentId => {
      const agent = knowledgeAgentById(agentId);
      return `<div class="binding-item"><span><strong>${escapeHtml(agent?.agentName || agentId)}</strong><small>Agent ${escapeHtml(agentId)}</small></span><button type="button" data-unbind-knowledge-agent="${escapeHtml(agentId)}">解绑</button></div>`;
    }).join("") || '<div class="knowledge-binding-empty">尚未提供给任何 Agent</div>';
    $("knowledgeBaseDetail").innerHTML = `
      <div class="detail-heading"><div><span class="detail-eyebrow">知识库装配</span><h2>${escapeHtml(knowledgeBase.knowledgeBaseName)}</h2><p>${escapeHtml(knowledgeBase.description || "暂无描述")}</p></div><div class="detail-actions"><button class="button secondary" id="editKnowledgeBaseButton" type="button">编辑</button><button class="icon-button" id="closeKnowledgeBaseDetailButton" type="button" title="关闭" aria-label="关闭">×</button></div></div>
      <dl class="knowledge-base-summary"><div><dt>知识库 ID</dt><dd>${escapeHtml(knowledgeBase.knowledgeBaseId)}</dd></div><div><dt>底层检索</dt><dd>BM25 + pgvector + RRF</dd></div></dl>
      <div class="binding-section"><span>提供给项目助手 / Agent</span><div class="binding-controls"><select id="knowledgeAgentSelect"><option value="">选择 Agent</option>${available.map(agent => `<option value="${escapeHtml(agent.agentId)}">${escapeHtml(agent.agentName)} · ${escapeHtml(agent.agentId)}</option>`).join("")}</select><button class="button primary" id="bindKnowledgeAgentButton" type="button" ${available.length ? "" : "disabled"}>绑定</button></div><div class="binding-list">${bindings}</div></div>`;
    $("editKnowledgeBaseButton").onclick = () => { $("knowledgeBaseDetailDialog").close(); openKnowledgeBaseDialog(knowledgeBase); };
    $("closeKnowledgeBaseDetailButton").onclick = () => $("knowledgeBaseDetailDialog").close();
    $("bindKnowledgeAgentButton").onclick = () => bindKnowledgeAgent(knowledgeBase);
    $("knowledgeBaseDetail").querySelectorAll("[data-unbind-knowledge-agent]").forEach(button => {
      button.onclick = () => unbindKnowledgeAgent(knowledgeBase, button.dataset.unbindKnowledgeAgent);
    });
  }

  function openKnowledgeBaseDialog(knowledgeBase = null) {
    $("knowledgeBaseDialogTitle").textContent = knowledgeBase ? "编辑知识库" : "新建知识库";
    $("knowledgeBaseId").value = knowledgeBase?.knowledgeBaseId || "";
    $("knowledgeBaseName").value = knowledgeBase?.knowledgeBaseName || "";
    $("knowledgeBaseDescription").value = knowledgeBase?.description || "";
    $("knowledgeBaseStatus").checked = knowledgeBase ? Boolean(knowledgeBase.status) : true;
    $("knowledgeBaseDialog").showModal();
  }

  async function saveKnowledgeBase(event) {
    event.preventDefault();
    const knowledgeBaseId = $("knowledgeBaseId").value;
    const body = {
      knowledgeBaseName:$("knowledgeBaseName").value.trim(),
      description:$("knowledgeBaseDescription").value.trim(),
      status:$("knowledgeBaseStatus").checked ? 1 : 0
    };
    try {
      const saved = await catalogRequest(knowledgeBaseId ? `/${encodeURIComponent(knowledgeBaseId)}` : "", {
        method:knowledgeBaseId ? "PUT" : "POST", body:JSON.stringify(body)
      });
      $("knowledgeBaseDialog").close();
      localStorage.setItem("knowledgeWorkspaceId", saved.knowledgeBaseId);
      await loadKnowledgeBases(false);
      workspaceId.value = saved.knowledgeBaseId;
      renderKnowledgeBases();
      await loadRag();
      toast(knowledgeBaseId ? "知识库已更新" : "知识库已创建");
    } catch (error) { toast(error.message, "error"); }
  }

  async function deleteKnowledgeBase(knowledgeBase) {
    if (knowledgeBase.chunkCount) {
      toast("请先删除知识库内的全部知识内容", "error");
      return;
    }
    if (!confirm(`删除知识库“${knowledgeBase.knowledgeBaseName}”？`)) return;
    try {
      await catalogRequest(`/${encodeURIComponent(knowledgeBase.knowledgeBaseId)}`, { method:"DELETE" });
      localStorage.removeItem("knowledgeWorkspaceId");
      await loadKnowledgeBases(false);
      await loadRag();
      toast("知识库已删除");
    } catch (error) { toast(error.message, "error"); }
  }

  async function bindKnowledgeAgent(knowledgeBase) {
    const agentId = $("knowledgeAgentSelect").value;
    if (!agentId) return;
    try {
      await catalogRequest(`/${encodeURIComponent(knowledgeBase.knowledgeBaseId)}/bindings/${encodeURIComponent(agentId)}`, { method:"POST", body:'{"sequence":0}' });
      await loadKnowledgeBases(false);
      toast("知识库已提供给 Agent");
    } catch (error) { toast(error.message, "error"); }
  }

  async function unbindKnowledgeAgent(knowledgeBase, agentId) {
    try {
      await catalogRequest(`/${encodeURIComponent(knowledgeBase.knowledgeBaseId)}/bindings/${encodeURIComponent(agentId)}`, { method:"DELETE" });
      await loadKnowledgeBases(false);
      toast("知识库已从 Agent 解绑");
    } catch (error) { toast(error.message, "error"); }
  }

  async function loadRag() {
    const [status, sources] = await Promise.all([request("/knowledge/status"), request("/knowledge/sources?limit=30")]);
    state.sources = sources || [];
    const metrics = [
      ["知识分块", status.chunkCount, `${status.sourceCount} 个来源`],
      ["向量索引", status.vectorCount, status.semanticEnabled ? "语义检索已启用" : "仅关键词检索"],
      ["融合策略", status.fusionMethod, "BM25 + pgvector"],
      ["向量维度", status.embeddingDimensions, status.embeddingModel]
    ];
    $("ragMetrics").innerHTML = metrics.map(item => `<div class="status-metric"><span>${escapeHtml(item[0])}</span><strong>${escapeHtml(item[1])}</strong><small>${escapeHtml(item[2])}</small></div>`).join("");
    const config = [
      ["知识库 ID", status.workspaceId], ["关键词检索", status.lexicalEnabled ? "BM25 · 已启用" : "未启用"],
      ["语义检索", status.semanticEnabled ? "pgvector · 已启用" : "未启用"], ["排序融合", status.fusionMethod],
      ["Embedding 模型", status.embeddingModel], ["Embedding 接口", status.embeddingBaseUrl]
    ];
    $("ragConfig").innerHTML = config.map(item => `<div><dt>${escapeHtml(item[0])}</dt><dd>${escapeHtml(item[1])}</dd></div>`).join("");
    const stateLabels = { READY:"索引完整", PARTIAL:"部分索引", LEXICAL_ONLY:"仅关键词", EMPTY:"暂无数据" };
    $("ragState").textContent = stateLabels[status.state] || status.state;
    $("ragState").classList.toggle("partial", status.state !== "READY");
    const progress = status.chunkCount ? Math.min(100, Math.round(status.vectorCount / status.chunkCount * 100)) : 0;
    $("indexBalance").textContent = `${status.vectorCount} / ${status.chunkCount} 个分块已建立向量`;
    $("indexProgress").style.width = `${progress}%`;
    renderSources();
  }

  function filePath(file) {
    return file.webkitRelativePath || file.name;
  }

  function isSupportedFile(file) {
    const path = filePath(file).toLowerCase();
    if (path.endsWith("/dockerfile") || path === "dockerfile") return true;
    const extension = path.includes(".") ? path.slice(path.lastIndexOf(".") + 1) : "";
    return supportedExtensions.has(extension);
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  function formatDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("zh-CN", {
      month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", hour12:false
    }).format(new Date(value));
  }

  function selectSourceFiles(files) {
    const accepted = [];
    let rejected = 0;
    for (const file of files) {
      if (!isSupportedFile(file) || file.size > 3 * 1024 * 1024 || file.size === 0) {
        rejected++;
        continue;
      }
      accepted.push(file);
    }
    const merged = new Map(state.sourceFiles.map(file => [`${filePath(file)}:${file.size}`, file]));
    accepted.forEach(file => merged.set(`${filePath(file)}:${file.size}`, file));
    state.sourceFiles = [...merged.values()];
    renderSourceQueue();
    if (rejected) toast(`${rejected} 个空文件、超限文件或不支持的二进制文件已跳过`, "error");
  }

  function renderSourceQueue() {
    const files = state.sourceFiles;
    $("sourceSelection").textContent = files.length ? `${files.length} 个文件 · ${formatBytes(files.reduce((total, file) => total + file.size, 0))}` : "未选择文件";
    $("clearSourcesButton").disabled = !files.length;
    $("uploadSourcesButton").disabled = !files.length;
    $("sourceQueue").innerHTML = files.length
      ? files.slice(0, 8).map(file => `<div class="source-queue-item"><span title="${escapeHtml(filePath(file))}">${escapeHtml(filePath(file))}</span><small>${formatBytes(file.size)}</small></div>`).join("")
        + (files.length > 8 ? `<div class="source-queue-more">另有 ${files.length - 8} 个文件</div>` : "")
      : '<div class="source-queue-empty">等待选择项目文件</div>';
  }

  function clearSourceQueue() {
    state.sourceFiles = [];
    $("sourceFiles").value = "";
    $("sourceFolder").value = "";
    $("uploadProgress").classList.add("hidden");
    renderSourceQueue();
  }

  async function uploadSources() {
    if (!state.sourceFiles.length) return;
    const files = [...state.sourceFiles];
    const button = $("uploadSourcesButton");
    button.disabled = true;
    $("clearSourcesButton").disabled = true;
    $("uploadProgress").classList.remove("hidden");
    let importedFiles = 0;
    let importedChunks = 0;
    try {
      for (let offset = 0; offset < files.length; offset += 25) {
        const batch = files.slice(offset, offset + 25);
        const formData = new FormData();
        batch.forEach(file => formData.append("files", file, filePath(file)));
        $("uploadProgressText").textContent = `正在导入 ${Math.min(offset + batch.length, files.length)} / ${files.length}`;
        $("uploadProgressBar").style.width = `${Math.round(offset / files.length * 100)}%`;
        const result = await request("/documents", { method:"POST", headers:{}, body:formData });
        importedFiles += result.importedFiles;
        importedChunks += result.importedChunks;
        $("uploadProgressBar").style.width = `${Math.round((offset + batch.length) / files.length * 100)}%`;
      }
      $("uploadProgressText").textContent = `导入完成 · ${importedChunks} 个分块`;
      toast(`已导入 ${importedFiles} 个知识文件，生成 ${importedChunks} 个检索分块`);
      state.sourceFiles = [];
      $("sourceFiles").value = "";
      $("sourceFolder").value = "";
      renderSourceQueue();
      await Promise.all([loadRag(), $("knowledgeBaseList") ? loadKnowledgeBases(false) : Promise.resolve()]);
    } catch (error) {
      toast(error.message, "error");
      $("uploadProgressText").textContent = "导入中断，可重新提交未完成文件";
      button.disabled = false;
      $("clearSourcesButton").disabled = false;
    }
  }

  function renderSources() {
    $("sourceCount").textContent = `${state.sources.length} 个来源`;
    $("sourceList").innerHTML = state.sources.length ? state.sources.map(source => `
      <div class="source-item">
        <span class="source-language">${escapeHtml(source.language || "text")}</span>
        <span class="source-path" title="${escapeHtml(source.sourcePath)}"><strong>${escapeHtml(source.sourcePath)}</strong><small>${source.chunkCount} 个分块 · ${formatDate(source.updatedAt)}</small></span>
        <button type="button" data-delete-source="${escapeHtml(source.sourcePath)}" title="删除知识源" aria-label="删除 ${escapeHtml(source.sourcePath)}">×</button>
      </div>`).join("") : '<div class="empty-state compact">当前知识库还没有内容</div>';
    $("sourceList").querySelectorAll("[data-delete-source]").forEach(button => {
      button.onclick = () => deleteSource(button.dataset.deleteSource);
    });
  }

  async function deleteSource(sourcePath) {
    if (!confirm(`从当前知识库删除“${sourcePath}”？`)) return;
    try {
      await request(`/knowledge/sources?sourcePath=${encodeURIComponent(sourcePath)}`, { method:"DELETE" });
      toast("知识源及其向量索引已删除");
      await Promise.all([loadRag(), $("knowledgeBaseList") ? loadKnowledgeBases(false) : Promise.resolve()]);
    } catch (error) { toast(error.message, "error"); }
  }

  async function reindex() {
    if (!confirm("从现有知识分块重新生成全部向量索引？")) return;
    const button = $("reindexButton"); button.disabled = true; button.textContent = "正在重建...";
    try {
      const result = await request("/knowledge/reindex", { method:"POST" });
      toast(`向量索引已重建：${result.indexedChunks}/${result.totalChunks}`);
      await loadRag();
    } catch (error) { toast(error.message, "error"); }
    finally { button.disabled = false; button.textContent = "重建向量索引"; }
  }

  function agentById(agentId) { return state.agents.find(agent => agent.agentId === agentId); }
  function selectedSkill() { return state.skills.find(skill => skill.skillId === state.selectedId) || null; }

  function renderSkills() {
    const query = $("skillSearch").value.trim().toLowerCase();
    const skills = state.skills.filter(skill => !query || `${skill.skillName} ${skill.description} ${skill.category}`.toLowerCase().includes(query));
    $("skillCount").textContent = state.skills.length;
    if (!skills.length) {
      $("skillList").innerHTML = `<tr><td class="table-empty" colspan="6">${state.skills.length ? "没有匹配的 Skill" : "还没有 Skill，请先新建"}</td></tr>`;
    } else {
      const categoryLabels = { GENERAL:"通用", WRITING:"写作", REVIEW:"审查", RESEARCH:"调研", OPERATIONS:"运维", KNOWLEDGE:"知识" };
      $("skillList").innerHTML = skills.map(skill => `<tr class="${skill.skillId === state.selectedId ? "active" : ""}">
        <td><button class="table-name-button" type="button" data-view-skill="${escapeHtml(skill.skillId)}"><strong>${escapeHtml(skill.skillName)}</strong><small>${escapeHtml(skill.skillId)}</small></button></td>
        <td><em class="pill">${escapeHtml(categoryLabels[skill.category] || skill.category)}</em></td>
        <td><em class="pill ${skill.status ? "enabled" : "disabled"}">${skill.status ? "启用" : "停用"}</em></td>
        <td>${escapeHtml(skill.agentIds.length)}</td>
        <td class="description-cell" title="${escapeHtml(skill.description || "暂无描述")}">${escapeHtml(skill.description || "暂无描述")}</td>
        <td><div class="table-actions"><button type="button" data-view-skill="${escapeHtml(skill.skillId)}">装配</button><button type="button" data-edit-skill="${escapeHtml(skill.skillId)}">编辑</button><button class="danger" type="button" data-delete-skill="${escapeHtml(skill.skillId)}">删除</button></div></td>
      </tr>`).join("");
      $("skillList").querySelectorAll("[data-view-skill]").forEach(button => button.onclick = () => {
        state.selectedId = button.dataset.viewSkill;
        renderSkills();
        $("skillDetailDialog").showModal();
      });
      $("skillList").querySelectorAll("[data-edit-skill]").forEach(button => button.onclick = () => openSkillDialog(state.skills.find(skill => skill.skillId === button.dataset.editSkill)));
      $("skillList").querySelectorAll("[data-delete-skill]").forEach(button => button.onclick = () => deleteSkill(state.skills.find(skill => skill.skillId === button.dataset.deleteSkill)));
    }
    renderSkillDetail();
  }

  function renderSkillDetail() {
    const skill = selectedSkill();
    if (!skill) { $("skillDetail").innerHTML = '<div class="empty-state">选择一个 Skill 查看指令和 Agent 绑定。</div>'; return; }
    const available = state.agents.filter(agent => !skill.agentIds.includes(agent.agentId));
    const bindings = skill.agentIds.map(agentId => {
      const agent = agentById(agentId);
      return `<div class="binding-item"><span><strong>${escapeHtml(agent?.agentName || agentId)}</strong><small>Agent ${escapeHtml(agentId)}</small></span><button type="button" data-unbind-agent="${escapeHtml(agentId)}">解绑</button></div>`;
    }).join("") || '<div class="empty-state" style="min-height:70px">尚未绑定 Agent。</div>';
    $("skillDetail").innerHTML = `
      <div class="detail-heading"><div><span class="detail-eyebrow">Skill 装配</span><h2>${escapeHtml(skill.skillName)}</h2><p>${escapeHtml(skill.description || "暂无描述")}</p></div><div class="detail-actions"><button class="button secondary" id="editSkillButton" type="button">编辑</button><button class="icon-button" id="closeSkillDetailButton" type="button" title="关闭" aria-label="关闭">×</button></div></div>
      <div class="instruction-block"><span>执行指令</span><pre>${escapeHtml(skill.instructions)}</pre></div>
      <div class="binding-section"><span>Agent 绑定</span><div class="binding-controls"><select id="agentSelect"><option value="">选择 Agent</option>${available.map(agent => `<option value="${escapeHtml(agent.agentId)}">${escapeHtml(agent.agentName)} · ${escapeHtml(agent.agentId)}</option>`).join("")}</select><button class="button primary" id="bindAgentButton" type="button" ${available.length ? "" : "disabled"}>绑定</button></div><div class="binding-list">${bindings}</div></div>`;
    $("editSkillButton").onclick = () => { $("skillDetailDialog").close(); openSkillDialog(skill); };
    $("closeSkillDetailButton").onclick = () => $("skillDetailDialog").close();
    $("bindAgentButton").onclick = () => bindAgent(skill);
    $("skillDetail").querySelectorAll("[data-unbind-agent]").forEach(button => button.onclick = () => unbindAgent(skill, button.dataset.unbindAgent));
  }

  async function loadSkills() {
    [state.skills, state.agents] = await Promise.all([request("/skills"), request("/skills/agents")]);
    if (state.selectedId && !state.skills.some(skill => skill.skillId === state.selectedId)) state.selectedId = null;
    if (!state.selectedId && state.skills.length) state.selectedId = state.skills[0].skillId;
    renderSkills();
  }

  function openSkillDialog(skill = null) {
    $("dialogTitle").textContent = skill ? "编辑 Skill" : "新建 Skill";
    $("skillId").value = skill?.skillId || "";
    $("skillName").value = skill?.skillName || "";
    $("skillDescription").value = skill?.description || "";
    $("skillInstructions").value = skill?.instructions || "";
    $("skillCategory").value = skill?.category || "GENERAL";
    $("skillStatus").checked = skill ? Boolean(skill.status) : true;
    $("skillDialog").showModal();
  }

  async function saveSkill(event) {
    event.preventDefault();
    const skillId = $("skillId").value;
    const body = { skillName:$("skillName").value.trim(), description:$("skillDescription").value.trim(), instructions:$("skillInstructions").value.trim(), category:$("skillCategory").value, status:$("skillStatus").checked ? 1 : 0 };
    try {
      const saved = await request(skillId ? `/skills/${encodeURIComponent(skillId)}` : "/skills", { method:skillId ? "PUT" : "POST", body:JSON.stringify(body) });
      state.selectedId = saved.skillId; $("skillDialog").close(); toast(skillId ? "Skill 已更新" : "Skill 已创建"); await loadSkills();
    } catch (error) { toast(error.message, "error"); }
  }

  async function deleteSkill(skill) {
    if (!confirm(`删除 Skill“${skill.skillName}”及其全部 Agent 绑定？`)) return;
    try { await request(`/skills/${encodeURIComponent(skill.skillId)}`, { method:"DELETE" }); state.selectedId = null; toast("Skill 已删除"); await loadSkills(); }
    catch (error) { toast(error.message, "error"); }
  }

  async function bindAgent(skill) {
    const agentId = $("agentSelect").value; if (!agentId) return;
    try { await request(`/skills/${encodeURIComponent(skill.skillId)}/bindings/${encodeURIComponent(agentId)}`, { method:"POST", body:'{"sequence":0}' }); toast("Agent 已绑定"); await loadSkills(); }
    catch (error) { toast(error.message, "error"); }
  }

  async function unbindAgent(skill, agentId) {
    try { await request(`/skills/${encodeURIComponent(skill.skillId)}/bindings/${encodeURIComponent(agentId)}`, { method:"DELETE" }); toast("Agent 已解绑"); await loadSkills(); }
    catch (error) { toast(error.message, "error"); }
  }

  async function refresh() {
    $("refreshButton").disabled = true;
    const tasks = [];
    if ($("knowledgeBaseList")) {
      tasks.push((async () => { await loadKnowledgeBases(); await loadRag(); })());
    } else if ($("ragPanel")) tasks.push(loadRag());
    if ($("skillsPanel")) tasks.push(loadSkills());
    try { await Promise.all(tasks); }
    catch (error) { toast(error.message, "error"); }
    finally { $("refreshButton").disabled = false; }
  }

  initResourceShell();
  if ($("ragTab")) $("ragTab").onclick = () => switchTab("rag");
  if ($("skillsTab")) $("skillsTab").onclick = () => switchTab("skills");
  $("refreshButton").onclick = refresh;
  if ($("ragPanel")) {
    $("reindexButton").onclick = reindex;
    $("sourceFiles").onchange = event => selectSourceFiles(event.target.files || []);
    $("sourceFolder").onchange = event => selectSourceFiles(event.target.files || []);
    $("clearSourcesButton").onclick = clearSourceQueue;
    $("uploadSourcesButton").onclick = uploadSources;
    $("sourceDropzone").onclick = event => {
      if (!event.target.closest("label")) $("sourceFiles").click();
    };
    $("sourceDropzone").onkeydown = event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); $("sourceFiles").click(); }
    };
    ["dragenter", "dragover"].forEach(type => $("sourceDropzone").addEventListener(type, event => {
      event.preventDefault(); $("sourceDropzone").classList.add("dragging");
    }));
    ["dragleave", "drop"].forEach(type => $("sourceDropzone").addEventListener(type, event => {
      event.preventDefault(); $("sourceDropzone").classList.remove("dragging");
    }));
    $("sourceDropzone").addEventListener("drop", event => selectSourceFiles(event.dataTransfer?.files || []));
  }
  if ($("knowledgeBaseList")) {
    $("createKnowledgeBaseButton").onclick = () => openKnowledgeBaseDialog();
    $("closeKnowledgeBaseDialogButton").onclick = () => $("knowledgeBaseDialog").close();
    $("cancelKnowledgeBaseDialogButton").onclick = () => $("knowledgeBaseDialog").close();
    $("knowledgeBaseForm").addEventListener("submit", saveKnowledgeBase);
    $("knowledgeBaseSearch").addEventListener("input", renderKnowledgeBases);
  }
  if ($("skillsPanel")) {
    $("createSkillButton").onclick = () => openSkillDialog();
    $("closeDialogButton").onclick = () => $("skillDialog").close();
    $("cancelDialogButton").onclick = () => $("skillDialog").close();
    $("skillForm").addEventListener("submit", saveSkill);
    $("skillSearch").addEventListener("input", renderSkills);
  }
  workspaceId.addEventListener("change", async () => {
    localStorage.setItem("knowledgeWorkspaceId", workspaceId.value.trim() || "personal-workspace");
    if ($("ragPanel")) {
      clearSourceQueue();
      if ($("knowledgeBaseList")) renderKnowledgeBases();
      try { await loadRag(); } catch (error) { toast(error.message, "error"); }
    } else if ($("skillsPanel")) {
      try { await loadSkills(); } catch (error) { toast(error.message, "error"); }
    }
  });
  switchTab(state.tab, false);
  refresh();
})();
