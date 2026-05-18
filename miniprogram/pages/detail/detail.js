const museumData = require("../../utils/data");

function safeDecode(value, fallback) {
  if (!value) {
    return fallback;
  }

  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInlineMarkdown(value) {
  return String(value)
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return `<strong>${escapeHtml(part.slice(2, -2))}</strong>`;
      }

      return escapeHtml(part.replace(/\*\*/g, ""));
    })
    .join("");
}

function renderMessageHtml(content) {
  const lines = String(content).replace(/\r\n/g, "\n").split("\n");
  const html = lines
    .map((line) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return "";
      }

      const heading = trimmed.match(/^#{1,3}\s+(.+)$/);
      const unordered = trimmed.match(/^[-*]\s+(.+)$/);
      const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);

      if (heading) {
        return `<p><strong>${renderInlineMarkdown(heading[1])}</strong></p>`;
      }

      if (unordered) {
        return `<p>· ${renderInlineMarkdown(unordered[1])}</p>`;
      }

      if (ordered) {
        return `<p>${renderInlineMarkdown(ordered[1])}</p>`;
      }

      return `<p>${renderInlineMarkdown(trimmed)}</p>`;
    })
    .filter(Boolean)
    .join("");

  return html || `<p>${renderInlineMarkdown(content)}</p>`;
}

function createMessage(role, content) {
  return {
    role,
    content,
    html: renderMessageHtml(content)
  };
}

function getActiveTab(type) {
  return type === "guide" ? "guide" : "home";
}

function createDetailUrl({ type = "feature", id = "", title = "向东渠内容", kind = "mixed" }) {
  return `/pages/detail/detail?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}&kind=${encodeURIComponent(kind)}`;
}

const TYPE_COPY = {
  guide: {
    eyebrow: "展馆导览",
    status: "向东渠数字馆导览",
    description: "数字馆以工程历史、精神传承、影像资料和今日风貌为主线，串联首页各类栏目。",
    label: "导览资料",
    details: [
      { title: "工程历史", text: "通过历史资料、工程简介和纪录片内容回顾向东渠建设历程。" },
      { title: "精神传承", text: "围绕勇于担当、团结协作、攻坚克难、开拓创新展开讲解。" }
    ],
    note: "建议先从全景水渠和历史资料进入，再浏览视频、纪录片和图文影像。"
  },
  feature: {
    eyebrow: "数字馆入口",
    status: "专题展陈",
    description: "围绕向东渠简介、数字导览与相关资料，集中呈现工程记忆与精神传承。",
    label: "专题资料",
    details: [
      { title: "工程记忆", text: "梳理工程缘起、建设过程、渠系特点与通水成效。" },
      { title: "精神传承", text: "呈现勇于担当、团结协作、攻坚克难、开拓创新的精神内涵。" }
    ],
    note: "用于承载数字馆重点专题，适合领导汇报和现场导览同步展示。"
  },
  video: {
    eyebrow: "影像资料",
    status: "影像展映",
    description: "收录向东渠风采、工程记忆和相关讲述内容，形成线上影像展陈入口。",
    label: "视频影像",
    details: [
      { title: "影像主题", text: "围绕工程建设、渠首风貌、人物讲述和地方记忆组织影像内容。" },
      { title: "导览价值", text: "通过影像增强历史现场感，辅助观众理解工程规模与建设精神。" }
    ],
    note: "影像资料适合在汇报和参观过程中作为重点展示内容。"
  },
  documentary: {
    eyebrow: "纪录片资料",
    status: "纪录片展映",
    description: "聚合《国家记忆》相关分集说明、背景资料与影像入口，呈现“一渠清水向东流”的历史叙事。",
    label: "纪录片",
    details: [
      { title: "节目线索", text: "围绕“一渠清水向东流”上下集内容，呈现工程建设与精神传承。" },
      { title: "背景说明", text: "结合地方史料、工程节点和人物记忆，帮助观众理解纪录片叙事。" }
    ],
    note: "纪录片栏目适合承担权威影像背书，与数字馆主题形成呼应。"
  },
  gallery: {
    eyebrow: "图文影像",
    status: "图文档案",
    description: "集中展示建设现场、渠首风貌、历史影像和沿线风光，形成可浏览的图文资料索引。",
    label: "图文资料",
    details: [
      { title: "档案类别", text: "涵盖建设现场、渠首风貌、历史影像、纪念展陈、口述记忆和沿线风光。" },
      { title: "观看重点", text: "通过照片、文字说明和影像线索展示向东渠的历史现场与今日面貌。" }
    ],
    note: "图文影像栏目适合快速浏览，也适合在汇报时作为视觉资料索引。"
  },
  news: {
    eyebrow: "资讯动态",
    status: "展馆动态",
    description: "资讯动态集中呈现数字馆相关节点、教育实践活动和展陈内容更新。",
    label: "动态内容",
    details: [
      { title: "数字馆上线", text: "向东渠事迹数字馆以线上方式集中呈现工程历史、精神传承和影像资料。" },
      { title: "基地建设", text: "向东渠事迹教育实践基地暨展示馆于 2022 年 7 月 1 日揭牌开馆。" }
    ],
    note: "资讯动态展示数字馆与教育实践基地的重要节点。"
  }
};

const GUIDE_DETAIL_BY_ID = {
  panorama: {
    status: "水渠全景导览",
    description: "以水渠沿线、渠首风貌和山水格局为主线，呈现向东渠工程的整体空间印象。",
    details: [
      { title: "渠系格局", text: "向东渠渠线串联山地、水源与受益区域，展示引水工程的整体布局。" },
      { title: "参观重点", text: "重点关注渠首、沿线渡槽、村镇用水和今日生态景观。" }
    ],
    note: "全景水渠适合先浏览，帮助观众建立对向东渠空间规模的整体认识。"
  },
  vr: {
    status: "沉浸式展厅导览",
    description: "围绕展厅主题展板、历史照片、工程示意和精神谱系，组织线上参观动线。",
    details: [
      { title: "展厅结构", text: "按工程缘起、建设攻坚、通水成效和精神传承展开。" },
      { title: "讲解重点", text: "突出干部群众团结协作、攻坚克难建设水渠的历史现场。" }
    ],
    note: "展厅 VR 与智能讲解配合使用，可形成完整的线上参观体验。"
  },
  history: {
    status: "工程档案与历史节点",
    description: "梳理向东渠动工、建设、竣工通水和教育实践基地建设等关键历史资料。",
    details: [
      { title: "动工建设", text: "工程于 1970 年 9 月 17 日正式动工，集中力量解决区域用水困难。" },
      { title: "竣工通水", text: "1973 年 3 月 12 日，向东渠竣工通水，成为当地重要水利工程记忆。" }
    ],
    note: "历史资料栏目适合用于汇报工程脉络和核对关键时间节点。"
  },
  spirit: {
    status: "向东渠精神解读",
    description: "围绕勇于担当、团结协作、攻坚克难、开拓创新四个关键词解读向东渠精神。",
    details: [
      { title: "勇于担当", text: "面对缺水难题主动作为，以工程建设回应群众生产生活需求。" },
      { title: "团结协作", text: "云霄、东山两地干部群众协同推进，凝聚跨区域建设合力。" }
    ],
    note: "精神内涵栏目是数字馆思想教育和研学讲解的核心内容。"
  },
  value: {
    status: "水利记忆与现实启示",
    description: "从民生水利、区域协作、红色教育和乡村发展角度呈现向东渠的时代价值。",
    details: [
      { title: "民生价值", text: "工程建设回应工农业和生活用水需求，体现水利工程服务群众的根本属性。" },
      { title: "教育价值", text: "向东渠事迹为党员教育、研学参观和地方史学习提供鲜活材料。" }
    ],
    note: "时代价值栏目连接历史叙事与当代实践。"
  },
  yunxiao: {
    status: "水渠沿线新貌",
    description: "展示今日云霄的山水风貌、村镇变化和向东渠沿线生态景观。",
    details: [
      { title: "沿线风光", text: "呈现水渠沿线山水、田园和村镇环境，延续工程泽被一方的现实图景。" },
      { title: "地方变化", text: "结合今日生产生活面貌，展示水利工程与地方发展的持续联系。" }
    ],
    note: "今日云霄栏目强化数字馆的现实感和地方形象展示。"
  }
};

function getItemById(list, id) {
  return list.find((item) => item.id === id);
}

function getDetailCopy(type, id, title) {
  const base = TYPE_COPY[type] || TYPE_COPY.feature;

  if (type === "guide" && GUIDE_DETAIL_BY_ID[id]) {
    return Object.assign({}, base, GUIDE_DETAIL_BY_ID[id]);
  }

  if (type === "video") {
    const item = getItemById(museumData.videos, id);
    if (item) {
      return Object.assign({}, base, {
        description: `${item.title}，片长 ${item.duration}。影像内容聚焦向东渠工程记忆、建设精神和地方风貌。`,
        details: [
          { title: "片段信息", text: `${item.title}，时长 ${item.duration}。` },
          { title: "展示价值", text: "适合在参观导览中配合工程简介和图文资料共同讲解。" }
        ]
      });
    }
  }

  if (type === "documentary") {
    const item = getItemById(museumData.documentary, id) || getItemById(museumData.documentary, `d${id}`);
    if (item) {
      return Object.assign({}, base, {
        description: `${item.title}，片长 ${item.duration}。该分集围绕“一渠清水向东流”展开历史叙事。`,
        details: [
          { title: "节目内容", text: `${item.title}，时长 ${item.duration}。` },
          { title: "资料价值", text: "纪录片资料为数字馆提供权威影像支撑。" }
        ]
      });
    }
  }

  if (type === "gallery") {
    const item = getItemById(museumData.gallery, id);
    if (item) {
      return Object.assign({}, base, {
        description: item.summary,
        details: [
          { title: item.date, text: item.summary },
          { title: item.kind === "video" ? "影像记录" : "图文记录", text: "通过具体图文资料呈现向东渠历史现场与今日面貌。" }
        ]
      });
    }
  }

  return Object.assign({}, base, { title });
}

Page({
  data: {
    tabs: museumData.tabs,
    activeTab: "home",
    type: "feature",
    kind: "mixed",
    title: "向东渠内容",
    eyebrow: TYPE_COPY.feature.eyebrow,
    status: TYPE_COPY.feature.status,
    description: TYPE_COPY.feature.description,
    label: TYPE_COPY.feature.label,
    details: TYPE_COPY.feature.details,
    note: TYPE_COPY.feature.note,
    consultOpen: false,
    consultInput: "",
    consultMessages: [
      createMessage("assistant", museumData.consultWelcome)
    ],
    isConsulting: false,
    panelX: 0,
    panelY: 0
  },

  onLoad(options) {
    const type = TYPE_COPY[options.type] ? options.type : "feature";
    const id = safeDecode(options.id, "");
    const title = safeDecode(options.title, "向东渠内容");
    const copy = getDetailCopy(type, id, title);

    this.setData({
      type,
      id,
      kind: safeDecode(options.kind, "mixed"),
      title,
      eyebrow: copy.eyebrow,
      status: copy.status,
      description: copy.description,
      label: copy.label,
      details: copy.details,
      note: copy.note,
      activeTab: getActiveTab(type)
    });
  },

  goHome() {
    wx.redirectTo({ url: "/pages/index/index" });
  },

  onTabTap(event) {
    const tab = event.currentTarget.dataset.tab;

    if (tab === "consult") {
      this.setData({
        activeTab: "consult",
        consultOpen: true,
        panelX: 0,
        panelY: 0
      });
      return;
    }

    if (tab === "home") {
      this.goHome();
      return;
    }

    if (tab === "guide" || tab === "news") {
      wx.redirectTo({
        url: createDetailUrl({
          type: tab,
          id: tab,
          title: tab === "guide" ? "向东渠导览" : "资讯动态",
          kind: "mixed"
        })
      });
    }
  },

  closeConsult() {
    this.setData({
      consultOpen: false,
      activeTab: getActiveTab(this.data.type),
      panelX: 0,
      panelY: 0
    });
  },

  onConsultInput(event) {
    this.setData({ consultInput: event.detail.value });
  },

  submitConsult() {
    const question = this.data.consultInput.trim();

    if (this.data.isConsulting) {
      return;
    }

    if (!question) {
      wx.showToast({
        title: "请输入咨询内容",
        icon: "none"
      });
      return;
    }

    const userMessage = createMessage("user", question);
    const history = this.data.consultMessages
      .slice(1)
      .map((message) => ({ role: message.role, content: message.content }))
      .concat({ role: "user", content: question });

    this.setData({
      consultMessages: this.data.consultMessages.concat(userMessage),
      consultInput: "",
      isConsulting: true
    });

    wx.request({
      url: museumData.consultApiUrl,
      method: "POST",
      header: {
        "content-type": "application/json"
      },
      data: { messages: history },
      success: (response) => {
        const payload = response.data || {};
        const ok = response.statusCode >= 200 && response.statusCode < 300;
        const content = ok
          ? payload.content || "这条咨询暂时没有形成有效回复，请换个问法再试。"
          : "智能讲解服务暂时繁忙，请稍后再试。";

        this.setData({
          consultMessages: this.data.consultMessages.concat(createMessage("assistant", content))
        });
      },
      fail: () => {
        this.setData({
          consultMessages: this.data.consultMessages.concat(
            createMessage("assistant", "智能讲解服务暂时未连通，请稍后再试。")
          )
        });
      },
      complete: () => {
        this.setData({ isConsulting: false });
      }
    });
  },

  onPanelTouchStart(event) {
    const touch = event.touches && event.touches[0];

    if (!touch) {
      return;
    }

    this.dragState = {
      startX: touch.clientX,
      startY: touch.clientY,
      originX: this.data.panelX,
      originY: this.data.panelY
    };
  },

  onPanelTouchMove(event) {
    const touch = event.touches && event.touches[0];

    if (!touch || !this.dragState) {
      return;
    }

    const nextY = this.dragState.originY + touch.clientY - this.dragState.startY;

    this.setData({
      panelY: Math.max(-220, Math.min(0, nextY))
    });
  },

  onPanelTouchEnd() {
    this.dragState = null;
  }
});
