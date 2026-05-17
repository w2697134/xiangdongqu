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

function createPlaceholderUrl({ type = "feature", id = "", title = "向东渠内容", kind = "mixed" }) {
  return `/pages/placeholder/placeholder?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}&kind=${encodeURIComponent(kind)}`;
}

const TYPE_COPY = {
  guide: {
    eyebrow: "展馆导览",
    status: "线上展馆导览",
    description: "汇集水渠实景、展厅 VR、历史节点与参观动线，便于快速进入各类展陈内容。",
    label: "导览资料"
  },
  feature: {
    eyebrow: "数字馆入口",
    status: "专题展陈",
    description: "围绕向东渠简介、数字导览与相关资料，集中呈现工程记忆与精神传承。",
    label: "专题资料"
  },
  video: {
    eyebrow: "影像资料",
    status: "影像展映",
    description: "收录向东渠风采、工程记忆和相关讲述内容，形成线上影像展陈入口。",
    label: "视频影像"
  },
  documentary: {
    eyebrow: "纪录片资料",
    status: "纪录片展映",
    description: "聚合《国家记忆》相关分集说明、背景资料与影像入口，呈现“一渠清水向东流”的历史叙事。",
    label: "纪录片"
  },
  gallery: {
    eyebrow: "图文影像",
    status: "图文档案",
    description: "集中展示建设现场、渠首风貌、历史影像和沿线风光，形成可浏览的图文资料索引。",
    label: "图文资料"
  },
  news: {
    eyebrow: "资讯动态",
    status: "展馆动态",
    description: "发布展馆更新、主题活动和资料上新信息，便于线上展馆持续运营。",
    label: "动态内容"
  }
};

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
    const copy = TYPE_COPY[type];

    this.setData({
      type,
      kind: safeDecode(options.kind, "mixed"),
      title: safeDecode(options.title, "向东渠内容"),
      eyebrow: copy.eyebrow,
      status: copy.status,
      description: copy.description,
      label: copy.label,
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
        url: createPlaceholderUrl({
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

    if (!question || this.data.isConsulting) {
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
          : payload.error || "智能讲解服务暂时繁忙，请稍后再试。";

        this.setData({
          consultMessages: this.data.consultMessages.concat(createMessage("assistant", content))
        });
      },
      fail: () => {
        this.setData({
          consultMessages: this.data.consultMessages.concat(
            createMessage("assistant", "网络请求失败，请检查小程序 request 合法域名配置。")
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

    const nextX = this.dragState.originX + touch.clientX - this.dragState.startX;
    const nextY = this.dragState.originY + touch.clientY - this.dragState.startY;

    this.setData({
      panelX: Math.max(-36, Math.min(36, nextX)),
      panelY: Math.max(-220, Math.min(0, nextY))
    });
  },

  onPanelTouchEnd() {
    this.dragState = null;
  }
});
