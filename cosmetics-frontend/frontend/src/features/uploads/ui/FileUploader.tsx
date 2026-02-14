// src/features/uploads/ui/FileUploader.tsx

import React, { useState } from "react";
import { useUploads } from "../hooks/useUploads";
import  Button  from "@/shared/ui/Button";

export const FileUploader: React.FC = () => {
  const { upload, loading } = useUploads();
  const [file, setFile] = useState<File | null>(null);

  const onUpload = async () => {
    if (!file) return;
    await upload(file);
    setFile(null);
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="text-white"
      />
      <Button onClick={onUpload} disabled={!file || loading}>
        {loading ? "Завантаження..." : "Завантажити"}
      </Button>
    </div>
  );
};
