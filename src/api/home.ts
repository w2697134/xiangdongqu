import type { HomePageData } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

const mockHomePageData: HomePageData = {
  navItems: [
    { id: "panorama", label: "全景水渠", href: "/panorama" },
    { id: "vr", label: "展厅VR", href: "/vr" },
    { id: "history", label: "历史资料", href: "/history" },
    { id: "spirit", label: "精神内涵", href: "/spirit" },
    { id: "value", label: "时代价值", href: "/value" },
    { id: "yunxiao", label: "今日云霄", href: "/yunxiao" },
    { id: "news", label: "资讯动态", href: "/news" },
  ],
  featureCards: [
    {
      id: "about",
      title: "向东渠简介",
      subtitle: "工程概况与精神传承",
      action: "了解详情",
      href: "/about",
      image: "/assets/content/feature-about.png",
    },
    {
      id: "guide",
      title: "向东渠导览",
      subtitle: "线上展馆导览",
      action: "进入导览",
      href: "/guide",
      image: "/assets/content/feature-guide.png",
    },
    {
      id: "digital",
      title: "数字馆导览",
      subtitle: "数字展馆参观入口",
      action: "进入展馆",
      href: "/digital-guide",
      image: "/assets/content/feature-digital.png",
    },
  ],
  videos: [
    { id: "v1", title: "向东！向东！", duration: "06:18", href: "/videos/v1", image: "/assets/content/video-main.png" },
    {
      id: "v2",
      title: "攻坚克难 巧造天河：你不知道的福建向东渠（三）",
      duration: "08:42",
      href: "/videos/v2",
      image: "/assets/content/video-main.png",
    },
    {
      id: "v3",
      title: "攻坚克难 巧造天河：你不知道的福建向东渠（二）",
      duration: "07:25",
      href: "/videos/v3",
      image: "/assets/content/video-main.png",
    },
    {
      id: "v4",
      title: "攻坚克难 巧造天河：你不知道的福建向东渠（一）",
      duration: "09:10",
      href: "/videos/v4",
      image: "/assets/content/video-main.png",
    },
  ],
  documentary: [
    {
      id: "d1",
      title: "央视纪录片《国家记忆——一渠清水向东流》上集",
      duration: "24:00",
      href: "/documentary/1",
      image: "/assets/content/documentary-memory.png",
    },
    {
      id: "d2",
      title: "央视纪录片《国家记忆——一渠清水向东流》下集",
      duration: "24:00",
      href: "/documentary/2",
      image: "/assets/content/documentary-memory.png",
    },
  ],
  gallery: [
    {
      id: "g1",
      title: "建设现场",
      kind: "image",
      summary: "记录向东渠建设过程中的劳动场景与工程节点。",
      date: "历史影像",
      image: "/assets/content/gallery-construction.png",
    },
    {
      id: "g2",
      title: "渠首风貌",
      kind: "image",
      summary: "展示水渠沿线、渠首及周边山水环境。",
      date: "实景资料",
      image: "/assets/content/gallery-canal-head.png",
    },
    {
      id: "g3",
      title: "历史影像",
      kind: "image",
      summary: "用于收录老照片、手稿、档案扫描件等珍贵资料。",
      date: "档案整理",
      image: "/assets/content/gallery-archive.png",
    },
    {
      id: "g4",
      title: "纪念展陈",
      kind: "image",
      summary: "承载展馆陈列、主题展板和纪念活动图片。",
      date: "展馆记录",
      image: "/assets/content/gallery-exhibition.png",
    },
    {
      id: "g5",
      title: "口述记忆",
      kind: "video",
      summary: "收录人物访谈、讲述视频和短片内容。",
      date: "视频资料",
      image: "/assets/content/gallery-waterline.png",
    },
    {
      id: "g6",
      title: "沿线风光",
      kind: "image",
      summary: "上传今日水渠沿线风景、村镇变化与生态面貌。",
      date: "今日影像",
      image: "/assets/content/gallery-waterline.png",
    },
    {
      id: "g7",
      title: "工程细节",
      kind: "video",
      summary: "适合放置工程节点讲解、导览片段与现场记录。",
      date: "导览视频",
      image: "/assets/content/gallery-waterline.png",
    },
    {
      id: "g8",
      title: "活动掠影",
      kind: "image",
      summary: "收录研学参观、主题活动和宣传展示照片。",
      date: "活动记录",
      image: "/assets/content/gallery-exhibition.png",
    },
  ],
};

export async function fetchHomePageData(): Promise<HomePageData> {
  if (!API_BASE_URL) {
    return mockHomePageData;
  }

  try {
    const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/home`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Home API returned ${response.status}`);
    }

    return (await response.json()) as HomePageData;
  } catch (error) {
    console.warn("Falling back to mock home page data.", error);
    return mockHomePageData;
  }
}
