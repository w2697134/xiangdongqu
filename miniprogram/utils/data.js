const ASSETS = "/assets";
const consultWelcome =
  "您好，我是向东渠数字馆讲解助手。可以问我工程概况、通水时间、向东渠精神，也可以让我帮您找到视频、纪录片和图文影像入口。";

const navItems = [
  { id: "panorama", label: "全景水渠", icon: `${ASSETS}/nav-icons/panorama-canal.png` },
  { id: "vr", label: "展厅VR", icon: `${ASSETS}/nav-icons/vr-hall.png` },
  { id: "history", label: "历史资料", icon: `${ASSETS}/nav-icons/history-archive.png` },
  { id: "spirit", label: "精神内涵", icon: `${ASSETS}/nav-icons/spirit-torch.png` },
  { id: "value", label: "时代价值", icon: `${ASSETS}/nav-icons/value-monument.png` },
  { id: "yunxiao", label: "今日云霄", icon: `${ASSETS}/nav-icons/yunxiao-landscape.png` },
  { id: "news", label: "资讯动态", icon: `${ASSETS}/nav-icons/news-scroll.png` }
];

const featureCards = [
  {
    id: "about",
    title: "向东渠简介",
    subtitle: "工程概况与精神传承",
    action: "了解详情",
    image: `${ASSETS}/content/feature-about.jpg`
  },
  {
    id: "guide",
    title: "向东渠导览",
    subtitle: "线上展馆导览",
    action: "进入导览",
    image: `${ASSETS}/content/feature-guide.jpg`
  },
  {
    id: "digital",
    title: "数字馆导览",
    subtitle: "数字展馆参观入口",
    action: "进入展馆",
    image: `${ASSETS}/content/feature-digital.jpg`
  }
];

const videos = [
  { id: "v1", title: "向东！向东！", duration: "06:18", image: `${ASSETS}/content/video-main.jpg` },
  { id: "v2", title: "攻坚克难 巧造天河：你不知道的福建向东渠（三）", duration: "08:42", image: `${ASSETS}/content/video-main.jpg` },
  { id: "v3", title: "攻坚克难 巧造天河：你不知道的福建向东渠（二）", duration: "07:25", image: `${ASSETS}/content/video-main.jpg` },
  { id: "v4", title: "攻坚克难 巧造天河：你不知道的福建向东渠（一）", duration: "09:10", image: `${ASSETS}/content/video-main.jpg` }
];

const documentary = [
  {
    id: "d1",
    title: "央视纪录片《国家记忆》",
    subtitle: "一渠清水向东流 上集",
    duration: "24:00",
    image: `${ASSETS}/content/documentary-memory.jpg`
  },
  {
    id: "d2",
    title: "央视纪录片《国家记忆》",
    subtitle: "一渠清水向东流 下集",
    duration: "24:00",
    image: `${ASSETS}/content/documentary-memory.jpg`
  }
];

const gallery = [
  {
    id: "g1",
    title: "建设现场",
    kind: "image",
    summary: "记录向东渠建设过程中的劳动场景与工程节点。",
    date: "历史影像",
    image: `${ASSETS}/content/gallery-construction.jpg`
  },
  {
    id: "g2",
    title: "渠首风貌",
    kind: "image",
    summary: "展示水渠沿线、渠首及周边山水环境。",
    date: "实景资料",
    image: `${ASSETS}/content/gallery-canal-head.jpg`
  },
  {
    id: "g3",
    title: "历史影像",
    kind: "image",
    summary: "用于收录老照片、手稿、档案扫描件等珍贵资料。",
    date: "档案整理",
    image: `${ASSETS}/content/gallery-archive.jpg`
  },
  {
    id: "g4",
    title: "纪念展陈",
    kind: "image",
    summary: "承载展馆陈列、主题展板和纪念活动图片。",
    date: "展馆记录",
    image: `${ASSETS}/content/gallery-exhibition.jpg`
  },
  {
    id: "g5",
    title: "口述记忆",
    kind: "video",
    summary: "收录人物访谈、讲述视频和短片内容。",
    date: "视频资料",
    image: `${ASSETS}/content/gallery-waterline.jpg`
  },
  {
    id: "g6",
    title: "沿线风光",
    kind: "image",
    summary: "上传今日水渠沿线风景、村镇变化与生态面貌。",
    date: "今日影像",
    image: `${ASSETS}/content/gallery-waterline.jpg`
  }
];

const tabs = [
  { id: "home", label: "首页", icon: `${ASSETS}/tab/home.svg` },
  { id: "guide", label: "导览", icon: `${ASSETS}/tab/guide.svg` },
  { id: "consult", label: "智能咨询", icon: `${ASSETS}/tab/bot.svg`, badge: "AI" }
];

module.exports = {
  assets: ASSETS,
  navItems,
  featureCards,
  videos,
  documentary,
  gallery,
  tabs,
  consultWelcome,
  consultApiUrl: "https://xiangdongqu-digital-museum.netlify.app/api/ai-consult"
};
