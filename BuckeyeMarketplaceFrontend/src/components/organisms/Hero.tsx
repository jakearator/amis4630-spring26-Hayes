import { FC } from 'react';

interface HeroProps {
  onStartShopping?: () => void;
}

interface IconProps {
  className?: string;
}

const ArrowRightIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const Hero: FC<HeroProps> = ({ onStartShopping }) => {
  return (
    <section className="marketplace-hero" aria-labelledby="marketplace-hero-title">
      <div className="marketplace-hero__inner">
        <div className="marketplace-hero__content">
          <p className="marketplace-hero__eyebrow">Buckeye Marketplace</p>
          <h1 id="marketplace-hero-title">Find great campus essentials</h1>
          <p className="marketplace-hero__copy">
            Shop textbooks, electronics, furniture, clothing, and more for campus life.
          </p>
          <div className="marketplace-hero__actions">
            <button type="button" className="marketplace-hero__cta" onClick={onStartShopping}>
              <span>Browse Products</span>
              <ArrowRightIcon className="marketplace-hero__cta-icon" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
