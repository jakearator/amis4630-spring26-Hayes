const FALLBACK_IMAGE_BY_CATEGORY: Record<string, string> = {
  textbooks: '/assets/product-fallbacks/textbooks.png',
  electronics: '/assets/product-fallbacks/electronics.png',
  furniture: '/assets/product-fallbacks/furniture.png',
  clothing: '/assets/product-fallbacks/clothing.png',
  'home & living': '/assets/product-fallbacks/home-living.png',
  'sports & outdoors': '/assets/product-fallbacks/sports-outdoors.png',
  other: '/assets/product-fallbacks/other.png',
};

const DEFAULT_FALLBACK_IMAGE = FALLBACK_IMAGE_BY_CATEGORY.other;

const normalizeCategory = (category?: string | null): string =>
  category?.trim().toLowerCase() ?? '';

export const getProductFallbackImage = (category?: string | null): string => {
  const normalizedCategory = normalizeCategory(category);

  if (normalizedCategory.includes('textbook')) {
    return FALLBACK_IMAGE_BY_CATEGORY.textbooks;
  }

  if (normalizedCategory.includes('electronic')) {
    return FALLBACK_IMAGE_BY_CATEGORY.electronics;
  }

  if (normalizedCategory.includes('furniture')) {
    return FALLBACK_IMAGE_BY_CATEGORY.furniture;
  }

  if (normalizedCategory.includes('clothing') || normalizedCategory.includes('apparel')) {
    return FALLBACK_IMAGE_BY_CATEGORY.clothing;
  }

  if (normalizedCategory.includes('home') || normalizedCategory.includes('living')) {
    return FALLBACK_IMAGE_BY_CATEGORY['home & living'];
  }

  if (normalizedCategory.includes('sport') || normalizedCategory.includes('outdoor')) {
    return FALLBACK_IMAGE_BY_CATEGORY['sports & outdoors'];
  }

  return FALLBACK_IMAGE_BY_CATEGORY[normalizedCategory] ?? DEFAULT_FALLBACK_IMAGE;
};

export const getProductImageSource = (
  imageUrl: string | null | undefined,
  category?: string | null,
): string => {
  const trimmedImageUrl = imageUrl?.trim();

  return trimmedImageUrl && trimmedImageUrl.length > 0
    ? trimmedImageUrl
    : getProductFallbackImage(category);
};
