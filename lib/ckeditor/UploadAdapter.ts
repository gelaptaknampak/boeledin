export default class UploadAdapter {
  loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  async upload() {
    const file = await this.loader.file;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/wordpress/media", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload gagal");
    }

    const media = await res.json();

    return {
      default: media.source_url,
    };
  }

  abort() {}
}
