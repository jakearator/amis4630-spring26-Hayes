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
const PRODUCT_ASSET_PATH = '/assets/products';

interface ProductImageInput {
  id?: number | null;
  title?: string | null;
  imageUrl?: string | null;
  category?: string | null;
}

const KNOWN_PRODUCT_IMAGES = [
  {
    id: 1,
    title: 'Calculus 1 Textbook (Math 1151)',
    imageUrl: FALLBACK_IMAGE_BY_CATEGORY.textbooks,
  },
  {
    id: 2,
    title: 'Physics 1200 Lab Manual & Textbook Bundle',
    imageUrl: FALLBACK_IMAGE_BY_CATEGORY.textbooks,
  },
  {
    id: 3,
    title: 'Ergonomic Laptop Stand',
    imageUrl: `${PRODUCT_ASSET_PATH}/laptop-stand.jpg`,
  },
  {
    id: 4,
    title: 'Wireless Mouse & USB Receiver',
    imageUrl: `${PRODUCT_ASSET_PATH}/wireless-mouse-usb-receiver.jpg`,
  },
  {
    id: 5,
    title: 'Compact Mini Fridge (3.2 cu ft)',
    imageUrl: `${PRODUCT_ASSET_PATH}/compact-mini-fridge.jpg`,
  },
  {
    id: 6,
    title: 'LED Desk Lamp with USB Charging',
    imageUrl: `${PRODUCT_ASSET_PATH}/led-desk-lamp-usb-charging.jpg`,
  },
  {
    id: 7,
    title: 'Official Ohio State Buckeyes Sweatshirt',
    imageUrl: `${PRODUCT_ASSET_PATH}/ohio-state-buckeyes-sweatshirt.jpg`,
  },
  {
    id: 8,
    title: 'Winter Parka Jacket - North Face Style',
    imageUrl: `${PRODUCT_ASSET_PATH}/winter-parka-jacket-north-face-style.jpg`,
  },
] as const;

const normalizeCategory = (category?: string | null): string =>
  category?.trim().toLowerCase() ?? '';

const normalizeTitle = (title?: string | null): string =>
  title?.trim().toLowerCase().replace(/\s+/g, ' ') ?? '';

const PRODUCT_IMAGE_BY_ID = KNOWN_PRODUCT_IMAGES.reduce<Record<number, string>>(
  (imagesById, product) => {
    imagesById[product.id] = product.imageUrl;
    return imagesById;
  },
  {},
);

const PRODUCT_IMAGE_BY_TITLE = KNOWN_PRODUCT_IMAGES.reduce<Record<string, string>>(
  (imagesByTitle, product) => {
    imagesByTitle[normalizeTitle(product.title)] = product.imageUrl;
    return imagesByTitle;
  },
  {},
);

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

export const resolveProductImageSource = (product: ProductImageInput): string => {
  const knownImageById =
    typeof product.id === 'number' ? PRODUCT_IMAGE_BY_ID[product.id] : undefined;

  if (knownImageById) {
    return knownImageById;
  }

  const knownImageByTitle = PRODUCT_IMAGE_BY_TITLE[normalizeTitle(product.title)];

  if (knownImageByTitle) {
    return knownImageByTitle;
  }

  return getProductImageSource(product.imageUrl, product.category);
};
