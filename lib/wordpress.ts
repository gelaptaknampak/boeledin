import axios from "axios";

const WORDPRESS_URL = "https://wp.boeledin.com";
const WORDPRESS_API = `${WORDPRESS_URL}/wp-json/wp/v2`;
const ACF_API = `${WORDPRESS_URL}/wp-json/acf/v3`;
const BOELEDIN_API = `${WORDPRESS_URL}/wp-json/boeledin/v1`;

export type LangCode = "id" | "en";
const DEFAULT_LANG: LangCode = "id";

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

export async function getPostById(id: number, lang: LangCode = DEFAULT_LANG) {
  try {
    const response = await wpClient.get(`${BOELEDIN_API}/posts/${id}`, {
      params: { lang },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function getPostSection(
  id: number,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const post = await getPostById(id, lang);

    if (!post) {
      return null;
    }

    return post;
  } catch (error) {
    console.error("Error fetching post section:", error);
    return null;
  }
}

export async function getPages(params?: any, lang: LangCode = DEFAULT_LANG) {
  try {
    const response = await wpClient.get("/pages", {
      params: { per_page: 100, lang, ...params },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pages:", error);
    return [];
  }
}

export async function getPagesCount(lang: LangCode = DEFAULT_LANG) {
  try {
    const response = await wpClient.get("/pages", {
      params: { per_page: 1, lang },
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    return Number(response.headers["x-wp-total"] || 0);
  } catch (error) {
    console.error("Error fetching pages count:", error);
    return 0;
  }
}

export async function getPageById(id: number, lang: LangCode = DEFAULT_LANG) {
  try {
    const response = await wpClient.get(`/pages/${id}`, { params: { lang } });
    return response.data;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

// Custom Post Types (Products, News)
export async function getCustomPosts(
  postType: string,
  params?: any,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const response = await wpClient.get(`/${postType}`, {
      params: { per_page: 100, lang, ...params },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${postType}:`, error);
    throw error;
  }
}

export async function getCustomPostsCount(
  postType: string,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const response = await axios.get(
      `${WORDPRESS_URL}/wp-json/wp/v2/${postType}`,
      {
        params: { per_page: 1, lang },
        headers: {
          "Cache-Control": "no-cache",
        },
      },
    );
    return Number(response.headers["x-wp-total"] || 0);
  } catch (error) {
    console.error(`Error fetching ${postType} count:`, error);
    return 0;
  }
}

export async function getCustomPostById(
  postType: string,
  id: number,
  params?: any,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const response = await axios.get(
      `${WORDPRESS_URL}/wp-json/wp/v2/${postType}/${id}`,
      {
        params: {
          lang,
          ...params,
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
export async function getCategories(
  postType: string = "post",
  params?: any,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const response = await wpClient.get(
      postType === "post" ? "/categories" : `/${postType}_category`,
      { params: { lang, ...params } },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Search
export async function searchContent(
  search: string,
  postType?: string,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const params: any = { search, lang };
    if (postType) params.type = postType;

    const response = await wpClient.get("/search", { params });
    return response.data;
  } catch (error) {
    console.error("Error searching:", error);
    return [];
  }
}

// Media
export async function getMedia(params?: any, lang: LangCode = DEFAULT_LANG) {
  try {
    const response = await wpClient.get("/media", {
      params: { lang, ...params },
    });
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

export async function updateACFTerm(
  taxonomy: string,
  termId: number,
  fields: any,
  token: string,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const response = await axios.put(
      `${BOELEDIN_API}/terms/${taxonomy}/${termId}`,
      {
        fields,
      },
      {
        params: { lang },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("========== UPDATE ACF TERM SUCCESS ==========");

    console.log("TAXONOMY:", taxonomy);

    console.log("TERM ID:", termId);

    console.log("LANG:", lang);

    console.log("FIELDS:", JSON.stringify(fields, null, 2));

    console.log("RESPONSE:", JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    console.error("========== UPDATE ACF TERM ERROR ==========");

    console.error("URL:", error.config?.url);

    console.error("METHOD:", error.config?.method);

    console.error("PARAMS:", error.config?.params);

    console.error("REQUEST:", error.config?.data);

    console.error("STATUS:", error.response?.status);

    console.error("RESPONSE:", JSON.stringify(error.response?.data, null, 2));

    console.error("============================================");

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
export async function getProducts(lang: LangCode = DEFAULT_LANG, params?: any) {
  try {
    const response = await wpClient.get("/products", {
      params: {
        _embed: true,
        lang,
        ...params,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
export async function getProduct(id: number, lang: LangCode = DEFAULT_LANG) {
  try {
    const response = await wpClient.get(`/products/${id}`, {
      params: {
        _embed: true,
        lang,
      },
    });

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
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const galleryIds = fields.feature_image
      ?.split(/[\n,]+/)
      .map((id: string) => id.trim())
      .filter(Boolean);

    const featuredMedia =
      galleryIds && galleryIds.length > 0 ? Number(galleryIds[0]) : 0;

    /**
     * =====================================================
     * CREATE PRODUCT UTAMA
     * =====================================================
     *
     * Product dibuat menggunakan bahasa yang diminta.
     */
    const payload = {
      title,
      status: "publish",
      featured_media: featuredMedia,

      acf: fields,

      brand: [Number(brand)],
      "jenis-produk": [Number(jenisProduk)],
    };

    console.log("CREATE PRODUCT");
    console.log("Language:", lang);
    console.log(JSON.stringify(payload, null, 2));

    const response = await axios.post(`${WORDPRESS_API}/products`, payload, {
      params: { lang },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const createdProduct = response.data;

    console.log("CREATED PRODUCT");
    console.log(JSON.stringify(createdProduct, null, 2));

    const sourceId = Number(createdProduct.id);

    if (!sourceId) {
      throw new Error("Product berhasil dibuat tetapi ID tidak ditemukan.");
    }

    /**
     * =====================================================
     * CREATE TRANSLATION COUNTERPART
     * =====================================================
     *
     * Jika create EN:
     *   EN = product utama
     *   ID = counterpart
     *
     * Jika create ID:
     *   ID = product utama
     *   EN = counterpart
     */
    const counterpartLang: LangCode = lang === "en" ? "id" : "en";

    /**
     * Untuk sementara counterpart menggunakan
     * data yang sama.
     *
     * User nantinya dapat mengedit counterpart
     * menggunakan bahasa masing-masing.
     */
    const counterpartPayload = {
      title,
      status: "publish",
      featured_media: featuredMedia,

      acf: fields,

      brand: [Number(brand)],
      "jenis-produk": [Number(jenisProduk)],
    };

    console.log("CREATE COUNTERPART");
    console.log("Language:", counterpartLang);

    const counterpartResponse = await axios.post(
      `${WORDPRESS_API}/products`,
      counterpartPayload,
      {
        params: {
          lang: counterpartLang,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const counterpart = counterpartResponse.data;

    const counterpartId = Number(counterpart.id);

    if (!counterpartId) {
      throw new Error("Counterpart berhasil dibuat tetapi ID tidak ditemukan.");
    }

    console.log("COUNTERPART CREATED");
    console.log(JSON.stringify(counterpart, null, 2));

    /**
     * =====================================================
     * HUBUNGKAN DENGAN POLYLANG
     * =====================================================
     *
     * Kita menggunakan endpoint custom:
     *
     * /wp-json/boeledin/v1/products/{id}/translation
     *
     * Endpoint ini nantinya bertugas menghubungkan
     * kedua post menggunakan pll_set_post_language()
     * dan pll_save_post_translations().
     */

    await axios.post(
      `${WORDPRESS_URL}/wp-json/boeledin/v1/products/${sourceId}/translation`,
      {
        source_language: lang,
        target_language: counterpartLang,
        target_id: counterpartId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("PRODUCT TRANSLATIONS LINKED");

    /**
     * Kembalikan product yang dibuat
     * sebagai product utama.
     */
    return {
      ...createdProduct,

      translations: {
        [lang]: sourceId,
        [counterpartLang]: counterpartId,
      },
    };
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
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    /**
     * =====================================================
     * RESOLVE TRANSLATION ID
     * =====================================================
     *
     * Misalnya:
     *
     * id = 525
     * lang = id
     *
     * maka API akan mencari:
     *
     * 525 -> translations -> id -> 526
     *
     * dan yang di-update adalah 526.
     */

    const translationResponse = await axios.get(
      `${WORDPRESS_URL}/wp-json/boeledin/v1/products/${id}`,
      {
        params: {
          lang,
        },
      },
      // optional
    );

    const product = translationResponse.data;

    const targetId = Number(product.id);

    if (!targetId) {
      throw new Error("Translation product ID tidak ditemukan.");
    }

    console.log("UPDATE PRODUCT");

    console.log("Requested ID:", id);

    console.log("Requested language:", lang);

    console.log("Resolved ID:", targetId);

    /**
     * =====================================================
     * GALLERY
     * =====================================================
     */

    const galleryIds = fields.feature_image
      ?.split(/[\n,]+/)
      .map((id: string) => id.trim())
      .filter(Boolean);

    const featuredMedia =
      galleryIds && galleryIds.length > 0 ? Number(galleryIds[0]) : 0;

    /**
     * =====================================================
     * UPDATE PAYLOAD
     * =====================================================
     */

    const payload = {
      title,

      featured_media: featuredMedia,

      acf: fields,

      brand: [Number(brand)],

      "jenis-produk": [Number(jenisProduk)],
    };

    console.log("UPDATE PAYLOAD");

    console.log(JSON.stringify(payload, null, 2));

    /**
     * =====================================================
     * UPDATE TRANSLATION PRODUCT
     * =====================================================
     */

    const response = await axios.post(
      `${WORDPRESS_API}/products/${targetId}`,
      payload,
      {
        params: {
          lang,
        },

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

  formData.append("file", file, file.name);

  const startTime = Date.now();

  try {
    console.log("========== WORDPRESS MEDIA UPLOAD ==========");
    console.log("FILE NAME:", file.name);
    console.log("FILE SIZE:", file.size, "bytes");
    console.log("FILE TYPE:", file.type);

    const response = await axios.post(`${WORDPRESS_API}/media`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Disposition": `attachment; filename="${file.name}"`,
      },

      // Beri waktu maksimal 5 menit untuk proses upload
      timeout: 300000,

      // Jangan batasi ukuran request/response dari sisi Axios
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const duration = Date.now() - startTime;

    console.log("========== WORDPRESS MEDIA SUCCESS ==========");
    console.log("STATUS:", response.status);
    console.log("MEDIA ID:", response.data?.id);
    console.log("SOURCE URL:", response.data?.source_url);
    console.log("UPLOAD TIME:", `${duration}ms`);
    console.log("=============================================");

    return response.data;
  } catch (error: any) {
    const duration = Date.now() - startTime;

    console.error("========== WORDPRESS MEDIA ERROR ==========");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);
    console.error("CODE:", error.code);
    console.error("UPLOAD TIME:", `${duration}ms`);
    console.error("URL:", error.config?.url);
    console.error("=============================================");

    // Jangan ubah error menjadi null.
    // Lempar kembali agar route bisa mengetahui
    // error asli dari WordPress/Hostinger.
    throw error;
  }
}

// brand

export async function getBrands(params?: any, lang: LangCode = DEFAULT_LANG) {
  try {
    const response = await wpClient.get(`${BOELEDIN_API}/terms/brand`, {
      params: {
        lang,
        ...params,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

export async function createBrand(
  name: string,
  brand_logo: number | null,
  token: string,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const fields: Record<string, any> = {};

    if (brand_logo !== null && brand_logo !== undefined) {
      fields.brand_logo = Number(brand_logo);
    }

    console.log("========== CREATE BRAND ==========");
    console.log("NAME:", name);
    console.log("LANG:", lang);
    console.log("BRAND LOGO:", brand_logo);
    console.log("FIELDS:", JSON.stringify(fields, null, 2));

    const response = await axios.post(
      `${BOELEDIN_API}/terms/brand`,
      {
        name,
        fields,
      },
      {
        params: { lang },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("========== CREATE BRAND SUCCESS ==========");
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    console.error("========== CREATE BRAND ERROR ==========");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("=========================================");

    throw error;
  }
}

export async function updateBrand(
  id: number,
  name: string,
  brand_logo: number | null | undefined,
  token: string,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const fields: Record<string, any> = {};

    if (brand_logo !== undefined && brand_logo !== null) {
      fields.brand_logo = Number(brand_logo);
    }

    console.log("========== UPDATE BRAND ==========");
    console.log("ID:", id);
    console.log("NAME:", name);
    console.log("LANG:", lang);
    console.log("BRAND LOGO:", brand_logo);
    console.log("FIELDS:", JSON.stringify(fields, null, 2));

    const response = await axios.put(
      `${BOELEDIN_API}/terms/brand/${id}`,
      {
        name,
        fields,
      },
      {
        params: { lang },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("========== UPDATE BRAND SUCCESS ==========");

    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    console.error("========== UPDATE BRAND ERROR ==========");

    console.error("STATUS:", error.response?.status);

    console.error("DATA:", JSON.stringify(error.response?.data, null, 2));

    throw error;
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

export async function getProductTypes(
  params?: any,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const response = await wpClient.get(`${BOELEDIN_API}/terms/jenis-produk`, {
      params: {
        lang,
        ...params,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching product types:", error);

    return [];
  }
}

export async function createProductType(
  name: string,
  token: string,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const response = await axios.post(
      `${BOELEDIN_API}/terms/jenis-produk`,
      {
        name,
      },
      {
        params: { lang },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("CREATE PRODUCT TYPE ERROR:", error.response?.data || error);

    throw error;
  }
}

export async function updateProductType(
  id: number,
  name: string,
  token: string,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const response = await axios.put(
      `${BOELEDIN_API}/terms/jenis-produk/${id}`,
      {
        name,
      },
      {
        params: { lang },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("UPDATE PRODUCT TYPE ERROR:", error.response?.data || error);

    throw error;
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

// news / berita

export async function getPosts(lang: LangCode = DEFAULT_LANG, token?: string) {
  try {
    const response = await axios.get(
      `${WORDPRESS_URL}/wp-json/boeledin/v1/berita`,
      {
        params: {
          lang,
          // Kalau ada token (request dari admin CMS), minta juga
          // status non-publish. Endpoint custom di WP perlu
          // menghormati parameter ini + Authorization header
          // supaya draft/pending ikut kebaca.
          ...(token ? { status: "publish,draft,pending,future,private" } : {}),
        },
        headers: {
          "Cache-Control": "no-cache",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("GET BERITA ERROR:", error.response?.data || error);

    return [];
  }
}

export async function getPost(
  id: number,
  lang: LangCode = DEFAULT_LANG,
  token?: string,
) {
  try {
    const response = await axios.get(
      `${WORDPRESS_URL}/wp-json/boeledin/v1/berita/${id}`,
      {
        params: {
          lang,
          _: Date.now(),
          ...(token ? { status: "publish,draft,pending,future,private" } : {}),
        },
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("GET BERITA BY ID ERROR:", error.response?.data || error);

    return null;
  }
}

export async function getPostsCount(lang: LangCode = DEFAULT_LANG) {
  try {
    const response = await axios.get(
      `${WORDPRESS_URL}/wp-json/boeledin/v1/berita`,
      {
        params: {
          lang,
        },
        headers: {
          "Cache-Control": "no-cache",
        },
      },
    );

    /*
     * Custom endpoint mengembalikan array berita,
     * bukan header x-wp-total seperti wp/v2.
     */
    return Array.isArray(response.data) ? response.data.length : 0;
  } catch (error) {
    console.error("Error fetching berita count:", error);
    return 0;
  }
}

export async function createPost(
  title: string,
  fields: any,
  token: string,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const payload = {
      title,
      content: fields.content ?? "",
      excerpt: fields.excerpt ?? "",
      status: fields.status ?? "publish",
      featured_media: fields.featured_media ?? 0,

      // taxonomy custom berita
      kategori: Array.isArray(fields.kategori)
        ? fields.kategori.map(Number).filter((id: number) => id > 0)
        : [],

      tags: Array.isArray(fields.tags)
        ? fields.tags.map(Number).filter((id: number) => id > 0)
        : [],
    };

    console.log("========== CREATE BERITA ==========");
    console.log("LANG:", lang);
    console.log("TITLE:", title);
    console.log("PAYLOAD:", JSON.stringify(payload, null, 2));

    const response = await axios.post(
      `${WORDPRESS_URL}/wp-json/boeledin/v1/berita`,
      payload,
      {
        params: {
          lang,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log(
      "CREATE BERITA SUCCESS:",
      JSON.stringify(response.data, null, 2),
    );

    return response.data;
  } catch (error: any) {
    console.error("========== CREATE BERITA ERROR ==========");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", JSON.stringify(error.response?.data, null, 2));
    console.error("MESSAGE:", error.message);
    console.error("URL:", error.config?.url);
    console.error("METHOD:", error.config?.method);
    console.error("REQUEST DATA:", error.config?.data);
    console.error("=========================================");

    return null;
  }
}

export async function updatePost(
  id: number,
  title: string,
  fields: any,
  token: string,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const response = await axios.post(
      `${WORDPRESS_URL}/wp-json/boeledin/v1/berita/${id}`,
      {
        title,
        content: fields.content ?? "",
        excerpt: fields.excerpt ?? "",
        status: fields.status ?? "publish",

        featured_media: Number(fields.featured_media ?? 0),

        kategori: Array.isArray(fields.kategori) ? fields.kategori : [],

        tags: Array.isArray(fields.tags) ? fields.tags : [],
      },
      {
        params: {
          lang,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Error updating berita:", error.response?.data || error);

    return null;
  }
}

export async function deletePost(id: number, token: string) {
  try {
    const response = await axios.delete(
      `${WORDPRESS_URL}/wp-json/boeledin/v1/berita/${id}`,
      {
        params: {
          force: true,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Error deleting berita:", error.response?.data || error);

    return null;
  }
}

export async function getPostCategories(lang: LangCode = DEFAULT_LANG) {
  try {
    const response = await axios.get(
      `${WORDPRESS_URL}/wp-json/wp/v2/kategori`,
      {
        params: {
          per_page: 100,
          lang,
        },
      },
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

export async function createPostCategory(
  name: string,
  token: string,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const response = await axios.post(
      `${WORDPRESS_URL}/wp-json/wp/v2/kategori`,
      {
        name,
      },
      {
        params: { lang },
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
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const response = await axios.post(
      `${WORDPRESS_URL}/wp-json/wp/v2/kategori/${id}`,
      {
        name,
      },
      {
        params: { lang },
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

export async function getPostTags(lang: LangCode = DEFAULT_LANG) {
  const res = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/tags`, {
    params: { lang },
  });

  return res.data;
}

export async function createPostTag(
  name: string,
  token: string,
  lang: LangCode = DEFAULT_LANG,
) {
  const res = await axios.post(
    `${WORDPRESS_URL}/wp-json/wp/v2/tags`,
    { name },
    {
      params: { lang },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
}

export async function updatePostTag(
  id: number,
  name: string,
  token: string,
  lang: LangCode = DEFAULT_LANG,
) {
  const res = await axios.post(
    `${WORDPRESS_URL}/wp-json/wp/v2/tags/${id}`,
    { name },
    {
      params: { lang },
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

export async function getPostBySlug(
  slug: string,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    const response = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/posts`, {
      params: {
        slug,
        _embed: true,
        lang,
      },
    });

    return response.data[0] ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updatePostACF(
  id: number,
  fields: any,
  token: string,
  lang: LangCode = DEFAULT_LANG,
) {
  try {
    console.log("UPDATE POST ACF PAYLOAD:", fields);

    const response = await axios.post(
      `${BOELEDIN_API}/posts/${id}`,
      {
        fields,
      },
      {
        params: { lang },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("UPDATE POST ACF SUCCESS:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("UPDATE POST ACF ERROR:", error.response?.data || error);

    throw error;
  }
}
