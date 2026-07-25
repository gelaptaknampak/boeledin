# WordPress CMS Setup Guide untuk BOELEDIN

Panduan lengkap untuk setup WordPress sebagai backend CMS untuk website BOELEDIN.

## Prasyarat

- WordPress 5.9 atau lebih baru
- PHP 7.4 atau lebih baru
- Database MySQL/MariaDB
- Plugin Manager akses
- FTP/SSH akses (untuk upload plugin)

## Step 1: Install WordPress

Jika belum install WordPress, download dari [wordpress.org](https://wordpress.org) dan follow installation wizard.

## Step 2: Install Required Plugins

Login ke WordPress Admin Dashboard dan install plugin berikut:

### 2.1 JWT Authentication for WP-API
- URL: https://github.com/Fulcrum-Media/jwt-authentication-for-wp-rest-api
- Atau cari di WordPress plugin repository
- Fungsi: Token-based authentication untuk REST API

**Konfigurasi:**
1. Go to Settings → JWT Authentication
2. Enable JWT Authentication
3. Set JWT Secret Key (gunakan hasil `openssl rand -base64 32`)
4. Save

### 2.2 Advanced Custom Fields (ACF) Pro
- URL: https://www.advancedcustomfields.com
- Atau versi free dari WordPress plugin repository
- Fungsi: Create custom fields untuk Products & News

### 2.3 Custom Post Type UI (Untuk membuat custom post types)
- URL: https://wordpress.org/plugins/custom-post-type-ui/
- Alternatif: Code custom post types di `functions.php`

## Step 3: Create Custom Post Types

### Opsi A: Menggunakan Plugin Custom Post Type UI

1. Go to Custom Post Type UI → Add/Edit Post Types
2. Create `products` post type:
   - Name: Products
   - Slug: products
   - Show in REST: Yes
   - Has Archive: Yes
   - Supports: Title, Editor, Thumbnail, Custom Fields

3. Create `news` post type:
   - Name: News
   - Slug: news
   - Show in REST: Yes
   - Has Archive: Yes
   - Supports: Title, Editor, Thumbnail, Custom Fields

### Opsi B: Kode Manual di functions.php

Tambahkan ini ke `wp-content/themes/your-theme/functions.php`:

```php
// Register Products Post Type
function boeledin_register_products_cpt() {
    register_post_type('products', array(
        'labels' => array(
            'name' => 'Products',
            'singular_name' => 'Product',
        ),
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'menu_icon' => 'dashicons-cart',
    ));
}
add_action('init', 'boeledin_register_products_cpt');

// Register News Post Type
function boeledin_register_news_cpt() {
    register_post_type('news', array(
        'labels' => array(
            'name' => 'News',
            'singular_name' => 'News Article',
        ),
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'menu_icon' => 'dashicons-format-aside',
    ));
}
add_action('init', 'boeledin_register_news_cpt');
```

## Step 4: Setup Custom Fields dengan ACF

### 4.1 Product Fields

1. Go to ACF → Field Groups
2. Create new field group `Product Details`
3. Add fields:

```
- brand (Text)
- category (Select/Taxonomy)
- price (Number)
- image (Image)
- specifications (Repeater)
  - spec_name (Text)
  - spec_value (Text)
- description (Textarea)
```

### 4.2 News Fields

1. Create field group `News Details`
2. Add fields:

```
- author_name (Text)
- published_date (Date Picker)
- featured_image (Image)
- article_excerpt (Textarea)
- content (WYSIWYG Editor)
```

### 4.3 Page Fields (untuk hero sections)

1. Create field group `Page Hero`
2. Add fields:

```
- hero_title (Text)
- hero_subtitle (Textarea)
- hero_image (Image)
- hero_cta_text (Text)
- hero_cta_url (URL)
```

## Step 5: Generate JWT Token

1. Install plugin: JWT Authentication for WP-API
2. Open command line/terminal
3. Navigate ke WordPress root directory
4. Generate secret key:

```bash
openssl rand -base64 32
```

5. Copy hasilnya ke:
   - WordPress: Settings → JWT Authentication → Secret Key
   - Next.js: `.env.local` → `WORDPRESS_JWT_TOKEN`

6. Test API token generation:

```bash
curl -X POST http://localhost/wordpress/wp-json/jwt-auth/v1/token \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_password"
  }'
```

Response akan berisi token yang bisa digunakan untuk authenticated requests.

## Step 6: Setup Permalinks

1. Go to Settings → Permalinks
2. Change to: `Post name` atau `Custom Structure: /%postname%/`
3. Save changes
4. Verify: Products harus accessible di `/products/`

## Step 7: Configure CORS (Jika Frontend di Domain Berbeda)

Tambahkan ke `wp-content/themes/your-theme/functions.php`:

```php
function boeledin_rest_headers() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
add_action('rest_api_init', 'boeledin_rest_headers');
```

## Step 8: Create Sample Content

### Sample Products

1. Go to Products → Add New
2. Title: `Ultra-Slim 4K Commercial Display`
3. Slug: `ultra-slim-4k`
4. Fill custom fields:
   - brand: FBI
   - category: Digital Signage
   - price: 5000000
   - image: Upload gambar
   - specifications: P3.2 Resolution, 700 nits brightness

5. Publish

Ulangi untuk produk lainnya sesuai katalog.

### Sample News Articles

1. Go to News → Add New
2. Title: `Apa Itu Digital Signage dan Mengapa Bisnis Anda Membutuhkannya`
3. Slug: `digital-signage-guide`
4. Content: Tambahkan artikel panjang
5. Fill custom fields:
   - author_name: Admin
   - published_date: 2024-01-15
   - featured_image: Upload gambar

6. Publish

## Step 9: Test API Endpoints

Test dari command line atau Postman:

```bash
# Get all products
curl http://localhost/wordpress/wp-json/wp/v2/products

# Get single product
curl http://localhost/wordpress/wp-json/wp/v2/products/1

# Get all news
curl http://localhost/wordpress/wp-json/wp/v2/news

# Get with ACF fields
curl http://localhost/wordpress/wp-json/wp/v2/products?acf=true
```

## Step 10: Connect to Next.js Frontend

1. Update `.env.local`:

```env
NEXT_PUBLIC_WORDPRESS_URL=http://localhost/wordpress
WORDPRESS_JWT_TOKEN=your_generated_token
```

2. Test dari Next.js:

```bash
curl http://localhost:3000/api/wordpress
```

3. Verify konten muncul di halaman frontend

## Troubleshooting

### REST API Not Working
- Enable pretty permalinks di WordPress
- Check plugin conflicts: Disable semua plugin kecuali required ones
- Verify `.htaccess` exists di WordPress root

### JWT Authentication Error
- Verify plugin terinstall dengan benar
- Check secret key dikonfigurasi
- Verify user account exists di WordPress

### CORS Errors
- Add CORS headers ke WordPress
- Check frontend URL whitelist
- Verify plugin allows cross-origin requests

### Custom Fields Tidak Muncul di API
- ACF → Settings → JSON Support → Enable
- Verify field group assigned ke post type
- Regenerate API cache

## Production Deployment

1. **Security:**
   - Ubah default admin username
   - Use strong password
   - Enable two-factor authentication
   - Disable XML-RPC
   - Hide WordPress version

2. **Performance:**
   - Install caching plugin (WP Super Cache)
   - Optimize images
   - Enable gzip compression
   - Use CDN untuk assets

3. **Backups:**
   - Setup automatic daily backups
   - Test restore process
   - Keep backup files off-site

4. **Monitoring:**
   - Setup error logging
   - Monitor plugin updates
   - Check disk space regularly

## API Reference

### Products Endpoint

```
GET    /wp-json/wp/v2/products              # Get all products
GET    /wp-json/wp/v2/products/{id}         # Get single product
POST   /wp-json/wp/v2/products              # Create product (auth)
PUT    /wp-json/wp/v2/products/{id}         # Update product (auth)
DELETE /wp-json/wp/v2/products/{id}         # Delete product (auth)
```

### News Endpoint

```
GET    /wp-json/wp/v2/news                  # Get all news
GET    /wp-json/wp/v2/news/{id}             # Get single article
POST   /wp-json/wp/v2/news                  # Create news (auth)
PUT    /wp-json/wp/v2/news/{id}             # Update news (auth)
DELETE /wp-json/wp/v2/news/{id}             # Delete news (auth)
```

### Authentication

```
POST /wp-json/jwt-auth/v1/token
Body: {
  "username": "admin",
  "password": "password"
}

Response: {
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user_email": "admin@example.com",
  "user_nicename": "admin",
  "user_display_name": "Administrator"
}
```

## Support Resources

- [WordPress Plugin Development](https://developer.wordpress.org/plugins/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [ACF Documentation](https://www.advancedcustomfields.com/resources/)
- [JWT Authentication GitHub](https://github.com/Fulcrum-Media/jwt-authentication-for-wp-rest-api)
