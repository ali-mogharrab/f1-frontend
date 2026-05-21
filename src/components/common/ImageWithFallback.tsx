import { useState } from "react";
import { getMediaUrl } from "../../utils/media";

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
  const [hasError, setHasError] = useState(false);

  const imageUrl = getMediaUrl(src);

  if (!imageUrl || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-semibold text-slate-500 ${className}`}
      >
        {fallbackLabel}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}