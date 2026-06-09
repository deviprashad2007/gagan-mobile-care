import {
  siApple,
  siSamsung,
  siOneplus,
  siXiaomi,
  siVivo,
  siOppo,
  siGoogle,
  siMotorola,
  siHonor,
  siAsus,
} from "simple-icons";

const ICONS: Record<string, { path: string }> = {
  apple: siApple,
  samsung: siSamsung,
  oneplus: siOneplus,
  xiaomi: siXiaomi,
  vivo: siVivo,
  oppo: siOppo,
  pixel: siGoogle,
  motorola: siMotorola,
  honor: siHonor,
  asus: siAsus,
};

interface Props {
  slug: string;
  name: string;
  tone: string;
  glyph: string;
  /** Container size in px (width = height). Default 48. */
  size?: number;
  /** Icon fill colour. Default white. */
  iconColor?: string;
  className?: string;
}

export function BrandIcon({
  slug,
  name,
  tone,
  glyph,
  size = 48,
  iconColor = "#ffffff",
  className = "",
}: Props) {
  const icon = ICONS[slug];
  const iconSize = Math.round(size * 0.55);

  return (
    <div
      className={`flex items-center justify-center rounded-xl shrink-0 ${className}`}
      style={{ width: size, height: size, backgroundColor: tone }}
    >
      {icon ? (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={iconSize}
          height={iconSize}
          fill={iconColor}
          aria-label={name}
        >
          <path d={icon.path} />
        </svg>
      ) : (
        <span
          className="font-bold leading-none select-none"
          style={{ color: iconColor, fontSize: Math.round(size * 0.32) }}
        >
          {glyph}
        </span>
      )}
    </div>
  );
}
