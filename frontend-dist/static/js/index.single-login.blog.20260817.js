(()=>{"use strict";var e,t,r,i,a,n,s={4666:function(e,t,r){let i,a,n,s,o,l,d;var c,p,h,u,m=r(4848),g=r(6540),x=r(5338),y=r(7767),f=r(4976),j=r(6306),v=r(5052),b=r(6982),w=r(1662),A=r(8748),C=r(3081),E=r(4033);let $="#1890ff",I={primary:"#262626",secondary:"#595959",tertiary:"#8c8c8c",disabled:"#bfbfbf"},k={primary:"#ffffff",secondary:"#fafafa",tertiary:"#f5f5f5",disabled:"#f5f5f5"},T={primary:"#d9d9d9",secondary:"#f0f0f0",tertiary:"#e8e8e8"},S={primary:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",secondary:"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",tertiary:"linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"},N={xs:"12px",sm:"14px",base:"16px",lg:"18px",xl:"20px","2xl":"24px","3xl":"30px","4xl":"36px"},P={normal:400,medium:500,semibold:600,bold:700},B={tight:1.25,normal:1.5,relaxed:1.75},L={xs:"4px",sm:"8px",base:"16px",lg:"24px",xl:"32px","2xl":"48px","3xl":"64px"},D="8px",M="12px",_="16px",R="24px",O={sm:"0 1px 2px 0 rgba(0, 0, 0, 0.05)",base:"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",md:"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",lg:"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",xl:"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",card:"0 2px 8px rgba(0, 0, 0, 0.06)",modal:"0 8px 24px rgba(0, 0, 0, 0.12)"},U={fast:"0.15s",normal:"0.3s",slow:"0.5s"},Q={ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",cubic:"cubic-bezier(0.4, 0, 0.2, 1)"},z="640px",q="768px",V="1024px",F=E.Ay.div`
  background: ${k.primary};
  border-radius: ${M};
  border: 1px solid ${T.secondary};
  box-shadow: ${e=>O[e.$shadow]};
  padding: ${e=>L[e.$padding]};
  transition: all ${U.normal} ${Q.cubic};
  cursor: ${e=>e.$clickable?"pointer":"default"};

  ${e=>e.$hover&&`
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${O.lg};
      border-color: ${$};
    }
  `}
`,Y=e=>{let{children:t,className:r,padding:i="base",shadow:a="card",hover:n=!1,onClick:s}=e;return(0,m.jsx)(F,{className:r,$padding:i,$shadow:a,$hover:n,$clickable:!!s,onClick:s,children:t})};var H=r(5243),J=r(622);class K{save(){console.log(this.document.toJSON())}}(0,H.Cg)([(0,J.WQX)(J.TbI),(0,H.Sn)("design:type",void 0===J.TbI?Object:J.TbI)],K.prototype,"ctx",void 0),(0,H.Cg)([(0,J.WQX)(J.A7z),(0,H.Sn)("design:type",void 0===J.A7z?Object:J.A7z)],K.prototype,"selectionService",void 0),(0,H.Cg)([(0,J.WQX)(J.QF1),(0,H.Sn)("design:type",void 0===J.QF1?Object:J.QF1)],K.prototype,"playground",void 0),(0,H.Cg)([(0,J.WQX)(J.Vo_),(0,H.Sn)("design:type",void 0===J.Vo_?Object:J.Vo_)],K.prototype,"document",void 0),K=(0,H.Cg)([(0,J._GM)()],K);class Z{async addRunningNode(e){this._runningNodes.push(e),e.renderData.node.classList.add("node-running"),this.document.linesManager.forceUpdate(),await (0,J.cbG)(1e3),await Promise.all(e.blocks.map(e=>this.addRunningNode(e)));let t=e.getData(J.tBW).outputNodes;await Promise.all(t.map(e=>this.addRunningNode(e)))}async startRun(){await this.addRunningNode(this.document.getNode("start_0")),this._runningNodes.forEach(e=>{e.renderData.node.classList.remove("node-running")}),this._runningNodes=[],this.document.linesManager.forceUpdate()}isFlowingLine(e){return this._runningNodes.some(t=>t.getData(J.tBW).outputLines.includes(e))}constructor(){this._runningNodes=[]}}(0,H.Cg)([(0,J.WQX)(J.QF1),(0,H.Sn)("design:type",void 0===J.QF1?Object:J.QF1)],Z.prototype,"playground",void 0),(0,H.Cg)([(0,J.WQX)(J.Vo_),(0,H.Sn)("design:type",void 0===J.Vo_?Object:J.Vo_)],Z.prototype,"document",void 0),Z=(0,H.Cg)([(0,J._GM)()],Z);let G="/ai-agent-study",W="v1",X={AI_CLIENT:{BASE:`${G}/api/${W}/admin/ai-client`,QUERY_ALL:"/query-all",QUERY_ENABLED:"/query-enabled"},AI_CLIENT_ADVISOR:{BASE:`${G}/api/${W}/admin/ai-client-advisor`,QUERY_ALL:"/query-all"},AI_CLIENT_SYSTEM_PROMPT:{BASE:`${G}/api/${W}/admin/ai-client-system-prompt`,CREATE:"/create",UPDATE_BY_ID:"/update-by-id",UPDATE_BY_PROMPT_ID:"/update-by-prompt-id",DELETE_BY_ID:"/delete-by-id",DELETE_BY_PROMPT_ID:"/delete-by-prompt-id",QUERY_BY_ID:"/query-by-id",QUERY_BY_PROMPT_ID:"/query-by-prompt-id",QUERY_ALL:"/query-all",QUERY_ENABLED:"/query-enabled",QUERY_BY_PROMPT_NAME:"/query-by-prompt-name",QUERY_LIST:"/query-list"},AI_CLIENT_TOOL_MCP:{BASE:`${G}/api/${W}/admin/ai-client-tool-mcp`,CREATE:"/create",UPDATE_BY_ID:"/update-by-id",UPDATE_BY_MCP_ID:"/update-by-mcp-id",DELETE_BY_ID:"/delete-by-id",DELETE_BY_MCP_ID:"/delete-by-mcp-id",QUERY_BY_ID:"/query-by-id",QUERY_BY_MCP_ID:"/query-by-mcp-id",QUERY_ALL:"/query-all",QUERY_BY_STATUS:"/query-by-status",QUERY_BY_TRANSPORT_TYPE:"/query-by-transport-type",QUERY_ENABLED:"/query-enabled",QUERY_LIST:"/query-list"},AI_CLIENT_MODEL:{BASE:`${G}/api/${W}/admin/ai-client-model`,CREATE:"/create",UPDATE_BY_ID:"/update-by-id",UPDATE_BY_MODEL_ID:"/update-by-model-id",DELETE_BY_ID:"/delete-by-id",DELETE_BY_MODEL_ID:"/delete-by-model-id",QUERY_BY_ID:"/query-by-id",QUERY_BY_MODEL_ID:"/query-by-model-id",QUERY_BY_API_ID:"/query-by-api-id",QUERY_BY_MODEL_TYPE:"/query-by-model-type",QUERY_ENABLED:"/query-enabled",QUERY_LIST:"/query-list",QUERY_ALL:"/query-all"},AI_AGENT_DRAW:{BASE:`${G}/api/${W}/admin/ai-agent-draw`,SAVE_CONFIG:"/save-config",QUERY_LIST:"/query-list",GET_CONFIG:"/get-config",DELETE_CONFIG:"/delete-config"},AI_AGENT:{BASE:`${G}/api/${W}/agent`,ARMORY_AGENT:"/armory_agent",ARMORY_API:"/armory_api"},ADMIN_USER:{BASE:`${G}/api/${W}/admin/admin-user`,VALIDATE_LOGIN:"/validate-login"}},ee={"Content-Type":"application/json",Accept:"application/json"};class et{static async queryAllAiClients(){try{let e=await fetch(`${this.BASE_URL}${X.AI_CLIENT.QUERY_ALL}`,{method:"GET",headers:ee});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);let t=await e.json();if("0000"===t.code)return t.data||[];throw Error(t.info||"查询失败")}catch(e){return console.error("查询AI客户端配置失败:",e),[]}}static async queryEnabledAiClients(){try{let e=await fetch(`${this.BASE_URL}${X.AI_CLIENT.QUERY_ENABLED}`,{method:"GET",headers:ee});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);let t=await e.json();if("0000"===t.code)return t.data||[];throw Error(t.info||"查询失败")}catch(e){return console.error("查询启用的AI客户端配置失败:",e),[]}}}et.BASE_URL=X.AI_CLIENT.BASE;class er{static async queryAllAiClientAdvisors(){try{let e=await fetch(`${this.BASE_URL}${X.AI_CLIENT_ADVISOR.QUERY_ALL}`,{method:"GET",headers:ee});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);let t=await e.json();if("0000"===t.code)return t.data||[];throw Error(t.info||"查询失败")}catch(e){return console.error("查询AI客户端顾问配置失败:",e),[]}}}er.BASE_URL=X.AI_CLIENT_ADVISOR.BASE;class ei{static async queryAllAiClientSystemPrompts(){try{let e=await fetch(`${X.AI_CLIENT_SYSTEM_PROMPT.BASE}${X.AI_CLIENT_SYSTEM_PROMPT.QUERY_ALL}`,{method:"GET",headers:ee});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);let t=await e.json();if("0000"===t.code)return t.data||[];throw Error(t.info||"获取系统提示词列表失败")}catch(e){throw console.error("查询系统提示词列表失败:",e),e}}}class ea{static async queryAllAiClientToolMcps(){try{let e=await fetch(`${this.BASE_URL}${X.AI_CLIENT_TOOL_MCP.QUERY_ALL}`,{method:"GET",headers:ee});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);let t=await e.json();if("0000"===t.code)return t.data||[];throw Error(t.info||"查询失败")}catch(e){return console.error("查询AI客户端工具MCP配置失败:",e),[]}}}ea.BASE_URL=X.AI_CLIENT_TOOL_MCP.BASE;class en{static async queryEnabledAiClientModels(){try{let e=await fetch(`${this.BASE_URL}${X.AI_CLIENT_MODEL.QUERY_ENABLED}`,{method:"GET",headers:ee});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);let t=await e.json();if("0000"===t.code)return t.data||[];throw Error(t.info||"查询失败")}catch(e){return console.error("查询启用的AI客户端模型配置失败:",e),[]}}}en.BASE_URL=X.AI_CLIENT_MODEL.BASE;class es{static async queryDrawConfigList(e){try{let t=await fetch(`${this.BASE_URL}${X.AI_AGENT_DRAW.QUERY_LIST}`,{method:"POST",headers:ee,body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);let r=await t.json();if("0000"===r.code)return r.data||[];throw Error(r.info||"查询失败")}catch(e){return console.error("查询Agent Draw配置列表失败:",e),[]}}static async getDrawConfig(e){try{let t=`${this.BASE_URL}${X.AI_AGENT_DRAW.GET_CONFIG}/${encodeURIComponent(e)}`;console.log("发起API请求:",t);let r=await fetch(t,{method:"GET",headers:ee});if(console.log("API响应状态:",r.status,r.statusText),!r.ok)throw Error(`HTTP error! status: ${r.status}`);let i=await r.json();if(console.log("API响应数据:",i),"0000"===i.code)return console.log("API调用成功，返回数据:",i.data),i.data||null;throw console.error("API返回错误:",i.code,i.info),Error(i.info||"获取配置失败")}catch(e){return console.error("获取Agent Draw配置失败:",e),null}}static async deleteDrawConfig(e){try{let t=await fetch(`${this.BASE_URL}${X.AI_AGENT_DRAW.DELETE_CONFIG}/${encodeURIComponent(e)}`,{method:"DELETE",headers:ee});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);let r=await t.json();if("0000"===r.code)return r.data||!1;throw Error(r.info||"删除配置失败")}catch(e){throw console.error("删除Agent Draw配置失败:",e),e}}}es.BASE_URL=X.AI_AGENT_DRAW.BASE;class eo{static async armoryAgent(e){try{let t=await fetch(`${this.BASE_URL}${X.AI_AGENT.ARMORY_AGENT}`,{method:"POST",headers:ee,body:JSON.stringify({agentId:e})});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);let r=await t.json();if("0000"===r.code)return r.data||!1;throw Error(r.info||"装配失败")}catch(e){throw console.error("装配智能体失败:",e),e}}static async armoryApi(e){try{let t=await fetch(`${this.BASE_URL}${X.AI_AGENT.ARMORY_API}`,{method:"POST",headers:ee,body:JSON.stringify({apiId:e})});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);let r=await t.json();if("0000"===r.code)return r.data||!1;throw Error(r.info||"装配API失败")}catch(e){throw console.error("装配API失败:",e),e}}}eo.BASE_URL=X.AI_AGENT.BASE;class el{static async validateAdminUserLogin(e){try{let t=await fetch(`${this.BASE_URL}${X.ADMIN_USER.VALIDATE_LOGIN}`,{method:"POST",headers:ee,body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);let r=await t.json();if("0000"===r.code)return r.data||!1;return console.error("登录验证失败:",r.info),!1}catch(e){throw console.error("登录验证请求失败:",e),e}}}el.BASE_URL=X.ADMIN_USER.BASE;let{Title:ed,Text:ec}=j.o5,ep=E.Ay.div`
  min-height: 100vh;
  background: ${k.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${L.lg};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${S.primary};
    opacity: 0.05;
    pointer-events: none;
  }
`,eh=E.Ay.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${L["3xl"]};
  align-items: center;

  @media (max-width: ${V}) {
    grid-template-columns: 1fr;
    max-width: 400px;
    gap: ${L.xl};
  }
`,eu=E.Ay.div`
  text-align: center;

  @media (max-width: ${V}) {
    display: none;
  }
`,em=E.Ay.div`
  width: 120px;
  height: 120px;
  margin: 0 auto ${L.xl};
  background: ${S.primary};
  border-radius: ${R};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${O.lg};

  .semi-icon {
    font-size: 48px;
    color: white;
  }
`,eg=(0,E.Ay)(ed)`
  color: ${I.primary};
  margin-bottom: ${L.base} !important;
  font-weight: ${P.bold};
`,ex=(0,E.Ay)(ec)`
  color: ${I.secondary};
  font-size: ${N.lg};
  line-height: ${B.relaxed};
`,ey=(0,E.Ay)(Y)`
  padding: ${L["2xl"]} !important;
  box-shadow: ${O.xl} !important;
  border: none !important;
`,ef=E.Ay.div`
  text-align: center;
  margin-bottom: ${L.xl};
`,ej=(0,E.Ay)(ed)`
  color: ${I.primary};
  margin-bottom: ${L.sm} !important;
  font-weight: ${P.bold};
`,ev=(0,E.Ay)(ec)`
  color: ${I.secondary};
  font-size: ${N.base};
`,eb=(0,E.Ay)(j.lV)`
  .semi-form-field {
    margin-bottom: ${L.lg};
  }
`;(0,E.Ay)(j.pd)`
  height: 48px;
  border-radius: ${D};
  border: 1px solid ${T.primary};

  &:focus {
    border-color: ${$};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
  }

  .semi-input-prefix {
    color: ${I.tertiary};
  }
`;let ew=(0,E.Ay)(j.$n)`
  width: 100%;
  height: 48px;
  border-radius: ${D};
  background: ${S.primary} !important;
  border: none !important;
  color: white !important;
  font-weight: ${P.medium};
  font-size: ${N.base};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`,eA=(0,E.Ay)(j.$n)`
  width: 100%;
  height: 40px;
  border-radius: ${D};
  border: 1px solid ${T.primary};
  color: ${I.secondary};
  background: ${k.primary};

  &:hover {
    border-color: ${$};
    color: ${$};
  }
`,eC=E.Ay.div`
  display: flex;
  align-items: center;
  margin: ${L.xl} 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${T.secondary};
  }

  span {
    padding: 0 ${L.base};
    color: ${I.tertiary};
    font-size: ${N.sm};
  }
`,eE=()=>{let e=(0,y.Zp)(),[t,r]=(0,g.useState)(!1),[i,a]=(0,g.useState)(!1),n=async t=>{r(!0);try{if(!t.username||!t.password)return void j.y8.error("请输入账号和密码");if(await el.validateAdminUserLogin({username:t.username,password:t.password})){let r={username:t.username,loginTime:new Date().toISOString(),token:"token-"+Date.now()};localStorage.setItem("token",r.token),localStorage.setItem("userInfo",JSON.stringify(r)),localStorage.setItem("isLoggedIn","true"),j.y8.success("登录成功！"),e("/dashboard")}else j.y8.error("账号或密码错误，请重试")}catch(e){console.error("登录失败:",e),j.y8.error("登录失败，请检查网络连接或稍后重试")}finally{r(!1)}};return(0,m.jsx)(ep,{children:(0,m.jsxs)(eh,{children:[(0,m.jsxs)(eu,{children:[(0,m.jsx)(em,{children:(0,m.jsx)(v.A,{})}),(0,m.jsx)(eg,{heading:1,children:"AI Agent Station"}),(0,m.jsxs)(ex,{children:["智能代理管理平台，为您提供专业的AI代理配置和管理服务。",(0,m.jsx)("br",{}),"简单易用，功能强大，助力您的业务智能化升级。"]})]}),(0,m.jsxs)(ey,{children:[(0,m.jsxs)(ef,{children:[(0,m.jsx)(ej,{heading:3,children:"个人工作台登录"}),(0,m.jsx)(ev,{children:"请输入您的账号和密码"})]}),(0,m.jsxs)(eb,{onSubmit:n,children:[(0,m.jsx)(j.lV.Input,{field:"username",label:"账号",placeholder:"请输入账号",prefix:(0,m.jsx)(b.A,{}),size:"large",rules:[{required:!0,message:"请输入账号"},{min:3,message:"账号至少3个字符"}]}),(0,m.jsx)(j.lV.Input,{field:"password",label:"密码",type:i?"text":"password",placeholder:"请输入密码",prefix:(0,m.jsx)(w.A,{}),size:"large",suffix:(0,m.jsx)(j.$n,{theme:"borderless",icon:i?(0,m.jsx)(A.A,{}):(0,m.jsx)(C.A,{}),onClick:()=>a(!i),style:{padding:"4px"}}),rules:[{required:!0,message:"请输入密码"},{min:6,message:"密码至少6个字符"}]}),(0,m.jsx)(ew,{type:"primary",htmlType:"submit",loading:t,children:"立即登录"})]})]})]})})};var e$=r(6321),eI=r(868),ek=r(1477),eT=r(310),eS=r(9797),eN=r(1977);let{Text:eP}=j.o5,eB=E.Ay.div`
  width: ${e=>e.$collapsed?"80px":"280px"};
  height: 100vh;
  background: ${k.primary};
  border-right: 1px solid ${T.secondary};
  display: flex;
  flex-direction: column;
  transition: width ${U.normal} ${Q.cubic};
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  overflow-y: auto;
`,eL=E.Ay.div`
  padding: ${L.lg};
  border-bottom: 1px solid ${T.secondary};
  display: flex;
  align-items: center;
  gap: ${L.base};
  min-height: 72px;
`,eD=E.Ay.div`
  width: 40px;
  height: 40px;
  background: ${S.primary};
  border-radius: ${D};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .semi-icon {
    color: white;
    font-size: 20px;
  }
`,eM=E.Ay.div`
  display: ${e=>e.$collapsed?"none":"block"};

  h4 {
    margin: 0;
    color: ${I.primary};
    font-weight: ${P.semibold};
    font-size: ${N.base};
  }

  p {
    margin: 0;
    color: ${I.tertiary};
    font-size: ${N.sm};
  }
`,e_=E.Ay.div`
  flex: 1;
  padding: ${L.base} 0;
  overflow-y: auto;
`,eR=(0,E.Ay)(j.so)`
  background: transparent;
  border: none;

  .semi-nav-item {
    margin: 4px ${L.base};
    border-radius: ${D};
    transition: all ${U.normal} ${Q.cubic};

    &:hover {
      background: ${k.tertiary};
    }

    &.semi-nav-item-selected {
      background: ${$};
      color: white;

      .semi-icon {
        color: white;
      }

      .semi-nav-item-text {
        color: white;
      }
    }

    .semi-nav-item-text {
      display: ${e=>e.$collapsed?"none":"block"};
    }
  }

  .semi-nav-sub {
    .semi-nav-item {
      padding-left: ${e=>e.$collapsed?L.base:L.xl};
    }
  }
`,eO=E.Ay.div`
  padding: ${L.lg};
  border-top: 1px solid ${T.secondary};
  display: flex;
  align-items: center;
  gap: ${L.base};
`,eU=E.Ay.div`
  display: ${e=>e.$collapsed?"none":"flex"};
  flex-direction: column;
  flex: 1;

  .username {
    color: ${I.primary};
    font-weight: ${P.medium};
    font-size: ${N.sm};
    margin: 0;
  }

  .role {
    color: ${I.tertiary};
    font-size: ${N.xs};
    margin: 0;
  }
`,eQ=[{itemKey:"dashboard",text:"工作台",icon:(0,m.jsx)(eT.A,{})},{itemKey:"personal-workspace",text:"个人 AI 工作台",icon:(0,m.jsx)(ek.A,{})},{itemKey:"blog-workspace",text:"博文工作台",icon:(0,m.jsx)(eI.A,{})},{itemKey:"agents",text:"代理管理",icon:(0,m.jsx)(e$.A,{}),items:[{itemKey:"agent-list",text:"代理列表"},{itemKey:"agent-config",text:"代理配置"}]},{itemKey:"resources",text:"资源管理",icon:(0,m.jsx)(eS.A,{}),items:[{itemKey:"client-management",text:"客户端管理"},{itemKey:"advisor-management",text:"顾问管理"},{itemKey:"rag-order-management",text:"知识库配置管理"},{itemKey:"client-model-management",text:"模型管理"},{itemKey:"ai-client-api-management",text:"模型API管理"},{itemKey:"client-system-prompt-management",text:"系统提示词管理"},{itemKey:"client-tool-mcp-management",text:"MCP工具管理"}]},{itemKey:"analytics",text:"数据分析【样例】",icon:(0,m.jsx)(eI.A,{}),items:[{itemKey:"performance",text:"性能监控"},{itemKey:"usage",text:"使用统计"}]},{itemKey:"settings",text:"系统设置【样例】",icon:(0,m.jsx)(eN.A,{}),items:[{itemKey:"profile",text:"个人设置"},{itemKey:"system",text:"系统配置"}]}],ez=e=>{var t,r;let{selectedKey:i="dashboard",onSelect:a,collapsed:n=!1}=e,s=(0,y.Zp)(),o=JSON.parse(localStorage.getItem("userInfo")||"{}");return(0,m.jsxs)(eB,{$collapsed:n,children:[(0,m.jsxs)(eL,{$collapsed:n,children:[(0,m.jsx)(eD,{children:(0,m.jsx)(ek.A,{})}),(0,m.jsxs)(eM,{$collapsed:n,children:[(0,m.jsx)("h4",{children:"AI Agent Station"}),(0,m.jsx)("p",{children:"智能代理管理平台"})]})]}),(0,m.jsx)(e_,{children:(0,m.jsx)(eR,{$collapsed:n,selectedKeys:[i],onSelect:e=>{let{selectedKeys:t}=e,r=t[0];"personal-workspace"===r?s("/personal-workspace"):"blog-workspace"===r?location.href="/ai-agent-station/blog.html":null==a||a(r)},items:eQ})}),(0,m.jsxs)(eO,{$collapsed:n,children:[(0,m.jsx)(j.eu,{size:"small",color:"blue",children:(null==(r=o.username)||null==(t=r[0])?void 0:t.toUpperCase())||"U"}),(0,m.jsxs)(eU,{$collapsed:n,children:[(0,m.jsx)(eP,{className:"username",children:o.username||"用户"}),(0,m.jsx)(eP,{className:"role",children:"个人工作台"})]})]})]})};var eq=r(8461),eV=r(2534),eF=r(8901),eY=r(4883),eH=r(5764);let{Text:eJ}=j.o5,eK=E.Ay.div`
  height: 72px;
  background: ${k.primary};
  border-bottom: 1px solid ${T.secondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${L.lg};
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${O.sm};
  flex-shrink: 0;
`,eZ=E.Ay.div`
  display: flex;
  align-items: center;
  gap: ${L.base};
`,eG=(0,E.Ay)(j.$n)`
  width: 40px;
  height: 40px;
  border-radius: ${D};
  border: 1px solid ${T.primary};

  &:hover {
    border-color: ${$};
    color: ${$};
  }
`,eW=E.Ay.div`
  width: 400px;

  @media (max-width: ${q}) {
    width: 200px;
  }

  @media (max-width: ${z}) {
    display: none;
  }
`,eX=(0,E.Ay)(j.pd)`
  .semi-input-wrapper {
    border-radius: ${_};
    background: ${k.secondary};
    border: 1px solid transparent;

    &:hover {
      background: ${k.primary};
      border-color: ${T.primary};
    }

    &:focus-within {
      background: ${k.primary};
      border-color: ${$};
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
    }
  }
`,e0=E.Ay.div`
  display: flex;
  align-items: center;
  gap: ${L.base};
`,e1=(0,E.Ay)(j.$n)`
  width: 40px;
  height: 40px;
  border-radius: ${D};
  border: 1px solid transparent;

  &:hover {
    background: ${k.tertiary};
    border-color: ${T.primary};
  }
`,e2=E.Ay.div`
  display: flex;
  align-items: center;
  gap: ${L.sm};
  padding: ${L.sm} ${L.base};
  border-radius: ${D};
  cursor: pointer;
  transition: all ${U.normal} ${Q.cubic};

  &:hover {
    background: ${k.tertiary};
  }
`,e5=E.Ay.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: ${z}) {
    display: none;
  }

  .username {
    color: ${I.primary};
    font-weight: ${P.medium};
    font-size: ${N.sm};
    margin: 0;
  }

  .role {
    color: ${I.tertiary};
    font-size: ${N.xs};
    margin: 0;
  }
`,e6=e=>{var t,r;let{onToggleSidebar:i,onLogout:a,collapsed:n=!1}=e,s=JSON.parse(localStorage.getItem("userInfo")||"{}"),o=[{node:"item",name:"个人设置",icon:(0,m.jsx)(eN.A,{})},{node:"divider"},{node:"item",name:"退出登录",icon:(0,m.jsx)(eq.A,{}),onClick:a}];return(0,m.jsxs)(eK,{children:[(0,m.jsxs)(eZ,{children:[(0,m.jsx)(eG,{theme:"borderless",icon:(0,m.jsx)(eV.A,{}),onClick:i}),(0,m.jsx)(eW,{children:(0,m.jsx)(eX,{prefix:(0,m.jsx)(eF.A,{}),placeholder:"搜索功能、代理、文档...",showClear:!0})})]}),(0,m.jsxs)(e0,{children:[(0,m.jsx)(e1,{theme:"borderless",icon:(0,m.jsx)(eY.A,{}),title:"切换主题"}),(0,m.jsx)(j.Ex,{count:3,children:(0,m.jsx)(e1,{theme:"borderless",icon:(0,m.jsx)(eH.A,{}),title:"消息通知"})}),(0,m.jsx)(j.ms,{trigger:"click",position:"bottomRight",menu:o,children:(0,m.jsxs)(e2,{children:[(0,m.jsxs)(e5,{children:[(0,m.jsx)(eJ,{className:"username",children:s.username||"用户"}),(0,m.jsx)(eJ,{className:"role",children:"个人工作台"})]}),(0,m.jsx)(j.eu,{size:"small",color:"blue",children:(null==(r=s.username)||null==(t=r[0])?void 0:t.toUpperCase())||"U"})]})})]})]})};class e8{static async getDataStatistics(){try{let e=await fetch(`${this.BASE_URL}/get-data-statistics`,{method:"GET",headers:ee});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);let t=await e.json();if("0000"===t.code)return t.data;throw Error(t.info||"获取数据统计失败")}catch(e){return console.error("获取数据统计失败:",e),{activeAgentCount:0,clientCount:0,mcpToolCount:0,systemPromptCount:0,ragOrderCount:0,advisorCount:0,modelCount:0,todayRequestCount:0,successRate:0,runningTaskCount:0}}}}e8.BASE_URL=`${G}/api/v1/admin/data/statistics`;let{Content:e3}=j.PE,{Title:e9,Text:e4}=j.o5,e7=(0,E.Ay)(j.PE)`
  min-height: 100vh;
  background: ${k.secondary};
`,te=E.Ay.div`
  display: flex;
  flex: 1;
  margin-left: ${e=>e.$collapsed?"80px":"280px"}; /* 根据 Sidebar 状态调整左边距 */
  transition: margin-left ${U.normal} ${Q.cubic};
`,tt=(0,E.Ay)(e3)`
  flex: 1;
  padding: ${L.lg};
  background: ${k.secondary};
  overflow-y: auto;
`,tr=(0,E.Ay)(Y)`
  margin-bottom: ${L.xl};
  background: ${S.primary};
  color: white;
  border: none !important;

  .semi-typography {
    color: white !important;
  }
`,ti=E.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${L.lg};
  margin-bottom: ${L.xl};
`,ta=(0,E.Ay)(Y)`
  text-align: center;
  transition: all ${U.normal} ${Q.cubic};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${O.lg};
  }
`,tn=E.Ay.div`
  width: 64px;
  height: 64px;
  border-radius: ${_};
  background: ${e=>e.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${L.base};

  .semi-icon {
    font-size: 28px;
    color: white;
  }
`,ts=E.Ay.div`
  font-size: ${N["3xl"]};
  font-weight: ${P.bold};
  color: ${I.primary};
  margin-bottom: ${L.sm};
`,to=E.Ay.div`
  font-size: ${N.base};
  color: ${I.secondary};
`,tl=E.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${L.lg};
  margin-bottom: ${L.xl};
`,td=(0,E.Ay)(Y)`
  cursor: pointer;
  transition: all ${U.normal} ${Q.cubic};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${O.md};
    border-color: ${$};
  }
`,tc=E.Ay.div`
  width: 48px;
  height: 48px;
  border-radius: ${D};
  background: ${e=>e.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${L.base};

  .semi-icon {
    font-size: 20px;
    color: white;
  }
`,tp=(0,E.Ay)(e9)`
  margin-bottom: ${L.sm} !important;
  color: ${I.primary};
`,th=(0,E.Ay)(e4)`
  color: ${I.secondary};
  line-height: ${B.relaxed};
`,tu=(0,E.Ay)(Y)`
  height: 400px;
`,tm=E.Ay.div`
  display: flex;
  align-items: center;
  gap: ${L.base};
  padding: ${L.base} 0;
  border-bottom: 1px solid ${T.secondary};

  &:last-child {
    border-bottom: none;
  }
`,tg=E.Ay.div`
  width: 32px;
  height: 32px;
  border-radius: ${D};
  background: ${e=>e.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .semi-icon {
    font-size: 14px;
    color: white;
  }
`,tx=E.Ay.div`
  flex: 1;
`,ty=E.Ay.div`
  font-weight: ${P.medium};
  color: ${I.primary};
  margin-bottom: 2px;
`,tf=E.Ay.div`
  font-size: ${N.sm};
  color: ${I.tertiary};
`,tj=()=>{let e=(0,y.Zp)(),[t,r]=(0,g.useState)(!1),[i,a]=(0,g.useState)(null),[n,s]=(0,g.useState)(null),[o,l]=(0,g.useState)(!0),d=async()=>{try{l(!0);let e=await e8.getDataStatistics();s(e)}catch(e){console.error("获取统计数据失败:",e),j.y8.error("获取统计数据失败")}finally{l(!1)}};(0,g.useEffect)(()=>{let t=localStorage.getItem("token"),r=localStorage.getItem("userInfo");if(!t||!r){j.y8.error("请先登录"),e("/login");return}try{let e=JSON.parse(r);a(e)}catch(t){j.y8.error("用户信息解析失败"),e("/login")}d()},[e]);let c=t=>{switch(t){case"dashboard":e("/dashboard");break;case"agent-list":e("/agent-list");break;case"agent-config":e("/agent-config");break;case"client-management":e("/client-management");break;case"ai-client-api-management":e("/ai-client-api-management");break;case"advisor-management":e("/advisor-management");break;case"rag-order-management":e("/rag-order-management");break;case"client-model-management":e("/client-model-management");break;case"client-system-prompt-management":e("/client-system-prompt-management");break;case"client-tool-mcp-management":e("/client-tool-mcp-management");break;default:e(t)}},p=n?[{icon:(0,m.jsx)(e$.A,{}),value:n.activeAgentCount.toString(),label:"活跃代理",color:S.primary},{icon:(0,m.jsx)(eI.A,{}),value:n.todayRequestCount.toLocaleString(),label:"今日请求",color:S.secondary},{icon:(0,m.jsx)(b.A,{}),value:`${n.successRate.toFixed(1)}%`,label:"成功率",color:S.tertiary},{icon:(0,m.jsx)(ek.A,{}),value:n.runningTaskCount.toString(),label:"运行中任务",color:"#52c41a"}]:[{icon:(0,m.jsx)(e$.A,{}),value:"-",label:"活跃代理",color:S.primary},{icon:(0,m.jsx)(eI.A,{}),value:"-",label:"今日请求",color:S.secondary},{icon:(0,m.jsx)(b.A,{}),value:"-",label:"成功率",color:S.tertiary},{icon:(0,m.jsx)(ek.A,{}),value:"-",label:"运行中任务",color:"#52c41a"}],h=[{icon:(0,m.jsx)(e$.A,{}),title:"创建新代理",description:"快速创建和配置新的AI代理",color:S.primary,onClick:()=>c("/agent-config")},{icon:(0,m.jsx)(eI.A,{}),title:"查看分析",description:"查看代理性能和使用统计",color:S.secondary,onClick:()=>c("/analytics")},{icon:(0,m.jsx)(b.A,{}),title:"个人设置",description:"管理个人工作台偏好",color:S.tertiary,onClick:()=>c("/settings")},{icon:(0,m.jsx)(ek.A,{}),title:"系统设置",description:"配置系统参数和偏好设置",color:"#52c41a",onClick:()=>c("/settings")}],u=[{icon:(0,m.jsx)(e$.A,{}),title:'代理 "客服助手" 已启动',time:"2分钟前",color:S.primary},{icon:(0,m.jsx)(eI.A,{}),title:"完成了 156 个对话请求",time:"15分钟前",color:S.secondary},{icon:(0,m.jsx)(b.A,{}),title:"工作知识库已完成整理",time:"1小时前",color:S.tertiary},{icon:(0,m.jsx)(ek.A,{}),title:"系统配置已更新",time:"2小时前",color:"#52c41a"}];return i?(0,m.jsxs)(e7,{children:[(0,m.jsx)(ez,{selectedKey:"dashboard",onSelect:c,collapsed:t}),(0,m.jsx)(te,{$collapsed:t,children:(0,m.jsxs)("div",{style:{flex:1,display:"flex",flexDirection:"column"},children:[(0,m.jsx)(e6,{onToggleSidebar:()=>r(!t),onLogout:()=>{localStorage.removeItem("token"),localStorage.removeItem("userInfo"),localStorage.removeItem("isLoggedIn"),j.y8.success("已退出登录"),e("/login")},collapsed:t}),(0,m.jsxs)(tt,{children:[(0,m.jsx)(tr,{padding:"xl",children:(0,m.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"},children:[(0,m.jsxs)(j.$x,{vertical:!0,align:"start",spacing:"loose",children:[(0,m.jsxs)(e9,{heading:2,children:["欢迎回来，",i.username,"！"]}),(0,m.jsx)(e4,{children:"今天是美好的一天，让我们开始管理您的AI代理吧。"})]}),(0,m.jsx)(j.$n,{theme:"borderless",type:"primary",loading:o,onClick:d,style:{color:"white",borderColor:"white"},children:"刷新数据"})]})}),(0,m.jsx)(ti,{children:p.map((e,t)=>(0,m.jsxs)(ta,{hover:!0,children:[(0,m.jsx)(tn,{$color:e.color,children:e.icon}),(0,m.jsx)(ts,{children:o?"...":e.value}),(0,m.jsx)(to,{children:e.label})]},t))}),(0,m.jsxs)(j.fI,{gutter:[24,24],children:[(0,m.jsxs)(j.fv,{span:16,children:[(0,m.jsx)(e9,{heading:4,style:{marginBottom:L.lg},children:"快速操作"}),(0,m.jsx)(tl,{children:h.map((e,t)=>(0,m.jsxs)(td,{hover:!0,onClick:e.onClick,children:[(0,m.jsx)(tc,{$color:e.color,children:e.icon}),(0,m.jsx)(tp,{heading:5,children:e.title}),(0,m.jsx)(th,{children:e.description})]},t))})]}),(0,m.jsxs)(j.fv,{span:8,children:[(0,m.jsx)(e9,{heading:4,style:{marginBottom:L.lg},children:"最近活动"}),(0,m.jsx)(tu,{children:(0,m.jsx)(j.$x,{vertical:!0,style:{width:"100%"},spacing:"tight",children:u.map((e,t)=>(0,m.jsxs)(tm,{children:[(0,m.jsx)(tg,{$color:e.color,children:e.icon}),(0,m.jsxs)(tx,{children:[(0,m.jsx)(ty,{children:e.title}),(0,m.jsx)(tf,{children:e.time})]})]},t))})})]})]})]})]})})]}):null};var tv=r(8924),tb=r(8733),tw=r(2971),tA=r(2857);r(8430);var tC=r(6833);let tE="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAASAAAAEgCAYAAAAUg66AAAAAAXNSR0IArs4c6QAADchJREFUeF7t3VuW20YSRVFqZLZGJnlktkdmG62l1quKRJKRvJHJXb+NQhA7EmeV2np8uPgiQIBASOBDaK6xBAgQuAiQQ0CAQExAgGL0BhMgIEDOAAECMQEBitEbTICAADkDBAjEBAQoRm8wAQIC5AwQIBATEKAYvcEECAiQM0CAQExAgGL0BhMgIEDOAAECMQEBitEbTICAADkDBAjEBAQoRm8wAQIC5AwQIBATEKAYvcEECAiQM0CAQExAgGL0BhMgIEDOAAECMQEBitEbTICAADkDBAjEBAQoRm8wAQIC5AwQIBATEKAYvcEECAiQM0CAQExAgGL0BhMgIEDOAAECMQEBitEbTICAADkDBAjEBAQoRm8wAQIC5AwQIBATEKAYvcEECAiQM0CAQExAgGL0BhMgIEDOAAECMQEBitEbTICAADkDBAjEBAQoRm8wAQIC5AwQIBATEKAYvcEECAiQM0CAQExAgGL0BhMgIEDOAAECMQEBitEbTICAADkDBAjEBAQoRm8wAQIC5AwQIBATEKAYvcEECAiQM0CAQExAgGL0BhMgIEDOAAECMQEBitEbTICAADkDBAjEBAQoRm8wAQIC5AwQIBATEKAYvcEECAiQM0CAQExAgGL0BhMgIEDOAAECMQEBitEbTICAADkDBAjEBAQoRm8wAQIC5AwQIBATEKAYvcEECOwQoM/WSIDA/wWWeh92CNA/Dh8BAv8T+OtyuXxcyUKAVtqWz0rguoAABU6In4AC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6Ea2FBCgwFoEKIBuZEsBAQqsRYAC6JuM/Hi5XH6/XC6fNnkeAQosUoAC6BuMPOJzvLDH1+dNIiRAgYMpQAH0xUd+H5+vj7JDhAQocDAFKIC+8Mi34rNLhAQocDAFKIC+6Mhr8dkhQgIUOJgCFEBfcOSZ+KweIQEKHEwBCqAvNnIkPitHSIACB1OAAugLjbwnPqtGSIACB1OAAuiLjHwkPitGSIACB1OA7kc/DuzxG/F2/KqIz2oREqDASRag+9D/+O/bjt/7ssPvf/lZoDI+K0VIgO57Fx76LgEa5/san5VerrNPOSM+qzgJ0NlTUnidAI1h/hyfVV6uM085Mz7H/D+b/5JVgM6ckuJrBOg86Hvx2SFCrx6fY4cCdP5dKLtSgM5R3orPyhESny/bE6Bz70LpVQJ0m/NsfFaMkPh8278A3X4Xyq8QoOuko/FZKULi8+PuBag8L7dvKEDvG90bnxUiJD6/7l2Abvei/AoBepv00fh0jpD4vL1zASrPy+0bCtCvRlXx6Rgh8Xn/nRCg270ov0KAfiStjk+nCInP9ddHgMrzcvuGAvTNaFZ8OkRIfG6/CwJ026j8CgH6Qjo7PskIic+510aAzjmVXiVAz4tPIkLic/51EaDzVmVXvnqAnvWTz88Le8afohefsddEgMa8Sq5+5QCl4vOMn4RmP1v3P1h6z8shQPeoPfg9rxqg2S/o2bXM+Elo9rPtGJ9jXwJ09tQWXveKAZr9go6upzJCs59t1/gI0OipLbr+1QI0+wW9dy0VEZr9bDvHR4DuPbkPft8rBWj2C/rgKh76611nP9vu8RGgR0/vnd//KgGa/YLeyf/Lt93zk9DsZ3uF+AhQ1QkevM8rBGj2CzpIfvPykQjNfrZXiY8A3TyWcy7YPUCzX9A5Wzn3r23MfrZXio8AzTrJN+67c4Bmv6DHvwl2/KfbWV/XfhKa/WyvFh8BmnWKXzRAs1/Qr3F41pzv1zh75ivGR4AEqExg9gv6808mz5w3e9arxkeAyl6/sRvt9kuw2S/oe78sesbcY7PH/FlfrxwfAZp1ql7ol2DPiMCnK56z5888Iq8eHwGaebqu3HuXn4Bmv/xn/9P47M8x45iIzxdVfxZsxul6gZ+AZr/0Z+PzlXr256k8JuLzTVOAKk/WyXut/hPQ7Jd9ND4rRUh8fnxJBOhkNCovWzlAXeOzQoTE59e3SIAqy3LyXqsGqHt8OkdIfN5+OQToZDQqL1sxQKvEp2OExOf9t0eAKsty8l4rBuh4tFl/3/G9/5/PLe7Z0bw1//jfxee6kgCdOUXF16waoBkRmhWfDj8JzX624mMZuZ0ABdhXDlBlhJ71giZ+EnrWswWOb+lIASrlPHez1QNUEaFnv6DPjNCzn+3cqet5lQAF9rJDgB6JUOoFfUaEUs8WOMYlIwWohHHsJrsE6J4IpV/QmRFKP9vYKexxtQAF9rBTgEYi1OUFnRGhLs8WOM4PjRSgh/ju++bdAnQmQt1e0MoIdXu2+05l5rsEKOC+Y4CuRajrC1oRoa7PFjjWd40UoLvYHvumXQP0VoS6v6CPRKj7sz12Sp/z3QL0HOcfpuwcoO8jtMoLek+EVnm2wPEeGilAQ1w1F+8eoEPpOFjHv2CxytdIhMSnbqsCVGd5+k6vEKDTGI0uPBMh8aldmADVep66mwCdYopcdC1C4lO/EgGqN715RwG6SRS94K0Iic+clQjQHNerdxWgAPrgyO8jJD6DeAOXC9AAVtWlAlQlOfc+R4SOr2v/LNDcT7D/3QUosGMBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosBYBCqAb2VJAgAJrEaAAupEtBQQosJY/AzONJNBR4O//PtTnjh/svc/0YaUP67MSILCXgADttU9PQ2ApAQFaal0+LIG9BARor316GgJLCQjQUuvyYQnsJSBAe+3T0xBYSkCAllqXD0tgLwEB2mufnobAUgICtNS6fFgCewkI0F779DQElhIQoKXW5cMS2EtAgPbap6chsJSAAC21Lh+WwF4CArTXPj0NgaUEBGipdfmwBPYSEKC99ulpCCwlIEBLrcuHJbCXgADttU9PQ2ApAQGau67jr8f8be4Id3+ywB+Xy+X4u5d9FQgIUAHilVscAfo0d4S7P1ngowDViQtQneVbdxKgub6JuwtQoboAFWK+cSsBmuubuLsAFaoLUCGmAM3FbHJ3ASpchAAVYgrQXMwmdxegwkUIUCGmAM3FbHJ3ASpchAAVYgrQXMwmdxegwkUIUCGmAM3FbHJ3ASpchAAVYgrQXMwmdxegwkUIUCGmAM3FbHJ3ASpchAAVYgrQXMwmdxegwkUIUCGmAM3FbHJ3ASpchAAVYgrQXMwmdxegwkUIUCGmWxEgMCYgQGNeriZAoFBAgAox3YoAgTEBARrzcjUBAoUCAlSI6VYECIwJCNCYl6sJECgUEKBCTLciQGBMQIDGvFxNgEChgAAVYroVAQJjAgI05uVqAgQKBQSoENOtCBAYExCgMS9XEyBQKCBAhZhuRYDAmIAAjXm5mgCBQgEBKsR0KwIExgQEaMzL1QQIFAoIUCGmWxEgMCYgQGNeriZAoFBAgAox3YoAgTEBARrzcjUBAoUCAlSI6VYECIwJCNCYl6sJECgUEKBCTLciQGBMQIDGvFxNgEChgAAVYroVAQJjAgI05uVqAgQKBQSoENOtCBAYExCgMS9XEyBQKCBAhZhuRYDAmIAAjXm5mgCBQgEBKsR0KwIExgQEaMzL1QQIFAoIUCGmWxEgMCYgQGNeriZAoFBAgAox3YoAgTEBARrzcjUBAoUCAlSI6VYECIwJCNCYl6sJECgUEKBCTLciQGBMQIDGvFxNgEChgAAVYroVAQJjAgI05uVqAgQKBQSoENOtCBAYExCgMS9XEyBQKCBAhZhuRYDAmIAAjXm5mgCBQgEBKsR0KwIExgQEaMzL1QQIFAoIUCGmWxEgMCYgQGNeriZAoFBAgAox3YoAgTGBfwFjrww/fYI/8gAAAABJRU5ErkJggg==",t$=E.Ay.span`
  font-size: 12px;
  color: red;
`,tI=E.Ay.span`
  font-size: 12px;
  color: orange;
`,tk=e=>{let{errors:t,warnings:r,invalid:i}=e,a=e=>e?e.map(e=>(0,m.jsx)("span",{children:e.message},e.name)):null;return(0,m.jsxs)("div",{children:[(0,m.jsx)("div",{children:(0,m.jsx)(t$,{children:a(t)})}),(0,m.jsx)("div",{children:(0,m.jsx)(tI,{children:a(r)})})]})};var tT=r(2495),tS=r(2265),tN=r(2951),tP=r(2360),tB=r(7935),tL=r(5860),tD=r(7280);let tM=async(e,t)=>{let r=e.get(tP.rV),i=e.document,a=e.get(J.Z4G),n=e.get(J.GHE),{fromPort:s,toPort:o,mousePos:l,line:d,originLine:c}=t;if(c||!d||o)return;let p=tP.ld.getContainerNode({fromPort:s}),h=await r.singleSelectNodePanel({position:l,containerNode:p,panelProps:{enableNodePlaceholder:!0,enableScrollClose:!0}});if(!h)return;let{nodeType:u,nodeJSON:m}=h,g=tP.ld.adjustNodePosition({nodeType:u,position:l,fromPort:s,toPort:o,containerNode:p,document:i,dragService:a}),x=i.createWorkflowNodeByType(u,g,m??{},null==p?void 0:p.id);await (0,J.cbG)(20),tP.ld.buildLine({fromPort:s,node:x,toPort:o,linesManager:n})};class t_{async execute(){this.playgroundConfig.zoom>1.9||this.playgroundConfig.zoomout()}constructor(e){this.commandId="ZOOM_OUT",this.shortcuts=["meta -","ctrl -"],this.playgroundConfig=e.get(J.d0U),this.execute=this.execute.bind(this)}}class tR{async execute(){this.playgroundConfig.zoom>1.9||this.playgroundConfig.zoomin()}constructor(e){this.commandId="ZOOM_IN",this.shortcuts=["meta =","ctrl ="],this.playgroundConfig=e.get(J.d0U),this.execute=this.execute.bind(this)}}class tO{async execute(){let e=this.document.getAllNodes();this.playground.selectionService.selection=e}constructor(e){this.commandId="SELECT_ALL",this.shortcuts=["meta a","ctrl a"],this.document=e.get(J.Vo_),this.playground=e.playground,this.execute=this.execute.bind(this)}}let tU="flowgram-workflow-clipboard-data";(c=h||(h={})).traverseNodes=(e,t)=>{let{value:r}=e;if(r){if("[object Object]"===Object.prototype.toString.call(r))Object.entries(r).forEach(i=>{let[a,n]=i;return c.traverseNodes({value:n,container:r,key:a,parent:e},t)});else if(Array.isArray(r))for(let i=r.length-1;i>=0;i--){let a=r[i];c.traverseNodes({value:a,container:r,index:i,parent:e},t)}t(i({node:e}))}},i=e=>{let{node:t}=e;return{node:t,setValue:e=>a(t,e),getParents:()=>n(t),getPath:()=>s(t),getStringifyPath:()=>o(t),deleteSelf:()=>l(t)}},a=(e,t)=>{if(!t||!e)return;e.value=t;let{container:r,key:i,index:a}=e;i&&r?r[i]=t:"number"==typeof a&&(r[a]=t)},n=e=>{let t=[],r=e;for(;r;)t.unshift(r),r=r.parent;return t},s=e=>{let t=[];return n(e).forEach(e=>{e.key?t.unshift(e.key):e.index&&t.unshift(e.index)}),t},o=e=>s(e).reduce((e,t)=>"string"!=typeof t?`${e}[${t}]`:/\W/g.test(t)?`${e}["${t}"]`:`${e}.${t}`,""),l=e=>{let{container:t,key:r,index:i}=e;r&&t?delete t[r]:"number"==typeof i&&t.splice(i,1)},p=u||(u={}),d=(0,tC.d_)("1234567890",6),p.getAllNodeIds=e=>{let t=new Set,r=e=>{var i;t.add(e.id),(null==(i=e.blocks)?void 0:i.length)&&e.blocks.forEach(e=>r(e))};return e.nodes.forEach(e=>r(e)),Array.from(t)},p.generateNodeReplaceMap=(e,t)=>{let r=new Map;return e.forEach(e=>{if(t(e))r.set(e,e);else{let i;do i=d();while(!t(i));r.set(e,i)}}),r},p.replaceNodeId=(e,t)=>{var r;let i;return i=Array.isArray(r=e=>{if(!(e=>{var t,r,i,a,n,s,o;let{node:l}=e;return!!((null==l?void 0:l.key)&&["sourceNodeID","targetNodeID"].includes(l.key))&&(null==(r=l.parent)||null==(t=r.parent)?void 0:t.key)==="edges"||(null==l?void 0:l.key)==="id"&&null!=(null==(i=l.container)?void 0:i.type)&&null!=(null==(a=l.container)?void 0:a.meta)&&null!=(null==(n=l.container)?void 0:n.data)||(null==l?void 0:l.key)==="blockID"&&null!=(null==(s=l.container)?void 0:s.name)&&(null==(o=l.container)?void 0:o.source)==="block-output"})(e))return;let{node:r}=e;t.has(r.value)&&e.setValue(t.get(r.value))})?e=>{r.forEach(t=>t(e))}:r,h.traverseNodes({value:e},i),e};class tQ{async execute(){let e=await this.tryReadClipboard();if(!e||!this.isValidData(e))return;let t=this.apply(e);return t.length>0&&(j.y8.success({content:"Copy successfully",showClose:!1}),await this.nextTick(),this.scrollNodesToView(t)),t}apply(e){let{json:t}=e,r=(e=>{let{json:t,isUniqueId:r}=e,i=u.getAllNodeIds(t),a=u.generateNodeReplaceMap(i,r);return u.replaceNodeId(t,a)})({json:t,isUniqueId:e=>!this.entityManager.getEntityById(e)}),i=this.calcPasteOffset(e.bounds),a=this.getSelectedContainer();this.applyOffset({json:r,offset:i,parent:a});let{nodes:n}=this.document.renderJSON(r,{parent:a});return this.selectNodes(n),n}isValidData(e){return(null==e?void 0:e.type)!==tU?(j.y8.error({content:"Invalid clipboard data"}),!1):e.source.host===window.location.host||(j.y8.error({content:"Cannot paste nodes from different host"}),!1)}async tryReadClipboard(){try{let e=await navigator.clipboard.readText()||"";return JSON.parse(e)}catch(e){return}}calcPasteOffset(e){let{x:t,y:r,width:i,height:a}=e,{center:n}=new J.M_G(t,r,i,a),s=this.hoverService.hoveredPos;return{x:s.x-n.x,y:s.y-n.y}}applyOffset(e){let{json:t,offset:r,parent:i}=e;t.nodes.forEach(e=>{var t;if(!(null==(t=e.meta)?void 0:t.position))return;let a={x:e.meta.position.x+r.x,y:e.meta.position.y+r.y};i&&(a=this.dragService.adjustSubNodePosition(e.type,i,a)),e.meta.position=a})}getSelectedContainer(){let{activatedNode:e}=this.selectService;return(null==e?void 0:e.getNodeMeta().isContainer)?e:void 0}selectNodes(e){this.selectService.selection=e}async scrollNodesToView(e){let t=e.map(e=>e.getData(J.LY3).bounds);await this.document.playgroundConfig.scrollToView({bounds:J.M_G.enlarge(t)})}async nextTick(){await (0,J.cbG)(16),await new Promise(e=>requestAnimationFrame(e))}constructor(e){this.commandId="PASTE",this.shortcuts=["meta v","ctrl v"],this.document=e.get(J.Vo_),this.selectService=e.get(J.rmK),this.entityManager=e.get(J.Zy1),this.hoverService=e.get(J.Be1),this.dragService=e.get(J.Z4G),this.execute=this.execute.bind(this)}}class tz{async execute(){this.selectService.selectedNodes.forEach(e=>{e.renderData.expanded=!0})}constructor(e){this.commandId="EXPAND",this.commandDetail={label:"Expand"},this.shortcuts=["meta alt closebracket","ctrl alt openbracket"],this.selectService=e.get(J.rmK),this.execute=this.execute.bind(this)}}class tq{async execute(){this.isValid(this.selectService.selectedNodes)&&(this.selectService.selection.forEach(e=>{e instanceof J.FfK?this.removeNode(e):e instanceof J.fvO?this.removeLine(e):e.dispose()}),this.selectService.selection=this.selectService.selection.filter(e=>!e.disposed))}isValid(e){return!e.some(e=>["start","end"].includes(e.flowNodeType))||(j.y8.error({content:"Start or End node cannot be deleted",showClose:!1}),!1)}removeNode(e){var t;if(!this.document.canRemove(e))return;let r=e.getNodeMeta(),i=null==(t=r.subCanvas)?void 0:t.call(r,e);(null==i?void 0:i.isCanvas)?i.parentNode.dispose():e.dispose()}removeLine(e){this.document.linesManager.canRemove(e)&&e.dispose()}constructor(e){this.commandId="DELETE",this.shortcuts=["backspace","delete"],this.document=e.get(J.Vo_),this.selectService=e.get(J.rmK),this.execute=this.execute.bind(this)}}class tV{async execute(){if(await this.hasSelectedText()||!this.isValid(this.selectedNodes))return;let e=this.toClipboardData();await this.write(e)}async hasSelectedText(){var e,t;return!!(null==(e=window.getSelection())?void 0:e.toString())&&(await navigator.clipboard.writeText((null==(t=window.getSelection())?void 0:t.toString())??""),j.y8.success({content:"Text copied"}),!0)}get selectedNodes(){return this.selectService.selection.filter(e=>e instanceof J.FfK)}isValid(e){return 0!==e.length||(j.y8.warning({content:"No nodes selected"}),!1)}toClipboardData(e){let t=this.getValidNodes(e||this.selectedNodes),r=this.toSource();return{type:tU,source:r,json:this.toJSON(t),bounds:this.getEntireBounds(t)}}getValidNodes(e){return e.filter(e=>!["start","end"].includes(e.flowNodeType)&&!e.getNodeMeta().copyDisable)}toSource(){return{host:window.location.host}}toJSON(e){return{nodes:this.getNodeJSONs(e),edges:this.getEdgeJSONs(e)}}getNodeJSONs(e){return e.map(e=>{var t;let r=this.document.toNodeJSON(e);if(!(null==(t=r.meta)?void 0:t.position))return r;let{bounds:i}=e.getData(J.hZp);return r.meta.position={x:i.x,y:i.y},r}).filter(Boolean)}getEdgeJSONs(e){let t=new Set,r=new Set(e.map(e=>e.id));return e.forEach(e=>{let i=e.getData(J.tBW);[...i.inputLines,...i.outputLines].forEach(e=>{var i;r.has(e.from.id)&&(null==(i=e.to)?void 0:i.id)&&r.has(e.to.id)&&t.add(e)})}),Array.from(t).map(e=>e.toJSON())}getEntireBounds(e){let t=e.map(e=>e.getData(J.hZp).bounds),r=J.M_G.enlarge(t);return{x:r.x,y:r.y,width:r.width,height:r.height}}async write(e){try{await navigator.clipboard.writeText(JSON.stringify(e)),this.notifySuccess()}catch(e){console.error("Failed to write text: ",e)}}notifySuccess(){let e=this.selectedNodes.map(e=>e.flowNodeType);e.includes("start")||e.includes("end")?j.y8.warning({content:"The Start/End node cannot be duplicated, other nodes have been copied to the clipboard",showClose:!1}):j.y8.success({content:"Nodes have been copied to the clipboard",showClose:!1})}constructor(e){this.commandId="COPY",this.shortcuts=["meta c","ctrl c"],this.document=e.get(J.Vo_),this.selectService=e.get(J.rmK),this.execute=this.execute.bind(this)}}class tF{async execute(){this.selectService.selectedNodes.forEach(e=>{e.renderData.expanded=!1})}constructor(e){this.commandId="COLLAPSE",this.commandDetail={label:"Collapse"},this.shortcuts=["meta alt openbracket","ctrl alt openbracket"],this.selectService=e.get(J.rmK),this.execute=this.execute.bind(this)}}function tY(e,t){e.addHandlers(new tV(t),new tQ(t),new tO(t),new tF(t),new tz(t),new tq(t),new tR(t),new t_(t))}var tH=r(5626);let tJ=(0,J.XY6)({onInit(e,t){e.document.onNodeCreate(e=>{let{node:t}=e,r=(0,J.BAU)(t),i=t.getData(J.D31),a=e=>{if(!e)return void i.clearVar();let a=function e(t){let{type:r}=t||{};if(r)switch(r){case"object":return J.vi.createObject({properties:Object.entries(t.properties||{}).sort((e,t)=>((0,tH.A)(null==e?void 0:e[1],"extra.index")||0)-((0,tH.A)(null==t?void 0:t[1],"extra.index")||0)).map(t=>{let[r,i]=t;return{key:r,type:e(i),meta:{description:i.description}}})});case"array":return J.vi.createArray({items:e(t.items)});case"string":return J.vi.createString();case"number":return J.vi.createNumber();case"boolean":return J.vi.createBoolean();case"integer":return J.vi.createInteger();default:return J.vi.createCustomType({typeName:r})}}(e);if(a){var n,s;let e=(null==r?void 0:r.getValueIn("title"))||t.id;i.setVar(J.vi.createVariableDeclaration({meta:{title:`${e}`,icon:null==(s=t.getNodeRegistry())||null==(n=s.info)?void 0:n.icon},key:`${t.id}.outputs`,type:a}))}else i.clearVar()};r&&(a(r.getValueIn("outputs")),r.onFormValuesChange(e=>{(e.name.match(/^outputs/)||e.name.match(/^title/))&&a(r.getValueIn("outputs"))}))})}}),tK={render:e=>{let{form:t}=e;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(ie,{}),(0,m.jsxs)(rq,{children:[(0,m.jsx)(r2,{}),(0,m.jsx)(rJ,{})]})]})},validateTrigger:J.N0$.onChange,validate:{title:e=>{let{value:t}=e;return t?void 0:"Title is required"},"inputsValues.*":e=>{var t;let{value:r,context:i,formValues:a,name:n}=e,s=n.replace(/^inputsValues\./,"");if(((null==(t=a.inputs)?void 0:t.required)||[]).includes(s)&&(""===r||void 0===r))return`${s} is required`}}};var tZ=r(7424),tG=r(1945),tW=r(3860),tX=r(1880);let t0=e=>{let{size:t}=e;return(0,m.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 10 10",xmlns:"http://www.w3.org/2000/svg",style:{width:t,height:t},children:(0,m.jsx)("path",{id:"group",fill:"currentColor",fillRule:"evenodd",stroke:"none",d:"M 0.009766 10 L 0.009766 9.990234 L 0 9.990234 L 0 7.5 L 1 7.5 L 1 9 L 2.5 9 L 2.5 10 L 0.009766 10 Z M 3.710938 10 L 3.710938 9 L 6.199219 9 L 6.199219 10 L 3.710938 10 Z M 7.5 10 L 7.5 9 L 9 9 L 9 7.5 L 10 7.5 L 10 9.990234 L 9.990234 9.990234 L 9.990234 10 L 7.5 10 Z M 0 6.289063 L 0 3.800781 L 1 3.800781 L 1 6.289063 L 0 6.289063 Z M 9 6.289063 L 9 3.800781 L 10 3.800781 L 10 6.289063 L 9 6.289063 Z M 0 2.5 L 0 0.009766 L 0.009766 0.009766 L 0.009766 0 L 2.5 0 L 2.5 1 L 1 1 L 1 2.5 L 0 2.5 Z M 9 2.5 L 9 1 L 7.5 1 L 7.5 0 L 9.990234 0 L 9.990234 0.009766 L 10 0.009766 L 10 2.5 L 9 2.5 Z M 3.710938 1 L 3.710938 0 L 6.199219 0 L 6.199219 1 L 3.710938 1 Z"})})},t1=e=>{let{size:t}=e;return(0,m.jsx)("svg",{width:"10",height:"10",viewBox:"0 0 10 10",xmlns:"http://www.w3.org/2000/svg",style:{width:t,height:t},children:(0,m.jsx)("path",{id:"ungroup",fill:"currentColor",fillRule:"evenodd",stroke:"none",d:"M 9.654297 10.345703 L 8.808594 9.5 L 7.175781 9.5 L 7.175781 8.609375 L 7.917969 8.609375 L 1.390625 2.082031 L 1.390625 2.824219 L 0.5 2.824219 L 0.5 1.191406 L -0.345703 0.345703 L 0.283203 -0.283203 L 1.166016 0.599609 L 2.724609 0.599609 L 2.724609 1.490234 L 2.056641 1.490234 L 8.509766 7.943359 L 8.509766 7.275391 L 9.400391 7.275391 L 9.400391 8.833984 L 10.283203 9.716797 L 9.654297 10.345703 Z M 0.509766 9.5 L 0.509766 9.490234 L 0.5 9.490234 L 0.5 7.275391 L 1.390625 7.275391 L 1.390625 8.609375 L 2.724609 8.609375 L 2.724609 9.5 L 0.509766 9.5 Z M 3.802734 9.5 L 3.802734 8.609375 L 6.017578 8.609375 L 6.017578 9.5 L 3.802734 9.5 Z M 0.5 6.197266 L 0.5 3.982422 L 1.390625 3.982422 L 1.390625 6.197266 L 0.5 6.197266 Z M 8.509766 6.197266 L 8.509766 3.982422 L 9.400391 3.982422 L 9.400391 6.197266 L 8.509766 6.197266 Z M 8.509766 2.824219 L 8.509766 1.490234 L 7.175781 1.490234 L 7.175781 0.599609 L 9.390625 0.599609 L 9.390625 0.609375 L 9.400391 0.609375 L 9.400391 2.824219 L 8.509766 2.824219 Z M 3.802734 1.490234 L 3.802734 0.599609 L 6.017578 0.599609 L 6.017578 1.490234 L 3.802734 1.490234 Z"})})},t2=e=>{let{node:t,style:r}=e,i=(0,J.h1n)(J.Ju9);return(0,m.jsx)(j.m_,{content:"Ungroup",children:(0,m.jsx)("div",{className:"workflow-group-ungroup",style:r,children:(0,m.jsx)(j.$n,{icon:(0,m.jsx)(t1,{size:14}),style:{height:30,width:30},theme:"borderless",type:"tertiary",onClick:()=>{i.executeCommand(tL.oh.Ungroup,t)}})})})};var t5=r(7315);let t6=()=>{let[e,t]=(0,g.useState)(!1);return(0,m.jsx)(J.D0$,{name:"title",children:r=>{let{field:i}=r;return e?(0,m.jsx)(j.pd,{autoFocus:!0,className:"workflow-group-title-input",size:"small",value:i.value,onChange:i.onChange,onMouseDown:e=>e.stopPropagation(),onBlur:()=>t(!1),draggable:!1,onEnterPress:()=>t(!1)}):(0,m.jsx)("p",{className:"workflow-group-title",onDoubleClick:()=>t(!0),children:i.value??"Group"})}})},t8="Blue",t3={Red:{50:"#fef2f2",300:"#fca5a5",400:"#f87171"},Orange:{50:"#fff7ed",300:"#fdba74",400:"#fb923c"},Amber:{50:"#fffbeb",300:"#fcd34d",400:"#fbbf24"},Yellow:{50:"#fef9c3",300:"#fde047",400:"#facc15"},Lime:{50:"#f7fee7",300:"#bef264",400:"#a3e635"},Green:{50:"#f0fdf4",300:"#86efac",400:"#4ade80"},Emerald:{50:"#ecfdf5",300:"#6ee7b7",400:"#34d399"},Teal:{50:"#f0fdfa",300:"#5eead4",400:"#2dd4bf"},Cyan:{50:"#ecfeff",300:"#67e8f9",400:"#22d3ee"},Sky:{50:"#ecfeff",300:"#7dd3fc",400:"#38bdf8"},Blue:{50:"#eff6ff",300:"#93c5fd",400:"#60a5fa"},Indigo:{50:"#eef2ff",300:"#a5b4fc",400:"#818cf8"},Violet:{50:"#f5f3ff",300:"#c4b5fd",400:"#a78bfa"},Purple:{50:"#faf5ff",300:"#d8b4fe",400:"#c084fc"},Fuchsia:{50:"#fdf4ff",300:"#f0abfc",400:"#e879f9"},Pink:{50:"#fdf2f8",300:"#f9a8d4",400:"#f472b6"},Rose:{50:"#fff1f2",300:"#fda4af",400:"#fb7185"},Gray:{50:"#f9fafb",300:"#d1d5db",400:"#9ca3af"}},t9=()=>(0,m.jsx)(J.D0$,{name:"color",children:e=>{let{field:t}=e,r=t.value??t8;return(0,m.jsx)(j.AM,{position:"top",mouseLeaveDelay:300,content:(0,m.jsx)("div",{className:"workflow-group-color-palette",children:Object.entries(t3).map(e=>{let[i,a]=e;return(0,m.jsx)(j.m_,{content:i,mouseEnterDelay:300,children:(0,m.jsx)("span",{className:"workflow-group-color-item",style:{backgroundColor:a["300"],borderColor:i===r?a["400"]:"#fff"},onClick:()=>t.onChange(i)},i)},i)})}),children:(0,m.jsx)("span",{className:"workflow-group-color",style:{backgroundColor:t3[r]["300"]}})})}}),t4=()=>(0,m.jsxs)("div",{className:"workflow-group-tools",children:[(0,m.jsx)(t5.A,{className:"workflow-group-tools-drag"}),(0,m.jsx)(t6,{}),(0,m.jsx)(t9,{})]}),t7="workflow-move-into-group-tip-visible",re="false";class rt{static get instance(){return this._instance||(this._instance=new rt),this._instance}isClosed(){return this.isCloseForever()||this.closed}close(){this.closed=!0}isCloseForever(){return localStorage.getItem(t7)===re}closeForever(){localStorage.setItem(t7,re)}constructor(){this.closed=!1}}let rr=E.Ay.div`
  position: absolute;
  top: 35px;

  width: 100%;
  height: 28px;
  white-space: nowrap;
  pointer-events: auto;

  .container {
    display: inline-flex;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: rgb(255 255 255);
    border-radius: 8px 8px 0 0;

    .content {
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;

      width: fit-content;
      height: 100%;
      padding: 0 12px;

      .text {
        font-size: 14px;
        font-weight: 400;
        font-style: normal;
        line-height: 20px;
        color: rgba(15, 21, 40, 82%);
        text-overflow: ellipsis;
        margin: 0;
      }

      .space {
        width: 128px;
      }
    }

    .actions {
      display: flex;
      gap: 8px;
      align-items: center;

      height: 28px;
      padding: 0 12px;

      .close-forever {
        cursor: pointer;

        padding: 0 3px;

        font-size: 12px;
        font-weight: 400;
        font-style: normal;
        line-height: 12px;
        color: rgba(32, 41, 69, 62%);
        margin: 0;
      }

      .close {
        display: flex;
        cursor: pointer;
        height: 100%;
        align-items: center;
      }
    }
  }
`,ri=/(Macintosh|MacIntel|MacPPC|Mac68K|iPad)/.test(navigator.userAgent),ra=()=>(0,m.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"none",viewBox:"0 0 16 16",children:(0,m.jsx)("path",{fill:"#060709",fillOpacity:"0.5",d:"M12.13 12.128a.5.5 0 0 0 .001-.706L8.71 8l3.422-3.423a.5.5 0 0 0-.001-.705.5.5 0 0 0-.706-.002L8.002 7.293 4.579 3.87a.5.5 0 0 0-.705.002.5.5 0 0 0-.002.705L7.295 8l-3.423 3.422a.5.5 0 0 0 .002.706c.195.195.51.197.705.001l3.423-3.422 3.422 3.422c.196.196.51.194.706-.001"})}),rn=()=>{let{visible:e,close:t,closeForever:r}=(()=>{let e=(0,J.QSU)(),[t,r]=(0,g.useState)(!1),i=rt.instance,a=(0,J.h1n)(tD.fZ),n=(0,g.useCallback)(()=>{i.isClosed()||r(!0)},[i]),s=(0,g.useCallback)(()=>{i.close(),r(!1)},[i]),o=(0,g.useCallback)(()=>{i.closeForever(),s()},[s,i]);return(0,g.useEffect)(()=>{let t=a.on(t=>{t.type===tD.ix.In&&t.targetContainer===e&&n()}),i=a.on(t=>{t.type===tD.ix.Out&&(t.sourceContainer!==e||e.blocks.length||r(!1))});return()=>{t.dispose(),i.dispose()}},[a,e,n,s,t]),{visible:t,close:s,closeForever:o}})();return e?(0,m.jsx)(rr,{className:"workflow-group-tips",children:(0,m.jsxs)("div",{className:"container",children:[(0,m.jsxs)("div",{className:"content",children:[(0,m.jsx)("p",{className:"text",children:`Hold ${ri?"Cmd ⌘":"Ctrl"} to drag node out`}),(0,m.jsx)("div",{className:"space",style:{width:0}})]}),(0,m.jsxs)("div",{className:"actions",children:[(0,m.jsx)("p",{className:"close-forever",onClick:r,children:"Never Remind"}),(0,m.jsx)("div",{className:"close",onClick:t,children:(0,m.jsx)(ra,{})})]})]})}):null},rs=e=>{let{onMouseDown:t,onFocus:r,onBlur:i,children:a,style:n}=e,s=t3[(0,J.FHZ)("color")??t8];return(0,m.jsx)("div",{className:"workflow-group-header","data-flow-editor-selectable":"false",onMouseDown:t,onFocus:r,onBlur:i,style:{...n,backgroundColor:s["50"],borderColor:s["300"]},children:a})},ro=e=>{let{node:t,style:r}=e,i=t3[(0,J.FHZ)("color")??t8];return(0,g.useEffect)(()=>{let e=document.createElement("style");return e.textContent=`
      .workflow-group-render[data-group-id="${t.id}"] .workflow-group-background {
        border: 1px solid ${i["300"]};
      }

      .workflow-group-render.selected[data-group-id="${t.id}"] .workflow-group-background {
        border: 1px solid ${i["400"]};
      }
    `,document.head.appendChild(e),()=>{e.remove()}},[i]),(0,m.jsx)("div",{className:"workflow-group-background","data-flow-editor-selectable":"true",style:{...r,backgroundColor:`${i["300"]}29`}})},rl=()=>{let{node:e,selected:t,selectNode:r,nodeRef:i,startDrag:a,onFocus:n,onBlur:s}=(0,J.MVE)(),o=(0,tD.zp)(),l=e.getData(J.LO).getFormModel(),d=null==l?void 0:l.formControl,{height:c,width:p}=o??{},h=c??0;return(0,g.useEffect)(()=>{e.renderData.node.style.pointerEvents="none"},[e]),(0,m.jsx)("div",{className:`workflow-group-render ${t?"selected":""}`,ref:i,"data-group-id":e.id,"data-node-selected":String(t),onMouseDown:r,onClick:e=>{r(e)},style:{width:p,height:c},children:(0,m.jsx)(J.lVW,{control:d,children:(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(rs,{onMouseDown:e=>{a(e)},onFocus:n,onBlur:s,style:{height:30},children:(0,m.jsx)(t4,{})}),(0,m.jsx)(rn,{}),(0,m.jsx)(t2,{node:e}),(0,m.jsx)(ro,{node:e,style:{top:35,height:h-30-5}})]})})})},rd=e=>{let{bounds:t,children:r,flowSelectConfig:i,commandRegistry:a}=e;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("div",{style:{position:"absolute",left:t.right,top:t.top,transform:"translate(-100%, -100%)"},onMouseDown:e=>{e.stopPropagation()},children:(0,m.jsxs)(j.e2,{size:"small",style:{display:"flex",flexWrap:"nowrap",height:24},children:[(0,m.jsx)(j.m_,{content:"Collapse",children:(0,m.jsx)(j.$n,{icon:(0,m.jsx)(tZ.A,{}),style:{height:24},type:"primary",theme:"solid",onMouseDown:e=>{a.executeCommand("COLLAPSE")}})}),(0,m.jsx)(j.m_,{content:"Expand",children:(0,m.jsx)(j.$n,{icon:(0,m.jsx)(tG.A,{}),style:{height:24},type:"primary",theme:"solid",onMouseDown:e=>{a.executeCommand("EXPAND")}})}),(0,m.jsx)(j.m_,{content:"Create Group",children:(0,m.jsx)(j.$n,{icon:(0,m.jsx)(t0,{size:14}),style:{height:24},type:"primary",theme:"solid",onClick:()=>{a.executeCommand(tL.oh.Group)}})}),(0,m.jsx)(j.m_,{content:"Copy",children:(0,m.jsx)(j.$n,{icon:(0,m.jsx)(tW.A,{}),style:{height:24},type:"primary",theme:"solid",onClick:()=>{a.executeCommand("COPY")}})}),(0,m.jsx)(j.m_,{content:"Delete",children:(0,m.jsx)(j.$n,{type:"primary",theme:"solid",icon:(0,m.jsx)(tX.A,{}),style:{height:24},onClick:()=>{a.executeCommand("DELETE")}})})]})}),(0,m.jsx)("div",{children:r})]})},rc=g.createContext({}),rp=g.createContext({visible:!1,setNodeRender:()=>{}}),rh=g.createContext(!1);var ru=r(1725);let rm=E.Ay.div`
  align-items: flex-start;
  background-color: #fff;
  border: 1px solid rgba(6, 7, 9, 0.15);
  border-radius: 8px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 4px 12px 0 rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  min-width: 360px;
  width: 100%;
  height: auto;

  &.selected {
    border: 1px solid #4e40e5;
  }
`,rg=()=>(0,m.jsx)(ru.A,{style:{position:"absolute",color:"red",left:-6,top:-6,zIndex:1,background:"white",borderRadius:8}}),rx=e=>{let{children:t,isScrollToView:r=!1}=e,i=rO(),{selected:a,startDrag:n,ports:s,selectNode:o,nodeRef:l,onFocus:d,onBlur:c}=i,[p,h]=(0,g.useState)(!1),u=(0,g.useContext)(rp),x=i.form,y=(0,J.WDY)(),f=s.map(e=>(0,m.jsx)(J.hDi,{entity:e},e.id));return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(rm,{className:a?"selected":"",ref:l,draggable:!0,onDragStart:e=>{n(e),h(!0)},onClick:e=>{o(e),!p&&(u.setNodeRender(i),r&&function(e,t){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:448,i=t.transform.bounds;e.playground.scrollToView({bounds:i,scrollDelta:{x:r/2,y:0},zoom:1,scrollToCenter:!0})}(y,i.node))},onMouseUp:()=>h(!1),onFocus:d,onBlur:c,"data-node-selected":String(a),style:{outline:(null==x?void 0:x.state.invalid)?"1px solid red":"none"},children:t}),f]})},ry=e=>{let{node:t}=e,r=(0,J.MVE)(),i=r.form,a=(0,g.useCallback)(()=>t.renderData.node||document.body,[]);return(0,m.jsx)(j.sG,{getPopupContainer:a,children:(0,m.jsx)(rc.Provider,{value:r,children:(0,m.jsxs)(rx,{children:[(null==i?void 0:i.state.invalid)&&(0,m.jsx)(rg,{}),null==i?void 0:i.render()]})})})},rf=()=>(0,m.jsx)("svg",{width:"24",height:"24",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,m.jsxs)("g",{id:"add",children:[(0,m.jsx)("path",{id:"background",fill:"#ffffff",fillRule:"evenodd",stroke:"none",d:"M 24 12 C 24 5.372583 18.627417 0 12 0 C 5.372583 0 -0 5.372583 -0 12 C -0 18.627417 5.372583 24 12 24 C 18.627417 24 24 18.627417 24 12 Z"}),(0,m.jsx)("path",{id:"content",fill:"currentColor",fillRule:"evenodd",stroke:"none",d:"M 22 12.005 C 22 6.482153 17.522848 2.004999 12 2.004999 C 6.477152 2.004999 2 6.482153 2 12.005 C 2 17.527847 6.477152 22.004999 12 22.004999 C 17.522848 22.004999 22 17.527847 22 12.005 Z"}),(0,m.jsx)("path",{id:"cross",fill:"#ffffff",stroke:"none",d:"M 11.411996 16.411797 C 11.411996 16.736704 11.675362 17 12.00023 17 C 12.325109 17 12.588474 16.736704 12.588474 16.411797 L 12.588474 12.58826 L 16.41201 12.58826 C 16.736919 12.58826 17.000216 12.324894 17.000216 12.000015 C 17.000216 11.675147 16.736919 11.411781 16.41201 11.411781 L 12.588474 11.411781 L 12.588474 7.588234 C 12.588474 7.263367 12.325109 7 12.00023 7 C 11.675362 7 11.411996 7.263367 11.411996 7.588234 L 11.411996 11.411781 L 7.588449 11.411781 C 7.263581 11.411781 7.000215 11.675147 7.000215 12.000015 C 7.000215 12.324894 7.263581 12.58826 7.588449 12.58826 L 11.411996 12.58826 L 11.411996 16.411797 Z"})]})}),rj=e=>{let{line:t,selected:r,hovered:i,color:a}=e,n=(e=>{let t=(0,J.rJT)(),{line:r,selected:i=!1,hovered:a}=e;return!r.disposed&&!t.config.readonly&&(!!i||!!a)})({line:t,selected:r,hovered:i}),s=(0,J.h1n)(tP.rV),o=(0,J.h1n)(J.Vo_),l=(0,J.h1n)(J.Z4G),d=(0,J.h1n)(J.GHE),c=(0,J.h1n)(J.kIp),{fromPort:p,toPort:h}=t,u=(0,g.useCallback)(async()=>{let e={x:(t.position.from.x+t.position.to.x)/2,y:(t.position.from.y+t.position.to.y)/2},r=tP.ld.getContainerNode({fromPort:p}),i=await s.singleSelectNodePanel({position:e,containerNode:r,panelProps:{enableScrollClose:!0}});if(!i)return;let{nodeType:a,nodeJSON:n}=i,u=tP.ld.adjustNodePosition({nodeType:a,position:e,fromPort:p,toPort:h,containerNode:r,document:o,dragService:l}),m=o.createWorkflowNodeByType(a,u,n??{},null==r?void 0:r.id);p&&h&&tP.ld.subNodesAutoOffset({node:m,fromPort:p,toPort:h,containerNode:r,historyService:c,dragService:l,linesManager:d}),await (0,J.cbG)(20),tP.ld.buildLine({fromPort:p,node:m,toPort:h,linesManager:d}),t.dispose()},[]);return n?(0,m.jsx)("div",{className:"line-add-button",style:{left:"50%",top:"50%",color:a},"data-testid":"sdk.workflow.canvas.line.add","data-line-id":t.id,onClick:u,children:(0,m.jsx)(rf,{})}):(0,m.jsx)(m.Fragment,{})},rv=()=>(0,m.jsx)("div",{className:"node-placeholder","data-testid":"workflow.detail.node-panel.placeholder",children:(0,m.jsx)(j.EA,{className:"node-placeholder-skeleton",loading:!0,active:!0,placeholder:(0,m.jsxs)("div",{className:"",children:[(0,m.jsxs)("div",{className:"node-placeholder-hd",children:[(0,m.jsx)(j.EA.Avatar,{shape:"square",className:"node-placeholder-avatar"}),(0,m.jsx)(j.EA.Title,{style:{width:141}})]}),(0,m.jsxs)("div",{className:"node-placeholder-content",children:[(0,m.jsxs)("div",{className:"node-placeholder-footer",children:[(0,m.jsx)(j.EA.Title,{style:{width:85}}),(0,m.jsx)(j.EA.Title,{style:{width:241}})]}),(0,m.jsx)(j.EA.Title,{style:{width:220}})]})]})})}),rb=E.Ay.div`
  width: 100%;
  height: 32px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 19px;
  padding: 0 15px;
  &:hover {
    background-color: hsl(252deg 62% 55% / 9%);
    color: hsl(252 62% 54.9%);
  }
`,rw=E.Ay.div`
  font-size: 12px;
  margin-left: 10px;
`;function rA(e){return(0,m.jsxs)(rb,{onClick:e.disabled?void 0:e.onClick,style:e.disabled?{opacity:.3}:{},children:[(0,m.jsx)("div",{style:{fontSize:14},children:e.icon}),(0,m.jsx)(rw,{children:e.label})]})}let rC=E.Ay.div`
  max-height: 500px;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`,rE=e=>{let{onSelect:t}=e,r=(0,J.WDY)();return(0,m.jsx)(rC,{style:{width:180},children:iH.map(e=>{var i,a;return(0,m.jsx)(rA,{disabled:!((null==(i=e.canAdd)?void 0:i.call(e,r))??!0),icon:(0,m.jsx)("img",{style:{width:10,height:10,borderRadius:4},src:null==(a=e.info)?void 0:a.icon}),label:e.type,onClick:i=>{var a;let n;return n=null==(a=e.onAdd)?void 0:a.call(e,r),void t({nodeType:e.type,selectEvent:i,nodeJSON:n})}},e.type)})})},r$=e=>{let{onSelect:t,position:r,onClose:i,panelProps:a}=e,{enableNodePlaceholder:n}=a;return(0,m.jsx)(j.AM,{trigger:"click",visible:!0,onVisibleChange:e=>e?null:i(),content:(0,m.jsx)(rE,{onSelect:t}),placement:"right",popupAlign:{offset:[30,0]},overlayStyle:{padding:0},children:(0,m.jsx)("div",{style:n?{position:"absolute",top:r.y-61.5,left:r.x,width:360,height:100}:{position:"absolute",top:r.y,left:r.x,width:0,height:0},children:n&&(0,m.jsx)(rv,{})})})};class rI{get value(){return this.innerValue}setValue(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.initialized&&e!==this.innerValue&&(this.innerValue=e,this.syncEditorValue(),this.emitter.fire({type:"change",value:this.innerValue}))}set element(e){this.initialized||(this.editor=e)}get element(){return this.editor}setFocus(e){this.initialized&&(e&&!this.focused?this.editor.focus():!e&&this.focused&&(this.editor.blur(),this.deselect(),this.emitter.fire({type:"blur"})))}selectEnd(){if(!this.initialized)return;let e=this.editor.value.length;this.editor.setSelectionRange(e,e)}get focused(){return document.activeElement===this.editor}deselect(){let e=window.getSelection();e&&e.removeAllRanges()}get initialized(){return!!this.editor}syncEditorValue(){this.initialized&&(this.editor.value=this.innerValue)}constructor(){this.innerValue="",this.emitter=new J.vli,this.on=this.emitter.event}}var rk=r(9832);let rT=e=>{var t;let{node:r,deleteNode:i}=e,[a,n]=(0,g.useState)(!0),s=(0,J.WDY)(),o=r.getNodeRegistry(),l=(0,J.h1n)(tD.fZ),d=(0,J.h1n)(J.rmK),c=(0,J.h1n)(J.Z4G),p=l.canMoveOutContainer(r),h=(0,g.useCallback)(()=>{n(!1),requestAnimationFrame(()=>{n(!0)})},[]),u=(0,g.useCallback)(async e=>{e.stopPropagation();let t=r.parent;l.moveOutContainer({node:r}),await l.clearInvalidLines({dragNode:r,sourceParent:t}),h(),await (0,J.cbG)(16),d.selectNode(r),c.startDragSelectedNodes(e)},[l,r,h]),x=(0,g.useCallback)(e=>{let t=new tV(s),i=new tQ(s),a=t.toClipboardData([r]);i.apply(a),e.stopPropagation()},[s,r]),y=(0,g.useCallback)(e=>{i(),e.stopPropagation()},[s,r]);if(a)return(0,m.jsx)(j.ms,{trigger:"hover",position:"bottomRight",render:(0,m.jsxs)(j.ms.Menu,{children:[p&&(0,m.jsx)(j.ms.Item,{onClick:u,children:"Move out"}),(0,m.jsx)(j.ms.Item,{onClick:x,disabled:!0===o.meta.copyDisable,children:"Create Copy"}),(0,m.jsx)(j.ms.Item,{onClick:y,disabled:!!((null==(t=o.canDelete)?void 0:t.call(o,s,r))||o.meta.deleteDisable),children:"Delete"})]}),children:(0,m.jsx)(j.K0,{color:"secondary",size:"small",theme:"borderless",icon:(0,m.jsx)(rk.A,{}),onClick:e=>e.stopPropagation()})})},rS=e=>{let{node:t,focused:r,deleteNode:i}=e;return(0,m.jsx)("div",{className:`workflow-comment-more-button ${r?"workflow-comment-more-button-focused":""}`,children:(0,m.jsx)(rT,{node:t,deleteNode:i})})},rN=e=>{let{model:t,style:r,onChange:i}=e,a=(0,J.rJT)(),n=(0,g.useRef)(null),s=t.value||t.focused?void 0:"Enter a comment...";return(0,g.useEffect)(()=>{let e=t.on(e=>{"change"===e.type&&(null==i||i(t.value))});return()=>e.dispose()},[t,i]),(0,g.useEffect)(()=>{n.current&&(t.element=n.current)},[n]),(0,m.jsxs)("div",{className:"workflow-comment-editor",children:[(0,m.jsx)("p",{className:"workflow-comment-editor-placeholder",children:s}),(0,m.jsx)("textarea",{className:"workflow-comment-editor-textarea",ref:n,style:r,readOnly:a.config.readonly,onChange:e=>{let{value:r}=e.target;t.setValue(r)},onFocus:()=>{t.setFocus(!0)},onBlur:()=>{t.setFocus(!1)}})]})},rP=e=>{let{model:t,stopEvent:r=!0,style:i}=e,a=(0,J.rJT)(),{startDrag:n,onFocus:s,onBlur:o,selectNode:l}=(0,J.MVE)();return(0,m.jsx)("div",{className:"workflow-comment-drag-area","data-flow-editor-selectable":"false",draggable:!0,style:i,onMouseDown:e=>{r&&(e.preventDefault(),e.stopPropagation()),t.setFocus(!1),n(e),l(e),a.node.focus()},onFocus:s,onBlur:o})},rB=e=>{let{model:t,focused:r,overflow:i}=e,a=(0,J.rJT)(),{selectNode:n}=(0,J.MVE)(),[s,o]=(0,g.useState)(!1);return(0,g.useEffect)(()=>{r||o(!1)},[r]),(0,m.jsx)("div",{className:"workflow-comment-content-drag-area",onMouseDown:e=>{if(s)return;e.preventDefault(),e.stopPropagation(),t.setFocus(!1),n(e),a.node.focus();let r=e.clientX,i=e.clientY,l=e=>{let t=e.clientX-r,a=e.clientY-i;5>Math.abs(t)&&5>Math.abs(a)&&o(!0),document.removeEventListener("mouseup",l),document.removeEventListener("click",l)};document.addEventListener("mouseup",l),document.addEventListener("click",l)},onWheel:e=>{let r=t.element;if(s||!i||!r)return;e.stopPropagation();let a=r.scrollHeight-r.clientHeight,n=Math.min(Math.max(r.scrollTop+e.deltaY,0),a);r.scroll(0,n)},style:{display:s?"none":void 0},children:(0,m.jsx)(rP,{style:{position:"relative",width:"100%",height:"100%"},model:t,stopEvent:!1})})},rL=e=>{let{focused:t,children:r,style:i}=e;return(0,m.jsx)("div",{className:"workflow-comment-container","data-flow-editor-selectable":"false",style:{outline:t?"1px solid #FF811A":"1px solid #F2B600",backgroundColor:t?"#FFF3EA":"#FFFBED",scrollbarWidth:"thin",scrollbarColor:"rgb(159 159 158 / 65%) transparent","&:WebkitScrollbar":{width:"4px"},"&::WebkitScrollbarTrack":{background:"transparent"},"&::WebkitScrollbarThumb":{backgroundColor:"rgb(159 159 158 / 65%)",borderRadius:"20px",border:"2px solid transparent"},...i},children:r})},rD=e=>{let{model:t,onResize:r,getDelta:i,style:a}=e,n=(0,J.rJT)(),{selectNode:s}=(0,J.MVE)();return(0,m.jsx)("div",{className:"workflow-comment-resize-area",style:a,"data-flow-editor-selectable":"false",onMouseDown:e=>{if(e.preventDefault(),e.stopPropagation(),!r)return;let{resizing:a,resizeEnd:o}=r();t.setFocus(!1),s(e),n.node.focus();let l=e.clientX,d=e.clientY,c=e=>{let t=e.clientX-l,r=e.clientY-d,n=null==i?void 0:i({x:t,y:r});n&&a&&a(n)},p=()=>{o(),document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",p),document.removeEventListener("click",p)};document.addEventListener("mousemove",c),document.addEventListener("mouseup",p),document.addEventListener("click",p)}})},rM=e=>{let{model:t,overflow:r,onResize:i}=e;return(0,m.jsxs)("div",{style:{zIndex:999},children:[(0,m.jsx)(rP,{style:{position:"absolute",left:-10,top:10,width:20,height:"calc(100% - 20px)"},model:t}),(0,m.jsx)(rP,{style:{position:"absolute",right:-10,top:10,height:"calc(100% - 20px)",width:r?10:20},model:t}),(0,m.jsx)(rP,{style:{position:"absolute",top:-10,left:10,width:"calc(100% - 20px)",height:20},model:t}),(0,m.jsx)(rP,{style:{position:"absolute",bottom:-10,left:10,width:"calc(100% - 20px)",height:20},model:t}),(0,m.jsx)(rD,{style:{position:"absolute",left:0,top:0,cursor:"nwse-resize"},model:t,getDelta:e=>{let{x:t,y:r}=e;return{top:r,right:0,bottom:0,left:t}},onResize:i}),(0,m.jsx)(rD,{style:{position:"absolute",right:0,top:0,cursor:"nesw-resize"},model:t,getDelta:e=>{let{x:t,y:r}=e;return{top:r,right:t,bottom:0,left:0}},onResize:i}),(0,m.jsx)(rD,{style:{position:"absolute",right:0,bottom:0,cursor:"nwse-resize"},model:t,getDelta:e=>{let{x:t,y:r}=e;return{top:0,right:t,bottom:r,left:0}},onResize:i}),(0,m.jsx)(rD,{style:{position:"absolute",left:0,bottom:0,cursor:"nesw-resize"},model:t,getDelta:e=>{let{x:t,y:r}=e;return{top:0,right:0,bottom:r,left:t}},onResize:i})]})},r_=e=>{let{model:t}=e,r=(0,J.rJT)(),{selectNode:i}=(0,J.MVE)();return(0,m.jsx)("div",{className:"workflow-comment-blank-area h-full w-full",onMouseDown:e=>{e.preventDefault(),e.stopPropagation(),t.setFocus(!1),i(e),r.node.focus()},onClick:e=>{t.setFocus(!0),t.selectEnd()},children:(0,m.jsx)(rP,{style:{position:"relative",width:"100%",height:"100%"},model:t,stopEvent:!1})})},rR=e=>{let{node:t}=e,r=(()=>{let e=(0,J.Ojz)(),{selected:t}=(0,J.MVE)(),r=e.getData(J.LO).getFormModel(),i=(0,g.useMemo)(()=>new rI,[]);return(0,g.useEffect)(()=>{t||i.setFocus(t)},[t,i]),(0,g.useEffect)(()=>{let e=r.getValueIn("note");i.setValue(e),i.selectEnd()},[r,i]),(0,g.useEffect)(()=>{let e=r.onFormValuesChange(e=>{let{name:t}=e;if("note"!==t)return;let a=r.getValueIn("note");i.setValue(a)});return()=>e.dispose()},[r,i]),i})(),{selected:i,selectNode:a,nodeRef:n,deleteNode:s}=(0,J.MVE)(),o=t.getData(J.LO).getFormModel(),l=null==o?void 0:o.formControl,{width:d,height:c,onResize:p}=(()=>{let e=(0,J.QSU)(),t=e.getNodeMeta(),r=(0,J.rJT)(),i=(0,J.h1n)(J.kIp),{size:a={width:240,height:150}}=t,n=e.getData(J.hZp),s=e.getData(J.LO).getFormModel(),o=s.getValueIn("size"),[l,d]=(0,g.useState)((null==o?void 0:o.width)??a.width),[c,p]=(0,g.useState)((null==o?void 0:o.height)??a.height);(0,g.useEffect)(()=>{s.getValueIn("size")||s.setValueIn("size",{width:l,height:c})},[s,l,c]),(0,g.useEffect)(()=>{let e=s.onFormValuesChange(e=>{let{name:t}=e;if("size"!==t)return;let r=s.getValueIn("size");r&&(d(r.width),p(r.height))});return()=>e.dispose()},[s]);let h=(0,g.useCallback)(()=>{let t={width:l,height:c,originalWidth:l,originalHeight:c,positionX:n.position.x,positionY:n.position.y,offsetX:0,offsetY:0};return{resizing:e=>{if(!t)return;let{zoom:i}=r.config,a=e.top/i,s=e.right/i,o=e.bottom/i,l=e.left/i,c=Math.max(120,t.originalWidth+s-l),h=Math.max(80,t.originalHeight+o-a),u=(l>0||s<0)&&c<=120?t.offsetX:l/2+s/2,m=(a>0||o<0)&&h<=80?t.offsetY:a,g=t.positionX+u,x=t.positionY+m;t.width=c,t.height=h,t.offsetX=u,t.offsetY=m,d(c),p(h),n.update({position:{x:g,y:x}})},resizeEnd:()=>{i.transact(()=>{i.pushOperation({type:J.ot3.dragNodes,value:{ids:[e.id],value:[{x:t.positionX+t.offsetX,y:t.positionY+t.offsetY}],oldValue:[{x:t.positionX,y:t.positionY}]}},{noApply:!0}),s.setValueIn("size",{width:t.width,height:t.height})})}}},[e,l,c,n,r,s,i]);return{width:l,height:c,onResize:h}})(),{overflow:h,updateOverflow:u}=(e=>{let{model:t,height:r}=e,i=(0,J.rJT)(),[a,n]=(0,g.useState)(!1),s=(0,g.useCallback)(()=>!!t.element&&t.element.scrollHeight>t.element.clientHeight,[t,r,i]),o=(0,g.useCallback)(()=>{n(s())},[s]);return(0,g.useEffect)(()=>{o()},[r,o]),(0,g.useEffect)(()=>{let e=t.on(e=>{"change"===e.type&&o()});return()=>{e.dispose()}},[t,o]),{overflow:a,updateOverflow:o}})({model:r,height:c});return(0,m.jsx)("div",{className:"workflow-comment",style:{width:d,height:c},ref:n,"data-node-selected":String(i),onMouseEnter:u,onMouseDown:e=>{setTimeout(()=>{a(e)},20)},children:(0,m.jsx)(J.lVW,{control:l,children:(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(rL,{focused:i,style:{height:c},children:(0,m.jsx)(J.D0$,{name:"note",children:e=>{let{field:a}=e;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(rN,{model:r,value:a.value,onChange:a.onChange}),(0,m.jsx)(r_,{model:r}),(0,m.jsx)(rB,{model:r,focused:i,overflow:h}),(0,m.jsx)(rS,{node:t,focused:i,deleteNode:s})]})}})}),(0,m.jsx)(rM,{model:r,overflow:h,onResize:p})]})})})};function rO(){return(0,g.useContext)(rc)}function rU(){return(0,g.useContext)(rh)}let rQ=E.Ay.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: rgba(0, 0, 0, 0.02);
  padding: 0 12px 12px;
`,rz=E.Ay.div`
  color: var(--semi-color-text-2);
  font-size: 12px;
  line-height: 20px;
  padding: 0px 4px;
  word-break: break-all;
  white-space: break-spaces;
`;function rq(e){var t;let{node:r,expanded:i}=rO(),a=rU(),n=r.getNodeRegistry();return(0,m.jsx)(rQ,{children:i?(0,m.jsxs)(m.Fragment,{children:[a&&(0,m.jsx)(rz,{children:null==(t=n.info)?void 0:t.description}),e.children]}):void 0})}var rV=r(3613);let rF=E.Ay.div`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 6px;
`;function rY(e){let{name:t,type:r,isArray:i,className:a}=e,n=i?rV._A[r]:rV.LT[r];return(0,m.jsx)(j.m_,{content:(0,m.jsxs)(rF,{children:[n," ",r]}),children:(0,m.jsxs)(j.vw,{color:"white",className:a,style:{padding:4,maxWidth:450},children:[n,t&&(0,m.jsxs)("span",{style:{display:"inline-block",marginLeft:4,marginTop:-1,overflow:"hidden",textOverflow:"ellipsis"},children:[" ",t]})]})})}let rH=E.Ay.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  border-top: 1px solid var(--semi-color-border);
  padding: 8px 0 0;
  width: 100%;

  :global(.semi-tag .semi-tag-content) {
    font-size: 10px;
  }
`;function rJ(){return rU()?null:(0,m.jsx)(J.D0$,{name:"outputs",children:e=>{var t;let{field:r}=e,i=null==(t=r.value)?void 0:t.properties;if(i){let e=Object.keys(i).map(e=>{let t=i[e];return(0,m.jsx)(rY,{name:e,type:t.type},e)});return(0,m.jsx)(rH,{children:e})}return(0,m.jsx)(m.Fragment,{})}})}let rK=E.Ay.div`
  background-color: var(--semi-color-fill-0);
  border-radius: var(--semi-border-radius-small);
  padding-left: 12px;
  width: 100%;
  min-height: 24px;
  line-height: 24px;
  display: flex;
  align-items: center;
  &.has-error {
    outline: red solid 1px;
  }
`,rZ=e=>(0,m.jsxs)(rK,{className:e.hasError?"has-error":"",children:[e.value,void 0===e.value||""===e.value?(0,m.jsx)("span",{style:{color:"var(--semi-color-text-2)"},children:e.placeholder||"--"}):null]});function rG(e){return(0,m.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em",viewBox:"0 0 16 16",...e,children:(0,m.jsx)("path",{fill:"currentColor",fillRule:"evenodd",d:"M5.581 4.49A2.75 2.75 0 0 1 8.319 2h.931a.75.75 0 0 1 0 1.5h-.931a1.25 1.25 0 0 0-1.245 1.131l-.083.869H9.25a.75.75 0 0 1 0 1.5H6.849l-.43 4.51A2.75 2.75 0 0 1 3.681 14H2.75a.75.75 0 0 1 0-1.5h.931a1.25 1.25 0 0 0 1.245-1.132L5.342 7H3.75a.75.75 0 0 1 0-1.5h1.735zM9.22 9.22a.75.75 0 0 1 1.06 0l1.22 1.22l1.22-1.22a.75.75 0 1 1 1.06 1.06l-1.22 1.22l1.22 1.22a.75.75 0 1 1-1.06 1.06l-1.22-1.22l-1.22 1.22a.75.75 0 1 1-1.06-1.06l1.22-1.22l-1.22-1.22a.75.75 0 0 1 0-1.06",clipRule:"evenodd"})})}function rW(e){let{value:t,onChange:r,readonly:i,hasError:a,style:n}=e;return i?(0,m.jsx)(rZ,{value:t,hasError:a}):(0,m.jsx)(j.pd,{value:t,onChange:r,validateStatus:a?"error":void 0,style:n})}function rX(e){let{value:t,onChange:r,readonly:i,literal:a,icon:n}=e;if(a)return(0,m.jsx)(rW,{value:t,onChange:r,readonly:i});let s="object"==typeof t&&"expression"===t.type;return(0,m.jsxs)("div",{style:{display:"flex",maxWidth:300},children:[s?(0,m.jsx)(rV.KG,{value:t.content,hasError:e.hasError,style:{flexGrow:1},onChange:e=>r({type:"expression",content:e}),readonly:i}):(0,m.jsx)(rW,{value:t,onChange:r,hasError:e.hasError,readonly:i,style:{flexGrow:1,outline:e.hasError?"1px solid red":void 0}}),!i&&(n||(0,m.jsx)(j.$n,{theme:"borderless",icon:(0,m.jsx)(rG,{}),onClick:()=>{s?r(t.content):r({content:t,type:"expression"})}}))]})}let{Text:r0}=j.o5;function r1(e){let{children:t,name:r,required:i,description:a,type:n,labelWidth:s}=e,o=(0,g.useCallback)(e=>(0,m.jsxs)("div",{style:{width:"0",display:"flex",flex:"1"},children:[(0,m.jsx)(r0,{style:{width:"100%"},ellipsis:{showTooltip:!!e},children:r}),i&&(0,m.jsx)("span",{style:{color:"#f93920",paddingLeft:"2px"},children:"*"})]}),[]);return(0,m.jsxs)("div",{style:{fontSize:12,marginBottom:6,width:"100%",position:"relative",display:"flex",justifyContent:"center",alignItems:"center",gap:8},children:[(0,m.jsxs)("div",{style:{justifyContent:"center",alignItems:"center",color:"var(--semi-color-text-0)",width:s||118,position:"relative",display:"flex",columnGap:4,flexShrink:0},children:[(0,m.jsx)(rY,{className:"form-item-type-tag",type:n}),a?(0,m.jsx)(j.m_,{content:a,children:o()}):o(!0)]}),(0,m.jsx)("div",{style:{flexGrow:1,minWidth:0},children:t})]})}function r2(){let e=!rU();return(0,m.jsx)(J.D0$,{name:"inputs",children:t=>{var r,i;let{field:a}=t,n=(null==(r=a.value)?void 0:r.required)||[],s=null==(i=a.value)?void 0:i.properties;if(!s)return(0,m.jsx)(m.Fragment,{});let o=Object.keys(s).map(t=>{let r=s[t];return(0,m.jsx)(J.D0$,{name:`inputsValues.${t}`,defaultValue:r.default,children:i=>{let{field:a,fieldState:s}=i;return(0,m.jsxs)(r1,{name:t,type:r.type,required:n.includes(t),children:[(0,m.jsx)(rX,{value:a.value,onChange:a.onChange,readonly:e,hasError:Object.keys((null==s?void 0:s.errors)||{}).length>0}),(0,m.jsx)(tk,{errors:null==s?void 0:s.errors})]})}},t)});return(0,m.jsx)(m.Fragment,{children:o})}})}var r5=r(5434),r6=r(3891);let r8=E.Ay.div`
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  column-gap: 8px;
  border-radius: 8px 8px 0 0;
  cursor: move;

  background: linear-gradient(#f2f2ff 0%, rgba(0, 0, 0, 0.02) 100%);
  overflow: hidden;

  padding: 8px;
`,r3=E.Ay.div`
  font-size: 20px;
  flex: 1;
  width: 0;
`,r9=E.Ay.img`
  width: 24px;
  height: 24px;
  scale: 0.8;
  border-radius: 4px;
`,r4=E.Ay.div`
  display: flex;
  align-items: center;
  column-gap: 4px;
`,{Text:r7}=j.o5;function ie(){var e;let t,{node:r,expanded:i,toggleExpand:a,readonly:n,deleteNode:s}=rO(),o=rU();return(0,m.jsxs)(r8,{children:[(t=null==(e=r.getNodeRegistry().info)?void 0:e.icon)?(0,m.jsx)(r9,{src:t}):null,(0,m.jsx)(r3,{children:(0,m.jsx)(J.D0$,{name:"title",children:e=>{let{field:{value:t,onChange:r},fieldState:i}=e;return(0,m.jsxs)("div",{style:{height:24},children:[(0,m.jsx)(r7,{ellipsis:{showTooltip:!0},children:t}),(0,m.jsx)(tk,{errors:null==i?void 0:i.errors})]})}})}),r.renderData.expandable&&!o&&(0,m.jsx)(j.$n,{type:"primary",icon:i?(0,m.jsx)(r5.A,{}):(0,m.jsx)(r6.A,{}),size:"small",theme:"borderless",onClick:e=>{a(),e.stopPropagation()}}),n?void 0:(0,m.jsx)(r4,{children:(0,m.jsx)(rT,{node:r,deleteNode:s})})]})}var it=r(9217),ir=r(5369);let ii=["object","boolean","array","string","integer","number"],ia=e=>{let{value:t,disabled:r}=e,i=rV.LT[t];return(0,m.jsx)(j.ms,{trigger:"hover",position:"bottomRight",disabled:r,render:(0,m.jsx)(j.ms.Menu,{children:ii.map(t=>(0,m.jsxs)(j.ms.Item,{onClick:()=>{var r;null==(r=e.onChange)||r.call(e,t)},children:[rV.LT[t],(0,m.jsx)("span",{style:{paddingLeft:"4px"},children:t})]},t))}),children:(0,m.jsx)(j.vw,{color:"white",style:e.style,onClick:e=>{e.stopPropagation(),e.preventDefault()},children:i})})},is=E.Ay.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  margin-bottom: 6px;
`,io=E.Ay.div`
  width: 300px;
  margin-right: 10px;
  position: relative;
`,il=e=>{let{value:t,disabled:r}=e,[i,a]=(0,g.useState)(e.propertyKey),n=(r,i)=>{t[r]=i,e.onChange(t,e.propertyKey)};return(0,g.useLayoutEffect)(()=>{a(e.propertyKey)},[e.propertyKey]),(0,m.jsxs)(is,{children:[(0,m.jsxs)(io,{children:[(0,m.jsx)(ia,{value:t.type,disabled:r,style:{position:"absolute",top:6,left:4,zIndex:1},onChange:e=>n("type",e)}),(0,m.jsx)(j.pd,{value:i,disabled:r,onChange:e=>a(e.trim()),onBlur:()=>{""!==i?e.onChange(t,e.propertyKey,i):a(e.propertyKey)},style:{paddingLeft:26}})]}),e.useFx?(0,m.jsx)(rV.KG,{value:t.default,readonly:r,onChange:e=>n("default",e),style:{flexGrow:1,height:32}}):(0,m.jsx)(j.pd,{disabled:r,value:t.default,onChange:e=>n("default",e)}),e.onDelete&&!r&&(0,m.jsx)(j.$n,{theme:"borderless",icon:(0,m.jsx)(ir.A,{}),onClick:e.onDelete})]})},id=e=>{let t=e.value||{},{readonly:r}=rO(),[i,a]=(0,g.useState)({key:"",value:{type:"string"}}),[n,s]=(0,g.useState)(),o=()=>{a({key:"",value:{type:"string"}}),s(!1)},l=(r,i,a)=>{let n={...t};a?(delete n[i],n[a]=r):n[i]=r,e.onChange(n)};return(0,m.jsxs)(m.Fragment,{children:[Object.keys(e.value||{}).map(i=>{let a=t[i]||{};return(0,m.jsx)(il,{propertyKey:i,useFx:e.useFx,value:a,disabled:r,onChange:l,onDelete:()=>{let r={...t};delete r[i],e.onChange(r)}},i)}),n&&(0,m.jsx)(il,{propertyKey:i.key,value:i.value,useFx:e.useFx,onChange:(e,r,i)=>{i?(i in t||l(e,r,i),o()):a({key:i||r,value:e})},onDelete:()=>{let r=i.key;setTimeout(()=>{let i={...t};delete i[r],e.onChange(i),o()},10)}}),!r&&(0,m.jsx)("div",{children:(0,m.jsx)(j.$n,{theme:"borderless",icon:(0,m.jsx)(it.A,{}),onClick:()=>s(!0),children:"Add"})})]})},ic=E.Ay.div`
  position: absolute;
  right: -12px;
  top: 50%;
`;function ip(){let e=!rU(),[t,r]=(0,g.useState)([]),[i,a]=(0,g.useState)(!1);return(0,g.useEffect)(()=>{(async()=>{a(!0);try{let e=(await ea.queryAllAiClientToolMcps()).map(e=>({label:e.mcpName,value:e.mcpId}));r(e)}catch(e){console.error("获取工具MCP数据失败:",e),r([])}finally{a(!1)}})()},[]),(0,m.jsx)(J.D0$,{name:"inputsValues.toolMcpName.0",children:r=>{var a,n;let{field:s,fieldState:o}=r;return(0,m.jsxs)(r1,{name:"MCP类型",type:"string",required:!0,labelWidth:80,children:[(0,m.jsx)(j.l6,{placeholder:i?"加载中...":"请选择MCP类型",style:{width:"100%"},value:(null==(a=s.value)?void 0:a.value)||"",onChange:e=>{var t;return s.onChange({key:(null==(t=s.value)?void 0:t.key)||`tool_mcp_select_${Date.now()}`,value:String(e||"")})},disabled:e||i,optionList:t,loading:i}),(0,m.jsx)(ic,{"data-port-id":null==(n=s.value)?void 0:n.key,"data-port-type":"output"})]})}})}let ih={render:e=>{let{form:t}=e;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(ie,{}),(0,m.jsx)(rq,{children:(0,m.jsx)(ip,{})})]})},validateTrigger:J.N0$.onChange,validate:{title:e=>{let{value:t}=e;return t?void 0:"Title is required"},"inputsValues.toolMcpName.*":e=>{let{value:t}=e;if(!(null==t?void 0:t.value))return"MCP类型 is required"}}},iu=0,im=r.p+"static/image/icon-start.8353312d.jpg",ig={render:e=>{let{form:t}=e;return rU()?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(ie,{}),(0,m.jsx)(rq,{children:(0,m.jsx)(J.D0$,{name:"outputs",render:e=>{let{field:{value:t,onChange:r}}=e;return(0,m.jsx)(m.Fragment,{children:(0,m.jsx)(rV.lA,{value:t,onChange:e=>r(e)})})}})})]}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(ie,{}),(0,m.jsx)(rq,{children:(0,m.jsx)(rJ,{})})]})},validateTrigger:J.N0$.onChange,validate:{title:e=>{let{value:t}=e;return t?void 0:"Title is required"}}},ix=E.Ay.div`
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #52c41a;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #52c41a;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background: #73d13d;
    box-shadow: 0 0 0 2px #73d13d;
  }
`;function iy(){let e=!rU(),[t,r]=(0,g.useState)([]),[i,a]=(0,g.useState)(!1);return(0,g.useEffect)(()=>{(async()=>{try{a(!0);let e=(await ei.queryAllAiClientSystemPrompts()).map(e=>({label:e.promptName,value:e.promptId}));r(e)}catch(e){console.error("获取系统提示词列表失败:",e),r([])}finally{a(!1)}})()},[]),(0,m.jsx)(J.D0$,{name:"inputsValues.promptName.0",children:r=>{var a,n;let{field:s,fieldState:o}=r;return(0,m.jsxs)(r1,{name:"系统提示词",type:"string",required:!0,labelWidth:80,children:[(0,m.jsx)(j.l6,{placeholder:i?"加载中...":"请选择系统提示词",style:{width:"100%"},value:(null==(a=s.value)?void 0:a.value)||"",onChange:e=>{var t;return s.onChange({key:(null==(t=s.value)?void 0:t.key)||"",value:String(e||"")})},disabled:e||i,loading:i,optionList:t}),(0,m.jsx)(ix,{"data-port-id":null==(n=s.value)?void 0:n.key,"data-port-type":"output"})]})}})}let ij={render:e=>{let{form:t}=e;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(ie,{}),(0,m.jsx)(rq,{children:(0,m.jsx)(iy,{})})]})},validateTrigger:J.N0$.onChange,validate:{title:e=>{let{value:t}=e;return t?void 0:"Title is required"},"inputsValues.promptName.*":e=>{let{value:t}=e;if(!(null==t?void 0:t.value))return"prompt is required"}}},iv=0,ib=E.Ay.div`
  position: absolute;
  right: -12px;
  top: 50%;
`;function iw(){let e=!rU(),[t,r]=(0,g.useState)([]),[i,a]=(0,g.useState)(!1);return(0,g.useEffect)(()=>{(async()=>{a(!0);try{let e=await en.queryEnabledAiClientModels(),t=[{label:"请选择模型",value:"",disabled:!0},...e.map(e=>({label:e.modelUsage,value:e.modelId}))];r(t)}catch(e){console.error("获取模型数据失败:",e),r([{label:"请选择模型",value:"",disabled:!0}])}finally{a(!1)}})()},[]),(0,m.jsx)(J.D0$,{name:"inputsValues.modelName.0",children:r=>{var a,n;let{field:s,fieldState:o}=r;return(0,m.jsxs)(r1,{name:"模型",type:"string",required:!0,labelWidth:80,children:[(0,m.jsx)(j.l6,{placeholder:i?"加载中...":"请选择模型",style:{width:"100%"},value:(null==(a=s.value)?void 0:a.value)||"",onChange:e=>{var t;""!==e&&s.onChange({key:(null==(t=s.value)?void 0:t.key)||"",value:String(e||"")})},disabled:e||i,optionList:t,loading:i,showClear:!0}),(0,m.jsx)(ib,{"data-port-id":null==(n=s.value)?void 0:n.key,"data-port-type":"output"})]})}})}let iA={render:e=>{let{form:t}=e;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(ie,{}),(0,m.jsx)(rq,{children:(0,m.jsx)(iw,{})})]})},validateTrigger:J.N0$.onChange,validate:{title:e=>{let{value:t}=e;return t?void 0:"Title is required"},"inputsValues.modelName.*":e=>{let{value:t}=e;if(!(null==t?void 0:t.value))return"model is required"}}},iC=0,iE=r.p+"static/image/icon-end.ac3dc81e.jpg",i$={render:e=>{let{form:t}=e;return rU()?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(ie,{}),(0,m.jsxs)(rq,{children:[(0,m.jsx)(J.D0$,{name:"outputs.properties",render:e=>{let{field:{value:t,onChange:r},fieldState:i}=e;return(0,m.jsx)(m.Fragment,{children:(0,m.jsx)(id,{value:t,onChange:r,useFx:!0})})}}),(0,m.jsx)(rJ,{})]})]}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(ie,{}),(0,m.jsx)(rq,{children:(0,m.jsx)(rJ,{})})]})},validateTrigger:J.N0$.onChange,validate:{title:e=>{let{value:t}=e;return t?void 0:"Title is required"}}},iI=E.Ay.div`
  position: absolute;
  right: -12px;
  top: 50%;
`;function ik(){let e=!rU(),t=rO(),[r,i]=(0,g.useState)([]),[a,n]=(0,g.useState)(!1),[s,o]=(0,g.useState)(!1);return(0,g.useEffect)(()=>{(async()=>{n(!0),o(!1);try{let e=(await et.queryAllAiClients()).map(e=>({label:e.clientName,value:e.clientId}));i(e)}catch(e){console.error("获取客户端数据失败:",e),o(!0),i([])}finally{n(!1)}})()},[]),(0,m.jsx)(m.Fragment,{children:(0,m.jsx)(J.D0$,{name:"inputsValues.clientName",children:i=>{let{field:n}=i;return(0,m.jsx)(J.D0$,{name:"inputsValues.clientId",children:i=>{let{field:o}=i,l=t.node.getNodeMeta(),d=null==l?void 0:l.inputsValues,c="",p="";if(o.value&&"string"==typeof o.value){c=o.value;let e=r.find(e=>e.value===c);e&&(p=e.label,n.value!==p&&n.onChange(p))}else if(n.value&&"string"==typeof n.value){p=n.value;let e=r.find(e=>e.label===p);e&&(c=e.value,o.onChange(c))}else if(d){if("string"==typeof d.clientId&&d.clientId){c=d.clientId;let e=r.find(e=>e.value===c);e&&(p=e.label,o.value||o.onChange(c),n.value||n.onChange(p))}else if("string"==typeof d.clientName&&d.clientName){p=d.clientName;let e=r.find(e=>e.label===p);e&&(c=e.value,n.value||n.onChange(p),o.value||o.onChange(c))}}return(0,m.jsxs)(r1,{name:"客户端",type:"string",required:!0,labelWidth:80,children:[(0,m.jsx)(j.l6,{placeholder:a?"加载中...":s?"加载失败，请刷新重试":0===r.length?"暂无可用的客户端类型":"请选择客户端类型",style:{width:"100%"},value:c,onChange:e=>{let t=r.find(t=>t.value===e),i=(null==t?void 0:t.label)||"",a=(null==t?void 0:t.value)||"";n.onChange(i),o.onChange(a)},disabled:e||a,optionList:r,loading:a}),e&&(p||c)&&(0,m.jsxs)("div",{style:{marginTop:"4px",fontSize:"12px",color:"#666"},children:[p&&(0,m.jsxs)("div",{children:["客户端名称: ",p]}),c&&(0,m.jsxs)("div",{children:["客户端ID: ",c]})]}),(0,m.jsx)(iI,{"data-port-id":"client-output","data-port-type":"output"})]})}})}})})}let iT=[{label:"通用的",value:"DEFAULT"},{label:"任务分析和状态判断",value:"TASK_ANALYZER_CLIENT"},{label:"具体任务执行",value:"PRECISION_EXECUTOR_CLIENT"},{label:"质量检查和优化",value:"QUALITY_SUPERVISOR_CLIENT"},{label:"智能响应助手",value:"RESPONSE_ASSISTANT"},{label:"工具分析",value:"TOOL_MCP_CLIENT"},{label:"任务规划",value:"PLANNING_CLIENT"},{label:"任务执行",value:"EXECUTOR_CLIENT"}];function iS(){let e=!rU();return(0,m.jsx)(J.D0$,{name:"inputsValues.clientType.0",children:t=>{let{field:r,fieldState:i}=t,a="DEFAULT";return r.value&&("object"==typeof r.value&&r.value.value?a=r.value.value:"string"==typeof r.value&&(a=r.value)),(0,m.jsx)(r1,{name:"客户端类型",type:"string",required:!0,labelWidth:80,children:(0,m.jsx)(j.l6,{placeholder:"请选择客户端配置类型",style:{width:"100%"},value:a,onChange:e=>{var t;return r.onChange({key:(null==(t=r.value)?void 0:t.key)||`client_type_${Date.now()}`,value:e})},disabled:e,optionList:iT})})}})}function iN(){let e=!rU();return(0,m.jsx)(J.D0$,{name:"inputsValues.sequence.0",children:t=>{var r;let{field:i,fieldState:a}=t;return(0,m.jsxs)(r1,{name:"执行序号",type:"number",required:!0,children:[(0,m.jsx)(j.YI,{value:(null==(r=i.value)?void 0:r.value)||1,onChange:e=>{var t;i.onChange({key:(null==(t=i.value)?void 0:t.key)||"",value:Number(e)||1})},disabled:e,min:1,step:1,style:{width:"100%"},placeholder:"请输入执行序号"}),(0,m.jsx)(tk,{errors:null==a?void 0:a.errors})]})}})}function iP(){let e=!rU();return(0,m.jsx)(J.D0$,{name:"inputsValues.stepPrompt.0",children:t=>{var r;let{field:i,fieldState:a}=t;return(0,m.jsxs)(r1,{name:"步骤提示词",type:"string",children:[(0,m.jsx)(j.fs,{value:(null==(r=i.value)?void 0:r.value)||"",onChange:e=>{var t;i.onChange({key:(null==(t=i.value)?void 0:t.key)||"",value:e||""})},disabled:e,style:{width:"100%",minHeight:"120px"},placeholder:"请输入步骤提示词（可选）",rows:6,autosize:{minRows:6,maxRows:12}}),(0,m.jsx)(tk,{errors:null==a?void 0:a.errors})]})}})}let iB={render:e=>{let{form:t}=e;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(ie,{}),(0,m.jsxs)(rq,{children:[(0,m.jsx)(iS,{}),(0,m.jsx)(ik,{}),(0,m.jsx)(iN,{}),(0,m.jsx)(iP,{})]})]})},validateTrigger:J.N0$.onChange,validate:{title:e=>{let{value:t}=e;return t?void 0:"Title is required"},"inputsValues.clientType.*":e=>{let{value:t}=e;if(!(null==t?void 0:t.value))return"请选择客户端配置类型"},"inputsValues.clientName.*":e=>{let{value:t}=e;if(!(null==t?void 0:t.value))return"请选择客户端类型"},"inputsValues.sequence.*":e=>{let{value:t}=e;if(!(null==t?void 0:t.value)||t.value<1)return"执行序号必须大于等于1"}}},iL=0,iD=r.p+"static/image/icon-agent.7f3125b5.jpg",iM=E.Ay.div`
  position: absolute;
  right: -12px;
  top: 50%;
`,i_=[{label:"Agent",value:"agent"},{label:"Chat Stream",value:"chat_stream"}],iR=[{label:"Flow Agent Execute Strategy",value:"flowAgentExecuteStrategy"},{label:"Auto Agent Execute Strategy",value:"autoAgentExecuteStrategy"},{label:"Fixed Agent Execute Strategy",value:"fixedAgentExecuteStrategy"}];function iO(){let e=!rU();return(0,m.jsxs)("div",{children:[(0,m.jsx)(J.D0$,{name:"inputsValues.agentName.0",children:t=>{var r,i;let{field:a,fieldState:n}=t;return(0,m.jsx)(r1,{name:"Agent名称",type:"string",required:!0,labelWidth:80,children:(0,m.jsx)(j.pd,{placeholder:"请输入Agent名称",style:{width:"100%"},value:(null==(i=a.value)||null==(r=i.value)?void 0:r.content)||"",onChange:e=>{var t;return a.onChange({key:(null==(t=a.value)?void 0:t.key)||"",value:{content:String(e||"")}})},disabled:e})})}}),(0,m.jsx)(J.D0$,{name:"inputsValues.description.0",children:t=>{var r,i;let{field:a,fieldState:n}=t;return(0,m.jsx)(r1,{name:"描述",type:"string",required:!0,labelWidth:80,children:(0,m.jsx)(j.fs,{placeholder:"请输入Agent描述",style:{width:"100%"},rows:3,value:(null==(i=a.value)||null==(r=i.value)?void 0:r.content)||"",onChange:e=>{var t;return a.onChange({key:(null==(t=a.value)?void 0:t.key)||"",value:{content:String(e||"")}})},disabled:e})})}}),(0,m.jsx)(J.D0$,{name:"inputsValues.channel",children:t=>{let{field:r,fieldState:i}=t;return(0,m.jsx)(r1,{name:"渠道",type:"string",required:!0,labelWidth:80,children:(0,m.jsx)(j.l6,{placeholder:"请选择渠道",style:{width:"100%"},value:r.value||"",onChange:e=>r.onChange(String(e||"")),disabled:e,optionList:i_})})}}),(0,m.jsx)(J.D0$,{name:"inputsValues.strategy",children:t=>{let{field:r,fieldState:i}=t;return(0,m.jsxs)(r1,{name:"策略",type:"string",required:!0,labelWidth:80,children:[(0,m.jsx)(j.l6,{placeholder:"请选择策略",style:{width:"100%"},value:r.value||"",onChange:e=>r.onChange(String(e||"")),disabled:e,optionList:iR}),(0,m.jsx)(iM,{"data-port-id":"agent_output","data-port-type":"output"})]})}})]})}let iU={render:e=>{let{form:t}=e;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(ie,{}),(0,m.jsx)(rq,{children:(0,m.jsx)(iO,{})})]})},validateTrigger:J.N0$.onChange,validate:{title:e=>{let{value:t}=e;return t?void 0:"Title is required"},"inputsValues.agentName.*":e=>{var t;let{value:r}=e;if(!(null==r||null==(t=r.value)?void 0:t.content))return"Agent名称是必填项"},"inputsValues.description.*":e=>{var t;let{value:r}=e;if(!(null==r||null==(t=r.value)?void 0:t.content))return"描述是必填项"},"inputsValues.channel":e=>{let{value:t}=e;if(!t||""===t.trim())return"渠道是必选项"},"inputsValues.strategy":e=>{let{value:t}=e;if(!t||""===t.trim())return"策略是必选项"}}},iQ=0,iz=E.Ay.div`
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1890ff;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #1890ff;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background: #40a9ff;
    box-shadow: 0 0 0 2px #40a9ff;
  }
`;function iq(){let e=!rU(),[t,r]=(0,g.useState)([]),[i,a]=(0,g.useState)(!1);return(0,g.useEffect)(()=>{(async()=>{a(!0);try{let e=(await er.queryAllAiClientAdvisors()).map(e=>({label:e.advisorName,value:e.advisorId}));r(e)}catch(e){console.error("获取顾问数据失败:",e),r([])}finally{a(!1)}})()},[]),(0,m.jsx)(J.D0$,{name:"inputsValues.advisorName.0",children:r=>{var a,n;let{field:s,fieldState:o}=r;return(0,m.jsxs)(r1,{name:"顾问角色",type:"string",required:!0,labelWidth:80,children:[(0,m.jsx)(j.l6,{placeholder:i?"加载中...":"请选择顾问角色",style:{width:"100%"},value:(null==(a=s.value)?void 0:a.value)||"",onChange:e=>{var t;return s.onChange({key:(null==(t=s.value)?void 0:t.key)||"",value:String(e||"")})},disabled:e||i,optionList:t,loading:i}),(0,m.jsx)(iz,{"data-port-id":null==(n=s.value)?void 0:n.key,"data-port-type":"output"})]})}})}let iV={render:e=>{let{form:t}=e;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(ie,{}),(0,m.jsx)(rq,{children:(0,m.jsx)(iq,{})})]})},validateTrigger:J.N0$.onChange,validate:{title:e=>{let{value:t}=e;return t?void 0:"Title is required"},"inputsValues.advisorName.*":e=>{let{value:t}=e;if(!(null==t?void 0:t.value))return"advisor is required"}}},iF=0,iY=[{type:"agent",info:{icon:iD,description:"智能体"},formMeta:iU,meta:{defaultPorts:[{type:"input"}],useDynamicPort:!0,expandable:!1},onAdd:()=>({id:`agent_${(0,tC.Ak)(5)}`,type:"agent",data:{title:`Agent_${++iQ}`,inputsValues:{agentName:"",description:"",channel:"",strategy:""},inputs:{type:"object",properties:{agentName:{type:"string"},description:{type:"string"},channel:{type:"string"},strategy:{type:"string"}}}}})},{type:"advisor",info:{icon:"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjgiIHI9IjMiIGZpbGw9IiM0QTkwRTIiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPHBhdGggZD0iTTEyIDE0Yy00IDAtNyAyLTcgNHYyaDE0di0yYzAtMi0zLTQtNy00eiIgZmlsbD0iIzRBOTBFMiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8cGF0aCBkPSJNMTYgNmwyLTJtMCAwbDIgMm0tMi0ydjYiIHN0cm9rZT0iIzRBOTBFMiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+",description:"顾问角色"},formMeta:iV,meta:{defaultPorts:[{type:"input"}],useDynamicPort:!0,expandable:!1},onAdd:()=>({id:`advisor_${(0,tC.Ak)(5)}`,type:"advisor",data:{title:`Advisor_${++iF}`,inputsValues:{advisorName:[{key:`advisor_select_${(0,tC.Ak)(6)}`,value:""}]},inputs:{type:"object",properties:{advisorName:{type:"array",items:{type:"object",properties:{key:{type:"string"},value:{type:"string"}}}}}},outputs:{type:"object",properties:{}}},position:{x:0,y:0}})},{type:"prompt",info:{icon:"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB4PSIzIiB5PSI0IiB3aWR0aD0iMTgiIGhlaWdodD0iMTYiIHJ4PSIyIiBmaWxsPSIjNTJDNDFBIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxwYXRoIGQ9Ik03IDhoMTBNNyAxMmg4TTcgMTZoNiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxjaXJjbGUgY3g9IjE5IiBjeT0iNiIgcj0iMiIgZmlsbD0iI0ZGNEQ0RiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+",description:"系统提示词"},formMeta:ij,meta:{defaultPorts:[{type:"input"}],useDynamicPort:!0,expandable:!1},onAdd:()=>({id:`prompt_${(0,tC.Ak)(5)}`,type:"prompt",data:{title:`Prompt_${++iv}`,inputs:{type:"object",properties:{promptName:{type:"array",items:{type:"object",properties:{key:{type:"string"},value:{type:"string"}}}}}},inputsValues:{promptName:[{key:"",value:""}]},outputs:{type:"object",properties:{}}},position:{x:0,y:0}})},{type:"client",info:{icon:tE,description:"客户端"},meta:{defaultPorts:[{type:"input"}],useDynamicPort:!0,expandable:!1},formMeta:iB,onAdd:()=>({id:`client_${(0,tC.Ak)(5)}`,type:"client",data:{title:`Client_${++iL}`,inputsValues:{clientType:[{key:`client_type_${(0,tC.Ak)(6)}`,value:"DEFAULT"}],clientId:"",clientName:"",sequence:[{key:`sequence_${(0,tC.Ak)(6)}`,value:1}],stepPrompt:[{key:`step_prompt_${(0,tC.Ak)(6)}`,value:""}]},inputs:{type:"object",properties:{clientType:{type:"array",items:{type:"object",properties:{key:{type:"string"},value:{type:"string"}}}},clientId:{type:"string"},clientName:{type:"string"},sequence:{type:"array",items:{type:"object",properties:{key:{type:"string"},value:{type:"number"}}}},stepPrompt:{type:"array",items:{type:"object",properties:{key:{type:"string"},value:{type:"string"}}}}}}}})},{type:"tool_mcp",info:{icon:tE,description:"MCP工具"},meta:{defaultPorts:[{type:"input"}],useDynamicPort:!0,expandable:!1},formMeta:ih,onAdd:()=>({id:`tool_mcp_${(0,tC.Ak)(5)}`,type:"tool_mcp",data:{title:`ToolMcp_${++iu}`,inputsValues:{toolMcpName:[{key:`tool_mcp_select_${(0,tC.Ak)(6)}`,value:""}]},inputs:{type:"object",properties:{toolMcpName:{type:"array",items:{type:"object",properties:{key:{type:"string"},value:{type:"string"}}}}}}}})},{type:"model",info:{icon:tE,description:"模型"},meta:{defaultPorts:[{type:"input"}],useDynamicPort:!0,expandable:!1},formMeta:iA,onAdd:()=>({id:`model_${(0,tC.Ak)(5)}`,type:"model",data:{title:`Model_${++iC}`,inputsValues:{modelName:[{key:`model_select_${(0,tC.Ak)(6)}`,value:""}]},inputs:{type:"object",properties:{modelName:{type:"array",items:{type:"object",properties:{key:{type:"string"},value:{type:"string"}}}}}}}})},{type:"start",meta:{isStart:!0,deleteDisable:!0,copyDisable:!0,defaultPorts:[{type:"output"}],size:{width:360,height:211}},info:{icon:im,description:"The starting node of the workflow, used to set the information needed to initiate the workflow."},formMeta:ig,canAdd:()=>!1},{type:"end",meta:{deleteDisable:!0,copyDisable:!0,defaultPorts:[{type:"input"}],size:{width:360,height:211}},info:{icon:iE,description:"The final node of the workflow, used to return the result information after the workflow is run."},formMeta:i$,canAdd:()=>!1},{type:"comment",meta:{disableSideBar:!0,defaultPorts:[],renderKey:"comment",size:{width:240,height:150}},formMeta:{render:()=>(0,m.jsx)(m.Fragment,{})},getInputPoints:()=>[],getOutputPoints:()=>[]}],iH=iY.filter(e=>"comment"!==e.type),iJ={nodes:[{id:"start_0",type:"start",meta:{position:{x:-842,y:39.5}},data:{title:"Start",outputs:{type:"object",required:[]}}},{id:"agent_QyqMj",type:"agent",meta:{position:{x:-444,y:39.5}},data:{title:"Agent_1",inputsValues:{agentName:"智能体名称",description:"智能体描述",channel:"agent",strategy:"flowAgentExecuteStrategy"},inputs:{type:"object",properties:{agentName:{type:"array",items:{type:"object",properties:{key:{type:"string"},value:{type:"string"}}}}}},outputs:{type:"object",properties:{result:{type:"string"}}}}}],edges:[{sourceNodeID:"start_0",targetNodeID:"agent_QyqMj"}]};var iK=r(8751),iZ=r(2773);let iG=e=>{let t,r,i,a,n,s,o,l=(t=(0,J.h1n)(J.Vo_),r=(0,J.h1n)(tP.rV),i=(0,J.rJT)(),a=(0,J.rJT)(),n=(0,g.useCallback)(e=>a.config.getPosFromMouseEvent({clientX:e.left+64,clientY:e.top-7}),[a]),s=(0,J.h1n)(J.rmK),o=(0,g.useCallback)(e=>{e&&s.selectNode(e)},[s]),(0,g.useCallback)(async e=>{let i=n(e);await new Promise(e=>{r.callNodePanel({position:i,enableMultiAdd:!0,panelProps:{},onSelect:async e=>{if(!e)return;let{nodeType:r,nodeJSON:i}=e;o(t.createWorkflowNodeByType(r,void 0,i??{}))},onClose:()=>{e()}})})},[n,r,i.config.zoom,t,o]));return(0,m.jsx)(j.$n,{icon:(0,m.jsx)(it.A,{}),color:"highlight",style:{backgroundColor:"rgba(171,181,255,0.3)",borderRadius:"8px"},disabled:e.disabled,onClick:e=>{l(e.currentTarget.getBoundingClientRect())},children:"Add Node"})},iW=E.Ay.div`
  position: absolute;
  bottom: 16px;
  display: flex;
  justify-content: left;
  min-width: 360px;
  pointer-events: none;
  gap: 8px;

  z-index: 99;
`,iX=E.Ay.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid rgba(68, 83, 130, 0.25);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 2px 6px 0px, rgba(0, 0, 0, 0.02) 0px 4px 12px 0px;
  column-gap: 2px;
  height: 40px;
  padding: 0 4px;
  pointer-events: auto;
`,i0=E.Ay.span`
  padding: 4px;
  border-radius: 8px;
  border: 1px solid rgba(68, 83, 130, 0.25);
  font-size: 12px;
  width: 50px;
  cursor: pointer;
`,i1=E.Ay.div`
  position: absolute;
  bottom: 60px;
  width: 198px;
`,i2=(0,E.Ay)(()=>(0,m.jsx)("svg",{width:"24",height:"24",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,m.jsxs)("g",{id:"g1",children:[(0,m.jsx)("path",{id:"path1",fill:"#000000",stroke:"none",d:"M 18.09091 6.883101 L 5.409091 6.883101 L 5.409091 16.746737 L 10.664648 16.746737 C 10.927091 17.116341 11.30353 17.422749 11.792977 17.611004 L 12.664289 17.946156 L 12.744959 18.155828 L 5.409091 18.155828 C 4.630871 18.155828 4 17.524979 4 16.746737 L 4 6.883101 C 4 6.104881 4.630871 5.47401 5.409091 5.47401 L 18.09091 5.47401 C 18.86915 5.47401 19.5 6.104881 19.5 6.883101 L 19.5 12.52348 C 19.247208 11.883823 18.730145 11.365912 18.09091 11.111994 L 18.09091 6.883101 Z M 18.09091 18.155828 L 17.881165 18.155828 L 19.469212 14.368896 C 19.479921 14.343321 19.490206 14.317817 19.5 14.292241 L 19.5 16.746737 C 19.5 17.524979 18.86915 18.155828 18.09091 18.155828 Z"}),(0,m.jsx)("path",{id:"path2",fill:"#000000",fillRule:"evenodd",stroke:"none",d:"M 18.494614 13.960189 C 18.982441 12.796985 17.813459 11.628003 16.650255 12.11576 L 12.133272 14.01 C 10.962248 14.501069 10.987188 16.168798 12.172375 16.62464 L 13.482055 17.128389 L 13.985805 18.438068 C 14.441646 19.623184 16.109375 19.648125 16.600443 18.477171 L 18.494614 13.960189 Z M 17.19515 13.415224 L 15.30098 17.932205 L 14.79723 16.622526 C 14.654066 16.250385 14.359989 15.956307 13.987918 15.813213 L 12.678168 15.309464 L 17.19515 13.415224 Z"})]})}))`
  color: ${e=>e.visible?void 0:"#060709cc"};
`,i5=()=>{let e=(0,J._6U)(),t=(0,J.rJT)(),[r,i]=(0,g.useState)(!1);return(0,m.jsx)(j.ms,{position:"top",trigger:"custom",visible:r,onClickOutSide:()=>i(!1),render:(0,m.jsxs)(j.ms.Menu,{children:[(0,m.jsx)(j.ms.Item,{onClick:()=>e.zoomin(),children:"Zoom in"}),(0,m.jsx)(j.ms.Item,{onClick:()=>e.zoomout(),children:"Zoom out"}),(0,m.jsx)(j.cG,{layout:"horizontal"}),(0,m.jsx)(j.ms.Item,{onClick:()=>t.config.updateZoom(.5),children:"Zoom to 50%"}),(0,m.jsx)(j.ms.Item,{onClick:()=>t.config.updateZoom(1),children:"Zoom to 100%"}),(0,m.jsx)(j.ms.Item,{onClick:()=>t.config.updateZoom(1.5),children:"Zoom to 150%"}),(0,m.jsx)(j.ms.Item,{onClick:()=>t.config.updateZoom(2),children:"Zoom to 200%"})]}),children:(0,m.jsxs)(i0,{onClick:()=>i(!0),children:[Math.floor(100*e.zoom),"%"]})})},i6=(0,m.jsx)("svg",{width:"24",height:"24",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,m.jsx)("path",{id:"switch-line",fill:"currentColor",stroke:"none",d:"M 12.728118 10.060962 C 13.064282 8.716098 14.272528 7.772551 15.65877 7.772343 L 17.689898 7.772343 C 18.0798 7.772343 18.39588 7.456264 18.39588 7.066362 C 18.39588 6.676458 18.0798 6.36038 17.689898 6.36038 L 15.659616 6.36038 C 13.62515 6.360315 11.851767 7.745007 11.358504 9.718771 C 11.02234 11.063635 9.814095 12.007183 8.427853 12.007389 L 7.101437 12.007389 C 6.711768 12.007389 6.395878 12.323277 6.395878 12.712947 C 6.395878 13.102616 6.711768 13.418506 7.101437 13.418506 L 8.426159 13.418506 C 9.812716 13.418323 11.021417 14.361954 11.357657 15.707124 C 11.850921 17.680887 13.624304 19.065578 15.65877 19.065516 L 17.689049 19.065516 C 18.078953 19.065516 18.395033 18.749435 18.395033 18.359533 C 18.395033 17.969631 18.078953 17.653551 17.689049 17.653551 L 15.65877 17.653551 C 14.272528 17.653345 13.064282 16.709797 12.728118 15.364932 C 12.454905 14.27114 11.774856 13.322707 10.826583 12.712947 C 11.774536 12.10303 12.454268 11.154617 12.727271 10.060962 Z"})}),i8=()=>{let e=(0,J.h1n)(J.GHE),t=(0,g.useCallback)(()=>{e.switchLineType()},[e]);return(0,m.jsx)(j.m_,{content:"Switch Line",children:(0,m.jsx)(j.K0,{type:"tertiary",theme:"borderless",onClick:t,icon:i6})})};function i3(e){let[t,r]=(0,g.useState)(0),i=(0,J.WDY)(),a=(0,g.useCallback)(()=>{r(i.document.getAllNodes().map(e=>(0,J.BAU)(e)).filter(e=>null==e?void 0:e.state.invalid).length)},[i]),n=async e=>{try{let{name:t,desc:r}=(e=>{let t=`流程图配置_${new Date().toLocaleString()}`,r="通过前端拖拽生成的流程图配置";if((null==e?void 0:e.nodes)&&Array.isArray(e.nodes)){let n=e.nodes.find(e=>(null==e?void 0:e.type)==="agent"&&(null==e?void 0:e.data)&&(null==e?void 0:e.data.inputsValues));if(n){var i,a;let e=n.data.inputsValues,s=null==e?void 0:e.agentName;if(Array.isArray(s)&&s.length>0){let e=s[0];"string"==typeof e?t=e:"string"==typeof(null==e?void 0:e.value)?t=e.value:"string"==typeof(null==e||null==(i=e.value)?void 0:i.content)?t=e.value.content:"string"==typeof(null==e?void 0:e.content)&&(t=e.content)}else"string"==typeof s&&(t=s);let o=null==e?void 0:e.description;if(Array.isArray(o)&&o.length>0){let e=o[0];"string"==typeof e?r=e:"string"==typeof(null==e?void 0:e.value)?r=e.value:"string"==typeof(null==e||null==(a=e.value)?void 0:a.content)?r=e.value.content:"string"==typeof(null==e?void 0:e.content)&&(r=e.content)}else"string"==typeof o&&(r=o)}}return{name:t,desc:r}})(e),i={configName:t,description:r,agentId:"1",configData:JSON.stringify(e),createBy:"system",updateBy:"system"},a=await fetch(`${X.AI_AGENT_DRAW.BASE}${X.AI_AGENT_DRAW.SAVE_CONFIG}`,{method:"POST",headers:ee,body:JSON.stringify(i)}),n=await a.json();if("0000"===n.code)return j.y8.success(`保存成功！配置ID: ${n.data}`),n.data;throw j.y8.error(`保存失败: ${n.info}`),Error(n.info)}catch(e){throw console.error("保存流程图配置失败:",e),j.y8.error("保存失败，请检查网络连接"),e}},s=(0,g.useCallback)(async()=>{try{var e;let t=i.document.getAllNodes().map(e=>(0,J.BAU)(e));await Promise.all(t.map(async e=>null==e?void 0:e.validate()));let r=((e=i.document.toJSON()).nodes&&e.nodes.forEach(e=>{if("client"===e.type&&e.data&&e.data.inputsValues){let t=e.data.inputsValues;t.clientName&&"string"==typeof t.clientName&&(t.clientId||(console.warn("clientId为空，可能是选择组件没有正确设置clientId"),t.clientId=""),console.info("Client info:",{clientName:t.clientName,clientId:t.clientId}))}}),e);console.log(">>>>> save data: ",r),await n(r)}catch(e){console.error("保存过程中发生错误:",e)}},[i]);return((0,g.useEffect)(()=>{let e=e=>{let t=(0,J.BAU)(e);if(t){let r=t.onValidate(()=>a());e.onDispose(()=>r.dispose())}};i.document.getAllNodes().map(t=>e(t));let t=i.document.onNodeCreate(t=>{let{node:r}=t;return e(r)});return()=>t.dispose()},[i]),0===t)?(0,m.jsx)(j.$n,{disabled:e.disabled,onClick:s,style:{backgroundColor:"rgba(171,181,255,0.3)",borderRadius:"8px"},children:"Save"}):(0,m.jsx)(j.Ex,{count:t,position:"rightTop",type:"danger",children:(0,m.jsx)(j.$n,{type:"danger",disabled:e.disabled,onClick:s,style:{backgroundColor:"rgba(255, 179, 171, 0.3)",borderRadius:"8px"},children:"Save"})})}function i9(){let[e,t]=(0,g.useState)(!1),r=(0,J.h1n)(Z),i=async()=>{t(!0),await r.startRun(),t(!1)};return(0,m.jsx)(j.$n,{onClick:i,loading:e,style:{backgroundColor:"rgba(171,181,255,0.3)",borderRadius:"8px"},children:"Run"})}var i4=r(1417);let i7=()=>{let e=(0,J.rJT)(),t=(0,g.useCallback)(()=>{e.config.readonly=!e.config.readonly},[e]);return e.config.readonly?(0,m.jsx)(j.m_,{content:"Editable",children:(0,m.jsx)(j.K0,{theme:"borderless",type:"tertiary",icon:(0,m.jsx)(w.A,{size:"default"}),onClick:t})}):(0,m.jsx)(j.m_,{content:"Readonly",children:(0,m.jsx)(j.K0,{theme:"borderless",type:"tertiary",icon:(0,m.jsx)(i4.A,{size:"default"}),onClick:t})})},ae=e=>{let{minimapVisible:t,setMinimapVisible:r}=e;return(0,m.jsx)(j.m_,{content:"Minimap",children:(0,m.jsx)(j.K0,{type:"tertiary",theme:"borderless",icon:(0,m.jsx)(i2,{visible:t}),onClick:()=>r(!t)})})},at=e=>{let{visible:t}=e,r=(0,J.h1n)(tS.RV);return t?(0,m.jsx)(i1,{children:(0,m.jsx)(tS.cN,{service:r,panelStyles:{},containerStyles:{pointerEvents:"auto",position:"relative",top:"unset",right:"unset",bottom:"unset",left:"unset"},inactiveStyle:{opacity:1,scale:1,translateX:0,translateY:0}})}):(0,m.jsx)(m.Fragment,{})};function ar(e){let{width:t,height:r}=e;return(0,m.jsxs)("svg",{width:t||48,height:r||38,viewBox:"0 0 48 38",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[(0,m.jsx)("rect",{x:"1.83317",y:"1.49998",width:"44.3333",height:"35",rx:"3.5",stroke:"currentColor",strokeOpacity:"0.8",strokeWidth:"2.33333"}),(0,m.jsx)("path",{d:"M14.6665 30.6667H33.3332",stroke:"currentColor",strokeOpacity:"0.8",strokeWidth:"2.33333",strokeLinecap:"round"})]})}let ai=()=>(0,m.jsxs)("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",children:[(0,m.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M20.8549 5H3.1451C3.06496 5 3 5.06496 3 5.1451V18.8549C3 18.935 3.06496 19 3.1451 19H20.8549C20.935 19 21 18.935 21 18.8549V5.1451C21 5.06496 20.935 5 20.8549 5ZM3.1451 3C1.96039 3 1 3.96039 1 5.1451V18.8549C1 20.0396 1.96039 21 3.1451 21H20.8549C22.0396 21 23 20.0396 23 18.8549V5.1451C23 3.96039 22.0396 3 20.8549 3H3.1451Z"}),(0,m.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M6.99991 16C6.99991 15.4477 7.44762 15 7.99991 15H15.9999C16.5522 15 16.9999 15.4477 16.9999 16C16.9999 16.5523 16.5522 17 15.9999 17H7.99991C7.44762 17 6.99991 16.5523 6.99991 16Z"})]});function aa(e){let{width:t,height:r}=e;return(0,m.jsx)("svg",{width:t||34,height:r||52,viewBox:"0 0 34 52",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,m.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M30.9998 16.6666V35.3333C30.9998 37.5748 30.9948 38.4695 30.9 39.1895C30.2108 44.4247 26.0912 48.5443 20.856 49.2335C20.1361 49.3283 19.2413 49.3333 16.9998 49.3333C14.7584 49.3333 13.8636 49.3283 13.1437 49.2335C7.90847 48.5443 3.78888 44.4247 3.09965 39.1895C3.00487 38.4695 2.99984 37.5748 2.99984 35.3333V16.6666C2.99984 14.4252 3.00487 13.5304 3.09965 12.8105C3.78888 7.57528 7.90847 3.45569 13.1437 2.76646C13.7232 2.69017 14.4159 2.67202 15.8332 2.66785V9.86573C14.4738 10.3462 13.4998 11.6426 13.4998 13.1666V17.8332C13.4998 19.3571 14.4738 20.6536 15.8332 21.1341V23.6666C15.8332 24.3109 16.3555 24.8333 16.9998 24.8333C17.6442 24.8333 18.1665 24.3109 18.1665 23.6666V21.1341C19.5259 20.6536 20.4998 19.3572 20.4998 17.8332V13.1666C20.4998 11.6426 19.5259 10.3462 18.1665 9.86571V2.66785C19.5837 2.67202 20.2765 2.69017 20.856 2.76646C26.0912 3.45569 30.2108 7.57528 30.9 12.8105C30.9948 13.5304 30.9998 14.4252 30.9998 16.6666ZM0.666504 16.6666C0.666504 14.4993 0.666504 13.4157 0.786276 12.5059C1.61335 6.22368 6.55687 1.28016 12.8391 0.453085C13.7489 0.333313 14.8325 0.333313 16.9998 0.333313C19.1671 0.333313 20.2508 0.333313 21.1605 0.453085C27.4428 1.28016 32.3863 6.22368 33.2134 12.5059C33.3332 13.4157 33.3332 14.4994 33.3332 16.6666V35.3333C33.3332 37.5006 33.3332 38.5843 33.2134 39.494C32.3863 45.7763 27.4428 50.7198 21.1605 51.5469C20.2508 51.6666 19.1671 51.6666 16.9998 51.6666C14.8325 51.6666 13.7489 51.6666 12.8391 51.5469C6.55687 50.7198 1.61335 45.7763 0.786276 39.494C0.666504 38.5843 0.666504 37.5006 0.666504 35.3333V16.6666ZM15.8332 13.1666C15.8332 13.0011 15.8676 12.8437 15.9297 12.7011C15.9886 12.566 16.0722 12.4443 16.1749 12.3416C16.386 12.1305 16.6777 11.9999 16.9998 11.9999C17.6435 11.9999 18.1654 12.5212 18.1665 13.1646L18.1665 13.1666V17.8332L18.1665 17.8353C18.1665 17.8364 18.1665 17.8376 18.1665 17.8387C18.1661 17.9132 18.1588 17.986 18.1452 18.0565C18.0853 18.3656 17.9033 18.6312 17.6515 18.8011C17.4655 18.9266 17.2412 18.9999 16.9998 18.9999C16.3555 18.9999 15.8332 18.4776 15.8332 17.8332V13.1666Z",fill:"currentColor",fillOpacity:"0.8"})})}let an=()=>(0,m.jsx)("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",children:(0,m.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M4.5 8C4.5 4.13401 7.63401 1 11.5 1H12.5C16.366 1 19.5 4.13401 19.5 8V17C19.5 20.3137 16.8137 23 13.5 23H10.5C7.18629 23 4.5 20.3137 4.5 17V8ZM11.2517 3.00606C8.60561 3.13547 6.5 5.32184 6.5 8V17C6.5 19.2091 8.29086 21 10.5 21H13.5C15.7091 21 17.5 19.2091 17.5 17V8C17.5 5.32297 15.3962 3.13732 12.7517 3.00622V5.28013C13.2606 5.54331 13.6074 6.06549 13.6074 6.66669V8.75759C13.6074 9.35879 13.2606 9.88097 12.7517 10.1441V11.4091C12.7517 11.8233 12.4159 12.1591 12.0017 12.1591C11.5875 12.1591 11.2517 11.8233 11.2517 11.4091V10.1457C10.7411 9.88298 10.3931 9.35994 10.3931 8.75759V6.66669C10.3931 6.06433 10.7411 5.5413 11.2517 5.27862V3.00606ZM12.0017 6.14397C11.7059 6.14397 11.466 6.38381 11.466 6.67968V8.74462C11.466 9.03907 11.7036 9.27804 11.9975 9.28031L12.0002 9.28032C12.0456 9.28032 12.0896 9.27482 12.1316 9.26447C12.3401 9.21256 12.5002 9.0386 12.5318 8.82287C12.5345 8.80149 12.5359 8.7797 12.5359 8.75759V6.66669C12.5359 6.64463 12.5345 6.62288 12.5318 6.60154C12.4999 6.38354 12.3368 6.20817 12.1252 6.15826C12.0856 6.14891 12.0442 6.14397 12.0017 6.14397Z"})}),{Title:as,Paragraph:ao}=j.o5,al=e=>{let{title:t,subTitle:r,icon:i,onChange:a,value:n,selected:s}=e;return(0,m.jsxs)("div",{className:`mouse-pad-option ${s?"mouse-pad-option-selected":""}`,onClick:()=>a(n),children:[(0,m.jsx)("div",{className:`mouse-pad-option-icon ${s?"mouse-pad-option-icon-selected":""}`,children:i}),(0,m.jsx)(as,{heading:6,className:`mouse-pad-option-title ${s?"mouse-pad-option-title-selected":""}`,children:t}),(0,m.jsx)(ao,{type:"tertiary",className:`mouse-pad-option-subTitle ${s?"mouse-pad-option-subTitle-selected":""}`,children:r})]})},ad=e=>{let{value:t,onChange:r,onPopupVisibleChange:i,containerStyle:a,iconStyle:n,arrowStyle:s}=e,[o,l]=(0,g.useState)(!1);return(0,m.jsx)(j.AM,{trigger:"custom",position:"topLeft",closeOnEsc:!0,visible:o,onVisibleChange:e=>{null==i||i(e)},onClickOutSide:()=>{l(!1)},spacing:20,content:(0,m.jsxs)("div",{className:"ui-mouse-pad-selector-popover",children:[(0,m.jsx)(j.o5.Title,{heading:4,children:"Interaction mode"}),(0,m.jsxs)("div",{className:"ui-mouse-pad-selector-popover-options",children:[(0,m.jsx)(al,{title:"Mouse-Friendly",subTitle:"Drag the canvas with the left mouse button, zoom with the scroll wheel.",value:"MOUSE",selected:"MOUSE"===t,icon:(0,m.jsx)(aa,{}),onChange:r}),(0,m.jsx)(al,{title:"Touchpad-Friendly",subTitle:"Drag with two fingers moving in the same direction, zoom by pinching or spreading two fingers.",value:"PAD",selected:"PAD"===t,icon:(0,m.jsx)(ar,{}),onChange:r})]})]}),children:(0,m.jsx)("div",{className:`ui-mouse-pad-selector ${o?"ui-mouse-pad-selector-active":""}`,onClick:()=>{l(!o)},style:a,children:(0,m.jsx)("div",{className:"ui-mouse-pad-selector-icon",style:n,children:"MOUSE"===t?(0,m.jsx)(an,{}):(0,m.jsx)(ai,{})})})})},ac="workflow_prefer_interactive_type",ap=/(Macintosh|MacIntel|MacPPC|Mac68K|iPad)/.test(navigator.userAgent),ah=()=>{let e=localStorage.getItem(ac);return e&&["MOUSE","PAD"].includes(e)?e:ap?"PAD":"MOUSE"},au=()=>{let e=(0,J._6U)(),[t,r]=(0,g.useState)(!1),[i,a]=(0,g.useState)(()=>ah()),[n,s]=(0,g.useState)(!1);return(0,g.useEffect)(()=>{e.setMouseScrollDelta(e=>e/20);let t=ah();e.setInteractiveType(t)},[]),(0,m.jsx)(j.AM,{trigger:"custom",position:"top",visible:t,onClickOutSide:()=>{r(!1)},children:(0,m.jsx)(j.m_,{content:"MOUSE"===i?"Mouse-Friendly":"Touchpad-Friendly",style:{display:n?"none":"block"},children:(0,m.jsx)("div",{className:"workflow-toolbar-interactive",children:(0,m.jsx)(ad,{value:i,onChange:t=>{a(t),localStorage.setItem(ac,t),e.setInteractiveType(t)},onPopupVisibleChange:s,containerStyle:{border:"none",height:"32px",width:"32px",justifyContent:"center",alignItems:"center",gap:"2px",padding:"4px",borderRadius:"var(--small, 6px)"},iconStyle:{margin:"0",width:"16px",height:"16px"},arrowStyle:{width:"12px",height:"12px"}})})})})},am=()=>{let e=(0,J._6U)();return(0,m.jsx)(j.m_,{content:"FitView",children:(0,m.jsx)(j.K0,{icon:(0,m.jsx)(tG.A,{}),type:"tertiary",theme:"borderless",onClick:()=>e.fitView()})})},ag=e=>{let{style:t}=e;return(0,m.jsxs)("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",style:t,children:[(0,m.jsx)("path",{d:"M6.5 9C5.94772 9 5.5 9.44772 5.5 10V11C5.5 11.5523 5.94772 12 6.5 12H7.5C8.05228 12 8.5 11.5523 8.5 11V10C8.5 9.44772 8.05228 9 7.5 9H6.5zM11.5 9C10.9477 9 10.5 9.44772 10.5 10V11C10.5 11.5523 10.9477 12 11.5 12H12.5C13.0523 12 13.5 11.5523 13.5 11V10C13.5 9.44772 13.0523 9 12.5 9H11.5zM15.5 10C15.5 9.44772 15.9477 9 16.5 9H17.5C18.0523 9 18.5 9.44772 18.5 10V11C18.5 11.5523 18.0523 12 17.5 12H16.5C15.9477 12 15.5 11.5523 15.5 11V10z"}),(0,m.jsx)("path",{d:"M23 4C23 2.9 22.1 2 21 2H3C1.9 2 1 2.9 1 4V17.0111C1 18.0211 1.9 19.0111 3 19.0111H7.7586L10.4774 22C10.9822 22.5017 11.3166 22.6311 12 22.7009C12.414 22.707 13.0502 22.5093 13.5 22L16.2414 19.0111H21C22.1 19.0111 23 18.1111 23 17.0111V4ZM3 4H21V17.0111H15.5L12 20.6714L8.5 17.0111H3V4Z"})]})},ax=()=>{let e=(0,J.rJT)(),t=(0,J.h1n)(J.Vo_),r=(0,J.h1n)(J.rmK),i=(0,J.h1n)(J.Z4G),[a,n]=(0,g.useState)(!1),s=(0,g.useCallback)(t=>{let r=e.config.getPosFromMouseEvent(t);return{x:r.x,y:r.y-75}},[e]),o=(0,g.useCallback)(async e=>{n(!1);let a=s(e),o=t.createWorkflowNodeByType("comment",a);await (0,J.cbG)(16),r.selectNode(o),i.startDragSelectedNodes(e)},[r,s,t,i]);return(0,m.jsx)(j.m_,{trigger:"custom",visible:a,onVisibleChange:n,content:"Comment",children:(0,m.jsx)(j.K0,{disabled:e.config.readonly,icon:(0,m.jsx)(ag,{style:{width:16,height:16}}),type:"tertiary",theme:"borderless",onClick:o,onMouseEnter:()=>n(!0),onMouseLeave:()=>n(!1)})})},ay=(0,m.jsx)("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,m.jsx)("path",{fill:"currentColor",d:"M3 2C2.44772 2 2 2.44771 2 3V12C2 12.5523 2.44772 13 3 13H10C10.5523 13 11 12.5523 11 12V3C11 2.44772 10.5523 2 10 2H3zM4 11V4H9V11H4zM21 22C21.5523 22 22 21.5523 22 21V12C22 11.4477 21.5523 11 21 11H14C13.4477 11 13 11.4477 13 12V21C13 21.5523 13.4477 22 14 22H21zM20 13V20H15V13H20zM2 16C2 15.4477 2.44772 15 3 15H10C10.5523 15 11 15.4477 11 16V21C11 21.5523 10.5523 22 10 22H3C2.44772 22 2 21.5523 2 21V16zM4 20V17H9V20H4zM21 9C21.5523 9 22 8.55228 22 8V3C22 2.44772 21.5523 2 21 2H14C13.4477 2 13 2.44772 13 3V8C13 8.55228 13.4477 9 14 9H21zM20 4V7H15V4H20z"})}),af=()=>{let e=(0,J._6U)(),t=(0,J.rJT)(),r=(0,g.useCallback)(async()=>{await e.autoLayout()},[e]);return(0,m.jsx)(j.m_,{content:"Auto Layout",children:(0,m.jsx)(j.K0,{disabled:t.config.readonly,type:"tertiary",theme:"borderless",onClick:r,icon:ay})})},aj=()=>{let{history:e,playground:t}=(0,J.WDY)(),[r,i]=(0,g.useState)(!1),[a,n]=(0,g.useState)(!1),[s,o]=(0,g.useState)(!0);(0,g.useEffect)(()=>{let t=e.undoRedoService.onChange(()=>{i(e.canUndo()),n(e.canRedo())});return()=>t.dispose()},[e]);let l=(0,J.b6f)();return(0,g.useEffect)(()=>{let e=t.config.onReadonlyOrDisabledChange(()=>l());return()=>e.dispose()},[t]),(0,m.jsx)(iW,{className:"demo-free-layout-tools",children:(0,m.jsxs)(iX,{children:[(0,m.jsx)(au,{}),(0,m.jsx)(af,{}),(0,m.jsx)(i8,{}),(0,m.jsx)(i5,{}),(0,m.jsx)(am,{}),(0,m.jsx)(ae,{minimapVisible:s,setMinimapVisible:o}),(0,m.jsx)(at,{visible:s}),(0,m.jsx)(i7,{}),(0,m.jsx)(ax,{}),(0,m.jsx)(j.m_,{content:"Undo",children:(0,m.jsx)(j.K0,{type:"tertiary",theme:"borderless",icon:(0,m.jsx)(iK.A,{}),disabled:!r||t.config.readonly,onClick:()=>e.undo()})}),(0,m.jsx)(j.m_,{content:"Redo",children:(0,m.jsx)(j.K0,{type:"tertiary",theme:"borderless",icon:(0,m.jsx)(iZ.A,{}),disabled:!a||t.config.readonly,onClick:()=>e.redo()})}),(0,m.jsx)(j.cG,{layout:"vertical",style:{height:"16px"},margin:3}),(0,m.jsx)(iG,{disabled:t.config.readonly}),(0,m.jsx)(j.cG,{layout:"vertical",style:{height:"16px"},margin:3}),(0,m.jsx)(i3,{disabled:t.config.readonly}),(0,m.jsx)(i9,{})]})})};function av(e){let{children:t}=e,[r,i]=(0,g.useState)();return(0,m.jsx)(rp.Provider,{value:{visible:!!r,nodeRender:r,setNodeRender:i},children:t})}let ab=()=>{var e;let{nodeRender:t,setNodeRender:r}=(0,g.useContext)(rp),{selection:i,playground:a}=(0,J.WDY)(),n=(0,J.b6f)(),s=(0,g.useCallback)(()=>{r(void 0)},[]);(0,g.useEffect)(()=>{let e=a.config.onReadonlyOrDisabledChange(()=>n());return()=>e.dispose()},[a]),(0,g.useEffect)(()=>{let e=i.onSelectionChanged(()=>{0===i.selection.length?s():1===i.selection.length&&i.selection[0]!==(null==t?void 0:t.node)&&s()});return()=>e.dispose()},[i,s]),(0,g.useEffect)(()=>{if(t){let e=t.node.onDispose(()=>{r(void 0)});return()=>e.dispose()}return()=>{}},[t]);let o=(0,g.useMemo)(()=>{if(!t)return!1;let{disableSideBar:e=!1}=t.node.getNodeMeta();return!e},[t]);if(a.config.readonly)return null;let l=t?(0,m.jsx)(J.idb.Provider,{value:t.node,children:(0,m.jsx)(rc.Provider,{value:t,children:null==(e=t.form)?void 0:e.render()})},t.node.id):null;return(0,m.jsx)(j.DD,{mask:!1,visible:o,onCancel:s,children:(0,m.jsx)(rh.Provider,{value:!0,children:l})})},aw=()=>{let[e,t]=(0,g.useState)(iJ),[r,i]=(0,g.useState)(!1),a=(0,y.zy)(),n=(0,g.useMemo)(()=>({background:!0,readonly:!1,initialData:e,nodeRegistries:iY,getNodeDefaultRegistry:e=>({type:e,meta:{defaultExpanded:!0},formMeta:tK}),lineColor:{hidden:"transparent",default:"#4d53e8",drawing:"#5DD6E3",hovered:"#37d0ff",selected:"#37d0ff",error:"red"},canAddLine:(e,t,r)=>t.node!==r.node,canDeleteLine:(e,t,r,i)=>!0,canDeleteNode:(e,t)=>!0,onDragLineEnd:tM,selectBox:{SelectorBoxPopover:rd},materials:{renderDefaultNode:ry,renderNodes:{comment:rR}},nodeEngine:{enable:!0},variableEngine:{enable:!0},history:{enable:!0,enableChangeNode:!0},onContentChange:(0,tT.A)((e,t)=>{console.log("Auto Save: ",t,e.document.toJSON())},1e3),isFlowingLine:(e,t)=>e.get(Z).isFlowingLine(t),shortcuts:tY,onBind:e=>{let{bind:t}=e;t(K).toSelf().inSingletonScope(),t(Z).toSelf().inSingletonScope()},onInit(){console.log("--- Playground init ---")},onAllLayersRendered(e){e.document.fitView(!1),console.log("--- Playground rendered ---")},onDispose(){console.log("---- Playground Dispose ----")},plugins:()=>[(0,tB.ho)({renderInsideLine:rj}),(0,tS.XA)({disableLayer:!0,canvasStyle:{canvasWidth:182,canvasHeight:102,canvasPadding:50,canvasBackground:"rgba(242, 243, 245, 1)",canvasBorderRadius:10,viewportBackground:"rgba(255, 255, 255, 1)",viewportBorderRadius:4,viewportBorderColor:"rgba(6, 7, 9, 0.10)",viewportBorderWidth:1,viewportBorderDashLength:void 0,nodeColor:"rgba(0, 0, 0, 0.10)",nodeBorderRadius:2,nodeBorderWidth:.145,nodeBorderColor:"rgba(6, 7, 9, 0.10)",overlayColor:"rgba(255, 255, 255, 0.55)"},inactiveDebounceTime:1}),tJ({}),(0,tN.M)({edgeColor:"#00B2B2",alignColor:"#00B2B2",edgeLineWidth:1,alignLineWidth:1,alignCrossWidth:8}),(0,tP.iS)({renderer:r$}),(0,tD.Bd)({}),(0,tL.jX)({groupNodeRender:rl})]}),[e,iY]);return((0,g.useEffect)(()=>{let e=new URLSearchParams(window.location.search).get("configId");console.log("Editor useEffect - configId:",e),e?(console.log("开始加载配置数据，configId:",e),i(!0),es.getDrawConfig(e).then(e=>{if(console.log("API响应:",e),e&&e.configData)try{console.log("原始configData:",e.configData);let r=JSON.parse(e.configData);console.log("解析后的数据:",r),t(r),j.y8.success("配置数据加载成功")}catch(r){console.error("解析配置数据失败:",r),console.error("原始数据:",e.configData),j.y8.error("配置数据格式错误"),t(iJ)}else console.warn("API响应中没有configData字段:",e),j.y8.warning("未找到配置数据，使用默认配置"),t(iJ)}).catch(e=>{console.error("加载配置数据失败:",e),j.y8.error("加载配置数据失败"),t(iJ)}).finally(()=>{i(!1)})):(console.log("没有configId参数，使用默认数据"),t(iJ))},[a.search]),r)?(0,m.jsx)("div",{className:"doc-free-feature-overview",style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%"},children:(0,m.jsx)(j.tK,{size:"large",tip:"正在加载配置数据..."})}):(0,m.jsx)("div",{className:"doc-free-feature-overview",children:(0,m.jsx)(J.lSR,{...n,children:(0,m.jsxs)(av,{children:[(0,m.jsx)("div",{className:"demo-container",children:(0,m.jsx)(J.$un,{className:"demo-editor"})}),(0,m.jsx)(aj,{}),(0,m.jsx)(ab,{})]})})})},{Content:aA}=j.PE,{Title:aC,Text:aE}=j.o5,a$=(0,E.Ay)(j.PE)`
  min-height: 100vh;
  background: ${k.secondary};
  position: relative;
`,aI=E.Ay.div`
  display: flex;
  flex: 1;
  height: 100vh;
  overflow: hidden;
`,ak=E.Ay.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${e=>e.$sidebarWidth}px;
  height: 100vh;
  overflow: hidden;
  transition: margin-left ${U.normal} ${Q.cubic};
`,aT=(0,E.Ay)(aA)`
  padding: ${L.lg};
  background: ${k.secondary};
  overflow-y: auto;
  flex: 1;
`,aS=(0,E.Ay)(Y)`
  margin-bottom: ${L.lg};
  background: ${k.primary};
  border: 1px solid ${T.primary};
`,aN=E.Ay.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`,aP=E.Ay.div`
  display: flex;
  flex-direction: column;
  gap: ${L.sm};
`,aB=E.Ay.div`
  display: flex;
  gap: ${L.base};
  align-items: center;
`,aL=(0,E.Ay)(j.$n)`
  border-radius: ${D};
  font-weight: ${P.medium};
  transition: all ${U.normal} ${Q.cubic};

  ${e=>"primary"===e.$variant&&`
    background: ${S.primary};
    border: none;
    color: white;

    &:hover {
      background: ${S.primary};
      transform: translateY(-1px);
      box-shadow: ${O.md};
    }
  `}

  ${e=>"success"===e.$variant&&`
    background: #52c41a;
    border: none;
    color: white;

    &:hover {
      background: #73d13d;
      transform: translateY(-1px);
      box-shadow: ${O.md};
    }
  `}

  ${e=>"danger"===e.$variant&&`
    background: #ff4d4f;
    border: none;
    color: white;

    &:hover {
      background: #ff7875;
      transform: translateY(-1px);
      box-shadow: ${O.md};
    }
  `}
`,aD=(0,E.Ay)(Y)`
  flex: 1;
  min-height: 600px;
  padding: 0;
  overflow: hidden;
  border: 1px solid ${T.primary};
  margin-bottom: ${L.lg};
`,aM=E.Ay.div`
  height: 100%;
  width: 100%;

  .doc-free-feature-overview {
    height: 100%;
    width: 100%;
  }

  .demo-container {
    height: 100%;
    width: 100%;
  }

  .demo-editor {
    height: 100% !important;
    width: 100% !important;
  }
`,a_=E.Ay.div`
  display: flex;
  align-items: center;
  gap: ${L.xs};
  padding: ${L.xs} ${L.sm};
  border-radius: ${D};
  font-size: ${N.sm};
  font-weight: ${P.medium};

  ${e=>"idle"===e.$status&&`
    background: ${k.tertiary};
    color: ${I.secondary};
  `}

  ${e=>"running"===e.$status&&`
    background: rgba(82, 196, 26, 0.1);
    color: #52c41a;
  `}

  ${e=>"stopped"===e.$status&&`
    background: rgba(255, 77, 79, 0.1);
    color: #ff4d4f;
  `}
`,aR=E.Ay.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;

  ${e=>"idle"===e.$status&&`
    background: ${I.tertiary};
  `}

  ${e=>"running"===e.$status&&`
    background: #52c41a;
    animation: pulse 2s infinite;
  `}

  ${e=>"stopped"===e.$status&&`
    background: #ff4d4f;
  `}

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`,aO=()=>{let e=(0,y.Zp)(),[t,r]=(0,g.useState)(!1),[i,a]=(0,g.useState)(null),[n,s]=(0,g.useState)("idle"),[o,l]=(0,g.useState)(!1);(0,g.useEffect)(()=>{let t=localStorage.getItem("token"),r=localStorage.getItem("userInfo");if(!t||!r){j.y8.error("请先登录"),e("/login");return}try{let e=JSON.parse(r);a(e)}catch(t){j.y8.error("用户信息解析失败"),e("/login")}},[e]);let d=()=>{e("/dashboard")},c=async()=>{l(!0);try{await new Promise(e=>setTimeout(e,1e3)),j.y8.success("配置已保存")}catch(e){j.y8.error("保存失败")}finally{l(!1)}};if(!i)return null;let p=t?80:280;return(0,m.jsxs)(a$,{children:[(0,m.jsx)(ez,{selectedKey:"agent-config",onSelect:t=>{switch(t){case"dashboard":e("/dashboard");break;case"agent-list":e("/agent-list");break;case"agent-config":e("/agent-config");break;case"client-management":e("/client-management");break;case"ai-client-api-management":e("/ai-client-api-management");break;case"advisor-management":e("/advisor-management");break;case"rag-order-management":e("/rag-order-management");break;case"client-model-management":e("/client-model-management");break;case"client-system-prompt-management":e("/client-system-prompt-management");break;case"client-tool-mcp-management":e("/client-tool-mcp-management");break;default:e(t)}},collapsed:t}),(0,m.jsx)(aI,{children:(0,m.jsxs)(ak,{$sidebarWidth:p,children:[(0,m.jsx)(e6,{onToggleSidebar:()=>r(!t),onLogout:()=>{localStorage.removeItem("token"),localStorage.removeItem("userInfo"),localStorage.removeItem("isLoggedIn"),j.y8.success("已退出登录"),e("/login")},collapsed:t}),(0,m.jsxs)(aT,{children:[(0,m.jsx)(aS,{children:(0,m.jsxs)(aN,{children:[(0,m.jsxs)(aP,{children:[(0,m.jsxs)(j.Qp,{children:[(0,m.jsx)(j.Qp.Item,{onClick:d,style:{cursor:"pointer"},children:"控制台"}),(0,m.jsx)(j.Qp.Item,{children:"Agent配置"})]}),(0,m.jsxs)(j.$x,{vertical:!0,spacing:"tight",children:[(0,m.jsx)(aC,{heading:3,style:{margin:0},children:"Agent执行流程配置"}),(0,m.jsx)(aE,{type:"secondary",children:"通过可视化界面配置AI Agent的执行流程，支持拖拽式操作"})]})]}),(0,m.jsxs)(aB,{children:[(0,m.jsxs)(a_,{$status:n,children:[(0,m.jsx)(aR,{$status:n}),(()=>{switch(n){case"running":return"运行中";case"stopped":return"已停止";default:return"待启动"}})()]}),(0,m.jsx)(aL,{icon:(0,m.jsx)(tv.A,{}),loading:o,onClick:c,$variant:"primary",children:"保存配置"}),(0,m.jsx)(aL,{icon:"running"===n?(0,m.jsx)(tb.A,{}):(0,m.jsx)(tw.A,{}),onClick:()=>{"running"===n?(s("stopped"),j.y8.info("Agent已停止")):(s("running"),j.y8.success("Agent已启动"))},$variant:"running"===n?"danger":"success",children:"running"===n?"停止":"启动"}),(0,m.jsx)(j.$n,{icon:(0,m.jsx)(tA.A,{}),onClick:d,children:"返回"})]})]})}),(0,m.jsx)(aD,{children:(0,m.jsx)(aM,{children:(0,m.jsx)(aw,{})})})]})]})})]})};var aU=r(113),aQ=r(46);let{Content:az}=j.PE,{Title:aq}=j.o5,aV=(0,E.Ay)(j.PE)`
  min-height: 100vh;
  background: ${k.secondary};
`,aF=E.Ay.div`
  display: flex;
  flex: 1;
  margin-left: ${e=>e.$collapsed?"80px":"280px"}; /* 根据 Sidebar 状态调整左边距 */
  transition: margin-left ${U.normal} ${Q.cubic};
`,aY=(0,E.Ay)(az)`
  flex: 1;
  padding: ${L.lg};
  background: ${k.secondary};
  overflow-y: auto;
`,aH=E.Ay.div`
  margin-bottom: ${L.lg};
`,aJ=(0,E.Ay)(j.Zp)`
  margin-bottom: ${L.lg};

  .semi-card-body {
    padding: ${L.lg};
  }
`,aK=E.Ay.div`
  display: flex;
  align-items: center;
  gap: ${L.base};
  flex-wrap: wrap;
`,aZ=(0,E.Ay)(j.Zp)`
  .semi-card-body {
    padding: 0;
  }
`,aG=(0,E.Ay)(j.$n)`
  margin-right: ${L.sm};
`,aW=e=>{let{selectedKey:t="agent-list",onMenuSelect:r}=e,i=(0,y.Zp)(),[a,n]=(0,g.useState)(!1),[s,o]=(0,g.useState)(!1),[l,d]=(0,g.useState)([]),[c,p]=(0,g.useState)({pageNum:1,pageSize:10}),[h,u]=(0,g.useState)(0),x=[{title:"配置ID",dataIndex:"configId",key:"configId",width:120,render:e=>(0,m.jsx)("span",{style:{fontFamily:"monospace",fontSize:"12px"},children:e})},{title:"配置名称",dataIndex:"configName",key:"configName",width:120,render:e=>(0,m.jsx)("span",{style:{fontWeight:500},children:e})},{title:"描述",dataIndex:"description",key:"description",width:250,render:e=>e||"-"},{title:"智能体ID",dataIndex:"agentId",key:"agentId",width:120,render:e=>(0,m.jsx)("span",{style:{fontFamily:"monospace",fontSize:"12px"},children:e})},{title:"状态",dataIndex:"status",key:"status",width:80,render:e=>(0,m.jsx)(j.vw,{color:1===e?"green":"red",children:1===e?"启用":"禁用"})},{title:"操作",key:"action",width:250,fixed:"right",render:(e,t)=>(0,m.jsxs)(j.$x,{children:[(0,m.jsx)(aG,{type:"tertiary",size:"small",icon:(0,m.jsx)(C.A,{}),onClick:()=>v(t),children:"查看"}),(0,m.jsx)(aG,{type:"tertiary",size:"small",icon:(0,m.jsx)(aU.A,{}),onClick:()=>b(t),children:"修改"}),(0,m.jsx)(aG,{type:"primary",size:"small",onClick:()=>w(t),children:"加载"}),(0,m.jsx)(j.iS,{title:"确定要删除这个配置吗？",content:"删除后无法恢复，请谨慎操作",onConfirm:()=>A(t),children:(0,m.jsx)(aG,{type:"danger",size:"small",icon:(0,m.jsx)(aQ.A,{}),children:"删除"})})]})}],f=async e=>{o(!0);try{let t={...c,...e},r=await es.queryDrawConfigList(t);d(r),u(r.length>=(t.pageSize||10)?(t.pageNum||1)*(t.pageSize||10)+1:r.length)}catch(e){j.y8.error("加载数据失败"),console.error("加载数据失败:",e)}finally{o(!1)}},v=e=>{i(`/agent-config?configId=${e.configId}&mode=view`)},b=e=>{i(`/agent-config?configId=${e.configId}`)},w=async e=>{try{o(!0),j.y8.info(`正在装配智能体: ${e.configName}`),await eo.armoryAgent(e.agentId)?j.y8.success(`智能体 ${e.configName} 装配成功！`):j.y8.error(`智能体 ${e.configName} 装配失败`)}catch(e){console.error("装配智能体失败:",e),j.y8.error(`装配失败: ${e instanceof Error?e.message:"未知错误"}`)}finally{o(!1)}},A=async e=>{try{o(!0),await es.deleteDrawConfig(e.configId)?(j.y8.success(`成功删除配置: ${e.configName}`),await f()):j.y8.error("删除配置失败")}catch(e){j.y8.error("删除配置失败"),console.error("删除配置失败:",e)}finally{o(!1)}};return(0,g.useEffect)(()=>{f()},[]),(0,m.jsxs)(aV,{children:[(0,m.jsx)(ez,{selectedKey:t,onSelect:e=>{switch(e){case"dashboard":i("/dashboard");break;case"agent-list":i("/agent-list");break;case"agent-config":i("/agent-config");break;case"client-management":i("/client-management");break;case"ai-client-api-management":i("/ai-client-api-management");break;case"advisor-management":i("/advisor-management");break;case"rag-order-management":i("/rag-order-management");break;case"client-model-management":i("/client-model-management");break;case"client-system-prompt-management":i("/client-system-prompt-management");break;case"client-tool-mcp-management":i("/client-tool-mcp-management");break;default:i(e)}},collapsed:a}),(0,m.jsx)(aF,{$collapsed:a,children:(0,m.jsxs)("div",{style:{flex:1,display:"flex",flexDirection:"column"},children:[(0,m.jsx)(e6,{onToggleSidebar:()=>n(!a),onLogout:()=>{localStorage.removeItem("token"),localStorage.removeItem("userInfo"),localStorage.removeItem("isLoggedIn"),i("/login")},collapsed:a}),(0,m.jsxs)(aY,{children:[(0,m.jsx)(aH,{children:(0,m.jsx)(aq,{heading:3,children:"代理列表"})}),(0,m.jsx)(aJ,{children:(0,m.jsxs)(aK,{children:[(0,m.jsx)(j.pd,{placeholder:"请输入配置名称",value:c.configName||"",onChange:e=>p(t=>({...t,configName:e})),style:{width:200},prefix:(0,m.jsx)(eF.A,{})}),(0,m.jsx)(j.pd,{placeholder:"请输入智能体ID",value:c.agentId||"",onChange:e=>p(t=>({...t,agentId:e})),style:{width:200}}),(0,m.jsx)(j.$n,{type:"primary",onClick:()=>{let e={...c,pageNum:1};p(e),f(e)},loading:s,children:"搜索"}),(0,m.jsx)(j.$n,{onClick:()=>{let e={pageNum:1,pageSize:10};p(e),f(e)},children:"重置"}),(0,m.jsx)("div",{style:{marginLeft:"auto"},children:(0,m.jsx)(j.$n,{type:"primary",icon:(0,m.jsx)(it.A,{}),onClick:()=>{i("/agent-config")},children:"新建"})})]})}),(0,m.jsx)(aZ,{children:(0,m.jsx)(j.XI,{columns:x,dataSource:l,loading:s,pagination:{currentPage:c.pageNum||1,pageSize:c.pageSize||10,total:h,showSizeChanger:!0,showQuickJumper:!0,onChange:(e,t)=>{let r={...c,pageNum:e,pageSize:t};p(r),f(r)}},rowKey:"configId",scroll:{x:1200},size:"middle"})})]})]})})]})};var aX=r(9090);let a0=new class{async queryClientList(e){let t=await fetch(`${this.baseUrl}/query-list`,{method:"POST",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async deleteClientById(e){let t=await fetch(`${this.baseUrl}/delete-by-id/${e}`,{method:"DELETE",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async deleteClientByClientId(e){let t=await fetch(`${this.baseUrl}/delete-by-client-id/${e}`,{method:"DELETE",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryClientById(e){let t=await fetch(`${this.baseUrl}/query-by-id/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryAllClients(){let e=await fetch(`${this.baseUrl}/query-all`,{method:"GET",headers:{...ee}});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return await e.json()}async queryEnabledClients(){let e=await fetch(`${this.baseUrl}/query-enabled`,{method:"GET",headers:{...ee}});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return await e.json()}async createClient(e){let t=await fetch(`${this.baseUrl}/create`,{method:"POST",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async updateClientById(e){let t=await fetch(`${this.baseUrl}/update-by-id`,{method:"PUT",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async updateClientByClientId(e){let t=await fetch(`${this.baseUrl}/update-by-client-id`,{method:"PUT",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}constructor(){this.baseUrl=`${G}/api/v1/admin/ai-client`}},a1=e=>{let{visible:t,onCancel:r,onSuccess:i}=e,[a,n]=(0,g.useState)(!1),[s,o]=(0,g.useState)({clientName:"",description:"",status:1}),[l,d]=(0,g.useState)({}),c=async()=>{let e;if(e={},s.clientName.trim()?s.clientName.trim().length<2?e.clientName="客户端名称至少2个字符":s.clientName.trim().length>50&&(e.clientName="客户端名称不能超过50个字符"):e.clientName="请输入客户端名称",s.description&&s.description.length>200&&(e.description="描述不能超过200个字符"),d(e),0===Object.keys(e).length){n(!0);try{let e={clientId:Math.floor(9e7*Math.random()+1e7).toString(),clientName:s.clientName.trim(),description:s.description.trim()||"",status:s.status},t=await a0.createClient(e);if("0000"===t.code&&t.data)j.y8.success("客户端创建成功"),p(),i();else throw Error(t.info||"创建失败")}catch(e){console.error("创建客户端失败:",e),j.y8.error("创建失败，请检查网络连接或稍后重试")}finally{n(!1)}}},p=()=>{o({clientName:"",description:"",status:1}),d({})},h=()=>{p(),r()};return(0,m.jsx)(j.aF,{title:"新增客户端",visible:t,onCancel:h,footer:null,width:500,maskClosable:!1,children:(0,m.jsxs)("div",{style:{padding:"20px 0"},children:[(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsxs)("div",{style:{marginBottom:"8px",display:"flex",alignItems:"center"},children:[(0,m.jsxs)("span",{style:{width:"100px",textAlign:"right",marginRight:"12px"},children:["客户端名称",(0,m.jsx)("span",{style:{color:"red"},children:"*"}),":"]}),(0,m.jsx)(j.pd,{placeholder:"请输入客户端名称",value:s.clientName,onChange:e=>o(t=>({...t,clientName:e})),style:{flex:1}})]}),l.clientName&&(0,m.jsx)("div",{style:{marginLeft:"112px",color:"red",fontSize:"12px"},children:l.clientName})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsxs)("div",{style:{marginBottom:"8px",display:"flex",alignItems:"flex-start"},children:[(0,m.jsx)("span",{style:{width:"100px",textAlign:"right",marginRight:"12px",paddingTop:"6px"},children:"描述:"}),(0,m.jsx)(j.fs,{placeholder:"请输入客户端描述（可选）",value:s.description,onChange:e=>o(t=>({...t,description:e})),maxCount:200,rows:3,style:{flex:1}})]}),l.description&&(0,m.jsx)("div",{style:{marginLeft:"112px",color:"red",fontSize:"12px"},children:l.description})]}),(0,m.jsx)("div",{style:{marginBottom:"16px"},children:(0,m.jsxs)("div",{style:{display:"flex",alignItems:"center"},children:[(0,m.jsxs)("span",{style:{width:"100px",textAlign:"right",marginRight:"12px"},children:["状态",(0,m.jsx)("span",{style:{color:"red"},children:"*"}),":"]}),(0,m.jsxs)(j.l6,{placeholder:"请选择状态",value:s.status,onChange:e=>o(t=>({...t,status:e})),style:{flex:1},children:[(0,m.jsx)(j.l6.Option,{value:1,children:"启用"}),(0,m.jsx)(j.l6.Option,{value:0,children:"禁用"})]})]})}),(0,m.jsx)("div",{style:{textAlign:"right",marginTop:"20px"},children:(0,m.jsxs)(j.$x,{children:[(0,m.jsx)(j.$n,{onClick:h,children:"取消"}),(0,m.jsx)(j.$n,{type:"primary",onClick:c,loading:a,children:"保存"})]})})]})})},a2=e=>{let{visible:t,onCancel:r,onSuccess:i,clientData:a}=e,[n,s]=(0,g.useState)(!1),[o,l]=(0,g.useState)({id:0,clientId:"",clientName:"",description:"",status:1}),[d,c]=(0,g.useState)({});(0,g.useEffect)(()=>{t&&a&&(l({id:a.id,clientId:a.clientId,clientName:a.clientName,description:a.description||"",status:a.status}),c({}))},[t,a]);let p=async()=>{let e;if(e={},o.clientName.trim()?o.clientName.trim().length<2?e.clientName="客户端名称至少2个字符":o.clientName.trim().length>50&&(e.clientName="客户端名称不能超过50个字符"):e.clientName="请输入客户端名称",o.description&&o.description.length>200&&(e.description="描述不能超过200个字符"),c(e),0===Object.keys(e).length){s(!0);try{let e={id:o.id,clientId:o.clientId,clientName:o.clientName.trim(),description:o.description.trim()||"",status:o.status},t=await a0.updateClientById(e);if("0000"===t.code&&t.data)j.y8.success("客户端更新成功"),h(),i();else throw Error(t.info||"更新失败")}catch(e){console.error("更新客户端失败:",e),j.y8.error("更新失败，请检查网络连接或稍后重试")}finally{s(!1)}}},h=()=>{l({id:0,clientId:"",clientName:"",description:"",status:1}),c({})},u=()=>{h(),r()};return(0,m.jsx)(j.aF,{title:"编辑客户端",visible:t,onCancel:u,footer:null,width:500,maskClosable:!1,children:(0,m.jsxs)("div",{style:{padding:"20px 0"},children:[(0,m.jsx)("div",{style:{marginBottom:"16px"},children:(0,m.jsxs)("div",{style:{marginBottom:"8px",display:"flex",alignItems:"center"},children:[(0,m.jsx)("span",{style:{width:"100px",textAlign:"right",marginRight:"12px"},children:"客户端ID:"}),(0,m.jsx)(j.pd,{value:o.clientId,disabled:!0,style:{flex:1}})]})}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsxs)("div",{style:{marginBottom:"8px",display:"flex",alignItems:"center"},children:[(0,m.jsxs)("span",{style:{width:"100px",textAlign:"right",marginRight:"12px"},children:["客户端名称",(0,m.jsx)("span",{style:{color:"red"},children:"*"}),":"]}),(0,m.jsx)(j.pd,{placeholder:"请输入客户端名称",value:o.clientName,onChange:e=>l(t=>({...t,clientName:e})),style:{flex:1}})]}),d.clientName&&(0,m.jsx)("div",{style:{marginLeft:"112px",color:"red",fontSize:"12px"},children:d.clientName})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsxs)("div",{style:{marginBottom:"8px",display:"flex",alignItems:"flex-start"},children:[(0,m.jsx)("span",{style:{width:"100px",textAlign:"right",marginRight:"12px",paddingTop:"6px"},children:"描述:"}),(0,m.jsx)(j.fs,{placeholder:"请输入客户端描述（可选）",value:o.description,onChange:e=>l(t=>({...t,description:e})),maxCount:200,rows:3,style:{flex:1}})]}),d.description&&(0,m.jsx)("div",{style:{marginLeft:"112px",color:"red",fontSize:"12px"},children:d.description})]}),(0,m.jsx)("div",{style:{marginBottom:"16px"},children:(0,m.jsxs)("div",{style:{display:"flex",alignItems:"center"},children:[(0,m.jsxs)("span",{style:{width:"100px",textAlign:"right",marginRight:"12px"},children:["状态",(0,m.jsx)("span",{style:{color:"red"},children:"*"}),":"]}),(0,m.jsxs)(j.l6,{placeholder:"请选择状态",value:o.status,onChange:e=>l(t=>({...t,status:e})),style:{flex:1},children:[(0,m.jsx)(j.l6.Option,{value:1,children:"启用"}),(0,m.jsx)(j.l6.Option,{value:0,children:"禁用"})]})]})}),(0,m.jsx)("div",{style:{textAlign:"right",marginTop:"20px"},children:(0,m.jsxs)(j.$x,{children:[(0,m.jsx)(j.$n,{onClick:u,children:"取消"}),(0,m.jsx)(j.$n,{type:"primary",onClick:p,loading:n,children:"保存"})]})})]})})},{Content:a5}=j.PE,{Title:a6}=j.o5,a8=(0,E.Ay)(j.PE)`
  min-height: 100vh;
  background: ${k.secondary};
`,a3=E.Ay.div`
  display: flex;
  flex: 1;
  margin-left: ${e=>e.$collapsed?"80px":"280px"};
  transition: margin-left ${U.normal} ${Q.cubic};
`,a9=(0,E.Ay)(a5)`
  flex: 1;
  padding: ${L.lg};
  background: ${k.secondary};
  overflow-y: auto;
`,a4=E.Ay.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`,a7=E.Ay.div`
  padding: ${L.lg};
  border-bottom: 1px solid ${T.secondary};
`,ne=(0,E.Ay)(j.Zp)`
  margin: ${L.lg};

  .semi-card-body {
    padding: ${L.lg};
  }
`,nt=E.Ay.div`
  display: flex;
  align-items: center;
  gap: ${L.base};
  flex-wrap: wrap;
`,nr=E.Ay.div`
  flex: 1;
  margin: 0 ${L.lg} ${L.lg};
  display: flex;
  flex-direction: column;
`,ni=(0,E.Ay)(j.Zp)`
  flex: 1;
  display: flex;
  flex-direction: column;

  .semi-card-body {
    padding: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`,na=E.Ay.div`
  flex: 1;
  overflow: auto;
`,nn=(0,E.Ay)(j.$n)`
  margin-right: ${L.sm};
`,ns=()=>{let e=(0,y.Zp)(),[t,r]=(0,g.useState)(!1),[i,a]=(0,g.useState)(!1),[n,s]=(0,g.useState)([]),[o,l]=(0,g.useState)(""),[d,c]=(0,g.useState)(1),[p,h]=(0,g.useState)(10),[u,x]=(0,g.useState)(0),[f,v]=(0,g.useState)(!1),[b,w]=(0,g.useState)(!1),[A,C]=(0,g.useState)(null);JSON.parse(localStorage.getItem("userInfo")||"{}");let E=[{title:"ID",dataIndex:"id",key:"id",width:80},{title:"客户端ID",dataIndex:"clientId",key:"clientId",width:150},{title:"客户端名称",dataIndex:"clientName",key:"clientName",width:200},{title:"描述",dataIndex:"description",key:"description",render:e=>e||"-"},{title:"状态",dataIndex:"status",key:"status",width:100,render:e=>(0,m.jsx)(j.vw,{color:1===e?"green":"red",children:1===e?"启用":"禁用"})},{title:"创建时间",dataIndex:"createTime",key:"createTime",width:180,render:e=>new Date(e).toLocaleString()},{title:"更新时间",dataIndex:"updateTime",key:"updateTime",width:180,render:e=>new Date(e).toLocaleString()},{title:"操作",key:"action",width:150,fixed:"right",render:(e,t)=>(0,m.jsxs)(j.$x,{children:[(0,m.jsx)(nn,{theme:"borderless",type:"primary",icon:(0,m.jsx)(aU.A,{}),size:"small",onClick:()=>k(t),children:"编辑"}),(0,m.jsx)(j.iS,{title:"确定要删除这个客户端配置吗？",content:"删除后无法恢复，请谨慎操作",onConfirm:()=>I(t),okText:"确定",cancelText:"取消",children:(0,m.jsx)(nn,{theme:"borderless",type:"danger",icon:(0,m.jsx)(aQ.A,{}),size:"small",children:"删除"})})]})}],$=async()=>{a(!0);try{let e=await a0.queryClientList({clientName:o||void 0,pageNum:d,pageSize:p});if("0000"===e.code){let t=e.data||[];s(t),x(t.length)}else throw Error(e.info||"查询失败")}catch(e){console.error("获取客户端列表失败:",e),j.y8.error("获取客户端列表失败，请检查网络连接"),s([]),x(0)}finally{a(!1)}},I=async e=>{try{let t=await a0.deleteClientById(e.id);if("0000"===t.code&&t.data)j.y8.success("删除成功"),$();else throw Error(t.info||"删除失败")}catch(e){console.error("删除客户端失败:",e),j.y8.error("删除失败，请检查网络连接")}},k=e=>{C(e),w(!0)},T=()=>{c(1),$()};return(0,g.useEffect)(()=>{$()},[]),(0,m.jsxs)(a8,{children:[(0,m.jsx)(ez,{collapsed:t,selectedKey:"client-management",onSelect:t=>{switch(t){case"dashboard":e("/dashboard");break;case"agent-list":e("/agent-list");break;case"agent-config":e("/agent-config");break;case"client-management":e("/client-management");break;case"ai-client-api-management":e("/ai-client-api-management");break;case"advisor-management":e("/advisor-management");break;case"rag-order-management":e("/rag-order-management");break;case"client-model-management":e("/client-model-management");break;case"client-system-prompt-management":e("/client-system-prompt-management");break;case"client-tool-mcp-management":e("/client-tool-mcp-management");break;default:e(t)}}}),(0,m.jsx)(a3,{$collapsed:t,children:(0,m.jsxs)(a9,{children:[(0,m.jsx)(e6,{collapsed:t,onToggleSidebar:()=>r(!t),onLogout:()=>{localStorage.removeItem("token"),localStorage.removeItem("userInfo"),localStorage.removeItem("isLoggedIn"),j.y8.success("已退出登录"),e("/login")}}),(0,m.jsxs)(a4,{children:[(0,m.jsx)(a7,{children:(0,m.jsx)(a6,{heading:3,style:{margin:0},children:"客户端管理"})}),(0,m.jsx)(ne,{children:(0,m.jsxs)(nt,{children:[(0,m.jsx)(j.pd,{placeholder:"请输入客户端名称",value:o,onChange:l,style:{width:200},onEnterPress:T}),(0,m.jsx)(j.$n,{type:"primary",icon:(0,m.jsx)(eF.A,{}),onClick:T,children:"搜索"}),(0,m.jsx)(j.$n,{icon:(0,m.jsx)(aX.A,{}),onClick:()=>{l(""),c(1),$()},children:"重置"}),(0,m.jsx)(j.$n,{type:"primary",theme:"solid",icon:(0,m.jsx)(it.A,{}),onClick:()=>{v(!0)},children:"新增客户端"})]})}),(0,m.jsx)(nr,{children:(0,m.jsx)(ni,{children:(0,m.jsx)(na,{children:(0,m.jsx)(j.XI,{columns:E,dataSource:n,loading:i,pagination:{currentPage:d,pageSize:p,total:u,showSizeChanger:!0,showQuickJumper:!0,onChange:(e,t)=>{c(e),t&&t!==p&&h(t),$()}},rowKey:"id",scroll:{x:1200},empty:(0,m.jsx)("div",{style:{padding:"40px",textAlign:"center"},children:(0,m.jsx)(j.o5.Text,{type:"tertiary",children:"暂无数据"})})})})})})]}),(0,m.jsx)(a1,{visible:f,onCancel:()=>{v(!1)},onSuccess:()=>{v(!1),$()}}),(0,m.jsx)(a2,{visible:b,clientData:A,onCancel:()=>{w(!1),C(null)},onSuccess:()=>{w(!1),C(null),$()}})]})})]})};var no=r(7693);let nl=new class{async createAiClientApi(e){let t=await fetch(`${this.baseUrl}/create`,{method:"POST",headers:{...ee,"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async updateAiClientApiById(e){let t=await fetch(`${this.baseUrl}/update-by-id`,{method:"PUT",headers:{...ee,"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){let e=await t.json().catch(()=>null);throw Error((null==e?void 0:e.info)||`更新请求失败（HTTP ${t.status}）`)}return await t.json()}async updateAiClientApiByApiId(e){let t=await fetch(`${this.baseUrl}/update-by-api-id`,{method:"PUT",headers:{...ee,"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){let e=await t.json().catch(()=>null);throw Error((null==e?void 0:e.info)||`更新请求失败（HTTP ${t.status}）`)}return await t.json()}async deleteAiClientApiById(e){let t=await fetch(`${this.baseUrl}/delete-by-id/${e}`,{method:"DELETE",headers:ee});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async deleteAiClientApiByApiId(e){let t=await fetch(`${this.baseUrl}/delete-by-api-id/${e}`,{method:"DELETE",headers:ee});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryAiClientApiById(e){let t=await fetch(`${this.baseUrl}/query-by-id/${e}`,{method:"GET",headers:ee});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryAiClientApiByApiId(e){let t=await fetch(`${this.baseUrl}/query-by-api-id/${e}`,{method:"GET",headers:ee});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryEnabledAiClientApis(){let e=await fetch(`${this.baseUrl}/query-enabled`,{method:"GET",headers:ee});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return await e.json()}async queryAiClientApiList(e){let t=await fetch(`${this.baseUrl}/query-list`,{method:"POST",headers:{...ee,"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryAllAiClientApis(){let e=await fetch(`${this.baseUrl}/query-all`,{method:"GET",headers:ee});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return await e.json()}constructor(){this.baseUrl=`${G}/api/v1/admin/ai-client-api`}},nd=e=>{let{visible:t,onCancel:r,onSuccess:i}=e,[a,n]=(0,g.useState)(!1),[s,o]=(0,g.useState)({baseUrl:"",apiKey:"",completionsPath:"v1/chat/completions",embeddingsPath:"v1/embeddings",status:1}),[l,d]=(0,g.useState)({}),c=async()=>{let e;if(e={},s.baseUrl.trim()?/^https?:\/\/.+/.test(s.baseUrl.trim())||(e.baseUrl="请输入有效的URL格式（以http://或https://开头）"):e.baseUrl="请输入基础URL",s.apiKey.trim()?s.apiKey.trim().length<10&&(e.apiKey="API密钥长度至少10个字符"):e.apiKey="请输入API密钥",s.completionsPath.trim()||(e.completionsPath="请输入对话路径"),s.embeddingsPath.trim()||(e.embeddingsPath="请输入嵌入路径"),d(e),0===Object.keys(e).length){n(!0);try{let e={apiId:Math.floor(9e7*Math.random()+1e7).toString(),baseUrl:s.baseUrl.trim(),apiKey:s.apiKey.trim(),completionsPath:s.completionsPath.trim(),embeddingsPath:s.embeddingsPath.trim(),status:s.status},t=await nl.createAiClientApi(e);if("0000"===t.code&&t.data)j.y8.success("AI客户端API创建成功"),p(),i();else throw Error(t.info||"创建失败")}catch(e){console.error("创建AI客户端API失败:",e),j.y8.error("创建失败，请检查网络连接或稍后重试")}finally{n(!1)}}},p=()=>{o({baseUrl:"",apiKey:"",completionsPath:"v1/chat/completions",embeddingsPath:"v1/embeddings",status:1}),d({})},h=()=>{p(),r()};return(0,m.jsx)(j.aF,{title:"新增AI客户端API",visible:t,onCancel:h,footer:null,width:600,maskClosable:!1,children:(0,m.jsxs)("div",{style:{padding:"20px 0"},children:[(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsxs)("div",{style:{marginBottom:"8px",display:"flex",alignItems:"center"},children:[(0,m.jsxs)("span",{style:{width:"120px",textAlign:"right",marginRight:"12px"},children:["基础URL",(0,m.jsx)("span",{style:{color:"red"},children:"*"}),":"]}),(0,m.jsx)(j.pd,{placeholder:"请输入基础URL，如：https://api.openai.com",value:s.baseUrl,onChange:e=>o(t=>({...t,baseUrl:e})),style:{flex:1}})]}),l.baseUrl&&(0,m.jsx)("div",{style:{marginLeft:"132px",color:"red",fontSize:"12px"},children:l.baseUrl})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsxs)("div",{style:{marginBottom:"8px",display:"flex",alignItems:"center"},children:[(0,m.jsxs)("span",{style:{width:"120px",textAlign:"right",marginRight:"12px"},children:["API密钥",(0,m.jsx)("span",{style:{color:"red"},children:"*"}),":"]}),(0,m.jsx)(j.pd,{placeholder:"请输入API密钥",value:s.apiKey,onChange:e=>o(t=>({...t,apiKey:e})),style:{flex:1},type:"password"})]}),l.apiKey&&(0,m.jsx)("div",{style:{marginLeft:"132px",color:"red",fontSize:"12px"},children:l.apiKey})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsxs)("div",{style:{marginBottom:"8px",display:"flex",alignItems:"center"},children:[(0,m.jsxs)("span",{style:{width:"120px",textAlign:"right",marginRight:"12px"},children:["对话路径",(0,m.jsx)("span",{style:{color:"red"},children:"*"}),":"]}),(0,m.jsx)(j.pd,{placeholder:"对话补全路径",value:s.completionsPath,onChange:e=>o(t=>({...t,completionsPath:e})),style:{flex:1}})]}),l.completionsPath&&(0,m.jsx)("div",{style:{marginLeft:"132px",color:"red",fontSize:"12px"},children:l.completionsPath})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsxs)("div",{style:{marginBottom:"8px",display:"flex",alignItems:"center"},children:[(0,m.jsxs)("span",{style:{width:"120px",textAlign:"right",marginRight:"12px"},children:["嵌入路径",(0,m.jsx)("span",{style:{color:"red"},children:"*"}),":"]}),(0,m.jsx)(j.pd,{placeholder:"嵌入向量路径",value:s.embeddingsPath,onChange:e=>o(t=>({...t,embeddingsPath:e})),style:{flex:1}})]}),l.embeddingsPath&&(0,m.jsx)("div",{style:{marginLeft:"132px",color:"red",fontSize:"12px"},children:l.embeddingsPath})]}),(0,m.jsx)("div",{style:{marginBottom:"16px"},children:(0,m.jsxs)("div",{style:{display:"flex",alignItems:"center"},children:[(0,m.jsxs)("span",{style:{width:"120px",textAlign:"right",marginRight:"12px"},children:["状态",(0,m.jsx)("span",{style:{color:"red"},children:"*"}),":"]}),(0,m.jsxs)(j.l6,{placeholder:"请选择状态",value:s.status,onChange:e=>o(t=>({...t,status:e})),style:{flex:1},children:[(0,m.jsx)(j.l6.Option,{value:1,children:"启用"}),(0,m.jsx)(j.l6.Option,{value:0,children:"禁用"})]})]})}),(0,m.jsx)("div",{style:{textAlign:"right",marginTop:"20px"},children:(0,m.jsxs)(j.$x,{children:[(0,m.jsx)(j.$n,{onClick:h,children:"取消"}),(0,m.jsx)(j.$n,{type:"primary",onClick:c,loading:a,children:"保存"})]})})]})})},nc=e=>{let{visible:t,editingRecord:r,onCancel:i,onSuccess:a}=e,[n,s]=(0,g.useState)(!1),[o,l]=(0,g.useState)({baseUrl:"",apiKey:"",completionsPath:"",embeddingsPath:"",status:1}),[d,c]=(0,g.useState)({});(0,g.useEffect)(()=>{r&&l({baseUrl:r.baseUrl||"",apiKey:r.apiKey||"",completionsPath:r.completionsPath||"",embeddingsPath:r.embeddingsPath||"",status:r.status})},[r]);let p=async()=>{let e;if(e={},o.baseUrl.trim()?/^https?:\/\/.+/.test(o.baseUrl.trim())||(e.baseUrl="请输入有效的URL格式（以http://或https://开头）"):e.baseUrl="请输入基础URL",o.apiKey.trim()?o.apiKey.trim().length<10&&(e.apiKey="API密钥长度至少10个字符"):e.apiKey="请输入API密钥",o.completionsPath.trim()||(e.completionsPath="请输入对话路径"),o.embeddingsPath.trim()||(e.embeddingsPath="请输入嵌入路径"),c(e),0===Object.keys(e).length&&r){s(!0);try{let e={id:r.id,apiId:r.apiId,baseUrl:o.baseUrl.trim(),apiKey:o.apiKey.trim(),completionsPath:o.completionsPath.trim(),embeddingsPath:o.embeddingsPath.trim(),status:o.status},t=await nl.updateAiClientApiById(e);if("0000"===t.code&&t.data)j.y8.success("AI客户端API更新成功"),h(),a();else throw Error(t.info||"更新失败")}catch(e){console.error("更新AI客户端API失败:",e),j.y8.error(e instanceof Error?e.message:"更新失败，请稍后重试")}finally{s(!1)}}},h=()=>{l({baseUrl:"",apiKey:"",completionsPath:"",embeddingsPath:"",status:1}),c({})},u=()=>{h(),i()};return(0,m.jsx)(j.aF,{title:"编辑AI客户端API",visible:t,onCancel:u,footer:null,width:600,maskClosable:!1,children:(0,m.jsxs)("div",{style:{padding:"20px 0"},children:[(0,m.jsx)("div",{style:{marginBottom:"16px"},children:(0,m.jsxs)("div",{style:{marginBottom:"8px",display:"flex",alignItems:"center"},children:[(0,m.jsx)("span",{style:{width:"120px",textAlign:"right",marginRight:"12px"},children:"API ID:"}),(0,m.jsx)(j.pd,{value:(null==r?void 0:r.apiId)||"",disabled:!0,style:{flex:1}})]})}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsxs)("div",{style:{marginBottom:"8px",display:"flex",alignItems:"center"},children:[(0,m.jsxs)("span",{style:{width:"120px",textAlign:"right",marginRight:"12px"},children:["基础URL",(0,m.jsx)("span",{style:{color:"red"},children:"*"}),":"]}),(0,m.jsx)(j.pd,{placeholder:"请输入基础URL，如：https://api.openai.com",value:o.baseUrl,onChange:e=>l(t=>({...t,baseUrl:e})),style:{flex:1}})]}),d.baseUrl&&(0,m.jsx)("div",{style:{marginLeft:"132px",color:"red",fontSize:"12px"},children:d.baseUrl})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsxs)("div",{style:{marginBottom:"8px",display:"flex",alignItems:"center"},children:[(0,m.jsxs)("span",{style:{width:"120px",textAlign:"right",marginRight:"12px"},children:["API密钥",(0,m.jsx)("span",{style:{color:"red"},children:"*"}),":"]}),(0,m.jsx)(j.pd,{placeholder:"请输入API密钥",value:o.apiKey,onChange:e=>l(t=>({...t,apiKey:e})),style:{flex:1},type:"password"})]}),d.apiKey&&(0,m.jsx)("div",{style:{marginLeft:"132px",color:"red",fontSize:"12px"},children:d.apiKey})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsxs)("div",{style:{marginBottom:"8px",display:"flex",alignItems:"center"},children:[(0,m.jsxs)("span",{style:{width:"120px",textAlign:"right",marginRight:"12px"},children:["对话路径",(0,m.jsx)("span",{style:{color:"red"},children:"*"}),":"]}),(0,m.jsx)(j.pd,{placeholder:"对话补全路径",value:o.completionsPath,onChange:e=>l(t=>({...t,completionsPath:e})),style:{flex:1}})]}),d.completionsPath&&(0,m.jsx)("div",{style:{marginLeft:"132px",color:"red",fontSize:"12px"},children:d.completionsPath})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsxs)("div",{style:{marginBottom:"8px",display:"flex",alignItems:"center"},children:[(0,m.jsxs)("span",{style:{width:"120px",textAlign:"right",marginRight:"12px"},children:["嵌入路径",(0,m.jsx)("span",{style:{color:"red"},children:"*"}),":"]}),(0,m.jsx)(j.pd,{placeholder:"嵌入向量路径",value:o.embeddingsPath,onChange:e=>l(t=>({...t,embeddingsPath:e})),style:{flex:1}})]}),d.embeddingsPath&&(0,m.jsx)("div",{style:{marginLeft:"132px",color:"red",fontSize:"12px"},children:d.embeddingsPath})]}),(0,m.jsx)("div",{style:{marginBottom:"16px"},children:(0,m.jsxs)("div",{style:{display:"flex",alignItems:"center"},children:[(0,m.jsxs)("span",{style:{width:"120px",textAlign:"right",marginRight:"12px"},children:["状态",(0,m.jsx)("span",{style:{color:"red"},children:"*"}),":"]}),(0,m.jsxs)(j.l6,{placeholder:"请选择状态",value:o.status,onChange:e=>l(t=>({...t,status:e})),style:{flex:1},children:[(0,m.jsx)(j.l6.Option,{value:1,children:"启用"}),(0,m.jsx)(j.l6.Option,{value:0,children:"禁用"})]})]})}),(0,m.jsx)("div",{style:{textAlign:"right",marginTop:"20px"},children:(0,m.jsxs)(j.$x,{children:[(0,m.jsx)(j.$n,{onClick:u,children:"取消"}),(0,m.jsx)(j.$n,{type:"primary",onClick:p,loading:n,children:"保存"})]})})]})})},{Content:np}=j.PE,{Title:nh}=j.o5,nu=(0,E.Ay)(j.PE)`
  min-height: 100vh;
  background: ${k.secondary};
`,nm=E.Ay.div`
  display: flex;
  flex: 1;
  margin-left: ${e=>e.$collapsed?"80px":"280px"};
  transition: margin-left ${U.normal} ${Q.cubic};
`,ng=(0,E.Ay)(np)`
  flex: 1;
  padding: ${L.lg};
  background: ${k.secondary};
  overflow-y: auto;
`,nx=E.Ay.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`,ny=E.Ay.div`
  padding: ${L.lg};
  border-bottom: 1px solid ${T.secondary};
`,nf=(0,E.Ay)(j.Zp)`
  margin: ${L.lg};

  .semi-card-body {
    padding: ${L.lg};
  }
`,nj=E.Ay.div`
  display: flex;
  align-items: center;
  gap: ${L.base};
  flex-wrap: wrap;
`,nv=E.Ay.div`
  flex: 1;
  margin: 0 ${L.lg} ${L.lg};
  display: flex;
  flex-direction: column;
`,nb=(0,E.Ay)(j.Zp)`
  flex: 1;
  display: flex;
  flex-direction: column;

  .semi-card-body {
    padding: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`,nw=E.Ay.div`
  flex: 1;
  overflow: auto;
`,nA=(0,E.Ay)(j.$n)`
  margin-right: ${L.sm};
`,nC=()=>{let e=(0,y.Zp)(),[t,r]=(0,g.useState)(!1),[i,a]=(0,g.useState)(!1),[n,s]=(0,g.useState)([]),[o,l]=(0,g.useState)(!1),[d,c]=(0,g.useState)({apiId:"",status:void 0,pageNum:1,pageSize:10}),[p,h]=(0,g.useState)(!1),[u,x]=(0,g.useState)(null),[f,v]=(0,g.useState)(new Set),b=[{title:"ID",dataIndex:"id",key:"id",width:80},{title:"API ID",dataIndex:"apiId",key:"apiId",width:120},{title:"基础URL",dataIndex:"baseUrl",key:"baseUrl",width:250,render:e=>(0,m.jsx)("span",{title:e,style:{display:"block",maxWidth:"230px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:e})},{title:"对话路径",dataIndex:"completionsPath",key:"completionsPath",width:150,render:e=>e||"-"},{title:"嵌入路径",dataIndex:"embeddingsPath",key:"embeddingsPath",width:150,render:e=>e||"-"},{title:"API密钥",dataIndex:"apiKey",key:"apiKey",width:200,render:e=>(0,m.jsx)("span",{title:e?`点击复制完整API密钥: ${e}`:"无API密钥",style:{display:"block",maxWidth:"180px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:e?"pointer":"default",color:e?"#1890ff":"inherit",textDecoration:e?"underline":"none"},onClick:()=>e&&E(e),children:e?"***"+e.slice(-4):"-"})},{title:"状态",dataIndex:"status",key:"status",width:100,render:e=>(0,m.jsx)(j.vw,{color:1===e?"green":"red",children:1===e?"启用":"禁用"})},{title:"创建时间",dataIndex:"createTime",key:"createTime",width:180},{title:"更新时间",dataIndex:"updateTime",key:"updateTime",width:180},{title:"操作",key:"action",width:280,fixed:"right",render:(e,t)=>(0,m.jsxs)(j.$x,{children:[(0,m.jsx)(nA,{type:"tertiary",size:"small",icon:(0,m.jsx)(no.A,{}),loading:f.has(t.apiId),onClick:()=>$(t.apiId),children:"加载"}),(0,m.jsx)(nA,{type:"primary",size:"small",icon:(0,m.jsx)(aU.A,{}),onClick:()=>A(t),children:"编辑"}),(0,m.jsx)(j.iS,{title:"确定要删除这个API配置吗？",content:"删除后无法恢复",onConfirm:()=>C(t.apiId),okText:"确定",cancelText:"取消",children:(0,m.jsx)(nA,{type:"danger",size:"small",icon:(0,m.jsx)(aQ.A,{}),children:"删除"})})]})}],w=async()=>{try{a(!0);let e=await nl.queryAiClientApiList(d);"0000"===e.code?s(e.data||[]):j.y8.error(e.info||"查询失败")}catch(e){console.error("查询AI客户端API配置失败:",e),j.y8.error("查询失败，请稍后重试")}finally{a(!1)}},A=e=>{x(e),h(!0)},C=async e=>{try{let t=await nl.deleteAiClientApiByApiId(e);"0000"===t.code?(j.y8.success("删除成功"),w()):j.y8.error(t.info||"删除失败")}catch(e){console.error("删除AI客户端API配置失败:",e),j.y8.error("删除失败，请稍后重试")}},E=async e=>{try{await navigator.clipboard.writeText(e),j.y8.success("API密钥已复制到剪贴板")}catch(t){console.error("复制失败:",t);try{let t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.left="-999999px",t.style.top="-999999px",document.body.appendChild(t),t.focus(),t.select(),document.execCommand("copy"),document.body.removeChild(t),j.y8.success("API密钥已复制到剪贴板")}catch(e){console.error("降级复制方案也失败:",e),j.y8.error("复制失败，请手动复制")}}},$=async e=>{try{v(t=>new Set(t).add(e)),await eo.armoryApi(e)?j.y8.success("API加载成功"):j.y8.error("API加载失败")}catch(e){console.error("加载API失败:",e),j.y8.error("加载API失败，请稍后重试")}finally{v(t=>{let r=new Set(t);return r.delete(e),r})}};return(0,g.useEffect)(()=>{w()},[]),(0,m.jsxs)(nu,{children:[(0,m.jsx)(ez,{collapsed:t,selectedKey:"ai-client-api-management",onSelect:t=>{switch(t){case"dashboard":e("/dashboard");break;case"agent-list":e("/agent-list");break;case"agent-config":e("/agent-config");break;case"client-management":e("/client-management");break;case"ai-client-api-management":e("/ai-client-api-management");break;case"advisor-management":e("/advisor-management");break;case"rag-order-management":e("/rag-order-management");break;case"client-model-management":e("/client-model-management");break;case"client-system-prompt-management":e("/client-system-prompt-management");break;case"client-tool-mcp-management":e("/client-tool-mcp-management")}}}),(0,m.jsx)(nm,{$collapsed:t,children:(0,m.jsxs)(ng,{children:[(0,m.jsx)(e6,{collapsed:t,onToggleSidebar:()=>r(!t),onLogout:()=>e("/login")}),(0,m.jsxs)(nx,{children:[(0,m.jsx)(ny,{children:(0,m.jsx)(nh,{heading:3,children:"模型API管理"})}),(0,m.jsx)(nf,{children:(0,m.jsxs)(nj,{children:[(0,m.jsx)(j.pd,{placeholder:"请输入API ID",value:d.apiId,onChange:e=>c(t=>({...t,apiId:e})),style:{width:200}}),(0,m.jsx)(j.$n,{type:"primary",icon:(0,m.jsx)(eF.A,{}),onClick:()=>{c(e=>({...e,pageNum:1})),w()},loading:i,children:"搜索"}),(0,m.jsx)(j.$n,{icon:(0,m.jsx)(aX.A,{}),onClick:()=>{c({apiId:"",status:void 0,pageNum:1,pageSize:10})},children:"重置"})]})}),(0,m.jsx)(nv,{children:(0,m.jsxs)(nb,{children:[(0,m.jsx)("div",{style:{padding:"16px",borderBottom:"1px solid #e6e6e6"},children:(0,m.jsxs)(j.$x,{children:[(0,m.jsx)(j.$n,{type:"primary",icon:(0,m.jsx)(it.A,{}),onClick:()=>{l(!0)},children:"新增API"}),(0,m.jsx)(j.$n,{icon:(0,m.jsx)(aX.A,{}),onClick:()=>{w()},loading:i,children:"刷新"})]})}),(0,m.jsx)(nw,{children:(0,m.jsx)(j.XI,{columns:b,dataSource:n,loading:i,pagination:!1,scroll:{x:1680,y:"calc(100vh - 400px)"},rowKey:"id"})})]})})]})]})}),(0,m.jsx)(nd,{visible:o,onCancel:()=>{l(!1)},onSuccess:()=>{l(!1),w()}}),(0,m.jsx)(nc,{visible:p,editingRecord:u,onCancel:()=>{h(!1),x(null)},onSuccess:()=>{h(!1),x(null),w()}})]})},nE=new class{async createAdvisor(e){let t=await fetch(`${this.baseUrl}/create`,{method:"POST",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async updateAdvisorById(e){let t=await fetch(`${this.baseUrl}/update-by-id`,{method:"PUT",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async updateAdvisorByAdvisorId(e){let t=await fetch(`${this.baseUrl}/update-by-advisor-id`,{method:"PUT",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async deleteAdvisorById(e){let t=await fetch(`${this.baseUrl}/delete-by-id/${e}`,{method:"DELETE",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async deleteAdvisorByAdvisorId(e){let t=await fetch(`${this.baseUrl}/delete-by-advisor-id/${e}`,{method:"DELETE",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryAdvisorById(e){let t=await fetch(`${this.baseUrl}/query-by-id/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryAdvisorByAdvisorId(e){let t=await fetch(`${this.baseUrl}/query-by-advisor-id/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryEnabledAdvisors(){let e=await fetch(`${this.baseUrl}/query-enabled`,{method:"GET",headers:{...ee}});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return await e.json()}async queryAdvisorsByStatus(e){let t=await fetch(`${this.baseUrl}/query-by-status/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryAdvisorsByType(e){let t=await fetch(`${this.baseUrl}/query-by-type/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryAdvisorList(e){let t=await fetch(`${this.baseUrl}/query-list`,{method:"POST",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryAllAdvisors(){let e=await fetch(`${this.baseUrl}/query-all`,{method:"GET",headers:{...ee}});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return await e.json()}constructor(){this.baseUrl=`${G}/api/v1/admin/ai-client-advisor`}},{Content:n$}=j.PE,{Title:nI}=j.o5,{Option:nk}=j.l6,nT=(0,E.Ay)(j.PE)`
  min-height: 100vh;
  background: ${k.secondary};
`,nS=E.Ay.div`
  display: flex;
  flex: 1;
  margin-left: ${e=>e.$collapsed?"80px":"280px"};
  transition: margin-left ${U.normal} ${Q.cubic};
`,nN=(0,E.Ay)(n$)`
  flex: 1;
  padding: ${L.lg};
  background: ${k.secondary};
  overflow-y: auto;
`,nP=E.Ay.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`,nB=E.Ay.div`
  padding: ${L.lg};
  border-bottom: 1px solid ${T.secondary};
`,nL=(0,E.Ay)(j.Zp)`
  margin: ${L.lg};

  .semi-card-body {
    padding: ${L.lg};
  }
`,nD=E.Ay.div`
  display: flex;
  align-items: center;
  gap: ${L.base};
  flex-wrap: wrap;
`,nM=E.Ay.div`
  flex: 1;
  margin: 0 ${L.lg} ${L.lg};
  display: flex;
  flex-direction: column;
`,n_=(0,E.Ay)(j.Zp)`
  flex: 1;
  display: flex;
  flex-direction: column;

  .semi-card-body {
    padding: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`,nR=E.Ay.div`
  flex: 1;
  overflow: auto;
`,nO=(0,E.Ay)(j.$n)`
  margin-right: ${L.sm};
`,nU=()=>{let e=(0,y.Zp)(),[t,r]=(0,g.useState)(!1),[i,a]=(0,g.useState)(!1),[n,s]=(0,g.useState)([]),[o,l]=(0,g.useState)(""),[d,c]=(0,g.useState)(""),[p,h]=(0,g.useState)(void 0),[u,x]=(0,g.useState)(1),[f,v]=(0,g.useState)(10),[b,w]=(0,g.useState)(0),[A,C]=(0,g.useState)(!1),[E,$]=(0,g.useState)(!1),[I,k]=(0,g.useState)({advisorName:"",advisorType:"",orderNum:1,extParam:"",status:1}),[T,S]=(0,g.useState)(!1),[N,P]=(0,g.useState)(!1),[B,L]=(0,g.useState)({id:0,advisorId:"",advisorName:"",advisorType:"",orderNum:1,extParam:"",status:1});JSON.parse(localStorage.getItem("userInfo")||"{}");let D=[{title:"ID",dataIndex:"id",key:"id",width:80},{title:"顾问ID",dataIndex:"advisorId",key:"advisorId",width:150},{title:"顾问名称",dataIndex:"advisorName",key:"advisorName",width:200},{title:"顾问类型",dataIndex:"advisorType",key:"advisorType",width:120,render:e=>(0,m.jsx)(j.vw,{color:"blue",children:e})},{title:"状态",dataIndex:"status",key:"status",width:100,render:e=>(0,m.jsx)(j.vw,{color:1===e?"green":"red",children:1===e?"启用":"禁用"})},{title:"创建时间",dataIndex:"createTime",key:"createTime",width:180,render:e=>new Date(e).toLocaleString()},{title:"更新时间",dataIndex:"updateTime",key:"updateTime",width:180,render:e=>new Date(e).toLocaleString()},{title:"操作",key:"action",width:150,fixed:"right",render:(e,t)=>(0,m.jsxs)(j.$x,{children:[(0,m.jsx)(nO,{theme:"borderless",type:"primary",icon:(0,m.jsx)(aU.A,{}),size:"small",onClick:()=>R(t),children:"编辑"}),(0,m.jsx)(j.iS,{title:"确定要删除这个顾问配置吗？",content:"删除后无法恢复，请谨慎操作",onConfirm:()=>_(t),okText:"确定",cancelText:"取消",children:(0,m.jsx)(nO,{theme:"borderless",type:"danger",icon:(0,m.jsx)(aQ.A,{}),size:"small",children:"删除"})})]})}],M=async()=>{a(!0);try{let e=await nE.queryAdvisorList({advisorName:o||void 0,advisorType:d||void 0,status:p,pageNum:u,pageSize:f});if("0000"===e.code){let t=e.data||[];s(t),w(t.length)}else throw Error(e.info||"查询失败")}catch(e){console.error("获取顾问列表失败:",e),j.y8.error("获取顾问列表失败，请检查网络连接"),s([]),w(0)}finally{a(!1)}},_=async e=>{try{let t=await nE.deleteAdvisorById(e.id);if("0000"===t.code&&t.data)j.y8.success("删除成功"),M();else throw Error(t.info||"删除失败")}catch(e){console.error("删除顾问失败:",e),j.y8.error("删除失败，请检查网络连接")}},R=e=>{L({id:e.id,advisorId:e.advisorId,advisorName:e.advisorName,advisorType:e.advisorType,orderNum:e.orderNum||1,extParam:e.extParam||"{}",status:e.status}),S(!0)},O=()=>{C(!1),k({advisorName:"",advisorType:"",orderNum:1,extParam:"",status:1})},U=()=>{S(!1),L({id:0,advisorId:"",advisorName:"",advisorType:"",orderNum:1,extParam:"",status:1})},Q=async()=>{if(!B.advisorName.trim())return void j.y8.error("请输入顾问名称");if(!B.advisorType.trim())return void j.y8.error("请输入顾问类型");P(!0);try{let e={advisorId:B.advisorId,advisorName:B.advisorName.trim(),advisorType:B.advisorType.trim(),orderNum:B.orderNum,extParam:B.extParam.trim()||"{}",status:B.status},t=await nE.updateAdvisorByAdvisorId(e);if("0000"===t.code&&t.data)j.y8.success("更新顾问成功"),U(),M();else throw Error(t.info||"更新失败")}catch(e){console.error("更新顾问失败:",e),j.y8.error("更新失败，请检查网络连接")}finally{P(!1)}},z=async()=>{if(!I.advisorName.trim())return void j.y8.error("请输入顾问名称");if(!I.advisorType.trim())return void j.y8.error("请输入顾问类型");$(!0);try{let e={advisorId:Math.floor(1e7+9e7*Math.random()).toString(),advisorName:I.advisorName.trim(),advisorType:I.advisorType.trim(),orderNum:I.orderNum,extParam:I.extParam.trim()||"{}",status:I.status},t=await nE.createAdvisor(e);if("0000"===t.code&&t.data)j.y8.success("创建顾问成功"),O(),M();else throw Error(t.info||"创建失败")}catch(e){console.error("创建顾问失败:",e),j.y8.error("创建失败，请检查网络连接")}finally{$(!1)}},q=()=>{x(1),M()};return(0,g.useEffect)(()=>{M()},[]),(0,m.jsxs)(nT,{children:[(0,m.jsx)(ez,{collapsed:t,selectedKey:"advisor-management",onSelect:t=>{switch(t){case"dashboard":e("/dashboard");break;case"agent-list":e("/agent-list");break;case"agent-config":e("/agent-config");break;case"client-management":e("/client-management");break;case"ai-client-api-management":e("/ai-client-api-management");break;case"advisor-management":e("/advisor-management");break;case"rag-order-management":e("/rag-order-management");break;case"client-model-management":e("/client-model-management");break;case"client-system-prompt-management":e("/client-system-prompt-management");break;case"client-tool-mcp-management":e("/client-tool-mcp-management");break;default:e(t)}}}),(0,m.jsx)(nS,{$collapsed:t,children:(0,m.jsxs)(nN,{children:[(0,m.jsx)(e6,{collapsed:t,onToggleSidebar:()=>r(!t),onLogout:()=>{localStorage.removeItem("token"),localStorage.removeItem("userInfo"),localStorage.removeItem("isLoggedIn"),j.y8.success("已退出登录"),e("/login")}}),(0,m.jsxs)(nP,{children:[(0,m.jsx)(nB,{children:(0,m.jsx)(nI,{heading:3,style:{margin:0},children:"顾问配置管理"})}),(0,m.jsx)(nL,{children:(0,m.jsxs)(nD,{children:[(0,m.jsx)(j.pd,{placeholder:"请输入顾问名称",value:o,onChange:l,style:{width:200},onEnterPress:q}),(0,m.jsx)(j.pd,{placeholder:"请输入顾问类型",value:d,onChange:c,style:{width:200},onEnterPress:q}),(0,m.jsxs)(j.l6,{placeholder:"选择状态",value:p,onChange:e=>h(e),style:{width:120},children:[(0,m.jsx)(nk,{value:1,children:"启用"}),(0,m.jsx)(nk,{value:0,children:"禁用"})]}),(0,m.jsx)(j.$n,{type:"primary",icon:(0,m.jsx)(eF.A,{}),onClick:q,children:"搜索"}),(0,m.jsx)(j.$n,{icon:(0,m.jsx)(aX.A,{}),onClick:()=>{l(""),c(""),h(void 0),x(1),M()},children:"重置"}),(0,m.jsx)(j.$n,{type:"primary",theme:"solid",icon:(0,m.jsx)(it.A,{}),onClick:()=>{k({advisorName:"",advisorType:"",orderNum:1,extParam:"",status:1}),C(!0)},children:"新增顾问"})]})}),(0,m.jsx)(nM,{children:(0,m.jsx)(n_,{children:(0,m.jsx)(nR,{children:(0,m.jsx)(j.XI,{columns:D,dataSource:n,loading:i,pagination:{currentPage:u,pageSize:f,total:b,showSizeChanger:!0,showQuickJumper:!0,onChange:(e,t)=>{x(e),t&&t!==f&&v(t),M()}},rowKey:"id",scroll:{x:900},empty:(0,m.jsx)("div",{style:{padding:"40px",textAlign:"center"},children:(0,m.jsx)(j.o5.Text,{type:"tertiary",children:"暂无数据"})})})})})})]})]})}),(0,m.jsx)(j.aF,{title:"新增顾问",visible:A,onOk:z,onCancel:O,confirmLoading:E,width:600,okText:"确定",cancelText:"取消",children:(0,m.jsxs)("div",{style:{padding:"20px 0"},children:[(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsx)(j.o5.Text,{strong:!0,children:"顾问名称 *"}),(0,m.jsx)(j.pd,{placeholder:"请输入顾问名称",value:I.advisorName,onChange:e=>k(t=>({...t,advisorName:e})),style:{marginTop:"8px"}})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsx)(j.o5.Text,{strong:!0,children:"顾问类型 *"}),(0,m.jsxs)(j.l6,{placeholder:"请选择顾问类型",value:I.advisorType,onChange:e=>k(t=>({...t,advisorType:e})),style:{width:"100%",marginTop:"8px"},children:[(0,m.jsx)(nk,{value:"ChatMemory",children:"记忆"}),(0,m.jsx)(nk,{value:"RagAnswer",children:"知识库"}),(0,m.jsx)(nk,{value:"SimpleLoggerAdvisor",children:"简单日志"})]})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsx)(j.o5.Text,{strong:!0,children:"顺序号"}),(0,m.jsx)(j.pd,{type:"number",placeholder:"请输入顺序号",value:I.orderNum.toString(),onChange:e=>k(t=>({...t,orderNum:parseInt(e)||1})),style:{marginTop:"8px"}})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsx)(j.o5.Text,{strong:!0,children:"扩展参数"}),(0,m.jsx)(j.fs,{placeholder:"请输入JSON格式的扩展参数，如：{}",value:I.extParam,onChange:e=>k(t=>({...t,extParam:e})),rows:4,style:{marginTop:"8px"}})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsx)(j.o5.Text,{strong:!0,children:"状态"}),(0,m.jsxs)(j.l6,{value:I.status,onChange:e=>k(t=>({...t,status:e})),style:{width:"100%",marginTop:"8px"},children:[(0,m.jsx)(nk,{value:1,children:"启用"}),(0,m.jsx)(nk,{value:0,children:"禁用"})]})]})]})}),(0,m.jsx)(j.aF,{title:"编辑顾问",visible:T,onOk:Q,onCancel:U,confirmLoading:N,width:600,okText:"确定",cancelText:"取消",children:(0,m.jsxs)("div",{style:{padding:"20px 0"},children:[(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsx)(j.o5.Text,{strong:!0,children:"顾问ID"}),(0,m.jsx)(j.pd,{value:B.advisorId,disabled:!0,style:{marginTop:"8px"}})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsx)(j.o5.Text,{strong:!0,children:"顾问名称 *"}),(0,m.jsx)(j.pd,{placeholder:"请输入顾问名称",value:B.advisorName,onChange:e=>L(t=>({...t,advisorName:e})),style:{marginTop:"8px"}})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsx)(j.o5.Text,{strong:!0,children:"顾问类型 *"}),(0,m.jsxs)(j.l6,{placeholder:"请选择顾问类型",value:B.advisorType,onChange:e=>L(t=>({...t,advisorType:e})),style:{width:"100%",marginTop:"8px"},children:[(0,m.jsx)(nk,{value:"ChatMemory",children:"记忆"}),(0,m.jsx)(nk,{value:"RagAnswer",children:"知识库"}),(0,m.jsx)(nk,{value:"SimpleLoggerAdvisor",children:"简单日志"})]})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsx)(j.o5.Text,{strong:!0,children:"顺序号"}),(0,m.jsx)(j.pd,{type:"number",placeholder:"请输入顺序号",value:B.orderNum.toString(),onChange:e=>L(t=>({...t,orderNum:parseInt(e)||1})),style:{marginTop:"8px"}})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsx)(j.o5.Text,{strong:!0,children:"扩展参数"}),(0,m.jsx)(j.fs,{placeholder:"请输入JSON格式的扩展参数，如：{}",value:B.extParam,onChange:e=>L(t=>({...t,extParam:e})),rows:4,style:{marginTop:"8px"}})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsx)(j.o5.Text,{strong:!0,children:"状态"}),(0,m.jsxs)(j.l6,{value:B.status,onChange:e=>L(t=>({...t,status:e})),style:{width:"100%",marginTop:"8px"},children:[(0,m.jsx)(nk,{value:1,children:"启用"}),(0,m.jsx)(nk,{value:0,children:"禁用"})]})]})]})})]})};var nQ=r(8708);let nz=new class{async createRagOrder(e){let t=await fetch(`${this.baseUrl}/create`,{method:"POST",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async updateRagOrderById(e){let t=await fetch(`${this.baseUrl}/update-by-id`,{method:"PUT",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async updateRagOrderByRagId(e){let t=await fetch(`${this.baseUrl}/update-by-rag-id`,{method:"PUT",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async deleteRagOrderById(e){let t=await fetch(`${this.baseUrl}/delete-by-id/${e}`,{method:"DELETE",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async deleteRagOrderByRagId(e){let t=await fetch(`${this.baseUrl}/delete-by-rag-id/${e}`,{method:"DELETE",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryRagOrderById(e){let t=await fetch(`${this.baseUrl}/query-by-id/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryRagOrderByRagId(e){let t=await fetch(`${this.baseUrl}/query-by-rag-id/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryEnabledRagOrders(){let e=await fetch(`${this.baseUrl}/query-enabled`,{method:"GET",headers:{...ee}});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return await e.json()}async queryRagOrdersByKnowledgeTag(e){let t=await fetch(`${this.baseUrl}/query-by-knowledge-tag/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryRagOrdersByStatus(e){let t=await fetch(`${this.baseUrl}/query-by-status/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryRagOrderList(e){let t=await fetch(`${this.baseUrl}/query-list`,{method:"POST",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryAllRagOrders(){let e=await fetch(`${this.baseUrl}/query-all`,{method:"GET",headers:{...ee}});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return await e.json()}async uploadRagFile(e,t,r){let i=new FormData;i.append("name",e),i.append("tag",t),r.forEach(e=>{i.append("files",e)});let a=localStorage.getItem("token"),n={};a&&(n.Authorization=`Bearer ${a}`);let s=await fetch(`${this.baseUrl}/file/upload`,{method:"POST",headers:n,body:i});if(!s.ok)throw Error(`HTTP error! status: ${s.status}`);return await s.json()}constructor(){this.baseUrl=`${G}/api/v1/admin/ai-client-rag-order`}},{Content:nq}=j.PE,{Title:nV}=j.o5,{Option:nF}=j.l6,nY=(0,E.Ay)(j.PE)`
  min-height: 100vh;
  background: ${k.secondary};
`,nH=E.Ay.div`
  display: flex;
  flex: 1;
  margin-left: ${e=>e.$collapsed?"80px":"280px"};
  transition: margin-left ${U.normal} ${Q.cubic};
`,nJ=(0,E.Ay)(nq)`
  flex: 1;
  padding: ${L.lg};
  background: ${k.secondary};
  overflow-y: auto;
`,nK=E.Ay.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`,nZ=E.Ay.div`
  padding: ${L.lg};
  border-bottom: 1px solid ${T.secondary};
`,nG=(0,E.Ay)(j.Zp)`
  margin: ${L.lg};

  .semi-card-body {
    padding: ${L.lg};
  }
`,nW=E.Ay.div`
  display: flex;
  align-items: center;
  gap: ${L.base};
  flex-wrap: wrap;
`,nX=E.Ay.div`
  flex: 1;
  margin: 0 ${L.lg} ${L.lg};
  display: flex;
  flex-direction: column;
`,n0=(0,E.Ay)(j.Zp)`
  flex: 1;
  display: flex;
  flex-direction: column;

  .semi-card-body {
    padding: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`,n1=E.Ay.div`
  flex: 1;
  overflow: auto;
`,n2=(0,E.Ay)(j.$n)`
  margin-right: ${L.sm};
`,n5=()=>{let e=(0,y.Zp)(),[t,r]=(0,g.useState)(!1),[i,a]=(0,g.useState)(!1),[n,s]=(0,g.useState)([]),[o,l]=(0,g.useState)(""),[d,c]=(0,g.useState)(""),[p,h]=(0,g.useState)(""),[u,x]=(0,g.useState)(void 0),[f,v]=(0,g.useState)(1),[b,w]=(0,g.useState)(10),[A,C]=(0,g.useState)(0),[E,$]=(0,g.useState)(!1),[I,k]=(0,g.useState)(!1),[T,S]=(0,g.useState)(null),[N,P]=(0,g.useState)([]),B=[{title:"ID",dataIndex:"id",key:"id",width:80},{title:"知识库ID",dataIndex:"ragId",key:"ragId",width:150},{title:"知识库名称",dataIndex:"ragName",key:"ragName",width:200},{title:"知识标签",dataIndex:"knowledgeTag",key:"knowledgeTag",width:150,render:e=>(0,m.jsx)(j.vw,{color:"blue",children:e})},{title:"状态",dataIndex:"status",key:"status",width:100,render:e=>(0,m.jsx)(j.vw,{color:1===e?"green":"red",children:1===e?"启用":"禁用"})},{title:"创建时间",dataIndex:"createTime",key:"createTime",width:180,render:e=>new Date(e).toLocaleString()},{title:"更新时间",dataIndex:"updateTime",key:"updateTime",width:180,render:e=>new Date(e).toLocaleString()},{title:"操作",key:"action",width:120,fixed:"right",render:(e,t)=>(0,m.jsx)(j.$x,{children:(0,m.jsx)(j.iS,{title:"确定要删除这个知识库配置吗？",content:"删除后无法恢复，请谨慎操作",onConfirm:()=>D(t),okText:"确定",cancelText:"取消",children:(0,m.jsx)(n2,{theme:"borderless",type:"danger",icon:(0,m.jsx)(aQ.A,{}),size:"small",children:"删除"})})})}],L=async()=>{a(!0);try{let e=await nz.queryRagOrderList({ragId:o||void 0,ragName:d||void 0,knowledgeTag:p||void 0,status:u,pageNum:f,pageSize:b});if("0000"===e.code){let t=e.data||[];s(t),C(t.length)}else throw Error(e.info||"查询失败")}catch(e){console.error("获取知识库配置列表失败:",e),j.y8.error("获取知识库配置列表失败，请检查网络连接"),s([]),C(0)}finally{a(!1)}},D=async e=>{try{let t=await nz.deleteRagOrderById(e.id);if("0000"===t.code&&t.data)j.y8.success("删除成功"),L();else throw Error(t.info||"删除失败")}catch(e){console.error("删除知识库配置失败:",e),j.y8.error("删除失败，请检查网络连接")}},M=()=>{$(!1),T&&T.reset(),P([])},_=async()=>{try{if(!T)return void j.y8.error("表单未初始化");let e=await T.validate();if(0===N.length)return void j.y8.error("请选择要上传的文件");k(!0);let t=N.map(e=>e.fileInstance),r=await nz.uploadRagFile(e.name,e.tag,t);if("0000"===r.code&&r.data)j.y8.success("上传成功"),M(),L();else throw Error(r.info||"上传失败")}catch(e){console.error("上传知识库文件失败:",e),j.y8.error("上传失败，请检查网络连接")}finally{k(!1)}},R=()=>{v(1),L()};return(0,g.useEffect)(()=>{L()},[]),(0,m.jsxs)(nY,{children:[(0,m.jsx)(ez,{collapsed:t,selectedKey:"rag-order-management",onSelect:t=>{switch(t){case"dashboard":e("/dashboard");break;case"agent-list":e("/agent-list");break;case"agent-config":e("/agent-config");break;case"client-management":e("/client-management");break;case"ai-client-api-management":e("/ai-client-api-management");break;case"advisor-management":e("/advisor-management");break;case"rag-order-management":e("/rag-order-management");break;case"client-model-management":e("/client-model-management");break;case"client-system-prompt-management":e("/client-system-prompt-management");break;case"client-tool-mcp-management":e("/client-tool-mcp-management");break;default:e(t)}}}),(0,m.jsx)(nH,{$collapsed:t,children:(0,m.jsxs)(nJ,{children:[(0,m.jsx)(e6,{collapsed:t,onToggleSidebar:()=>r(!t),onLogout:()=>{localStorage.removeItem("token"),localStorage.removeItem("userInfo"),localStorage.removeItem("isLoggedIn"),j.y8.success("已退出登录"),e("/login")}}),(0,m.jsxs)(nK,{children:[(0,m.jsx)(nZ,{children:(0,m.jsx)(nV,{heading:3,style:{margin:0},children:"知识库配置管理"})}),(0,m.jsx)(nG,{children:(0,m.jsxs)(nW,{children:[(0,m.jsx)(j.pd,{placeholder:"请输入知识库ID",value:o,onChange:l,style:{width:200},onEnterPress:R}),(0,m.jsx)(j.pd,{placeholder:"请输入知识库名称",value:d,onChange:c,style:{width:200},onEnterPress:R}),(0,m.jsx)(j.pd,{placeholder:"请输入知识标签",value:p,onChange:h,style:{width:200},onEnterPress:R}),(0,m.jsxs)(j.l6,{placeholder:"选择状态",value:u,onChange:e=>x(e),style:{width:120},children:[(0,m.jsx)(nF,{value:1,children:"启用"}),(0,m.jsx)(nF,{value:0,children:"禁用"})]}),(0,m.jsx)(j.$n,{type:"primary",icon:(0,m.jsx)(eF.A,{}),onClick:R,children:"搜索"}),(0,m.jsx)(j.$n,{icon:(0,m.jsx)(aX.A,{}),onClick:()=>{l(""),c(""),h(""),x(void 0),v(1),L()},children:"重置"}),(0,m.jsx)(j.$n,{type:"primary",theme:"solid",icon:(0,m.jsx)(nQ.A,{}),onClick:()=>{$(!0),T&&T.reset(),P([])},style:{marginLeft:"auto"},children:"上传知识库"})]})}),(0,m.jsx)(nX,{children:(0,m.jsx)(n0,{children:(0,m.jsx)(n1,{children:(0,m.jsx)(j.XI,{columns:B,dataSource:n,loading:i,pagination:{currentPage:f,pageSize:b,total:A,showSizeChanger:!0,showQuickJumper:!0,onChange:(e,t)=>{v(e),t&&t!==b&&w(t),L()}},rowKey:"id",scroll:{x:900},empty:(0,m.jsx)("div",{style:{padding:"40px",textAlign:"center"},children:(0,m.jsx)(j.o5.Text,{type:"tertiary",children:"暂无数据"})})})})})})]}),(0,m.jsx)(j.aF,{title:"上传知识库文件",visible:E,onOk:_,onCancel:M,confirmLoading:I,width:600,okText:"确认上传",cancelText:"取消",children:(0,m.jsxs)(j.lV,{getFormApi:e=>S(e),labelPosition:"left",labelWidth:100,style:{padding:"20px 0"},children:[(0,m.jsx)(j.lV.Input,{field:"name",label:"知识库名称",placeholder:"请输入知识库名称",rules:[{required:!0,message:"请输入知识库名称"},{min:2,message:"知识库名称至少2个字符"},{max:50,message:"知识库名称不能超过50个字符"}]}),(0,m.jsx)(j.lV.Input,{field:"tag",label:"知识标签",placeholder:"请输入知识标签",rules:[{required:!0,message:"请输入知识标签"},{min:2,message:"知识标签至少2个字符"},{max:30,message:"知识标签不能超过30个字符"}]}),(0,m.jsx)(j.lV.Slot,{label:"上传文件",children:(0,m.jsx)(j._O,{action:"",beforeUpload:e=>{if(e&&e.name){let t=e.name.toLowerCase();if(t.endsWith(".txt")||t.endsWith(".pdf")||t.endsWith(".doc")||t.endsWith(".docx")||t.endsWith(".md"))if(e.size<=0xa00000)return!0;else j.y8.error("文件大小不能超过10MB");else j.y8.error("不支持的文件类型")}return!1},onChange:e=>{P(e.fileList||[])},fileList:N,accept:".txt,.pdf,.doc,.docx,.md",multiple:!1,showUploadList:!0,children:(0,m.jsx)(j.$n,{icon:(0,m.jsx)(it.A,{}),theme:"light",children:"选择文件"})})})]})})]})})]})};class n6{static async createAiClientModel(e){try{let t=await fetch(`${this.BASE_URL}${X.AI_CLIENT_MODEL.CREATE}`,{method:"POST",headers:ee,body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}catch(e){throw console.error("创建AI客户端模型配置失败:",e),e}}static async updateAiClientModelById(e){try{let t=await fetch(`${this.BASE_URL}${X.AI_CLIENT_MODEL.UPDATE_BY_ID}`,{method:"PUT",headers:ee,body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}catch(e){throw console.error("根据ID更新AI客户端模型配置失败:",e),e}}static async updateAiClientModelByModelId(e){try{let t=await fetch(`${this.BASE_URL}${X.AI_CLIENT_MODEL.UPDATE_BY_MODEL_ID}`,{method:"PUT",headers:ee,body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}catch(e){throw console.error("根据模型ID更新AI客户端模型配置失败:",e),e}}static async deleteAiClientModelById(e){try{let t=await fetch(`${this.BASE_URL}${X.AI_CLIENT_MODEL.DELETE_BY_ID}/${e}`,{method:"DELETE",headers:ee});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}catch(e){throw console.error("根据ID删除AI客户端模型配置失败:",e),e}}static async deleteAiClientModelByModelId(e){try{let t=await fetch(`${this.BASE_URL}${X.AI_CLIENT_MODEL.DELETE_BY_MODEL_ID}/${e}`,{method:"DELETE",headers:ee});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}catch(e){throw console.error("根据模型ID删除AI客户端模型配置失败:",e),e}}static async queryAiClientModelById(e){try{let t=await fetch(`${this.BASE_URL}${X.AI_CLIENT_MODEL.QUERY_BY_ID}/${e}`,{method:"GET",headers:ee});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}catch(e){throw console.error("根据ID查询AI客户端模型配置失败:",e),e}}static async queryAiClientModelByModelId(e){try{let t=await fetch(`${this.BASE_URL}${X.AI_CLIENT_MODEL.QUERY_BY_MODEL_ID}/${e}`,{method:"GET",headers:ee});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}catch(e){throw console.error("根据模型ID查询AI客户端模型配置失败:",e),e}}static async queryAiClientModelsByApiId(e){try{let t=await fetch(`${this.BASE_URL}${X.AI_CLIENT_MODEL.QUERY_BY_API_ID}/${e}`,{method:"GET",headers:ee});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}catch(e){throw console.error("根据API配置ID查询AI客户端模型配置列表失败:",e),e}}static async queryAiClientModelsByModelType(e){try{let t=await fetch(`${this.BASE_URL}${X.AI_CLIENT_MODEL.QUERY_BY_MODEL_TYPE}/${e}`,{method:"GET",headers:ee});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}catch(e){throw console.error("根据模型类型查询AI客户端模型配置列表失败:",e),e}}static async queryEnabledAiClientModels(){try{let e=await fetch(`${this.BASE_URL}${X.AI_CLIENT_MODEL.QUERY_ENABLED}`,{method:"GET",headers:ee});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return await e.json()}catch(e){throw console.error("查询所有启用的AI客户端模型配置失败:",e),e}}static async queryAiClientModelList(e){try{let t=await fetch(`${this.BASE_URL}${X.AI_CLIENT_MODEL.QUERY_LIST}`,{method:"POST",headers:ee,body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}catch(e){throw console.error("根据条件查询AI客户端模型配置列表失败:",e),e}}static async queryAllAiClientModels(){try{let e=await fetch(`${this.BASE_URL}${X.AI_CLIENT_MODEL.QUERY_ALL}`,{method:"GET",headers:ee});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return await e.json()}catch(e){throw console.error("查询所有AI客户端模型配置失败:",e),e}}}n6.BASE_URL=X.AI_CLIENT_MODEL.BASE;let{Content:n8}=j.PE,{Title:n3}=j.o5,n9=(0,E.Ay)(j.PE)`
  min-height: 100vh;
  background: ${k.secondary};
`,n4=E.Ay.div`
  display: flex;
  flex: 1;
  margin-left: ${e=>e.$collapsed?"80px":"280px"};
  transition: margin-left ${U.normal} ${Q.cubic};
`,n7=(0,E.Ay)(n8)`
  flex: 1;
  padding: ${L.lg};
  background: ${k.secondary};
  overflow-y: auto;
`,se=E.Ay.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`,st=E.Ay.div`
  padding: ${L.lg};
  border-bottom: 1px solid ${T.secondary};
`,sr=(0,E.Ay)(j.Zp)`
  margin: ${L.lg};

  .semi-card-body {
    padding: ${L.lg};
  }
`,si=E.Ay.div`
  display: flex;
  align-items: center;
  gap: ${L.base};
  flex-wrap: wrap;
`,sa=E.Ay.div`
  flex: 1;
  margin: 0 ${L.lg} ${L.lg};
  display: flex;
  flex-direction: column;
`,sn=(0,E.Ay)(j.Zp)`
  flex: 1;
  display: flex;
  flex-direction: column;

  .semi-card-body {
    padding: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`,ss=E.Ay.div`
  flex: 1;
  overflow: auto;
`,so=(0,E.Ay)(j.$n)`
  margin-right: ${L.sm};
`,sl=E.Ay.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  label {
    width: 100px;
    text-align: right;
    margin-right: 12px;
    font-weight: 500;
  }

  .form-control {
    flex: 1;
  }
`,sd=()=>{let e=(0,y.Zp)(),[t,r]=(0,g.useState)(!1),[i,a]=(0,g.useState)([]),[n,s]=(0,g.useState)(!1),[o,l]=(0,g.useState)(1),[d,c]=(0,g.useState)(10),[p,h]=(0,g.useState)(0),[u,x]=(0,g.useState)(""),[f,v]=(0,g.useState)(""),[b,w]=(0,g.useState)(!1),[A,C]=(0,g.useState)(null),[E,$]=(0,g.useState)({modelId:"",modelName:"",modelType:"",apiId:"",modelUsage:"",status:1}),I=[{title:"ID",dataIndex:"id",key:"id",width:80},{title:"模型ID",dataIndex:"modelId",key:"modelId",width:150},{title:"模型名称",dataIndex:"modelName",key:"modelName",width:200},{title:"模型类型",dataIndex:"modelType",key:"modelType",width:120},{title:"API ID",dataIndex:"apiId",key:"apiId",width:150},{title:"模型用途",dataIndex:"modelUsage",key:"modelUsage",width:200,render:e=>e||"-"},{title:"状态",dataIndex:"status",key:"status",width:100,render:e=>(0,m.jsx)(j.vw,{color:1===e?"green":"red",children:1===e?"启用":"禁用"})},{title:"创建时间",dataIndex:"createTime",key:"createTime",width:180,render:e=>new Date(e).toLocaleString()},{title:"操作",key:"action",width:150,fixed:"right",render:(e,t)=>(0,m.jsxs)(j.$x,{children:[(0,m.jsx)(so,{theme:"borderless",type:"primary",icon:(0,m.jsx)(aU.A,{}),size:"small",onClick:()=>T(t),children:"编辑"}),(0,m.jsx)(j.iS,{title:"确定要删除这个模型配置吗？",content:"删除后无法恢复，请谨慎操作",onConfirm:()=>S(t),okText:"确定",cancelText:"取消",children:(0,m.jsx)(so,{theme:"borderless",type:"danger",icon:(0,m.jsx)(aQ.A,{}),size:"small",children:"删除"})})]})}],k=async()=>{s(!0);try{let e={modelId:u||void 0,status:f?parseInt(f):void 0,pageNum:o,pageSize:d},t=await n6.queryAiClientModelList(e);if("0000"===t.code&&t.data)a(t.data),h(t.data.length);else throw Error(t.info||"获取数据失败")}catch(e){console.error("获取模型列表失败:",e),j.y8.error("获取数据失败，请稍后重试"),a([]),h(0)}finally{s(!1)}},T=e=>{C(e),$({modelId:e.modelId,modelName:e.modelName,modelType:e.modelType||"",apiId:e.apiId||"",modelUsage:e.modelUsage||"",status:e.status}),w(!0)},S=async e=>{try{let t=await n6.deleteAiClientModelById(e.id);if("0000"===t.code)j.y8.success("删除成功"),k();else throw Error(t.info||"删除失败")}catch(e){console.error("删除模型失败:",e),j.y8.error("删除失败，请稍后重试")}},N=async()=>{try{let e;if(!E.modelId||!E.modelName)return void j.y8.error("请填写必填字段");let t={...E,id:null==A?void 0:A.id};if(e=A?await n6.updateAiClientModelById(t):await n6.createAiClientModel(t),"0000"===e.code)j.y8.success(A?"更新成功":"创建成功"),w(!1),k();else throw Error(e.info||"保存失败")}catch(e){console.error("保存模型失败:",e),j.y8.error("保存失败，请检查输入信息")}};return(0,g.useEffect)(()=>{k()},[o,d]),(0,m.jsxs)(n9,{children:[(0,m.jsx)(ez,{collapsed:t,selectedKey:"client-model-management",onSelect:t=>{switch(t){case"dashboard":e("/dashboard");break;case"agent-list":e("/agent-list");break;case"agent-config":e("/agent-config");break;case"client-management":e("/client-management");break;case"ai-client-api-management":e("/ai-client-api-management");break;case"advisor-management":e("/advisor-management");break;case"client-model-management":e("/client-model-management");break;case"client-system-prompt-management":e("/client-system-prompt-management");break;case"client-tool-mcp-management":e("/client-tool-mcp-management");break;default:e(`/${t}`)}}}),(0,m.jsx)(n4,{$collapsed:t,children:(0,m.jsxs)(n7,{children:[(0,m.jsx)(e6,{collapsed:t,onToggleSidebar:()=>r(!t),onLogout:()=>{localStorage.removeItem("userInfo"),localStorage.removeItem("token"),e("/login")}}),(0,m.jsxs)(se,{children:[(0,m.jsx)(st,{children:(0,m.jsx)(n3,{heading:3,children:"AI模型配置管理"})}),(0,m.jsx)(sr,{children:(0,m.jsxs)(si,{children:[(0,m.jsx)(j.pd,{placeholder:"请输入模型名称",value:u,onChange:x,style:{width:200},prefix:(0,m.jsx)(eF.A,{})}),(0,m.jsxs)(j.l6,{placeholder:"请选择状态",value:f,onChange:e=>v(e),style:{width:120},children:[(0,m.jsx)(j.l6.Option,{value:"",children:"全部"}),(0,m.jsx)(j.l6.Option,{value:"1",children:"启用"}),(0,m.jsx)(j.l6.Option,{value:"0",children:"禁用"})]}),(0,m.jsx)(j.$n,{type:"primary",icon:(0,m.jsx)(eF.A,{}),onClick:()=>{l(1),k()},children:"搜索"}),(0,m.jsx)(j.$n,{icon:(0,m.jsx)(aX.A,{}),onClick:()=>{x(""),v(""),l(1),k()},children:"重置"}),(0,m.jsx)(j.$n,{type:"primary",theme:"solid",icon:(0,m.jsx)(it.A,{}),onClick:()=>{C(null),$({modelId:"",modelName:"",modelType:"",apiId:"",modelUsage:"",status:1}),w(!0)},children:"新增模型"})]})}),(0,m.jsx)(sa,{children:(0,m.jsx)(sn,{children:(0,m.jsx)(ss,{children:(0,m.jsx)(j.XI,{columns:I,dataSource:i,loading:n,pagination:{currentPage:o,pageSize:d,total:p,showSizeChanger:!0,showQuickJumper:!0,onChange:(e,t)=>{l(e),c(t)}},scroll:{x:1200},rowKey:"id"})})})})]})]})}),(0,m.jsxs)(j.aF,{title:A?"编辑模型配置":"新增模型配置",visible:b,onOk:N,onCancel:()=>w(!1),width:600,okText:"保存",cancelText:"取消",children:[(0,m.jsxs)(sl,{children:[(0,m.jsx)("label",{children:"模型ID *"}),(0,m.jsx)(j.pd,{className:"form-control",placeholder:"请输入模型ID",value:E.modelId,onChange:e=>$({...E,modelId:e})})]}),(0,m.jsxs)(sl,{children:[(0,m.jsx)("label",{children:"模型名称 *"}),(0,m.jsx)(j.pd,{className:"form-control",placeholder:"请输入模型名称",value:E.modelName,onChange:e=>$({...E,modelName:e})})]}),(0,m.jsxs)(sl,{children:[(0,m.jsx)("label",{children:"模型类型"}),(0,m.jsx)(j.pd,{className:"form-control",placeholder:"请输入模型类型",value:E.modelType,onChange:e=>$({...E,modelType:e})})]}),(0,m.jsxs)(sl,{children:[(0,m.jsx)("label",{children:"API ID"}),(0,m.jsx)(j.pd,{className:"form-control",placeholder:"请输入API ID",value:E.apiId,onChange:e=>$({...E,apiId:e})})]}),(0,m.jsxs)(sl,{children:[(0,m.jsx)("label",{children:"模型用途"}),(0,m.jsx)(j.pd,{className:"form-control",placeholder:"请输入模型用途",value:E.modelUsage,onChange:e=>$({...E,modelUsage:e})})]}),(0,m.jsxs)(sl,{children:[(0,m.jsx)("label",{children:"状态"}),(0,m.jsxs)(j.l6,{className:"form-control",placeholder:"选择状态",value:E.status,onChange:e=>$({...E,status:e}),children:[(0,m.jsx)(j.l6.Option,{value:1,children:"启用"}),(0,m.jsx)(j.l6.Option,{value:0,children:"禁用"})]})]})]})]})},sc=new class{async createSystemPrompt(e){let t=await fetch(`${this.baseUrl}/create`,{method:"POST",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async updateSystemPromptById(e){let t=await fetch(`${this.baseUrl}/update-by-id`,{method:"PUT",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async updateSystemPromptByPromptId(e){let t=await fetch(`${this.baseUrl}/update-by-prompt-id`,{method:"PUT",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async deleteSystemPromptById(e){let t=await fetch(`${this.baseUrl}/delete-by-id/${e}`,{method:"DELETE",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async deleteSystemPromptByPromptId(e){let t=await fetch(`${this.baseUrl}/delete-by-prompt-id/${e}`,{method:"DELETE",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async querySystemPromptById(e){let t=await fetch(`${this.baseUrl}/query-by-id/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async querySystemPromptByPromptId(e){let t=await fetch(`${this.baseUrl}/query-by-prompt-id/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryAllSystemPrompts(){let e=await fetch(`${this.baseUrl}/query-all`,{method:"GET",headers:{...ee}});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return await e.json()}async queryEnabledSystemPrompts(){let e=await fetch(`${this.baseUrl}/query-enabled`,{method:"GET",headers:{...ee}});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return await e.json()}async querySystemPromptsByPromptName(e){let t=await fetch(`${this.baseUrl}/query-by-prompt-name/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async querySystemPromptList(e){let t=await fetch(`${this.baseUrl}/query-list`,{method:"POST",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}constructor(){this.baseUrl=`${G}/api/v1/admin/ai-client-system-prompt`}},{Content:sp}=j.PE,{Title:sh}=j.o5,su=(0,E.Ay)(j.PE)`
  min-height: 100vh;
  background: ${k.secondary};
`,sm=E.Ay.div`
  display: flex;
  flex: 1;
  margin-left: ${e=>e.$collapsed?"80px":"280px"};
  transition: margin-left ${U.normal} ${Q.cubic};
`,sg=(0,E.Ay)(sp)`
  flex: 1;
  padding: ${L.lg};
  background: ${k.secondary};
  overflow-y: auto;
`,sx=E.Ay.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`,sy=E.Ay.div`
  padding: ${L.lg};
  border-bottom: 1px solid ${T.secondary};
`,sf=(0,E.Ay)(j.Zp)`
  margin: ${L.lg};

  .semi-card-body {
    padding: ${L.lg};
  }
`,sj=E.Ay.div`
  display: flex;
  align-items: center;
  gap: ${L.base};
  flex-wrap: wrap;
`,sv=E.Ay.div`
  flex: 1;
  margin: 0 ${L.lg} ${L.lg};
  display: flex;
  flex-direction: column;
`,sb=(0,E.Ay)(j.Zp)`
  flex: 1;
  display: flex;
  flex-direction: column;

  .semi-card-body {
    padding: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`,sw=E.Ay.div`
  flex: 1;
  overflow: auto;
`,sA=(0,E.Ay)(j.$n)`
  margin-right: ${L.sm};
`,sC=E.Ay.div`
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,sE=()=>{let e=(0,y.Zp)(),[t,r]=(0,g.useState)(!1),[i,a]=(0,g.useState)(!1),[n,s]=(0,g.useState)([]),[o,l]=(0,g.useState)(""),[d,c]=(0,g.useState)(void 0),[p,h]=(0,g.useState)(1),[u,x]=(0,g.useState)(10),[f,v]=(0,g.useState)(0),[b,w]=(0,g.useState)(!1),[A,E]=(0,g.useState)("create"),[$,I]=(0,g.useState)(null),[k,T]=(0,g.useState)({});JSON.parse(localStorage.getItem("userInfo")||"{}");let S=[{title:"ID",dataIndex:"id",key:"id",width:80},{title:"提示词ID",dataIndex:"promptId",key:"promptId",width:150},{title:"提示词名称",dataIndex:"promptName",key:"promptName",width:200},{title:"提示词内容",dataIndex:"promptContent",key:"promptContent",width:300,render:e=>(0,m.jsx)(sC,{title:e,children:e||"-"})},{title:"状态",dataIndex:"status",key:"status",width:100,render:e=>(0,m.jsx)(j.vw,{color:1===e?"green":"red",children:1===e?"启用":"禁用"})},{title:"创建时间",dataIndex:"createTime",key:"createTime",width:180,render:e=>new Date(e).toLocaleString()},{title:"更新时间",dataIndex:"updateTime",key:"updateTime",width:180,render:e=>new Date(e).toLocaleString()},{title:"操作",key:"action",width:200,fixed:"right",render:(e,t)=>(0,m.jsxs)(j.$x,{children:[(0,m.jsx)(sA,{theme:"borderless",type:"tertiary",icon:(0,m.jsx)(C.A,{}),size:"small",onClick:()=>B(t),children:"查看"}),(0,m.jsx)(sA,{theme:"borderless",type:"primary",icon:(0,m.jsx)(aU.A,{}),size:"small",onClick:()=>L(t),children:"编辑"}),(0,m.jsx)(j.iS,{title:"确定要删除这个系统提示词配置吗？",content:"删除后无法恢复，请谨慎操作",onConfirm:()=>P(t),okText:"确定",cancelText:"取消",children:(0,m.jsx)(sA,{theme:"borderless",type:"danger",icon:(0,m.jsx)(aQ.A,{}),size:"small",children:"删除"})})]})}],N=async()=>{a(!0);try{let e=await sc.querySystemPromptList({promptName:o||void 0,status:d,pageNum:p,pageSize:u});if("0000"===e.code){let t=e.data||[];s(t),v(t.length)}else throw Error(e.info||"查询失败")}catch(e){console.error("获取系统提示词列表失败:",e),j.y8.error("获取系统提示词列表失败，请检查网络连接"),s([]),v(0)}finally{a(!1)}},P=async e=>{try{let t=await sc.deleteSystemPromptById(e.id);if("0000"===t.code&&t.data)j.y8.success("删除成功"),N();else throw Error(t.info||"删除失败")}catch(e){console.error("删除系统提示词失败:",e),j.y8.error("删除失败，请检查网络连接")}},B=e=>{I(e),E("view"),T(e),w(!0)},L=e=>{I(e),E("edit"),T(e),w(!0)},D=async()=>{try{var e,t;let r;if(!(null==(e=k.promptName)?void 0:e.trim()))return void j.y8.error("请输入提示词名称");if(!(null==(t=k.promptContent)?void 0:t.trim()))return void j.y8.error("请输入提示词内容");let i={...k,id:null==$?void 0:$.id};if(r="create"===A?await sc.createSystemPrompt(i):await sc.updateSystemPromptById(i),"0000"===r.code&&r.data)j.y8.success("create"===A?"创建成功":"更新成功"),w(!1),N();else throw Error(r.info||"操作失败")}catch(e){console.error("保存系统提示词失败:",e),j.y8.error("保存失败，请检查输入信息")}},M=()=>{h(1),N()};return(0,g.useEffect)(()=>{N()},[]),(0,m.jsxs)(su,{children:[(0,m.jsx)(ez,{collapsed:t,selectedKey:"client-system-prompt-management",onSelect:t=>{switch(t){case"dashboard":e("/dashboard");break;case"agent-list":e("/agent-list");break;case"agent-config":e("/agent-config");break;case"client-management":e("/client-management");break;case"ai-client-api-management":e("/ai-client-api-management");break;case"advisor-management":e("/advisor-management");break;case"rag-order-management":e("/rag-order-management");break;case"client-model-management":e("/client-model-management");break;case"client-system-prompt-management":e("/client-system-prompt-management");break;case"client-tool-mcp-management":e("/client-tool-mcp-management");break;default:e(t)}}}),(0,m.jsx)(sm,{$collapsed:t,children:(0,m.jsxs)(sg,{children:[(0,m.jsx)(e6,{collapsed:t,onToggleSidebar:()=>r(!t),onLogout:()=>{localStorage.removeItem("token"),localStorage.removeItem("userInfo"),localStorage.removeItem("isLoggedIn"),j.y8.success("已退出登录"),e("/login")}}),(0,m.jsxs)(sx,{children:[(0,m.jsx)(sy,{children:(0,m.jsx)(sh,{heading:3,style:{margin:0},children:"系统提示词管理"})}),(0,m.jsx)(sf,{children:(0,m.jsxs)(sj,{children:[(0,m.jsx)(j.pd,{placeholder:"请输入提示词名称",value:o,onChange:l,style:{width:200},onEnterPress:M}),(0,m.jsxs)(j.l6,{placeholder:"选择状态",value:d,onChange:e=>c(e),style:{width:120},children:[(0,m.jsx)(j.l6.Option,{value:1,children:"启用"}),(0,m.jsx)(j.l6.Option,{value:0,children:"禁用"})]}),(0,m.jsx)(j.$n,{type:"primary",icon:(0,m.jsx)(eF.A,{}),onClick:M,children:"搜索"}),(0,m.jsx)(j.$n,{icon:(0,m.jsx)(aX.A,{}),onClick:()=>{l(""),c(void 0),h(1),N()},children:"重置"}),(0,m.jsx)(j.$n,{type:"primary",theme:"solid",icon:(0,m.jsx)(it.A,{}),onClick:()=>{I(null),E("create"),T({}),w(!0)},children:"新增提示词"})]})}),(0,m.jsx)(sv,{children:(0,m.jsx)(sb,{children:(0,m.jsx)(sw,{children:(0,m.jsx)(j.XI,{columns:S,dataSource:n,loading:i,pagination:{currentPage:p,pageSize:u,total:f,showSizeChanger:!0,showQuickJumper:!0,onChange:(e,t)=>{h(e),t&&t!==u&&x(t),N()}},rowKey:"id",scroll:{x:1400},empty:(0,m.jsx)("div",{style:{padding:"40px",textAlign:"center"},children:(0,m.jsx)(j.o5.Text,{type:"tertiary",children:"暂无数据"})})})})})})]})]})}),(0,m.jsx)(j.aF,{title:"create"===A?"新增系统提示词":"edit"===A?"编辑系统提示词":"查看系统提示词",visible:b,onCancel:()=>w(!1),onOk:"view"===A?()=>w(!1):D,okText:"view"===A?"关闭":"保存",cancelText:"取消",width:800,style:{maxHeight:"80vh"},children:(0,m.jsxs)("div",{style:{padding:"16px 0"},children:[(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsx)("label",{style:{display:"block",marginBottom:"8px",fontWeight:500},children:"提示词ID"}),(0,m.jsx)(j.pd,{value:k.promptId||"",onChange:e=>T({...k,promptId:e}),placeholder:"请输入提示词ID",disabled:"edit"===A||"view"===A})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsx)("label",{style:{display:"block",marginBottom:"8px",fontWeight:500},children:"提示词名称"}),(0,m.jsx)(j.pd,{value:k.promptName||"",onChange:e=>T({...k,promptName:e}),placeholder:"请输入提示词名称",disabled:"view"===A})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsx)("label",{style:{display:"block",marginBottom:"8px",fontWeight:500},children:"提示词内容"}),(0,m.jsx)(j.fs,{value:k.promptContent||"",onChange:e=>T({...k,promptContent:e}),placeholder:"请输入提示词内容",autosize:{minRows:4,maxRows:8},disabled:"view"===A})]}),(0,m.jsxs)("div",{style:{marginBottom:"16px"},children:[(0,m.jsx)("label",{style:{display:"block",marginBottom:"8px",fontWeight:500},children:"状态"}),(0,m.jsxs)(j.l6,{value:k.status,onChange:e=>T({...k,status:e}),placeholder:"请选择状态",disabled:"view"===A,style:{width:"100%"},children:[(0,m.jsx)(j.l6.Option,{value:1,children:"启用"}),(0,m.jsx)(j.l6.Option,{value:0,children:"禁用"})]})]})]})})]})},s$=new class{async createAiClientToolMcp(e){let t=await fetch(`${this.baseUrl}/create`,{method:"POST",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async updateAiClientToolMcpById(e){let t=await fetch(`${this.baseUrl}/update-by-id`,{method:"PUT",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async updateAiClientToolMcpByMcpId(e){let t=await fetch(`${this.baseUrl}/update-by-mcp-id`,{method:"PUT",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async deleteAiClientToolMcpById(e){let t=await fetch(`${this.baseUrl}/delete-by-id/${e}`,{method:"DELETE",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async deleteAiClientToolMcpByMcpId(e){let t=await fetch(`${this.baseUrl}/delete-by-mcp-id/${e}`,{method:"DELETE",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryAiClientToolMcpById(e){let t=await fetch(`${this.baseUrl}/query-by-id/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryAiClientToolMcpByMcpId(e){let t=await fetch(`${this.baseUrl}/query-by-mcp-id/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryAllAiClientToolMcps(){let e=await fetch(`${this.baseUrl}/query-all`,{method:"GET",headers:{...ee}});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return await e.json()}async queryAiClientToolMcpsByStatus(e){let t=await fetch(`${this.baseUrl}/query-by-status/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryAiClientToolMcpsByTransportType(e){let t=await fetch(`${this.baseUrl}/query-by-transport-type/${e}`,{method:"GET",headers:{...ee}});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}async queryEnabledAiClientToolMcps(){let e=await fetch(`${this.baseUrl}/query-enabled`,{method:"GET",headers:{...ee}});if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);return await e.json()}async queryAiClientToolMcpList(e){let t=await fetch(`${this.baseUrl}/query-list`,{method:"POST",headers:{...ee},body:JSON.stringify(e)});if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);return await t.json()}constructor(){this.baseUrl=`${G}/api/v1/admin/ai-client-tool-mcp`}},{Content:sI}=j.PE,{Title:sk}=j.o5,{Option:sT}=j.l6,sS=(0,E.Ay)(j.PE)`
  min-height: 100vh;
  background: ${k.secondary};
`,sN=E.Ay.div`
  display: flex;
  flex: 1;
  margin-left: ${e=>e.$collapsed?"80px":"280px"};
  transition: margin-left ${U.normal} ${Q.cubic};
`,sP=(0,E.Ay)(sI)`
  flex: 1;
  padding: ${L.lg};
  background: ${k.secondary};
  overflow-y: auto;
`,sB=E.Ay.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`,sL=E.Ay.div`
  padding: ${L.lg};
  border-bottom: 1px solid ${T.secondary};
`,sD=(0,E.Ay)(j.Zp)`
  margin: ${L.lg};

  .semi-card-body {
    padding: ${L.lg};
  }
`,sM=E.Ay.div`
  display: flex;
  align-items: center;
  gap: ${L.base};
  flex-wrap: wrap;
`,s_=E.Ay.div`
  flex: 1;
  margin: 0 ${L.lg} ${L.lg};
  display: flex;
  flex-direction: column;
`,sR=(0,E.Ay)(j.Zp)`
  flex: 1;
  display: flex;
  flex-direction: column;

  .semi-card-body {
    padding: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`,sO=E.Ay.div`
  flex: 1;
  overflow: auto;
`,sU=(0,E.Ay)(j.$n)`
  margin-right: ${L.sm};
`,sQ=E.Ay.div`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  color: ${$};

  &:hover {
    text-decoration: underline;
  }
`,sz=E.Ay.pre`
  background: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  max-height: 400px;
  overflow-y: auto;
`,sq=()=>{let e=(0,y.Zp)(),[t,r]=(0,g.useState)(!1),[i,a]=(0,g.useState)(!1),[n,s]=(0,g.useState)([]),[o,l]=(0,g.useState)(""),[d,c]=(0,g.useState)(""),[p,h]=(0,g.useState)(void 0),[u,x]=(0,g.useState)(1),[f,v]=(0,g.useState)(10),[b,w]=(0,g.useState)(0),[A,E]=(0,g.useState)(!1),[$,I]=(0,g.useState)(""),[k,T]=(0,g.useState)(""),[S,N]=(0,g.useState)(!1),[P,B]=(0,g.useState)(!1),[L,D]=(0,g.useState)({mcpName:"",transportType:"stdio",transportConfig:"{}",requestTimeout:3e4,status:1}),[M,_]=(0,g.useState)(!1),[R,O]=(0,g.useState)(!1),[U,Q]=(0,g.useState)({mcpName:"",transportType:"stdio",transportConfig:"{}",requestTimeout:3e4,status:1}),[z,q]=(0,g.useState)(null),V=(e,t)=>{I(e),T(t),E(!0)},F=[{title:"ID",dataIndex:"id",key:"id",width:80},{title:"MCP ID",dataIndex:"mcpId",key:"mcpId",width:150},{title:"MCP名称",dataIndex:"mcpName",key:"mcpName",width:200},{title:"传输配置",dataIndex:"transportConfig",key:"transportConfig",width:250,render:(e,t)=>(0,m.jsx)(sQ,{onClick:()=>V(e,t.mcpName),children:e?`${e.substring(0,50)}...`:"-"})},{title:"传输类型",dataIndex:"transportType",key:"transportType",width:120,render:e=>(0,m.jsx)(j.vw,{color:"stdio"===e?"blue":"sse"===e?"green":"orange",children:e||"-"})},{title:"状态",dataIndex:"status",key:"status",width:100,render:e=>(0,m.jsx)(j.vw,{color:1===e?"green":"red",children:1===e?"启用":"禁用"})},{title:"创建时间",dataIndex:"createTime",key:"createTime",width:180,render:e=>new Date(e).toLocaleString()},{title:"更新时间",dataIndex:"updateTime",key:"updateTime",width:180,render:e=>new Date(e).toLocaleString()},{title:"操作",key:"action",width:200,fixed:"right",render:(e,t)=>(0,m.jsxs)(j.$x,{children:[(0,m.jsx)(sU,{theme:"borderless",type:"tertiary",icon:(0,m.jsx)(C.A,{}),size:"small",onClick:()=>V(t.transportConfig,t.mcpName),children:"查看配置"}),(0,m.jsx)(sU,{theme:"borderless",type:"primary",icon:(0,m.jsx)(aU.A,{}),size:"small",onClick:()=>J(t),children:"编辑"}),(0,m.jsx)(j.iS,{title:"确定要删除这个MCP配置吗？",content:"删除后无法恢复，请谨慎操作",onConfirm:()=>H(t),okText:"确定",cancelText:"取消",children:(0,m.jsx)(sU,{theme:"borderless",type:"danger",icon:(0,m.jsx)(aQ.A,{}),size:"small",children:"删除"})})]})}],Y=async()=>{a(!0);try{let e=await s$.queryAiClientToolMcpList({mcpName:o||void 0,transportType:d||void 0,status:p,pageNum:u,pageSize:f});if("0000"===e.code){let t=e.data||[];s(t),w(t.length)}else throw Error(e.info||"查询失败")}catch(e){console.error("获取MCP客户端工具列表失败:",e),j.y8.error("获取MCP客户端工具列表失败，请检查网络连接"),s([]),w(0)}finally{a(!1)}},H=async e=>{try{let t=await s$.deleteAiClientToolMcpById(e.id);if("0000"===t.code&&t.data)j.y8.success("删除成功"),Y();else throw Error(t.info||"删除失败")}catch(e){console.error("删除MCP配置失败:",e),j.y8.error("删除失败，请检查网络连接")}},J=e=>{q(e),Q({mcpId:e.mcpId,mcpName:e.mcpName,transportType:e.transportType,transportConfig:e.transportConfig,requestTimeout:e.requestTimeout,status:e.status}),_(!0)},K=()=>{_(!1),q(null),Q({mcpName:"",transportType:"stdio",transportConfig:"{}",requestTimeout:30,status:1})},Z=(e,t)=>{Q(r=>({...r,[e]:t}))},G=async()=>{var e,t;if(!(null==(e=U.mcpName)?void 0:e.trim()))return void j.y8.error("请输入MCP名称");if(!U.transportType)return void j.y8.error("请选择传输类型");if(!(null==(t=U.transportConfig)?void 0:t.trim()))return void j.y8.error("请输入传输配置");try{JSON.parse(U.transportConfig)}catch(e){j.y8.error("传输配置必须是有效的JSON格式");return}if(!(null==z?void 0:z.mcpId))return void j.y8.error("MCP ID不能为空");O(!0);try{let e={...U,mcpId:z.mcpId,mcpName:U.mcpName.trim(),transportConfig:U.transportConfig.trim()},t=await s$.updateAiClientToolMcpByMcpId(e);if("0000"===t.code&&t.data)j.y8.success("更新成功"),_(!1),Y(),K();else throw Error(t.info||"更新失败")}catch(e){console.error("更新MCP配置失败:",e),j.y8.error("更新失败，请检查网络连接")}finally{O(!1)}},W=()=>{N(!1),D({mcpName:"",transportType:"stdio",transportConfig:"{}",requestTimeout:30,status:1})},X=(e,t)=>{D(r=>({...r,[e]:t}))},ee=async()=>{var e,t;if(!(null==(e=L.mcpName)?void 0:e.trim()))return void j.y8.error("请输入MCP名称");if(!L.transportType)return void j.y8.error("请选择传输类型");if(!(null==(t=L.transportConfig)?void 0:t.trim()))return void j.y8.error("请输入传输配置");try{JSON.parse(L.transportConfig)}catch(e){j.y8.error("传输配置必须是有效的JSON格式");return}B(!0);try{let e={...L,mcpId:(()=>{let e="";for(let t=0;t<8;t++)e+=Math.floor(10*Math.random()).toString();return e})(),mcpName:L.mcpName.trim(),transportConfig:L.transportConfig.trim()},t=await s$.createAiClientToolMcp(e);if("0000"===t.code&&t.data)j.y8.success("创建成功"),N(!1),Y(),W();else throw Error(t.info||"创建失败")}catch(e){console.error("创建MCP配置失败:",e),j.y8.error("创建失败，请检查网络连接")}finally{B(!1)}},et=()=>{x(1),Y()};return(0,g.useEffect)(()=>{Y()},[]),(0,m.jsxs)(sS,{children:[(0,m.jsx)(ez,{collapsed:t,selectedKey:"client-tool-mcp-management",onSelect:t=>{switch(t){case"dashboard":e("/dashboard");break;case"agent-list":e("/agent-list");break;case"agent-config":e("/agent-config");break;case"client-management":e("/client-management");break;case"ai-client-api-management":e("/ai-client-api-management");break;case"advisor-management":e("/advisor-management");break;case"rag-order-management":e("/rag-order-management");break;case"client-model-management":e("/client-model-management");break;case"client-system-prompt-management":e("/client-system-prompt-management");break;case"client-tool-mcp-management":e("/client-tool-mcp-management");break;default:e(t)}}}),(0,m.jsx)(sN,{$collapsed:t,children:(0,m.jsxs)(sP,{children:[(0,m.jsx)(e6,{collapsed:t,onToggleSidebar:()=>r(!t),onLogout:()=>{localStorage.removeItem("token"),localStorage.removeItem("userInfo"),localStorage.removeItem("isLoggedIn"),j.y8.success("已退出登录"),e("/login")}}),(0,m.jsxs)(sB,{children:[(0,m.jsx)(sL,{children:(0,m.jsx)(sk,{heading:3,style:{margin:0},children:"MCP客户端工具管理"})}),(0,m.jsx)(sD,{children:(0,m.jsxs)(sM,{children:[(0,m.jsx)(j.pd,{placeholder:"请输入MCP名称",value:o,onChange:l,style:{width:200},onEnterPress:et}),(0,m.jsxs)(j.l6,{placeholder:"选择传输类型",value:d,onChange:e=>{c(e||"")},style:{width:150},children:[(0,m.jsx)(sT,{value:"",children:"全部"}),(0,m.jsx)(sT,{value:"stdio",children:"stdio"}),(0,m.jsx)(sT,{value:"sse",children:"sse"}),(0,m.jsx)(sT,{value:"websocket",children:"websocket"})]}),(0,m.jsxs)(j.l6,{placeholder:"选择状态",value:void 0===p?"":p,onChange:e=>{h(""===e?void 0:Number(e))},style:{width:120},children:[(0,m.jsx)(sT,{value:"",children:"全部"}),(0,m.jsx)(sT,{value:1,children:"启用"}),(0,m.jsx)(sT,{value:0,children:"禁用"})]}),(0,m.jsx)(j.$n,{type:"primary",icon:(0,m.jsx)(eF.A,{}),onClick:et,children:"搜索"}),(0,m.jsx)(j.$n,{icon:(0,m.jsx)(aX.A,{}),onClick:()=>{l(""),c(""),h(void 0),x(1),Y()},children:"重置"}),(0,m.jsx)(j.$n,{type:"primary",theme:"solid",icon:(0,m.jsx)(it.A,{}),onClick:()=>{D({mcpName:"",transportType:"stdio",transportConfig:"{}",requestTimeout:30,status:1}),N(!0)},children:"新增MCP配置"})]})}),(0,m.jsx)(s_,{children:(0,m.jsx)(sR,{children:(0,m.jsx)(sO,{children:(0,m.jsx)(j.XI,{columns:F,dataSource:n,loading:i,pagination:{currentPage:u,pageSize:f,total:b,showSizeChanger:!0,showQuickJumper:!0,onChange:(e,t)=>{x(e),t&&t!==f&&v(t),Y()}},rowKey:"id",scroll:{x:1400},empty:(0,m.jsx)("div",{style:{padding:"40px",textAlign:"center"},children:(0,m.jsx)(j.o5.Text,{type:"tertiary",children:"暂无数据"})})})})})})]}),(0,m.jsx)(j.aF,{title:`传输配置详情 - ${k}`,visible:A,onCancel:()=>E(!1),footer:(0,m.jsx)(j.$n,{onClick:()=>E(!1),children:"关闭"}),width:800,style:{maxWidth:"90vw"},children:(0,m.jsx)(sz,{children:(e=>{try{let t=JSON.parse(e);return JSON.stringify(t,null,2)}catch(t){return e}})($)})}),(0,m.jsx)(j.aF,{title:"新增MCP配置",visible:S,onCancel:W,footer:(0,m.jsxs)(j.$x,{children:[(0,m.jsx)(j.$n,{onClick:W,children:"取消"}),(0,m.jsx)(j.$n,{type:"primary",loading:P,onClick:ee,children:"保存"})]}),width:600,style:{maxWidth:"90vw"},children:(0,m.jsx)("div",{style:{padding:"20px 0"},children:(0,m.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[(0,m.jsxs)("div",{children:[(0,m.jsxs)(j.o5.Text,{strong:!0,style:{display:"block",marginBottom:8},children:["MCP名称 ",(0,m.jsx)(j.o5.Text,{type:"danger",children:"*"})]}),(0,m.jsx)(j.pd,{placeholder:"请输入MCP名称",value:L.mcpName,onChange:e=>X("mcpName",e),style:{width:"100%"}})]}),(0,m.jsxs)("div",{children:[(0,m.jsxs)(j.o5.Text,{strong:!0,style:{display:"block",marginBottom:8},children:["传输类型 ",(0,m.jsx)(j.o5.Text,{type:"danger",children:"*"})]}),(0,m.jsxs)(j.l6,{placeholder:"请选择传输类型",value:L.transportType,onChange:e=>X("transportType",e),style:{width:"100%"},children:[(0,m.jsx)(sT,{value:"stdio",children:"stdio"}),(0,m.jsx)(sT,{value:"sse",children:"sse"}),(0,m.jsx)(sT,{value:"websocket",children:"websocket"})]})]}),(0,m.jsxs)("div",{children:[(0,m.jsxs)(j.o5.Text,{strong:!0,style:{display:"block",marginBottom:8},children:["传输配置 ",(0,m.jsx)(j.o5.Text,{type:"danger",children:"*"})]}),(0,m.jsx)(j.fs,{placeholder:"请输入传输配置（JSON格式）",value:L.transportConfig,onChange:e=>X("transportConfig",e),rows:6,style:{width:"100%",fontFamily:"Monaco, Menlo, Ubuntu Mono, monospace"}}),(0,m.jsxs)(j.o5.Text,{type:"tertiary",size:"small",children:["请输入有效的JSON格式配置，例如：","{",'"command": "node", "args": ["server.js"]',"}"]})]}),(0,m.jsxs)("div",{children:[(0,m.jsx)(j.o5.Text,{strong:!0,style:{display:"block",marginBottom:8},children:"请求超时时间（秒）"}),(0,m.jsx)(j.pd,{type:"number",placeholder:"请输入超时时间",value:L.requestTimeout,onChange:e=>X("requestTimeout",Number(e)),style:{width:"100%"}})]}),(0,m.jsxs)("div",{children:[(0,m.jsx)(j.o5.Text,{strong:!0,style:{display:"block",marginBottom:8},children:"状态"}),(0,m.jsxs)(j.l6,{value:L.status,onChange:e=>X("status",e),style:{width:"100%"},children:[(0,m.jsx)(sT,{value:1,children:"启用"}),(0,m.jsx)(sT,{value:0,children:"禁用"})]})]})]})})}),(0,m.jsx)(j.aF,{title:"编辑MCP配置",visible:M,onCancel:K,footer:(0,m.jsxs)(j.$x,{children:[(0,m.jsx)(j.$n,{onClick:K,children:"取消"}),(0,m.jsx)(j.$n,{type:"primary",loading:R,onClick:G,children:"保存"})]}),width:600,style:{maxWidth:"90vw"},children:(0,m.jsx)("div",{style:{padding:"20px 0"},children:(0,m.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[(0,m.jsxs)("div",{children:[(0,m.jsx)(j.o5.Text,{strong:!0,style:{display:"block",marginBottom:8},children:"MCP ID"}),(0,m.jsx)(j.pd,{value:U.mcpId,disabled:!0,style:{width:"100%",backgroundColor:"#f6f8fa"}}),(0,m.jsx)(j.o5.Text,{type:"tertiary",size:"small",children:"MCP ID不可修改"})]}),(0,m.jsxs)("div",{children:[(0,m.jsxs)(j.o5.Text,{strong:!0,style:{display:"block",marginBottom:8},children:["MCP名称 ",(0,m.jsx)(j.o5.Text,{type:"danger",children:"*"})]}),(0,m.jsx)(j.pd,{placeholder:"请输入MCP名称",value:U.mcpName,onChange:e=>Z("mcpName",e),style:{width:"100%"}})]}),(0,m.jsxs)("div",{children:[(0,m.jsxs)(j.o5.Text,{strong:!0,style:{display:"block",marginBottom:8},children:["传输类型 ",(0,m.jsx)(j.o5.Text,{type:"danger",children:"*"})]}),(0,m.jsxs)(j.l6,{placeholder:"请选择传输类型",value:U.transportType,onChange:e=>Z("transportType",e),style:{width:"100%"},children:[(0,m.jsx)(sT,{value:"stdio",children:"stdio"}),(0,m.jsx)(sT,{value:"sse",children:"sse"}),(0,m.jsx)(sT,{value:"websocket",children:"websocket"})]})]}),(0,m.jsxs)("div",{children:[(0,m.jsxs)(j.o5.Text,{strong:!0,style:{display:"block",marginBottom:8},children:["传输配置 ",(0,m.jsx)(j.o5.Text,{type:"danger",children:"*"})]}),(0,m.jsx)(j.fs,{placeholder:"请输入传输配置（JSON格式）",value:U.transportConfig,onChange:e=>Z("transportConfig",e),rows:6,style:{width:"100%",fontFamily:"Monaco, Menlo, Ubuntu Mono, monospace"}}),(0,m.jsxs)(j.o5.Text,{type:"tertiary",size:"small",children:["请输入有效的JSON格式配置，例如：","{",'"command": "node", "args": ["server.js"]',"}"]})]}),(0,m.jsxs)("div",{children:[(0,m.jsx)(j.o5.Text,{strong:!0,style:{display:"block",marginBottom:8},children:"请求超时时间（秒）"}),(0,m.jsx)(j.pd,{type:"number",placeholder:"请输入超时时间",value:U.requestTimeout,onChange:e=>Z("requestTimeout",Number(e)),style:{width:"100%"}})]}),(0,m.jsxs)("div",{children:[(0,m.jsx)(j.o5.Text,{strong:!0,style:{display:"block",marginBottom:8},children:"状态"}),(0,m.jsxs)(j.l6,{value:U.status,onChange:e=>Z("status",e),style:{width:"100%"},children:[(0,m.jsx)(sT,{value:1,children:"启用"}),(0,m.jsx)(sT,{value:0,children:"禁用"})]})]})]})})})]})})]})};var sV=r(1642),sF=r(5315),sY=r(8631),sH=r(9581);let{Content:sJ}=j.PE,{Title:sK,Text:sZ}=j.o5,sG=(0,E.Ay)(j.PE)`
  min-height: 100vh;
  background: #f6f8fb;
`,sW=E.Ay.div`
  min-height: 100vh;
  margin-left: ${e=>e.$collapsed?"80px":"280px"};
  display: flex;
  flex: 1;
  flex-direction: column;
  transition: margin-left ${U.normal} ${Q.cubic};

  @media (max-width: 760px) {
    margin-left: 80px;
  }
`,sX=(0,E.Ay)(sJ)`
  padding: 24px;
  overflow: auto;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (max-width: 760px) {
    padding: 16px;
  }
`,s0=E.Ay.section`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 980px) {
    align-items: flex-start;
    flex-direction: column;
  }
`,s1=E.Ay.div`
  min-width: 0;

  h2 {
    margin: 0 0 8px;
    color: #152033;
  }
`,s2=E.Ay.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`,s5=E.Ay.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  color: ${e=>"green"===e.$tone?"#13795b":"amber"===e.$tone?"#9a5b00":"#2864b4"};
  background: ${e=>"green"===e.$tone?"#e9f8f2":"amber"===e.$tone?"#fff4dd":"#edf4ff"};
  font-size: 12px;
  font-weight: 600;
`,s6=E.Ay.div`
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(130px, 180px);
  gap: 10px;
  width: min(100%, 520px);

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`,s8=E.Ay.div`
  display: grid;
  grid-template-columns: minmax(300px, 0.78fr) minmax(460px, 1.5fr);
  gap: 16px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`,s3=E.Ay.section`
  background: ${k.primary};
  border: 1px solid #e6eaf0;
  border-radius: 8px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
  padding: 18px;
`,s9=E.Ay.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  h4 {
    margin: 0;
  }
`,s4=(0,E.Ay)(sZ)`
  display: block;
  margin-top: 4px;
`,s7=E.Ay.label`
  display: flex;
  min-height: 156px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  border: 1px dashed #b9c6d6;
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
  color: ${I.secondary};
  text-align: center;
  transition: border-color ${U.fast} ${Q.ease},
    background ${U.fast} ${Q.ease};

  &:hover {
    border-color: ${$};
    background: #f3f8ff;
    color: ${$};
  }

  input {
    display: none;
  }
`,oe=E.Ay.span`
  color: ${I.tertiary};
  font-size: 12px;
`,ot=E.Ay.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
  max-height: 170px;
  overflow: auto;
`,or=E.Ay.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: center;
  padding: 9px 10px;
  font-size: 13px;
  background: #f8fafc;
  border: 1px solid #edf1f5;
  border-radius: 6px;
  color: ${I.primary};
  overflow-wrap: anywhere;
`,oi=E.Ay.div`
  margin: 12px 0;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #eef2f7;
  background: #f8fafc;
  color: ${I.tertiary};
  font-size: 13px;
`,oa=E.Ay.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`,on=E.Ay.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 92px;
  gap: 10px;
  align-items: stretch;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`,os=(0,E.Ay)(j.fs)`
  .semi-input-textarea-wrapper {
    border-radius: 8px;
    border-color: #dfe7f1;
    background: #ffffff;
  }

  textarea {
    line-height: 1.65;
  }
`,oo=E.Ay.div`
  margin-top: 14px;
  border: 1px solid #e6eaf0;
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;
`,ol=E.Ay.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid #e9eef5;
  background: #f8fafc;
`,od=E.Ay.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`,oc=E.Ay.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  color: #ffffff;
  background: linear-gradient(135deg, #2f7cf6 0%, #16a085 100%);
  flex: none;
`,op=E.Ay.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,oh=E.Ay.div`
  min-height: 260px;
  max-height: 620px;
  padding: 22px 24px 24px;
  overflow: auto;
  color: #1f2937;
  font-size: 14px;
  line-height: 1.75;

  strong {
    color: #111827;
    font-weight: 700;
  }

  @media (max-width: 640px) {
    padding: 16px;
  }
`,ou=E.Ay.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 170px;
  color: ${I.tertiary};
  text-align: center;
`,om=E.Ay.p`
  margin: 0 0 14px;
  white-space: pre-wrap;
`,og=E.Ay.div`
  margin: 20px 0 10px;
  padding-left: 10px;
  border-left: 3px solid #2f7cf6;
  color: #152033;
  font-size: 15px;
  font-weight: 700;
`,ox=E.Ay.div`
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: 8px;
  margin: 7px 0;
`,oy=E.Ay.span`
  color: #6b7280;
  font-weight: 600;
  text-align: right;
`,of=E.Ay.span`
  display: inline-flex;
  align-items: center;
  height: 20px;
  margin: 0 2px;
  padding: 0 6px;
  border-radius: 999px;
  background: #edf4ff;
  color: #2864b4;
  font-size: 12px;
  font-weight: 700;
`,oj=E.Ay.code`
  padding: 1px 5px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #334155;
  font-family: Consolas, "SFMono-Regular", monospace;
  font-size: 0.92em;
`,ov=E.Ay.pre`
  margin: 12px 0 16px;
  padding: 14px;
  overflow: auto;
  border: 1px solid #e5eaf1;
  border-radius: 8px;
  background: #f6f8fb;
  color: #1f2937;
  font-family: Consolas, "SFMono-Regular", monospace;
  font-size: 12px;
  line-height: 1.65;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`,ob=E.Ay.code`
  display: block;
  max-height: 156px;
  margin-top: 10px;
  padding: 10px;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-family: Consolas, "SFMono-Regular", monospace;
  font-size: 12px;
  line-height: 1.55;
  color: #374151;
  background: #f4f6f8;
  border-radius: 6px;
`,ow=E.Ay.div`
  max-height: 220px;
  margin-top: 10px;
  padding: 12px;
  overflow: auto;
  border: 1px solid #edf1f5;
  border-radius: 6px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  line-height: 1.7;

  strong {
    color: #111827;
    font-weight: 700;
  }
`,oA=E.Ay.p`
  margin: 0 0 8px;
  white-space: pre-wrap;
`,oC=E.Ay.div`
  margin: 10px 0 6px;
  color: #152033;
  font-size: 13px;
  font-weight: 700;
`,oE=E.Ay.div`
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  gap: 6px;
  margin: 4px 0;
`,o$=E.Ay.div`
  margin: 8px 0;
  padding: 6px 10px;
  border-left: 3px solid #b8c7da;
  background: #f8fafc;
  color: #4b5563;
`,oI=E.Ay.pre`
  margin: 8px 0 10px;
  padding: 10px;
  overflow: auto;
  border-radius: 6px;
  background: #f6f8fb;
  color: #374151;
  font-family: Consolas, "SFMono-Regular", monospace;
  font-size: 12px;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`,ok=E.Ay.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  max-height: 520px;
  overflow: auto;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`,oT=E.Ay.article`
  min-width: 0;
  padding: 12px;
  border: 1px solid #e6eaf0;
  border-radius: 8px;
  background: #fbfcfe;
`,oS=E.Ay.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 6px;
`,oN=E.Ay.div`
  min-width: 0;
  color: ${I.primary};
  font-size: 13px;
  font-weight: 600;
  overflow-wrap: anywhere;
`,oP=E.Ay.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`,oB=e=>{try{let t=JSON.parse(e.trim());return t&&"object"==typeof t?t:null}catch{return null}},oL=e=>{let t,r=(t=e.split(/\r?\n/).filter(e=>e.startsWith("data:")).map(e=>e.slice(5).trimStart())).length>0?t.join("\n"):e.trim();if(!r)return null;let i=oB(r);return i||{type:"summary",content:r,completed:!1}},oD=e=>{let t=e.trim();if(!t)return[];let r=t.split(/\r?\n/).filter(e=>e.startsWith("data:")).map(e=>e.slice(5).trimStart()).filter(Boolean);if(r.length>1){let e=r.map(e=>oB(e)).filter(e=>!!e);if(e.length>0)return e}let i=t.split(/\r?\n\r?\n/);if(i.length>1)return i.map(e=>oL(e)).filter(e=>!!e);let a=oL(t);return a?[a]:[]},oM=e=>{let t,r=e.trim();if(!r)return"";if((t=r.trim()).startsWith("data:")||/^data:\s*\{/.test(t)){let e=[...oD(r)].reverse().find(e=>{var t;return("summary"===e.type||"error"===e.type)&&(null==(t=e.content)?void 0:t.trim())});if(null==e?void 0:e.content)return oM(e.content)}let i=oB(r);return(null==i?void 0:i.content)&&("summary"===i.type||"error"===i.type)?oM(i.content):r},o_=e=>e.split(/(\*\*[^*]+\*\*|`[^`]+`|\[\d+\])/g).map((e,t)=>e?/^\*\*[^*]+\*\*$/.test(e)?(0,m.jsx)("strong",{children:e.slice(2,-2)},`${e}-${t}`):/^`[^`]+`$/.test(e)?(0,m.jsx)(oj,{children:e.slice(1,-1)},`${e}-${t}`):/^\[\d+\]$/.test(e)?(0,m.jsx)(of,{children:e},`${e}-${t}`):(0,m.jsx)(g.Fragment,{children:e},`${e}-${t}`):null),oR=e=>{let t=[],r=null;for(let i of e.split(/\n/)){let e=i.match(/^```(\w+)?\s*$/);if(e){r?(t.push({type:"code",content:r.lines.join("\n"),language:r.language}),r=null):r={language:e[1]||"",lines:[]};continue}if(r){r.lines.push(i);continue}t.push({type:"line",content:i})}return r&&t.push({type:"code",content:r.lines.join("\n"),language:r.language}),t},oO=e=>{let{content:t,loading:r}=e,i=oM(t);if(!i.trim())return(0,m.jsx)(ou,{children:r?(0,m.jsx)(j.tK,{tip:"正在根据检索结果生成回答..."}):"上传项目资料并提问后，回答会显示在这里。"});let a=oR(i);return(0,m.jsx)(m.Fragment,{children:a.map((e,t)=>{if("code"===e.type)return(0,m.jsx)(ov,{children:e.content},`code-${t}`);let r=e.content,i=r.trim();if(!i)return(0,m.jsx)("div",{style:{height:8}},`space-${t}`);let a=i.match(/^#{1,6}\s+(.+)$/);if(a)return(0,m.jsx)(og,{children:o_(a[1])},`${r}-${t}`);let n=i.match(/^[-*]\s+(.+)$/);if(n)return(0,m.jsxs)(ox,{children:[(0,m.jsx)(oy,{children:"•"}),(0,m.jsx)("div",{children:o_(n[1])})]},`${r}-${t}`);let s=i.match(/^(\d+[.)])\s+(.+)$/);return s?(0,m.jsxs)(ox,{children:[(0,m.jsx)(oy,{children:s[1]}),(0,m.jsx)("div",{children:o_(s[2])})]},`${r}-${t}`):(0,m.jsx)(om,{children:o_(i)},`${r}-${t}`)})})},oU=e=>{let t,r,i,{source:a}=e;return(t=a.sourcePath.toLowerCase(),r=(a.language||"").toLowerCase(),i=(a.chunkType||"").toLowerCase(),t.endsWith(".md")||t.endsWith(".markdown")||"md"===r||"markdown"===r||i.includes("markdown"))?(0,m.jsx)(ow,{children:oR(a.content).map((e,t)=>{if("code"===e.type)return(0,m.jsx)(oI,{children:e.content},`source-code-${t}`);let r=e.content,i=r.trim();if(!i)return(0,m.jsx)("div",{style:{height:6}},`source-space-${t}`);let a=i.match(/^#{1,6}\s+(.+)$/);if(a)return(0,m.jsx)(oC,{children:o_(a[1])},`${r}-${t}`);let n=i.match(/^>\s?(.+)$/);if(n)return(0,m.jsx)(o$,{children:o_(n[1])},`${r}-${t}`);let s=i.match(/^[-*]\s+(.+)$/);if(s)return(0,m.jsxs)(oE,{children:[(0,m.jsx)(oy,{children:"•"}),(0,m.jsx)("div",{children:o_(s[1])})]},`${r}-${t}`);let o=i.match(/^(\d+[.)])\s+(.+)$/);return o?(0,m.jsxs)(oE,{children:[(0,m.jsx)(oy,{children:o[1]}),(0,m.jsx)("div",{children:o_(o[2])})]},`${r}-${t}`):(0,m.jsx)(oA,{children:o_(i)},`${r}-${t}`)})}):(0,m.jsx)(ob,{children:a.content})},oQ=()=>{let e=(0,y.Zp)(),[t,r]=(0,g.useState)(!1),[i,a]=(0,g.useState)("personal-workspace"),[n,s]=(0,g.useState)("85374287"),[o,l]=(0,g.useState)([]),[d,c]=(0,g.useState)(""),[p,h]=(0,g.useState)([]),[u,x]=(0,g.useState)(""),[f,v]=(0,g.useState)("等待提问"),[b,w]=(0,g.useState)(0),[A,C]=(0,g.useState)(!1),[E,$]=(0,g.useState)(!1),I=(0,g.useMemo)(()=>`${G}/api/v1/workspace/${encodeURIComponent(i)}`,[i]),k=`${I}/memory/default`,T=async()=>{try{var e;let t=await fetch(`${I}/summary`);if(!t.ok)return;let r=await t.json();w((null==(e=r.data)?void 0:e.chunkCount)||0)}catch{}};(0,g.useEffect)(()=>{T()},[I]);let S=async()=>{if(0===o.length)return void j.y8.warning("请先选择 Java、Markdown 或文本文件。");C(!0);try{let e=new FormData;o.forEach(t=>e.append("files",t));let t=await fetch(`${I}/documents`,{method:"POST",body:e}),r=await t.json();if(!t.ok||"0000"!==r.code)throw Error(r.info||"文件导入失败");j.y8.success(`已索引 ${r.data.importedFiles} 个文件，生成 ${r.data.importedChunks} 个片段。`),l([]),await T()}catch(e){j.y8.error(e instanceof Error?e.message:"文件导入失败")}finally{C(!1)}},N=async e=>{let t=await fetch(`${I}/search?query=${encodeURIComponent(e)}&limit=8`),r=await t.json();if(!t.ok||"0000"!==r.code)throw Error(r.info||"检索失败");let i=r.data||[];return h(i),i},P=async()=>{try{var e;let t=await fetch(k),r=await t.json();return t.ok&&"0000"===r.code&&(null==(e=r.data)?void 0:e.available)?r.data:null}catch{return null}},B=async(e,t)=>{if(t.trim())try{await fetch(`${k}/messages`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({role:e,content:t.slice(0,4e3)})})}catch{}},L=async()=>{if(u.trim())try{await navigator.clipboard.writeText(u),j.y8.success("回答已复制")}catch{j.y8.warning("当前浏览器不支持自动复制")}},D=async()=>{let e=d.trim();if(!e||E)return;$(!0),x(""),h([]),v("检索项目上下文");let t="",r=new Map,a=e=>{t=e,x(e)},s=e=>{if(e){if("analysis"===e.type&&v("分析问题"),"execution"===e.type&&v("组织答案"),"supervision"===e.type&&v("质量检查"),"complete"===e.type)return void v("回答完成");if("error"===e.type){a(oM(e.content||"智能体执行失败")),v("执行失败");return}if("summary"===e.type&&e.content){let t=oM(e.content);if(e.completed){r.clear(),a(t),v("回答完成");return}let i=e.subType||`summary-${r.size}`;r.set(i,t),a(Array.from(r.values()).join("\n\n")),v("生成总结")}}};try{let[r,o]=await Promise.all([N(e),P()]);if(0===r.length){a("未找到匹配的项目上下文。请上传相关文件，或把问题描述得更具体。"),v("未检索到依据");return}v(`已找到 ${r.length} 条依据`);let l=r.map((e,t)=>`[${t+1}] ${e.sourcePath}:${e.startLine}-${e.endLine}
${e.content.slice(0,1800)}`).join("\n\n"),d=o?[o.summary&&`此前会话摘要：
${o.summary}`,o.longTermFacts.length>0&&`长期记忆：
${o.longTermFacts.map(e=>`- ${e}`).join("\n")}`,o.recentMessages.length>0&&`近期对话：
${o.recentMessages.map(e=>`${e.role}: ${e.content}`).join("\n")}`].filter(Boolean).join("\n\n"):"",c=`你是私有化软件研发助手。请基于给出的项目源码回答问题，并使用 [编号] 标明依据来源；如果上下文不足，请明确说明。请使用中文回答。

${d?`${d}

`:""}项目来源：
${l}

问题：${e}`,p=await fetch(`${G}/api/v1/agent/auto_agent`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({aiAgentId:n,message:c,sessionId:`workspace-${i}`,maxStep:4})});if(!p.ok||!p.body)throw Error("当前智能体未接受请求，请先在智能体列表中加载后重试。");v("等待智能体响应");let h=p.body.getReader(),u=new TextDecoder,m="";for(;;){let{done:e,value:t}=await h.read();if(e)break;let r=(m+=u.decode(t,{stream:!0})).split(/\r?\n\r?\n/);m=r.pop()||"",r.forEach(e=>{oD(e).forEach(s)})}(m+=u.decode()).trim()&&oD(m).forEach(s),t.trim()||a("智能体已完成执行，但没有返回可展示的回答内容。"),await Promise.all([B("user",e),B("assistant",t)]),v("回答完成")}catch(e){a(e instanceof Error?e.message:"智能助手请求失败。"),v("执行失败")}finally{$(!1)}};return(0,m.jsxs)(sG,{children:[(0,m.jsx)(ez,{selectedKey:"personal-workspace",onSelect:t=>{let r={dashboard:"/dashboard","personal-workspace":"/personal-workspace","agent-list":"/agent-list","agent-config":"/agent-config","client-management":"/client-management","ai-client-api-management":"/ai-client-api-management","advisor-management":"/advisor-management","rag-order-management":"/rag-order-management","client-model-management":"/client-model-management","client-system-prompt-management":"/client-system-prompt-management","client-tool-mcp-management":"/client-tool-mcp-management"}[t];r&&e(r)},collapsed:t}),(0,m.jsxs)(sW,{$collapsed:t,children:[(0,m.jsx)(e6,{collapsed:t,onToggleSidebar:()=>r(e=>!e),onLogout:()=>{localStorage.clear(),e("/login")}}),(0,m.jsxs)(sX,{children:[(0,m.jsxs)(s0,{children:[(0,m.jsxs)(s1,{children:[(0,m.jsx)(sK,{heading:2,children:"个人 AI 工作台"}),(0,m.jsx)(sZ,{type:"tertiary",children:"围绕项目资料进行检索、问答和代码审查，回答会自动引用检索依据。"}),(0,m.jsxs)(s2,{children:[(0,m.jsxs)(s5,{$tone:"blue",children:[(0,m.jsx)(sV.A,{})," 混合检索"]}),(0,m.jsxs)(s5,{$tone:"green",children:[b," 个片段"]}),(0,m.jsx)(s5,{$tone:"amber",children:f})]})]}),(0,m.jsxs)(s6,{children:[(0,m.jsx)(j.pd,{value:i,onChange:a,prefix:"工作空间",showClear:!0}),(0,m.jsx)(j.pd,{value:n,onChange:s,prefix:"智能体",showClear:!0})]})]}),(0,m.jsxs)(s8,{children:[(0,m.jsxs)(s3,{children:[(0,m.jsxs)(s9,{children:[(0,m.jsxs)("div",{children:[(0,m.jsx)(sK,{heading:4,children:"项目上下文"}),(0,m.jsx)(s4,{type:"tertiary",children:"上传源码或文档后，会按片段建立检索依据。"})]}),(0,m.jsx)(j.m_,{content:"刷新索引统计",children:(0,m.jsx)(j.$n,{theme:"borderless",icon:(0,m.jsx)(aX.A,{}),onClick:T})})]}),(0,m.jsxs)(s7,{children:[(0,m.jsx)(nQ.A,{size:"extra-large"}),(0,m.jsx)("span",{children:"选择项目文件"}),(0,m.jsx)(oe,{children:".java / .md / .markdown / .txt，支持多选"}),(0,m.jsx)("input",{type:"file",accept:".java,.md,.markdown,.txt,text/plain,text/markdown",multiple:!0,onChange:e=>{l(Array.from(e.target.files||[]))},onClick:e=>{e.currentTarget.value=""}})]}),o.length>0?(0,m.jsx)(ot,{children:o.map(e=>(0,m.jsxs)(or,{children:[(0,m.jsx)(sF.A,{}),(0,m.jsx)("span",{children:e.name}),(0,m.jsxs)(sZ,{type:"tertiary",children:[Math.max(1,Math.round(e.size/1024))," KB"]})]},`${e.name}-${e.size}`))}):(0,m.jsx)(oi,{children:"还没有选择文件。"}),(0,m.jsx)(j.$n,{theme:"solid",type:"primary",block:!0,icon:(0,m.jsx)(nQ.A,{}),loading:A,onClick:S,children:"索引项目文件"})]}),(0,m.jsxs)(s3,{children:[(0,m.jsxs)(s9,{children:[(0,m.jsxs)("div",{children:[(0,m.jsx)(sK,{heading:4,children:"询问项目助手"}),(0,m.jsx)(s4,{type:"tertiary",children:"适合询问实现逻辑、接口设计、配置来源和代码路径。"})]}),(0,m.jsx)(j.vw,{color:E?"blue":"grey",children:f})]}),(0,m.jsxs)(oa,{children:[(0,m.jsx)(sZ,{type:"tertiary",children:"输入问题后按 Ctrl + Enter 或点击发送。"}),(0,m.jsx)(j.m_,{content:"当前回答复制到剪贴板",children:(0,m.jsx)(j.$n,{theme:"borderless",icon:(0,m.jsx)(tW.A,{}),disabled:!u.trim(),onClick:L})})]}),(0,m.jsxs)(on,{children:[(0,m.jsx)(os,{autosize:{minRows:2,maxRows:5},value:d,onChange:c,placeholder:"例如：AI 面试官采用了哪些评估维度？这些维度在哪里配置？",onKeyDown:e=>{(e.ctrlKey||e.metaKey)&&"Enter"===e.key&&D()}}),(0,m.jsx)(j.$n,{theme:"solid",type:"primary",icon:(0,m.jsx)(sY.A,{}),loading:E,onClick:D,children:"提问"})]}),(0,m.jsxs)(oo,{children:[(0,m.jsxs)(ol,{children:[(0,m.jsxs)(od,{children:[(0,m.jsx)(oc,{children:(0,m.jsx)(sH.A,{})}),(0,m.jsxs)("div",{children:[(0,m.jsx)(sZ,{strong:!0,children:"项目助手"}),(0,m.jsx)("br",{}),(0,m.jsx)(sZ,{type:"tertiary",size:"small",children:f})]})]}),(0,m.jsxs)(op,{children:[E&&(0,m.jsx)(j.tK,{size:"small"}),(0,m.jsxs)(j.vw,{color:p.length>0?"green":"grey",children:[p.length," 条依据"]})]})]}),(0,m.jsx)(oh,{children:(0,m.jsx)(oO,{content:u,loading:E})})]})]})]}),(0,m.jsxs)(s3,{style:{marginTop:16},children:[(0,m.jsxs)(s9,{children:[(0,m.jsxs)("div",{children:[(0,m.jsx)(sK,{heading:4,children:"检索依据"}),(0,m.jsx)(s4,{type:"tertiary",children:"关键词检索 + 向量检索 + RRF 融合排序。"})]}),(0,m.jsxs)(j.vw,{color:"blue",children:["Top ",p.length||0]})]}),(0,m.jsxs)(ok,{children:[0===p.length&&(0,m.jsx)(oi,{children:"提出问题后，这里会展示回答所依据的代码与文档片段。"}),p.map((e,t)=>(0,m.jsxs)(oT,{children:[(0,m.jsxs)(oS,{children:[(0,m.jsxs)(oN,{children:["[",t+1,"] ",e.sourcePath,":",e.startLine,"-",e.endLine]}),(0,m.jsx)(j.vw,{color:"blue",children:e.score.toFixed(4)})]}),(0,m.jsx)(sZ,{type:"tertiary",children:e.chunkType||e.language||"source"}),(0,m.jsxs)(oP,{children:[e.lexicalRank&&(0,m.jsxs)(j.vw,{color:"green",children:["词法 #",e.lexicalRank]}),e.semanticRank&&(0,m.jsxs)(j.vw,{color:"amber",children:["语义 #",e.semanticRank]})]}),(0,m.jsx)(oU,{source:e})]},e.id))]})]})]})]})]})},oz=()=>{let e=localStorage.getItem("token"),t=localStorage.getItem("userInfo"),r=localStorage.getItem("isLoggedIn");return!!(e&&t&&r)},oq=e=>{let{children:t}=e;return oz()?(0,m.jsx)(m.Fragment,{children:t}):(0,m.jsx)(y.C5,{to:"/login",replace:!0})},oV=()=>oz()?(0,m.jsx)(y.C5,{to:"/dashboard",replace:!0}):(0,m.jsx)(eE,{});(0,x.createRoot)(document.getElementById("root")).render((0,m.jsx)(()=>(0,m.jsx)(f.Kd,{basename:"/ai-agent-station",children:(0,m.jsxs)(y.BV,{children:[(0,m.jsx)(y.qh,{path:"/login",element:(0,m.jsx)(oV,{})}),(0,m.jsx)(y.qh,{path:"/dashboard",element:(0,m.jsx)(oq,{children:(0,m.jsx)(tj,{})})}),(0,m.jsx)(y.qh,{path:"/agent-config",element:(0,m.jsx)(oq,{children:(0,m.jsx)(aO,{})})}),(0,m.jsx)(y.qh,{path:"/agent-list",element:(0,m.jsx)(oq,{children:(0,m.jsx)(aW,{})})}),(0,m.jsx)(y.qh,{path:"/personal-workspace",element:(0,m.jsx)(oq,{children:(0,m.jsx)(oQ,{})})}),(0,m.jsx)(y.qh,{path:"/client-management",element:(0,m.jsx)(oq,{children:(0,m.jsx)(ns,{})})}),(0,m.jsx)(y.qh,{path:"/ai-client-api-management",element:(0,m.jsx)(oq,{children:(0,m.jsx)(nC,{})})}),(0,m.jsx)(y.qh,{path:"/advisor-management",element:(0,m.jsx)(oq,{children:(0,m.jsx)(nU,{})})}),(0,m.jsx)(y.qh,{path:"/rag-order-management",element:(0,m.jsx)(oq,{children:(0,m.jsx)(n5,{})})}),(0,m.jsx)(y.qh,{path:"/client-model-management",element:(0,m.jsx)(oq,{children:(0,m.jsx)(sd,{})})}),(0,m.jsx)(y.qh,{path:"/client-system-prompt-management",element:(0,m.jsx)(oq,{children:(0,m.jsx)(sE,{})})}),(0,m.jsx)(y.qh,{path:"/client-tool-mcp-management",element:(0,m.jsx)(oq,{children:(0,m.jsx)(sq,{})})}),(0,m.jsx)(y.qh,{path:"/",element:(0,m.jsx)(y.C5,{to:"/login",replace:!0})}),(0,m.jsx)(y.qh,{path:"*",element:(0,m.jsx)(y.C5,{to:"/login",replace:!0})})]})}),{}))}},o={};function l(e){var t=o[e];if(void 0!==t)return t.exports;var r=o[e]={id:e,loaded:!1,exports:{}};return s[e].call(r.exports,r,r.exports,l),r.loaded=!0,r.exports}l.m=s,l.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return l.d(t,{a:t}),t},t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,l.t=function(r,i){if(1&i&&(r=this(r)),8&i||"object"==typeof r&&r&&(4&i&&r.__esModule||16&i&&"function"==typeof r.then))return r;var a=Object.create(null);l.r(a);var n={};e=e||[null,t({}),t([]),t(t)];for(var s=2&i&&r;"object"==typeof s&&!~e.indexOf(s);s=t(s))Object.getOwnPropertyNames(s).forEach(e=>{n[e]=()=>r[e]});return n.default=()=>r,l.d(a,n),a},l.d=(e,t)=>{for(var r in t)l.o(t,r)&&!l.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},l.g=(()=>{if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(e){if("object"==typeof window)return window}})(),l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),l.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),l.nc=void 0,r=[],l.O=(e,t,i,a)=>{if(t){a=a||0;for(var n=r.length;n>0&&r[n-1][2]>a;n--)r[n]=r[n-1];r[n]=[t,i,a];return}for(var s=1/0,n=0;n<r.length;n++){for(var[t,i,a]=r[n],o=!0,d=0;d<t.length;d++)(!1&a||s>=a)&&Object.keys(l.O).every(e=>l.O[e](t[d]))?t.splice(d--,1):(o=!1,a<s&&(s=a));if(o){r.splice(n--,1);var c=i();void 0!==c&&(e=c)}}return e},l.p="/ai-agent-station/",i={410:0},l.O.j=e=>0===i[e],a=(e,t)=>{var r,a,[n,s,o]=t,d=0;if(n.some(e=>0!==i[e])){for(r in s)l.o(s,r)&&(l.m[r]=s[r]);if(o)var c=o(l)}for(e&&e(t);d<n.length;d++)a=n[d],l.o(i,a)&&i[a]&&i[a][0](),i[a]=0;return l.O(c)},(n=self.webpackChunk_flowgram_ai_ai_agent_station=self.webpackChunk_flowgram_ai_ai_agent_station||[]).forEach(a.bind(null,0)),n.push=a.bind(null,n.push.bind(n));var d=l.O(void 0,["783","535","584"],function(){return l(4666)});d=l.O(d)})();
