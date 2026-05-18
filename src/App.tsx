import { type ReactNode, useEffect, useRef, useState } from "react";
import { Bot, ChevronRight, Compass, Home, Images, Play, Send, X } from "lucide-react";
import { sendConsultMessage, type ConsultMessage } from "./api/consult";
import { fetchHomePageData } from "./api/home";
import type { FeatureCard, GalleryItem, HomePageData, NavItem, VideoItem } from "./types";

type TopNavKey = "home" | "guide" | "news" | "ai" | "none";
type MobileTabIconType = "recommend" | "guide" | "news" | "ai";
type DetailKind = "guide" | "feature" | "video" | "documentary" | "gallery" | "news";

type DetailPageData = {
  kind: DetailKind;
  eyebrow: string;
  title: string;
  status: string;
  description: string;
  details: Array<{
    title: string;
    text: string;
  }>;
  note: string;
  image?: string;
  mediaLabel?: string;
  duration?: string;
  newsItems?: Array<{
    date: string;
    title: string;
    text: string;
  }>;
  links?: Array<{
    label: string;
    href: string;
  }>;
  backHref: string;
  backLabel: string;
};

const iconMap = {
  panorama: "/assets/nav-icons/panorama-canal.png",
  vr: "/assets/nav-icons/vr-hall.png",
  history: "/assets/nav-icons/history-archive.png",
  spirit: "/assets/nav-icons/spirit-torch.png",
  value: "/assets/nav-icons/value-monument.png?v=20260517-2",
  yunxiao: "/assets/nav-icons/yunxiao-landscape.png",
  news: "/assets/nav-icons/news-scroll.png",
};

const consultWelcome = "您好，我是向东渠数字馆讲解助手。可以问我工程概况、通水时间、向东渠精神，也可以让我帮您找到视频、纪录片和图文影像入口。";
const consultPrompts = ["向东渠工程概况", "向东渠精神是什么？", "数字馆有哪些入口？", "纪录片在哪里看？"];

function isPathSegment(path: string, segment: string) {
  return path === segment || path.startsWith(`${segment}/`);
}

function getTopNavActiveItem(data: HomePageData) {
  const path = normalizePath(window.location.pathname);

  if (isPathSegment(path, "/ai-consult")) {
    return "ai";
  }

  if (isPathSegment(path, "/guide")) {
    return "guide";
  }

  if (isPathSegment(path, "/news")) {
    return "news";
  }

  const navItem = data.navItems.find((item) => normalizePath(item.href) === path);
  if (navItem) {
    return navItem.id === "news" ? "news" : "guide";
  }

  const featureItem = data.featureCards.find((item) => normalizePath(item.href) === path);
  if (featureItem?.id === "guide" || featureItem?.id === "digital") {
    return "guide";
  }

  if (path === "/" || featureItem?.id === "about" || isPathSegment(path, "/videos") || isPathSegment(path, "/documentary") || isPathSegment(path, "/gallery")) {
    return "home";
  }

  return "none";
}

function normalizePath(pathname: string) {
  const cleanPath = pathname.replace(/\/+$/, "");
  return cleanPath || "/";
}

const GUIDE_DETAIL_BY_ID: Record<string, Partial<DetailPageData>> = {
  panorama: {
    title: "全景水渠",
    status: "水渠全景导览",
    description: "以水渠沿线、渠首风貌和山水格局为主线，呈现向东渠工程的整体空间印象。",
    details: [
      { title: "渠系格局", text: "向东渠渠线串联山地、水源与受益区域，展示引水工程的整体布局。" },
      { title: "参观重点", text: "重点关注渠首、沿线渡槽、村镇用水和今日生态景观。" },
      { title: "工程价值", text: "通过全景视角理解工程对云霄、东山生产生活用水的历史作用。" },
    ],
    note: "全景水渠适合先浏览，帮助观众建立对向东渠空间规模的整体认识。",
  },
  vr: {
    title: "展厅VR",
    status: "沉浸式展厅导览",
    description: "围绕展厅主题展板、历史照片、工程示意和精神谱系，组织线上参观动线。",
    details: [
      { title: "展厅结构", text: "按工程缘起、建设攻坚、通水成效和精神传承展开。" },
      { title: "观看方式", text: "以线上视角串联展陈重点，适合快速了解展馆核心内容。" },
      { title: "讲解重点", text: "突出干部群众团结协作、攻坚克难建设水渠的历史现场。" },
    ],
    note: "展厅 VR 与智能讲解配合使用，可形成完整的线上参观体验。",
  },
  history: {
    title: "历史资料",
    status: "工程档案与历史节点",
    description: "梳理向东渠动工、建设、竣工通水和教育实践基地建设等关键历史资料。",
    details: [
      { title: "动工建设", text: "工程于 1970 年 9 月 17 日正式动工，集中力量解决区域用水困难。" },
      { title: "竣工通水", text: "1973 年 3 月 12 日，向东渠竣工通水，成为当地重要水利工程记忆。" },
      { title: "档案价值", text: "历史资料为工程叙事、人物讲述和展馆导览提供基础依据。" },
    ],
    note: "历史资料栏目适合用于汇报工程脉络和核对关键时间节点。",
  },
  spirit: {
    title: "精神内涵",
    status: "向东渠精神解读",
    description: "围绕勇于担当、团结协作、攻坚克难、开拓创新四个关键词解读向东渠精神。",
    details: [
      { title: "勇于担当", text: "面对缺水难题主动作为，以工程建设回应群众生产生活需求。" },
      { title: "团结协作", text: "云霄、东山两地干部群众协同推进，凝聚跨区域建设合力。" },
      { title: "攻坚创新", text: "在艰苦条件下推进渠线、渡槽等工程建设，体现实干精神。" },
    ],
    note: "精神内涵栏目是数字馆思想教育和研学讲解的核心内容。",
  },
  value: {
    title: "时代价值",
    status: "水利记忆与现实启示",
    description: "从民生水利、区域协作、红色教育和乡村发展角度呈现向东渠的时代价值。",
    details: [
      { title: "民生价值", text: "工程建设回应工农业和生活用水需求，体现水利工程服务群众的根本属性。" },
      { title: "教育价值", text: "向东渠事迹为党员教育、研学参观和地方史学习提供鲜活材料。" },
      { title: "发展启示", text: "工程精神对今天推进基础设施建设、乡村振兴和基层治理仍有现实意义。" },
    ],
    note: "时代价值栏目连接历史叙事与当代实践。",
  },
  yunxiao: {
    title: "今日云霄",
    status: "水渠沿线新貌",
    description: "展示今日云霄的山水风貌、村镇变化和向东渠沿线生态景观。",
    details: [
      { title: "沿线风光", text: "呈现水渠沿线山水、田园和村镇环境，延续工程泽被一方的现实图景。" },
      { title: "地方变化", text: "结合今日生产生活面貌，展示水利工程与地方发展的持续联系。" },
      { title: "参观延展", text: "可与全景水渠、图文影像栏目结合，形成历史与现实对照。" },
    ],
    note: "今日云霄栏目强化数字馆的现实感和地方形象展示。",
  },
};

const FEATURE_DETAIL_BY_ID: Record<string, Partial<DetailPageData>> = {
  about: {
    status: "工程概况",
    description: "向东渠是福建漳州云霄、东山两地在 20 世纪 70 年代建设的大型引水工程，用于缓解当地工农业和生活用水困难。",
    details: [
      { title: "建设时间", text: "工程于 1970 年 9 月 17 日正式动工，1973 年 3 月 12 日竣工通水。" },
      { title: "工程规模", text: "渠线总长约 85.81 公里，其中石拱渡槽 18 座，总长约 7335 米。" },
      { title: "精神传承", text: "向东渠事迹集中体现勇于担当、团结协作、攻坚克难、开拓创新。" },
    ],
    note: "向东渠简介适合作为数字馆汇报和参观讲解的基础页。",
  },
  guide: GUIDE_DETAIL_BY_ID.vr,
  digital: {
    status: "数字馆参观导览",
    description: "数字馆整合全景导览、图文影像、纪录片资料和智能讲解，形成线上参观路径。",
    details: [
      { title: "首页导览", text: "通过快捷栏目、专题卡、视频风采、纪录片和图文影像进入不同内容。" },
      { title: "智能讲解", text: "观众可直接询问工程概况、通水时间、精神内涵和栏目位置。" },
      { title: "移动参观", text: "网页 H5 与微信小程序保持一致视觉语言，方便现场扫码体验。" },
    ],
    note: "数字馆导览用于快速说明线上展陈结构和体验方式。",
  },
};

function getDetailCopy(kind: DetailKind) {
  const copy: Record<DetailKind, Pick<DetailPageData, "eyebrow" | "status" | "description" | "details" | "note">> = {
    guide: {
      eyebrow: "展馆导览",
      status: "向东渠数字馆导览",
      description: "数字馆以工程历史、精神传承、影像资料和今日风貌为主线，串联首页各类栏目。",
      details: [
        { title: "工程历史", text: "通过历史资料、工程简介和纪录片内容回顾向东渠建设历程。" },
        { title: "精神传承", text: "围绕勇于担当、团结协作、攻坚克难、开拓创新展开讲解。" },
        { title: "影像浏览", text: "视频风采、纪录片和图文影像共同呈现水渠记忆与今日面貌。" },
      ],
      note: "建议先从全景水渠和历史资料进入，再浏览视频、纪录片和图文影像。",
    },
    feature: {
      eyebrow: "数字馆专题",
      status: "专题展陈",
      description: "围绕向东渠简介、数字导览与相关资料，集中呈现工程记忆与精神传承。",
      details: [
        { title: "工程记忆", text: "梳理工程缘起、建设过程、渠系特点与通水成效。" },
        { title: "精神传承", text: "呈现勇于担当、团结协作、攻坚克难、开拓创新的精神内涵。" },
        { title: "数字导览", text: "连接图文、影像、纪录片与智能讲解，形成完整浏览动线。" },
      ],
      note: "用于承载数字馆重点专题，适合领导汇报和现场导览同步展示。",
    },
    video: {
      eyebrow: "影像资料",
      status: "影像展映",
      description: "影像栏目呈现向东渠风采、工程记忆和相关讲述内容，增强历史现场感。",
      details: [
        { title: "影像主题", text: "围绕工程建设、渠首风貌、人物讲述和地方记忆组织影像内容。" },
        { title: "导览价值", text: "通过影像增强历史现场感，辅助观众理解工程规模与建设精神。" },
        { title: "内容关联", text: "与纪录片、图文影像和工程简介互为补充，形成完整叙事。" },
      ],
      note: "影像资料适合在汇报和参观过程中作为重点展示内容。",
    },
    documentary: {
      eyebrow: "纪录片资料",
      status: "纪录片展映",
      description: "聚合《国家记忆》相关分集说明、背景资料与影像内容，呈现“一渠清水向东流”的历史叙事。",
      details: [
        { title: "节目线索", text: "围绕“一渠清水向东流”上下集内容，呈现工程建设与精神传承。" },
        { title: "背景说明", text: "结合地方史料、工程节点和人物记忆，帮助观众理解纪录片叙事。" },
        { title: "叙事价值", text: "用权威影像资料补充数字馆的历史表达和主题讲解。" },
      ],
      note: "纪录片栏目适合承担权威影像背书，与数字馆主题形成呼应。",
    },
    gallery: {
      eyebrow: "图文影像",
      status: "图文档案",
      description: "集中展示建设现场、渠首风貌、历史影像和沿线风光，形成可浏览的图文资料索引。",
      details: [
        { title: "档案类别", text: "涵盖建设现场、渠首风貌、历史影像、纪念展陈、口述记忆和沿线风光。" },
        { title: "观看重点", text: "通过照片、文字说明和影像线索展示向东渠的历史现场与今日面貌。" },
        { title: "展陈作用", text: "为首页视频、纪录片与专题导览补充图文依据。" },
      ],
      note: "图文影像栏目适合快速浏览，也适合在汇报时作为视觉资料依据。",
    },
    news: {
      eyebrow: "资讯动态",
      status: "展馆动态",
      description: "资讯动态集中呈现数字馆相关节点、教育实践活动和展陈内容更新。",
      details: [
        { title: "数字馆上线", text: "向东渠事迹数字馆以线上方式集中呈现工程历史、精神传承和影像资料。" },
        { title: "基地建设", text: "向东渠事迹教育实践基地暨展示馆于 2022 年 7 月 1 日揭牌开馆。" },
        { title: "工程记忆", text: "1973 年 3 月 12 日向东渠竣工通水，成为地方水利建设的重要历史记忆。" },
      ],
      note: "资讯动态展示数字馆与教育实践基地的重要节点。",
    },
  };

  return copy[kind];
}

function createDetailPage(kind: DetailKind, title: string, options?: Partial<DetailPageData>): DetailPageData {
  const copy = getDetailCopy(kind);

  return {
    kind,
    title,
    eyebrow: copy.eyebrow,
    status: copy.status,
    description: copy.description,
    details: copy.details,
    note: copy.note,
    backHref: "/",
    backLabel: "返回首页",
    ...options,
  };
}

function getRoutePage(pathname: string, data: HomePageData): DetailPageData | null {
  const path = normalizePath(pathname);
  const allVideos = [...data.videos, ...data.documentary];

  if (path === "/") {
    return null;
  }

  const videoMatch = path.match(/^\/videos\/([^/]+)$/);
  if (videoMatch) {
    const video = data.videos.find((item) => item.id === videoMatch[1]) ?? allVideos.find((item) => item.id === videoMatch[1]);
    return createDetailPage("video", video?.title ?? "向东渠风采", video ? {
      description: `${video.title}，片长 ${video.duration}。影像内容聚焦向东渠工程记忆、建设精神和地方风貌。`,
      image: video.image,
      duration: video.duration,
      mediaLabel: "视频影像",
      details: [
        { title: "片段信息", text: `${video.title}，时长 ${video.duration}。` },
        { title: "主题内容", text: "影像聚焦向东渠建设记忆、工程风貌和精神传承。" },
        { title: "展示价值", text: "适合在参观导览中配合工程简介和图文资料共同讲解。" },
      ],
    } : undefined);
  }

  const documentaryMatch = path.match(/^\/documentary\/([^/]+)$/);
  if (documentaryMatch) {
    const item = data.documentary.find((doc) => doc.id === `d${documentaryMatch[1]}` || doc.id === documentaryMatch[1]);
    return createDetailPage("documentary", item?.title ?? "央视纪录片《国家记忆》", item ? {
      description: `${item.title}，片长 ${item.duration}。该分集围绕“一渠清水向东流”展开历史叙事。`,
      image: item.image,
      duration: item.duration,
      mediaLabel: "央视纪录片",
      details: [
        { title: "节目内容", text: `${item.title}，时长 ${item.duration}。` },
        { title: "历史背景", text: "结合向东渠建设历程与地方记忆，呈现“一渠清水向东流”的叙事脉络。" },
        { title: "资料价值", text: "纪录片资料为数字馆提供权威影像支撑。" },
      ],
    } : undefined);
  }

  const galleryMatch = path.match(/^\/gallery\/([^/]+)$/);
  if (galleryMatch) {
    const item = data.gallery.find((galleryItem) => galleryItem.id === galleryMatch[1]);
    return createDetailPage("gallery", item?.title ?? "图文影像", item ? {
      description: item.summary,
      image: item.image,
      mediaLabel: item.date,
      details: [
        { title: item.date, text: item.summary },
        { title: item.kind === "video" ? "影像记录" : "图文记录", text: "围绕栏目主题展示对应的历史资料、现场记录和导览说明。" },
        { title: "展示重点", text: "通过具体图文资料呈现向东渠历史现场与今日面貌。" },
      ],
    } : undefined);
  }

  if (path === "/videos") {
    return createDetailPage("video", "向东渠风采", {
      image: data.videos[0]?.image,
      mediaLabel: "视频合集",
      links: data.videos.map((item) => ({ label: item.title, href: item.href })),
    });
  }

  if (path === "/documentary") {
    return createDetailPage("documentary", "央视纪录片《国家记忆》", {
      image: data.documentary[0]?.image,
      mediaLabel: "纪录片合集",
      links: data.documentary.map((item) => ({ label: item.title, href: item.href })),
    });
  }

  if (path === "/gallery") {
    return createDetailPage("gallery", "印象向东渠", {
      image: data.gallery[0]?.image,
      mediaLabel: "图文影像合集",
      links: data.gallery.slice(0, 6).map((item) => ({ label: item.title, href: `/gallery/${item.id}` })),
    });
  }

  if (path === "/news") {
    return createDetailPage("news", "资讯动态", {
      newsItems: [
        { date: "2024-04-02", title: "向东渠事迹数字馆上线", text: "数字馆通过全景导览、图文影像、纪录片资料和智能讲解呈现向东渠历史内容。" },
        { date: "2022-07-01", title: "向东渠事迹教育实践基地暨展示馆揭牌开馆", text: "展示馆成为开展党史学习、地方史教育和研学参观的重要载体。" },
        { date: "1973-03-12", title: "向东渠工程竣工通水", text: "向东渠正式通水，缓解当地工农业和生活用水困难，留下重要水利建设记忆。" },
      ],
    });
  }

  if (path === "/guide") {
    return createDetailPage("guide", "向东渠导览", {
      links: data.navItems.map((item) => ({ label: item.label, href: item.href })),
    });
  }

  const featureItem = data.featureCards.find((item) => normalizePath(item.href) === path);
  if (featureItem) {
    return createDetailPage("feature", featureItem.title, FEATURE_DETAIL_BY_ID[featureItem.id]);
  }

  const navItem = data.navItems.find((item) => normalizePath(item.href) === path);
  if (navItem) {
    return createDetailPage(navItem.id === "news" ? "news" : "guide", navItem.label, GUIDE_DETAIL_BY_ID[navItem.id]);
  }

  return null;
}

function App() {
  const [data, setData] = useState<HomePageData | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    let ignore = false;

    fetchHomePageData().then((homeData) => {
      if (!ignore) {
        setData(homeData);
        setSelectedVideo(homeData.videos[0] ?? null);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  if (!data) {
    return (
      <main className="app app-loading">
        <div className="loading-mark" />
        <span>正在加载数字馆内容</span>
      </main>
    );
  }

  const currentPath = normalizePath(window.location.pathname);
  const routePage = getRoutePage(currentPath, data);

  if (routePage) {
    return (
      <main className="app">
        <TopNav data={data} />
        <DetailRoutePage page={routePage} />
      </main>
    );
  }

  if (currentPath !== "/") {
    return (
      <main className="app">
        <TopNav data={data} />
        <NotFoundRoutePage />
      </main>
    );
  }

  return (
    <main className="app">
      <TopNav data={data} />
      <Hero />
      <QuickNav items={data.navItems} />
      <FeatureGrid items={data.featureCards} />
      <VideoSection
        title="向东渠风采"
        items={data.videos}
        selectedVideo={selectedVideo}
        onSelectVideo={setSelectedVideo}
      />
      <DocumentarySection
        items={data.documentary}
      />
      <GallerySection items={data.gallery} />
    </main>
  );
}

function TopNav({ data }: { data: HomePageData }) {
  const [activeItem, setActiveItem] = useState<TopNavKey>(() => getTopNavActiveItem(data));
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const linkClass = (item: Exclude<TopNavKey, "none">) =>
    item === activeItem ? "top-nav-link active" : "top-nav-link";
  const mobileTabClass = (item: Exclude<TopNavKey, "none">) =>
    item === activeItem ? "mobile-tab-link active" : "mobile-tab-link";

  return (
    <>
      <header className="site-header">
        <div className="site-brand" aria-label="向东渠事迹数字馆">
          <BrandMark />
          <span>向东渠事迹数字馆</span>
        </div>
        <nav className="top-nav" aria-label="顶部主导航">
          <a aria-current={activeItem === "home" ? "page" : undefined} className={linkClass("home")} href="/" onClick={() => setActiveItem("home")}>
            <Home size={18} strokeWidth={2.1} />
            <span>首页</span>
          </a>
          <a aria-current={activeItem === "guide" ? "page" : undefined} className={linkClass("guide")} href="/guide" onClick={() => setActiveItem("guide")}>
            <Compass size={18} strokeWidth={2.1} />
            <span>导览</span>
          </a>
          <button
            aria-expanded={isConsultOpen}
            className={`${linkClass("ai")} ai`}
            onClick={() => {
              setActiveItem("ai");
              setIsConsultOpen(true);
            }}
            type="button"
          >
            <Bot size={19} strokeWidth={2.1} />
            <span>智能咨询</span>
            <em>AI</em>
          </button>
        </nav>
      </header>
      <nav className="mobile-tab-nav" aria-label="手机底部导航">
        <a aria-current={activeItem === "home" ? "page" : undefined} className={mobileTabClass("home")} href="/" onClick={() => setActiveItem("home")}>
          <MobileTabIcon type="recommend" />
          <span>首页</span>
        </a>
        <a aria-current={activeItem === "guide" ? "page" : undefined} className={mobileTabClass("guide")} href="/guide" onClick={() => setActiveItem("guide")}>
          <MobileTabIcon type="guide" />
          <span>导览</span>
        </a>
        <button
          aria-expanded={isConsultOpen}
          className={mobileTabClass("ai")}
          onClick={() => {
            setActiveItem("ai");
            setIsConsultOpen(true);
          }}
          type="button"
        >
          <span className="mobile-tab-icon-wrap">
            <Bot className="mobile-tab-icon" size={29} strokeWidth={2.1} />
            <em>AI</em>
          </span>
          <span className="mobile-tab-text">
            智能咨询
          </span>
        </button>
      </nav>
      <AiConsultWindow open={isConsultOpen} onClose={() => setIsConsultOpen(false)} />
    </>
  );
}

function MobileTabIcon({ type }: { type: MobileTabIconType }) {
  if (type === "recommend") {
    return (
      <svg className="mobile-tab-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M7 25.5h18" />
        <path d="M8.8 22.8V13.2h14.4v9.6" />
        <path d="M7.8 13.2 16 7.3l8.2 5.9" />
        <path d="M12 22.8v-5.7" />
        <path d="M16 22.8v-6.8" />
        <path d="M20 22.8v-5.7" />
      </svg>
    );
  }

  if (type === "guide") {
    return (
      <svg className="mobile-tab-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M6.5 24.2h19" />
        <path d="M8.8 21.8V11.5" />
        <path d="M14 21.8V10.2" />
        <path d="M19.2 21.8V11.5" />
        <path d="M24 21.8V13.4" />
        <path d="M7.2 11.3c6.5-3.1 12-3.1 17.6.1" />
        <path d="M8.4 26.8c4.7-1.7 9.7-1.7 15.2 0" />
      </svg>
    );
  }

  if (type === "news") {
    return (
      <svg className="mobile-tab-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M9 8.2h14v17.3H9z" />
        <path d="M12.2 12h7.6" />
        <path d="M12.2 16h7.6" />
        <path d="M12.2 20h5.2" />
        <path d="M7 10.8c1.2-.8 2-.8 3.2 0" />
        <path d="M21.8 25.5c1.2.8 2 .8 3.2 0" />
      </svg>
    );
  }

  return (
    <svg className="mobile-tab-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M16 15.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z" />
      <path d="M8.2 25.5c1.3-4.5 4-6.8 7.8-6.8s6.5 2.3 7.8 6.8" />
      <path d="M23 9.2c1.8.9 2.7 2.3 2.7 4.2 0 2.6-1.8 4.4-4.5 4.8" />
      <path d="M21.8 5.4c3.8 1.2 6.1 4.3 6.1 8" />
    </svg>
  );
}

function BrandMark() {
  return (
    <svg
      className="site-brand-icon"
      viewBox="0 0 36 36"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="brand-mark-water"
        d="M5.7 24.6c4.4-2.6 8.7-3.4 13-2.4 3.8.9 7.8.5 12-1.3"
        pathLength="1"
      />
      <path
        className="brand-mark-water"
        d="M8 28.1c3.4-1.8 6.9-2.3 10.4-1.4 3.2.8 6.4.5 9.8-.9"
        pathLength="1"
      />
      <path
        className="brand-mark-arch"
        d="M8.4 22V12.4h19.2V22"
        pathLength="1"
      />
      <path
        className="brand-mark-arch"
        d="M11.4 22v-3.7c0-2 1.6-3.6 3.6-3.6s3.6 1.6 3.6 3.6V22"
        pathLength="1"
      />
      <path
        className="brand-mark-arch"
        d="M18.6 22v-3.7c0-2 1.6-3.6 3.6-3.6s3.6 1.6 3.6 3.6V22"
        pathLength="1"
      />
      <path className="brand-mark-peak" d="M7.5 12.4 18 6.9l10.5 5.5" pathLength="1" />
    </svg>
  );
}

function DetailRoutePage({ page }: { page: DetailPageData }) {
  return (
    <section className={`route-detail route-detail-${page.kind}`} aria-labelledby="route-detail-title">
      <div className="route-detail-art" aria-hidden="true">
        {page.image ? (
          <div className="route-media-card">
            <img src={page.image} alt="" />
            <span className="route-media-label">{page.mediaLabel}</span>
            {(page.kind === "video" || page.kind === "documentary") && (
              <span className="route-media-play">
                <Play size={22} fill="currentColor" strokeWidth={0} />
              </span>
            )}
            {page.duration && <span className="route-media-duration">{page.duration}</span>}
          </div>
        ) : (
          <>
            <div className="paper-sheet paper-sheet-back" />
            <div className="paper-sheet paper-sheet-front">
              <span className="canal-line canal-line-main" />
              <span className="canal-line canal-line-soft" />
              <span className="archive-line archive-line-one" />
              <span className="archive-line archive-line-two" />
              <span className="archive-line archive-line-three" />
              <span className="seal-mark">向东</span>
            </div>
          </>
        )}
      </div>
      <div className="route-detail-copy">
        <span className="route-eyebrow">{page.eyebrow}</span>
        <h1 id="route-detail-title">{page.title}</h1>
        <strong>{page.status}</strong>
        <p>{page.description}</p>
        {page.newsItems && (
          <div className="route-news-list" aria-label="资讯动态列表">
            {page.newsItems.map((item) => (
              <article className="route-news-card" key={`${item.date}-${item.title}`}>
                <time>{item.date}</time>
                <span>{item.title}</span>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        )}
        <div className="route-detail-grid" aria-label={`${page.title}内容要点`}>
          {page.details.map((detail) => (
            <article className="route-detail-card" key={`${page.kind}-${detail.title}`}>
              <span>{detail.title}</span>
              <p>{detail.text}</p>
            </article>
          ))}
        </div>
        {page.links && (
          <div className="route-link-list" aria-label={`${page.title}相关栏目`}>
            {page.links.map((link) => (
              <a href={link.href} key={`${link.href}-${link.label}`}>
                {link.label}
                <ChevronRight size={16} strokeWidth={2.2} />
              </a>
            ))}
          </div>
        )}
        <p className="route-footnote">{page.note}</p>
        <div className="route-actions">
          <a className="route-action primary" href={page.backHref}>
            {page.backLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

function NotFoundRoutePage() {
  return (
    <section className="route-detail route-not-found" aria-labelledby="route-not-found-title">
      <div className="route-detail-art" aria-hidden="true">
        <div className="paper-sheet paper-sheet-back" />
        <div className="paper-sheet paper-sheet-front">
          <span className="canal-line canal-line-main" />
          <span className="canal-line canal-line-soft" />
          <span className="archive-line archive-line-one" />
          <span className="archive-line archive-line-two" />
          <span className="seal-mark">向东</span>
        </div>
      </div>
      <div className="route-detail-copy">
        <span className="route-eyebrow">访问提示</span>
        <h1 id="route-not-found-title">未找到相关展陈</h1>
        <strong>请返回首页重新选择栏目</strong>
        <p>当前地址没有匹配到数字馆栏目或资料页，请返回首页重新选择入口。</p>
        <div className="route-actions">
          <a className="route-action primary" href="/">
            返回首页
          </a>
        </div>
      </div>
    </section>
  );
}

function renderMessageContent(content: string) {
  return content.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    return part.replaceAll("**", "");
  });
}

function renderMarkdownMessage(content: string) {
  const blocks = content.replace(/\r\n/g, "\n").split("\n");
  const renderedBlocks: ReactNode[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let listType: "ordered" | "unordered" | null = null;

  const flushParagraph = () => {
    if (!paragraphLines.length) {
      return;
    }

    const paragraph = paragraphLines.join("\n");
    renderedBlocks.push(<p key={`p-${renderedBlocks.length}`}>{renderMessageContent(paragraph)}</p>);
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length || !listType) {
      return;
    }

    const ListTag = listType === "ordered" ? "ol" : "ul";

    renderedBlocks.push(
      <ListTag key={`list-${renderedBlocks.length}`}>
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`}>{renderMessageContent(item)}</li>
        ))}
      </ListTag>,
    );
    listItems = [];
    listType = null;
  };

  blocks.forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      flushParagraph();
      flushList();
      return;
    }

    const heading = trimmedLine.match(/^#{1,3}\s+(.+)$/);
    const unordered = trimmedLine.match(/^[-*]\s+(.+)$/);
    const ordered = trimmedLine.match(/^\d+[.)]\s+(.+)$/);

    if (heading) {
      flushParagraph();
      flushList();
      renderedBlocks.push(
        <p className="ai-message-heading" key={`h-${renderedBlocks.length}`}>
          {renderMessageContent(heading[1])}
        </p>,
      );
      return;
    }

    if (unordered || ordered) {
      flushParagraph();
      const nextType = ordered ? "ordered" : "unordered";

      if (listType && listType !== nextType) {
        flushList();
      }

      listType = nextType;
      listItems.push((ordered ?? unordered)?.[1] ?? "");
      return;
    }

    flushList();
    paragraphLines.push(line);
  });

  flushParagraph();
  flushList();

  return renderedBlocks.length ? renderedBlocks : <p>{renderMessageContent(content)}</p>;
}

function AiConsultWindow({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [position, setPosition] = useState(() => {
    if (typeof window === "undefined") {
      return { x: 360, y: 84 };
    }

    return {
      x: Math.max(14, window.innerWidth - 448),
      y: 82,
    };
  });
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ConsultMessage[]>([
    {
      role: "assistant",
      content: consultWelcome,
    },
  ]);
  const [isConsulting, setIsConsulting] = useState(false);
  const dragState = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragState.current) {
        return;
      }

      const nextX = dragState.current.originX + event.clientX - dragState.current.startX;
      const nextY = dragState.current.originY + event.clientY - dragState.current.startY;
      const panelWidth = Math.min(410, window.innerWidth - 24);
      const panelHeight = Math.min(560, window.innerHeight - 82);
      setPosition({
        x: Math.min(Math.max(12, nextX), Math.max(12, window.innerWidth - panelWidth - 12)),
        y: Math.min(Math.max(64, nextY), Math.max(64, window.innerHeight - panelHeight - 12)),
      });
    };

    const handlePointerUp = () => {
      dragState.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const submitQuestion = async (question: string) => {
    const normalized = question.trim();

    if (!normalized || isConsulting) {
      return;
    }

    const userMessage: ConsultMessage = { role: "user", content: normalized };
    const apiMessages = [...messages.slice(1), userMessage];

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInput("");
    setIsConsulting(true);

    try {
      const content = await sendConsultMessage(apiMessages);
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: content || "这条咨询暂时没有形成有效回复，请换个问法再试。" },
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : "智能讲解服务暂时繁忙，请稍后再试。",
        },
      ]);
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <aside
      className="ai-consult-window"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      aria-label="智能咨询窗口"
    >
      <div
        className="ai-consult-head"
        onPointerDown={(event) => {
          dragState.current = {
            startX: event.clientX,
            startY: event.clientY,
            originX: position.x,
            originY: position.y,
          };
        }}
      >
        <span className="ai-consult-mark">
          <Bot size={19} strokeWidth={2.2} />
        </span>
        <div>
          <strong>智能咨询</strong>
          <em>向东渠数字馆 AI 问答</em>
        </div>
        <button className="ai-consult-close" onClick={onClose} type="button" aria-label="关闭智能咨询">
          <X size={18} />
        </button>
      </div>
      <div className="ai-consult-body" aria-busy={isConsulting}>
        {messages.map((message, index) => (
          <div className={message.role === "assistant" ? "ai-message assistant" : "ai-message user"} key={`${message.role}-${index}`}>
            {renderMarkdownMessage(message.content)}
          </div>
        ))}
        {isConsulting ? <p className="ai-message assistant muted">回复中</p> : null}
        <div className="ai-consult-prompts" aria-label="快捷问题">
          {consultPrompts.map((question) => (
            <button disabled={isConsulting} key={question} onClick={() => submitQuestion(question)} type="button">
              {question}
            </button>
          ))}
        </div>
      </div>
      <form
        className="ai-consult-input"
        onSubmit={(event) => {
          event.preventDefault();
          submitQuestion(input);
        }}
      >
        <input
          aria-label="输入咨询问题"
          onChange={(event) => setInput(event.target.value)}
          placeholder="输入想了解的内容"
          value={input}
        />
        <button disabled={isConsulting || !input.trim()} type="submit" aria-label="发送问题">
          <Send size={17} />
        </button>
      </form>
    </aside>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-media" aria-hidden="true" />
      <div className="hero-content">
        <h1 className="sr-only">向东渠事迹数字馆</h1>
        <img
          className="hero-title-image"
          src="/assets/hero/xiangdongqu-title-calligraphy.png"
          alt=""
          aria-hidden="true"
        />
        <p className="hero-subtitle">事迹数字馆</p>
        <p className="hero-meta">
          <span>中共云霄县委党史和地方志研究室</span>
          <span>中共云霄县委党建办</span>
        </p>
      </div>
    </section>
  );
}

function QuickNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="quick-nav" aria-label="数字馆栏目">
      {items.map((item) => {
        const iconSrc = iconMap[item.id as keyof typeof iconMap];

        return (
          <div className="quick-nav-item" key={item.id}>
            <a className="quick-nav-button" href={item.href} aria-label={item.label}>
              <span className="quick-nav-icon">
                {iconSrc ? <img src={iconSrc} alt="" loading="lazy" /> : null}
              </span>
            </a>
            <span className="quick-nav-label" aria-hidden="true">
              {item.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}

function FeatureGrid({ items }: { items: FeatureCard[] }) {
  return (
    <section className="section feature-section" id="digital-content">
      <div className="feature-grid">
        {items.map((item) => (
          <a className="feature-card" href={item.href} key={item.id}>
            <MediaFrame image={item.image} tone={item.id} label="展陈图" alt="" />
            <div className="feature-copy">
              <div>
                <h2>{item.title}</h2>
                <p>{item.subtitle}</p>
              </div>
              <span className="text-link">
                {item.action}
                <ChevronRight size={18} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function VideoSection({
  title,
  items,
  selectedVideo,
  onSelectVideo,
}: {
  title: string;
  items: VideoItem[];
  selectedVideo: VideoItem | null;
  onSelectVideo: (item: VideoItem) => void;
}) {
  const currentVideo = selectedVideo ?? items[0];

  return (
    <section className="section">
      <SectionHead title={title} href="/videos" />
      <div className="video-layout">
        <a
          className="video-stage"
          href={currentVideo?.href ?? "/videos"}
        >
          <MediaFrame image={currentVideo?.image} tone="video" label="影像封面" alt="" />
          <span className="play-button">
            <Play size={30} fill="currentColor" />
          </span>
          <div className="video-stage-title">
            <strong>{currentVideo?.title}</strong>
            <span>{currentVideo?.duration}</span>
          </div>
        </a>
        <div className="video-list" aria-label="视频列表">
          {items.map((item) => (
            <button
              aria-pressed={item.id === selectedVideo?.id}
              className={item.id === selectedVideo?.id ? "video-row active" : "video-row"}
              key={item.id}
              onClick={() => onSelectVideo(item)}
              type="button"
            >
              <span className="video-row-thumb">
                <Play size={16} fill="currentColor" />
              </span>
              <span>{item.title}</span>
              <em>{item.duration}</em>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocumentarySection({
  items,
}: {
  items: VideoItem[];
}) {
  return (
    <section className="section">
      <SectionHead title="央视纪录片《国家记忆》" subtitle="一渠清水向东流" href="/documentary" />
      <div className="documentary-grid">
        {items.map((item) => (
          <a className="documentary-card" href={item.href} key={item.id}>
            <MediaFrame image={item.image} tone="documentary" label="纪录片封面" alt="" />
            <span className="play-button compact">
              <Play size={24} fill="currentColor" />
            </span>
            <strong>{item.title}</strong>
          </a>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ items }: { items: GalleryItem[] }) {
  return (
    <section className="section gallery-section">
      <div className="gallery-panel">
        <div className="gallery-panel-head">
          <div>
            <h2>印象向东渠</h2>
          </div>
          <a href="/gallery">
            更多
            <ChevronRight size={18} />
          </a>
        </div>
        <div className="gallery-panel-body">
          <div className="gallery-feed" aria-label="印象向东渠内容列表">
            {items.map((item, index) => (
              <a className="gallery-feed-card" href={`/gallery/${item.id}`} key={item.id}>
                <div className="gallery-media">
                  <MediaFrame
                    image={item.image}
                    tone={`gallery-${index}`}
                    label={item.kind === "video" ? "影像资料" : "图文资料"}
                    alt=""
                  />
                  {item.kind === "video" ? (
                    <span className="gallery-play">
                      <Play size={22} fill="currentColor" />
                    </span>
                  ) : null}
                </div>
                <div className="gallery-copy">
                  <span className={item.kind === "video" ? "gallery-chip video" : "gallery-chip"}>
                    {item.kind === "video" ? "视频" : "图片"}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <em>{item.date}</em>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ title, subtitle, href }: { title: string; subtitle?: string; href: string }) {
  return (
    <div className="section-head">
      <div className="section-head-title">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <a href={href}>
        更多
        <ChevronRight size={18} />
      </a>
    </div>
  );
}

function MediaFallback({ tone, label }: { tone: string; label: string }) {
  return (
    <div className={`media-frame media-frame-${tone}`}>
      <Images size={34} strokeWidth={1.5} />
      <span>{label}</span>
    </div>
  );
}

function MediaFrame({
  image,
  tone,
  label,
  alt,
}: {
  image?: string;
  tone: string;
  label: string;
  alt: string;
}) {
  if (!image) {
    return <MediaFallback tone={tone} label={label} />;
  }

  return (
    <div className={`media-frame media-frame-${tone} has-image`}>
      <img src={image} alt={alt} loading="lazy" />
    </div>
  );
}

export default App;
