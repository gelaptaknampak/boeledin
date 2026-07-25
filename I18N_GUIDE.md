# Multi-Language (i18n) Implementation Guide

## Overview

The website now supports **2 languages**: Indonesian (id) and English (en). All content can be dynamically switched between languages, with the selected language persisted in localStorage.

## Architecture

### Files Created/Modified

- **`lib/translations.ts`** - Complete translation dictionary for all pages and content
- **`lib/language-context.ts`** - Zustand store for managing language state
- **`hooks/useTranslation.ts`** - Hook for accessing translations in components
- **`components/Navigation.tsx`** - Updated with language switcher button
- **Component updates** - All pages updated to use translations

### How It Works

1. **Language Store** (`Zustand`):
   - Manages current language state
   - Persists selection to localStorage
   - Accessible from any component

2. **Translation Dictionary**:
   - Organized hierarchically: `section.subsection.key`
   - Contains 2 language versions (en, id)
   - Easy to extend with new languages

3. **Hook Usage**:
   - Use `useTranslation()` hook in client components
   - Get `t()` function and language controls
   - Automatically re-renders on language change

## Usage Example

### In Your Components

```tsx
'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function MyComponent() {
  const { t, language, toggleLanguage } = useTranslation()

  return (
    <div>
      <h1>{t('home.heroTitle')}</h1>
      <button onClick={toggleLanguage}>
        Switch to {language === 'en' ? 'Indonesian' : 'English'}
      </button>
    </div>
  )
}
```

### Translation Keys

All translation keys follow this pattern:

```
[page].[section].[key]

Examples:
- nav.home
- home.heroTitle
- products.filterBrand
- contact.form.name
- admin.dashboard.welcome
```

## Adding New Translations

### Step 1: Add to Translation Dictionary

Edit `lib/translations.ts`:

```typescript
export const translations = {
  en: {
    mySection: {
      myKey: 'English text here',
    },
  },
  id: {
    mySection: {
      myKey: 'Teks Indonesia di sini',
    },
  },
}
```

### Step 2: Use in Component

```tsx
const { t } = useTranslation()
<h1>{t('mySection.myKey')}</h1>
```

## Navigation Language Switcher

Located in the top navigation bar:
- **Desktop**: Shows "EN" or "ID" with globe icon
- **Mobile**: Shows full language name with toggle button
- Clicking toggles between English and Indonesian
- Selection persists across page reloads

## Current Translation Coverage

### Pages Translated

- ✅ Navigation (all links)
- ✅ Home page (hero, services, CTA)
- ✅ Products page (filters, results, search)
- ✅ Contact form (labels, validation, messages)
- ✅ News (titles, labels)
- ✅ About (content, values)
- ✅ Admin (login, dashboard, management)

### Sections Included

1. **Navigation** (`nav.*`)
   - Home, Products, News, About, Contact
   - Admin links

2. **Home** (`home.*`)
   - Hero section
   - Services
   - CTA buttons

3. **Products** (`products.*`)
   - Filters (brand, category)
   - Search
   - Results display
   - Product categories

4. **News** (`news.*`)
   - Listings
   - Article display

5. **About** (`about.*`)
   - Company story
   - Mission, vision, values

6. **Contact** (`contact.*`)
   - Form labels
   - Validation messages
   - Success/error messages
   - Contact information

7. **Admin** (`admin.*`)
   - Login page
   - Dashboard
   - Products management
   - News management
   - Pages management
   - Settings

8. **Common** (`common.*`)
   - Buttons (Save, Delete, Edit, etc.)
   - Loading states
   - Language selection

## Translation Key Reference

### Home Page
```
home.heroTitle           - Main hero title
home.heroSubtitle        - Hero subtitle
home.heroCta             - "Explore Products" button
home.heroCtaSecondary    - "Learn More" button
home.servicesTitle       - Services section title
home.servicesSubtitle    - Services description
```

### Products Page
```
products.filterBrand           - Brand filter label
products.allBrands             - "All Brands" option
products.filterCategory        - Category filter label
products.allCategories         - "All Categories" option
products.searchLabel           - Search label
products.searchPlaceholder     - Search input placeholder
products.resetFilter           - Reset button
products.showing               - Results count prefix
products.of                    - Results count separator
products.products              - Results count suffix
products.noResults             - No results message
```

### Contact Page
```
contact.form.name              - Name field label
contact.form.email             - Email field label
contact.form.phone             - Phone field label
contact.form.subject           - Subject field label
contact.form.message           - Message field label
contact.form.submit            - Submit button
contact.form.nameRequired      - Name validation error
contact.form.emailRequired     - Email required error
contact.form.emailInvalid      - Email format error
contact.form.messageRequired   - Message validation error
contact.form.success           - Success message
contact.form.error             - Error message
```

## Language Storage

The selected language is stored in localStorage with key: `language-store`

```javascript
// Stored as Zustand state
{
  "language": "id" // or "en"
}
```

## Browser Compatibility

- Works in all modern browsers
- Gracefully falls back to Indonesian if no language preference
- Persists across browser sessions

## Performance Considerations

- Translations are bundled at build time (no runtime loading)
- Language switching is instant (no API calls)
- Bundle size impact: ~30KB (minimal)

## Future Enhancements

To add more languages:

1. Add new language object to `translations.ts`
2. Update `Language` type to include new language code
3. Components automatically work with new language
4. Add language option to language switcher UI

## Troubleshooting

### Translation Key Not Working

1. Verify key exists in `lib/translations.ts`
2. Check exact spelling and nested path
3. Ensure component is marked as `'use client'`
4. Check browser console for errors

### Language Not Persisting

- Check if localStorage is enabled
- Verify Zustand persist middleware is working
- Check browser DevTools: Application > LocalStorage

### Special Characters Not Displaying

- Ensure file is saved as UTF-8
- Check HTML meta charset is UTF-8
- Verify terminal/editor settings

## API Usage

```tsx
const { t, language, setLanguage, toggleLanguage } = useTranslation()

// Get translation
const text = t('nav.home')

// Check current language
if (language === 'en') {
  // English-specific logic
}

// Set specific language
setLanguage('id') // Set to Indonesian
setLanguage('en') // Set to English

// Toggle between languages
toggleLanguage() // Switches current to other language
```

## Examples

### Simple Translation
```tsx
<h1>{t('home.heroTitle')}</h1>
```

### With Conditional
```tsx
{language === 'en' ? (
  <p>English text</p>
) : (
  <p>{t('some.indonesian.text')}</p>
)}
```

### In Forms
```tsx
<input placeholder={t('contact.form.namePlaceholder')} />
```

### Dynamic Keys (if needed)
```tsx
const category = 'digital-signage'
const label = t(`products.${category}`)
```

---

**Last Updated**: 2025-01-08
**Maintained by**: BOELEDIN Development Team
