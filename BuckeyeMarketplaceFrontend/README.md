# Buckeye Marketplace Frontend

A modern, minimalist React-based frontend for the Buckeye Marketplace platform, built with Atomic Design principles and a clean, Amazon-inspired design aesthetic.

## 🎨 New Minimalist Design (v2.0)

The frontend has been completely refactored with a **minimalist, modern, and clean** design philosophy featuring:

- ✨ **Sticky Header** with search bar and user shortcuts
- 🎯 **Clean Product Cards** with hover lift effects
- 📱 **Responsive Grid** (3-4 columns desktop, 2 tablet, 1 mobile)
- 🔴 **Buckeye Scarlet Brand Color** (#BB0000) for prices and CTAs
- 🌐 **Elegant Spacing** and typography hierarchy
- ⚡ **Smooth 200ms Transitions** throughout
- 📐 **1200px Max-Width Container** for optimal viewing

### Design Documentation
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Comprehensive design guide
- **[DESIGN_TOKENS.md](./DESIGN_TOKENS.md)** - Quick reference & copy-paste snippets
- **[REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)** - Detailed change log

## Project Structure

```
src/
├── components/
│   ├── atoms/                      # Basic UI elements
│   │   ├── Button.tsx              # ✨ TypeScript refactor with #BB0000
│   │   ├── Image.tsx               # ✨ TypeScript with prop types
│   │   └── Text.tsx                # Typography variants with variants
│   ├── molecules/
│   │   ├── ComingSoonModal.tsx     # Modal dialog component
│   │   └── ProductCard.tsx         # ✨ TypeScript card with hover effects
│   └── organisms/                  # Complex components
│       ├── Header.tsx              # ✨ TypeScript sticky navigation
│       ├── Hero.tsx                # ✨ TypeScript welcome section
│       └── ProductGrid.tsx         # ✨ TypeScript responsive grid
├── pages/
│   ├── ProductListPage.tsx         # ✨ TypeScript with API integration
│   └── ProductDetailPage.tsx       # ✨ TypeScript complete redesign
├── services/
│   └── api.ts                      # ✨ TypeScript API integration
├── types/
│   └── index.ts                    # ✨ Shared TypeScript interfaces
├── App.tsx                         # ✨ TypeScript simplified structure
└── main.tsx                        # Entry point
```

## Technology Stack

- **React 18** - UI library
- **React Router 6** - Client-side routing
- **TypeScript 5.3** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **CSS-in-JS** - Component-scoped inline styles
- **Modern CSS** - Grid, Flexbox, Transitions

## TypeScript Migration Audit (v2.1)

The frontend has been fully converted to TypeScript with comprehensive type safety:

### Recent Fixes (March 2026)
- ✅ **API Type Alignment** - Removed `sellerName` property from Product interface (not returned by backend)
- ✅ **Unused Variable Cleanup** - Removed unused `setSearchQuery` state in Header component
- ✅ **Type Safety** - All React components properly typed with FC<PropsType> pattern
- ✅ **Hook Typing** - All useState and useEffect hooks correctly typed
- ✅ **Build Status** - Clean TypeScript build with zero errors (44 modules)

### Type Definitions
All types are defined in `src/types/index.ts`:
```typescript
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  postedDate: string;
  imageUrl: string;
  brand?: string;
}
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features

### Product Listing Page
- 🎯 Modern header with search bar (Amazon-style)
- 🌟 Hero section with marketplace branding
- 📱 Responsive product grid (3-4 columns desktop, 2 tablet, 1 mobile)
- ✨ Product cards with hover lift effects
- 🔄 Loading and error states with improved styling
- 🌐 Mobile-optimized layout

### Product Detail Page
- 🖼️ Large product image with whitespace
- 📝 Clear product information hierarchy
- 🏷️ Category badge, seller info, and posted date

## Implementation Notes

### Client-Side Routing
**Decision**: Used React Router v6 for SPA navigation with dynamic product detail pages, allowing fast navigation without page reloads.
```jsx
<Routes>
  <Route path="/products" element={<ProductListPage />} />
  <Route path="/products/:id" element={<ProductDetailPage />} />
</Routes>
```

### API Integration & Error Handling
**Decision**: Created centralized `api.js` service with error handling for network and 404 scenarios, keeping components clean.
```javascript
export const getProductById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (response.status === 404) return null;
  return await response.json();
};
```

### Atomic Design Structure
**Decision**: Organized components into atoms (Button, Text, Image), molecules (ProductCard), and organisms (Header, ProductGrid) for maintainability and reusability.
```
components/
├── atoms/        # Reusable base elements
├── molecules/    # Simple combinations
└── organisms/    # Complex components
```

### Responsive Grid Layout
**Decision**: Implemented CSS Grid with media queries for responsive design (desktop: 3-4 cols, tablet: 2 cols, mobile: 1 col) without external CSS libraries.
```javascript
display: 'grid',
gridTemplateColumns: window.innerWidth >= 1200 ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)'
```
- 💰 Price highlighted in scarlet (#BB0000)
- 🛒 Add to Cart button with modern styling
- 📱 Responsive 2-column to 1-column layout
- ← Back to Products link

### Product Cards
- 📦 Clean, minimal design
- 🖼️ Large image preview (240px height)
- 🏷️ Category badge in soft gray
- 📍 Seller name in light gray
- 💰 Price in scarlet (#BB0000)
- ✨ Smooth hover effects (lift + shadow)
- 🔄 2-line title truncation with ellipsis

## API Integration

The frontend connects to a .NET backend API:

**Base URL:** `https://localhost:5001/api`

### Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID

## Routing

- `/` - Redirects to `/products`
- `/products` - Product listing page (with Header & Hero)
- `/products/:id` - Product detail page
- `*` - Catches all unmatched routes and redirects to `/products`

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Buckeye Scarlet** | #BB0000 | Prices, buttons, accents |
| **Dark Text** | #1A1A1A | Headlines, primary text |
| **Gray Text** | #666666 | Secondary text |
| **Light Gray** | #999999 | Labels, tertiary info |
| **Off-White** | #FAFAFA | Page background |
| **White** | #FFFFFF | Cards, containers |
| **Light Gray BG** | #F8F8F8 | Image backgrounds |

### Typography

### Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Hero H1 | 44px | 700 | 1.2 |
| Page H1 | 32px | 700 | 1.2 |
| Card Title | 15px | 600 | 1.4 |
| Body | 15px | 400 | 1.6 |
| Price | 18-36px | 700 | 1.0 |
| Label | 12px | 600 | 1.2 |

**Font Family:**
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
'Helvetica Neue', sans-serif
```

### Spacing System (8px Grid)

| Value | Multiple | Usage |
|-------|----------|-------|
| 8px | 1x | Micro spacing |
| 16px | 2x | Standard padding |
| 24px | 3x | Common gaps |
| 40px | 5x | Section padding |
| 60px | 7.5x | Hero padding |

### Component Specifications

#### Product Card
- Border Radius: **10px**
- Card Height: **Flexible** (dynamic based on content)
- Image Height: **240px**
- Shadows: **0 1px 3px** (default), **0 4px 12px** (hover)
- Hover Effect: **translateY(-3px) with shadow increase**

#### Button
- Padding: **12px 24px**
- Border Radius: **6px**
- Background: **#BB0000** (Hover: **#9A0000**)
- Transition: **200ms ease**

#### Header
- Position: **Sticky** (z-index: 100)
- Padding: **16px 20px**
- Shadow: **0 1px 3px rgba(0,0,0,0.08)**
- Max-Width: **1200px** (centered)

#### Container
- Max-Width: **1200px**
- Padding: **0 20px** (mobile-safe)
- Margin: **0 auto** (centered)

### Transitions & Animations

- **Standard Duration**: 200ms
- **Easing**: `ease` (smooth acceleration/deceleration)
- **Common Properties**: transform, box-shadow, background-color

### Responsive Breakpoints

```
Desktop (1200px+):    3-4 columns, 24px gap
Laptop (1024px+):     3 columns, 24px gap
Tablet (768px+):      2 columns, 16px gap
Mobile (<768px):      1 column, 16px gap
```

## Recent Changes (v2.0 Refactoring)

### New Components
- ✨ **Header.jsx** - Sticky navigation with search
- ✨ **Hero.jsx** - Welcome section with marketplace title

### Updated Components
- ✨ **ProductCard.jsx** - Modern design with hover effects
- ✨ **ProductGrid.jsx** - Better responsive layout
- ✨ **ProductListPage.jsx** - Integrated Header & Hero
- ✨ **ProductDetailPage.jsx** - Complete redesign with Header
- ✨ **Button.jsx** - New scarlet color (#BB0000)
- ✨ **Image.jsx** - Improved styling with fallbacks
- ✨ **index.html** - Enhanced global styles

### Color Updates
- Old Red: #C41E3A → New Scarlet: #BB0000
- Background: #F5F5F5 → #FAFAFA (subtler)
- Button Hover: #A01830 → #9A0000

### Key Improvements
- Minimalist design with lots of whitespace
- Consistent spacing and typography
- Smooth hover effects and transitions
- Better responsive design for all devices
- Improved component architecture
- Better error and loading states

## Design Philosophy

1. **Minimalism** - No clutter, maximum whitespace
2. **Clarity** - Clear information hierarchy
3. **Consistency** - Unified design system
4. **Performance** - Smooth animations and fast rendering
5. **Accessibility** - Good contrast and touch targets
6. **Brand** - Buckeye scarlet (#BB0000) throughout

## Notes

- This is based on the Product Catalog Vertical Slice for Milestone 3
- No authentication, state management, or cart functionality included (yet)
- Styling uses CSS-in-JS for component-scoped styles
- Design follows Amazon-style minimalism but simpler and more elegant
- Fully responsive on desktop, tablet, and mobile

## Future Enhancements

- [ ] Functional search bar integration
- [ ] Product filtering and sorting
- [ ] Product reviews section
- [ ] Wishlist feature
- [ ] Shopping cart functionality
- [ ] Checkout flow
- [ ] User authentication
- [ ] Dark mode support
- [ ] Advanced analytics

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

- Uses GPU-accelerated `transform` for animations
- Soft shadows for better rendering performance
- Efficient CSS Grid layouts
- Lazy loading support (future enhancement)

---

**Design Status**: ✅ Complete Minimalist Refactor (v2.0)  
**Last Updated**: March 2026  
**Design Philosophy**: Clean, Modern, Elegant, Fast

