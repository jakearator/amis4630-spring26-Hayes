# Design System Quick Reference

## 🎨 Color Reference (Hex Values)

### Brand Colors
```
Buckeye Scarlet    #BB0000  ← Primary brand color (prices, CTAs)
Scarlet Dark       #9A0000  ← Hover state for buttons
Error Red          #991B1B  ← Error text color
```

### Backgrounds
```
Off-White          #FAFAFA  ← Main page background
White              #FFFFFF  ← Cards, containers
Light Gray         #F8F8F8  ← Image backgrounds
Image BG           #F5F5F5  ← Alternative image background
```

### Text Colors
```
Dark/Black         #1A1A1A  ← Headlines, primary text
Gray               #666666  ← Secondary text, subtitles
Light Gray         #999999  ← Labels, tertiary info
```

### Borders & Dividers
```
Light Border       #E5E5E5  ← Header border
Card Border        #F0F0F0  ← Card edges
```

### Shadows (Copy-Paste Ready)
```css
/* Default Card Shadow */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

/* Hover Card Shadow */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

/* Header Shadow */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
```

---

## 📏 Spacing Values (8px Grid System)

```
4px   = 0.5 units (micro spacing)
8px   = 1 unit (base unit)
16px  = 2 units (standard padding)
24px  = 3 units (common gap)
32px  = 4 units
40px  = 5 units (section padding)
48px  = 6 units (large spacing)
60px  = 7.5 units (hero padding)
80px  = 10 units (extra large)
```

### Common Usage
```
Component Padding:     16px
Section Padding V:     40px
Section Padding H:     20px
Grid/Flex Gap:         24px (desktop)
Grid/Flex Gap Mobile:  16px
Card Image Height:     240px
```

---

## 🔤 Typography Scale

### Font Family (System Stack)
```css
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
'Helvetica Neue', sans-serif;
```

### Sizes & Weights

| Usage | Size | Weight | Line Height |
|-------|------|--------|-------------|
| Hero Title (H1) | 44px | 700 | 1.2 |
| Page Title (H1) | 32px | 700 | 1.2 |
| Card Title | 15px | 600 | 1.4 |
| Body Text | 15px | 400 | 1.6 |
| Price Large | 36px | 700 | 1.0 |
| Price Normal | 18px | 700 | 1.0 |
| Label (Badge) | 12px | 600 | 1.2 |
| Caption | 13px | 400 | 1.5 |

### Font Weight Values
- 400 = Regular (body text)
- 600 = Semibold (headings, labels)
- 700 = Bold (titles, prices)

---

## 🎯 Component Specs

### Header
```css
height: auto (sticky)
padding: 16px 20px
position: sticky
top: 0
z-index: 100
background-color: white
border-bottom: 1px solid #E5E5E5
box-shadow: 0 1px 3px rgba(0,0,0,0.08)

/* Logo */
font-size: 20px
font-weight: 700
color: #BB0000

/* Search Input */
max-width: 500px
padding: 10px 16px
border: 1px solid #DDD
border-radius: 6px
transition: border-color 0.2s, box-shadow 0.2s

/* Search Focus */
border-color: #BB0000
box-shadow: 0 0 0 3px rgba(187,0,0,0.1)
```

### Product Card
```css
border-radius: 10px
border: 1px solid #F0F0F0
background-color: white
box-shadow: 0 1px 3px rgba(0,0,0,0.08)
transition: transform 0.2s ease, box-shadow 0.2s ease
height: 100%

/* On Hover */
transform: translateY(-3px)
box-shadow: 0 4px 12px rgba(0,0,0,0.12)

/* Image */
height: 240px
background-color: #F8F8F8
border-radius: 10px
overflow: hidden

/* Content Padding */
padding: 16px

/* Category Badge */
background-color: #F5F5F5
padding: 4px 10px
border-radius: 4px
font-size: 11px
font-weight: 600
color: #999
text-transform: uppercase

/* Price */
font-size: 18px
font-weight: 700
color: #BB0000
```

### Button
```css
padding: 12px 24px
font-size: 14px
font-weight: 600
background-color: #BB0000
color: white
border: none
border-radius: 6px
cursor: pointer
transition: background-color 0.2s ease, transform 0.2s ease

/* Hover */
background-color: #9A0000

/* Active */
transform: scale(0.98)
```

### Product Detail Page Card
```css
background-color: white
border-radius: 12px
box-shadow: 0 1px 3px rgba(0,0,0,0.08)
padding: 40px
display: grid
grid-template-columns: 1fr 1fr
gap: 48px

/* Mobile (< 768px) */
grid-template-columns: 1fr
gap: 32px
padding: 20px
```

---

## 📱 Responsive Breakpoints

```css
/* Desktop - Large Screens */
@media (min-width: 1200px) {
  /* 3-4 columns grid */
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

/* Laptop/Tablet */
@media (min-width: 1024px) and (max-width: 1199px) {
  /* 3 columns grid */
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 2 columns grid */
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px;
}

/* Mobile */
@media (max-width: 767px) {
  /* 1 column grid */
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 20px;
}
```

---

## ⚡ Transitions & Animations

### Standard Timing
```css
transition: all 0.2s ease;
transition: transform 0.2s ease;
transition: color 0.2s ease;
transition: background-color 0.2s ease;
```

### Common Patterns

**Hover Lift (Cards)**
```css
transform: translateY(-3px)
box-shadow: 0 4px 12px rgba(0,0,0,0.12);
```

**Button Interaction**
```css
/* Hover */
background-color: #9A0000;

/* Active/Press */
transform: scale(0.98);
```

**Smooth Scroll**
```css
html {
  scroll-behavior: smooth;
}
```

---

## 📐 Container Widths

```css
max-width: 1200px;
padding: 0 20px;  /* mobile-safe padding */
margin: 0 auto;   /* center */
```

---

## 🔄 Component Nesting Guide

**Product Card Structure**:
```
<Link to="/products/{id}">
  <div style={styles.card}>
    <div style={styles.imageContainer}>
      <Image... />
    </div>
    <div style={styles.content}>
      <span style={styles.category}>Category</span>
      <div style={styles.title}>Title</div>
      <div style={styles.seller}>Seller</div>
      <div style={styles.footer}>
        <span style={styles.price}>$Price</span>
      </div>
    </div>
  </div>
</Link>
```

**Product Grid Structure**:
```
<div style={styles.gridContainer}>
  <div style={styles.grid}>
    <ProductCard />
    <ProductCard />
    ...
  </div>
</div>
```

---

## 🎯 Copy-Paste Code Snippets

### Add Hover Effect to Any Element
```javascript
onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'translateY(-3px)';
  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = 'none';
  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
}}
```

### Create a Category Badge
```javascript
<span style={{
  display: 'inline-block',
  backgroundColor: '#F5F5F5',
  padding: '4px 10px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: '600',
  color: '#999',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  width: 'fit-content'
}}>
  Category
</span>
```

### Create a Price Display
```javascript
<span style={{
  fontSize: '18px',
  fontWeight: '700',
  color: '#BB0000'
}}>
  ${price}
</span>
```

### Create a Centered Container
```javascript
<div style={{
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 20px'
}}>
  {/* Content */}
</div>
```

---

## 🎨 Color Variables (Use in Your Code)

```javascript
const COLORS = {
  // Brand
  scarlet: '#BB0000',
  scarletDark: '#9A0000',
  
  // Backgrounds
  bgOffWhite: '#FAFAFA',
  bgWhite: '#FFFFFF',
  bgLightGray: '#F8F8F8',
  
  // Text
  textDark: '#1A1A1A',
  textGray: '#666666',
  textLightGray: '#999999',
  
  // Borders
  borderLight: '#E5E5E5',
  borderCard: '#F0F0F0',
  
  // Error
  errorRed: '#991B1B',
  errorBg: '#FEF2F2'
};
```

---

## 📋 Checklist for New Components

When creating new components, ensure:

- [ ] Colors use palette above
- [ ] Spacing uses 8px grid system
- [ ] Typography matches scale guide
- [ ] Transitions are 200ms ease
- [ ] Hover effects are implemented
- [ ] Responsive at all breakpoints
- [ ] Shadows follow 3-level system
- [ ] Border radius is 4-12px
- [ ] Touch targets are 44px+ minimum
- [ ] Component is modular and reusable
- [ ] Code follows existing patterns

---

## 🚀 Quick Implementation Tips

1. **Always use `transform` for animations** (GPU accelerated)
2. **Keep transitions under 300ms** (200ms ideal)
3. **Use soft shadows** (max 12px blur)
4. **Follow the 1200px container pattern** everywhere
5. **Use the base 8px grid** for all spacing
6. **Test hover states** on all interactive elements
7. **Check responsive behavior** at all breakpoints
8. **Maintain color consistency** (one scarlet color)
9. **Use semantic HTML** when possible
10. **Keep components pure and modular**

---

**Last Updated**: March 2026  
**Design Principal**: Minimalist, Modern, Clean, Fast  
**Brand Color**: Buckeye Scarlet #BB0000
