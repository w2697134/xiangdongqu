import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Bot, ChevronRight, Compass, Home, Images, Play, Send, X } from "lucide-react";
import { sendConsultMessage, type ConsultMessage } from "./api/consult";
import { fetchHomePageData } from "./api/home";
import type { FeatureCard, GalleryItem, HomePageData, NavItem, VideoItem } from "./types";

type TopNavKey = "home" | "guide" | "news" | "ai";
type MobileTabIconType = "recommend" | "guide" | "news" | "ai";

const iconMap = {
  panorama: "/assets/nav-icons/panorama-canal.png",
  vr: "/assets/nav-icons/vr-hall.png",
  history: "/assets/nav-icons/history-archive.png",
  spirit: "/assets/nav-icons/spirit-torch.png",
  value: "/assets/nav-icons/value-monument.png?v=20260517-2",
  yunxiao: "/assets/nav-icons/yunxiao-landscape.png",
  news: "/assets/nav-icons/news-scroll.png",
};

function getTopNavActiveItem() {
  const path = window.location.pathname;

  if (path.startsWith("/ai-consult")) {
    return "ai";
  }

  if (path.startsWith("/guide")) {
    return "guide";
  }

  if (path.startsWith("/news")) {
    return "news";
  }

  return "home";
}

function App() {
  const [data, setData] = useState<HomePageData | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [drawerVideo, setDrawerVideo] = useState<VideoItem | null>(null);

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

  const allVideos = useMemo(() => {
    if (!data) {
      return [];
    }

    return [...data.videos, ...data.documentary];
  }, [data]);

  if (!data) {
    return (
      <main className="app app-loading">
        <div className="loading-mark" />
        <span>正在加载数字馆内容</span>
      </main>
    );
  }

  return (
    <main className="app">
      <TopNav />
      <Hero />
      <QuickNav items={data.navItems} />
      <FeatureGrid items={data.featureCards} />
      <VideoSection
        title="向东渠风采"
        items={data.videos}
        selectedVideo={selectedVideo}
        onSelect={setSelectedVideo}
        onOpen={setDrawerVideo}
      />
      <DocumentarySection
        items={data.documentary}
        onSelect={(item) => {
          setSelectedVideo(item);
          setDrawerVideo(item);
        }}
      />
      <GallerySection items={data.gallery} />
      <VideoDrawer
        video={drawerVideo}
        playlist={allVideos}
        onSelect={(item) => {
          setSelectedVideo(item);
          setDrawerVideo(item);
        }}
        onClose={() => setDrawerVideo(null)}
      />
    </main>
  );
}

function TopNav() {
  const [activeItem, setActiveItem] = useState<TopNavKey>(getTopNavActiveItem);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const linkClass = (item: TopNavKey) =>
    item === activeItem ? "top-nav-link active" : "top-nav-link";
  const mobileTabClass = (item: TopNavKey) =>
    item === activeItem ? "mobile-tab-link active" : "mobile-tab-link";

  return (
    <>
      <header className="site-header">
        <div className="site-brand" aria-label="向东渠事迹数字馆">
          <BrandMark />
          <span>向东渠事迹数字馆</span>
        </div>
        <nav className="top-nav" aria-label="顶部主导航">
          <a className={linkClass("home")} href="/" onClick={() => setActiveItem("home")}>
            <Home size={18} strokeWidth={2.1} />
            <span>首页</span>
          </a>
          <a className={linkClass("guide")} href="/guide" onClick={() => setActiveItem("guide")}>
            <Compass size={18} strokeWidth={2.1} />
            <span>导览</span>
          </a>
          <button
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
        <a className={mobileTabClass("home")} href="/" onClick={() => setActiveItem("home")}>
          <MobileTabIcon type="recommend" />
          <span>推荐</span>
        </a>
        <a className={mobileTabClass("guide")} href="/guide" onClick={() => setActiveItem("guide")}>
          <MobileTabIcon type="guide" />
          <span>导览</span>
        </a>
        <a className={mobileTabClass("news")} href="/news" onClick={() => setActiveItem("news")}>
          <MobileTabIcon type="news" />
          <span>资讯</span>
        </a>
        <button
          className={mobileTabClass("ai")}
          onClick={() => {
            setActiveItem("ai");
            setIsConsultOpen(true);
          }}
          type="button"
        >
          <Bot className="mobile-tab-icon" size={29} strokeWidth={2.1} />
          <span className="mobile-tab-text">
            咨询
            <em>AI</em>
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
      content: "您好，我可以帮您查询向东渠历史、展馆导览、视频资料和参观路线。",
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
      setPosition({
        x: Math.min(Math.max(12, nextX), Math.max(12, window.innerWidth - 430)),
        y: Math.min(Math.max(64, nextY), Math.max(64, window.innerHeight - 460)),
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
        { role: "assistant", content: content || "接口没有返回内容。" },
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : "智能咨询接口暂时不可用。",
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
        {isConsulting ? <p className="ai-message assistant muted">正在查询...</p> : null}
        <div className="ai-consult-prompts" aria-label="快捷问题">
          {["向东渠什么时候通水？", "展厅 VR 在哪里？"].map((question) => (
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
          disabled={isConsulting}
          onChange={(event) => setInput(event.target.value)}
          placeholder="输入想了解的内容"
          value={input}
        />
        <button disabled={isConsulting} type="submit" aria-label="发送问题">
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
          <a className="quick-nav-item" href={item.href} key={item.id}>
            <span className="quick-nav-icon">
              {iconSrc ? <img src={iconSrc} alt="" loading="lazy" /> : null}
            </span>
            <span>{item.label}</span>
          </a>
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
            <MediaFrame image={item.image} tone={item.id} label="图片留白" alt="" />
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
  onSelect,
  onOpen,
}: {
  title: string;
  items: VideoItem[];
  selectedVideo: VideoItem | null;
  onSelect: (item: VideoItem) => void;
  onOpen: (item: VideoItem) => void;
}) {
  return (
    <section className="section">
      <SectionHead title={title} href="/videos" />
      <div className="video-layout">
        <button
          className="video-stage"
          onClick={() => selectedVideo && onOpen(selectedVideo)}
          type="button"
        >
          <MediaFrame image={selectedVideo?.image ?? items[0]?.image} tone="video" label="视频封面留白" alt="" />
          <span className="play-button">
            <Play size={30} fill="currentColor" />
          </span>
          <div className="video-stage-title">
            <strong>{selectedVideo?.title ?? items[0]?.title}</strong>
            <span>{selectedVideo?.duration ?? items[0]?.duration}</span>
          </div>
        </button>
        <div className="video-list" aria-label="视频列表">
          {items.map((item) => (
            <button
              className={item.id === selectedVideo?.id ? "video-row active" : "video-row"}
              key={item.id}
              onClick={() => onSelect(item)}
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
  onSelect,
}: {
  items: VideoItem[];
  onSelect: (item: VideoItem) => void;
}) {
  return (
    <section className="section">
      <SectionHead title="央视纪录片《国家记忆》" subtitle="一渠清水向东流" href="/documentary" />
      <div className="documentary-grid">
        {items.map((item) => (
          <button className="documentary-card" key={item.id} onClick={() => onSelect(item)} type="button">
            <MediaFrame image={item.image} tone="documentary" label="纪录片封面留白" alt="" />
            <span className="play-button compact">
              <Play size={24} fill="currentColor" />
            </span>
            <strong>{item.title}</strong>
          </button>
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
              <article className="gallery-feed-card" key={item.id}>
                <div className="gallery-media">
                  <MediaFrame
                    image={item.image}
                    tone={`gallery-${index}`}
                    label={item.kind === "video" ? "视频留白" : "图片留白"}
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
              </article>
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

function Placeholder({ tone, label }: { tone: string; label: string }) {
  return (
    <div className={`placeholder placeholder-${tone}`}>
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
    return <Placeholder tone={tone} label={label} />;
  }

  return (
    <div className={`placeholder placeholder-${tone} has-image`}>
      <img src={image} alt={alt} loading="lazy" />
    </div>
  );
}

function VideoDrawer({
  video,
  playlist,
  onSelect,
  onClose,
}: {
  video: VideoItem | null;
  playlist: VideoItem[];
  onSelect: (item: VideoItem) => void;
  onClose: () => void;
}) {
  if (!video) {
    return null;
  }

  return (
    <aside className="video-drawer" aria-label="当前视频">
      <button className="drawer-close" onClick={onClose} type="button">
        收起
      </button>
      <div className="drawer-cover">
        <MediaFrame image={video.image} tone="drawer" label="播放器留白" alt="" />
        <span className="play-button">
          <Play size={30} fill="currentColor" />
        </span>
      </div>
      <div className="drawer-copy">
        <h3>{video.title}</h3>
        <p>这里预留真实播放器接口，接入视频地址后可替换当前留白区域。</p>
      </div>
      <div className="drawer-playlist">
        {playlist.slice(0, 4).map((item) => (
          <button
            className={item.id === video.id ? "active" : ""}
            key={item.id}
            onClick={() => onSelect(item)}
            type="button"
          >
            {item.title}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default App;
