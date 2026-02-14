// src/features/uploads/hooks/useUploads.ts
import { create } from "zustand";
import { UploadsApi } from "@/features/uploads/api/uploads.api";
import type { UploadedFile, RenamePayload } from "../model/upload.types";

interface UploadsState {
  files: UploadedFile[];
  loading: boolean;
  error: string | null;

  fetchFiles: () => Promise<void>;
  upload: (file: File) => Promise<boolean>;
  deleteFile: (name: string) => Promise<boolean>;
  renameFile: (payload: RenamePayload) => Promise<boolean>;
}

export const useUploads = create<UploadsState>((set, get) => ({
  files: [],
  loading: false,
  error: null,

  fetchFiles: async () => {
    set({ loading: true, error: null });
    try {
      const res = await UploadsApi.listAll(); // ✅ було getFiles()
      set({ files: res.files as unknown as UploadedFile[], loading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Помилка завантаження файлів.",
        loading: false,
      });
    }
  },

  upload: async (file: File) => {
    try {
      const uploaded = await UploadsApi.uploadFile(file);
      // uploadFile повертає обʼєкт, але тип може відрізнятись — додаємо як є
      set({ files: [...get().files, uploaded] as any });
      return true;
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Файл не вдалося завантажити.",
      });
      return false;
    }
  },

  deleteFile: async (name: string) => {
    try {
      await UploadsApi.deleteFile(name);
      set({ files: get().files.filter((f) => f.name !== name) });
      return true;
    } catch {
      return false;
    }
  },

  renameFile: async (payload: RenamePayload) => {
    try {
      await UploadsApi.renameFile(payload);
      const updated = get().files.map((f) =>
        f.name === payload.oldName ? { ...f, name: payload.newName } : f
      );
      set({ files: updated });
      return true;
    } catch {
      return false;
    }
  },
}));
