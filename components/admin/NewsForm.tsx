"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import UploadPlugin from "@/lib/ckeditor/UploadPlugin";
import {
    ImageUpload,
} from "ckeditor5";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  Table,
  TableToolbar,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageResize,
  BlockQuote,
  CodeBlock,
  Autoformat,
  Alignment,
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

  categories: number[];

  tags: number[];

  featured_media: number | File | null;

  featured_media_url: string;
}

export default function NewsForm({ mode, postId }: NewsFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const [tags, setTags] = useState<Tag[]>([]);

  const [form, setForm] = useState<NewsFormData>({
    title: "",
    excerpt: "",
    content: "",

    status: "publish",

    categories: [],

    tags: [],

    featured_media: null,

    featured_media_url: "",
  });

  async function fetchCategories() {
    try {
      const res = await fetch("/api/wordpress/post-categories");

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
      const res = await fetch("/api/wordpress/post-tags");

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

      const res = await fetch(`/api/wordpress/posts/${postId}?_embed`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error();

      const post = await res.json();

      console.log(post);

      setForm({
        title: post.title?.rendered ?? "",

        excerpt: post.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim() ?? "",

        content: post.content?.rendered ?? "",

        status: post.status,

        categories: post.categories ?? [],

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
  }, []);

  useEffect(() => {
    if (mode === "edit") {
      fetchPost();
    }
  }, [mode, postId]);

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

        categories: form.categories,

        tags: form.tags,
      };

      const url =
        mode === "create"
          ? "/api/wordpress/posts"
          : `/api/wordpress/posts/${postId}`;

      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
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

      router.push("/admin/news");

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

              Link,

              List,

              Table,
              TableToolbar,

              Image,
              ImageToolbar,
              ImageCaption,
              ImageResize,
              ImageUpload,

              BlockQuote,

              CodeBlock,

              Autoformat,
              Alignment,
            ],

            extraPlugins: [UploadPlugin],

            toolbar: [
              "undo",
              "redo",

              "|",

              "heading",

              "|",

              "bold",
              "italic",
              "underline",

              "|",

              "alignment",

              "|",

              "link",

              "|",

              "bulletedList",
              "numberedList",

              "|",

              "blockQuote",

              "|",

              "insertTable",

              "|",

              "uploadImage",

              "|",

              "codeBlock",

              "|",

              "uploadImage",
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
          value={form.categories[0] ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              categories: [Number(e.target.value)],
            }))
          }
          className="w-full rounded-lg border px-4 py-3"
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
          onClick={() => router.back()}
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
