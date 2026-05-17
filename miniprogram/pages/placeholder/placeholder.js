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
    type: "feature",
    kind: "mixed",
    title: "向东渠内容",
    eyebrow: TYPE_COPY.feature.eyebrow,
    status: TYPE_COPY.feature.status,
    description: TYPE_COPY.feature.description,
    label: TYPE_COPY.feature.label
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
      label: copy.label
    });
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack();
      return;
    }

    wx.redirectTo({ url: "/pages/index/index" });
  },

  goHome() {
    wx.redirectTo({ url: "/pages/index/index" });
  }
});
