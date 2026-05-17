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
    status: "展陈内容整理中",
    description: "这一栏目将承接水渠实景、VR 展厅、历史节点和参观动线，后续接入正式图片、视频与导览说明。",
    label: "导览资料"
  },
  feature: {
    eyebrow: "数字馆入口",
    status: "专题内容整理中",
    description: "专题页框架已预留，后续可放置简介、导览图、展陈图文和相关视频资料。",
    label: "专题资料"
  },
  video: {
    eyebrow: "影像资料",
    status: "影像资料归档中",
    description: "视频封面、播放源、解说文字和相关资料正在预留位置，接入后可直接替换当前展陈卡片。",
    label: "视频影像"
  },
  documentary: {
    eyebrow: "纪录片资料",
    status: "纪录片资料整理中",
    description: "这里将用于承载《国家记忆》相关片源、分集说明和背景资料，保持数字馆统一展陈风格。",
    label: "纪录片"
  },
  gallery: {
    eyebrow: "图文影像",
    status: "图文资料待归档",
    description: "图片、档案、口述记忆和活动影像将集中整理到这里，当前先保留统一的内容框架。",
    label: "图文资料"
  },
  news: {
    eyebrow: "资讯动态",
    status: "动态内容整理中",
    description: "这里将承载展馆更新、活动记录和资料上新信息，后续可接入正式列表或后台数据。",
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
      createMessage("assistant", "您好，我可以帮您查询向东渠历史、展馆导览、视频资料和参观路线。")
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
          ? payload.content || "接口没有返回内容。"
          : payload.error || "智能咨询接口暂时不可用。";

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
