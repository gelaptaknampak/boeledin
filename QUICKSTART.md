# BOELEDIN CMS - Quick Start Guide

Panduan cepat untuk mulai menggunakan website BOELEDIN dengan WordPress CMS.

## ⚡ 5 Menit Setup

### 1. Persiapan Awal
```bash
# Clone atau download project
cd /vercel/share/v0-project

# Install dependencies
pnpm install
```

### 2. Setup Environment
```bash
# Copy environment template
cp .env.example .env.local

# Generate NextAuth secret
openssl rand -base64 32
# Copy hasil ke NEXTAUTH_SECRET di .env.local
```

### 3. Update .env.local
```env
NEXT_PUBLIC_WORDPRESS_URL=http://localhost/wordpress
WORDPRESS_JWT_TOKEN=your_wp_jwt_token_here
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Jalankan
```bash
pnpm dev
```

Buka http://localhost:3000 di browser ✓

## 📖 Project Structure

```
/components        - React components
/app              - Next.js pages & routes
/lib              - Utilities & API clients
/public           - Static assets
/styles           - Global styles
```

## 🌐 Available Pages

### Public Pages
- **Home** - http://localhost:3000/
- **Products** - http://localhost:3000/products
- **News** - http://localhost:3000/news
- **About** - http://localhost:3000/about
- **Contact** - http://localhost:3000/contact

### Admin Pages (Protected)
- **Login** - http://localhost:3000/admin/login
- **Dashboard** - http://localhost:3000/admin/dashboard
- **Products Mgmt** - http://localhost:3000/admin/products
- **News Mgmt** - http://localhost:3000/admin/news
- **Pages Mgmt** - http://localhost:3000/admin/pages
- **Settings** - http://localhost:3000/admin/settings

## 🔐 Admin Login

Demo credentials untuk testing:
```
Username: admin
Password: password
```

## 🔗 WordPress Integration

Untuk connect ke WordPress, ikuti langkah:

### A. Plugin Installation (di WordPress)
1. Install plugin berikut di WordPress:
   - JWT Authentication for WP-API
   - Advanced Custom Fields
   - Custom Post Type UI

2. Create custom post types:
   - `products`
   - `news`

### B. Get WordPress JWT Token
```bash
curl -X POST http://localhost/wordpress/wp-json/jwt-auth/v1/token \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'
```

Copy token ke `WORDPRESS_JWT_TOKEN` di `.env.local`

### C. Create Sample Content
1. Buat 5+ products di WordPress
2. Buat 5+ news articles
3. Upload featured images

### D. Verify Connection
```bash
# Test products endpoint
curl http://localhost/wordpress/wp-json/wp/v2/products

# Verify di browser
http://localhost:3000/products
```

## 🛠️ Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm tsc --noEmit

# View installed versions
pnpm list next react
```

## 📱 Responsive Design

Website automatically responsive untuk:
- Mobile: 375px - 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+

Test dengan: Developer Tools → Toggle Device Toolbar (F12 → Ctrl+Shift+M)

## 🎨 Theme Customization

### Colors
Edit di `app/globals.css` untuk mengubah:
- Primary color (blue)
- Secondary color (slate)
- Background colors
- Accent colors

### Fonts
Fonts dikonfigurasi di `app/layout.tsx` menggunakan Next.js font optimization.

## 📋 Common Tasks

### Add New Product
1. Go to WordPress Admin
2. Products → Add New
3. Fill in details
4. Add featured image
5. Fill custom fields
6. Publish
7. Product muncul otomatis di `/products`

### Add New Article
1. Go to WordPress Admin
2. News → Add New
3. Write article
4. Add featured image
5. Fill metadata
6. Publish
7. Article muncul otomatis di `/news`

### Update Contact Info
1. Go to `/admin/settings` (login required)
2. Update company info
3. Save changes
4. Changes reflect on `/contact` page

### Edit Navigation Links
Edit di `components/Navigation.tsx` - array `navLinks`

### Change Colors
Edit Tailwind classes di component files, atau customize di `app/globals.css`

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push ke GitHub
git push

# Deploy otomatis via Vercel
# Atau: vercel
```

### Self-Hosted
```bash
# Build
pnpm build

# Start (requires Node.js)
pnpm start
```

### Environment untuk Production
```env
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-domain.com
WORDPRESS_JWT_TOKEN=your_production_token
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.com
```

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
# Install dependencies lagi
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### WordPress API tidak connect
- Cek `NEXT_PUBLIC_WORDPRESS_URL` di `.env.local`
- Verify WordPress REST API enabled
- Test endpoint di browser: `http://your-wp/wp-json`

### Admin login tidak bekerja
- Verify `NEXTAUTH_SECRET` di `.env.local`
- Check NextAuth setup di `lib/auth.ts`
- Use demo account untuk testing

### Styling tidak muncul
```bash
# Rebuild
rm -rf .next
pnpm build
pnpm dev
```

### Products/News tidak muncul
1. Verify di WordPress: `wp-json/wp/v2/products`
2. Check products published
3. Verify custom fields exist

## 📚 More Resources

- **Main Docs**: `README.md`
- **WordPress Setup**: `WORDPRESS_SETUP.md`
- **Setup Checklist**: `SETUP_CHECKLIST.md`
- **Project Summary**: `PROJECT_SUMMARY.md`

## 🎯 Next Steps

1. **Setup WordPress** (30 min)
   - Install plugins
   - Create post types
   - Generate JWT token

2. **Create Content** (1-2 hour)
   - Add products
   - Add news articles
   - Test data

3. **Customize** (30 min)
   - Update colors
   - Update company info
   - Update contact details

4. **Deploy** (15 min)
   - Push to GitHub
   - Deploy to Vercel
   - Setup domain

## 📞 Support

If stuck:
1. Check error message carefully
2. Search in documentation files
3. Check `.env.local` configuration
4. Verify WordPress setup
5. Check browser console (F12)
6. Check server logs

---

**Ready to launch?** Follow SETUP_CHECKLIST.md untuk complete verification sebelum production.

**Questions?** Refer ke README.md untuk detailed documentation.
