import { PageHero } from "@/components/page-hero";
import {
  Container,
  ContentBand,
  MediaCard,
  SectionHeading,
} from "@/components/section";
import { archiveCategories, archiveItems, timelineItems } from "@/data/mock";

export default function ArchivesPage() {
  return (
    <>
      <PageHero
        eyebrow="历史资料"
        title="把大事记、旧文献、老照片和老物件组织起来"
        description="历史资料栏目按数字档案馆方式组织建设记忆、文献扫描件、老照片和老物件。生成图只作为栏目氛围封面，真实资料位置保留待放标识。"
        imageSrc="/generated/cover-history-archive.png"
        imageAlt="历史资料主题视觉"
      />

      <ContentBand>
        <Container>
          <SectionHeading
            eyebrow="档案分类"
            title="资料库入口清晰区分"
            description="分类先以 mock 数据呈现，后续可以接入真实档案数量和筛选条件。"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {archiveCategories.map((item) => (
              <article
                key={item.name}
                className="rounded-sm border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold text-stone-950">
                    {item.name}
                  </h2>
                  <span className="rounded-sm bg-[#9f1f2f]/10 px-2 py-1 text-xs font-semibold text-[#9f1f2f]">
                    {item.count}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-600">{item.note}</p>
              </article>
            ))}
          </div>
        </Container>
      </ContentBand>

      <section className="bg-[#f3eadc] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="历史脉络"
            title="建设记忆时间线"
            description="用简洁时间线串联向东渠从工程需求、建设推进到精神传承的内容结构。"
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {timelineItems.map((item) => (
              <article
                key={item.title}
                className="rounded-sm border border-stone-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-[#9f1f2f]">{item.year}</p>
                <h3 className="mt-3 text-lg font-semibold text-stone-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContentBand>
        <Container>
          <SectionHeading
            eyebrow="资料陈列"
            title="待放资料以正式预留位呈现"
            description="卡片保留待放/待上传标签，明确这些位置未来用于真实照片、文献扫描件和实物资料。"
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {archiveItems.map((item) => (
              <MediaCard
                key={item.title}
                title={item.title}
                meta={`${item.category} · ${item.time}`}
                placeholder={item.placeholder}
                description={item.description}
                image={item.cover}
                alt={item.title}
              />
            ))}
          </div>
        </Container>
      </ContentBand>
    </>
  );
}
