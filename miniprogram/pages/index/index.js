const museumData = require("../../utils/data");

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

function createPlaceholderUrl({ type = "feature", id = "", title = "向东渠内容", kind = "mixed" }) {
  return `/pages/placeholder/placeholder?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}&kind=${encodeURIComponent(kind)}`;
}

Page({
  data: {
    assets: museumData.assets,
    navItems: museumData.navItems,
    featureCards: museumData.featureCards,
    videos: museumData.videos,
    selectedVideo: museumData.videos[0],
    documentary: museumData.documentary,
    gallery: museumData.gallery,
    tabs: museumData.tabs,
    activeTab: "home",
    consultOpen: false,
    consultInput: "",
    consultMessages: [
      createMessage("assistant", museumData.consultWelcome)
    ],
    isConsulting: false,
    panelX: 0,
    panelY: 0
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

    if (tab === "guide" || tab === "news") {
      wx.navigateTo({
        url: createPlaceholderUrl({
          type: tab,
          id: tab,
          title: tab === "guide" ? "向东渠导览" : "资讯动态",
          kind: "mixed"
        })
      });
      return;
    }

    this.setData({
      activeTab: tab,
      consultOpen: false
    });
  },

  openPlaceholder(event) {
    const dataset = event.currentTarget.dataset;
    wx.navigateTo({
      url: createPlaceholderUrl({
        type: dataset.type,
        id: dataset.id,
        title: dataset.title || dataset.label,
        kind: dataset.kind
      })
    });
  },

  selectVideo(event) {
    const id = event.currentTarget.dataset.id;
    const selectedVideo = museumData.videos.find((item) => item.id === id) || museumData.videos[0];
    this.setData({ selectedVideo });
  },

  openVideo(event) {
    const dataset = event.currentTarget.dataset;
    wx.navigateTo({
      url: createPlaceholderUrl({
        type: dataset.type || "video",
        id: dataset.id,
        title: dataset.title || "视频内容",
        kind: "video"
      })
    });
  },

  previewImage(event) {
    const current = event.currentTarget.dataset.src;
    const urls = museumData.gallery.map((item) => item.image);
    wx.previewImage({
      current,
      urls
    });
  },

  closeConsult() {
    this.setData({
      consultOpen: false,
      activeTab: "home",
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
