import { PageHero } from "@/components/page-hero";
import { Container, ContentBand, SectionHeading, TextCard } from "@/components/section";
import { spiritItems } from "@/data/mock";

export default function SpiritPage() {
  return (
    <>
      <PageHero
        eyebrow="精神内涵"
        title="从建设实践中提炼向东渠精神"
        description="精神内涵页围绕建设实践展开，不只摆放口号，而是为人物故事、建设场景、采访视频和文献资料预留叙事位置。"
        imageSrc="/generated/cover-spirit.png"
        imageAlt="向东渠精神内涵主题视觉"
      />

      <ContentBand>
        <Container>
          <SectionHeading
            eyebrow="四个主题"
            title="从工程实践中看精神传承"
            description="每个主题都可以在后续阶段补充人物故事、现场照片、采访视频和文献资料。"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {spiritItems.map((item) => (
              <TextCard
                key={item.title}
                title={item.title}
                kicker={item.subtitle}
                description={item.description}
              />
            ))}
          </div>
        </Container>
      </ContentBand>

      <section className="bg-stone-950 px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold text-[#f5c6ad]">叙事方式</p>
          <h2 className="mt-2 max-w-3xl text-2xl font-semibold sm:text-3xl">
            用真实故事承载精神主题
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "待放：建设者人物故事",
              "待放：水渠建设场景照片",
              "待整理：当代传承案例",
            ].map((item) => (
              <div key={item} className="rounded-sm border border-white/15 p-5">
                <h3 className="font-semibold text-white">{item}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-400">
                  后续可接入对应文章、照片、视频和采访内容，形成可持续更新的精神专题馆。
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
