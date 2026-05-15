import Image from "next/image";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  actions?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  actions,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-stone-950 text-white">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        className="object-cover opacity-55"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,25,23,0.92),rgba(28,25,23,0.58),rgba(28,25,23,0.36))]" />
      <div className="relative mx-auto flex min-h-[430px] max-w-7xl items-end px-4 py-16 sm:px-6 lg:min-h-[520px] lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold text-[#f5c6ad]">{eyebrow}</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-stone-100 sm:text-lg">
            {description}
          </p>
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
