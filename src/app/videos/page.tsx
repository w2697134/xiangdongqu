import { PageHero } from "@/components/page-hero";
import { Container, ContentBand, MediaCard, SectionHeading } from "@/components/section";
import { videoFeatureTypes, videoItems } from "@/data/mock";

export default function VideosPage() {
  return (
    <>
      <PageHero
        eyebrow="视频展播"
        title="纪录片、人物访谈和活动记录集中展示"
        description="视频展播栏目用于承载纪录片、建设者访谈、研学活动和媒体影像。当前全部标注为待放/待上传，不冒充真实视频截图。"
        imageSrc="/generated/cover-video.png"
        imageAlt="视频展播主题视觉"
      />

      <ContentBand>
        <Container>
          <SectionHeading
            eyebrow="影像资料"
            title="可替换为真实视频的展示卡片"
            description="每张卡片包含封面、类型、时长、标题和简介，便于后续替换为真实素材。"
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {videoItems.map((item) => (
              <MediaCard
                key={item.title}
                title={item.title}
                meta={`${item.type} · ${item.duration}`}
                placeholder={item.placeholder}
                description={item.description}
                image={item.cover}
                alt={item.title}
              />
            ))}
          </div>
        </Container>
      </ContentBand>

      <section className="bg-stone-950 px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold text-[#f5c6ad]">视频类型</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
              先把影像栏目结构搭清楚
            </h2>
            <p className="mt-3 text-sm leading-7 text-stone-400 sm:text-base">
              第二批 UI 图片接入前，视频页先明确纪录片、人物访谈和活动记录三类内容入口。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {videoFeatureTypes.map((item) => (
              <div key={item.name} className="rounded-sm border border-white/15 p-5">
                <h3 className="font-semibold text-white">{item.name}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-400">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
