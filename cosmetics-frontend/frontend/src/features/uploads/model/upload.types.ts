// src/features/uploads/model/upload.types.ts

export interface UploadedFile {
  name: string;
  url: string;
  size?: number;
  createdAt?: string;
}

export interface RenamePayload {
  oldName: string;
  newName: string;
}
