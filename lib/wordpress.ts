import axios from "axios";

const WORDPRESS_URL = "https://wp.boeledin.com";
const WORDPRESS_API = `${WORDPRESS_URL}/wp-json/wp/v2`;
const ACF_API = `${WORDPRESS_URL}/wp-json/acf/v3`;

export const wpClient = axios.create({
  baseURL: WORDPRESS_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Posts & Pages
// export async function getPosts(params?: any) {
//   try {
//     const response = await wpClient.get("/posts", { params });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     return [];
//   }
// }

export async function getPostById(id: number) {
  try {
    const response = await wpClient.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function getPages(params?: any) {
  try {
    const response = await wpClient.get("/pages", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching pages:", error);
    return [];
  }
}

export async function getPageById(id: number) {
  try {
    const response = await wpClient.get(`/pages/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

// Custom Post Types (Products, News)
export async function getCustomPosts(postType: string, params?: any) {
  try {
    const response = await wpClient.get(`/${postType}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${postType}:`, error);
    throw error;
  }
}

export async function getCustomPostById(postType: string, id: number) {
  try {
    const response = await axios.get(
      `${WORDPRESS_URL}/wp-json/wp/v2/${postType}/${id}`,
      {
        params: {
          _: Date.now(),
        },
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Categories & Taxonomies
export async function getCategories(postType: string = "post", params?: any) {
  try {
    const response = await wpClient.get(
      postType === "post" ? "/categories" : `/${postType}_category`,
      { params },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Search
export async function searchContent(search: string, postType?: string) {
  try {
    const params: any = { search };
    if (postType) params.type = postType;

    const response = await wpClient.get("/search", { params });
    return response.data;
  } catch (error) {
    console.error("Error searching:", error);
    return [];
  }
}

// Media
export async function getMedia(params?: any) {
  try {
    const response = await wpClient.get("/media", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching media:", error);
    return [];
  }
}

export async function uploadMedia(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await wpClient.post("/media", formData, {
      headers: {
        "Content-Disposition": `attachment; filename="${file.name}"`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading media:", error);
    return null;
  }
}

export async function uploadMediaPage(file: File, token: string) {
  try {
    const formData = new FormData();

    formData.append("file", file);

    const response = await axios.post(`${WORDPRESS_API}/media`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Disposition": `attachment; filename="${file.name}"`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// ACF Fields
export async function getACFFields(postType: string, postId: number) {
  try {
    const response = await axios.get(`${ACF_API}/${postType}/${postId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching ACF fields:", error);
    return null;
  }
}

export async function updateACFFields(
  postType: string,
  postId: number,
  fields: any,
  token: string,
) {
  try {
    const response = await axios.post(
      `${ACF_API}/${postType}/${postId}`,
      fields,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("ACF UPDATE RESPONSE:", JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    console.log("========== ACF UPDATE ERROR ==========");

    console.log("Status:", error.response?.status);

    console.log("Data:", error.response?.data);

    console.log("Headers:", error.response?.headers);

    console.log("======================================");

    throw error;
  }
}

// ===============================
// Authentication
// ===============================

export async function loginWordPress(username: string, password: string) {
  try {
    const response = await axios.post(
      `${WORDPRESS_URL}/wp-json/jwt-auth/v1/token`,
      {
        username,
        password,
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error);

    return null;
  }
}

function authHeader(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// product
export async function getProducts(params?: any) {
  try {
    const response = await wpClient.get("/products", {
      params: {
        _embed: true,
        ...params,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProduct(id: number) {
  try {
    const response = await wpClient.get(`/products/${id}?_embed`);

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createProduct(
  title: string,
  fields: any,
  brand: number,
  jenisProduk: number,
  token: string,
) {
  try {
    const galleryIds = fields.feature_image
      ?.split(/[\n,]+/)
      .map((id: string) => id.trim())
      .filter(Boolean);

    const featuredMedia =
      galleryIds && galleryIds.length > 0 ? Number(galleryIds[0]) : 0;

    const payload = {
      title,
      status: "publish",
      featured_media: featuredMedia,

      // ACF
      acf: fields,

      // Taxonomy
      brand: [Number(brand)],
      "jenis-produk": [Number(jenisProduk)],
    };

    console.log("CREATE PAYLOAD");
    console.log(JSON.stringify(payload, null, 2));

    const response = await axios.post(`${WORDPRESS_API}/products`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("CREATE RESPONSE");
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    console.error("CREATE PRODUCT ERROR");
    console.error(error.response?.data || error);

    return null;
  }
}

export async function updateProduct(
  id: number,
  title: string,
  fields: any,
  brand: number,
  jenisProduk: number,
  token: string,
) {
  try {
    const galleryIds = fields.feature_image
      ?.split(/[\n,]+/)
      .map((id: string) => id.trim())
      .filter(Boolean);

    const featuredMedia =
      galleryIds && galleryIds.length > 0 ? Number(galleryIds[0]) : 0;

    const payload = {
      title,

      featured_media: featuredMedia,

      // ACF
      acf: fields,

      // Taxonomy
      brand: [Number(brand)],
      "jenis-produk": [Number(jenisProduk)],
    };

    console.log("UPDATE PAYLOAD");
    console.log(JSON.stringify(payload, null, 2));

    const response = await axios.post(
      `${WORDPRESS_API}/products/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("UPDATE RESPONSE");
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    console.error("UPDATE PRODUCT ERROR");
    console.error(error.response?.data || error);

    return null;
  }
}

export async function deleteProduct(id: number, token: string) {
  try {
    const response = await axios.delete(
      `${WORDPRESS_API}/products/${id}?force=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function uploadProductImage(file: File, token: string) {
  const formData = new FormData();

  formData.append("file", file);

  try {
    const response = await axios.post(`${WORDPRESS_API}/media`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Disposition": `attachment; filename="${file.name}"`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("========== WORDPRESS ==========");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("HEADERS:", error.response?.headers);
    console.error("MESSAGE:", error.message);
    console.error("===============================");

    return null;
  }
}

// brand

export async function getBrands(params?: any) {
  try {
    const response = await wpClient.get("/brand", {
      params,
    });

    const brands = await Promise.all(
      response.data.map(async (brand: any) => {
        let logo = "";

        if (brand.acf?.brand_logo) {
          try {
            const media = await wpClient.get(`/media/${brand.acf.brand_logo}`);

            logo = media.data.source_url;
          } catch (err) {
            console.error(`Gagal mengambil logo brand ${brand.name}:`, err);
          }
        }

        return {
          ...brand,
          logo,
        };
      }),
    );

    return brands;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

export async function createBrand(
  name: string,
  brand_logo: number | null,
  token: string,
) {
  try {
    const response = await axios.post(
      `${WORDPRESS_API}/brand`,
      {
        name,
        brand_logo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error);
    return null;
  }
}

export async function updateBrand(
  id: number,
  name: string,
  brand_logo: number | null,
  token: string,
) {

  console.log({
    id,
    name,
    brand_logo,
  });
  try {
    const response = await axios.post(
      `${WORDPRESS_API}/brand/${id}`,
      {
        name,
        brand_logo, // kirim langsung ke v2
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log(response.data);

    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error);
    return null;
  }
}

export async function deleteBrand(id: number, token: string) {
  try {
    const response = await axios.delete(
      `${WORDPRESS_API}/brand/${id}?force=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error);

    return null;
  }
}

// jenis-produk

export async function getProductTypes(params?: any) {
  try {
    const response = await wpClient.get("/jenis-produk", {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching product types:", error);
    return [];
  }
}

export async function createProductType(name: string, token: string) {
  try {
    const response = await axios.post(
      `${WORDPRESS_API}/jenis-produk`,
      {
        name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error);

    return null;
  }
}

export async function updateProductType(
  id: number,
  name: string,
  token: string,
) {
  try {
    const response = await axios.put(
      `${WORDPRESS_API}/jenis-produk/${id}`,
      {
        name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log(response.data.meta);
    console.log(response.data.acf);

    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error);

    return null;
  }
}

export async function deleteProductType(id: number, token: string) {
  try {
    const response = await axios.delete(
      `${WORDPRESS_API}/jenis-produk/${id}?force=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error.response?.data || error);

    return null;
  }
}

// news

export async function getPosts() {
  try {
    const response = await axios.get(
      `${WORDPRESS_URL}/wp-json/wp/v2/berita?_embed&per_page=100`,
      {
        headers: {
          "Cache-Control": "no-cache",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPost(id: number) {
  try {
    const response = await axios.get(
      `${WORDPRESS_URL}/wp-json/wp/v2/berita/${id}?_embed`,
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createPost(title: string, fields: any, token: string) {
  try {
    const response = await axios.post(
      `${WORDPRESS_URL}/wp-json/wp/v2/berita`,
      {
        title,
        content: fields.content,
        excerpt: fields.excerpt,
        status: fields.status ?? "publish",

        featured_media: fields.featured_media,

        categories: fields.categories ?? [],

        tags: fields.tags ?? [],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error.response?.data);
    return null;
  }
}

export async function updatePost(
  id: number,
  title: string,
  fields: any,
  token: string,
) {
  try {
    const response = await axios.post(
      `${WORDPRESS_URL}/wp-json/wp/v2/berita/${id}`,
      {
        title,
        content: fields.content,
        excerpt: fields.excerpt,
        status: fields.status,

        featured_media: fields.featured_media,

        categories: fields.categories ?? [],

        tags: fields.tags ?? [],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error.response?.data);
    return null;
  }
}

export async function deletePost(id: number, token: string) {
  try {
    const response = await axios.delete(
      `${WORDPRESS_URL}/wp-json/wp/v2/berita/${id}?force=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error.response?.data);
    return null;
  }
}

export async function getPostCategories() {
  try {
    const response = await axios.get(
      `${WORDPRESS_URL}/wp-json/wp/v2/kategori?per_page=100`,
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// ===============================
// POST CATEGORIES
// ===============================

export async function createPostCategory(name: string, token: string) {
  try {
    const response = await axios.post(
      `${WORDPRESS_URL}/wp-json/wp/v2/kategori`,
      {
        name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error.response?.data);
    return null;
  }
}

export async function updatePostCategory(
  id: number,
  name: string,
  token: string,
) {
  try {
    const response = await axios.post(
      `${WORDPRESS_URL}/wp-json/wp/v2/kategori/${id}`,
      {
        name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error.response?.data);
    return null;
  }
}

export async function deletePostCategory(id: number, token: string) {
  try {
    const response = await axios.delete(
      `${WORDPRESS_URL}/wp-json/wp/v2/kategori/${id}?force=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error.response?.data);
    return null;
  }
}

export async function getPostTags() {
  const res = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/tags`);

  return res.data;
}

export async function createPostTag(name: string, token: string) {
  const res = await axios.post(
    `${WORDPRESS_URL}/wp-json/wp/v2/tags`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
}

export async function updatePostTag(id: number, name: string, token: string) {
  const res = await axios.post(
    `${WORDPRESS_URL}/wp-json/wp/v2/tags/${id}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
}

export async function deletePostTag(id: number, token: string) {
  const res = await axios.delete(`${WORDPRESS_URL}/wp-json/wp/v2/tags/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function getPostBySlug(slug: string) {
  try {
    const response = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/posts`, {
      params: {
        slug,
        _embed: true,
      },
    });

    return response.data[0] ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updatePostACF(id: number, fields: any, token: string) {
  try {
    console.log("UPDATE ACF PAYLOAD:", fields);

    const response = await axios.post(
      `${ACF_API}/posts/${id}`,
      {
        fields,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("UPDATE ACF SUCCESS:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("UPDATE ACF ERROR:", error.response?.data);

    throw error;
  }
}
