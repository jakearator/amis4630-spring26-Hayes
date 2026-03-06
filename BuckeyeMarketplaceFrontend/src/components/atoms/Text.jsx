export default function Text({ children, variant = 'body', style = {} }) {
  const variants = {
    h1: {
      fontSize: '32px',
      fontWeight: '700',
      margin: '20px 0 10px 0',
      lineHeight: '1.3',
    },
    h2: {
      fontSize: '24px',
      fontWeight: '600',
      margin: '16px 0 8px 0',
      lineHeight: '1.3',
    },
    h3: {
      fontSize: '18px',
      fontWeight: '600',
      margin: '12px 0 6px 0',
      lineHeight: '1.3',
    },
    body: {
      fontSize: '14px',
      fontWeight: '400',
      margin: '0',
      lineHeight: '1.5',
    },
    small: {
      fontSize: '12px',
      fontWeight: '400',
      margin: '0',
      lineHeight: '1.4',
    },
    label: {
      fontSize: '12px',
      fontWeight: '600',
      margin: '0 0 4px 0',
      display: 'block',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  };

  const selectedVariant = variants[variant] || variants.body;
  const mergedStyle = { ...selectedVariant, ...style };

  return <span style={mergedStyle}>{children}</span>;
}
