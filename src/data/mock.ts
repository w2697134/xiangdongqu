export const siteName = "向东渠事迹数字馆";

export const navItems = [
  { label: "首页", href: "/" },
  { label: "数字导览", href: "/guide" },
  { label: "历史资料", href: "/archives" },
  { label: "精神内涵", href: "/spirit" },
  { label: "时代价值", href: "/value" },
  { label: "资讯动态", href: "/news" },
  { label: "视频展播", href: "/videos" },
] as const;

export const heroStats = [
  { value: "85.81", label: "公里渠线记忆" },
  { value: "5万+", label: "建设者故事" },
  { value: "1973", label: "通水历史节点" },
  { value: "447", label: "处工程建筑" },
] as const;

export const homeEntrances = [
  {
    title: "数字导览",
    href: "/guide",
    kicker: "VR / 展厅 / 路线",
    cover: "/generated/cover-digital-guide.png",
    placeholder: "待放：VR 导览链接",
    description: "全景水渠、展厅导览和参观路线的统一入口。",
  },
  {
    title: "历史资料",
    href: "/archives",
    kicker: "文献 / 照片 / 物件",
    cover: "/generated/cover-history-archive.png",
    placeholder: "待上传：历史资料素材",
    description: "集中呈现大事记、旧文献、老照片和老物件。",
  },
  {
    title: "精神内涵",
    href: "/spirit",
    kicker: "担当 / 协作 / 攻坚",
    cover: "/generated/cover-spirit.png",
    placeholder: "待补充：人物故事资料",
    description: "围绕建设实践提炼勇于担当、团结协作、攻坚克难、开拓创新。",
  },
  {
    title: "时代价值",
    href: "/value",
    kicker: "教育 / 工程 / 研究",
    cover: "/generated/cover-era-value.png",
    placeholder: "待整理：研究资料",
    description: "说明向东渠故事对当代红色教育、水利工程和地方文化传播的价值。",
  },
  {
    title: "资讯动态",
    href: "/news",
    kicker: "活动 / 新闻 / 报道",
    cover: "/generated/cover-news.png",
    placeholder: "待发布：活动资讯",
    description: "展示纪念活动、媒体报道和数字馆动态。",
  },
  {
    title: "视频展播",
    href: "/videos",
    kicker: "纪录片 / 访谈 / 活动",
    cover: "/generated/cover-video.png",
    placeholder: "待放：人物采访视频",
    description: "展示纪录片、人物访谈和活动记录。",
  },
] as const;

export const materialSlots = [
  {
    title: "现场拍摄照片",
    placeholder: "待上传：现场拍摄照片",
    description: "",
  },
  {
    title: "历史文献扫描件",
    placeholder: "待放：历史文献扫描件",
    description: "",
  },
  {
    title: "人物采访视频",
    placeholder: "待放：人物采访视频",
    description: "",
  },
  {
    title: "VR 导览链接",
    placeholder: "待放：VR 导览链接",
    description: "",
  },
] as const;

export const featuredItems = [
  {
    title: "一条人工长河的建设记忆",
    category: "首页推荐",
    summary: "以向东渠建设历程为主线，串联工程背景、人物故事和地方记忆。",
  },
  {
    title: "红色文化与水利工程的数字化呈现",
    category: "专题策展",
    summary: "用导览、档案、影像和专题栏目组织内容，形成可持续扩展的数字馆框架。",
  },
  {
    title: "真实素材集中预留",
    category: "资料征集",
    summary: "照片、视频、文献和导览链接均设置清晰位置，便于正式内容替换。",
  },
] as const;

export const guideItems = [
  {
    title: "向东渠全景导览",
    type: "全景水渠",
    status: "推荐",
    placeholder: "待放：VR 导览链接",
    cover: "/generated/cover-digital-guide.png",
    description: "以水渠走向为核心，组织全景点位、节点说明和工程视角导览。",
  },
  {
    title: "事迹展厅导览",
    type: "展厅 VR",
    status: "待接入",
    placeholder: "待放：展厅全景链接",
    cover: "/generated/cover-digital-guide.png",
    description: "承载展厅空间、展板内容、资料柜和重点展项的数字化入口。",
  },
  {
    title: "参观路线导览",
    type: "路线导览",
    status: "规划中",
    placeholder: "待上传：路线点位资料",
    cover: "/generated/cover-digital-guide.png",
    description: "按参观顺序组织水利工程、历史资料、人物故事和精神主题。",
  },
] as const;

export const timelineItems = [
  { year: "工程酝酿", title: "水利需求与地方动员", text: "围绕生产生活用水与区域发展需要，形成建设向东渠的共同目标。" },
  { year: "建设时期", title: "攻坚克难推进工程", text: "干部群众协作施工，在艰苦条件下推进渠线开挖、修筑和配套工程。" },
  { year: "持续影响", title: "工程记忆转化为精神财富", text: "向东渠成为地方红色文化、水利实践和集体奋斗精神的重要载体。" },
] as const;

export const archiveItems = [
  {
    title: "向东渠建设大事记",
    category: "大事记",
    time: "历史脉络",
    placeholder: "待上传：大事记资料",
    cover: "/generated/cover-history-archive.png",
    description: "按时间轴梳理工程筹备、建设、运行和纪念活动等关键节点。",
  },
  {
    title: "旧文献与工程资料",
    category: "旧文献",
    time: "资料整理",
    placeholder: "待放：历史文献扫描件",
    cover: "/generated/cover-history-archive.png",
    description: "用于陈列文件、扫描件、说明文字和来源信息。",
  },
  {
    title: "老照片与老物件",
    category: "影像实物",
    time: "素材征集",
    placeholder: "待放：现场拍摄照片",
    cover: "/generated/cover-history-archive.png",
    description: "用于呈现施工场景、人物合影、工具物件和口述历史相关材料。",
  },
] as const;

export const archiveCategories = [
  { name: "大事记", count: "待整理", note: "按年份沉淀工程建设、通水、纪念活动等节点。" },
  { name: "旧文献", count: "待放", note: "承载历史文献扫描件、工程资料和来源说明。" },
  { name: "老照片", count: "待上传", note: "展示现场拍摄、老照片和人物合影。" },
  { name: "老物件", count: "待上传", note: "展示工具、证章、档案盒等实物照片和说明。" },
] as const;

export const spiritItems = [
  {
    title: "勇于担当",
    subtitle: "把共同目标扛在肩上",
    description: "面对水利建设任务，干部群众主动承担责任，把工程建设与地方发展、群众生产生活联系起来。",
  },
  {
    title: "团结协作",
    subtitle: "同心合力完成艰巨工程",
    description: "工程推进依靠组织动员、分工协作和持续投入，体现跨村镇、跨工种协同奋斗的力量。",
  },
  {
    title: "攻坚克难",
    subtitle: "在困难条件下寻找办法",
    description: "建设过程需要克服地形、物资、技术和施工环境等多重挑战，把困难转化为实践经验。",
  },
  {
    title: "开拓创新",
    subtitle: "把经验转化为长远价值",
    description: "向东渠精神可以继续服务乡村建设、红色教育、地方文化传播和当代治理实践。",
  },
] as const;

export const valueItems = [
  {
    title: "红色教育价值",
    tag: "教育",
    description: "将地方奋斗故事转化为可看、可讲、可传播的教育内容，服务主题学习和现场研学。",
  },
  {
    title: "水利工程价值",
    tag: "工程",
    description: "呈现工程建设对生产生活、区域治理和公共记忆的长期影响，保留工程资料入口。",
  },
  {
    title: "乡村文化价值",
    tag: "文化",
    description: "以人物采访、活动记录和研究资料延展地方文化专题。",
  },
] as const;

export const valueDirections = [
  { title: "人物风采", note: "待放：人物采访视频与照片" },
  { title: "先进事迹", note: "待补充：典型故事资料" },
  { title: "研究资料", note: "待整理：论文、报道、调研材料" },
  { title: "今日云霄", note: "待发布：当代活动与教育实践" },
] as const;

export const newsItems = [
  {
    title: "向东渠事迹数字馆内容整理工作持续推进",
    source: "馆内动态",
    date: "2026-05-15",
    tag: "内容整理",
    summary: "围绕工程记忆、历史资料、影像内容和精神主题，持续完善数字馆内容结构。",
  },
  {
    title: "历史资料栏目预留老照片、旧文献、老物件展示结构",
    source: "内容整理",
    date: "2026-05-14",
    tag: "资料征集",
    summary: "围绕老照片、旧文献、工程资料和实物信息，形成分类清晰的资料入口。",
  },
  {
    title: "视频展播栏目预留纪录片、访谈和活动记录类型",
    source: "影像计划",
    date: "2026-05-13",
    tag: "视频",
    summary: "视频栏目包含纪录片、人物访谈和活动记录三类内容。",
  },
] as const;

export const videoItems = [
  {
    title: "向东渠建设记忆纪录片",
    type: "纪录片",
    duration: "08:30",
    placeholder: "待上传：纪录片视频",
    cover: "/generated/cover-video.png",
    description: "以工程建设过程、人物记忆和地方影响为主线。",
  },
  {
    title: "建设者口述采访",
    type: "人物访谈",
    duration: "12:10",
    placeholder: "待放：人物采访视频",
    cover: "/generated/cover-video.png",
    description: "用于展示采访视频、人物资料和相关照片。",
  },
  {
    title: "主题教育活动记录",
    type: "活动记录",
    duration: "05:45",
    placeholder: "待上传：活动影像资料",
    cover: "/generated/cover-video.png",
    description: "承载参观学习、纪念活动和媒体报道类视频内容。",
  },
] as const;

export const videoFeatureTypes = [
  { name: "纪录片", note: "待上传：向东渠建设记忆专题片" },
  { name: "人物访谈", note: "待放：建设者、亲历者采访视频" },
  { name: "活动记录", note: "待上传：研学、纪念、展览活动影像" },
] as const;

export const adminModules = [
  { title: "文章管理", status: "待建设", description: "新闻、专题文章和精神内涵内容管理。" },
  { title: "图片资料管理", status: "待建设", description: "老照片、工程图、实物资料和文献扫描件管理。" },
  { title: "视频管理", status: "待建设", description: "纪录片、采访、活动记录等视频信息管理。" },
  { title: "VR 导览管理", status: "待建设", description: "全景链接、导览点位和展厅路线管理。" },
  { title: "首页推荐管理", status: "待建设", description: "首页重点内容、栏目入口和推荐卡片配置。" },
  { title: "栏目分类管理", status: "待建设", description: "统一维护前台栏目、资料类型和展示分类。" },
] as const;
