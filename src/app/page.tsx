import {
  featuredItems,
  heroStats,
  homeEntrances,
  materialSlots,
  newsItems,
  siteName,
} from "@/data/mock";
import { PageHero } from "@/components/page-hero";
import {
  Container,
  ContentBand,
  ImageEntranceCard,
  LinkButton,
  PlaceholderCard,
  SectionHeading,
} from "@/components/section";

export default function Home() {
  return (
    <>
      <PageHero
        eyebrow="新版数字展馆原型"
        title={siteName}
        description="以红色文化、水利工程和历史资料为主线，先完成可点击、可展示、可扩展的前台页面骨架。"
        imageSrc="/generated/hero-xiangdongqu-canal.png"
        imageAlt="向东渠数字馆主题视觉"
        actions={
          <>
            <LinkButton href="/guide">进入数字导览</LinkButton>
            <LinkButton href="/archives" variant="secondary">
              浏览历史资料
            </LinkButton>
          </>
        }
      />

      <section className="bg-stone-950 px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-4">
          {heroStats.map((item) => (
            <div key={item.label} className="border-l border-white/20 pl-4">
              <p className="text-2xl font-semibold">{item.value}</p>
              <p className="mt-1 text-sm text-stone-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <ContentBand>
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="核心入口"
              title="导览、资料、影像入口"
              compactMobile
              description="首页不再只是文字卡片，先用栏目封面组织导览、档案、精神、价值、资讯和视频入口，后续可继续替换第二批正式图片。"
            />
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {homeEntrances.map((item) => (
              <ImageEntranceCard
                key={item.href}
                title={item.title}
                kicker={item.kicker}
                description={item.description}
                href={item.href}
                image={item.cover}
                placeholder={item.placeholder}
              />
            ))}
          </div>
        </Container>
      </ContentBand>

      <section className="bg-[#f3eadc] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <SectionHeading
              eyebrow="素材可更新"
              title="给真实照片、视频、文献预留正式位置"
              description="这些位置现在显示为系统预留位，不用生成图冒充真实素材。后续进入后台阶段后，可从内容管理端补充并在前台自动呈现。"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {materialSlots.map((item) => (
                <PlaceholderCard
                  key={item.title}
                  title={item.title}
                  placeholder={item.placeholder}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContentBand>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <SectionHeading
              eyebrow="内容组织"
              title="以专题馆方式组织内容"
              description="首页展示主题、栏目入口、推荐内容和最新动态，强调数字展馆和可维护内容结构。"
            />
            <div className="grid gap-3">
              {featuredItems.map((item) => (
                <article
                  key={item.title}
                  className="rounded-sm border border-stone-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-semibold text-[#9f1f2f]">
                    {item.category}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-stone-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-stone-600">
                    {item.summary}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </ContentBand>

      <ContentBand>
        <Container>
          <SectionHeading
            eyebrow="资讯动态"
            title="最近更新"
            description="资讯列表先使用示例数据，后续可替换为后台发布内容。"
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {newsItems.map((item) => (
              <article
                key={item.title}
                className="rounded-sm border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3 text-xs text-stone-500">
                  <span>{item.source}</span>
                  <time dateTime={item.date}>{item.date}</time>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-stone-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {item.summary}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </ContentBand>
    </>
  );
}
