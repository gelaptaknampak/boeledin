# BOELEDIN Website - Next.js 16 dengan WordPress CMS Integration

Website responsif multi-halaman untuk BOELEDIN dengan integrasi WordPress CMS penuh untuk manajemen konten dan dashboard admin built-in.

## Fitur Utama

✅ **Website Responsif**
- Halaman Home dengan hero section
- Katalog Produk dengan filtering  
- Daftar Berita & Artikel
- Halaman About Us
- Halaman Contact dengan form inquiry
- Navigation & Footer responsif

✅ **Admin Dashboard**
- Dashboard dengan statistik konten
- Manajemen Produk (CRUD)
- Manajemen Berita (CRUD)
- Manajemen Halaman Statis
- Pengaturan Umum Website
- Integrasi WordPress CMS API

✅ **Teknologi**
- Next.js 16 dengan App Router
- React 19
- TypeScript
- Tailwind CSS v4
- NextAuth.js untuk authentication
- Axios untuk HTTP requests
- React Hook Form dengan Zod validation
- Zustand untuk state management
- Lucide React untuk icons

## Quick Start

### 1. Instalasi Dependencies

```bash
cd /vercel/share/v0-project
pnpm install
```

### 2. Setup Environment Variables

Buat file `.env.local`:

```env
# WordPress Configuration
NEXT_PUBLIC_WORDPRESS_URL=http://localhost/wordpress
WORDPRESS_JWT_TOKEN=your_jwt_token_here

# NextAuth Configuration  
NEXTAUTH_SECRET=openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

### 3. Jalankan Development Server

```bash
pnpm dev
```

Server akan berjalan di http://localhost:3000

## Struktur Project

```
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Home page
│   ├── about/page.tsx           # About page
│   ├── products/page.tsx        # Products catalog
│   ├── news/page.tsx            # News listing
│   ├── contact/page.tsx         # Contact form
│   ├── admin/
│   │   ├── login/page.tsx       # Admin login
│   │   ├── dashboard/page.tsx   # Dashboard
│   │   ├── products/page.tsx    # Manage products
│   │   ├── news/page.tsx        # Manage news
│   │   ├── pages/page.tsx       # Manage pages
│   │   └── settings/page.tsx    # Settings
│   └── layout.tsx               # Root layout
├── components/
│   ├── Navigation.tsx           # Top navigation bar
│   ├── Footer.tsx               # Footer section
│   ├── Providers.tsx            # Providers wrapper
│   ├── home/                    # Home page components
│   │   ├── HeroSection.tsx
│   │   ├── SpecStrip.tsx
│   │   ├── ServicesSection.tsx
│   │   └── CtaSection.tsx
│   ├── products/                # Products page components
│   │   ├── ProductsHero.tsx
│   │   └── ProductsGrid.tsx
│   ├── news/                    # News page components
│   │   ├── NewsHero.tsx
│   │   └── NewsGrid.tsx
│   ├── about/                   # About page components
│   │   ├── AboutHero.tsx
│   │   ├── AboutStory.tsx
│   │   └── AboutValues.tsx
│   ├── contact/                 # Contact page components
│   │   ├── ContactHero.tsx
│   │   └── ContactForm.tsx
│   └── admin/                   # Admin dashboard components
│       ├── AdminLayout.tsx
│       ├── DashboardOverview.tsx
│       ├── ProductsManagement.tsx
│       ├── NewsManagement.tsx
│       ├── PagesManagement.tsx
│       └── SettingsPage.tsx
├── lib/
│   ├── wordpress.ts             # WordPress API client
│   ├── auth.ts                  # NextAuth configuration
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # Utility functions
├── public/                      # Static assets
├── styles/                      # Global styles
└── next.config.mjs             # Next.js configuration
```

## Routing Map

### Public Pages
- `/` - Home
- `/about` - About Us
- `/products` - Product Catalog
- `/news` - News & Insights
- `/contact` - Contact Us

### Admin Routes (Protected)
- `/admin/login` - Admin Login
- `/admin/dashboard` - Dashboard
- `/admin/products` - Manage Products
- `/admin/news` - Manage News
- `/admin/pages` - Manage Pages
- `/admin/settings` - Site Settings

## WordPress CMS Integration

Untuk mengintegrasikan dengan WordPress, ikuti langkah berikut:

### 1. Plugin yang Diperlukan
- **REST API** - Built-in di WordPress 5.0+
- **JWT Authentication for WP-API** - Untuk autentikasi token
- **Advanced Custom Fields (ACF)** - Untuk custom fields produk & berita

### 2. Custom Post Types
Buat custom post type di WordPress:

```php
// Products
register_post_type('products', array(
  'labels' => array('name' => 'Products'),
  'show_in_rest' => true,
  'supports' => array('title', 'editor', 'thumbnail')
));

// News
register_post_type('news', array(
  'labels' => array('name' => 'News'),
  'show_in_rest' => true,
  'supports' => array('title', 'editor', 'thumbnail')
));
```

### 3. ACF Fields
Tambahkan field groups untuk:
- **Products**: brand, category, price, image, specifications
- **News**: author_name, published_date, featured_image
- **Pages**: hero_title, hero_subtitle, content_sections

### 4. API Endpoints Tersedia

```
GET  /wp-json/wp/v2/posts        - Get all posts
GET  /wp-json/wp/v2/products     - Get all products
GET  /wp-json/wp/v2/news         - Get all news
POST /wp-json/wp/v2/posts        - Create post (authenticated)
PUT  /wp-json/wp/v2/posts/{id}   - Update post (authenticated)
DELETE /wp-json/wp/v2/posts/{id} - Delete post (authenticated)
```

## Admin Authentication

### Demo Account
- Username: `admin`
- Password: `password`

### Real Authentication
Untuk autentikasi real dengan WordPress:

1. Konfigurasi JWT di WordPress
2. Generate token: `POST /wp-json/jwt-auth/v1/token`
3. Setup NextAuth untuk OAuth/Custom provider

## Data Synchronization

Semua data dari halaman public disinkronkan **real-time** dengan WordPress:

- **Products** - Diambil dari post type `products` di WordPress
- **News** - Diambil dari post type `news` atau kategori
- **Pages** - Diambil dari post type `page` di WordPress
- **Contact Form** - Dikirim ke email dan disimpan di database

## Theme & Styling

### Color System
- Primary: Blue (modern, professional)
- Secondary: Slate gray (neutral, clean)
- Accent: Light blue (highlights)
- Background: White (light) / Dark gray (dark)

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px

### Typography
- Headings: Bold, high contrast
- Body: 14-16px, readable line-height
- Monospace: For technical content

## Features Details

### Product Catalog
- Grid layout dengan 3 kolom desktop
- Filter by brand & category
- Search functionality
- Product specifications display
- Responsive mobile view (2 kolom tablet, 1 kolom mobile)

### News Management
- Card-based layout
- Category badges
- Read time estimation
- Date display
- Hover effects & transitions

### Contact Form
- Full validation dengan Zod schema
- Fields: name, email, phone, company, interest, message
- Toast notifications
- Auto-reset setelah submit

### Admin Dashboard
- Overview cards dengan statistics
- Recent items table
- Quick actions (Edit/Delete)
- WordPress connection status
- Settings management

## Performance Optimizations

- Next.js Image Optimization
- Server-Side Rendering (SSR)
- Static Generation (SSG) untuk pages statis
- CSS-in-JS minification
- Code splitting & lazy loading
- Caching with SWR

## Security

- NextAuth.js for session management
- Protected admin routes
- JWT token authentication
- Input validation & sanitization
- CORS handling for WordPress API
- SQL injection prevention (parameterized queries)

## Deployment

### Vercel (Recommended)
```bash
vercel
```

### Self-Hosted
1. Build: `pnpm build`
2. Start: `pnpm start`
3. Gunakan PM2 atau similar untuk process management

### Environment Setup
```env
NODE_ENV=production
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-domain.com
WORDPRESS_JWT_TOKEN=your_production_token
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://your-domain.com
```

## Troubleshooting

### WordPress API Connection Error
- Verify `NEXT_PUBLIC_WORDPRESS_URL` di `.env.local`
- Check WordPress CORS settings
- Enable REST API di WordPress

### Login Tidak Bekerja
- Verify JWT Authentication plugin di WordPress
- Check `WORDPRESS_JWT_TOKEN` value
- Verify admin credentials di WordPress

### Styling Issues
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `pnpm build`
- Check Tailwind CSS configuration

## Development Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Production start
pnpm start

# Lint
pnpm lint

# Type check
pnpm tsc --noEmit
```

## Next Steps

1. **Setup WordPress Instance** - Deploy WordPress dengan required plugins
2. **Configure Environment Variables** - Update `.env.local` dengan WordPress URL
3. **Create Custom Post Types** - Setup products & news post types
4. **Add ACF Fields** - Setup custom fields untuk content
5. **Test API Endpoints** - Verify WordPress API responses
6. **Deploy to Vercel** - Push ke production

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## License

Proprietary - BOELEDIN Indonesia
