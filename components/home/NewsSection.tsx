"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

type Props = {
  data: any;
};

const WORDPRESS_URL = "https://wp.boeledin.com";

/*
 * =========================================================
 * HTML HELPERS
 * =========================================================
 */

function stripHtmlAndDecode(html: string): string {
  if (!html) return "";

  const withoutTags = html.replace(/<[^>]*>/g, "");

  if (typeof window === "undefined") {
    return withoutTags.trim();
  }

  const el = document.createElement("textarea");
  el.innerHTML = withoutTags;

  return el.value.trim();
}

function getRenderedText(value: any): string {
  if (
    value &&
    typeof value === "object" &&
    "rendered" in value
  ) {
    return stripHtmlAndDecode(value.rendered ?? "");
  }

  if (typeof value === "string") {
    return stripHtmlAndDecode(value);
  }

  return "";
}

/*
 * =========================================================
 * GET IMAGE URL
 * =========================================================
 *
 * Mencoba beberapa kemungkinan struktur response WordPress.
 */

function getImageFromPost(post: any): string | null {
  /*
   * 1. _embedded featured media
   *
   * Jika endpoint WordPress menggunakan ?_embed,
   * biasanya image ada di:
   *
   * post._embedded["wp:featuredmedia"][0].source_url
   */

  const embeddedFeaturedMedia =
    post?._embedded?.["wp:featuredmedia"];

  if (
    Array.isArray(embeddedFeaturedMedia) &&
    embeddedFeaturedMedia.length > 0
  ) {
    const media = embeddedFeaturedMedia[0];

    if (typeof media?.source_url === "string") {
      return media.source_url;
    }

    if (
      typeof media?.media_details?.sizes?.large?.source_url ===
      "string"
    ) {
      return media.media_details.sizes.large.source_url;
    }

    if (
      typeof media?.media_details?.sizes?.medium_large
        ?.source_url === "string"
    ) {
      return media.media_details.sizes.medium_large.source_url;
    }

    if (
      typeof media?.media_details?.sizes?.medium?.source_url ===
      "string"
    ) {
      return media.media_details.sizes.medium.source_url;
    }
  }

  /*
   * 2. Custom API featured image
   */

  if (
    typeof post?.featured_image === "string" &&
    post.featured_image.trim()
  ) {
    return post.featured_image;
  }

  if (
    typeof post?.featured_image_url === "string" &&
    post.featured_image_url.trim()
  ) {
    return post.featured_image_url;
  }

  /*
   * 3. Object featured image
   */

  if (
    post?.featured_image &&
    typeof post.featured_image === "object"
  ) {
    return (
      post.featured_image.source_url ??
      post.featured_image.url ??
      post.featured_image.src ??
      null
    );
  }

  /*
   * 4. Generic image fields
   */

  if (
    typeof post?.image === "string" &&
    post.image.trim()
  ) {
    return post.image;
  }

  if (
    typeof post?.image_url === "string" &&
    post.image_url.trim()
  ) {
    return post.image_url;
  }

  /*
   * 5. Thumbnail
   */

  if (
    typeof post?.thumbnail === "string" &&
    post.thumbnail.trim()
  ) {
    return post.thumbnail;
  }

  if (
    typeof post?.thumbnail_url === "string" &&
    post.thumbnail_url.trim()
  ) {
    return post.thumbnail_url;
  }

  /*
   * Tidak ditemukan
   */

  return null;
}

/*
 * =========================================================
 * GET AUTHOR NAME
 * =========================================================
 */

function getAuthorName(post: any): string {
  /*
   * 1. Embedded WordPress author
   */

  const embeddedAuthors =
    post?._embedded?.author;

  if (
    Array.isArray(embeddedAuthors) &&
    embeddedAuthors.length > 0
  ) {
    const author = embeddedAuthors[0];

    if (
      typeof author?.name === "string" &&
      author.name.trim()
    ) {
      return author.name.trim();
    }

    if (
      typeof author?.slug === "string" &&
      author.slug.trim()
    ) {
      return author.slug.trim();
    }
  }

  /*
   * 2. Custom API author fields
   */

  const possibleAuthors = [
    post?.author_name,
    post?.authorName,
    post?.author?.name,
    post?.author?.display_name,
    post?.author?.displayName,
    post?.author?.rendered,
    post?.acf?.author_name,
    post?.acf?.author,
  ];

  for (const author of possibleAuthors) {
    if (
      typeof author === "string" &&
      author.trim()
    ) {
      return stripHtmlAndDecode(author);
    }
  }

  /*
   * 3. Default
   */

  return "BOELEDIN";
}

/*
 * =========================================================
 * GET PUBLISHED DATE
 * =========================================================
 */

function getPublishedDate(post: any): string | null {
  const rawDate =
    post?.date ??
    post?.date_gmt ??
    post?.published_at ??
    post?.publishedAt ??
    post?.publish_date ??
    post?.published_date;

  if (!rawDate) {
    return null;
  }

  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString(
    languageForDate(post),
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

/*
 * Digunakan hanya untuk format tanggal.
 * Default English karena component akan memakai
 * language dari useTranslation pada render.
 */

function languageForDate(post: any): string {
  return post?.__language === "id"
    ? "id-ID"
    : "en-US";
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function NewsSection({ data }: Props) {
  const { language } = useTranslation();

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /*
   * =========================================================
   * HEADER DATA
   * =========================================================
   */

  const eyebrow =
    data?.news_eyebrow ??
    data?.eyebrow ??
    "";

  const title =
    data?.news_title ??
    data?.title ??
    "";

  const description =
    data?.news_description ??
    data?.description ??
    "";

  /*
   * =========================================================
   * RAW NEWS DATA
   * =========================================================
   */

  const rawArticles = useMemo(() => {
    const possibleValues = [
      data?.articles,
      data?.selected_articles,
      data?.news_articles,
      data?.selected_news,
      data?.news_showcase_articles,
      data?.news_showcase_news,

      data?.acf?.articles,
      data?.acf?.selected_articles,
      data?.acf?.news_articles,
      data?.acf?.selected_news,
      data?.acf?.news_showcase_articles,
      data?.acf?.news_showcase_news,

      data?.acf?.news_section?.articles,
      data?.acf?.news_section?.news_articles,
      data?.acf?.news_section?.selected_articles,
    ];

    const found = possibleValues.find(
      (value) =>
        value !== undefined &&
        value !== null &&
        value !== ""
    );

    return found ?? [];
  }, [data]);

  /*
   * =========================================================
   * NORMALIZE ARTICLE IDS
   * =========================================================
   */

  const selectedArticleIds = useMemo(() => {
    if (
      rawArticles === null ||
      rawArticles === undefined ||
      rawArticles === ""
    ) {
      return [];
    }

    const normalizeId = (
      item: any
    ): number | null => {
      if (typeof item === "number") {
        return item > 0 ? item : null;
      }

      if (typeof item === "string") {
        const trimmed = item.trim();

        if (!trimmed) {
          return null;
        }

        const id = Number(trimmed);

        return Number.isFinite(id) && id > 0
          ? id
          : null;
      }

      if (
        item &&
        typeof item === "object"
      ) {
        const possibleId =
          item.id ??
          item.ID ??
          item.value ??
          item.post_id ??
          item.postId ??
          item.article_id ??
          item.articleId;

        const id = Number(possibleId);

        if (
          Number.isFinite(id) &&
          id > 0
        ) {
          return id;
        }

        if (
          item.post &&
          typeof item.post === "object"
        ) {
          const nestedId = Number(
            item.post.id ??
            item.post.ID ??
            item.post.value
          );

          if (
            Number.isFinite(nestedId) &&
            nestedId > 0
          ) {
            return nestedId;
          }
        }

        if (
          item.article &&
          typeof item.article === "object"
        ) {
          const nestedId = Number(
            item.article.id ??
            item.article.ID ??
            item.article.value
          );

          if (
            Number.isFinite(nestedId) &&
            nestedId > 0
          ) {
            return nestedId;
          }
        }
      }

      return null;
    };

    if (Array.isArray(rawArticles)) {
      return rawArticles
        .map(normalizeId)
        .filter(
          (id): id is number =>
            id !== null
        );
    }

    const id = normalizeId(rawArticles);

    return id !== null
      ? [id]
      : [];
  }, [rawArticles]);

  /*
   * =========================================================
   * DEBUG
   * =========================================================
   */

  useEffect(() => {
    console.group(
      "===== NEWS SECTION DEBUG ====="
    );

    console.log("DATA:", data);
    console.log(
      "RAW ARTICLES:",
      rawArticles
    );
    console.log(
      "SELECTED ARTICLE IDS:",
      selectedArticleIds
    );

    console.groupEnd();
  }, [
    data,
    rawArticles,
    selectedArticleIds,
  ]);

  /*
   * =========================================================
   * FETCH SELECTED ARTICLES
   * =========================================================
   */

  useEffect(() => {
    let cancelled = false;

    async function fetchSelectedArticles() {
      if (
        selectedArticleIds.length === 0
      ) {
        if (!cancelled) {
          setArticles([]);
          setLoading(false);
        }

        return;
      }

      try {
        if (!cancelled) {
          setLoading(true);
        }

        const include =
          selectedArticleIds.join(",");

        /*
         * _embed=1 SANGAT PENTING
         *
         * Supaya WordPress mengembalikan:
         *
         * _embedded.wp:featuredmedia
         * _embedded.author
         */

        const url =
          `/api/wordpress/posts` +
          `?lang=${encodeURIComponent(
            language
          )}` +
          `&include=${encodeURIComponent(
            include
          )}` +
          `&_embed=1`;

        console.log(
          "NEWS SECTION API URL:",
          url
        );

        const res = await fetch(
          url,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          const errorText =
            await res.text();

          console.error(
            "NEWS SECTION API ERROR:",
            errorText
          );

          throw new Error(
            `Gagal mengambil berita (${res.status})`
          );
        }

        const result =
          await res.json();

        console.log(
          "NEWS SECTION API RESULT:",
          result
        );

        const allPosts =
          Array.isArray(result)
            ? result
            : Array.isArray(result?.data)
            ? result.data
            : [];

        /*
         * ORDER SESUAI CMS
         */

        const orderedPosts =
          selectedArticleIds
            .map((selectedId) =>
              allPosts.find(
                (post: any) =>
                  Number(post?.id) ===
                  Number(selectedId)
              )
            )
            .filter(Boolean);

        /*
         * RESOLVE IMAGE
         */

        const articlesWithImage =
          orderedPosts.map(
            (post: any) => {
              const imageUrl =
                getImageFromPost(post);

              console.log(
                `NEWS IMAGE [${post?.id}]:`,
                {
                  featured_media:
                    post?.featured_media,

                  embedded:
                    post?._embedded?.[
                      "wp:featuredmedia"
                    ],

                  featured_image:
                    post?.featured_image,

                  resolvedImage:
                    imageUrl,
                }
              );

              /*
               * Tandai language supaya format tanggal
               * bisa konsisten.
               */

              return {
                ...post,
                __language: language,
                resolvedImage:
                  imageUrl,
              };
            }
          );

        /*
         * FALLBACK:
         *
         * Jika API tidak mengembalikan image,
         * coba ambil berdasarkan featured_media.
         */

        const finalArticles =
          await Promise.all(
            articlesWithImage.map(
              async (post: any) => {
                if (
                  post.resolvedImage
                ) {
                  return post;
                }

                const mediaId = Number(
                  post?.featured_media
                );

                if (
                  !Number.isFinite(
                    mediaId
                  ) ||
                  mediaId <= 0
                ) {
                  return post;
                }

                let imageUrl:
                  | string
                  | null = null;

                /*
                 * Proxy CMS
                 */

                try {
                  const mediaRes =
                    await fetch(
                      `/api/wordpress/media/page/${mediaId}`,
                      {
                        cache:
                          "no-store",
                      }
                    );

                  if (mediaRes.ok) {
                    const media =
                      await mediaRes.json();

                    imageUrl =
                      media?.source_url ??
                      media?.url ??
                      null;
                  }
                } catch (error) {
                  console.warn(
                    "NEWS IMAGE PROXY ERROR:",
                    mediaId,
                    error
                  );
                }

                /*
                 * Fallback direct WordPress.
                 *
                 * NOTE:
                 * URL di sini sekarang benar.
                 */

                if (!imageUrl) {
                  try {
                    const mediaRes =
                      await fetch(
                        `${WORDPRESS_URL}/wp-json/wp/v2/media/${mediaId}`,
                        {
                          cache:
                            "no-store",
                        }
                      );

                    if (mediaRes.ok) {
                      const media =
                        await mediaRes.json();

                      imageUrl =
                        media?.source_url ??
                        null;
                    }
                  } catch (error) {
                    console.warn(
                      "NEWS DIRECT IMAGE ERROR:",
                      mediaId,
                      error
                    );
                  }
                }

                return {
                  ...post,
                  resolvedImage:
                    imageUrl,
                };
              }
            )
          );

        if (!cancelled) {
          setArticles(
            finalArticles
          );
        }
      } catch (error) {
        console.error(
          "NEWS SECTION ERROR:",
          error
        );

        if (!cancelled) {
          setArticles([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSelectedArticles();

    return () => {
      cancelled = true;
    };
  }, [
    language,
    selectedArticleIds,
  ]);

  /*
   * =========================================================
   * CATEGORY
   * =========================================================
   */

  function getCategoryName(
    post: any
  ): string | null {
    if (
      typeof post?.kategori_name ===
        "string" &&
      post.kategori_name
    ) {
      return post.kategori_name;
    }

    if (
      typeof post?.category_name ===
        "string" &&
      post.category_name
    ) {
      return post.category_name;
    }

    const embeddedTerms =
      post?._embedded?.["wp:term"];

    if (
      Array.isArray(
        embeddedTerms
      )
    ) {
      const flat =
        embeddedTerms.flat();

      const term = flat.find(
        (item: any) =>
          item?.taxonomy ===
            "kategori" ||
          item?.taxonomy ===
            "category"
      );

      if (term?.name) {
        return term.name;
      }
    }

    return null;
  }

  /*
   * =========================================================
   * PUBLISHED INFO
   * =========================================================
   */

  function getPublishedInfo(
    post: any
  ): string {
    const rawDate =
      post?.date ??
      post?.date_gmt ??
      post?.published_at ??
      post?.publishedAt ??
      post?.publish_date ??
      post?.published_date;

    const author =
      getAuthorName(post);

    let formattedDate =
      "";

    if (rawDate) {
      const date = new Date(
        rawDate
      );

      if (
        !Number.isNaN(
          date.getTime()
        )
      ) {
        formattedDate =
          date.toLocaleDateString(
            language === "en"
              ? "en-US"
              : "id-ID",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          );
      }
    }

    /*
     * EN
     *
     * Published Jan 15, 2026 · by Admin
     *
     * ID
     *
     * Dipublikasikan 15 Jan 2026 · oleh Admin
     */

    if (language === "en") {
      if (formattedDate) {
        return `Published ${formattedDate} · by ${author}`;
      }

      return `Published · by ${author}`;
    }

    if (formattedDate) {
      return `Dipublikasikan ${formattedDate} · oleh ${author}`;
    }

    return `Dipublikasikan · oleh ${author}`;
  }

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <section className="py-14 sm:py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-10 max-w-3xl sm:mb-14 md:mb-16">

            {eyebrow && (
              <div className="mb-4 inline-flex rounded-full bg-accent px-3 py-2 text-xs font-semibold text-primary sm:px-4 sm:text-sm">
                {eyebrow}
              </div>
            )}

            {title && (
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base lg:text-lg">
                {description}
              </p>
            )}

          </div>

          <div className="py-10 text-center text-muted-foreground">
            {language === "en"
              ? "Loading news..."
              : "Memuat berita..."}
          </div>

        </div>
      </section>
    );
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <section className="py-14 sm:py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-10 max-w-3xl sm:mb-14 md:mb-16">

          {eyebrow && (
            <div className="mb-4 inline-flex rounded-full bg-accent px-3 py-2 text-xs font-semibold text-primary sm:px-4 sm:text-sm">
              {eyebrow}
            </div>
          )}

          {title && (
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base lg:text-lg">
              {description}
            </p>
          )}

        </div>

        {/* NO ARTICLE SELECTED */}

        {selectedArticleIds.length === 0 && (
          <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
            <p className="text-muted-foreground">
              {language === "en"
                ? "No articles selected to display."
                : "Belum ada artikel yang dipilih untuk ditampilkan."}
            </p>
          </div>
        )}

        {/* ARTICLE NOT FOUND */}

        {selectedArticleIds.length > 0 &&
          articles.length === 0 && (
            <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
              <p className="text-muted-foreground">
                {language === "en"
                  ? "Selected articles were not found."
                  : "Artikel yang dipilih tidak ditemukan."}
              </p>
            </div>
          )}

        {/* NEWS GRID */}

        {articles.length > 0 && (
          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              sm:gap-6
              lg:grid-cols-3
              lg:gap-8
            "
          >
            {articles.map(
              (article: any) => {

                const articleTitle =
                  getRenderedText(
                    article?.title
                  ) ||
                  getRenderedText(
                    article?.acf?.title
                  ) ||
                  getRenderedText(
                    article?.acf?.judul
                  ) ||
                  "Untitled";

                const image =
                  article?.resolvedImage ||
                  "/placeholder.png";

                const category =
                  getCategoryName(
                    article
                  );

                const publishedInfo =
                  getPublishedInfo(
                    article
                  );

                return (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}?lang=${language}`}
                    className="
                      group
                      flex
                      flex-col
                      overflow-hidden
                      rounded-xl
                      border
                      border-border
                      bg-background
                      transition-all
                      duration-300
                      hover:border-primary/50
                      hover:shadow-lg
                    "
                  >

                    {/* IMAGE */}

                    <div
                      className="
                        relative
                        aspect-[16/10]
                        overflow-hidden
                      "
                    >
                      <Image
                        src={image}
                        alt={articleTitle}
                        fill
                        className="
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                        sizes="
                          (max-width:640px) 100vw,
                          (max-width:1024px) 50vw,
                          33vw
                        "
                        unoptimized
                      />

                      <div
                        className="
                          absolute
                          inset-0
                          bg-black/10
                          transition-colors
                          group-hover:bg-black/25
                        "
                      />
                    </div>

                    {/* BODY */}

                    <div
                      className="
                        flex
                        flex-1
                        flex-col
                        p-4
                        sm:p-5
                        lg:p-6
                      "
                    >

                      {/* CATEGORY */}

                      {category && (
                        <div
                          className="
                            mb-2
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-primary
                            sm:text-xs
                          "
                        >
                          {category}
                        </div>
                      )}

                      {/* TITLE */}

                      <h3
                        className="
                          mb-3
                          line-clamp-2
                          text-base
                          font-semibold
                          leading-snug
                          transition-colors
                          group-hover:text-primary
                          sm:text-lg
                        "
                      >
                        {articleTitle}
                      </h3>

                      {/* PUBLISHED */}

                      <div
                        className="
                          mt-auto
                          text-xs
                          text-muted-foreground
                        "
                      >
                        {publishedInfo}
                      </div>

                    </div>

                  </Link>
                );
              }
            )}
          </div>
        )}

      </div>
    </section>
  );
}