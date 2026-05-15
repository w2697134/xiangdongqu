import Image from "next/image";
import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  description,
  compactMobile = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  compactMobile?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold text-[#9f1f2f]">{eyebrow}</p>
      <h2
        className={[
          "mt-2 font-semibold text-stone-950 sm:text-3xl",
          compactMobile ? "text-[1.35rem] leading-8" : "text-2xl",
        ].join(" ")}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-stone-600 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex min-h-11 items-center rounded-sm px-5 py-3 text-sm font-semibold transition",
        variant === "primary"
          ? "bg-[#9f1f2f] text-white hover:bg-[#7f1827]"
          : "border border-white/45 text-white hover:bg-white/10",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export function TextCard({
  title,
  kicker,
  description,
  href,
}: {
  title: string;
  kicker?: string;
  description: string;
  href?: string;
}) {
  const content = (
    <article className="h-full rounded-sm border border-stone-200 bg-white p-5 shadow-sm transition hover:border-[#9f1f2f]/40 hover:shadow-md">
      {kicker ? <p className="text-xs font-semibold text-[#2f6f7d]">{kicker}</p> : null}
      <h3 className="mt-3 text-lg font-semibold text-stone-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-stone-600">{description}</p>
    </article>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export function ImageEntranceCard({
  title,
  kicker,
  description,
  href,
  image,
  placeholder,
}: {
  title: string;
  kicker: string;
  description: string;
  href: string;
  image: string;
  placeholder?: string;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-sm border border-stone-200 bg-white shadow-sm transition hover:border-[#9f1f2f]/40 hover:shadow-md"
    >
      <article>
        <div className="relative aspect-[16/10] bg-stone-200">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/72 via-stone-950/18 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs font-semibold text-[#f5c6ad]">{kicker}</p>
            <h3 className="mt-1 text-xl font-semibold text-white">{title}</h3>
          </div>
        </div>
        <div className="p-5">
          {placeholder ? (
            <p className="inline-flex rounded-sm border border-dashed border-[#9f1f2f]/35 bg-[#9f1f2f]/5 px-2.5 py-1 text-xs font-semibold text-[#9f1f2f]">
              {placeholder}
            </p>
          ) : null}
          <p className="mt-3 text-sm leading-7 text-stone-600">{description}</p>
          <p className="mt-4 text-sm font-semibold text-[#9f1f2f]">进入栏目</p>
        </div>
      </article>
    </Link>
  );
}

export function PlaceholderCard({
  title,
  placeholder,
  description,
}: {
  title: string;
  placeholder: string;
  description?: string;
}) {
  return (
    <article className="flex min-h-36 flex-col justify-center rounded-sm border border-dashed border-stone-300 bg-white/80 p-5 shadow-sm">
      <p className="inline-flex rounded-sm bg-[#2f6f7d]/10 px-2.5 py-1 text-xs font-semibold text-[#2f6f7d]">
        {placeholder}
      </p>
      <h3 className="mt-4 text-lg font-semibold text-stone-950">{title}</h3>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-stone-600">{description}</p>
      ) : null}
    </article>
  );
}

export function MediaCard({
  title,
  meta,
  description,
  image,
  alt,
  placeholder,
}: {
  title: string;
  meta: string;
  description: string;
  image: string;
  alt: string;
  placeholder?: string;
}) {
  return (
    <article className="overflow-hidden rounded-sm border border-stone-200 bg-white shadow-sm transition hover:border-[#9f1f2f]/40 hover:shadow-md">
      {placeholder ? (
        <div className="flex aspect-[16/10] items-center justify-center border-b border-dashed border-stone-300 bg-[#f3eadc] p-6 text-center">
          <div>
            <p className="text-xs font-semibold text-[#9f1f2f]">{placeholder}</p>
            <p className="mt-3 text-lg font-semibold text-stone-950">{title}</p>
          </div>
        </div>
      ) : (
        <div className="relative aspect-[16/10] bg-stone-200">
          <Image src={image} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
        </div>
      )}
      <div className="p-5">
        <p className="text-xs font-semibold text-[#2f6f7d]">{meta}</p>
        <h3 className="mt-3 text-lg font-semibold text-stone-950">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-stone-600">{description}</p>
      </div>
    </article>
  );
}

export function ContentBand({ children }: { children: React.ReactNode }) {
  return <section className="px-4 py-14 sm:px-6 lg:px-8">{children}</section>;
}

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-7xl">{children}</div>;
}
