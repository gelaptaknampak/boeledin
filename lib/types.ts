// WordPress Post Types
export interface WPPost {
  id: number
  date: string
  date_gmt: string
  guid: {
    rendered: string
  }
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  comment_status: string
  ping_status: string
  sticky: boolean
  template: string
  format: string
  meta: any
  categories: number[]
  tags: number[]
  acf?: Record<string, any>
}

export interface WPPage extends WPPost {
  parent: number
  menu_order: number
}

export interface Product extends WPPost {
  acf?: {
    brand?: string
    category?: string
    description?: string
    image?: string
    price?: number
  }
}

export interface News extends WPPost {
  acf?: {
    author_name?: string
    published_date?: string
    content?: string
    thumbnail?: string
  }
}

export interface WPCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  parent: number
  meta: any
}

export interface WPMedia {
  id: number
  date: string
  slug: string
  type: string
  link: string
  title: {
    rendered: string
  }
  author: number
  description: {
    rendered: string
  }
  alt_text: string
  media_type: string
  mime_type: string
  media_details: {
    width: number
    height: number
    file: string
    image_meta?: any
    sizes?: Record<string, any>
  }
  post: number
  source_url: string
  media_properties?: any
}

// Admin & Dashboard Types
export interface DashboardStats {
  totalProducts: number
  totalNews: number
  totalPages: number
  recentPosts: WPPost[]
}

export interface ContentFilter {
  postType: string
  search?: string
  category?: string
  page?: number
  perPage?: number
  orderBy?: string
  order?: 'asc' | 'desc'
}

// Form Types
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface CreatePostData {
  title: string
  content: string
  status: 'publish' | 'draft'
  featured_media?: number
  acf?: Record<string, any>
}

// Authentication
export interface User {
  id: number
  username: string
  name: string
  url: string
  description: string
  link: string
  slug: string
  avatar_urls?: Record<string, string>
}
