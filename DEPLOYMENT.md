# BOELEDIN - Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. **A WordPress Instance** (self-hosted or managed)
   - WordPress 6.0+ installed
   - JWT Authentication for WP REST API plugin installed
   - Custom Post Types configured (Products, News)
   - Advanced Custom Fields (ACF) plugin for additional fields

2. **Vercel Account** (recommended for Next.js)
   - Free plan is sufficient
   - GitHub account for automatic deployments

3. **SendGrid Account** (for email notifications)
   - Free plan includes 100 emails/day
   - API key for authentication

## Step 1: WordPress Setup

### 1.1 Install Required Plugins

Go to your WordPress admin panel and install these plugins:

1. **JWT Authentication for WP REST API**
   - Install and activate
   - Go to Settings → JWT Authentication
   - Generate JWT Secret (copy and save securely)
   - Enable CORS headers if not automatic

2. **Advanced Custom Fields Pro** (or free version)
   - Install and activate
   - Create field groups for products (price, brand, category)

3. **Custom Post Type UI** (optional, for Products CPT)
   - Create "Products" custom post type
   - Create "News" custom taxonomy

### 1.2 Enable REST API Endpoints

Add this to your `wp-config.php` or use a plugin:

```php
define('JWT_AUTH_CORS_ENABLE', true);
```

### 1.3 Create User Account

1. Go to Users → Add New
2. Create an admin user for the CMS dashboard
3. Save the credentials securely

## Step 2: Environment Configuration

### 2.1 Local Development

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the variables:

```env
# WordPress Configuration
WORDPRESS_API_URL=https://your-wordpress-site.com
WORDPRESS_JWT_SECRET=your_jwt_secret_from_wordpress

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=BOELEDIN

# Email Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
CONTACT_EMAIL_FROM=noreply@boeledin.com
CONTACT_EMAIL_TO=admin@boeledin.com

# Environment
NODE_ENV=development
```

### 2.2 Vercel Deployment

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "Add New" → "Project"
4. Select your GitHub repository
5. In "Environment Variables" section, add:

```
WORDPRESS_API_URL=https://your-wordpress-site.com
WORDPRESS_JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=BOELEDIN
SENDGRID_API_KEY=your_sendgrid_api_key
CONTACT_EMAIL_FROM=noreply@boeledin.com
CONTACT_EMAIL_TO=admin@boeledin.com
NODE_ENV=production
```

6. Click "Deploy"

## Step 3: Testing

### 3.1 Test WordPress Connection

1. Go to `/admin/login` on your deployed site
2. Enter WordPress admin credentials
3. Should redirect to dashboard if successful

### 3.2 Test Content Sync

1. Go to Admin Dashboard
2. Check if products/news load from WordPress
3. Create a test product in WordPress
4. Refresh dashboard to see the new product

### 3.3 Test Contact Form

1. Go to `/contact` page
2. Fill out the form and submit
3. Check your email (configured in `CONTACT_EMAIL_TO`)

## Step 4: Production Optimizations

### 4.1 Performance

Add caching headers to `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => {
    return [
      {
        source: '/api/wordpress/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

### 4.2 Security

1. **Enable HTTPS** (automatic on Vercel)
2. **Set CORS headers** in WordPress
3. **Rate Limiting** - Add to your API routes
4. **Input Validation** - Validate all user inputs
5. **SQL Injection Protection** - Use WordPress prepared statements

### 4.3 Monitoring

1. Set up Vercel Analytics
2. Monitor WordPress API response times
3. Set up error alerts

## Step 5: Maintenance

### Regular Tasks

1. **Weekly**
   - Check for plugin updates
   - Monitor error logs
   - Backup WordPress database

2. **Monthly**
   - Test backup restoration
   - Review analytics
   - Update dependencies (`pnpm update`)

3. **Quarterly**
   - Security audit
   - Performance optimization
   - Update WordPress and plugins

## Troubleshooting

### Issue: "Authentication failed" on admin login

**Solution:**
1. Verify `WORDPRESS_JWT_SECRET` is correct
2. Check JWT Auth plugin is enabled on WordPress
3. Test WordPress JWT endpoint: `POST /wp-json/jwt-auth/v1/token`

### Issue: Content not loading from WordPress

**Solution:**
1. Verify `WORDPRESS_API_URL` is correct
2. Check WordPress REST API is accessible
3. Test endpoint: `GET /wp-json/wp/v2/posts`
4. Check for CORS issues in browser console

### Issue: Email not sending

**Solution:**
1. Verify SendGrid API key is correct
2. Check email configuration in environment
3. Look for errors in Vercel function logs
4. Try sending test email via SendGrid dashboard

### Issue: High page load times

**Solution:**
1. Check WordPress API response time
2. Enable caching on WordPress
3. Use CDN for images
4. Optimize images before uploading

## Rollback Procedure

If something goes wrong on production:

1. **On Vercel**: Click the deployment you want to revert to
2. Click the "..." menu and select "Promote to Production"
3. Or use: `vercel rollback` in CLI

## Support

For issues:

1. Check API Documentation at `/API_DOCUMENTATION.md`
2. Review WordPress REST API docs
3. Check Vercel deployment logs
4. Review browser console for client-side errors

## Security Checklist

- [ ] Changed all default WordPress usernames
- [ ] Set strong passwords for all accounts
- [ ] Enabled JWT Secret on WordPress
- [ ] Configured CORS correctly
- [ ] Environment variables set securely on Vercel
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Regular backups configured
- [ ] Error logging set up
- [ ] Rate limiting implemented
- [ ] Input validation enabled
