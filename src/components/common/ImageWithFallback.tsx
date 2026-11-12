import { useState } from "react";
import { getMediaUrl } from "../../utils/media";
import { Icon } from "./Icon";

type ImageWithFallbackProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackLabel?: string;
};

export function ImageWithFallback({
  src,
  alt,
  className = "",
  fallbackLabel = "No image",
}: ImageWithFallbackProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const imageUrl = getMediaUrl(src);

  if (!imageUrl || failedUrl === imageUrl) {
    return (
      <div
        className={`image-fallback flex flex-col items-center justify-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-300 ${className}`}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300/60 bg-white/50 text-red-500 dark:border-white/10 dark:bg-white/5">
          <Icon name="flag" className="h-5 w-5" />
        </span>
        <span className="max-w-[80%] text-center text-[10px] font-extrabold uppercase tracking-[0.14em]">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      onError={() => setFailedUrl(imageUrl)}
      className={className}
    />
  );
}
