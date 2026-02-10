# Project Structure

## Pages

### Main Pages
- `/` - Homepage with article and product previews
- `/blog` - Blog listing page with all articles
- `/blog/[slug]` - Individual article detail pages
- `/shop` - Shop page with all products
- `/shop/[id]` - Individual product detail pages
- `/about` - About page with team and company information

## Components

### Reusable Components
- `Header.tsx` - Global navigation header (sticky)
- `ArticleCard.tsx` - Blog article preview card
- `ProductCard.tsx` - Product preview card

## Data

### Local JSON Files
- `data/articles.json` - Sample blog articles
- `data/products.json` - Sample products

## Features

### Navigation
- Sticky header with active state indication
- Client-side navigation with Next.js Link
- Responsive mobile-friendly design

### Blog System
- Article listing with grid layout
- Dynamic article detail pages with full content
- Related articles section
- Static generation for all articles
- Custom 404 page for non-existent articles

### Shop System
- Product listing with filtering UI
- Dynamic product detail pages
- Related products section
- Product ratings and reviews
- Stock status indication
- Static generation for all products
- Custom 404 page for non-existent products

### Design
- Modern, clean UI with Tailwind CSS
- Full dark mode support
- Responsive grid layouts
- Smooth hover animations
- Accessible components
- SEO optimized with dynamic metadata

## Future Enhancements

### Data Fetching
When ready to connect to external APIs:
1. Replace JSON imports with `fetch()` or your data fetching library
2. Add loading states and error handling
3. Implement caching strategies
4. The component structure remains the same

### Additional Features
- Search functionality
- Filtering and sorting
- Shopping cart
- User authentication
- Comments system
- Newsletter subscription
