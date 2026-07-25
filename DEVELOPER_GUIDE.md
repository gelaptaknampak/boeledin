# BOELEDIN - Developer Guide

## Project Structure

```
project/
├── app/
│   ├── (main pages)
│   │   ├── page.tsx                 # Home page
│   │   ├── products/page.tsx        # Products page
│   │   ├── news/page.tsx            # News page
│   │   ├── about/page.tsx           # About page
│   │   ├── contact/page.tsx         # Contact page
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   │
│   ├── admin/
│   │   ├── login/page.tsx           # Admin login
│   │   ├── dashboard/page.tsx       # Admin dashboard
│   │   ├── products/page.tsx        # Products management
│   │   ├── news/page.tsx            # News management
│   │   ├── pages/page.tsx           # Pages management
│   │   └── settings/page.tsx        # Settings page
│   │
│   └── api/
│       ├── health/route.ts          # Health check
│       ├── auth/                    # Authentication routes
│       ├── contact/route.ts         # Contact form handler
│       ├── admin/                   # Admin API routes
│       └── wordpress/               # WordPress data routes
│
├── components/
│   ├── Navigation.tsx               # Main navigation
│   ├── Footer.tsx                   # Footer
│   ├── Providers.tsx                # Client providers
│   │
│   ├── home/                        # Home page components
│   │   ├── HeroSection.tsx
│   │   ├── SpecStrip.tsx
│   │   ├── ServicesSection.tsx
│   │   └── CtaSection.tsx
│   │
│   ├── products/                    # Products page components
│   │   ├── ProductsHero.tsx
│   │   └── ProductsGrid.tsx
│   │
│   ├── news/                        # News page components
│   │   ├── NewsHero.tsx
│   │   └── NewsGrid.tsx
│   │
│   ├── about/                       # About page components
│   │   ├── AboutHero.tsx
│   │   ├── AboutStory.tsx
│   │   └── AboutValues.tsx
│   │
│   ├── contact/                     # Contact page components
│   │   ├── ContactHero.tsx
│   │   └── ContactForm.tsx
│   │
│   ├── ui/                          # UI components (shadcn)
│   │   └── button.tsx               # Button component
│   │
│   └── admin/                       # Admin components
│       ├── AdminLayout.tsx
│       ├── DashboardOverview.tsx
│       ├── ProductsManagement.tsx
│       ├── NewsManagement.tsx
│       ├── PagesManagement.tsx
│       └── SettingsPage.tsx
│
├── lib/
│   ├── wordpress.ts                 # WordPress API client
│   ├── types.ts                     # TypeScript types
│   ├── auth.ts                      # Authentication utilities
│   ├── utils.ts                     # Utility functions
│   └── config.ts                    # Configuration
│
├── public/                          # Static assets
├── .env.example                     # Environment template
└── package.json                     # Dependencies
```

## Key Technologies

- **Next.js 16** - React framework with Server Components
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility CSS framework
- **Axios** - HTTP client
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Date-fns** - Date formatting

## Development Setup

### Prerequisites
- Node.js 18+
- pnpm package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
cd boeledin-cms
pnpm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your WordPress URL and API keys
```

### Running Development Server

```bash
# Start dev server with hot reload
pnpm dev

# Open http://localhost:3000
```

### Building for Production

```bash
# Build the app
pnpm build

# Start production server
pnpm start
```

## Working with WordPress REST API

### Fetching Data

The `lib/wordpress.ts` file contains all API calls:

```typescript
import { getProducts, getNews, getPages } from '@/lib/wordpress'

// In a Server Component
const products = await getProducts()
```

### Creating Data

Use the admin API routes:

```typescript
// POST /api/admin/products
const response = await fetch('/api/admin/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Product Name',
    content: 'Description',
    price: '99.99',
  }),
})
```

### Authentication Flow

1. User logs in at `/admin/login`
2. Credentials sent to `/api/auth/login`
3. WordPress verifies and returns JWT token
4. Token stored in httpOnly cookie
5. Subsequent requests include token in Authorization header

## Styling Guidelines

### Tailwind CSS Classes

- Use Tailwind utility classes for all styling
- Reference `app/globals.css` for design tokens
- Follow mobile-first responsive design (sm:, md:, lg:)

Example:
```tsx
<div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 lg:px-6">
  <h1 className="text-3xl md:text-4xl font-bold text-primary">Title</h1>
</div>
```

### Color System

Predefined color tokens in `globals.css`:

```css
--background  /* Page background */
--foreground  /* Text color */
--primary     /* Brand color */
--secondary   /* Secondary color */
--accent      /* Accent color */
--muted       /* Muted text */
```

Use in components:
```tsx
<button className="bg-primary text-primary-foreground">Click me</button>
```

## Component Best Practices

### Server vs Client Components

**Server Components** (default):
- Fetch data from databases/APIs
- Keep secrets secure
- Use async/await directly

```tsx
// components/ProductList.tsx
export default async function ProductList() {
  const products = await getProducts()
  return <div>{/* render products */}</div>
}
```

**Client Components** (use 'use client'):
- Handle interactivity (clicks, forms, state)
- Use React hooks
- Browser APIs only

```tsx
'use client'
import { useState } from 'react'

export default function Filter() {
  const [filter, setFilter] = useState('')
  return <input onChange={(e) => setFilter(e.target.value)} />
}
```

### Form Handling

Use React Hook Form + Zod for validation:

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(10),
})

export default function ContactForm() {
  const { register, handleSubmit, errors } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      <textarea {...register('message')} />
      <button type="submit">Send</button>
    </form>
  )
}
```

## API Route Development

### Creating a New API Route

```typescript
// app/api/example/route.ts
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Your logic here
    return Response.json({ data: 'example' })
  } catch (error) {
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  // Handle POST
}
```

### Authentication in API Routes

```typescript
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('wp_token')?.value

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Use token for authenticated requests
  const response = await axios.post(
    `${wpUrl}/wp-json/wp/v2/posts`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  )
}
```

## Debugging

### Console Logging

Use descriptive log messages:

```typescript
console.log('[v0] Fetching products from WordPress')
console.error('[v0] Product fetch failed:', error)
```

### Browser DevTools

1. Open DevTools (F12)
2. Network tab - see API requests
3. Console tab - see errors and logs
4. Application tab - check cookies/storage

### Vercel Logs

```bash
# View live logs
vercel logs --tail

# View logs for specific deployment
vercel logs <deployment-url>
```

## Performance Optimization

### Image Optimization

Use Next.js Image component:

```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={400}
  height={300}
  priority
/>
```

### API Caching

Cache WordPress API responses:

```typescript
const response = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
  next: { revalidate: 3600 } // Cache for 1 hour
})
```

### Bundle Analysis

```bash
ANALYZE=true pnpm build
```

## Common Tasks

### Add a New Page

1. Create folder: `app/newpage/`
2. Create `page.tsx` with page component
3. Create components in `components/newpage/`
4. Update navigation in `components/Navigation.tsx`

### Add a New Admin Section

1. Create folder: `app/admin/newsection/`
2. Create `page.tsx` that imports management component
3. Create component in `components/admin/`
4. Update sidebar in `components/admin/AdminLayout.tsx`

### Update WordPress Custom Fields

1. Install ACF plugin on WordPress
2. Create field group for post type
3. Update types in `lib/types.ts`
4. Update API calls in `lib/wordpress.ts`

## Testing

### Unit Tests (optional)

```bash
pnpm add --save-dev jest @testing-library/react

# Create __tests__ folder
mkdir __tests__

# Run tests
pnpm test
```

### Manual Testing Checklist

- [ ] All pages load without errors
- [ ] Navigation links work
- [ ] Contact form submits
- [ ] Admin login works
- [ ] Can create/edit/delete content
- [ ] Images load correctly
- [ ] Mobile responsive layout
- [ ] Forms validate inputs
- [ ] Error states handled

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables set
- [ ] WordPress API accessible
- [ ] No console errors
- [ ] All pages tested
- [ ] Mobile layout tested
- [ ] Performance acceptable
- [ ] Security review done
- [ ] Backup WordPress created
- [ ] DNS pointing to Vercel
- [ ] SSL certificate valid
