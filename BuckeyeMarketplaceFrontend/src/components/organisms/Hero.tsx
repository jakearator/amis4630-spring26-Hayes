import { FC, CSSProperties } from 'react';

const Hero: FC = () => {
  const styles: Record<string, CSSProperties> = {
    hero: {
      backgroundColor: 'white',
      padding: '60px 20px',
      textAlign: 'center',
      borderBottom: '1px solid #e5e5e5',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    title: {
      fontSize: '44px',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '12px',
      letterSpacing: '-0.5px',
    },
    subtitle: {
      fontSize: '18px',
      color: '#666',
      fontWeight: '400',
      lineHeight: '1.6',
    },
  };

  return (
    <section style={styles.hero}>
      <div style={styles.container}>
        <h1 style={styles.title}>Buckeye Marketplace</h1>
        <p style={styles.subtitle}>Discover products from our community</p>
      </div>
    </section>
  );
};

export default Hero;
