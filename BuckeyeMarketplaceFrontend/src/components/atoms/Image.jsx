export default function Image({ src, alt, width = '100%', height = 'auto' }) {
  const styles = {
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
        e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image';
        e.target.style.objectFit = 'contain';
        e.target.style.padding = '20px';
      }}
    />
  );
}
