import { FC, CSSProperties } from 'react';

interface ImageProps {
  src?: string | null;
  alt: string;
  width?: string | number;
  height?: string | number;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK_SRC = '/assets/product-fallbacks/other.png';

const INLINE_FALLBACK_SRC =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="900" height="675" viewBox="0 0 900 675"%3E%3Cdefs%3E%3ClinearGradient id="bg" x1="0" x2="1" y1="0" y2="1"%3E%3Cstop stop-color="%23fafafa"/%3E%3Cstop offset="1" stop-color="%23e5e7eb"/%3E%3C/linearGradient%3E%3ClinearGradient id="scarlet" x1="0" x2="1"%3E%3Cstop stop-color="%23bb0000"/%3E%3Cstop offset="1" stop-color="%238c0000"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="900" height="675" fill="url(%23bg)"/%3E%3Cellipse cx="450" cy="542" rx="270" ry="34" fill="%23d4d4d8" opacity=".65"/%3E%3Crect x="284" y="244" width="332" height="216" rx="24" fill="%23ffffff" stroke="%23d4d4d8" stroke-width="8"/%3E%3Cpath d="M320 244c18-74 241-74 260 0" fill="none" stroke="%23171717" stroke-width="16" stroke-linecap="round"/%3E%3Crect x="334" y="312" width="232" height="40" rx="20" fill="url(%23scarlet)"/%3E%3Crect x="334" y="378" width="160" height="28" rx="14" fill="%233f3f46" opacity=".88"/%3E%3C/svg%3E';

const Image: FC<ImageProps> = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  fallbackSrc = DEFAULT_FALLBACK_SRC,
}) => {
  const resolvedSrc = src?.trim() || fallbackSrc;

  const styles: Record<string, CSSProperties> = {
    image: {
      width,
      height,
      objectFit: 'cover',
      objectPosition: 'center',
      borderRadius: '10px',
      display: 'block',
      backgroundColor: '#f8f8f8',
    },
  };

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      style={styles.image}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        const target = e.currentTarget;

        if (target.dataset.fallbackApplied !== 'true' && fallbackSrc) {
          target.dataset.fallbackApplied = 'true';
          target.src = fallbackSrc;
          return;
        }

        target.src = INLINE_FALLBACK_SRC;
        target.style.objectFit = 'cover';
        target.style.padding = '0';
      }}
    />
  );
};

export default Image;
