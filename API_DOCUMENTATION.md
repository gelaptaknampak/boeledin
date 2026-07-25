# BOELEDIN - API Documentation

## Overview
This document describes all API endpoints available in the BOELEDIN website CMS platform.

## Base URL
```
http://localhost:3000/api (development)
https://yourdomain.com/api (production)
```

## Authentication

### Login
Create a session by authenticating with WordPress credentials.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "your_wordpress_username",
  "password": "your_wordpress_password"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "email": "user@example.com",
    "username": "wordpress_user"
  }
}
```

**Response (401):**
```json
{
  "error": "Authentication failed"
}
```

### Logout
Remove authentication session.

**Endpoint:** `POST /auth/logout`

**Response (200):**
```json
{
  "success": true
}
```

### Session Check
Verify current authentication status.

**Endpoint:** `GET /auth/session`

**Response (200):**
```json
{
  "session": {
    "token": "jwt_token",
    "authenticated": true
  }
}
```

**Response (no session):**
```json
{
  "session": null
}
```

## Content Management

### Products Management

#### Get All Products
**Endpoint:** `GET /wordpress/products`

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Product Name",
    "content": "Product description",
    "price": "99.99",
    "category": "Electronics",
    "image": {
      "url": "https://...",
      "alt": "Product Image"
    }
  }
]
```

#### Create Product
**Endpoint:** `POST /admin/products`

**Required Authentication:** Yes

**Request Body:**
```json
{
  "title": "New Product",
  "content": "Product description",
  "price": "99.99",
  "image": 123,
  "category": "Electronics"
}
```

**Response (200):**
```json
{
  "id": 2,
  "title": "New Product",
  "status": "publish"
}
```

#### Update Product
**Endpoint:** `PUT /admin/products`

**Required Authentication:** Yes

**Request Body:**
```json
{
  "id": 1,
  "title": "Updated Product Name",
  "content": "Updated description",
  "price": "79.99",
  "image": 123,
  "category": "Electronics"
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Updated Product Name",
  "status": "publish"
}
```

#### Delete Product
**Endpoint:** `DELETE /admin/products?id=1`

**Required Authentication:** Yes

**Response (200):**
```json
{
  "success": true
}
```

### News Management

#### Get All News
**Endpoint:** `GET /wordpress/news`

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "News Title",
    "content": "News content",
    "excerpt": "News excerpt",
    "date": "2024-01-15",
    "category": "Updates",
    "image": {
      "url": "https://...",
      "alt": "Featured Image"
    }
  }
]
```

#### Create News Article
**Endpoint:** `POST /admin/news`

**Required Authentication:** Yes

**Request Body:**
```json
{
  "title": "New Article",
  "content": "Full article content",
  "excerpt": "Short summary",
  "image": 123,
  "category": 5
}
```

**Response (200):**
```json
{
  "id": 2,
  "title": "New Article",
  "status": "publish"
}
```

#### Update News Article
**Endpoint:** `PUT /admin/news`

**Required Authentication:** Yes

**Request Body:**
```json
{
  "id": 1,
  "title": "Updated Article Title",
  "content": "Updated content",
  "excerpt": "Updated excerpt",
  "image": 123,
  "category": 5
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Updated Article Title",
  "status": "publish"
}
```

#### Delete News Article
**Endpoint:** `DELETE /admin/news?id=1`

**Required Authentication:** Yes

**Response (200):**
```json
{
  "success": true
}
```

### Pages Management

#### Get All Pages
**Endpoint:** `GET /wordpress/pages`

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "About Us",
    "slug": "about",
    "content": "Page content",
    "parent": 0
  }
]
```

#### Create Page
**Endpoint:** `POST /admin/pages`

**Required Authentication:** Yes

**Request Body:**
```json
{
  "title": "New Page",
  "content": "Page content",
  "slug": "new-page",
  "parent": 0
}
```

**Response (200):**
```json
{
  "id": 3,
  "title": "New Page",
  "status": "publish"
}
```

#### Update Page
**Endpoint:** `PUT /admin/pages`

**Required Authentication:** Yes

**Request Body:**
```json
{
  "id": 1,
  "title": "Updated Page Title",
  "content": "Updated content",
  "slug": "about",
  "parent": 0
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Updated Page Title",
  "status": "publish"
}
```

#### Delete Page
**Endpoint:** `DELETE /admin/pages?id=1`

**Required Authentication:** Yes

**Response (200):**
```json
{
  "success": true
}
```

## Health Check

**Endpoint:** `GET /health`

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required or failed
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting

Currently no rate limiting is implemented. For production use, consider adding rate limiting middleware.

## CORS

CORS is configured to allow requests from:
- localhost:3000
- localhost:3001
- Your production domain (configure in environment variables)

## Environment Variables Required

```
WORDPRESS_API_URL=https://your-wordpress-site.com
WORDPRESS_JWT_SECRET=your_jwt_secret
NODE_ENV=development
```
