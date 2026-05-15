import { PageHero } from "@/components/page-hero";
import { Container, ContentBand, SectionHeading } from "@/components/section";
import { valueDirections, valueItems } from "@/data/mock";

export default function ValuePage() {
  return (
    <>
      <PageHero
        eyebrow="时代价值"
        title="让历史工程继续服务今天的文化传播"
        description="时代价值栏目说明为什么今天仍要讲好向东渠故事：它连接红色教育、水利工程记忆、乡村文化传播和当代研究。"
        imageSrc="/generated/cover-era-value.png"
        imageAlt="时代价值主题视觉"
      />

      <ContentBand>
        <Container>
          <SectionHeading
            eyebrow="价值板块"
            title="面向教育、工程和文化传播"
            description="用卡片承载不同方向的价值表达，后续可以继续扩展人物风采、先进事迹、研究资料和今日实践。"
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {valueItems.map((item) => (
              <article
                key={item.title}
                className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm"
              >
                <span className="inline-flex rounded-sm bg-[#2f6f7d]/10 px-3 py-1 text-xs font-semibold text-[#2f6f7d]">
                  {item.tag}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-stone-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </ContentBand>

      <ContentBand>
        <Container>
          <div className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold text-[#9f1f2f]">后续承载方向</p>
            <div className="mt-5 grid gap-4 md:grid-cols-4">
              {valueDirections.map((item) => (
                <div key={item.title} className="border-l border-stone-200 pl-4">
                  <p className="text-base font-semibold text-stone-950">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </ContentBand>
    </>
  );
}
