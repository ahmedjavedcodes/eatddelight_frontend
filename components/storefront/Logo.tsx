export default function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <span className="font-heading text-lg font-extrabold leading-none">
      <span className={variant === "dark" ? "text-foreground" : "text-white"}>
        Daughter&rsquo;s
      </span>
      <span className="text-primary"> Delight</span>
    </span>
  );
}
