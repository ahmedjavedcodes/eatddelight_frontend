import Image from "next/image";

export default function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="Daughter's Delight logo"
        width={72}
        height={36}
        className="h-8 w-auto object-contain"
      />
      <span className="font-heading text-lg font-medium leading-none">
        <span className={variant === "dark" ? "text-foreground" : "text-white"}>
          Daughter&rsquo;s
        </span>
        <span className="text-primary"> Delight</span>
      </span>
    </span>
  );
}
