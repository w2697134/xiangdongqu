import { PageHero } from "@/components/page-hero";
import { Container, ContentBand, SectionHeading } from "@/components/section";
import { adminModules } from "@/data/mock";

export default function AdminEntryPage() {
  return (
    <>
      <PageHero
        eyebrow="后台入口"
        title="内容管理能力的入口占位"
        description="当前阶段只展示后台入口和模块规划，不做登录、上传、数据库或真实 CRUD。"
        imageSrc="/exhibits/hero-waterway.png"
        imageAlt="后台入口主题视觉"
      />

      <ContentBand>
        <Container>
          <SectionHeading
            eyebrow="管理模块"
            title="后续可扩展的内容管理结构"
            description="这些模块用于说明后续方向，当前阶段不实现登录、上传、数据库或真实后台操作。"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {adminModules.map((item) => (
              <article
                key={item.title}
                className="rounded-sm border border-dashed border-stone-300 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold text-stone-950">{item.title}</h2>
                  <span className="shrink-0 rounded-sm bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-600">
                    {item.status}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </ContentBand>
    </>
  );
}
