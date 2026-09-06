import Image from "next/image";
export default function Logo({ 
  variant = "dark", 
  size = "default" 
}: { 
  variant?: "dark" | "light"; 
  size?: "default" | "sm"; 
}) {
  const textSize = size === "sm" ? "text-sm" : "text-lg";
  const imageHeight = size === "sm" ? "h-7" : "h-8";

  return (
    <span className="inline-flex items-center gap-1">
      <Image
        src="/logo.png"
        alt="Daughter's Delight logo"
        width={72}
        height={36}
        className={`${imageHeight} w-auto object-contain -ml-2.5 -mr-2`}
        priority={size === "sm"}
      />
      <span className={`font-heading ${textSize} font-medium leading-none`}>
        <span className={variant === "dark" ? "text-foreground" : "text-white"}>
          Daughter&rsquo;s
        </span>
        <span className="text-primary"> Delight</span>
      </span>
    </span>
  );
}
