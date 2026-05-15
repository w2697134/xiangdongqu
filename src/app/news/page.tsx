import { PageHero } from "@/components/page-hero";
import { Container, ContentBand, SectionHeading } from "@/components/section";
import { newsItems } from "@/data/mock";

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="资讯动态"
        title="新闻、活动和媒体报道的展示入口"
        description="资讯动态页用于承载数字馆建设进展、主题活动、媒体报道和资料征集说明，后续可从后台发布更新。"
        imageSrc="/generated/cover-news.png"
        imageAlt="资讯动态主题视觉"
      />

      <ContentBand>
        <Container>
          <SectionHeading
            eyebrow="新闻列表"
            title="围绕数字馆建设和资料征集组织动态"
            description="列表信息包含标题、来源、日期、标签和摘要，为后续新闻详情页保留内容结构。"
          />
          <div className="mt-8 divide-y divide-stone-200 overflow-hidden rounded-sm border border-stone-200 bg-white shadow-sm">
            {newsItems.map((item) => (
              <article key={item.title} className="p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                  <span className="rounded-sm bg-[#9f1f2f]/10 px-2 py-1 font-semibold text-[#9f1f2f]">
                    {item.tag}
                  </span>
                  <span>{item.source}</span>
                  <time dateTime={item.date}>{item.date}</time>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-stone-950">
                  {item.title}
                </h2>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-stone-600">
                  {item.summary}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </ContentBand>

      <section className="bg-[#f3eadc] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="后续发布方向"
            title="动态内容不止新闻列表"
            description="后续可发布资料征集、活动预告、媒体报道、展馆更新和专题学习内容。"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {["待发布：主题活动", "待发布：媒体报道", "待发布：资料征集", "待发布：展馆更新"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-sm border border-dashed border-stone-300 bg-white p-5 text-sm font-semibold text-stone-800 shadow-sm"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}
