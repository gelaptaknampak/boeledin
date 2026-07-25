# BOELEDIN - Troubleshooting Guide

Common issues and solutions. Use Ctrl+F to search for your problem.

## 🔴 Critical Issues

### Application Won't Start

**Symptoms:**
- `pnpm dev` fails
- Error about missing dependencies
- Port 3000 already in use

**Solutions:**

1. **Missing Dependencies**
   ```bash
   # Clear and reinstall
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   pnpm dev
   ```

2. **Port in Use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill it
   kill -9 <PID>
   
   # Or use different port
   pnpm dev -p 3001
   ```

3. **Node Version Mismatch**
   ```bash
   # Check Node version
   node --version  # Should be 18+
   
   # Update if needed
   nvm install 18
   nvm use 18
   ```

### Build Fails

**Symptoms:**
- `pnpm build` fails
- TypeScript errors
- Import errors

**Solutions:**

1. **TypeScript Errors**
   ```bash
   # Check for type errors
   pnpm tsc --noEmit
   
   # Fix common issues:
   # - Import missing types
   # - Add types for dependencies
   # - Check lib/types.ts is complete
   ```

2. **Missing Imports**
   ```bash
   # Check import paths use @ alias
   ❌ import Button from '../components/Button'
   ✅ import Button from '@/components/Button'
   ```

3. **Next.js Config Issues**
   ```bash
   # Validate next.config.mjs syntax
   node -c next.config.mjs
   ```

## 🟡 Authentication Issues

### Admin Login Fails

**Symptoms:**
- Can't login at `/admin/login`
- "Authentication failed" error
- Redirects to login repeatedly

**Solution Checklist:**

1. **Verify WordPress JWT Plugin**
   ```
   ✓ Plugin installed? WordPress → Plugins → look for "JWT Auth"
   ✓ Plugin activated? Should show green checkmark
   ✓ Settings configured? Settings → JWT Authentication
   ```

2. **Check JWT Secret**
   ```
   ✓ WordPress JWT secret exists
   ✓ Matches WORDPRESS_JWT_SECRET in .env.local
   ✓ Not empty or default value
   ```

3. **Test WordPress API**
   ```bash
   # Replace with your WordPress URL
   curl -X POST http://localhost/wordpress/wp-json/jwt-auth/v1/token \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"password"}'
   
   # Should return token like:
   # {"token":"eyJ0eXAi...","success":true}
   ```

4. **Check Environment Variables**
   ```bash
   # Verify .env.local exists
   ls -la .env.local
   
   # Check values
   cat .env.local | grep WORDPRESS
   ```

5. **Verify WordPress User**
   ```
   ✓ User account exists in WordPress
   ✓ User has admin role
   ✓ Password is correct
   ✓ User is not locked out
   ```

### Session Cookie Not Set

**Symptoms:**
- Login works but immediately redirects to login
- Cookie shows in DevTools but not used
- "Unauthorized" errors on admin pages

**Solutions:**

1. **Enable Cookies in Browser**
   - Check browser allows cookies
   - Disable cookie blocking for localhost
   - Try in incognito mode

2. **HTTPS Issues** (Production)
   ```
   ✓ Must use HTTPS in production
   ✓ Cookie set with secure flag
   ✓ SameSite=Lax or Strict
   ```

3. **Check Cookie Settings**
   ```typescript
   // In app/api/auth/login/route.ts
   cookieStore.set('wp_token', token, {
     httpOnly: true,          // ✓ Cannot be accessed via JS
     secure: isProd,          // ✓ HTTPS only in production
     sameSite: 'lax',        // ✓ CSRF protection
     maxAge: 7 * 24 * 60 * 60 // ✓ 7 days
   })
   ```

## 🟡 WordPress Connection Issues

### WordPress API Not Accessible

**Symptoms:**
- Content pages are blank
- Console errors about API calls
- "Failed to fetch products" messages

**Diagnosis:**

1. **Check WordPress URL**
   ```bash
   # Test WordPress is running
   curl -I WORDPRESS_API_URL
   
   # Should return 200 OK, not 404 or 500
   ```

2. **Test WordPress REST API**
   ```bash
   # Try accessing REST API
   curl WORDPRESS_API_URL/wp-json/
   
   # Should return JSON with available endpoints
   ```

3. **Check Environment Variable**
   ```bash
   # Verify WORDPRESS_API_URL is set
   grep WORDPRESS_API_URL .env.local
   
   # Make sure it's correct URL
   # Should have protocol (http:// or https://)
   # Should NOT have trailing slash
   ```

### CORS Errors

**Symptoms:**
- Browser console: "Cross-Origin Request Blocked"
- Network tab shows 403 Forbidden
- Headers don't show Access-Control-Allow-Origin

**Solutions:**

1. **Enable CORS in WordPress**
   
   Option A: Using Plugin
   ```
   1. Install: "REST API - CORS"
   2. Activate it
   3. Settings → REST API (CORS)
   4. Configure origins
   ```

   Option B: Add Code
   ```php
   // Add to functions.php or code snippet plugin
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

2. **Check Origin Header**
   ```bash
   # Browser sends this header
   # WordPress must allow it
   curl -H "Origin: http://localhost:3000" \
     WORDPRESS_API_URL/wp-json/wp/v2/posts
   ```

### Content Not Loading

**Symptoms:**
- Pages load but show no products/news
- Admin dashboard empty
- "No content found" messages

**Debug Steps:**

1. **Check API Response**
   ```bash
   # Test products endpoint
   curl WORDPRESS_API_URL/wp-json/wp/v2/products
   
   # Should return JSON array
   # If empty [], no content exists
   ```

2. **Verify Custom Post Types Exist**
   ```
   WordPress Admin:
   ✓ Can see "Products" menu item?
   ✓ Can see "Posts" for news?
   ✓ Any items created?
   ```

3. **Check Database**
   ```bash
   # MySQL query to check posts
   SELECT ID, post_title, post_type FROM wp_posts LIMIT 10;
   ```

4. **Review REST API Response**
   ```bash
   # Check full response
   curl -i WORDPRESS_API_URL/wp-json/wp/v2/products | head -50
   
   # Look for:
   # - HTTP 200 status
   # - Content-Type: application/json
   # - Non-empty body
   ```

## 🟡 Email Issues

### Contact Form Emails Not Sending

**Symptoms:**
- Contact form submits successfully
- No email received
- No error messages

**Solutions:**

1. **Check SendGrid Configuration**
   ```bash
   # Verify API key is set
   echo $SENDGRID_API_KEY
   
   # Should show: sg_XXXXXXXXXXXXXXXXXXXXX
   # Not empty or showing error
   ```

2. **Verify Email Configuration**
   ```bash
   # Check these are set in .env.local
   SENDGRID_API_KEY=sg_...
   CONTACT_EMAIL_FROM=noreply@yourdomain.com
   CONTACT_EMAIL_TO=admin@yourdomain.com
   ```

3. **Test SendGrid Connection**
   ```bash
   # Test API key is valid
   curl -H "Authorization: Bearer $SENDGRID_API_KEY" \
     https://api.sendgrid.com/v3/mail/send \
     -d '{"personalizations":[...]}'
   ```

4. **Check SendGrid Dashboard**
   ```
   1. Login to SendGrid
   2. Email Activity → Recent Activity
   3. Look for bounces, blocks, or failures
   4. Check sender address is verified
   ```

5. **Check Email Whitelist**
   ```
   ✓ Sender email is verified in SendGrid
   ✓ Recipient email not in bounce list
   ✓ Not blocked by spam filter
   ```

### Email Goes to Spam

**Solutions:**

1. **Add SPF Record**
   ```dns
   v=spf1 sendgrid.net ~all
   ```

2. **Add DKIM Record**
   ```
   Get from SendGrid dashboard:
   Settings → Sender Authentication
   Add both SPF and DKIM records
   ```

3. **Configure DMARC** (Optional)
   ```dns
   v=DMARC1; p=quarantine; rua=mailto:admin@yourdomain.com
   ```

## 🔵 Performance Issues

### Slow Page Load

**Symptoms:**
- Pages take 5+ seconds to load
- High server response time
- Users report slowness

**Diagnosis:**

1. **Check Network Tab**
   ```
   Browser DevTools → Network tab
   Look for:
   - API requests taking >1s
   - Large JavaScript bundles
   - Unoptimized images
   ```

2. **Test API Response Time**
   ```bash
   # Time WordPress API
   time curl WORDPRESS_API_URL/wp-json/wp/v2/posts
   
   # Should be < 500ms
   # If > 1s, WordPress is slow
   ```

3. **Check Vercel Analytics**
   ```
   Vercel Dashboard → Analytics
   - Check Web Vitals
   - Look for high FCP, LCP
   - Review error rates
   ```

4. **Optimize Images**
   ```
   - Use Next.js Image component
   - Compress images before upload
   - Use WebP format where possible
   ```

### High Memory Usage

**Symptoms:**
- Process crashes
- "Cannot allocate memory" errors
- Redeployment due to OOM

**Solutions:**

1. **Check Build Size**
   ```bash
   # Analyze bundle
   pnpm add -D @next/bundle-analyzer
   ANALYZE=true pnpm build
   ```

2. **Optimize Dependencies**
   ```bash
   # Find duplicate dependencies
   pnpm ls
   
   # Check unused dependencies
   npm audit
   
   # Remove unused
   pnpm remove unused-package
   ```

## 🔵 Styling Issues

### Styles Not Applied

**Symptoms:**
- Components render but no styling
- Tailwind classes ignored
- Default browser styles only

**Solutions:**

1. **Check Tailwind Configuration**
   ```bash
   # Verify tailwind.config.js exists
   ls tailwind.config.js
   
   # Check content paths
   grep -A3 "content:" tailwind.config.js
   ```

2. **Verify CSS Import**
   ```typescript
   // In app/layout.tsx
   import './globals.css'  // ✓ Must be imported
   ```

3. **Check CSS File**
   ```bash
   # globals.css should have
   @import "tailwindcss";
   
   # And custom styles
   ```

4. **Rebuild CSS**
   ```bash
   # Stop dev server
   # Clear .next folder
   rm -rf .next
   
   # Restart
   pnpm dev
   ```

### Dark Mode Not Working

**Symptoms:**
- Dark mode toggle doesn't change theme
- Styles don't update
- Always shows light or dark

**Solutions:**

1. **Check HTML Element**
   ```html
   <!-- Should have class attribute -->
   <html className="dark">
   ```

2. **Verify CSS Variables**
   ```css
   :root {
     --background: #ffffff;
     --foreground: #000000;
   }
   
   :root.dark {
     --background: #000000;
     --foreground: #ffffff;
   }
   ```

3. **Check Theme Provider**
   ```typescript
   // components/Providers.tsx should handle theme
   // Must use useEffect to apply to html element
   ```

## 🔵 Deployment Issues

### Deployment Fails

**Symptoms:**
- Deployment error on Vercel
- Build fails in Vercel
- Works locally but not on Vercel

**Solutions:**

1. **Check Environment Variables**
   ```
   Vercel Dashboard:
   1. Settings → Environment Variables
   2. Verify all required vars are set
   3. Check for typos
   4. Redeploy
   ```

2. **Review Build Logs**
   ```
   Vercel Dashboard:
   1. Deployments → Latest
   2. Click "View Deployment Log"
   3. Look for specific error messages
   4. Search error message for solution
   ```

3. **Test Build Locally**
   ```bash
   # Verify build works locally first
   pnpm build
   pnpm start
   
   # If works locally but fails on Vercel:
   # - Check environment variables match
   # - Check Node version
   # - Check dependency versions
   ```

### Environment Variables Not Available

**Symptoms:**
- "Undefined variable" errors
- WORDPRESS_API_URL shows as undefined
- .env.local works but production doesn't

**Solutions:**

1. **Verify on Vercel Dashboard**
   ```
   1. Settings → Environment Variables
   2. Check variable exists
   3. Confirm value is not empty
   4. Check deployment environment
   ```

2. **Only Public Vars Available in Client**
   ```typescript
   ✓ NEXT_PUBLIC_* - Available on client
   ✗ PRIVATE_VAR - Not available on client
   
   // Use API route for private variables
   ```

3. **Redeploy After Adding Vars**
   ```
   1. Add environment variable on Vercel
   2. Must redeploy (auto-deploy if git connected)
   3. Wait for deployment to complete
   ```

## 🟣 Database Issues

### WordPress Database Connection Fails

**Symptoms:**
- WordPress admin panel not loading
- "Error establishing database connection"
- 500 errors in WordPress

**Solutions:**

1. **Check Database Credentials**
   ```
   WordPress: wp-config.php
   - DB_NAME correct?
   - DB_USER correct?
   - DB_PASSWORD correct?
   - DB_HOST correct?
   ```

2. **Test Database Connection**
   ```bash
   mysql -h DB_HOST -u DB_USER -p DB_NAME
   # Enter password when prompted
   ```

3. **Check Database Server Running**
   ```bash
   # MySQL should be running
   sudo systemctl status mysql
   
   # Restart if needed
   sudo systemctl restart mysql
   ```

## 🟣 Logging Issues

### Errors Not Showing

**Symptoms:**
- Console logs don't appear
- Errors happen silently
- Can't debug issues

**Solutions:**

1. **Enable Console Output**
   ```bash
   # Development mode shows more logs
   NODE_ENV=development pnpm dev
   ```

2. **Check Vercel Logs**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # View live logs
   vercel logs --tail
   ```

3. **Add Console Logs**
   ```typescript
   console.log('[v0] Page loading...', process.env.WORDPRESS_API_URL)
   console.error('[v0] Error:', error)
   ```

## 🆘 Get Help

### Not Finding Your Issue?

1. **Check Documentation**
   - [README.md](./README.md) - Overview
   - [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development help
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment help

2. **Review Logs**
   - Browser console (F12)
   - Vercel deployment logs
   - WordPress debug log
   - Next.js terminal output

3. **Try Debugging Steps**
   - Restart dev server
   - Clear `.next` folder
   - Reinstall dependencies
   - Check environment variables

4. **Search Online**
   - Next.js docs: nextjs.org
   - WordPress REST API: developer.wordpress.org
   - Tailwind CSS: tailwindcss.com

### Creating a Minimal Reproduction

If still stuck, create a minimal test case:

```bash
# Test WordPress connection
curl WORDPRESS_API_URL/wp-json/wp/v2/posts

# Test Next.js build
pnpm build

# Test API route
curl http://localhost:3000/api/health
```

Provide these outputs when asking for help.

---

**Still need help?** 
- Check the documentation index: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
- Review configuration: [CONFIG_REFERENCE.md](./CONFIG_REFERENCE.md)
