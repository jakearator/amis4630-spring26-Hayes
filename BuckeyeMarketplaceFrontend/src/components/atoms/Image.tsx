import { FC, CSSProperties } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
}

const Image: FC<ImageProps> = ({ src, alt, width = '100%', height = 'auto' }) => {
  const styles: Record<string, CSSProperties> = {
    image: {
      width,
      height,
      objectFit: 'cover',
      borderRadius: '10px',
      display: 'block',
      backgroundColor: '#f8f8f8',
    },
  };

  return (
    <img
      src={src}
      alt={alt}
      style={styles.image}
      onError={(e) => {
        const target = e.currentTarget;
        // Only set fallback if not already a placeholder (to prevent infinite loops)
        if (!target.src.includes('placeholder')) {
          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23999"%3EImage not available%3C/text%3E%3C/svg%3E';
          target.style.objectFit = 'contain';
          target.style.padding = '20px';
        }
      }}
    />
  );
};

export default Image;
