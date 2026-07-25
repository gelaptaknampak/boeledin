# BOELEDIN - Configuration Reference

Complete reference for all environment variables, configuration files, and settings.

## Environment Variables

### Required Variables

```env
# WordPress Configuration - MUST BE SET
WORDPRESS_API_URL=https://your-wordpress-site.com
# The base URL of your WordPress installation
# Example: https://blog.example.com or http://localhost/wordpress
```

### WordPress Authentication

```env
WORDPRESS_JWT_SECRET=your_jwt_secret_here
# Secret key from JWT Authentication plugin
# Generate in: WordPress Admin → Settings → JWT Authentication
```

### Optional WordPress Variables

```env
WORDPRESS_API_USER=your_wordpress_username
# WordPress admin username (optional, for automated operations)

WORDPRESS_API_PASSWORD=your_wordpress_password
# WordPress admin password (optional, for automated operations)
```

### Site Configuration

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
# Public URL of your website
# Used for: og:url in metadata, canonical URLs

NEXT_PUBLIC_SITE_NAME=BOELEDIN
# Display name of your website
# Used in: page titles, metadata
```

### Email Configuration (Optional)

#### SendGrid Method (Recommended)

```env
SENDGRID_API_KEY=sg_XXXXXXXXXXXXXXXXXXXXX
# API key from SendGrid dashboard
# Get from: SendGrid → Settings → API Keys

CONTACT_EMAIL_FROM=noreply@boeledin.com
# Email address for outgoing messages
# Must be verified in SendGrid

CONTACT_EMAIL_TO=admin@boeledin.com
# Email address to receive contact form submissions
```

#### SMTP Method (Alternative)

```env
SMTP_HOST=smtp.gmail.com
# SMTP server hostname

SMTP_PORT=587
# SMTP port (usually 587 for TLS, 465 for SSL)

SMTP_USER=your_email@gmail.com
# Email address for SMTP authentication

SMTP_PASSWORD=your_app_password
# Password or app-specific password
```

### Environment Type

```env
NODE_ENV=production
# Environment type: development, production, test
# Affects: logging, error messages, performance optimizations

NEXT_PUBLIC_APP_ENV=production
# Public environment indicator
# Used in: analytics, feature flags, client-side logic
```

## Configuration Files

### next.config.mjs

Main Next.js configuration file.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add custom configuration here
}

export default nextConfig
```

**Common modifications:**
- Image optimization
- Redirects and rewrites
- Headers and CORS
- Environment variables
- Build optimization

### tailwind.config.js

Tailwind CSS configuration.

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors here
      },
    },
  },
  plugins: [],
}
```

**Key sections:**
- `content` - Files to scan for classes
- `theme.extend` - Custom colors, fonts, spacing
- `plugins` - Additional plugins

### tsconfig.json

TypeScript configuration.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Key features:**
- `@/*` path alias for imports
- ES2020 target for modern JavaScript
- Strict type checking

### package.json

Project dependencies and scripts.

```json
{
  "name": "boeledin-cms",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^16.2.6",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  }
}
```

**Available scripts:**
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Run production build
- `pnpm lint` - Run linter

### .env.example

Environment variables template.

Copy to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### .env.local (not in repo)

Local environment variables for development.

**Never commit this file!** It's in `.gitignore` for security.

### .gitignore

Files and folders excluded from git.

```
node_modules/
.env
.env.local
.env.*.local
.next/
out/
dist/
```

## WordPress Configuration

### Required Plugins

1. **JWT Authentication for WP REST API**
   - Allows secure token-based authentication
   - Settings: WordPress → Settings → JWT Authentication
   - Generate JWT secret: Use `openssl rand -base64 32`

2. **Advanced Custom Fields (ACF)**
   - Adds custom fields to posts and pages
   - Create field groups for:
     - Products: price, brand, category
     - News: featured image, category
     - Pages: featured image, parent

3. **Custom Post Type UI** (Optional)
   - Create "Products" custom post type
   - No coding required

### WordPress REST API Endpoints

These endpoints are automatically available:

```
GET    /wp-json/wp/v2/posts            # Get blog posts
GET    /wp-json/wp/v2/pages            # Get pages
GET    /wp-json/wp/v2/products         # Get products (custom)
GET    /wp-json/jwt-auth/v1/token      # Get JWT token
```

### CORS Configuration

Add to WordPress to allow cross-origin requests:

**Option 1: Code Snippet Plugin**
```php
add_filter( 'rest_allowed_cors_origins', function() {
    return array(
        'http://localhost:3000',
        'https://yourdomain.com'
    );
});

add_filter( 'rest_authentication_errors', function( $result ) {
    if ( true === $result || is_wp_error( $result ) ) {
        return $result;
    }
    return true;
});
```

**Option 2: .htaccess** (Apache)
```apache
<FilesMatch "^(?!wp-admin).*\.php$">
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
</FilesMatch>
```

## Vercel Configuration

### Environment Variables on Vercel

Set these in Vercel Dashboard → Project Settings → Environment Variables:

```
Production:
WORDPRESS_API_URL=https://your-wordpress-domain.com
WORDPRESS_JWT_SECRET=your_secret
SENDGRID_API_KEY=your_sendgrid_key
CONTACT_EMAIL_FROM=noreply@yourdomain.com
CONTACT_EMAIL_TO=admin@yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=BOELEDIN
NODE_ENV=production

Preview (optional):
WORDPRESS_API_URL=https://staging-wordpress.com
NEXT_PUBLIC_SITE_URL=https://preview-domain.com
```

### Deployment Configuration

**vercel.json** (optional)

```json
{
  "buildCommand": "pnpm build",
  "framework": "nextjs",
  "regions": ["us-east-1"],
  "functions": {
    "api/**": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

## API Configuration

### Authentication Flow

1. **Login Request**
   ```
   POST /api/auth/login
   Body: { username, password }
   ```

2. **Token Generation**
   ```
   WordPress validates credentials
   Returns: JWT token
   Next.js stores in httpOnly cookie
   ```

3. **Authenticated Requests**
   ```
   All requests include:
   Cookie: wp_token=<jwt_token>
   Authorization: Bearer <jwt_token>
   ```

### CORS Headers

Required headers for API responses:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Database Configuration (WordPress)

### Required Tables

WordPress creates these automatically:

- `wp_posts` - Content (posts, pages, products)
- `wp_postmeta` - Post metadata and custom fields
- `wp_users` - User accounts
- `wp_options` - Site configuration
- `wp_terms` - Categories and tags

### Custom Post Types

Create in WordPress Admin or with code:

```php
// Products
register_post_type('products', array(
    'label' => 'Products',
    'public' => true,
    'rest_base' => 'products',
    'supports' => array('title', 'content', 'thumbnail', 'excerpt')
));

// News (use standard posts with custom category)
wp_insert_term('News', 'category', array('slug' => 'news'));
```

## Security Configuration

### JWT Secret Generation

```bash
# Generate secure JWT secret
openssl rand -base64 32

# Output example:
# abcDefGhIjKlMnOpQrStUvWxYz1234567890==
```

### HTTPS/SSL

**Vercel:** Automatic (free SSL certificate)

**Self-hosted:** Use Let's Encrypt
```bash
# On server
sudo certbot certonly --webroot -w /var/www/html -d yourdomain.com
```

### Password Requirements

- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Unique for each environment

## Performance Configuration

### Caching Headers

Set in `next.config.mjs`:

```javascript
headers: async () => {
  return [
    {
      source: '/api/wordpress/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, s-maxage=3600' }
      ]
    }
  ]
}
```

### Image Optimization

Configure in components:

```tsx
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={true}
  placeholder="blur"
/>
```

## Monitoring & Logging

### Vercel Analytics

Enable in Vercel Dashboard:
- Web Vitals
- Performance metrics
- Error tracking

### Error Logging

Configure in API routes:

```typescript
console.error('[API] Error:', error.message)
console.warn('[API] Warning:', message)
```

### WordPress Debug

Enable in `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

## Backup Configuration

### WordPress Backup

**Schedule:** Weekly

**Include:**
- Database (`wp_*` tables)
- wp-content folder (media, plugins)
- wp-config.php

**Tools:**
- UpdraftPlus (plugin)
- ManageWP (service)
- Manual mysqldump

### Code Backup

Git repository automatically backed up by GitHub.

## Update Configuration

### Auto-Update Settings

**WordPress Plugins**
- Security patches: Auto
- Minor updates: Auto
- Major updates: Manual

**Next.js Dependencies**
```bash
# Check for updates
pnpm outdated

# Update all
pnpm update

# Update specific
pnpm up next react
```

## Staging vs Production

### Development (.env.local)
```env
NODE_ENV=development
WORDPRESS_API_URL=http://localhost/wordpress
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Staging (Vercel Preview)
```env
NODE_ENV=production
WORDPRESS_API_URL=https://staging.wordpress.com
NEXT_PUBLIC_SITE_URL=https://staging-domain.vercel.app
```

### Production (Vercel)
```env
NODE_ENV=production
WORDPRESS_API_URL=https://wordpress.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Troubleshooting Configuration

### "env var not found"
→ Check `.env.local` file exists and has the variable

### "CORS error"
→ Add origin to WordPress CORS configuration

### "JWT invalid"
→ Verify JWT secret matches WordPress setting

### "Email not sending"
→ Check SendGrid API key is correct and verified

## Quick Reference

| Task | File | Variable |
|------|------|----------|
| Change WordPress URL | .env.local | WORDPRESS_API_URL |
| Change site name | .env.local | NEXT_PUBLIC_SITE_NAME |
| Setup emails | .env.local | SENDGRID_API_KEY |
| Customize styling | tailwind.config.js | theme.extend |
| Add npm package | package.json | dependencies |
| Configure API | next.config.mjs | API configuration |
| Update types | lib/types.ts | TypeScript interfaces |

---

**For setup help:** See [QUICKSTART.md](./QUICKSTART.md)  
**For deployment:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
