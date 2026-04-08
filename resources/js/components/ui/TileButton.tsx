import * as React from "react";
import { Link } from "@inertiajs/react";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type TileButtonProps = {
  title: string | string[];
  href?: string;
  onClick?: () => void;

  icon?: IconType;
  iconPosition?: "bottom-left" | "right" | "bottom-right";
  iconOpacity?: number;

  className?: string;
  titleClassName?: string;

  iconClassName?: string;

  as?: "link" | "button";
};

export function TileButton({
  title,
  href,
  onClick,
  icon: Icon,
  iconPosition = "bottom-left",
  iconOpacity = 0.65,
  className = "",
  titleClassName = "",
  iconClassName = "",
  as = "link",
}: TileButtonProps) {
  const Title = Array.isArray(title) ? title : [title];

  const base =
    "relative overflow-hidden rounded-[26px] bg-blue-600 text-white " +
    "shadow-[0_18px_45px_rgba(0,0,0,0.10)] " +
    "transition-all duration-200 " +
    "hover:brightness-[1.06] hover:shadow-[0_22px_55px_rgba(0,0,0,0.14)] " +
    "active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300";

  const padding = "p-8";
  const text = "text-[44px] leading-[0.95] font-extrabold tracking-tight";
  const finalClass = `${base} ${padding} ${className}`;

  const iconCommon = "absolute pointer-events-none text-white";
  const iconStyle: React.CSSProperties = { opacity: iconOpacity };

  const iconPosClass =
    iconPosition === "bottom-left"
      ? "-left-4 -bottom-4 h-40 w-40 sm:-left-5 sm:-bottom-5 sm:h-48 sm:w-48 md:h-52 md:w-52"
      : iconPosition === "bottom-right"
      ? "-right-10 -bottom-10 h-40 w-40 sm:-right-12 sm:-bottom-12 sm:h-48 sm:w-48 md:h-52 md:w-52"
      : "right-[-34px] top-1/2 -translate-y-1/2 h-36 w-36 sm:right-[-40px] sm:h-40 sm:w-40 md:right-[-46px] md:h-44 md:w-44";

  const content = (
    <>
      <div className={`${text} ${titleClassName}`}>
        {Title.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </div>

      {Icon ? (
        <Icon
          className={`${iconCommon} ${iconPosClass} ${iconClassName}`}
          style={iconStyle}
          strokeWidth={2.6}
          fill="none"
        />
      ) : null}
    </>
  );

  if (as === "button") {
    return (
      <button type="button" className={finalClass} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href ?? "#"} className={finalClass}>
      {content}
    </Link>
  );
}
