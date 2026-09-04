export default function PageHeading({
  eyebrow,
  title,
  center = false,
  as: Tag = "h1",
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <span className="text-sm font-bold uppercase tracking-wide text-primary">
        {eyebrow}
      </span>
      <Tag className="mt-2 font-heading text-4xl font-semibold text-foreground sm:text-5xl">
        {title}
      </Tag>
    </div>
  );
}
