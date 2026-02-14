// src/features/uploads/pages/UploadsPage.tsx

import React, { useEffect } from "react";
import { useUploads } from "../hooks/useUploads";
import { UploadButton } from "../ui/UploadButton";
import  Button  from "@/shared/ui/Button";

export const UploadsPage: React.FC = () => {
  const { files, fetchFiles, deleteFile, renameFile } = useUploads();

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 classend-column="text-3xl font-bold">Керування файлами</h1>
        <UploadButton />
      </div>

      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.name}
            className="flex items-center justify-between bg-neutral-800 px-4 py-3 rounded-lg"
          >
            <div>
              <p className="font-semibold">{file.name}</p>
              <a
                href={file.url}
                className="text-amber-400 text-sm"
                target="_blank"
              >
                Переглянути
              </a>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  const newName = prompt("Нова назва:", file.name);
                  if (newName && newName !== file.name) {
                    renameFile({ oldName: file.name, newName });
                  }
                }}
              >
                Перейменувати
              </Button>

              <Button
                size="sm"
                variant="danger"
                onClick={() => deleteFile(file.name)}
              >
                Видалити
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
