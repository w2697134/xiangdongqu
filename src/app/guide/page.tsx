import { PageHero } from "@/components/page-hero";
import { Container, ContentBand, SectionHeading } from "@/components/section";
import { guideItems } from "@/data/mock";
import Image from "next/image";

export default function GuidePage() {
  return (
    <>
      <PageHero
        eyebrow="数字导览"
        title="水渠、展厅与路线的统一导览入口"
        description="三类导览入口分别面向全景水渠、事迹展厅和参观路线。当前保留待放/待上传状态，后续补充真实 VR 链接和路线点位即可接入。"
        imageSrc="/generated/cover-digital-guide.png"
        imageAlt="数字导览主题视觉"
      />

      <ContentBand>
        <Container>
          <SectionHeading
            eyebrow="导览模块"
            title="三类可点击导览入口"
            description="当前为前台入口展示，不做真实跳转和 API；每张卡片都明确标注后续要补充的导览素材。"
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {guideItems.map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-sm border border-stone-200 bg-white shadow-sm transition hover:border-[#9f1f2f]/40 hover:shadow-md"
              >
                <div className="relative aspect-[16/10] bg-stone-200">
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-sm bg-white/90 px-3 py-1 text-xs font-semibold text-[#9f1f2f]">
                    {item.type}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-semibold text-[#f5c6ad]">
                      {item.status}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-white">
                      {item.title}
                    </h2>
                  </div>
                </div>
                <div className="p-5">
                  <p className="inline-flex rounded-sm border border-dashed border-[#9f1f2f]/35 bg-[#9f1f2f]/5 px-2.5 py-1 text-xs font-semibold text-[#9f1f2f]">
                    {item.placeholder}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-stone-600">
                    {item.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4">
                    <span className="text-sm font-semibold text-stone-950">
                      导览入口预留
                    </span>
                    <span className="text-sm font-semibold text-[#9f1f2f]">
                      待接入
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </ContentBand>

      <section className="bg-[#f3eadc] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <SectionHeading
            eyebrow="参观动线"
            title="从工程场景到精神主题"
            description="导览结构预留“起点、渠线、展厅、人物、资料”节点，可在后续阶段扩展成真实点位。"
          />
          <div className="grid gap-3 sm:grid-cols-5">
            {["工程背景", "渠线节点", "历史资料", "人物故事", "精神传承"].map(
              (item, index) => (
                <div
                  key={item}
                  className="rounded-sm border border-stone-300 bg-white p-4 text-center shadow-sm"
                >
                  <p className="mx-auto flex h-9 w-9 items-center justify-center rounded-sm bg-[#2f6f7d] text-sm font-semibold text-white">
                    {index + 1}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-stone-900">{item}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}
