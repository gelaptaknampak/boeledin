"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import UploadPlugin from "@/lib/ckeditor/UploadPlugin";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  FontSize,
  FontFamily,
  FontColor,
  FontBackgroundColor,
  Highlight,
  Link,
  List,
  ListProperties,
  TodoList,
  Alignment,
  Indent,
  IndentBlock,
  BlockQuote,
  CodeBlock,
  HorizontalLine,
  Table,
  TableToolbar,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageUpload,
  ImageBlock,
  ImageInline,
  MediaEmbed,
  Autoformat,
  HtmlEmbed,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

interface NewsFormProps {
  mode: "create" | "edit";
  postId?: number;
}

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface NewsFormData {
  title: string;
  excerpt: string;
  content: string;

  status: "publish" | "draft";

  kategori: number[];

  tags: number[];

  featured_media: number | File | null;

  featured_media_url: string;
}

export default function NewsForm({ mode, postId }: NewsFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "id";
  const returnUrl = `/admin/news?lang=${lang}`;

  // Template HTML untuk video Google Drive
  const googleDriveVideoTemplate = `<iframe
    src="isi dengan link gdrive open akses"
    width="100%"
    height="400"
    allowfullscreen>
  </iframe>`;

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const [tags, setTags] = useState<Tag[]>([]);

  const [form, setForm] = useState<NewsFormData>({
    title: "",
    excerpt: "",
    content: "",

    status: "publish",

    kategori: [],

    tags: [],

    featured_media: null,

    featured_media_url: "",
  });

  async function fetchCategories() {
    try {
      const res = await fetch(`/api/wordpress/post-categories?lang=${lang}`);

      if (!res.ok) throw new Error();

      const data = await res.json();

      setCategories(data);
    } catch (err) {
      console.error(err);

      toast.error("Gagal mengambil kategori");
    }
  }

  async function fetchTags() {
    try {
      const res = await fetch(`/api/wordpress/post-tags?lang=${lang}`);

      if (!res.ok) throw new Error();

      const data = await res.json();

      setTags(data);
    } catch (err) {
      console.error(err);

      toast.error("Gagal mengambil tag");
    }
  }

  async function fetchPost() {
    if (!postId) return;

    try {
      setLoading(true);

      const res = await fetch(
        `/api/wordpress/posts/${postId}?_embed&lang=${lang}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) throw new Error();

      const post = await res.json();

      console.log(post);

      setForm({
        title: post.title?.rendered ?? "",

        excerpt: post.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim() ?? "",

        content: post.content?.rendered ?? "",

        status: post.status,

        kategori: post.kategori ?? [],

        tags: post.tags ?? [],

        featured_media:
          post.featured_media && post.featured_media !== 0
            ? post.featured_media
            : null,

        featured_media_url:
          post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "",
      });
    } catch (err) {
      console.error(err);

      toast.error("Gagal mengambil berita");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();

    fetchTags();
  }, [lang]);

  useEffect(() => {
    if (mode === "edit" && postId) {
      fetchPost();
    }
  }, [mode, postId, lang]);

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setForm((prev) => ({
      ...prev,
      categories: [Number(e.target.value)],
    }));
  }

  function handleTagChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const values = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value),
    );

    setForm((prev) => ({
      ...prev,
      tags: values,
    }));
  }

  function toggleTag(id: number) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(id)
        ? prev.tags.filter((t) => t !== id)
        : [...prev.tags, id],
    }));
  }

  // ===============================
  // Upload Featured Image
  // ===============================

  async function uploadMedia(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const res = await fetch("/api/wordpress/media", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload gambar gagal");
    }

    return await res.json();
  }

  // ===============================
  // Handle Image Change
  // ===============================

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      featured_media: file,
      featured_media_url: URL.createObjectURL(file),
    }));
  }

  // ===============================
  // Handle Submit
  // ===============================

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      let featuredMedia = form.featured_media;

      if (featuredMedia instanceof File) {
        const media = await uploadMedia(featuredMedia);

        featuredMedia = media.id;
      }

      const payload = {
        title: form.title,

        excerpt: form.excerpt,

        content: form.content,

        status: form.status,

        featured_media: featuredMedia,

        kategori: form.kategori,

        tags: form.tags,
      };

      const url =
        mode === "create"
          ? "/api/wordpress/posts"
          : `/api/wordpress/posts/${postId}`;

      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(`${url}?lang=${lang}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 401) {
        toast.error("Silakan login kembali.");

        router.push("/admin/login");

        return;
      }

      if (!res.ok) {
        toast.error(data.message ?? "Terjadi kesalahan.");

        return;
      }

      toast.success(
        mode === "create"
          ? "Berita berhasil dibuat."
          : "Berita berhasil diperbarui.",
      );

      router.push(returnUrl);

      router.refresh();
    } catch (err) {
      console.error(err);

      toast.error("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {mode === "create" ? "Tambah Berita" : "Edit Berita"}
        </h1>

        <p className="text-muted-foreground mt-2">
          Semua berita akan langsung tersimpan ke WordPress Post.
        </p>
      </div>

      {/* ========================= */}
      {/* Judul */}
      {/* ========================= */}

      <div>
        <label className="block mb-2 font-semibold">Judul Berita</label>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleInputChange}
          className="w-full rounded-lg border px-4 py-3"
          placeholder="Masukkan judul berita..."
        />
      </div>

      {/* ========================= */}
      {/* Ringkasan */}
      {/* ========================= */}

      <div>
        <label className="block mb-2 font-semibold">Ringkasan</label>

        <textarea
          rows={4}
          name="excerpt"
          value={form.excerpt}
          onChange={handleInputChange}
          className="w-full rounded-lg border px-4 py-3"
          placeholder="Ringkasan berita..."
        />
      </div>

      {/* ========================= */}
      {/* Isi */}
      {/* ========================= */}

      <div>
        <label className="block mb-2 font-semibold">Isi Berita</label>
        <CKEditor
          editor={ClassicEditor}
          data={form.content}
          onReady={(editor) => {
            const htmlEmbedCommand = editor.commands.get("htmlEmbed");

            if (htmlEmbedCommand) {
              htmlEmbedCommand.on(
                "execute",
                (event, args) => {
                  // Jika HTML Embed baru dibuat,
                  // masukkan template Google Drive secara otomatis.
                  if (!args[0]) {
                    args[0] = googleDriveVideoTemplate;
                  }
                },
                { priority: "high" },
              );
            }
          }}
          onChange={(_, editor) => {
            setForm((prev) => ({
              ...prev,
              content: editor.getData(),
            }));
          }}
          config={{
            licenseKey: "GPL",

            plugins: [
              Essentials,

              Paragraph,
              Heading,

              Bold,
              Italic,
              Underline,

              FontSize,
              FontFamily,
              FontColor,
              FontBackgroundColor,

              Highlight,

              Link,

              List,
              ListProperties,
              TodoList,

              Alignment,

              Indent,
              IndentBlock,

              BlockQuote,

              CodeBlock,

              HorizontalLine,

              Table,
              TableToolbar,

              Image,
              ImageToolbar,
              ImageCaption,
              ImageResize,
              ImageStyle,
              ImageUpload,
              ImageBlock,
              ImageInline,

              MediaEmbed,

              Autoformat,
              HtmlEmbed,
            ],

            heading: {
              options: [
                {
                  model: "paragraph",
                  title: "Paragraph",
                  class: "ck-heading_paragraph",
                },
                {
                  model: "heading1",
                  view: "h1",
                  title: "Heading 1",
                  class: "ck-heading_heading1",
                },
                {
                  model: "heading2",
                  view: "h2",
                  title: "Heading 2",
                  class: "ck-heading_heading2",
                },
                {
                  model: "heading3",
                  view: "h3",
                  title: "Heading 3",
                  class: "ck-heading_heading3",
                },
              ],
            },

            fontSize: {
              options: [12, 14, 16, 18, 20, 24, 28, 32, 40],
              supportAllValues: true,
            },

            fontFamily: {
              supportAllValues: true,
            },

            highlight: {
              options: [
                {
                  model: "yellowMarker",
                  class: "marker-yellow",
                  title: "Yellow Marker",
                  color: "#fdfd77",
                  type: "marker",
                },
                {
                  model: "greenMarker",
                  class: "marker-green",
                  title: "Green Marker",
                  color: "#63f963",
                  type: "marker",
                },
                {
                  model: "pinkMarker",
                  class: "marker-pink",
                  title: "Pink Marker",
                  color: "#fc7999",
                  type: "marker",
                },
                {
                  model: "redPen",
                  class: "pen-red",
                  title: "Red Pen",
                  color: "#e71313",
                  type: "pen",
                },
                {
                  model: "greenPen",
                  class: "pen-green",
                  title: "Green Pen",
                  color: "#128a12",
                  type: "pen",
                },
              ],
            },

            image: {
              toolbar: [
                "imageStyle:inline",

                "imageStyle:block",

                "imageStyle:side",

                "imageStyle:alignLeft",

                "imageStyle:alignCenter",

                "imageStyle:alignRight",

                "|",

                "toggleImageCaption",

                "|",

                "resizeImage",
              ],
            },

            table: {
              contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
            },

            mediaEmbed: {
              previewsInData: true,
            },

            indentBlock: {
              offset: 1,
              unit: "em",
            },

            extraPlugins: [UploadPlugin],

            toolbar: [
              "undo",
              "redo",

              "|",

              "heading",

              "|",

              "fontFamily",
              "fontSize",

              "|",

              "fontColor",
              "fontBackgroundColor",

              "|",

              "bold",
              "italic",
              "underline",

              "|",

              "highlight",

              "|",

              "alignment",

              "|",

              "outdent",
              "indent",

              "|",

              "link",

              "|",

              "bulletedList",
              "numberedList",
              "todoList",

              "|",

              "insertTable",

              "|",

              "uploadImage",

              "mediaEmbed",

              "|",

              "horizontalLine",

              "|",

              "blockQuote",

              "|",

              "codeBlock",

              "|",

              "htmlEmbed",
            ],
          }}
        />
      </div>

      {/* ========================= */}
      {/* Kategori */}
      {/* ========================= */}

      <div>
        <label className="block mb-2 font-semibold">Kategori</label>

        <select
          value={form.kategori[0] ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              kategori: [Number(e.target.value)],
            }))
          }
          className="w-full rounded-lg border px-4 py-3 bg-white text-black"
        >
          <option value={0}>Pilih kategori</option>

          {categories.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* ========================= */}
      {/* Tags */}
      {/* ========================= */}

      <div>
        <label className="block mb-3 font-semibold">Tags</label>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tags.map((tag: any) => (
            <label
              key={tag.id}
              className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={form.tags.includes(tag.id)}
                onChange={() => toggleTag(tag.id)}
              />

              <span>{tag.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ========================= */}
      {/* Status */}
      {/* ========================= */}

      <div>
        <label className="block mb-2 font-semibold">Status</label>

        <select
          value={form.status}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              status: e.target.value as "publish" | "draft",
            }))
          }
          className="w-full rounded-lg border px-4 py-3"
        >
          <option value="publish">Publish</option>

          <option value="draft">Draft</option>
        </select>
      </div>

      {/* ========================= */}
      {/* Featured Image */}
      {/* ========================= */}

      <div>
        <label className="block mb-3 font-semibold">Featured Image</label>

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {form.featured_media_url && (
          <img
            src={form.featured_media_url}
            alt=""
            className="mt-4 rounded-lg border w-80"
          />
        )}
      </div>

      {/* ========================= */}
      {/* Tombol */}
      {/* ========================= */}

      <div className="flex justify-end gap-3 pt-6">
        <button
          type="button"
          onClick={() => router.push(returnUrl)}
          className="px-6 py-3 rounded-lg border"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold"
        >
          {loading
            ? "Menyimpan..."
            : mode === "create"
              ? "Simpan Berita"
              : "Update Berita"}
        </button>
      </div>
    </form>
  );
}
