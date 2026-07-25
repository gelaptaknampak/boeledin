# BOELEDIN CMS Setup Checklist

Gunakan checklist ini untuk memastikan semua komponen properly configured sebelum launch.

## Pre-Setup Requirements

- [ ] WordPress 5.9+ installed
- [ ] PHP 7.4+ running
- [ ] MySQL/MariaDB database configured
- [ ] Admin access ke WordPress panel
- [ ] FTP/SSH akses ke server
- [ ] Domain name configured (atau localhost untuk testing)

## Phase 1: WordPress Plugin Installation

### JWT Authentication Setup
- [ ] Install "JWT Authentication for WP-REST API"
- [ ] Activate plugin
- [ ] Go to Settings → JWT Authentication
- [ ] Enable JWT Authentication checkbox
- [ ] Generate secret key: `openssl rand -base64 32`
- [ ] Copy secret key to plugin settings
- [ ] Test token generation:
  ```bash
  curl -X POST http://your-wordpress-url/wp-json/jwt-auth/v1/token
  ```

### Advanced Custom Fields
- [ ] Install "Advanced Custom Fields"
- [ ] Activate plugin
- [ ] Go to ACF → Settings
- [ ] Enable "REST API Support"
- [ ] Create test field and verify in API

### Custom Post Type Setup
- [ ] Install "Custom Post Type UI" OR use code-based approach
- [ ] Create `products` post type:
  - [ ] Show in REST API
  - [ ] Has Archive
  - [ ] Supports: Title, Editor, Thumbnail, Custom Fields
- [ ] Create `news` post type:
  - [ ] Show in REST API
  - [ ] Has Archive
  - [ ] Supports: Title, Editor, Thumbnail, Custom Fields
- [ ] Verify post types di WordPress admin

## Phase 2: Custom Fields Configuration

### Products Field Group
- [ ] Create ACF field group "Product Details"
- [ ] Assign to `products` post type
- [ ] Create fields:
  - [ ] `brand` - Text field
  - [ ] `category` - Select/Taxonomy field
  - [ ] `price` - Number field
  - [ ] `image` - Image field
  - [ ] `specifications` - Repeater with spec_name & spec_value
  - [ ] `description` - Textarea field
- [ ] Test field appearance di product creation page

### News Field Group
- [ ] Create ACF field group "News Details"
- [ ] Assign to `news` post type
- [ ] Create fields:
  - [ ] `author_name` - Text field
  - [ ] `published_date` - Date Picker
  - [ ] `featured_image` - Image field
  - [ ] `content` - WYSIWYG Editor
- [ ] Test field appearance di news creation page

### Pages Field Group
- [ ] Create ACF field group "Page Hero"
- [ ] Assign to `page` post type
- [ ] Create fields:
  - [ ] `hero_title` - Text field
  - [ ] `hero_subtitle` - Textarea
  - [ ] `hero_image` - Image field
  - [ ] `hero_cta_text` - Text field
  - [ ] `hero_cta_url` - URL field

## Phase 3: Content Creation

### Sample Products
- [ ] Create 8+ sample products with:
  - [ ] Title & slug
  - [ ] Featured image
  - [ ] All custom fields filled
  - [ ] Publish status
- [ ] Verify each product di WordPress REST API:
  ```
  GET /wp-json/wp/v2/products?acf=true
  ```

### Sample News Articles
- [ ] Create 6+ sample articles with:
  - [ ] Title & slug
  - [ ] Featured image
  - [ ] Content/excerpt
  - [ ] All custom fields filled
  - [ ] Category/tag assigned
  - [ ] Publish status
- [ ] Verify di WordPress REST API:
  ```
  GET /wp-json/wp/v2/news?acf=true
  ```

### Sample Pages
- [ ] Publish/update key pages:
  - [ ] Home page (with hero fields)
  - [ ] About Us page
  - [ ] Privacy Policy
  - [ ] Terms & Conditions

## Phase 4: WordPress Configuration

### Permalinks Setup
- [ ] Go to Settings → Permalinks
- [ ] Change to: "Post name" OR "Custom Structure: /%postname%/"
- [ ] Save changes
- [ ] Verify `.htaccess` updated
- [ ] Test URL structure works

### REST API Security
- [ ] Verify JWT token generation working
- [ ] Test authenticated API requests
- [ ] Configure CORS headers (if frontend on different domain)
- [ ] Disable unnecessary REST endpoints if needed

### General Settings
- [ ] Verify Site Title: "BOELEDIN Indonesia"
- [ ] Set Tagline: "Solusi Tampilan Digital"
- [ ] Set Site Language: Indonesian (Indonesia)
- [ ] Verify WordPress Address & Site Address correct
- [ ] Enable comment moderation (optional)

## Phase 5: Next.js Frontend Setup

### Environment Configuration
- [ ] Copy `.env.example` → `.env.local`
- [ ] Set `NEXT_PUBLIC_WORDPRESS_URL` to your WordPress URL
- [ ] Generate `NEXTAUTH_SECRET`:
  ```bash
  openssl rand -base64 32
  ```
- [ ] Set generated value in `.env.local`
- [ ] Set `NEXTAUTH_URL` to frontend URL
- [ ] Verify all env vars set

### Local Development
- [ ] Run `pnpm install` (if not done)
- [ ] Run `pnpm dev`
- [ ] Open http://localhost:3000
- [ ] Verify home page loads
- [ ] Check for console errors

### Test API Integration
- [ ] Navigate to `/products` page
- [ ] Verify products data loads
- [ ] Navigate to `/news` page
- [ ] Verify news data loads
- [ ] Test search functionality
- [ ] Test filter functionality

### Admin Dashboard Testing
- [ ] Navigate to `/admin/login`
- [ ] Use demo credentials: admin / password
- [ ] Verify login works
- [ ] Access dashboard at `/admin/dashboard`
- [ ] Verify statistics display
- [ ] Access each management section:
  - [ ] `/admin/products`
  - [ ] `/admin/news`
  - [ ] `/admin/pages`
  - [ ] `/admin/settings`

## Phase 6: Form Testing

### Contact Form
- [ ] Navigate to `/contact`
- [ ] Fill form with valid data
- [ ] Submit form
- [ ] Verify success message
- [ ] Test validation:
  - [ ] Empty name field
  - [ ] Invalid email
  - [ ] Empty message
- [ ] Verify error messages display

### Search & Filters
- [ ] Test product search by name/model
- [ ] Test product filter by brand
- [ ] Test product filter by category
- [ ] Test combined filters work
- [ ] Test reset filters button

## Phase 7: Theme & Styling Verification

### Color Scheme
- [ ] Verify primary colors consistent
- [ ] Check light/dark mode toggle works
- [ ] Verify proper contrast ratios
- [ ] Check all text readable

### Responsive Design
- [ ] Test on mobile (375px width):
  - [ ] Navigation bar responsive
  - [ ] Images scale properly
  - [ ] Forms usable
  - [ ] No horizontal scroll
- [ ] Test on tablet (768px width):
  - [ ] Layout adjusts properly
  - [ ] Grid columns adjust
- [ ] Test on desktop (1920px width):
  - [ ] Full width content looks good

### Performance
- [ ] Check page load time (target < 3s)
- [ ] Verify images optimized
- [ ] Check CSS/JS bundle sizes
- [ ] Run Lighthouse audit:
  - [ ] Performance > 80
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90
  - [ ] SEO > 90

## Phase 8: Security Verification

### Authentication
- [ ] Admin login requires valid credentials
- [ ] Logged-out users redirected to login
- [ ] Session timeout working
- [ ] Logout button functions correctly
- [ ] JWT tokens expire properly

### Data Protection
- [ ] Forms validate input
- [ ] No sensitive data in console logs
- [ ] CORS properly configured
- [ ] API keys not exposed in frontend code

## Phase 9: Pre-Production Checklist

### Code Quality
- [ ] No console errors in browser
- [ ] No TypeScript errors: `pnpm tsc --noEmit`
- [ ] No lint errors: `pnpm lint` (if configured)
- [ ] All images have alt text
- [ ] All links work correctly

### SEO & Metadata
- [ ] All pages have proper titles
- [ ] All pages have descriptions
- [ ] Meta tags properly set
- [ ] sitemap.xml accessible
- [ ] robots.txt configured

### Backup & Data
- [ ] WordPress database backed up
- [ ] Files backed up
- [ ] Backup restoration tested
- [ ] Git repository committed

## Phase 10: Deployment Preparation

### Production Environment Setup
- [ ] Domain name configured
- [ ] SSL certificate installed
- [ ] Database migrated to production
- [ ] WordPress moved to production server
- [ ] Next.js app configured for production

### Final Testing on Production
- [ ] All pages accessible
- [ ] All products/news display correctly
- [ ] Admin dashboard functional
- [ ] Contact form sends emails
- [ ] Email notifications working
- [ ] Search/filters functional

### Monitoring Setup
- [ ] Error logging configured
- [ ] Uptime monitoring enabled
- [ ] Performance monitoring setup
- [ ] Backup automation configured
- [ ] Security scanning enabled

## Post-Launch

### Day 1 Monitoring
- [ ] Monitor error logs
- [ ] Check page load times
- [ ] Verify all integrations working
- [ ] Test admin functionality
- [ ] Monitor user feedback

### Week 1 Tasks
- [ ] Review analytics
- [ ] Check for broken links
- [ ] Verify email deliverability
- [ ] Test all admin functions
- [ ] Update content as needed

### Ongoing Maintenance
- [ ] Keep WordPress updated
- [ ] Keep plugins updated
- [ ] Monitor security
- [ ] Regular backups
- [ ] Update content regularly
- [ ] Monitor performance

## Quick Reference

### Important URLs
- WordPress Admin: http://your-domain/wp-admin
- REST API: http://your-domain/wp-json
- Frontend: http://your-domain
- Admin Dashboard: http://your-domain/admin/dashboard

### Useful Commands
```bash
# Development
pnpm dev

# Build
pnpm build

# Start production
pnpm start

# Type check
pnpm tsc --noEmit

# Lint (if configured)
pnpm lint

# Generate JWT secret
openssl rand -base64 32
```

### API Endpoints
```
GET    /wp-json/wp/v2/products
GET    /wp-json/wp/v2/news
POST   /wp-json/jwt-auth/v1/token
GET    /wp-json/jwt-auth/v1/validate-token
```

## Support & Troubleshooting

If issues occur:

1. Check `.env.local` configuration
2. Verify WordPress plugins installed
3. Test API endpoints in browser
4. Check browser console for errors
5. Review WordPress error logs
6. Check Next.js build output

Refer to:
- `README.md` - General documentation
- `WORDPRESS_SETUP.md` - WordPress specific setup
- Next.js docs: https://nextjs.org/docs

---

**Completion Target**: All items checked before production launch
**Estimated Time**: 2-4 hours for complete setup
**Last Updated**: February 2024
