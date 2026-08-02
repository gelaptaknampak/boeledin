import UploadAdapter from "./UploadAdapter";

export default function UploadPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (
    loader: any
  ) => {
    return new UploadAdapter(loader);
  };
}