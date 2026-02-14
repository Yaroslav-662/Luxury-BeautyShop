// src/admin/api/upload.api.ts
import { api } from "@/core/api/axios";

export type UploadFileResponse = {
  message: string;
  url: string;
  path: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
};

export type UploadProductImagesResponse = {
  message: string;
  urls: string[];
  files: Array<{
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    path: string;
    url: string;
  }>;
};

export async function adminUploadGenericFile(file: File) {
  const form = new FormData();
  form.append("file", file);

  const { data } = await api.post<UploadFileResponse>(
    "/api/upload/file",
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return data;
}

export async function adminUploadProductImages(files: File[]) {
  const form = new FormData();
  files.forEach((f) => form.append("images", f));

  const { data } = await api.post<UploadProductImagesResponse>(
    "/api/upload/products",
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return data;
}

export async function adminGetAllUploads() {
  const { data } = await api.get<{
    files: Array<{ name: string; url: string; size: number; createdAt: string }>;
  }>("/api/upload");

  return data.files;
}

export async function adminDeleteUpload(name: string) {
  const { data } = await api.delete(
    `/api/upload/${encodeURIComponent(name)}`
  );
  return data;
}

export async function adminDeleteProductByUrl(url: string) {
  const { data } = await api.delete("/api/upload/by-url", {
    data: { url },
  });
  return data;
}

export async function adminRenameUpload(oldName: string, newName: string) {
  const { data } = await api.put("/api/upload/rename", {
    oldName,
    newName,
  });
  return data;
}
