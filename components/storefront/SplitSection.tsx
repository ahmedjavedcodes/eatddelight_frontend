import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function SplitSection({
  eyebrow,
  title,
  body,
  imageAlt,
  imageSrc = "/hero-placeholder.svg",
  reverse = false,
  hideImage = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  imageAlt: string;
  imageSrc?: string;
  reverse?: boolean;
  hideImage?: boolean;
}) {
  return (
    <div className={hideImage ? "" : "grid gap-10 py-10 lg:grid-cols-2 lg:items-center"}>
      <RevealOnScroll className={hideImage ? "py-10" : reverse ? "lg:order-2" : ""}>
        <span className="text-sm font-bold uppercase tracking-wide text-primary">
          {eyebrow}
        </span>
        <h2 className="mt-2 font-heading text-3xl font-semibold text-foreground">
          {title}
        </h2>
        <p className="mt-4 text-muted">{body}</p>
      </RevealOnScroll>
      {!hideImage && (
        <RevealOnScroll
          delay={0.1}
          className={`relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-tint ${
            reverse ? "lg:order-1" : ""
          }`}
        >
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
        </RevealOnScroll>
      )}
    </div>
  );
}
