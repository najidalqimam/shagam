export function BrandLogo({
  className = "h-10 w-auto",
  variant = "color",
}: {
  className?: string;
  variant?: "color" | "white";
}) {
  const src = variant === "white" ? "/logo-shagam-white.png" : "/logo-shagam.png";

  return (
    <img
      src={src}
      alt="شاغم — منصة خدمات الطائرات المسيّرة"
      className={`object-contain object-right ${className}`}
    />
  );
}
