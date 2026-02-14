import { api } from "@/core/api/axios";

export type UploadItem = {
  name: string;
  url: string;
  size?: number;
  createdAt?: string;
};

type ListResponse = { files: UploadItem[] };

function safeList(data: any): UploadItem[] {
  // бекенд: { files: [...] }
  if (data && Array.isArray(data.files)) return data.files;
  // раптом десь повернули масив
  if (Array.isArray(data)) return data;
  return [];
}

export const uploadsApi = {
  // ✅ GET /api/upload (admin) -> { files: [...] }
  async listAll(): Promise<ListResponse> {
    const { data } = await api.get("/api/upload", { withCredentials: true });
    return { files: safeList(data) };
  },

  // ✅ GET /api/upload/products (admin) -> { files: [...] }
  async listProductImages(): Promise<ListResponse> {
    const { data } = await api.get("/api/upload/products", { withCredentials: true });
    return { files: safeList(data) };
  },

  // ✅ POST /api/upload/file (auth)
  async uploadFile(file: File): Promise<any> {
    const fd = new FormData();
    fd.append("file", file);

    const { data } = await api.post("/api/upload/file", fd, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return data;
  },

  // ✅ DELETE /api/upload/:name (admin)
  async deleteFile(name: string): Promise<any> {
    const { data } = await api.delete(`/api/upload/${encodeURIComponent(name)}`, {
      withCredentials: true,
    });
    return data;
  },

  // ✅ PUT /api/upload/rename (admin)
  async renameFile(payload: { oldName: string; newName: string }): Promise<any> {
    const { data } = await api.put("/api/upload/rename", payload, {
      withCredentials: true,
    });
    return data;
  },

  // ✅ POST /api/upload/products (admin) -> { urls: [...] }
  async uploadProductImages(files: File[]): Promise<{ urls: string[] }> {
    const fd = new FormData();
    files.forEach((f) => fd.append("images", f));

    const { data } = await api.post("/api/upload/products", fd, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    return { urls: Array.isArray(data?.urls) ? data.urls : [] };
  },

  // ✅ DELETE /api/upload/by-url (admin)
  async deleteProductImageByUrl(url: string): Promise<any> {
    const { data } = await api.delete("/api/upload/by-url", {
      data: { url },
      withCredentials: true,
    });
    return data;
  },
};

// ✅ робимо стабільний експорт, який ти імпортуєш всюди
export const UploadsApi = uploadsApi;
